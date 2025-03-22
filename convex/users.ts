import { query } from "./_generated/server";
import { v } from "convex/values";

export const newRandomFunction = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const plant = await ctx.db.get(args.id);
    return plant;
  },
});
