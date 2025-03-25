import { ConvexReactClient } from "convex/react";
import { uploadVideoToConvex } from "../app/lib/uploadVideo";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function migrateVideo() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not set in .env.local");
  }

  // Initialize the Convex client
  const client = new ConvexReactClient(convexUrl);

  try {
    const videoPath = 'public/videos/nature-background.mp4';
    
    console.log("Starting video migration...");
    console.log("Uploading video from:", videoPath);
    const videoId = await uploadVideoToConvex(client, videoPath);
    console.log("Video successfully migrated! Video ID:", videoId);
    console.log("\nUpdate your VideoBackground component usage to:");
    console.log(`<VideoBackground videoId="${videoId}" />`);
    
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    // Clean up
    await client.close();
  }
}

migrateVideo(); 