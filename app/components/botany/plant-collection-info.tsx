import type { Doc } from "@/convex/_generated/dataModel";
import { Calendar } from "lucide-react";

type Plant = Doc<"botany">;

interface PlantCollectionInfoProps {
  plant: Plant;
}

export function PlantCollectionInfo({ plant }: PlantCollectionInfoProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium flex items-center text-[#4b5320]">
        <Calendar className="h-5 w-5 mr-2" />
        Collection Information
      </h2>

      <div className="grid grid-cols-2 gap-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Collectors</p>
          <p className="font-medium">{plant.collectors}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Collection Date</p>
          <p className="font-medium">{plant.verbatimDate}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Determined By</p>
          <p className="font-medium">{plant.determiner}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Determination Date</p>
          <p className="font-medium">{plant.determinedDate}</p>
        </div>
      </div>
    </div>
  );
} 