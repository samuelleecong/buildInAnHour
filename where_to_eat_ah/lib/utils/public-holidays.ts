import publicHolidaysData from "@/lib/data/public-holidays.json";

export interface PublicHoliday {
  date: string;
  day: string;
  holiday: string;
}

/**
 * Get all public holidays from the data file
 */
export const getPublicHolidays = (): PublicHoliday[] => {
  return publicHolidaysData as PublicHoliday[];
};

/**
 * Check if a given date is a public holiday
 * @param date - The date to check
 * @returns The public holiday object if the date is a public holiday, null otherwise
 */
export const getPublicHolidayForDate = (date: Date): PublicHoliday | null => {
  const holidays = getPublicHolidays();
  const dateString = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD

  return holidays.find((holiday) => holiday.date === dateString) || null;
};

/**
 * Check if a given date is a public holiday (boolean version)
 * @param date - The date to check
 * @returns true if the date is a public holiday, false otherwise
 */
export const isPublicHoliday = (date: Date): boolean => {
  return getPublicHolidayForDate(date) !== null;
};
