import Image from "next/image";
import { Button } from "@/components/ui/button";
import { extractImageUrl } from "@/lib/utils";
import type { Doc } from "@/convex/_generated/dataModel";

type Plant = Doc<"botany">;

interface PlantImageGalleryProps {
  plant: Plant;
  imageSrc: string;
}

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23f3f4f6'/%3E%3Cpath d='M15 25h10M10 15h20' stroke='%239ca3af' stroke-width='1' stroke-linecap='round'/%3E%3C/svg%3E";

export function PlantImageGallery({ plant, imageSrc }: PlantImageGalleryProps) {
  // Validate image URL
  const getValidImageUrl = (url: string) => {
    try {
      return url && url.startsWith('http') ? url : PLACEHOLDER_IMAGE;
    } catch {
      return PLACEHOLDER_IMAGE;
    }
  };

  return (
    <div className="space-y-4">
      <div className="aspect-[4/3] bg-muted rounded-md overflow-hidden relative">
        <Image
          src={getValidImageUrl(imageSrc)}
          alt={plant.scientificName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button 
          variant="outline" 
          className="gap-2" 
          onClick={() => {
            const highResUrl = extractImageUrl(plant.img, "2000");
            if (highResUrl) {
              window.open(highResUrl, '_blank');
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          View High-Res Images
        </Button>
      </div>
    </div>
  );
} 