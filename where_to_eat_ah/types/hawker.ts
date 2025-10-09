/**
 * Type definitions for the Hawker Center tracking application
 * Based on PRD sections 4.3.1, 4.3.2, 4.3.3
 */

// ============================================================================
// Source Data Types (from CSV)
// ============================================================================

export interface HawkerCenterRaw {
  serial_no: string;
  name: string;

  // Q1 Cleaning
  q1_cleaningstartdate: string;
  q1_cleaningenddate: string;
  remarks_q1: string;

  // Q2 Cleaning
  q2_cleaningstartdate: string;
  q2_cleaningenddate: string;
  remarks_q2: string;

  // Q3 Cleaning
  q3_cleaningstartdate: string;
  q3_cleaningenddate: string;
  remarks_q3: string;

  // Q4 Cleaning
  q4_cleaningstartdate: string;
  q4_cleaningenddate: string;
  remarks_q4: string;

  // Other Works
  other_works_startdate: string;
  other_works_enddate: string;
  remarks_other_works: string;

  // Location
  latitude_hc: string;
  longitude_hc: string;
  address_myenv: string;

  // Details
  photourl: string;
  no_of_market_stalls: string;
  no_of_food_stalls: string;
  description_myenv: string;
  status: string;
  google_3d_view: string;
  google_for_stall: string;
}

// ============================================================================
// Processed Data Types
// ============================================================================

export type ClosureType = 'cleaning' | 'maintenance';
export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4';
export type HawkerCenterStatusValue = 'existing' | 'new' | 'closed';

export interface ClosurePeriod {
  startDate: Date | null;
  endDate: Date | null;
  type: ClosureType;
  quarter?: Quarter;
  remarks: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface StallCounts {
  food: number;
  market: number;
  total: number;
}

export interface Photos {
  main?: string;
  google3D?: string;
}

export interface Links {
  googleMaps?: string;
}

export interface HawkerCenter {
  id: number;
  name: string;

  // Location
  coordinates: Coordinates;
  address: string;

  // Closure Schedule
  closures: ClosurePeriod[];

  // Facility Info
  stallCounts: StallCounts;
  description: string;
  yearBuilt?: string;
  status: HawkerCenterStatusValue;

  // Media
  photos: Photos;

  // External Links
  links: Links;
}

// ============================================================================
// Runtime Status Types
// ============================================================================

export type StatusType = 'open' | 'closed-cleaning' | 'closed-maintenance' | 'unknown';

export interface HawkerCenterStatus {
  id: number;
  name: string;
  coordinates: Coordinates;
  address: string;

  // Calculated for selected date
  isOpen: boolean;
  statusType: StatusType;
  closureReason?: string;
  closureEnd?: Date;

  // Facility info (needed for display)
  stallCounts?: StallCounts;
  photos?: Photos;
  links?: Links;

  // If user location enabled
  distance?: number; // in km
  bearing?: number; // compass direction

  // Ranking for nearest centers (1, 2, 3 for top 3 nearest)
  nearestRank?: number;
}

// ============================================================================
// Status Calculation Types
// ============================================================================

export interface CalculatedStatus {
  isOpen: boolean;
  statusType: StatusType;
  closureReason?: string;
  closureEnd?: Date;
}

// ============================================================================
// JSON Data Types (for deserialization)
// ============================================================================

export interface ClosurePeriodJSON {
  startDate: string | null;
  endDate: string | null;
  type: ClosureType;
  quarter?: Quarter;
  remarks: string;
}

export interface HawkerCenterJSON {
  id: number;
  name: string;
  coordinates: Coordinates;
  address: string;
  closures: ClosurePeriodJSON[];
  stallCounts: StallCounts;
  description: string;
  yearBuilt?: string;
  status: HawkerCenterStatusValue;
  photos: Photos;
  links: Links;
}
