import { api } from "@/convex/_generated/api";
import { ConvexReactClient } from "convex/react";
import fs from "fs/promises";
import path from "path";

export async function uploadVideoToConvex(
  client: ConvexReactClient,
  videoPath: string
): Promise<string> {
  try {
    let videoBuffer: Buffer;

    if (videoPath.startsWith('http')) {
      // Handle URL case
      const response = await fetch(videoPath);
      if (!response.ok) {
        throw new Error('Failed to fetch video');
      }
      const arrayBuffer = await response.arrayBuffer();
      videoBuffer = Buffer.from(arrayBuffer);
    } else {
      // Handle local file case
      const filePath = path.join(process.cwd(), videoPath);
      videoBuffer = await fs.readFile(filePath);
    }

    // Get upload URL from Convex
    const uploadUrl = await client.mutation(api.video.generateUploadUrl, {});

    // Upload to Convex storage
    const uploadResult = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'video/mp4',
      },
      body: videoBuffer,
    });

    if (!uploadResult.ok) {
      throw new Error('Failed to upload video to Convex');
    }

    // Get the storage ID and store in the database
    const { storageId } = await uploadResult.json();
    const videoId = await client.mutation(api.video.storeVideo, { storageId });

    return videoId;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
} 