'use client';

import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import type { HawkerCenterStatus } from '@/types/hawker';
import L from 'leaflet';

interface AutoZoomToBoundsProps {
  userLocation: [number, number] | undefined;
  hawkerCenters: HawkerCenterStatus[];
  minCentersToShow?: number;
  zoomTrigger?: number;
}

const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const AutoZoomToBounds = ({
  userLocation,
  hawkerCenters,
  minCentersToShow = 5,
  zoomTrigger = 0,
}: AutoZoomToBoundsProps) => {
  const map = useMap();
  const hasZoomedRef = useRef(false);

  useEffect(() => {
    // Allow re-zoom if zoomTrigger changes (even if already zoomed)
    const shouldZoom = zoomTrigger > 0 || !hasZoomedRef.current;

    if (!userLocation || !shouldZoom || hawkerCenters.length === 0) {
      return;
    }

    // Calculate distances to all hawker centers
    const centersWithDistance = hawkerCenters.map((center) => ({
      center,
      distance: calculateDistance(
        userLocation[0],
        userLocation[1],
        center.coordinates.lat,
        center.coordinates.lng
      ),
    }));

    // Sort by distance and get the nearest N centers
    const nearestCenters = centersWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, minCentersToShow);

    // Create bounds that include user location and nearest centers
    const bounds = L.latLngBounds([]);
    bounds.extend(userLocation);

    nearestCenters.forEach(({ center }) => {
      bounds.extend([center.coordinates.lat, center.coordinates.lng]);
    });

    // Fit the map to these bounds with padding
    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 15,
      animate: true,
      duration: 1,
    });

    hasZoomedRef.current = true;
  }, [userLocation, hawkerCenters, minCentersToShow, map, zoomTrigger]);

  return null;
};
