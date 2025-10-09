'use client';

import { Marker, Circle } from 'react-leaflet';
import L from 'leaflet';

interface UserLocationMarkerProps {
  position: [number, number];
  accuracy?: number; // Accuracy radius in meters
}

const createUserLocationIcon = () => {
  const svgIcon = `
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8" fill="#3b82f6" stroke="#fff" stroke-width="3"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'user-location-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

export const UserLocationMarker = ({ position, accuracy }: UserLocationMarkerProps) => {
  const icon = createUserLocationIcon();

  return (
    <>
      {/* Accuracy circle */}
      {accuracy && (
        <Circle
          center={position}
          radius={accuracy}
          pathOptions={{
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.1,
            weight: 1,
          }}
        />
      )}

      {/* User location dot */}
      <Marker position={position} icon={icon} zIndexOffset={1000} />
    </>
  );
};
