"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { extractImageUrl } from "@/lib/utils";
import type { Doc } from "../../convex/_generated/dataModel";
import { useState } from "react";
import { getCountryEmoji } from "@/utils/countryEmojis";
import { Calendar, MapPin, Tag } from "lucide-react";

type Plant = Doc<"botany">;

interface PlantCardProps {
  plant: Plant;
}

export function BotanyCard({ plant }: PlantCardProps) {
  const [imageSrc, setImageSrc] = useState(
    plant.img.length === 0
      ? "/cal_academy.png"
      : extractImageUrl(plant.img, "500"),
  );

  const renderImage = () => {
    return (
      imageSrc && (
        <Image
          src={imageSrc}
          alt={plant.fullName}
          fill
          priority
          loading="eager"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
          onError={() => setImageSrc("/cal_academy.png")}
        />
      )
    );
  };

  const renderCardContent = () => {
    return (
      <CardContent className="p-4">
        <h2 className="text-xl font-sans italic tracking-tight mb-1 line-clamp-1">
          {plant.fullName}
        </h2>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
          {plant.family}
        </p>

        <div className="flex flex-wrap gap-2 mb-2">
          <Badge
            variant="outline"
            className="text-sm bg-white/50 backdrop-blur-sm hover:bg-muted/50 flex items-cente font-normal"
          >
            {getCountryEmoji(plant.country)} {plant.country}
          </Badge>
        </div>

        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">
              Collected {plant.verbatimDate.toString()}
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">
              {plant.county} {plant.state}
            </span>
          </div>
          <div className="flex flex-row-reverse items-center text-sm text-muted-foreground mt-auto">
            <span className="line-clamp-1">{plant.catalogNumber}</span>
            <Tag className="h-4 w-4 mr-1" />
          </div>
        </div>
      </CardContent>
    );
  };

  return (
    <Link href={`/botany/${plant._id}`} className="group block h-full">
      <Card className="overflow-hidden h-full transition-all hover:shadow-lg duration-300 border-none">
        <div className="relative aspect-[4/3] bg-muted/10">{renderImage()}</div>
        {renderCardContent()}
      </Card>
    </Link>
  );
}
