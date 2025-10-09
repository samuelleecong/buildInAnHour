"use client";

import { CheckCircle2, XCircle, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface QuickStatsProps {
  totalCount: number;
  openCount: number;
  closedCount: number;
  closingSoonCount?: number;
  selectedDate: Date;
  className?: string;
}

export const QuickStats = ({
  totalCount,
  openCount,
  closedCount,
  closingSoonCount = 0,
  selectedDate,
  className,
}: QuickStatsProps) => {
  const isToday = format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  const dateLabel = isToday ? "Today" : format(selectedDate, "MMM d");

  return (
    <div
      className={cn(
        "bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-y border-border/50 px-4 py-3",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Date Label */}
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            Status for {dateLabel}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Open */}
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1">
              <span className="text-lg font-bold text-emerald-600">{openCount}</span>
              <span className="text-xs text-muted-foreground">open</span>
            </div>
          </div>

          {/* Closed */}
          <div className="flex items-center gap-1.5">
            <XCircle className="h-4 w-4 text-red-500" />
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1">
              <span className="text-lg font-bold text-red-600">{closedCount}</span>
              <span className="text-xs text-muted-foreground">closed</span>
            </div>
          </div>

          {/* Closing Soon (if any) */}
          {closingSoonCount > 0 && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-amber-500" />
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1">
                <span className="text-lg font-bold text-amber-600">{closingSoonCount}</span>
                <span className="text-xs text-muted-foreground">closing soon</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Total Count (subtle) */}
      <div className="mt-2 text-xs text-muted-foreground text-center sm:text-left">
        {totalCount} hawker center{totalCount !== 1 ? "s" : ""} total
      </div>
    </div>
  );
};
