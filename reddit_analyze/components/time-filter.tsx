"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimeFilter } from "@/types/reddit";

interface TimeFilterProps {
  value: TimeFilter;
  onChange: (value: TimeFilter) => void;
  disabled?: boolean;
}

const timeFilterOptions: { value: TimeFilter; label: string }[] = [
  { value: "hour", label: "Past Hour" },
  { value: "day", label: "Past 24 Hours" },
  { value: "week", label: "Past Week" },
  { value: "month", label: "Past Month" },
  { value: "year", label: "Past Year" },
  { value: "all", label: "All Time" },
];

export const TimeFilterSelect = ({
  value,
  onChange,
  disabled = false,
}: TimeFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full sm:w-[180px]" aria-label="Time filter">
        <SelectValue placeholder="Select time period" />
      </SelectTrigger>
      <SelectContent>
        {timeFilterOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
