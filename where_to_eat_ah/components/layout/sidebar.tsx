"use client";

import { useMemo } from "react";
import { HawkerList } from "@/components/hawker/hawker-list";
import { DateSelector } from "@/components/hawker/date-selector";
import { QuickStats } from "@/components/hawker/quick-stats";
import { PublicHolidayAlert } from "@/components/layout/public-holiday-alert";
import { HawkerCenterStatus } from "@/types/hawker";
import { cn } from "@/lib/utils";
import { addDays, isBefore } from "date-fns";

interface SidebarProps {
  hawkerCenters: HawkerCenterStatus[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onSelectHawker?: (hawkerId: number) => void;
  onNearMeClick?: () => void;
  className?: string;
}

export const Sidebar = ({
  hawkerCenters,
  selectedDate,
  onDateChange,
  onSelectHawker,
  onNearMeClick,
  className,
}: SidebarProps) => {
  // Calculate stats
  const stats = useMemo(() => {
    const openCount = hawkerCenters.filter((c) => c.isOpen).length;
    const closedCount = hawkerCenters.filter((c) => !c.isOpen).length;

    // Closing soon = open now but will close within 7 days
    const sevenDaysFromNow = addDays(selectedDate, 7);
    const closingSoonCount = hawkerCenters.filter((c) =>
      c.isOpen && c.closureEnd && isBefore(c.closureEnd, sevenDaysFromNow)
    ).length;

    return { openCount, closedCount, closingSoonCount };
  }, [hawkerCenters, selectedDate]);

  return (
    <aside
      className={cn(
        "hidden lg:flex lg:flex-col lg:w-80 xl:w-96 border-r bg-background overflow-y-auto overflow-x-visible",
        className
      )}
    >
      <DateSelector selectedDate={selectedDate} onDateChange={onDateChange} />
      <div className="px-4 py-3">
        <PublicHolidayAlert selectedDate={selectedDate} />
      </div>
      <QuickStats
        totalCount={hawkerCenters.length}
        openCount={stats.openCount}
        closedCount={stats.closedCount}
        closingSoonCount={stats.closingSoonCount}
        selectedDate={selectedDate}
      />
      <HawkerList
        hawkerCenters={hawkerCenters}
        onSelectHawker={onSelectHawker}
        selectedDate={selectedDate}
        onNearMeClick={onNearMeClick}
      />
    </aside>
  );
};
