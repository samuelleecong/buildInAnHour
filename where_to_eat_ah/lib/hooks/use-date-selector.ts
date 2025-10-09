"use client";

import { useState, useCallback, useEffect } from "react";
import { addDays, startOfDay } from "date-fns";

export interface UseDateSelectorReturn {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  selectToday: () => void;
  selectTomorrow: () => void;
  selectDate: (date: Date) => void;
  isToday: boolean;
  isTomorrow: boolean;
}

const SESSION_STORAGE_KEY = "hawker-selected-date";

export const useDateSelector = (): UseDateSelectorReturn => {
  // Initialize with today's date
  const [selectedDate, setSelectedDateState] = useState<Date>(() => {
    // Try to restore from sessionStorage on client side
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (stored) {
          const parsed = new Date(stored);
          // Only use stored date if it's valid and not in the past
          if (!isNaN(parsed.getTime()) && parsed >= startOfDay(new Date())) {
            return startOfDay(parsed);
          }
        }
      } catch (error) {
        // If parsing fails, fall back to today
        console.error("Failed to parse stored date:", error);
      }
    }
    return startOfDay(new Date());
  });

  // Persist to sessionStorage whenever date changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, selectedDate.toISOString());
      } catch (error) {
        console.error("Failed to save date to sessionStorage:", error);
      }
    }
  }, [selectedDate]);

  const setSelectedDate = useCallback((date: Date) => {
    setSelectedDateState(startOfDay(date));
  }, []);

  const selectToday = useCallback(() => {
    setSelectedDateState(startOfDay(new Date()));
  }, []);

  const selectTomorrow = useCallback(() => {
    setSelectedDateState(startOfDay(addDays(new Date(), 1)));
  }, []);

  const selectDate = useCallback((date: Date) => {
    setSelectedDateState(startOfDay(date));
  }, []);

  // Calculate if current selection is today or tomorrow
  const today = startOfDay(new Date());
  const tomorrow = startOfDay(addDays(new Date(), 1));

  const isToday = selectedDate.getTime() === today.getTime();
  const isTomorrow = selectedDate.getTime() === tomorrow.getTime();

  return {
    selectedDate,
    setSelectedDate,
    selectToday,
    selectTomorrow,
    selectDate,
    isToday,
    isTomorrow,
  };
};
