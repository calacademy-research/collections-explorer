import { query } from "./_generated/server";
import { v } from "convex/values";

export const getPlants = query({
  args: {
    qty: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("botany").take(args.qty);
  },
});

export const getPlantById = query({
  args: { id: v.id("botany") },
  handler: async (ctx, args) => {
    const plant = await ctx.db.get(args.id);
    return plant;
  },
});

export const searchPlants = query({
  args: {
    query: v.string(),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const { query, limit } = args;

    if (!query.trim()) {
      return await ctx.db.query("botany").take(limit);
    }

    const [byName, byCollectors, byCountry] = await Promise.all([
      ctx.db
        .query("botany")
        .withSearchIndex("search_fullName", (q) => q.search("fullName", query))
        .take(limit),
      ctx.db
        .query("botany")
        .withSearchIndex("search_collectors", (q) =>
          q.search("collectors", query),
        )
        .take(limit),
      ctx.db
        .query("botany")
        .withSearchIndex("search_country", (q) => q.search("country", query))
        .take(limit),
    ]);
    // Combine and deduplicate results
    const seen = new Set();
    return [...byName, ...byCollectors, ...byCountry]
      .filter((plant) => {
        if (seen.has(plant._id.toString())) return false;
        seen.add(plant._id.toString());
        return true;
      })
      .slice(0, limit);
  },
});
