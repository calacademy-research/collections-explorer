"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { extractImageUrl } from "@/lib/utils";
import type { Doc } from "../../convex/_generated/dataModel";

type Plant = Doc<"botany">;

interface PlantCardProps {
  plant: Plant;
}

export function BotanyCard({ plant }: PlantCardProps) {
  const imageUrl = extractImageUrl(plant.img, "1000");

  return (
    <Link href={`/plants/${plant._id}`} className="group block h-full">
      <Card className="overflow-hidden h-full transition-all hover:shadow-lg duration-300 border-none">
        <div className="relative aspect-[4/3] bg-muted/10 w-full">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={plant.fullName}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
            />
          )}
        </div>
        <CardContent className="p-3">
          <h2 className="text-sm font-light italic tracking-tight mb-0.5 line-clamp-1">
            {plant.fullName}
          </h2>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
            {plant.family}
          </p>

          <div className="flex flex-wrap gap-1 mb-2">
            {plant.typeStatusName && (
              <Badge
                variant="secondary"
                className="text-xs bg-primary/10 text-primary hover:bg-primary/20"
              >
                {plant.typeStatusName}
              </Badge>
            )}
            <Badge
              variant="outline"
              className="text-xs bg-white/50 backdrop-blur-sm hover:bg-muted/50"
            >
              {plant.country}
            </Badge>
          </div>

          <div className="space-y-1">
            <p className="line-clamp-1 text-xs">
              {plant.localityName} {plant.state}
            </p>
            <p className="text-muted-foreground text-xs line-clamp-1">
              Collected: {plant.startDate.toString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
