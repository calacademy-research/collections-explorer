"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
  expanded?: boolean;
  className?: string;
  placeholder?: string;
}

export default function SearchBar({ 
  onSearch, 
  expanded = false,
  className,
  placeholder = "Search..."
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className={cn(
      "relative",
      expanded ? "w-full max-w-2xl" : "w-full max-w-md",
      className
    )}>
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/20 rounded-xl blur-xl group-hover:blur-2xl transition duration-500"></div>
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
          }}
          className="relative w-full pl-4 pr-10 py-6 text-lg rounded-lg bg-white/80 backdrop-blur-sm border-primary/20 hover:border-primary/30 transition-colors duration-300 placeholder:text-muted-foreground"
        />
      </div>
      <Button
        size="icon"
        variant="ghost"
        onClick={handleSearch}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer hover:bg-primary/10 transition-colors duration-300"
      >
        <Search className="h-5 w-5 text-primary" />
      </Button>
    </div>
  );
} 