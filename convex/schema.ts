import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
//use accession number: 640148 to test phenology
//use accession number: 459038 to test redactLocalityTaxon and redactLocalityAcceptedTaxon
export const Plant = {
  cas_id: v.string(),
  accessionNumber: v.union(v.float64(), v.string()),
  barCode: v.union(v.float64(), v.string()),
  scientificName: v.string(),
  endDateMonth: v.union(v.number(), v.string()),
  endDateDay: v.union(v.number(), v.string()),
  endDateYear: v.union(v.number(), v.string()),
  phenology: v.string(),
  startDateMonth: v.union(v.number(), v.string()),
  startDateDay: v.union(v.number(), v.string()),
  startDateYear: v.union(v.number(), v.string()),
  class: v.string(),
  notes: v.string(),
  redactLocalityCo: v.string(),
  collectionObjectAttachments: v.union(v.float64(), v.string()),
  collectors: v.string(),
  continent: v.string(),
  county: v.string(),
  country: v.string(),
  determinedDate: v.string(),
  determiner: v.string(),
  family: v.string(),
  genus: v.string(),
  geoc: v.string(),
  img: v.string(),
  latitude1: v.union(v.float64(), v.string()),
  localityName: v.string(),
  longitude1: v.union(v.float64(), v.string()),
  maxElevation: v.union(v.float64(), v.string()),
  minElevation: v.union(v.float64(), v.string()),
  herbarium: v.string(),
  order: v.string(),
  originalElevationUnit: v.string(),
  preparations: v.string(),
  habitat: v.string(),
  species: v.string(),
  state: v.string(),
  collectorNumber: v.string(),
  specimenDescription: v.union(v.float64(), v.string()),
  localityContinued: v.union(v.float64(), v.string()),
  timestampModified: v.string(),
  town: v.string(),
  typeStatusName: v.string(),
  verbatimDate: v.union(v.float64(), v.string()),
  redactLocalityTaxon: v.string(),
  redactLocalityAcceptedTaxon: v.string(),
  botanyId: v.optional(v.string()),
  // hasWorkingImage: v.optional(v.boolean()), // Removed after migration
};

export default defineSchema({
  ...authTables,
  numbers: defineTable({
    value: v.number(),
  }),
  botany: defineTable(Plant)
    .index("by_botanyId", ["botanyId"])
    .index("by_longitude", ["longitude1"])
    .index("by_latitude", ["latitude1"])
    .index("by_minElevation", ["minElevation"])
    .index("by_maxElevation", ["maxElevation"])
    .index("by_barCode", ["barCode"])
    .index("by_accessionNumber", ["accessionNumber"])
    .index("by_startDateMonth", ["startDateMonth"])
    .index("by_startDateDay", ["startDateDay"])
    .index("by_startDateYear", ["startDateYear"])
    .index("by_endDateMonth", ["endDateMonth"])
    .index("by_endDateDay", ["endDateDay"])
    .index("by_endDateYear", ["endDateYear"])
    .searchIndex("search_country", {
      searchField: "country",
    })
    .searchIndex("search_collectors", {
      searchField: "collectors",
    })
    .searchIndex("search_state", {
      searchField: "state",
    })
    .searchIndex("search_class", {
      searchField: "class",
    })
    .searchIndex("search_order", {
      searchField: "order",
    })
    .searchIndex("search_family", {
      searchField: "family",
    })
    .searchIndex("search_determiner", {
      searchField: "determiner",
    })
    .searchIndex("search_continent", {
      searchField: "continent",
    })
    .searchIndex("search_town", {
      searchField: "town",
    })
    .searchIndex("search_typeStatusName", {
      searchField: "typeStatusName",
    })
    .searchIndex("search_preparations", {
      searchField: "preparations",
    })
    .searchIndex("search_localityName", {
      searchField: "localityName",
    })
    .searchIndex("search_determinedDate", {
      searchField: "determinedDate",
    })
    .searchIndex("search_verbatimDate", {
      searchField: "verbatimDate",
    })
    .searchIndex("search_genus", {
      searchField: "genus",
    })
    .searchIndex("search_herbarium", {
      searchField: "herbarium",
    })
    .searchIndex("search_habitat", {
      searchField: "habitat",
    })
    .searchIndex("search_barCode", {
      searchField: "barCode",
    })
    .searchIndex("search_scientificName", {
      searchField: "scientificName",
    })
    .searchIndex("search_species", {
      searchField: "species",
    })
    .searchIndex("search_county", {
      searchField: "county",
    })
    .searchIndex("search_specimenDescription", {
      searchField: "specimenDescription",
    })
    .searchIndex("search_localityContinued", {
      searchField: "localityContinued",
    })
    .searchIndex("search_originalElevationUnit", {
      searchField: "originalElevationUnit",
    })
    .searchIndex("search_collectorNumber", {
      searchField: "collectorNumber",
    })
    .searchIndex("search_collectionObjectAttachments", {
      searchField: "collectionObjectAttachments",
    })
    .searchIndex("search_notes", {
      searchField: "notes",
    })
    .searchIndex("search_phenology", {
      searchField: "phenology",
    })
    .searchIndex("search_redactLocalityCo", {
      searchField: "redactLocalityCo",
    })
    .searchIndex("search_redactLocalityTaxon", {
      searchField: "redactLocalityTaxon",
    })
    .searchIndex("search_redactLocalityAcceptedTaxon", {
      searchField: "redactLocalityAcceptedTaxon",
    })
    .searchIndex("search_timestampModified", {
      searchField: "timestampModified",
    }),
  search_counts: defineTable({
    searchId: v.string(),
    total: v.number(),
  }).index("by_searchId", ["searchId"]),
  search_results: defineTable({
    searchId: v.string(),
    results: v.array(v.id("botany")),
    sort: v.object({
      field: v.string(),
      direction: v.string(),
    }),
    totalChunks: v.optional(v.number()),
    hasMultipleChunks: v.optional(v.boolean()),
  }).index("by_searchId", ["searchId"]),
  search_accumulation: defineTable({
    searchId: v.string(),
    ids: v.array(v.id("botany")),
  }).index("by_searchId", ["searchId"]),
  search_sorted_chunks: defineTable({
    searchId: v.string(),
    chunkIndex: v.number(),
    results: v.array(v.id("botany")),
  }).index("by_searchId", ["searchId"]),
  search_result_chunks: defineTable({
    searchId: v.string(),
    chunkIndex: v.number(),
    results: v.array(v.id("botany")),
  }).index("by_searchId", ["searchId"]),
  search_id_chunks: defineTable({
    searchId: v.string(),
    chunkIndex: v.number(),
    ids: v.array(v.id("botany")),
  }).index("by_searchId", ["searchId"]),
  search_merge_accumulation: defineTable({
    searchId: v.string(),
    ids: v.array(v.id("botany")),
  }).index("by_searchId", ["searchId"]),
  search_final_sort_chunks: defineTable({
    searchId: v.string(),
    chunkIndex: v.number(),
    results: v.array(v.id("botany")),
  }).index("by_searchId", ["searchId"]),
});
//contains any works on a string field like "Vernon Oswald, Lowell Ahart" by doing a substring match.