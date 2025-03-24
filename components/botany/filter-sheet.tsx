"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface FilterSheetProps {
  onApplyFilters?: (filters: {
    plantType?: string;
    collectionPeriod?: string;
    location?: string;
  }) => void;
}

export function FilterSheet({ onApplyFilters }: FilterSheetProps) {
  const [filters, setFilters] = useState({
    plantType: "",
    collectionPeriod: "",
    location: "",
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 cursor-pointer"
        >
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Advanced Search</SheetTitle>
          <SheetDescription>
            Refine your search with specific criteria
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          {/* Plant Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Plant Type</label>
            <Select
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, plantType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select plant type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flowering">Flowering Plants</SelectItem>
                <SelectItem value="ferns">Ferns</SelectItem>
                <SelectItem value="mosses">Mosses</SelectItem>
                <SelectItem value="trees">Trees</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Collection Period */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Collection Period</label>
            <Select
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, collectionPeriod: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-week">Last Week</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Select
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, location: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="north-america">North America</SelectItem>
                <SelectItem value="south-america">South America</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="asia">Asia</SelectItem>
                <SelectItem value="africa">Africa</SelectItem>
                <SelectItem value="oceania">Oceania</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Apply Filters Button */}
          <Button
            className="w-full mt-6"
            onClick={() => onApplyFilters?.(filters)}
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
