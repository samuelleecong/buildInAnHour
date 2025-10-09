'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import type { HawkerCenterStatus } from '@/types/hawker';
import { HawkerMarker } from './hawker-marker';
import { UserLocationMarker } from './user-location-marker';
import { MapControls } from './map-controls';
import { LeafletSetup } from './leaflet-setup';
import { AutoZoomToBounds } from './auto-zoom-to-bounds';

interface HawkerMapProps {
  hawkerCenters: HawkerCenterStatus[];
  onMarkerClick?: (hawkerCenter: HawkerCenterStatus) => void;
  center?: [number, number];
  zoom?: number;
  userLocation?: [number, number];
  zoomTrigger?: number;
}

const SINGAPORE_CENTER: [number, number] = [1.3521, 103.8198];
const DEFAULT_ZOOM = 12;
const MIN_ZOOM = 11;
const MAX_ZOOM = 18;

export const HawkerMap = ({
  hawkerCenters,
  onMarkerClick,
  center = SINGAPORE_CENTER,
  zoom = DEFAULT_ZOOM,
  userLocation: externalUserLocation,
  zoomTrigger,
}: HawkerMapProps) => {
  const [userLocation, setUserLocation] = useState<[number, number] | undefined>();
  const [locationAccuracy, setLocationAccuracy] = useState<number | undefined>();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sync external user location with internal state
  useEffect(() => {
    if (externalUserLocation) {
      setUserLocation(externalUserLocation);
    }
  }, [externalUserLocation]);

  const handleRequestLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setUserLocation([latitude, longitude]);
          setLocationAccuracy(accuracy);
        },
        (error) => {
          // GeolocationPositionError has code and message properties
          const errorMessages: Record<number, string> = {
            1: 'Location access denied. Please enable location permissions.',
            2: 'Location unavailable. Please check your device settings.',
            3: 'Location request timed out. Please try again.',
          };

          const errorMessage = errorMessages[error.code] || 'Unknown location error';
          console.error('Geolocation error:', {
            code: error.code,
            message: error.message,
            userMessage: errorMessage,
          });

          // Could add error toast here with errorMessage
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser');
      // Could add error toast here
    }
  };

  // Only render map on client side to avoid SSR issues
  if (!isClient) {
    return (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <>
      <LeafletSetup />
      <MapContainer
        center={userLocation || center}
        zoom={zoom}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        className="h-full w-full"
        zoomControl={false}
      >
        {/* OpenStreetMap Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Hawker Center Markers */}
        {hawkerCenters.map((hawkerCenter) => (
          <HawkerMarker
            key={hawkerCenter.id}
            hawkerCenter={hawkerCenter}
            onClick={onMarkerClick}
          />
        ))}

        {/* User Location Marker */}
        {userLocation && (
          <UserLocationMarker position={userLocation} accuracy={locationAccuracy} />
        )}

        {/* Custom Map Controls */}
        <MapControls
          onRequestLocation={handleRequestLocation}
          userLocation={userLocation}
        />

        {/* Auto-zoom to user location and nearby centers */}
        <AutoZoomToBounds
          userLocation={userLocation}
          hawkerCenters={hawkerCenters}
          minCentersToShow={5}
          zoomTrigger={zoomTrigger}
        />
      </MapContainer>
    </>
  );
};
