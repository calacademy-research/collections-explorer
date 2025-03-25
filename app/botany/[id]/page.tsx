"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Calendar, Download, ExternalLink, MapPin, Search } from "lucide-react";

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23f3f4f6'/%3E%3Cpath d='M15 25h10M10 15h20' stroke='%239ca3af' stroke-width='1' stroke-linecap='round'/%3E%3C/svg%3E";

export default function PlantPage() {
  const params = useParams();
  const plantId = params.id as Id<"botany">;
  const [selectedImage, setSelectedImage] = useState(0);

  const plant = useQuery(api.botany.getPlantById, { id: plantId });

  if (!plant) {
    return <div>Loading...</div>;
  }

  // Convert the single image to an array for consistency with the design
  const images = plant.img ? [plant.img] : [];

  // Validate image URL
  const getValidImageUrl = (url: string) => {
    try {
      return url && url.startsWith('http') ? url : PLACEHOLDER_IMAGE;
    } catch {
      return PLACEHOLDER_IMAGE;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - Images */}
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-muted rounded-md overflow-hidden relative">
              <Image
                src={getValidImageUrl(images[selectedImage])}
                alt={plant.fullName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 relative ${selectedImage === index ? "border-primary" : "border-transparent"}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={getValidImageUrl(image)}
                    alt={`${plant.fullName} - image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>

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
                <div>
                  <p className="text-sm text-muted-foreground">Catalog Number</p>
                  <p className="font-medium">{plant.catalogNumber}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Alt. Catalog Number</p>
                  <p className="font-medium">{plant.altCatalogNumber}</p>
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
          </div>

          {/* Right column - Information */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-[#4b5320] mb-1">
                <span className="italic">{plant.fullName}</span>
              </h1>
              <p className="text-xl text-muted-foreground italic mb-4">{plant.fullName}</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Family</p>
                <p className="font-medium">{plant.family}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Order</p>
                <p className="font-medium">{plant.order}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Class</p>
                <p className="font-medium">{plant.class}</p>
              </div>
            </div>

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

            <div className="space-y-4">
              <h2 className="text-lg font-medium flex items-center text-[#4b5320]">
                <MapPin className="h-5 w-5 mr-2" />
                Location Information
              </h2>

              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Continent</p>
                  <p className="font-medium">{plant.continent}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Country</p>
                  <p className="font-medium">{plant.country}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">State/Province</p>
                  <p className="font-medium">{plant.state}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Town/County</p>
                  <p className="font-medium">{plant.county}</p>
                </div>

                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Locality</p>
                  <p className="font-medium">{plant.localityName}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Latitude</p>
                  <p className="font-medium">{plant.latitude1}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Longitude</p>
                  <p className="font-medium">{plant.longitude1}</p>
                </div>

                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Elevation</p>
                  <p className="font-medium">
                    {plant.minElevation}-{plant.maxElevation} {plant.originalElevationUnit}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium">Collector&apos;s Notes</h2>
              <p className="text-sm">{plant.remarks}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Download Specimen Data
              </Button>

              <Button variant="outline" className="gap-2">
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

              <Button variant="outline" className="gap-2">
                <Search className="h-4 w-4" />
                Find Similar Specimens
              </Button>

              <Button variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                View in GBIF
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-8 bg-muted/30">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} California Academy of Sciences. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
