/**
 * Date utility functions for parsing and comparing dates
 * Based on PRD section 6.1
 */

import { parse, isValid, isWithinInterval } from 'date-fns';

/**
 * Parse date string from CSV format (D/M/YYYY)
 * Examples: "3/3/2025", "10/12/2025"
 * 
 * @param dateString - Date string in D/M/YYYY format
 * @returns Date object or null if invalid/NA/nil
 */
export const parseDate = (dateString: string | undefined | null): Date | null => {
  if (!dateString) return null;
  
  const normalized = dateString.trim().toLowerCase();
  
  // Handle NA, nil, TBC cases
  if (normalized === 'na' || normalized === 'nil' || normalized === 'tbc' || normalized === '') {
    return null;
  }
  
  try {
    // Parse D/M/YYYY format
    const parsed = parse(dateString, 'd/M/yyyy', new Date());
    
    if (isValid(parsed)) {
      return parsed;
    }
    
    return null;
  } catch (error) {
    console.error(`Failed to parse date: ${dateString}`, error);
    return null;
  }
};

/**
 * Check if a target date falls within a date range
 * 
 * @param targetDate - The date to check
 * @param startDate - Start of the range (inclusive)
 * @param endDate - End of the range (inclusive)
 * @returns true if targetDate is within the range
 */
export const isDateInRange = (
  targetDate: Date,
  startDate: Date | null,
  endDate: Date | null
): boolean => {
  if (!startDate || !endDate) return false;
  
  try {
    return isWithinInterval(targetDate, {
      start: startDate,
      end: endDate,
    });
  } catch (error) {
    console.error('Date range check failed', error);
    return false;
  }
};

/**
 * Normalize a date to start of day (00:00:00)
 * Useful for comparing dates without time component
 * 
 * @param date - Date to normalize
 * @returns Date set to start of day
 */
export const normalizeToStartOfDay = (date: Date): Date => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

/**
 * Check if two dates are the same day
 * 
 * @param date1 - First date
 * @param date2 - Second date
 * @returns true if both dates are the same day
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Get today's date normalized to start of day
 * 
 * @returns Today's date at 00:00:00
 */
export const getToday = (): Date => {
  return normalizeToStartOfDay(new Date());
};
