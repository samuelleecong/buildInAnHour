/**
 * Status calculation logic for hawker centers
 * Based on PRD section 6.2
 */

import { isDateInRange } from './date-utils';
import type { HawkerCenter, CalculatedStatus, ClosurePeriod } from '@/types/hawker';

/**
 * Calculate the operational status of a hawker center for a given date
 * Business Logic:
 * 1. Check if date falls within Q1/Q2/Q3/Q4 cleaning periods
 * 2. Check if date falls within other_works period
 * 3. Priority: other_works (maintenance) > quarterly_cleaning
 * 4. Return status with reason
 * 
 * @param hawkerCenter - The hawker center to check
 * @param targetDate - The date to check status for
 * @returns Calculated status object
 */
export const calculateStatus = (
  hawkerCenter: HawkerCenter,
  targetDate: Date
): CalculatedStatus => {
  // Normalize target date to start of day for consistent comparison
  const normalizedDate = new Date(targetDate);
  normalizedDate.setHours(0, 0, 0, 0);

  let maintenanceClosure: ClosurePeriod | null = null;
  let cleaningClosure: ClosurePeriod | null = null;

  // Check all closure periods
  for (const closure of hawkerCenter.closures) {
    if (!closure.startDate || !closure.endDate) {
      continue; // Skip TBC or invalid dates
    }

    const isWithin = isDateInRange(normalizedDate, closure.startDate, closure.endDate);

    if (isWithin) {
      // Separate maintenance from cleaning for priority handling
      if (closure.type === 'maintenance') {
        maintenanceClosure = closure;
        // Don't break - continue checking for other closures
      } else if (closure.type === 'cleaning') {
        cleaningClosure = closure;
      }
    }
  }

  // Priority: maintenance over cleaning
  if (maintenanceClosure) {
    return {
      isOpen: false,
      statusType: 'closed-maintenance',
      closureReason: maintenanceClosure.remarks || 'Maintenance/Other Works',
      closureEnd: maintenanceClosure.endDate || undefined,
    };
  }

  if (cleaningClosure) {
    const quarterLabel = cleaningClosure.quarter ? `${cleaningClosure.quarter} ` : '';
    return {
      isOpen: false,
      statusType: 'closed-cleaning',
      closureReason: cleaningClosure.remarks || `${quarterLabel}Cleaning`,
      closureEnd: cleaningClosure.endDate || undefined,
    };
  }

  // No closures found for this date
  return {
    isOpen: true,
    statusType: 'open',
  };
};

/**
 * Get upcoming closure periods starting from a given date
 * Sorted by start date (earliest first)
 * 
 * @param hawkerCenter - The hawker center to check
 * @param fromDate - Start date to look for upcoming closures (default: today)
 * @returns Array of upcoming closure periods
 */
export const getUpcomingClosures = (
  hawkerCenter: HawkerCenter,
  fromDate: Date = new Date()
): ClosurePeriod[] => {
  const normalizedFromDate = new Date(fromDate);
  normalizedFromDate.setHours(0, 0, 0, 0);

  return hawkerCenter.closures
    .filter(closure => {
      if (!closure.startDate) return false;
      return closure.startDate >= normalizedFromDate;
    })
    .sort((a, b) => {
      if (!a.startDate || !b.startDate) return 0;
      return a.startDate.getTime() - b.startDate.getTime();
    });
};

/**
 * Get the next closure period after a given date
 * 
 * @param hawkerCenter - The hawker center to check
 * @param fromDate - Date to start looking from (default: today)
 * @returns Next closure period or null if none found
 */
export const getNextClosure = (
  hawkerCenter: HawkerCenter,
  fromDate: Date = new Date()
): ClosurePeriod | null => {
  const upcomingClosures = getUpcomingClosures(hawkerCenter, fromDate);
  return upcomingClosures.length > 0 ? upcomingClosures[0] : null;
};

/**
 * Check if a hawker center has any closures scheduled
 * 
 * @param hawkerCenter - The hawker center to check
 * @returns true if there are any valid closure periods
 */
export const hasScheduledClosures = (hawkerCenter: HawkerCenter): boolean => {
  return hawkerCenter.closures.some(
    closure => closure.startDate !== null && closure.endDate !== null
  );
};

/**
 * Get all closure periods for a specific quarter
 * 
 * @param hawkerCenter - The hawker center to check
 * @param quarter - Quarter to filter by ('Q1', 'Q2', 'Q3', 'Q4')
 * @returns Array of closure periods for the specified quarter
 */
export const getClosuresByQuarter = (
  hawkerCenter: HawkerCenter,
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4'
): ClosurePeriod[] => {
  return hawkerCenter.closures.filter(
    closure => closure.quarter === quarter && closure.type === 'cleaning'
  );
};
