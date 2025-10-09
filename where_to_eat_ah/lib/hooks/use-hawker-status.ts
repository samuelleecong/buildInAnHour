"use client";

import { useMemo } from "react";
import { HawkerCenter, HawkerCenterStatus } from "@/types/hawker";
import { calculateStatus } from "@/lib/utils/closure-calculator";

export interface UseHawkerStatusOptions {
  hawkerCenters: HawkerCenter[];
  selectedDate: Date;
  userLocation?: { lat: number; lng: number } | null;
}

export const useHawkerStatus = ({
  hawkerCenters,
  selectedDate,
  userLocation,
}: UseHawkerStatusOptions): HawkerCenterStatus[] => {
  return useMemo(() => {
    return hawkerCenters.map((center) => {
      const status = calculateStatus(center, selectedDate);

      // Calculate distance if user location is provided
      let distance: number | undefined;
      if (userLocation) {
        distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          center.coordinates.lat,
          center.coordinates.lng
        );
      }

      return {
        id: center.id,
        name: center.name,
        coordinates: center.coordinates,
        address: center.address,
        isOpen: status.isOpen,
        statusType: status.statusType,
        closureReason: status.closureReason,
        closureEnd: status.closureEnd,
        stallCounts: center.stallCounts,
        photos: center.photos,
        links: center.links,
        distance,
      };
    });
  }, [hawkerCenters, selectedDate, userLocation]);
};

// Helper function for distance calculation (Haversine formula)
const calculateDistance = (
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

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};
