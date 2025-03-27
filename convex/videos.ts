import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get a video URL from storage
export const getVideoUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // Get the URL for the video file
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Generate an upload URL for videos
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    // Generate a URL for uploading a video file
    return await ctx.storage.generateUploadUrl();
  },
});