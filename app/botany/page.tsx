"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BotanyCard } from "@/components/botany/botany-card";
import { FilterSheet } from "@/components/botany/filter-sheet";

export default function Botany() {
  const plants = useQuery(api.botany.getPlants, { qty: 30 });
  const [query, setQuery] = useState("");

  const render = () => {
    return (
      <div className="w-full">
        {renderSearch()}
        {renderSearchResults()}
      </div>
    );
  };

  const renderSearch = () => {
    const renderSearchInputAndButton = () => {
      return (
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
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      );
    };

    return (
      <>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Botany Collection Search</h1>
          <p className="text-muted-foreground">
            Explore our extensive database of botanical specimens
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            {renderSearchInputAndButton()}
            <FilterSheet
              onApplyFilters={(filters) => {
                // Handle filter application here
                console.log("Applied filters:", filters);
              }}
            />
          </div>
        </div>
      </>
    );
  };

  const renderSearchResults = () => {
    return (
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-4 auto-rows-fr">
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
    );
  };
  return render();
}
