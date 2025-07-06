import type { Doc } from "@/convex/_generated/dataModel";

type Plant = Doc<"botany">;

interface PlantCollectionDetailsProps {
  plant: Plant;
}

export function PlantCollectionDetails({ plant }: PlantCollectionDetailsProps) {
  return (
    <div className="bg-muted/30 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-medium flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Collection Details
      </h3>

      <div className="grid grid-cols-2 gap-y-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Bar Code</p>
          <p className="font-medium">{plant.barCode}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Type Status</p>
          <p className="font-medium">{plant.typeStatusName}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Preparations</p>
          <p className="font-medium">{plant.preparations}</p>
        </div>
      </div>
    </div>
  );
} 