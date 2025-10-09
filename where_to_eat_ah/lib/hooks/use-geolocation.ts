"use client";

import { useState, useEffect, useCallback } from "react";

export interface GeolocationState {
  coordinates: { lat: number; lng: number } | null;
  error: string | null;
  loading: boolean;
  permission: PermissionState | null;
}

export interface UseGeolocationReturn extends GeolocationState {
  requestLocation: () => void;
  clearLocation: () => void;
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState<PermissionState | null>(null);

  // Check initial permission state
  useEffect(() => {
    if (typeof navigator !== "undefined" && "permissions" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((result) => {
          setPermission(result.state);

          // Listen for permission changes
          result.addEventListener("change", () => {
            setPermission(result.state);
          });
        })
        .catch(() => {
          // Permission API not supported
          setPermission(null);
        });
    }
  }, []);

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setCoordinates({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
    setError(null);
    setLoading(false);
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    let errorMessage = "Unable to retrieve your location";

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "Location permission denied. Please enable location access in your browser settings.";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        errorMessage = "Location request timed out.";
        break;
    }

    setError(errorMessage);
    setCoordinates(null);
    setLoading(false);
  }, []);

  const requestLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    });
  }, [handleSuccess, handleError]);

  const clearLocation = useCallback(() => {
    setCoordinates(null);
    setError(null);
    setLoading(false);
  }, []);

  // Automatically request location on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    coordinates,
    error,
    loading,
    permission,
    requestLocation,
    clearLocation,
  };
};
