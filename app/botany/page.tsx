"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BotanyCard } from "@/components/botany/botany-card";

export default function Botany() {
  const plants = useQuery(api.botany.getPlants, { qty: 30 });
  const [query, setQuery] = useState("");
  console.log("plants", plants);

  return (
    <div className="w-full">
      {/* Hero section with title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Botany Collection Search</h1>
        <p className="text-muted-foreground">
          Explore our extensive database of botanical specimens
        </p>
      </div>

      {/* Search section */}
      <div className="max-w-2xl mx-auto">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search botanical specimens..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-6 text-lg rounded-lg"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Advanced filters button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-12 w-12">
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
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select plant type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flowering">
                        Flowering Plants
                      </SelectItem>
                      <SelectItem value="ferns">Ferns</SelectItem>
                      <SelectItem value="mosses">Mosses</SelectItem>
                      <SelectItem value="trees">Trees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Collection Period */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Collection Period
                  </label>
                  <Select>
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
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="north-america">
                        North America
                      </SelectItem>
                      <SelectItem value="south-america">
                        South America
                      </SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="asia">Asia</SelectItem>
                      <SelectItem value="africa">Africa</SelectItem>
                      <SelectItem value="oceania">Oceania</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Apply Filters Button */}
                <Button className="w-full mt-6">Apply Filters</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 auto-rows-fr">
        {plants === undefined ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="animate-pulse text-muted-foreground">
              Loading specimens...
            </div>
          </div>
        ) : plants.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No specimens found matching your search.
          </div>
        ) : (
          plants.map((plant) => <BotanyCard key={plant._id} plant={plant} />)
        )}
      </div>
    </div>
  );
}
