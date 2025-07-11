"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { BotanyCard } from "@/components/botany/botany-card";
import { useQuery, useMutation } from "convex/react";
import { LoadingSpinner, LoadingCard } from "@/components/ui/loading-spinner";

import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import dynamic from 'next/dynamic';
import L from 'leaflet';

// Types for numeric comparisons
type NumericFilterType = "=" | "before" | "after" | "between";

// Types for text comparisons
type TextFilterType = "=" | "contains" | "contains_any" | "in";

// Interface for a search rule
interface LocalSearchRule {
  id: number;
  index: string;
  value: string;
  numericFilter?: {
    type: NumericFilterType;
    value: string; 
    secondValue?: string; 
  };
  textFilter?: {
    type: TextFilterType;
    value: string;
    secondValue?: string; // For "in" operator to store multiple values
  };
}

// Add this validation function at the top level
const isValidRule = (rule: Partial<LocalSearchRule>) => {
  if (rule.numericFilter) {
    const value = Number(rule.numericFilter.value);
    const secondValue = rule.numericFilter.secondValue ? Number(rule.numericFilter.secondValue) : undefined;
    
    if (isNaN(value) || (secondValue !== undefined && isNaN(secondValue))) {
      return false;
    }

    if (rule.index === "latitude1") {
      return value >= -90 && value <= 90 && 
             (secondValue === undefined || (secondValue >= -90 && secondValue <= 90));
    }
    if (rule.index === "longitude1") {
      return value >= -180 && value <= 180 && 
             (secondValue === undefined || (secondValue >= -180 && secondValue <= 180));
    }
    if (rule.index === "minElevation") {
      // For minElevation, ensure it's not greater than maxElevation if provided
      if (secondValue !== undefined) {
        return value <= secondValue;
      }
      return true;
    }
    if (rule.index === "maxElevation") {
      // For maxElevation, ensure it's not less than minElevation if provided
      if (secondValue !== undefined) {
        return value <= secondValue;  // Changed from >= to <= since we want the second value to be higher
      }
      return true;
    }
    return true;
  }
  return rule.value?.trim() !== "";
};

// Add this function before the Botany component
const formatDate = (dateStr: string): string => {
  // Split the date into parts
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;

  // Format year (should be 4 digits)
  const year = parts[0];
  if (year.length !== 4) return dateStr;

  // Format month (add leading zero if needed)
  let month = parts[1];
  if (month.length === 1 && month !== '0') {
    month = '0' + month;
  }

  // Format day (add leading zero if needed)
  let day = parts[2];
  if (day.length === 1 && day !== '0') {
    day = '0' + day;
  }

  return `${year}-${month}-${day}`;
};

type Sort = {
  field: string;
  direction: 'asc' | 'desc';
};

// Add these to the list of fields that use numeric filters
const numericFields = [
  "latitude1", "longitude1", "minElevation", "maxElevation",
  "startDateMonth", "startDateDay", "startDateYear",
  "endDateMonth", "endDateDay", "endDateYear",
  "barCode", "accessionNumber"
];

// Add this at the top of the file, outside any component




// Dynamically import MapView with SSR disabled
const MapView = dynamic(() => import('@/components/botany/MapView'), { ssr: false });

// REMOVE the local MapView component definition entirely from this file.
// Only use the dynamically imported MapView from '@/components/botany/MapView'.

