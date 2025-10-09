"use client";

import { isSameDay, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const DateSelector = ({ selectedDate, onDateChange }: DateSelectorProps) => {
  const today = startOfDay(new Date());
  const isToday = isSameDay(selectedDate, today);

  const handleToday = () => {
    onDateChange(today);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateChange(startOfDay(date));
    }
  };

  // Disable past dates and dates beyond 1 year
  const isDateDisabled = (date: Date) => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    return date < today || date > maxDate;
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-white border-b sticky top-0 z-20">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarIcon className="h-4 w-4" />
        <span>Showing status for:</span>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleToday}
          variant={isToday ? "default" : "outline"}
          size="lg"
          className="font-bold"
        >
          TODAY
        </Button>

        <DatePicker
          date={selectedDate}
          onDateChange={handleDateSelect}
          disabled={isDateDisabled}
          placeholder="Select date"
          size="lg"
          className="flex-1"
        />
      </div>
    </div>
  );
};
