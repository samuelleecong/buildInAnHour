"use client";

import { useState, useMemo } from "react";
import { HawkerCard } from "./hawker-card";
import { QuickFilters, QuickFilterType } from "./quick-filters";
import { HawkerCenterStatus } from "@/types/hawker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Search, X } from "lucide-react";
import { addDays, isBefore } from "date-fns";

interface HawkerListProps {
  hawkerCenters: HawkerCenterStatus[];
  onSelectHawker?: (hawkerId: number) => void;
  selectedDate?: Date;
  onNearMeClick?: () => void;
}

type SortBy = "distance" | "name";

export const HawkerList = ({ hawkerCenters, onSelectHawker, selectedDate = new Date(), onNearMeClick }: HawkerListProps) => {
  const [sortBy, setSortBy] = useState<SortBy>("distance");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<QuickFilterType>("all");

  // Calculate stats
  const stats = useMemo(() => {
    const openCount = hawkerCenters.filter((c) => c.isOpen).length;
    const closedCount = hawkerCenters.filter((c) => !c.isOpen).length;

    // Closing soon = open now but will close within 7 days
    const sevenDaysFromNow = addDays(selectedDate, 7);
    const closingSoonCount = hawkerCenters.filter((c) =>
      c.isOpen && c.closureEnd && isBefore(c.closureEnd, sevenDaysFromNow)
    ).length;

    const hasUserLocation = hawkerCenters.some((c) => c.distance !== undefined);

    return { openCount, closedCount, closingSoonCount, hasUserLocation };
  }, [hawkerCenters, selectedDate]);

  // Filter hawker centers based on active filter and search term
  const filteredCenters = useMemo(() => {
    let centers = hawkerCenters;

    // Apply quick filter
    if (activeFilter === "open") {
      centers = centers.filter((c) => c.isOpen);
    } else if (activeFilter === "near-me") {
      centers = centers.filter((c) => c.distance !== undefined).slice(0, 10); // Top 10 nearest
    } else if (activeFilter === "closing-soon") {
      const sevenDaysFromNow = addDays(selectedDate, 7);
      centers = centers.filter(
        (c) => c.isOpen && c.closureEnd && isBefore(c.closureEnd, sevenDaysFromNow)
      );
    }

    // Apply search filter
    if (searchTerm) {
      centers = centers.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return centers;
  }, [hawkerCenters, activeFilter, searchTerm, selectedDate]);

  // Sort the filtered centers
  const sortedCenters = useMemo(() => {
    return [...filteredCenters].sort((a, b) => {
      if (sortBy === "distance") {
        // If no distance, put at end
        if (!a.distance) return 1;
        if (!b.distance) return -1;
        return a.distance - b.distance;
      } else {
        return a.name.localeCompare(b.name);
      }
    });
  }, [filteredCenters, sortBy]);

  const handleToggleSort = () => {
    setSortBy((prev) => (prev === "distance" ? "name" : "distance"));
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleFilterChange = (filter: QuickFilterType) => {
    setActiveFilter(filter);
    // Trigger zoom when "Near Me" is clicked
    if (filter === "near-me" && onNearMeClick) {
      onNearMeClick();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Quick Filters */}
      <div className="p-4 border-b bg-muted/30">
        <QuickFilters
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          hasUserLocation={stats.hasUserLocation}
          openCount={stats.openCount}
          closingSoonCount={stats.closingSoonCount}
        />
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search hawker centers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort and Count */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {filteredCenters.length} hawker center{filteredCenters.length !== 1 ? 's' : ''}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleSort}
            className="gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            Sort by {sortBy === "distance" ? "Name" : "Distance"}
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sortedCenters.length > 0 ? (
          sortedCenters.map((center) => (
            <HawkerCard
              key={center.id}
              hawkerCenter={center}
              onClick={() => onSelectHawker?.(center.id)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground font-medium">No hawker centers found</p>
            <p className="text-sm text-muted-foreground/75 mt-1">
              Try adjusting your filters or search term
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
