/**
 * Distance calculation utilities using Haversine formula
 * Based on PRD section 6.3
 */

import type { HawkerCenter, Coordinates } from '@/types/hawker';

/**
 * Convert degrees to radians
 * 
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * The Haversine formula determines the great-circle distance between two points
 * on a sphere given their longitudes and latitudes.
 * 
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers, rounded to 1 decimal place
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal
};

/**
 * Calculate distance from user location to hawker center
 * 
 * @param userCoords - User's coordinates
 * @param hawkerCenter - Hawker center to calculate distance to
 * @returns Distance in kilometers
 */
export const calculateDistanceToHawkerCenter = (
  userCoords: Coordinates,
  hawkerCenter: HawkerCenter
): number => {
  return calculateDistance(
    userCoords.lat,
    userCoords.lng,
    hawkerCenter.coordinates.lat,
    hawkerCenter.coordinates.lng
  );
};

/**
 * Sort hawker centers by distance from user location
 * Adds a distance property to each center
 * 
 * @param centers - Array of hawker centers
 * @param userLat - User's latitude
 * @param userLng - User's longitude
 * @returns Sorted array with distance property added
 */
export const sortByDistance = <T extends HawkerCenter>(
  centers: T[],
  userLat: number,
  userLng: number
): (T & { distance: number })[] => {
  return centers
    .map(center => ({
      ...center,
      distance: calculateDistance(
        userLat,
        userLng,
        center.coordinates.lat,
        center.coordinates.lng
      ),
    }))
    .sort((a, b) => a.distance - b.distance);
};

/**
 * Find nearest hawker centers within a radius
 * 
 * @param centers - Array of hawker centers
 * @param userCoords - User's coordinates
 * @param radiusKm - Maximum distance in kilometers
 * @returns Array of centers within radius, sorted by distance
 */
export const findNearestCenters = (
  centers: HawkerCenter[],
  userCoords: Coordinates,
  radiusKm: number = 5
): (HawkerCenter & { distance: number })[] => {
  return sortByDistance(centers, userCoords.lat, userCoords.lng)
    .filter(center => center.distance <= radiusKm);
};

/**
 * Calculate compass bearing from user to hawker center
 * Returns bearing in degrees (0-360)
 * 0 = North, 90 = East, 180 = South, 270 = West
 * 
 * @param userCoords - User's coordinates
 * @param targetCoords - Target coordinates
 * @returns Bearing in degrees
 */
export const calculateBearing = (
  userCoords: Coordinates,
  targetCoords: Coordinates
): number => {
  const lat1 = toRadians(userCoords.lat);
  const lat2 = toRadians(targetCoords.lat);
  const dLon = toRadians(targetCoords.lng - userCoords.lng);

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  const bearing = Math.atan2(y, x);
  const degrees = (bearing * 180) / Math.PI;

  // Normalize to 0-360
  return (degrees + 360) % 360;
};

/**
 * Convert bearing degrees to compass direction
 * 
 * @param bearing - Bearing in degrees (0-360)
 * @returns Compass direction (N, NE, E, SE, S, SW, W, NW)
 */
export const bearingToDirection = (bearing: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
};

/**
 * Format distance for display
 * Shows meters if < 1km, otherwise kilometers
 * 
 * @param distanceKm - Distance in kilometers
 * @returns Formatted string (e.g., "850 m" or "2.3 km")
 */
export const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  }
  const fixed = distanceKm.toFixed(1);
  return `${fixed} km`;
};
