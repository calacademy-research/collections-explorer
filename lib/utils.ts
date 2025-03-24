import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractImageUrl(
  url: string | undefined | null,
  resolution: string,
): string | null {
  if (!url || url.length === 0) return null;
  try {
    const jsonString = url.replace(/([{,])(\s*)([A-Za-z]+)(\s*):/g, '$1"$3":');
    const data = JSON.parse(jsonString);
    if (!Array.isArray(data) || data.length === 0) return null;
    const imageUrl = data[0].AttachmentLocation;
    return `http://ibss-images.calacademy.org/fileget?coll=Botany&type=T&filename=${imageUrl}&scale=${resolution}`;
  } catch (error) {
    console.error("Failed to parse image URL:", error);
    return null;
  }
}
