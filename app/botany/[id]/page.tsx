"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { extractImageUrl } from "@/lib/utils";
import { Calendar, MapPin } from "lucide-react";
import L from "leaflet";

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map view changes
function MapController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23f3f4f6'/%3E%3Cpath d='M15 25h10M10 15h20' stroke='%239ca3af' stroke-width='1' stroke-linecap='round'/%3E%3C/svg%3E";

export default function PlantPage() {
  const params = useParams();
  const plantId = params.id as Id<"botany">;
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageSrc, setImageSrc] = useState("/cal_academy.png");
  const [mapCenter, setMapCenter] = useState<[number, number]>([37.8, -122.4]);
  const [mapZoom, setMapZoom] = useState(1);

  const plant = useQuery(api.botany.getPlantById, { id: plantId });
  console.log(plant);

  useEffect(() => {
    if (plant && plant.img && plant.img.length > 0) {
      const url = extractImageUrl(plant.img, "500");
      if (url) {
        setImageSrc(url);
      } else {
        setImageSrc("/cal_academy.png");
      }
    } else {
      setImageSrc("/cal_academy.png");
    }
  }, [plant]);

  useEffect(() => {
    if (plant?.latitude1 && plant?.longitude1) {
      const lat = parseFloat(plant.latitude1.toString());
      const lng = parseFloat(plant.longitude1.toString());
      setMapCenter([lat, lng]);
      setMapZoom(10);
    }
  }, [plant]);

  if (!plant) {
    return <div>Loading...</div>;
  }

  // Validate image URL
  const getValidImageUrl = (url: string) => {
    try {
      return url && url.startsWith("http") ? url : PLACEHOLDER_IMAGE;
    } catch {
      return PLACEHOLDER_IMAGE;
    }
  };

  const images = plant.img.length > 0 ? [imageSrc] : ["/cal_academy.png"];

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
                alt={plant.scientificName}
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
                    alt={`${plant.scientificName} - image ${index + 1}`}
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
                  <p className="text-sm text-muted-foreground">
                    Accession Number
                  </p>
                  <p className="font-medium">{plant.accessionNumber}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Type Status</p>
                  <p className="font-medium">{plant.typeStatusName}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Preparations</p>
                  <p className="font-medium">{plant.preparations}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Herbarium</p>
                  <p className="font-medium">{plant.herbarium}</p>
                </div>

                {plant.collectionObjectAttachments && (
                  <div>
                    <p className="text-sm text-muted-foreground">Collection Object Attachment</p>
                    <p className="font-medium">{plant.collectionObjectAttachments}</p>
                  </div>
                )}

                <div>
                  <dt className="text-sm text-muted-foreground">Bar Code</dt>
                  <dd className="text-sm text-gray-900">
                    <p className="font-medium">{plant.barCode}</p>
                  </dd>
                </div>

                {plant.collectorNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground">Collector Number</p>
                    <p className="font-medium">{plant.collectorNumber}</p>
                  </div>
                )}

                {plant.timestampModified && (
                  <div>
                    <p className="text-sm text-muted-foreground">Timestamp Modified</p>
                    <p className="font-medium">{plant.timestampModified}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column - Information */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-[#4b5320] mb-1">
                <span className="italic">{plant.scientificName}</span>
              </h1>
              <p className="text-xl text-muted-foreground italic mb-4">
                {plant.scientificName}
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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

              <div>
                <p className="text-sm text-muted-foreground">Genus</p>
                <p className="font-medium">{plant.genus}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Species</p>
                <p className="font-medium">{plant.species}</p>
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
                  <p className="text-sm text-muted-foreground">
                    Verbatim Date
                  </p>
                  <p className="font-medium">{plant.verbatimDate}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Determiner</p>
                  <p className="font-medium">{plant.determiner}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Determined Date
                  </p>
                  <p className="font-medium">{plant.determinedDate}</p>
                </div>

                {plant.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="font-medium">{plant.notes}</p>
                  </div>
                )}

                {plant.phenology && (
                  <div>
                    <p className="text-sm text-muted-foreground">Phenology</p>
                    <p className="font-medium">{plant.phenology}</p>
                  </div>
                )}

                {plant.startDateYear && (
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">
                      {plant.startDateMonth && plant.startDateDay ? `${plant.startDateMonth}/${plant.startDateDay}/` : ''}{plant.startDateYear}
                    </p>
                  </div>
                )}

                {plant.endDateYear && (
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="font-medium">
                      {plant.endDateMonth && plant.endDateDay ? `${plant.endDateMonth}/${plant.endDateDay}/` : ''}{plant.endDateYear}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {(plant.redactLocalityCo || plant.redactLocalityTaxon || plant.redactLocalityAcceptedTaxon) && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium flex items-center text-[#4b5320]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Redaction Settings
                </h2>

                <div className="grid grid-cols-2 gap-y-4">
                  {plant.redactLocalityCo && (
                    <div>
                      <p className="text-sm text-muted-foreground">Redact Locality Co</p>
                      <p className="font-medium">{plant.redactLocalityCo}</p>
                    </div>
                  )}

                  {plant.redactLocalityTaxon && (
                    <div>
                      <p className="text-sm text-muted-foreground">Redact Locality Taxon</p>
                      <p className="font-medium">{plant.redactLocalityTaxon}</p>
                    </div>
                  )}

                  {plant.redactLocalityAcceptedTaxon && (
                    <div>
                      <p className="text-sm text-muted-foreground">Redact Locality Accepted Taxon</p>
                      <p className="font-medium">{plant.redactLocalityAcceptedTaxon}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

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
                  <p className="text-sm text-muted-foreground">
                    State/Province
                  </p>
                  <p className="font-medium">{plant.state}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">County</p>
                  <p className="font-medium">{plant.county}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Town</p>
                  <p className="font-medium">{plant.town}</p>
                </div>

                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Locality</p>
                  <p className="font-medium">{plant.localityName}</p>
                </div>

                {plant.localityContinued && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Locality Continued</p>
                    <p className="font-medium">{plant.localityContinued}</p>
                  </div>
                )}

                <div className="col-span-2 h-[300px] rounded-lg overflow-hidden">
                  {plant.latitude1 && plant.longitude1 ? (
                    <MapContainer
                      center={mapCenter}
                      zoom={mapZoom}
                      style={{ height: "100%", width: "100%" }}
                      scrollWheelZoom={false}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker
                        position={[
                          parseFloat(plant.latitude1.toString()),
                          parseFloat(plant.longitude1.toString()),
                        ]}
                      />
                      <MapController center={mapCenter} zoom={mapZoom} />
                    </MapContainer>
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <p className="text-muted-foreground">
                        No location data available
                      </p>
                    </div>
                  )}
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
                    {plant.minElevation}-{plant.maxElevation}{" "}
                    {plant.originalElevationUnit}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Elevation Unit</p>
                  <p className="font-medium">{plant.originalElevationUnit}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium">Habitat</h2>
              <p className="text-sm">{plant.habitat}</p>
            </div>

            {plant.specimenDescription && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Specimen Description</h2>
                <p className="text-sm">{plant.specimenDescription}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  const highResUrl = extractImageUrl(plant.img, "2000");
                  if (highResUrl) {
                    window.open(highResUrl, "_blank");
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
        </div>
      </main>

      <footer className="border-t py-8 bg-muted/30">
        <div className="container text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} California Academy of Sciences. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
