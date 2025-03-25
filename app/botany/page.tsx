"use client";

import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BotanyCard } from "@/components/botany/botany-card";
import { FilterSheet } from "@/components/botany/filter-sheet";
import { useSearchParams } from "next/navigation";

export default function Botany() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Handle search query from URL
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      setSearchQuery(q);
      setIsSearching(true);
    }
  }, [searchParams]);

  // Default plants query
  const defaultPlants = useQuery(api.botany.getPlants, { qty: 30 });
  // Search query
  const searchResults = useQuery(
    api.botany.searchPlants,
    isSearching
      ? {
          query: searchQuery,
          category: "all",
          limit: 30,
        }
      : "skip",
  );

  const plantsToShow = isSearching ? searchResults : defaultPlants;

  const handleSearch = () => {
    if (query.trim()) {
      setSearchQuery(query);
      setIsSearching(true);
    }
  };

  const clearSearch = () => {
    setIsSearching(false);
    setSearchQuery("");
    setQuery("");
  };

  const render = () => {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-white to-gray-50/50">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderSearch()}
          {renderSearchResults()}
        </div>
      </div>
    );
  };

  const renderSearch = () => {
    const renderSearchInputAndButton = () => {
      return (
        <div className="relative flex-1">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl blur-xl group-hover:blur-2xl transition duration-500"></div>
            <Input
              type="text"
              placeholder="Search botanical specimens..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              className="relative w-full pl-4 pr-10 py-6 text-lg rounded-lg bg-white/80 backdrop-blur-sm border-green-600/20 hover:border-green-600/30 transition-colors duration-300 placeholder:text-gray-400"
            />
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer hover:bg-green-50 transition-colors duration-300"
          >
            <Search className="h-5 w-5 text-green-700" />
          </Button>
        </div>
      );
    };

    return (
      <div className="relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 right-0 h-72 w-72 rounded-full bg-green-100/30 blur-3xl"></div>
          <div className="absolute -top-20 left-0 h-72 w-72 rounded-full bg-emerald-100/30 blur-3xl"></div>
        </div>

        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
            Botany Collection Search
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our extensive database of botanical specimens
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-3">
            {renderSearchInputAndButton()}
            <FilterSheet
              onApplyFilters={(filters) => {
                console.log("Applied filters:", filters);
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderSearchResults = () => {
    return (
      <div className="relative">
        {/* Results count */}
        {plantsToShow && plantsToShow.length > 0 && (
          <div className="mb-6 text-gray-600">
            Showing{" "}
            <span className="font-medium text-green-700">
              {plantsToShow.length}
            </span>{" "}
            specimens
            {isSearching && (
              <>
                {" "}
                for "<span className="text-green-700">{searchQuery}</span>"
                <button
                  onClick={clearSearch}
                  className="ml-2 text-sm text-green-600 hover:text-green-700 underline"
                >
                  Clear search
                </button>
              </>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 auto-rows-fr">
          {plantsToShow === undefined ? (
            <div className="col-span-full flex justify-center py-16">
              <div className="animate-pulse text-gray-500 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          ) : plantsToShow.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="text-gray-500 space-y-2">
                <p className="text-lg">
                  No specimens found matching your search.
                </p>
                <p className="text-sm">
                  Try adjusting your search terms or filters.
                </p>
              </div>
            </div>
          ) : (
            plantsToShow.map((plant) => (
              <BotanyCard key={plant._id} plant={plant} />
            ))
          )}
        </div>
      </div>
    );
  };

  return render();
}
