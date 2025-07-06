// All migrations have been completed
// This file is kept for reference but no active migrations are needed

import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Migration to remove hasWorkingImage field from one batch of botany records
export const removeHasWorkingImageField = mutation({
  args: { cursor: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const BATCH_SIZE = 300;
    let updatedCount = 0;

    // Convert undefined to null for Convex pagination API
    const cursor = args.cursor ?? null;

    const { page, isDone, continueCursor } = await ctx.db
      .query("botany")
      .paginate({ cursor, numItems: BATCH_SIZE });

    for (const plant of page) {
      if ("hasWorkingImage" in plant) {
        const { hasWorkingImage, ...rest } = plant;
        await ctx.db.replace(plant._id, rest);
        updatedCount++;
      }
    }

    return { updatedCount, isDone, continueCursor };
  },
});

