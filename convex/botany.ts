import { query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { Plant } from "./schema";
import { mutation, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

export type SearchRule = {
  field: string;
  operator: string;
  value: string | number;
  secondValue?: number;
};

type SortableField =
  "scientificName" | "family" | "order" | "class" | "genus" | "species" | "country" | "state" | "county" |
  "barCode" | "accessionNumber" | "longitude1" | "latitude1" | "minElevation" | "maxElevation" |
  "startDateMonth" | "startDateDay" | "startDateYear" | "endDateMonth" | "endDateDay" | "endDateYear" |
  "collectors" | "continent" | "determinedDate" | "determiner" | "habitat" | "herbarium" |
  "localityName" | "phenology" | "preparations" | "town" | "typeStatusName" |
  "verbatimDate" | "timestampModified" | "originalElevationUnit" | "collectorNumber" | 
  "localityContinued" | "redactLocalityCo" | "redactLocalityTaxon" | "redactLocalityAcceptedTaxon";

export const getPlantById = query({
  args: { id: v.id("botany") },
  handler: async (ctx, args) => {
    const plant = await ctx.db.get(args.id);
    return plant;
  },
});

function getSearchId(rules: SearchRule[]): string {
  const sortedRules = [...rules].sort((a, b) => a.field.localeCompare(b.field));
  return JSON.stringify(sortedRules);
}

export const startMaterializingResults = mutation({
  args: {
    rules: v.array(
      v.object({
      field: v.string(),
      operator: v.string(),
      value: v.union(v.string(), v.number()),
      secondValue: v.optional(v.number()),
      })
    ),
    sort: v.object({
      field: v.string(),
      direction: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const searchId = getSearchId(args.rules);
    const oldAccumulations = await ctx.db.query("search_accumulation").withIndex("by_searchId", q => q.eq("searchId", searchId)).collect();
    for (const acc of oldAccumulations) {
      await ctx.db.delete(acc._id);
    }
    
    const existing = await ctx.db.query("search_results").withIndex("by_searchId", q => q.eq("searchId", searchId)).first();
    if (existing && JSON.stringify(existing.sort) === JSON.stringify(args.sort)) {
      return;
    }
    await ctx.db.insert("search_counts", { searchId, total: -1 });
    await ctx.scheduler.runAfter(0, internal.botany._materializeSearchResults, {
      rules: args.rules,
      sort: args.sort,
      searchId,
      cursor: null,
    });
  }
});

export const _materializeSearchResults = internalMutation({
  args: {
    rules: v.array(
      v.object({
        field: v.string(),
        operator: v.string(),
        value: v.union(v.string(), v.number()),
        secondValue: v.optional(v.number()),
      })
    ),
    sort: v.object({
      field: v.string(),
      direction: v.string(),
    }),
    searchId: v.string(),
    cursor: v.union(v.null(), v.string()),
  },
  handler: async (ctx, { rules, sort, searchId, cursor }) => {
    console.log(`[DEBUG startMaterializingResults] searchId=${searchId} rules=${JSON.stringify(rules)}`);
    try {
      const validRules = rules.filter(r => r.value !== undefined && r.value !== null && String(r.value).trim() !== "");
      
      let queryBuilder = ctx.db.query("botany");
      const paginatedResults = await queryBuilder.paginate({ cursor, numItems: 1024 });
      
      const filteredBatch = applyAllFilters(paginatedResults.page, validRules);
      
      let accumulations = await ctx.db.query("search_accumulation").withIndex("by_searchId", q => q.eq("searchId", searchId)).collect();
      
      let accumulation = accumulations.find(a => a.ids.length < 8000);
      if (!accumulation) {
        const newId = await ctx.db.insert("search_accumulation", { searchId, ids: [] });
        const newAccumulation = await ctx.db.get(newId);
        if (!newAccumulation) throw new Error("Failed to create accumulation doc");
        accumulation = newAccumulation;
      }
      
      const newIds = filteredBatch.map(p => p._id).filter(id => !accumulation!.ids.includes(id));
      const updatedIds = [...accumulation.ids, ...newIds];
      
      if (updatedIds.length > 8000) {
        const chunks = [];
        for (let i = 0; i < updatedIds.length; i += 8000) {
          chunks.push(updatedIds.slice(i, i + 8000));
        }
        
        await ctx.db.patch(accumulation._id, { ids: chunks[0] });
        
        for (let i = 1; i < chunks.length; i++) {
          await ctx.db.insert("search_accumulation", { searchId, ids: chunks[i] });
        }
      } else {
        await ctx.db.patch(accumulation._id, { ids: updatedIds });
      }
      
      if (paginatedResults.isDone) {
        await ctx.scheduler.runAfter(0, internal.botany._ultraFastSortResults, {
          searchId,
          sort,
        });
      } else {
        await ctx.scheduler.runAfter(0, internal.botany._materializeSearchResults, {
          rules,
          sort,
          searchId,
          cursor: paginatedResults.continueCursor,
        });
      }
    } catch (error) {
      throw error;
    }
  },
});

export const searchPlants = query({
  args: {
    rules: v.array(
      v.object({
        field: v.string(),
        operator: v.string(),
        value: v.union(v.string(), v.number()),
        secondValue: v.optional(v.number()),
      })
    ),
    sort: v.object({
      field: v.string(),
      direction: v.string(),
    }),
    pagination: v.object({
      pageNumber: v.number(),
      pageSize: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const searchId = getSearchId(args.rules);
    const materialization = await ctx.db
      .query("search_results")
      .withIndex("by_searchId", (q) => q.eq("searchId", searchId))
      .first();
    if (!materialization) {
      return null;
    }
    
    const isUnsorted = !args.sort.field || args.sort.field === "" || args.sort.field === "-";
    if (!isUnsorted && JSON.stringify(materialization.sort) !== JSON.stringify(args.sort)) {
      return null;
    }
    
    let pageIds: Id<"botany">[] = [];
    let allIds: Id<"botany">[] = [];
    if (materialization.hasMultipleChunks) {
      const allChunks = await ctx.db.query("search_result_chunks").withIndex("by_searchId", q => q.eq("searchId", searchId)).collect();
      const sortedChunks = allChunks.sort((a, b) => a.chunkIndex - b.chunkIndex);
      const allIdsRaw = [materialization.results, ...sortedChunks.map(chunk => chunk.results)].flat();
      const seen = new Set();
      allIds = [];
      for (const id of allIdsRaw) {
        if (!seen.has(id)) {
          seen.add(id);
          allIds.push(id);
        }
      }
    } else {
      allIds = materialization.results;
    }
    const total = allIds.length;
    const start = Math.min((args.pagination.pageNumber - 1) * args.pagination.pageSize, total);
    const end = Math.min(start + args.pagination.pageSize, total);
    pageIds = allIds.slice(start, end);
    
    const plants = await Promise.all(pageIds.map((id) => ctx.db.get(id)));
    const plantsById = new Map(plants.filter(Boolean).map(p => [p!._id, p]));
    const sortedPlants = pageIds.map(id => plantsById.get(id)).filter(Boolean);
    
    return { page: sortedPlants };
  },
});

export const getTotal = query({
  args: {
    rules: v.array(
      v.object({
        field: v.string(),
        operator: v.string(),
        value: v.union(v.string(), v.number()),
        secondValue: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const searchId = getSearchId(args.rules);
    const result = await ctx.db.query("search_counts").withIndex("by_searchId", q => q.eq("searchId", searchId)).first();
    return result;
  }
});

function applyAllFilters(documents: Doc<"botany">[], rules: SearchRule[]): Doc<"botany">[] {
  return documents.filter(doc => {
    return rules.every(rule => {
      const fieldValue = doc[rule.field as keyof Doc<"botany">];
      const ruleValue = rule.value;
      
      switch (rule.operator) {
        case "=": {
          if (fieldValue === null || typeof fieldValue === 'undefined' || (typeof fieldValue === 'string' && fieldValue.trim() === '')) return false;
          const num = Number(fieldValue);
          const ruleNum = Number(ruleValue);
          if (typeof fieldValue === 'number' || typeof ruleValue === 'number') {
            if (isNaN(num) || isNaN(ruleNum)) return false;
            return num === ruleNum;
          }
          return fieldValue === ruleValue;
        }
        case "!=": {
          if (fieldValue === null || typeof fieldValue === 'undefined' || (typeof fieldValue === 'string' && fieldValue.trim() === '')) return false;
          const num = Number(fieldValue);
          const ruleNum = Number(ruleValue);
          if (typeof fieldValue === 'number' || typeof ruleValue === 'number') {
            if (isNaN(num) || isNaN(ruleNum)) return false;
            return num !== ruleNum;
          }
          return String(fieldValue).toLowerCase() !== String(ruleValue).toLowerCase();
        }
        case ">": {
          if (fieldValue === null || typeof fieldValue === 'undefined' || (typeof fieldValue === 'string' && fieldValue.trim() === '')) return false;
          const num = Number(fieldValue);
          const ruleNum = Number(ruleValue);
          if (isNaN(num) || isNaN(ruleNum)) return false;
          return num > ruleNum;
        }
        case ">=": {
          if (fieldValue === null || typeof fieldValue === 'undefined' || (typeof fieldValue === 'string' && fieldValue.trim() === '')) return false;
          const num = Number(fieldValue);
          const ruleNum = Number(ruleValue);
          if (isNaN(num) || isNaN(ruleNum)) return false;
          return num >= ruleNum;
        }
        case "<": {
          if (fieldValue === null || typeof fieldValue === 'undefined' || (typeof fieldValue === 'string' && fieldValue.trim() === '')) return false;
          const num = Number(fieldValue);
          const ruleNum = Number(ruleValue);
          if (isNaN(num) || isNaN(ruleNum)) return false;
          return num < ruleNum;
        }
        case "<=": {
          if (fieldValue === null || typeof fieldValue === 'undefined' || (typeof fieldValue === 'string' && fieldValue.trim() === '')) return false;
          const num = Number(fieldValue);
          const ruleNum = Number(ruleValue);
          if (isNaN(num) || isNaN(ruleNum)) return false;
          return num <= ruleNum;
        }
        case "before": {
          if (fieldValue === null || typeof fieldValue === 'undefined' || (typeof fieldValue === 'string' && fieldValue.trim() === '')) return false;
          const num = Number(fieldValue);
          const ruleNum = Number(ruleValue);
          if (isNaN(num) || isNaN(ruleNum)) return false;
          return num < ruleNum;
        }
        case "after": {
          if (fieldValue === null || typeof fieldValue === 'undefined' || (typeof fieldValue === 'string' && fieldValue.trim() === '')) return false;
          const num = Number(fieldValue);
          const ruleNum = Number(ruleValue);
          if (isNaN(num) || isNaN(ruleNum)) return false;
          return num > ruleNum;
        }
        case "between": {
          if (fieldValue === null || typeof fieldValue === 'undefined' || (typeof fieldValue === 'string' && fieldValue.trim() === '')) return false;
          const num = Number(fieldValue);
          const min = Number(ruleValue);
          const max = Number(rule.secondValue);
          if (isNaN(num) || isNaN(min) || isNaN(max)) return false;
          const result = num >= min && num <= max;
          if (rule.field === "latitude1" || rule.field === "longitude1") {
            console.log(`[DEBUG between] doc._id=${doc._id} field=${rule.field} value=${fieldValue} num=${num} min=${min} max=${max} result=${result}`);
          }
          return result;
        }
        case "not_between": {
          if (fieldValue === null || typeof fieldValue === 'undefined' || (typeof fieldValue === 'string' && fieldValue.trim() === '')) return false;
          const num = Number(fieldValue);
          const min = Number(rule.value);
          const max = Number(rule.secondValue);
          if (isNaN(num) || isNaN(min) || isNaN(max)) return false;
          return num < min || num > max;
        }
        case "contains":
          return String(fieldValue).toLowerCase().includes(String(ruleValue).toLowerCase());
        case "starts_with":
          return String(fieldValue).toLowerCase().startsWith(String(ruleValue).toLowerCase());
        case "ends_with":
          return String(fieldValue).toLowerCase().endsWith(String(ruleValue).toLowerCase());
        case "basic_exact": {
          // For basic exact match: all terms must be found in any of the search fields (case-insensitive)
          const terms = String(ruleValue).split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0);
          if (terms.length === 0) return true;
          const searchFields = [
            "scientificName", "family", "genus", "species", "country", "state", 
            "county", "collectors", "herbarium", "habitat", "localityName", "town",
            "order", "class", "determiner", "continent", "typeStatusName", "preparations",
            "determinedDate", "verbatimDate", "collectorNumber", "localityContinued",
            "originalElevationUnit", "notes", "phenology", "redactLocalityCo",
            "redactLocalityTaxon", "redactLocalityAcceptedTaxon", "timestampModified",
            "longitude1", "latitude1", "minElevation", "maxElevation", "barCode", "accessionNumber",
            "startDateMonth", "startDateDay", "startDateYear", "endDateMonth", "endDateDay", "endDateYear"
          ];
          // Match if every term is found in any field (case-insensitive)
          return terms.every(term =>
            searchFields.some(field => {
              const fieldVal = String(doc[field as keyof Doc<"botany">] || "").toLowerCase();
              return fieldVal.includes(term);
            })
          );
        }
        case "basic_any":
          // For basic match any: at least one term must be found in the same record
          const anyTerms = String(ruleValue).split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0);
          if (anyTerms.length === 0) return true;
          
          const anySearchFields = [
            "scientificName", "family", "genus", "species", "country", "state", 
            "county", "collectors", "herbarium", "habitat", "localityName", "town",
            "order", "class", "determiner", "continent", "typeStatusName", "preparations",
            "determinedDate", "verbatimDate", "collectorNumber", "localityContinued",
            "originalElevationUnit", "notes", "phenology", "redactLocalityCo",
            "redactLocalityTaxon", "redactLocalityAcceptedTaxon", "timestampModified",
            "longitude1", "latitude1", "minElevation", "maxElevation", "barCode", "accessionNumber",
            "startDateMonth", "startDateDay", "startDateYear", "endDateMonth", "endDateDay", "endDateYear"
          ];
          
          // Check if any term is found in any of the search fields
          return anyTerms.some(term => 
            anySearchFields.some(field => {
              const fieldVal = String(doc[field as keyof Doc<"botany">] || "").toLowerCase();
              return fieldVal.includes(term);
            })
          );
        case "has_valid_image": {
          const img = doc.img;
          if (!img || img.length === 0) {
            if (doc.country && doc.country.toLowerCase() === "brazil") {
              console.log("DEBUG: Brazil record with empty img:", doc);
            }
            return false;
          }
          const regex = /[0-9a-fA-F-]{8,}\.(jpg|jpeg)/i;
          const result = regex.test(img);
          if (doc.country && doc.country.toLowerCase() === "brazil") {
            console.log("DEBUG: Brazil img:", img, "Regex result:", result);
          }
          return result;
        }
        case "has_valid_coords":
          // Check if the plant has valid latitude and longitude coordinates
          const lat = doc.latitude1;
          const lng = doc.longitude1;
          
          if (!lat || !lng) return false;
          
          // Check if they are valid numbers and not empty strings
          const latNum = parseFloat(String(lat));
          const lngNum = parseFloat(String(lng));
          
          return !isNaN(latNum) && !isNaN(lngNum) && latNum !== 0 && lngNum !== 0;
        default:
          return true;
      }
    });
  });
}

export const _ultraFastSortResults = internalMutation({
  args: {
    searchId: v.string(),
    sort: v.object({
      field: v.string(),
      direction: v.string(),
    }),
  },
  handler: async (ctx, { searchId, sort }) => {
    if (!sort.field || sort.field === "" || sort.field === "-") {
      const accumulations = await ctx.db.query("search_accumulation").withIndex("by_searchId", q => q.eq("searchId", searchId)).collect();
      const allIds = accumulations.flatMap(a => a.ids);
      const uniqueIds: Id<"botany">[] = Array.from(new Set(allIds));
      await cleanupOldChunks(ctx, searchId);
      const FINAL_CHUNK_SIZE = 8000;
      const finalChunks: Id<"botany">[][] = [];
      for (let i = 0; i < uniqueIds.length; i += FINAL_CHUNK_SIZE) {
        finalChunks.push(uniqueIds.slice(i, i + FINAL_CHUNK_SIZE));
      }
      const existingResult = await ctx.db.query("search_results").withIndex("by_searchId", q => q.eq("searchId", searchId)).first();
      if (existingResult) {
        await ctx.db.patch(existingResult._id, {
          results: finalChunks.length > 0 ? finalChunks[0] : [],
          sort,
          totalChunks: finalChunks.length,
          hasMultipleChunks: finalChunks.length > 1
        });
        for (let i = 1; i < finalChunks.length; i++) {
          await ctx.db.insert("search_result_chunks", {
            searchId,
            chunkIndex: i,
            results: finalChunks[i]
          });
        }
      } else {
        await ctx.db.insert("search_results", {
          searchId,
          results: finalChunks.length > 0 ? finalChunks[0] : [],
          sort,
          totalChunks: finalChunks.length,
          hasMultipleChunks: finalChunks.length > 1
        });
        for (let i = 1; i < finalChunks.length; i++) {
          await ctx.db.insert("search_result_chunks", {
            searchId,
            chunkIndex: i,
            results: finalChunks[i]
          });
        }
      }
      const existingCount = await ctx.db.query("search_counts").withIndex("by_searchId", q => q.eq("searchId", searchId)).first();
      if (existingCount) {
        await ctx.db.patch(existingCount._id, { total: uniqueIds.length });
      }
      for (const acc of accumulations) {
        await ctx.db.delete(acc._id);
      }
      return;
    }
    
    const accumulations = await ctx.db.query("search_accumulation").withIndex("by_searchId", q => q.eq("searchId", searchId)).collect();
    const allIds = accumulations.flatMap(a => a.ids);
    const uniqueIds = Array.from(new Set(allIds));
    
    if (uniqueIds.length <= 500) {
      const docs = await Promise.all(uniqueIds.map(id => ctx.db.get(id)));
      const validDocs = docs.filter(Boolean) as Doc<"botany">[];
      
      const sortedDocs = validDocs.sort((a, b) => {
        const fieldA = (a as any)[sort.field as SortableField];
        const fieldB = (b as any)[sort.field as SortableField];
        
        if (fieldA == null) return 1; if (fieldB == null) return -1;
        if (typeof fieldA === 'number' && typeof fieldB === 'number') return sort.direction === 'asc' ? fieldA - fieldB : fieldB - fieldA;
        const stringA = String(fieldA).toLowerCase();
        const stringB = String(fieldB).toLowerCase();
        if (stringA < stringB) return sort.direction === 'asc' ? -1 : 1;
        if (stringA > stringB) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
      
      const sortedIds = sortedDocs.map(doc => doc._id);
      
      const existingResult = await ctx.db.query("search_results").withIndex("by_searchId", q => q.eq("searchId", searchId)).first();
      if (existingResult) {
        await ctx.db.patch(existingResult._id, { 
          results: sortedIds,
          sort,
          totalChunks: 1,
          hasMultipleChunks: false
        });
      } else {
        await ctx.db.insert("search_results", { 
          searchId, 
          results: sortedIds,
          sort,
          totalChunks: 1,
          hasMultipleChunks: false
        });
      }
      
      const existingCount = await ctx.db.query("search_counts").withIndex("by_searchId", q => q.eq("searchId", searchId)).first();
      if (existingCount) {
        await ctx.db.patch(existingCount._id, { total: sortedIds.length });
      }
      
      for (const acc of accumulations) {
        await ctx.db.delete(acc._id);
      }
      return;
    }
    
    const firstBatchIds = uniqueIds.slice(0, 500);
    const firstBatchDocs = await Promise.all(firstBatchIds.map(id => ctx.db.get(id)));
    const firstBatchValidDocs = firstBatchDocs.filter(Boolean) as Doc<"botany">[];
    
    const firstBatchSortedDocs = firstBatchValidDocs.sort((a, b) => {
      const fieldA = (a as any)[sort.field as SortableField];
      const fieldB = (b as any)[sort.field as SortableField];
      
      if (fieldA == null) return 1; if (fieldB == null) return -1;
      if (typeof fieldA === 'number' && typeof fieldB === 'number') return sort.direction === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      const stringA = String(fieldA).toLowerCase();
      const stringB = String(fieldB).toLowerCase();
      if (stringA < stringB) return sort.direction === 'asc' ? -1 : 1;
      if (stringA > stringB) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    const firstBatchSortedIds = firstBatchSortedDocs.map(doc => doc._id);
    
    const existingResult = await ctx.db.query("search_results").withIndex("by_searchId", q => q.eq("searchId", searchId)).first();
    if (existingResult) {
      await ctx.db.patch(existingResult._id, { 
        results: firstBatchSortedIds,
        sort,
        totalChunks: 1,
        hasMultipleChunks: false
      });
    } else {
      await ctx.db.insert("search_results", { 
        searchId, 
        results: firstBatchSortedIds,
        sort,
        totalChunks: 1,
        hasMultipleChunks: false
      });
    }
    
    const existingCount = await ctx.db.query("search_counts").withIndex("by_searchId", q => q.eq("searchId", searchId)).first();
    if (existingCount) {
      await ctx.db.patch(existingCount._id, { total: uniqueIds.length });
    }
    
    for (const acc of accumulations) {
      await ctx.db.delete(acc._id);
    }
    
    if (uniqueIds.length > 500) {
      const remainingIds = uniqueIds.slice(500);
      const CHUNK_SIZE = 8000;
      
      for (let i = 0; i < remainingIds.length; i += CHUNK_SIZE) {
        const chunk = remainingIds.slice(i, i + CHUNK_SIZE);
        await ctx.db.insert("search_id_chunks", { 
          searchId, 
          chunkIndex: Math.floor(i / CHUNK_SIZE), 
          ids: chunk 
        });
      }
      
      await ctx.scheduler.runAfter(0, internal.botany._processRemainingResultsFromDB, {
        searchId,
        sort,
        startIndex: 500,
        totalRemaining: remainingIds.length,
      });
    }
  },
});

export const _processRemainingResultsFromDB = internalMutation({
  args: {
    searchId: v.string(),
    sort: v.object({
      field: v.string(),
      direction: v.string(),
    }),
    startIndex: v.number(),
    totalRemaining: v.number(),
    batchIndex: v.optional(v.number()),
  },
  handler: async (ctx, { searchId, sort, startIndex, totalRemaining, batchIndex }) => {
    const currentBatchIndex = batchIndex ?? 0;
    const BATCH_SIZE = 300;
    
    const idChunks = await ctx.db.query("search_id_chunks").withIndex("by_searchId", q => q.eq("searchId", searchId)).collect();
    const sortedIdChunks = idChunks.sort((a, b) => a.chunkIndex - b.chunkIndex);
    const allRemainingIds = sortedIdChunks.flatMap(chunk => chunk.ids);
    
    const start = currentBatchIndex * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, allRemainingIds.length);
    const batchIds = allRemainingIds.slice(start, end);
    
    if (batchIds.length === 0) {
      const allSortedChunks = await ctx.db.query("search_sorted_chunks").withIndex("by_searchId", q => q.eq("searchId", searchId)).collect();
      const sortedChunks = allSortedChunks.sort((a, b) => a.chunkIndex - b.chunkIndex);
      const allSortedIds = sortedChunks.flatMap(chunk => chunk.results);
      const finalUniqueIds: Id<"botany">[] = Array.from(new Set(allSortedIds));
      await cleanupOldChunks(ctx, searchId);
      const CHUNK_SIZE = 8000;
      const chunks: Id<"botany">[][] = [];
      for (let i = 0; i < finalUniqueIds.length; i += CHUNK_SIZE) {
        chunks.push(finalUniqueIds.slice(i, i + CHUNK_SIZE));
      }
      for (let i = 0; i < chunks.length; i++) {
        await ctx.db.insert("search_result_chunks", {
          searchId,
          chunkIndex: i + 1,
          results: chunks[i]
        });
      }
      const existingResult = await ctx.db.query("search_results").withIndex("by_searchId", q => q.eq("searchId", searchId)).first();
      if (existingResult) {
        await ctx.db.patch(existingResult._id, { 
          totalChunks: chunks.length + 1,
          hasMultipleChunks: true
        });
      }
      for (const chunk of allSortedChunks) {
        await ctx.db.delete(chunk._id);
      }
      for (const chunk of idChunks) {
        await ctx.db.delete(chunk._id);
      }
      return;
    }
    
    const docs = await Promise.all(batchIds.map(id => ctx.db.get(id)));
    const validDocs = docs.filter(Boolean) as Doc<"botany">[];
    
    const sortedBatch = validDocs.sort((a, b) => {
      const fieldA = (a as any)[sort.field as SortableField];
      const fieldB = (b as any)[sort.field as SortableField];
      
      if (fieldA == null) return 1; if (fieldB == null) return -1;
      if (typeof fieldA === 'number' && typeof fieldB === 'number') return sort.direction === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      const stringA = String(fieldA).toLowerCase();
      const stringB = String(fieldB).toLowerCase();
      if (stringA < stringB) return sort.direction === 'asc' ? -1 : 1;
      if (stringA > stringB) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    const sortedIds = sortedBatch.map(doc => doc._id);
    
    await ctx.db.insert("search_sorted_chunks", { searchId, chunkIndex: currentBatchIndex, results: sortedIds });
    
    await ctx.scheduler.runAfter(0, internal.botany._processRemainingResultsFromDB, {
      searchId,
      sort,
      startIndex,
      totalRemaining,
      batchIndex: currentBatchIndex + 1,
    });
  },
});

async function cleanupOldChunks(ctx: any, searchId: string) {
  const oldChunks = await ctx.db.query("search_result_chunks").withIndex("by_searchId", (q: any) => q.eq("searchId", searchId)).collect();
  for (const chunk of oldChunks) {
    await ctx.db.delete(chunk._id);
  }
}

// List plants in batches for validation script
export const listPlants = query({
  args: { after: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let q;
    if (args.after) {
      q = ctx.db.query("botany").withIndex("by_botanyId", q2 => q2.gt("botanyId", args.after));
    } else {
      q = ctx.db.query("botany").withIndex("by_botanyId");
    }
    // Fetch up to 100 at a time
    return await q.take(100);
  },
});

// Mutation to backfill botanyId in batches
export const backfillBotanyId = mutation({
  args: {
    batchSize: v.optional(v.number()),
    after: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const batchSize = args.batchSize ?? 100;
    let q;
    if (args.after) {
      q = ctx.db.query("botany").withIndex("by_botanyId", q2 => q2.gt("botanyId", args.after));
    } else {
      q = ctx.db.query("botany").withIndex("by_botanyId");
    }
    const batch = await q.take(batchSize);
    for (const plant of batch) {
      if (!plant.botanyId) {
        await ctx.db.patch(plant._id, { botanyId: plant._id });
      }
    }
    return {
      lastId: batch.length > 0 ? batch[batch.length - 1].botanyId : null,
      count: batch.length,
    };
  },
});

export const getBotanyDocumentCount = query({
  args: {},
  handler: async (ctx) => {
    // Count all documents in the botany table
    const docs = await ctx.db.query("botany").collect();
    return { count: docs.length };
  }
});