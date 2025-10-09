"use client";

import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DateSelector } from "@/components/hawker/date-selector";
import { HawkerList } from "@/components/hawker/hawker-list";
import { QuickStats } from "@/components/hawker/quick-stats";
import { PublicHolidayAlert } from "@/components/layout/public-holiday-alert";
import { HawkerCenterStatus } from "@/types/hawker";
import { List, ChevronUp } from "lucide-react";
import { addDays, isBefore } from "date-fns";

interface MobileNavProps {
  hawkerCenters: HawkerCenterStatus[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onSelectHawker?: (hawkerId: number) => void;
  onNearMeClick?: () => void;
}

export const MobileNav = ({
  hawkerCenters,
  selectedDate,
  onDateChange,
  onSelectHawker,
  onNearMeClick,
}: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

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

  const handleSelectHawker = (hawkerId: number) => {
    onSelectHawker?.(hawkerId);
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="w-full rounded-t-2xl rounded-b-none h-16 shadow-2xl border-t-2 border-primary/20 bg-gradient-to-t from-primary to-primary/90 hover:from-primary/90 hover:to-primary relative"
          >
            {/* Drag Indicator */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-primary-foreground/40" />

            <div className="flex items-center gap-3">
              <ChevronUp className="h-5 w-5 animate-bounce" />
              <div className="flex flex-col items-start">
                <span className="font-bold">View All Hawker Centers</span>
                <span className="text-xs opacity-90">{stats.openCount} open • {stats.closedCount} closed</span>
              </div>
              <List className="h-5 w-5" />
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[90vh] p-0 rounded-t-2xl">
          <SheetHeader className="p-4 border-b relative">
            {/* Drag Handle */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-muted-foreground/20" />
            <SheetTitle className="mt-2">Hawker Centers</SheetTitle>
          </SheetHeader>
          <div className="h-full flex flex-col">
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
            <div className="flex-1 overflow-hidden">
              <HawkerList
                hawkerCenters={hawkerCenters}
                onSelectHawker={handleSelectHawker}
                selectedDate={selectedDate}
                onNearMeClick={onNearMeClick}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
