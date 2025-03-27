import { api } from '../convex/_generated/api';
import { ConvexReactClient } from 'convex/react';

export async function uploadVideo(
  client: ConvexReactClient,
  file: File
): Promise<string> {
  // Get the upload URL from Convex
  const uploadUrl = await client.mutation(api.videos.generateUploadUrl);

  // Upload the file
  const result = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!result.ok) {
    throw new Error(`Failed to upload video: ${result.statusText}`);
  }

  // Get the storage ID from the response
  const { storageId } = await result.json();
  return storageId;
} 