export default function Botany() {
  const searchParams = useSearchParams();

  const [searchMode, setSearchMode] = useState<'basic' | 'advanced'>('basic');
  const [basicSearchQuery, setBasicSearchQuery] = useState('');
  const [basicSearchType, setBasicSearchType] = useState<'exact' | 'match_either'>('exact');

  const [searchRules, setSearchRules] = useState<LocalSearchRule[]>([
    { id: 1, index: "scientificName", value: "" },
  ]);
  const [sort, setSort] = useState<Sort>({
    field: "",
    direction: "asc",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // New filter checkboxes
  const [hasValidImage, setHasValidImage] = useState(false);
  const [hasValidGeoCoords, setHasValidGeoCoords] = useState(false);
  const [hasMapView, setHasMapView] = useState(false);
  // Remove selectArea from state and always enable area selection
  // const [selectArea, setSelectArea] = useState(false);
  
  const [areaBounds, setAreaBounds] = useState<[[number, number], [number, number]] | null>(null);

  // In Botany component, add these refs and state:
  const rectangleRef = useRef<L.Rectangle | null>(null);
  

  const RESULTS_PER_PAGE = 30;
  const [currentPage, setCurrentPage] = useState(1);

  // Move getBasicSearchRules to the top of the component
  const getBasicSearchRules = useCallback(() => {
    if (!basicSearchQuery.trim()) return [];
    const terms = basicSearchQuery.trim().split(',').map((t: string) => t.trim()).filter((term: string) => term.length > 0);
    if (terms.length === 0) return [];
    if (basicSearchType === 'exact') {
      return [{
        field: "all",
        operator: "basic_exact",
        value: basicSearchQuery.trim()
      }];
    } else {
      return [{
        field: "scientificName",
        operator: "basic_any",
        value: basicSearchQuery.trim()
      }];
    }
  }, [basicSearchQuery, basicSearchType]);

  // Add area filter to search rules if area is selected
  

  // Update area filter logic to use array format
  const areaFilterRule = useMemo(() => {
    return (areaBounds && areaBounds[0] && areaBounds[1]) ? [
      { field: "latitude1", operator: "between", value: Math.min(areaBounds[0][0], areaBounds[1][0]), secondValue: Math.max(areaBounds[0][0], areaBounds[1][0]) },
      { field: "longitude1", operator: "between", value: Math.min(areaBounds[0][1], areaBounds[1][1]), secondValue: Math.max(areaBounds[0][1], areaBounds[1][1]) }
    ] : [];
  }, [areaBounds]);


  const searchData = useQuery(api.botany.searchPlants, hasSearched ? {
    rules: [
      ...(searchMode === 'basic' ? getBasicSearchRules() : searchRules.map(rule => {
        if (rule.numericFilter) {
          return {
            field: rule.index,
            operator: rule.numericFilter.type,
            value: Number(rule.numericFilter.value),
            ...(rule.numericFilter.secondValue !== undefined && {
              secondValue: Number(rule.numericFilter.secondValue)
            })
          };
        }
        if (rule.textFilter) {
          return {
            field: rule.index,
            operator: rule.textFilter.type,
            value: rule.textFilter.value,
          };
        }
        return {
          field: rule.index,
          operator: "=",
          value: rule.value
        };
      })),
      ...(hasValidImage ? [{ field: "img", operator: "has_valid_image", value: "true" }] : []),
      ...((hasValidGeoCoords && !areaBounds) ? [{ field: "latitude1", operator: "has_valid_coords", value: "true" }] : []),
      // Only add area filter if areaBounds is set
      ...(areaBounds && areaBounds[0] && areaBounds[1] ? [
        { field: "latitude1", operator: "between", value: Math.min(areaBounds[0][0], areaBounds[1][0]), secondValue: Math.max(areaBounds[0][0], areaBounds[1][0]) },
        { field: "longitude1", operator: "between", value: Math.min(areaBounds[0][1], areaBounds[1][1]), secondValue: Math.max(areaBounds[0][1], areaBounds[1][1]) }
      ] : [])
    ],
    sort,
    pagination: { pageNumber: currentPage, pageSize: RESULTS_PER_PAGE },
  } : "skip");



  const totalData = useQuery(api.botany.getTotal, hasSearched ? {
    rules: [
      ...(searchMode === 'basic' ? getBasicSearchRules() : searchRules.map(rule => {
        if (rule.numericFilter) {
          return {
            field: rule.index,
            operator: rule.numericFilter.type,
            value: Number(rule.numericFilter.value),
            ...(rule.numericFilter.secondValue !== undefined && {
              secondValue: Number(rule.numericFilter.secondValue)
            })
          };
        }
        if (rule.textFilter) {
          return {
            field: rule.index,
            operator: rule.textFilter.type,
            value: rule.textFilter.value,
          };
        }
        return {
          field: rule.index,
          operator: "=",
          value: rule.value
        };
      })),
      // Add image filter if checked
      ...(hasValidImage ? [{ field: "img", operator: "has_valid_image", value: "true" }] : []),
      // Add geocoordinates filter if checked
      ...((hasValidGeoCoords && !areaBounds) ? [{ field: "latitude1", operator: "has_valid_coords", value: "true" }] : []),
      // Only add area filter if areaBounds is set
      ...(areaBounds && areaBounds[0] && areaBounds[1] ? [
        { field: "latitude1", operator: "between", value: Math.min(areaBounds[0][0], areaBounds[1][0]), secondValue: Math.max(areaBounds[0][0], areaBounds[1][0]) },
        { field: "longitude1", operator: "between", value: Math.min(areaBounds[0][1], areaBounds[1][1]), secondValue: Math.max(areaBounds[0][1], areaBounds[1][1]) }
      ] : [])
    ],
  } : "skip");

  const totalResults = totalData?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalResults / RESULTS_PER_PAGE));

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    setHasSearched(true);
    // Reset pagination to first page when searching
    setCurrentPage(1);
    // Reset loading state after a short delay to allow for the query to start
    setTimeout(() => setIsLoading(false), 1000);
  }, []); // Empty dependency array since this function doesn't depend on any values

  // Handle URL search params
  useEffect(() => {
    const query = searchParams.get("query");
    const q = searchParams.get("q");
    if (query) {
      try {
        const parsed = JSON.parse(decodeURIComponent(query));
        setSearchRules(parsed);
        // Reset sort to unsorted for new queries
        setSort({ field: "", direction: "asc" });
        // Reset pagination to first page for new queries
        setCurrentPage(1);
        setHasSearched(true);
        handleSearch();
      } catch {
        handleSearch();
      }
    } else if (q) {
      setSearchMode('basic');
      setBasicSearchQuery(q);
      setSort({ field: "", direction: "asc" });
      setCurrentPage(1);
      setHasSearched(true);
      handleSearch();
    }
  }, [searchParams, handleSearch]);

  const handleRuleChange = (id: number, key: string, newValue: string) => {
    setSearchRules((rules) =>
      rules.map((rule) => {
        if (rule.id === id) {
          // This handler is for changing the field type
          if (key === "index") {
            const isNumeric = numericFields.includes(newValue);
            return {
              ...rule,
              index: newValue,
              value: "", // Reset legacy value field
              numericFilter: isNumeric
                ? { type: "=", value: "" }
                : undefined,
              textFilter: !isNumeric
                ? { type: "contains", value: "" }
                : undefined,
            };
          }
        }
        return rule;
      })
    );
    // Reset search state when rules change
    setHasSearched(false);
  };

  const handleNumericFilterChange = (
    id: number,
    filterType: NumericFilterType,
    value: string,
    secondValue?: string
  ) => {
    setSearchRules((rules) =>
      rules.map((rule) =>
        rule.id === id
          ? {
              ...rule,
              value: "", // Clear the value field
              numericFilter: {
                type: filterType,
                value,
                ...(secondValue !== undefined ? { secondValue } : {}),
              },
            }
          : rule
      )
    );
    // Reset search state when filters change
    setHasSearched(false);
  };

  const handleTextFilterChange = (
    id: number,
    filterType: TextFilterType,
    value: string,
    secondValue?: string
  ) => {
    setSearchRules((rules) =>
      rules.map((rule) => {
        if (rule.id === id) {
          return {
            ...rule,
            value: "", // Clear the value field
            textFilter: {
              type: filterType,
              value: value,
              ...(secondValue !== undefined ? { secondValue } : {}),
            },
          };
        }
        return rule;
      })
    );
    // Reset search state when filters change
    setHasSearched(false);
  };

  // Add page navigation controls
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setIsLoading(true);
      setCurrentPage(newPage);
      // Reset loading state after a short delay
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const startMaterializing = useMutation(api.botany.startMaterializingResults);

  useEffect(() => {
    if (hasSearched) {
      const rulesToSend = [
        ...(searchMode === 'basic' ? getBasicSearchRules() : searchRules.map(rule => {
          if (rule.numericFilter) {
            return {
              field: rule.index,
              operator: rule.numericFilter.type,
              value: Number(rule.numericFilter.value),
              ...(rule.numericFilter.secondValue !== undefined && {
                secondValue: Number(rule.numericFilter.secondValue)
              })
            };
          }
          if (rule.textFilter) {
            return {
              field: rule.index,
              operator: rule.textFilter.type,
              value: rule.textFilter.value,
            };
          }
          return {
            field: rule.index,
            operator: "=",
            value: rule.value
          };
        })),
        ...(hasValidImage ? [{ field: "img", operator: "has_valid_image", value: "true" }] : []),
        ...((hasValidGeoCoords && !areaBounds) ? [{ field: "latitude1", operator: "has_valid_coords", value: "true" }] : []),
        ...areaFilterRule
      ];

      startMaterializing({
        rules: rulesToSend,
        sort,
      });
    }
  }, [hasSearched, searchMode, basicSearchQuery, basicSearchType, searchRules, sort, hasValidImage, hasValidGeoCoords, areaBounds, areaFilterRule, getBasicSearchRules, startMaterializing]);

  // Add this after areaBounds is defined in the Botany component
  useEffect(() => {
    if (areaBounds) {
      setHasSearched(true);
      setCurrentPage(1);
    }
  }, [areaBounds]);

  const render = () => {
    return (
      <>

        <div className="w-full min-h-screen bg-gradient-to-b from-white to-gray-50/50">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Filter options always above the map */}
            {renderSearch()}
            {/* Map appears below filter options if enabled */}
            {hasMapView && (
              <div className="mt-8">
                <MapView
                  plants={(searchData?.page || []).filter((p): p is Doc<"botany"> => p != null)}
                  selectArea={true}
                  areaBounds={areaBounds}
                  setAreaBounds={setAreaBounds}
                  rectangleRef={rectangleRef}
                  setHasSearched={setHasSearched}
                />
              </div>
            )}
            {/* Search results below map (or below filters if map is hidden) */}
            <div className="mt-8">
              {renderSearchResults()}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderSearch = () => {
    const renderSearchModeToggle = () => {
      return (
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => {
                setSearchMode('basic');
                setHasSearched(false);
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                searchMode === 'basic'
                  ? 'bg-white text-green-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Basic Search
            </button>
            <button
              onClick={() => {
                setSearchMode('advanced');
                setHasSearched(false);
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                searchMode === 'advanced'
                  ? 'bg-white text-green-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Advanced Search
            </button>
          </div>
        </div>
      );
    };

    const renderBasicSearch = () => {
      return (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex gap-3 items-center">
            <Input
              type="text"
              value={basicSearchQuery}
              onChange={(e) => {
                setBasicSearchQuery(e.target.value);
                setHasSearched(false);
              }}
              placeholder="Enter value(s), separated by commas"
              className="flex-1"
            />
            <div className="relative group">
              <select
                value={basicSearchType}
                onChange={(e) => {
                  setBasicSearchType(e.target.value as 'exact' | 'match_either');
                  setHasSearched(false);
                }}
                className="px-3 py-2 rounded-lg border border-green-300 bg-white text-sm"
              >
                <option value="exact">Exact Match</option>
                <option value="match_either">Match Any</option>
              </select>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                {basicSearchType === 'exact' 
                  ? 'All terms must be found in the same record'
                  : 'At least one term must be found in the same record'
                }
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
            <Button 
              onClick={handleSearch}
              disabled={isLoading || !basicSearchQuery.trim()}
              className={`min-w-[100px] transition-all duration-200 ${
                isLoading 
                  ? 'scale-95 bg-green-600' 
                  : 'hover:scale-105 active:scale-95 bg-green-700 hover:bg-green-600'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" text="" />
                  <span>Searching...</span>
                </div>
              ) : (
                "Search"
              )}
            </Button>
          </div>
          {/* Filter Checkboxes for Basic Search */}
          <div className="flex items-center gap-6 justify-center pt-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 group relative">
              <input
                type="checkbox"
                checked={hasValidImage}
                onChange={(e) => {
                  setHasValidImage(e.target.checked);
                  setHasSearched(false);
                }}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span>Has Valid Image</span>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                Only show plants with image attachments (UUID-based images)
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 group relative">
              <input
                type="checkbox"
                checked={hasValidGeoCoords}
                onChange={(e) => {
                  setHasValidGeoCoords(e.target.checked);
                  setHasSearched(false);
                }}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span>Has Geo Coordinates</span>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                Only show plants with valid latitude and longitude coordinates
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 group relative">
              <input
                type="checkbox"
                checked={hasMapView}
                onChange={(e) => {
                  setHasMapView(e.target.checked);
                  if (e.target.checked) {
                    setHasValidGeoCoords(true);
                  }
                }}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span>Map View</span>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                Show results on the map (UI only)
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            </label>
          </div>
        </div>
      );
    };

    const renderAdvancedSearch = () => {
      const addSearchRule = () => {
        setSearchRules((rules) => [
          ...rules,
          { id: Date.now(), index: "scientificName", value: "" },
        ]);
        // Reset search state when adding new rules
        setHasSearched(false);
      };

      const removeSearchRule = (id: number) => {
        setSearchRules((rules) => rules.filter((rule) => rule.id !== id));
        // Reset search state when removing rules
        setHasSearched(false);
      };

      const SEARCH_FIELDS = [
        { value: "accessionNumber", label: "Accession Number" },
        { value: "barCode", label: "Bar Code" },
        { value: "class", label: "Class" },
        { value: "collectors", label: "Collectors" },
        { value: "collectorNumber", label: "Collector Number" },
        { value: "collectionObjectAttachments", label: "Collection Object Attachment" },
        { value: "continent", label: "Continent" },
        { value: "country", label: "Country" },
        { value: "county", label: "County" },
        { value: "determinedDate", label: "Determination Date" },
        { value: "determiner", label: "Determiner" },
        { value: "endDateDay", label: "End Date Day" },
        { value: "endDateMonth", label: "End Date Month" },
        { value: "endDateYear", label: "End Date Year" },
        { value: "family", label: "Family" },
        { value: "genus", label: "Genus" },
        { value: "habitat", label: "Habitat" },
        { value: "herbarium", label: "Herbarium" },
        { value: "latitude1", label: "Latitude" },
        { value: "localityContinued", label: "Locality Continued" },
        { value: "localityName", label: "Locality" },
        { value: "longitude1", label: "Longitude" },
        { value: "maxElevation", label: "Max Elevation" },
        { value: "minElevation", label: "Min Elevation" },
        { value: "notes", label: "Notes" },
        { value: "order", label: "Order" },
        { value: "originalElevationUnit", label: "Elevation Unit" },
        { value: "phenology", label: "Phenology" },
        { value: "preparations", label: "Preparations" },
        { value: "redactLocalityAcceptedTaxon", label: "Redact Locality Accepted Taxon" },
        { value: "redactLocalityCo", label: "Redact Locality Co" },
        { value: "redactLocalityTaxon", label: "Redact Locality Taxon" },
        { value: "scientificName", label: "Scientific Name" },
        { value: "species", label: "Species" },
        { value: "specimenDescription", label: "Specimen Description" },
        { value: "startDateDay", label: "Start Date Day" },
        { value: "startDateMonth", label: "Start Date Month" },
        { value: "startDateYear", label: "Start Date Year" },
        { value: "state", label: "State" },
        { value: "timestampModified", label: "Timestamp Modified" },
        { value: "town", label: "Town" },
        { value: "typeStatusName", label: "Type Status" },
        { value: "verbatimDate", label: "Verbatim Date" },
      ];
      const SORTED_SEARCH_FIELDS = [...SEARCH_FIELDS].sort((a, b) => a.label.localeCompare(b.label));

      return (
        <div className="flex flex-col gap-3 w-full">
          {searchRules.map((rule) => (
            <div key={rule.id} className="flex gap-2 items-center">
              <Select value={rule.index} onValueChange={(value) => handleRuleChange(rule.id, "index", value)}>
                <SelectTrigger className="w-56 rounded-md border-2 border-gray-400 shadow bg-white text-base focus:ring-2 focus:ring-green-500 focus:border-gray-600 transition">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent className="rounded-md border-2 border-gray-400 shadow-lg bg-gray-50 text-base">
                  {SORTED_SEARCH_FIELDS.map((field, idx) => (
                    <SelectItem
                      key={field.value}
                      value={field.value}
                      className={`px-4 py-2 text-base font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 cursor-pointer ${idx !== SORTED_SEARCH_FIELDS.length - 1 ? 'border-b border-gray-200' : ''}`}
                    >
                      {field.label}
                    </SelectItem>
                ))}
                </SelectContent>
              </Select>

              {/* Show numeric filter options for numeric fields */}
              {numericFields.includes(rule.index) && (
                <div className="flex gap-2 items-center">
                  <select
                    value={rule.numericFilter?.type || "="}
                    onChange={(e) => {
                      const type = e.target.value as NumericFilterType;
                      handleNumericFilterChange(
                        rule.id,
                        type,
                        rule.numericFilter?.value || "",
                        rule.numericFilter?.secondValue
                      );
                    }}
                    className="px-3 py-2 rounded-lg border border-green-300 bg-white text-sm"
                  >
                    <option value="=">=</option>
                    <option value="before">Before</option>
                    <option value="after">After</option>
                    <option value="between">Between</option>
                  </select>
                  <Input
                    type="text"
                    value={rule.numericFilter?.value ?? ""}
                    placeholder={rule.index === "latitude1" ? "Latitude" : 
                              rule.index === "longitude1" ? "Longitude" :
                              rule.index === "minElevation" ? "Min Elevation" :
                              rule.index === "maxElevation" ? "Max Elevation" :
                              rule.index === "startDateMonth" ? "Start Month (1-12)" :
                              rule.index === "startDateDay" ? "Start Day (1-31)" :
                              rule.index === "startDateYear" ? "Start Year" :
                              rule.index === "endDateMonth" ? "End Month (1-21)" :
                              rule.index === "endDateDay" ? "End Day (1-31)" :
                              rule.index === "endDateYear" ? "End Year" :
                              rule.index === "barCode" ? "Barcode" :
                              rule.index === "accessionNumber" ? "Accession #" :
                              "Value"}
                    onChange={(e) => {
                      handleNumericFilterChange(
                        rule.id,
                        rule.numericFilter?.type || "=",
                        e.target.value,
                        rule.numericFilter?.secondValue
                      );
                    }}
                    className={`w-32 ${!isValidRule(rule) ? "border-red-500" : ""}`}
                  />
                  {!isValidRule(rule) && (
                    <span className="text-red-500 text-sm">
                      Invalid {rule.index === "latitude1" ? "latitude" : 
                              rule.index === "longitude1" ? "longitude" :
                              rule.index === "minElevation" ? "min elevation" :
                              rule.index === "maxElevation" ? "max elevation" :
                              rule.index === "startDateMonth" ? "start month" :
                              rule.index === "startDateDay" ? "start day" :
                              rule.index === "startDateYear" ? "start year" :
                              rule.index === "endDateMonth" ? "end month" :
                              rule.index === "endDateDay" ? "end day" :
                              rule.index === "endDateYear" ? "end year" :
                              "value"}
                    </span>
                  )}
                  {rule.numericFilter?.type === "between" && (
                    <>
                      <Input
                        type="text"
                        value={rule.numericFilter?.secondValue ?? ""}
                        placeholder="And"
                        onChange={(e) => {
                          handleNumericFilterChange(
                            rule.id,
                            "between",
                            rule.numericFilter?.value || "",
                            e.target.value
                          );
                        }}
                        className={`w-32 ${!isValidRule(rule) ? "border-red-500" : ""}`}
                      />
                    </>
                  )}
                </div>
              )}

              {/* Show text filter options for non-numeric fields */}
              {!numericFields.includes(rule.index) && (
                <div className="flex gap-2 items-center">
                  <select
                    value={rule.textFilter?.type || "="}
                    onChange={(e) => {
                      const type = e.target.value as TextFilterType;
                      handleTextFilterChange(
                        rule.id,
                        type,
                        rule.textFilter?.value || "",
                        rule.textFilter?.secondValue
                      );
                    }}
                    className="px-3 py-2 rounded-lg border border-green-300 bg-white text-sm"
                  >
                    <option value="=">=</option>
                    <option value="contains">Contains</option>
                    <option value="contains_any">Contains Any</option>
                    <option value="in">In</option>
                  </select>
                <Input
                    type="text"
                    value={rule.textFilter?.value ?? ""}
                    placeholder={rule.textFilter?.type === "in" ? "Enter values (comma-separated)..." : `Search ${rule.index}...`}
                    onChange={(e) => {
                      handleTextFilterChange(
                        rule.id,
                        rule.textFilter?.type || "=",
                        e.target.value,
                        rule.textFilter?.secondValue
                      );
                    }}
                    onBlur={(e) => {
                      if (rule.index === "determinedDate") {
                        handleTextFilterChange(
                          rule.id,
                          rule.textFilter?.type || "=",
                          formatDate(e.target.value),
                          rule.textFilter?.secondValue
                        );
                      }
                    }}
                  className="flex-1"
                />
                </div>
              )}

              {searchRules.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSearchRule(rule.id)}
                >
                  ✕
                </Button>
              )}
            </div>
          ))}
          <div className="flex gap-3 justify-between">
            <Button
              onClick={addSearchRule}
              variant="outline"
              className="text-green-700"
            >
              + Add Search Rule
            </Button>
            
            <Button 
              onClick={handleSearch}
              disabled={isLoading}
              className={`min-w-[100px] transition-all duration-200 ${
                isLoading 
                  ? 'scale-95 bg-green-600' 
                  : 'hover:scale-105 active:scale-95 bg-green-700 hover:bg-green-600'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" text="" />
                  <span>Searching...</span>
                </div>
              ) : (
                "Search"
              )}
            </Button>
          </div>
          {/* Filter Checkboxes for Advanced Search */}
          <div className="flex items-center gap-6 justify-center pt-4 border-t border-gray-200">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 group relative">
              <input
                type="checkbox"
                checked={hasValidImage}
                onChange={(e) => {
                  setHasValidImage(e.target.checked);
                  setHasSearched(false);
                }}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span>Has Valid Image</span>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                Only show plants with image attachments (UUID-based images)
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 group relative">
              <input
                type="checkbox"
                checked={hasValidGeoCoords}
                onChange={(e) => {
                  setHasValidGeoCoords(e.target.checked);
                  setHasSearched(false);
                }}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span>Has Geo Coordinates</span>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                Only show plants with valid latitude and longitude coordinates
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 group relative">
              <input
                type="checkbox"
                checked={hasMapView}
                onChange={(e) => {
                  setHasMapView(e.target.checked);
                  if (e.target.checked) {
                    setHasValidGeoCoords(true);
                  }
                }}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span>Map View</span>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                Show results on the map (UI only)
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            </label>
          </div>
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

        {renderSearchModeToggle()}

        <div className="max-w-2xl mx-auto mb-8">
          {searchMode === 'basic' ? renderBasicSearch() : renderAdvancedSearch()}
        </div>
      </div>
    );
  };

  const renderSearchResults = () => {
    // Show initial state when no search has been performed
    if (!hasSearched) {
      return (
        <div className="w-full flex justify-center py-16">
          <div className="text-center space-y-4">
            <div className="text-gray-500">
              <p className="text-lg">Ready to search</p>
              <p className="text-sm">
                {searchMode === 'basic' 
                  ? 'Enter search terms and click the Search button to begin'
                  : 'Enter your search criteria and click the Search button to begin'
                }
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Show loading state when search data is being fetched or when manually loading
    if (isLoading) {
      return (
        <div className="w-full flex justify-center py-16">
          <LoadingCard text="Searching..." />
        </div>
      );
    }

    // If we have searched but no data yet, show preparing message
    if (hasSearched && !searchData) {
      return (
        <div className="w-full flex justify-center py-16">
          <LoadingCard text="Preparing search results..." />
        </div>
      );
    }

    return (
      <div className="relative">
        {/* Results count and Sorter */}
        {searchData && searchData.page && searchData.page.length > 0 && (
          <div className="mb-6 flex justify-between items-center">
            <div className="text-gray-600">
            Showing{" "}
              <span className="font-medium text-green-700">{searchData.page.length}</span>{" "}
            specimens
              {searchMode === 'basic' && basicSearchQuery && (
                <span className="text-sm text-gray-500 ml-2">
                  for &quot;{basicSearchQuery}&quot; ({basicSearchType === 'exact' ? 'exact match' : 'match any'})
                  for &quot;{basicSearchQuery}&quot; ({basicSearchType === 'exact' ? 'exact match' : 'match any'})
                </span>
              )}
              {(hasValidImage || hasValidGeoCoords) && (
                <span className="text-sm text-blue-600 ml-2">
                  {hasValidImage && hasValidGeoCoords ? " (with image & coordinates filter)" :
                   hasValidImage ? " (with image filter)" :
                   " (with coordinates filter)"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="sort-by" className="text-sm font-medium text-gray-600">Sort by:</label>
                <Select value={sort.field === "" || sort.field === "-" ? "-asc" : `${sort.field}-${sort.direction}`}
  onValueChange={(value) => {
    const [field, direction] = value.split('-');
                    setIsLoading(true);
                    setSort({ 
                      field: field === "-" ? "" : field, 
                      direction: direction as 'asc' | 'desc' 
                    });
                    setCurrentPage(1);
                    setTimeout(() => setIsLoading(false), 200);
                  }}
>
  <SelectTrigger className="w-56 rounded-md border-2 border-gray-400 shadow bg-white text-base focus:ring-2 focus:ring-green-500 focus:border-gray-600 transition">
    <SelectValue placeholder="Sort by" />
  </SelectTrigger>
  <SelectContent className="rounded-md border-2 border-gray-400 shadow-lg bg-gray-50 text-base">
    <SelectItem value="-asc" className="px-4 py-2 text-base font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 cursor-pointer border-b border-gray-200">Unsorted</SelectItem>
    {SORT_FIELDS.map((field, idx) => (
      <SelectItem
        key={field.value}
        value={field.value}
        className={`px-4 py-2 text-base font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 cursor-pointer ${idx !== SORT_FIELDS.length - 1 ? 'border-b border-gray-200' : ''}`}
      >
        {field.label}
      </SelectItem>
                  ))}
  </SelectContent>
</Select>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => handlePageChange(1)} disabled={currentPage === 1} aria-label="First page">
                  {/* Double left chevron */}
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17l-5-5 5-5M10 17l-5-5 5-5"/></svg>
                </Button>
                <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page">
                  {/* Single left chevron */}
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17l-5-5 5-5"/></svg>
                </Button>
                <span>
                  Page
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={currentPage}
                    onChange={e => {
                      let page = Number(e.target.value);
                      if (isNaN(page) || page < 1) page = 1;
                      if (page > totalPages) page = totalPages;
                      handlePageChange(page);
                    }}
                    className="w-16 mx-1 text-center border rounded"
                  />
                  of {totalPages}
                </span>
                <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next page">
                  {/* Single right chevron */}
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17l5-5-5-5"/></svg>
                </Button>
                <Button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} aria-label="Last page">
                  {/* Double right chevron */}
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 17l5-5-5-5M10 17l5-5-5-5"/></svg>
                </Button>
                <span className="ml-4 text-gray-600">
                  Displaying records {(currentPage - 1) * RESULTS_PER_PAGE + 1}
                  -
                  {Math.min(currentPage * RESULTS_PER_PAGE, totalResults)}
                  {' '}of {totalResults}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 auto-rows-fr">
          {!searchData?.page || searchData.page.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="text-gray-500 space-y-2">
                <p className="text-lg">No results found.</p>
                <p className="text-sm">
                  {searchMode === 'basic' && basicSearchQuery
                    ? `No specimens found for "${basicSearchQuery}" (${basicSearchType === 'exact' ? 'exact match' : 'match any'}). Try different terms or switch to advanced search.`
                    : 'Try adjusting your search terms or filters.'
                  }
                </p>
              </div>
            </div>
          ) : (
            <>
              {(searchData.page || []).filter((p): p is Doc<"botany"> => p != null).map((plant: Doc<"botany">) => (
                <BotanyCard 
                  key={plant._id} 
                  plant={plant} 
                />
              ))}
              <div className="col-span-full flex justify-center items-center gap-2 mt-8">
                <Button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>{'<<'}</Button>
                <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>{'<'}</Button>
                <span>
                  Page
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={currentPage}
                    onChange={e => {
                      let page = Number(e.target.value);
                      if (isNaN(page) || page < 1) page = 1;
                      if (page > totalPages) page = totalPages;
                      handlePageChange(page);
                    }}
                    className="w-16 mx-1 text-center border rounded"
                  />
                  of {totalPages}
                </span>
                <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>{'>'}</Button>
                <Button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>{'>>'}</Button>
                <span className="ml-4 text-gray-600">
                  Displaying records {(currentPage - 1) * RESULTS_PER_PAGE + 1}
                  -
                  {Math.min(currentPage * RESULTS_PER_PAGE, totalResults)}
                  {' '}of {totalResults}
                </span>
                </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // In Botany component, define handleRectangleComplete so it has access to setHasSearched
  

  const SORT_FIELDS = [
    { value: "scientificName-asc", label: "Scientific Name (A-Z)" },
    { value: "scientificName-desc", label: "Scientific Name (Z-A)" },
    { value: "family-asc", label: "Family (A-Z)" },
    { value: "family-desc", label: "Family (Z-A)" },
    { value: "order-asc", label: "Order (A-Z)" },
    { value: "order-desc", label: "Order (Z-A)" },
    { value: "class-asc", label: "Class (A-Z)" },
    { value: "class-desc", label: "Class (Z-A)" },
    { value: "genus-asc", label: "Genus (A-Z)" },
    { value: "genus-desc", label: "Genus (Z-A)" },
    { value: "species-asc", label: "Species (A-Z)" },
    { value: "species-desc", label: "Species (Z-A)" },
    { value: "country-asc", label: "Country (A-Z)" },
    { value: "country-desc", label: "Country (Z-A)" },
    { value: "state-asc", label: "State (A-Z)" },
    { value: "state-desc", label: "State (Z-A)" },
    { value: "county-asc", label: "County (A-Z)" },
    { value: "county-desc", label: "County (Z-A)" },
    { value: "barCode-asc", label: "Barcode (Asc)" },
    { value: "barCode-desc", label: "Barcode (Desc)" },
    { value: "accessionNumber-asc", label: "Accession # (Asc)" },
    { value: "accessionNumber-desc", label: "Accession # (Desc)" },
    { value: "longitude1-asc", label: "Longitude (Asc)" },
    { value: "longitude1-desc", label: "Longitude (Desc)" },
    { value: "latitude1-asc", label: "Latitude (Asc)" },
    { value: "latitude1-desc", label: "Latitude (Desc)" },
    { value: "minElevation-asc", label: "Min Elevation (Asc)" },
    { value: "minElevation-desc", label: "Min Elevation (Desc)" },
    { value: "maxElevation-asc", label: "Max Elevation (Asc)" },
    { value: "maxElevation-desc", label: "Max Elevation (Desc)" },
    { value: "startDateMonth-asc", label: "Start Date Month (Asc)" },
    { value: "startDateMonth-desc", label: "Start Date Month (Desc)" },
    { value: "startDateDay-asc", label: "Start Date Day (Asc)" },
    { value: "startDateDay-desc", label: "Start Date Day (Desc)" },
    { value: "startDateYear-asc", label: "Start Date Year (Asc)" },
    { value: "startDateYear-desc", label: "Start Date Year (Desc)" },
    { value: "endDateMonth-asc", label: "End Date Month (Asc)" },
    { value: "endDateMonth-desc", label: "End Date Month (Desc)" },
    { value: "endDateDay-asc", label: "End Date Day (Asc)" },
    { value: "endDateDay-desc", label: "End Date Day (Desc)" },
    { value: "endDateYear-asc", label: "End Date Year (Asc)" },
    { value: "endDateYear-desc", label: "End Date Year (Desc)" },
    { value: "collectors-asc", label: "Collectors (A-Z)" },
    { value: "collectors-desc", label: "Collectors (Z-A)" },
    { value: "continent-asc", label: "Continent (A-Z)" },
    { value: "continent-desc", label: "Continent (Z-A)" },
    { value: "determinedDate-asc", label: "Determined Date (A-Z)" },
    { value: "determinedDate-desc", label: "Determined Date (Z-A)" },
    { value: "determiner-asc", label: "Determiner (A-Z)" },
    { value: "determiner-desc", label: "Determiner (Z-A)" },
    { value: "habitat-asc", label: "Habitat (A-Z)" },
    { value: "habitat-desc", label: "Habitat (Z-A)" },
    { value: "herbarium-asc", label: "Herbarium (A-Z)" },
    { value: "herbarium-desc", label: "Herbarium (Z-A)" },
    { value: "localityName-asc", label: "Locality (A-Z)" },
    { value: "localityName-desc", label: "Locality (Z-A)" },
    { value: "phenology-asc", label: "Phenology (A-Z)" },
    { value: "phenology-desc", label: "Phenology (Z-A)" },
    { value: "preparations-asc", label: "Preparations (A-Z)" },
    { value: "preparations-desc", label: "Preparations (Z-A)" },
    { value: "town-asc", label: "Town (A-Z)" },
    { value: "town-desc", label: "Town (Z-A)" },
    { value: "typeStatusName-asc", label: "Type Status (A-Z)" },
    { value: "typeStatusName-desc", label: "Type Status (Z-A)" },
    { value: "verbatimDate-asc", label: "Verbatim Date (A-Z)" },
    { value: "verbatimDate-desc", label: "Verbatim Date (Z-A)" },
    { value: "timestampModified-asc", label: "Last Modified (A-Z)" },
    { value: "timestampModified-desc", label: "Last Modified (Z-A)" },
    { value: "originalElevationUnit-asc", label: "Elevation Unit (A-Z)" },
    { value: "originalElevationUnit-desc", label: "Elevation Unit (Z-A)" },
    { value: "collectorNumber-asc", label: "Collector Number (A-Z)" },
    { value: "collectorNumber-desc", label: "Collector Number (Z-A)" },
    { value: "localityContinued-asc", label: "Locality Continued (A-Z)" },
    { value: "localityContinued-desc", label: "Locality Continued (Z-A)" },
    { value: "redactLocalityCo-asc", label: "Redact Locality Co (A-Z)" },
    { value: "redactLocalityCo-desc", label: "Redact Locality Co (Z-A)" },
    { value: "redactLocalityTaxon-asc", label: "Redact Locality Taxon (A-Z)" },
    { value: "redactLocalityTaxon-desc", label: "Redact Locality Taxon (Z-A)" },
    { value: "redactLocalityAcceptedTaxon-asc", label: "Redact Locality Accepted Taxon (A-Z)" },
    { value: "redactLocalityAcceptedTaxon-desc", label: "Redact Locality Accepted Taxon (Z-A)" },
  ];
  

  return render();
}
