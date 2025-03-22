import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export const Plant = {
  cas_id: v.string(),
  altCatalogNumber: v.union(v.float64(), v.string()),
  catalogNumber: v.float64(),
  ce_endDate: v.union(v.float64(), v.string()),
  ce_endDate1: v.union(v.float64(), v.string()),
  ce_startDate: v.union(v.float64(), v.string()),
  ce_startDate1: v.union(v.float64(), v.string()),
  class: v.string(),
  co_remarks: v.union(v.float64(), v.string()),
  co_yesNo2: v.union(v.float64(), v.string()),
  collectionObjectAttachments: v.union(v.float64(), v.string()),
  collectors: v.string(),
  continent: v.string(),
  county: v.string(),
  country: v.string(),
  determinedDate: v.string(),
  determiner: v.string(),
  endDate: v.union(v.float64(), v.string()),
  endDateVerbatim: v.string(),
  family: v.string(),
  fullName: v.string(),
  genus: v.string(),
  geoc: v.string(),
  img: v.string(),
  latitude1: v.union(v.float64(), v.string()),
  localityName: v.string(),
  longitude1: v.union(v.float64(), v.string()),
  maxElevation: v.union(v.float64(), v.string()),
  minElevation: v.union(v.float64(), v.string()),
  modifier: v.string(),
  order: v.string(),
  originalElevationUnit: v.string(),
  preparations: v.string(),
  remarks: v.string(),
  species: v.string(),
  startDate: v.union(v.float64(), v.string()),
  state: v.string(),
  stationFieldNumber: v.union(v.float64(), v.string()),
  text1: v.union(v.float64(), v.string()),
  text2: v.union(v.float64(), v.string()),
  timestampModified: v.string(),
  town: v.string(),
  tx_yesNo2: v.union(v.float64(), v.string()),
  typeStatusName: v.string(),
  verbatimDate: v.union(v.float64(), v.string()),
  yesNo2: v.union(v.float64(), v.string()),
};

export default defineSchema({
  ...authTables,
  numbers: defineTable({
    value: v.number(),
  }),
  botany: defineTable(Plant)
    .searchIndex("search_fullName", {
      searchField: "fullName",
      filterFields: ["country", "collectors"],
    })
    .searchIndex("search_country", {
      searchField: "country",
      filterFields: ["fullName", "collectors"],
    })
    .searchIndex("search_collectors", {
      searchField: "collectors",
      filterFields: ["fullName", "country"],
    }),
});
