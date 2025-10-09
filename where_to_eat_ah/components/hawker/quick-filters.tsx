"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, MapPin, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type QuickFilterType = "all" | "open" | "near-me" | "closing-soon";

interface QuickFiltersProps {
  activeFilter: QuickFilterType;
  onFilterChange: (filter: QuickFilterType) => void;
  hasUserLocation?: boolean;
  openCount?: number;
  closingSoonCount?: number;
  className?: string;
}

export const QuickFilters = ({
  activeFilter,
  onFilterChange,
  hasUserLocation = false,
  openCount,
  closingSoonCount,
  className,
}: QuickFiltersProps) => {
  const filters = [
    {
      id: "all" as QuickFilterType,
      label: "All",
      icon: null,
      count: undefined,
      disabled: false,
    },
    {
      id: "open" as QuickFilterType,
      label: "Open Now",
      icon: CheckCircle2,
      count: openCount,
      disabled: false,
    },
    {
      id: "near-me" as QuickFilterType,
      label: "Near Me",
      icon: MapPin,
      count: undefined,
      disabled: !hasUserLocation,
    },
    {
      id: "closing-soon" as QuickFilterType,
      label: "Closing Soon",
      icon: Clock,
      count: closingSoonCount,
      disabled: false,
    },
  ];

  return (
    <div className={cn("flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide", className)}>
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeFilter === filter.id;

        return (
          <button
            key={filter.id}
            onClick={() => !filter.disabled && onFilterChange(filter.id)}
            disabled={filter.disabled}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium",
              "transition-all duration-200 whitespace-nowrap",
              "border border-border",
              isActive
                ? "bg-primary text-primary-foreground shadow-md scale-105"
                : "bg-background hover:bg-accent hover:border-primary/30",
              filter.disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span>{filter.label}</span>
            {filter.count !== undefined && (
              <Badge
                variant="secondary"
                className={cn(
                  "ml-1 px-1.5 py-0 h-5 min-w-[20px] text-xs",
                  isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted"
                )}
              >
                {filter.count}
              </Badge>
            )}
          </button>
        );
      })}

      {/* Clear All Button (shown when filter is active) */}
      {activeFilter !== "all" && (
        <button
          onClick={() => onFilterChange("all")}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
          <span>Clear</span>
        </button>
      )}
    </div>
  );
};
