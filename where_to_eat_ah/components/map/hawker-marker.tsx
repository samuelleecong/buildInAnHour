'use client';

import { useState, useRef, useEffect } from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import type { HawkerCenterStatus, StatusType } from '@/types/hawker';

interface HawkerMarkerProps {
  hawkerCenter: HawkerCenterStatus;
  onClick?: (hawkerCenter: HawkerCenterStatus) => void;
}

const getMarkerColor = (status: StatusType, isNearest: boolean): string => {
  // If this is one of the nearest 3, use amber/gold color
  if (isNearest) {
    return '#f59e0b'; // Amber-500
  }

  // Otherwise use status-based colors
  switch (status) {
    case 'open':
      return '#22c55e'; // Green
    case 'closed-cleaning':
      return '#ef4444'; // Red
    case 'closed-maintenance':
      return '#f97316'; // Orange
    case 'unknown':
    default:
      return '#6b7280'; // Gray
  }
};

const getStatusLabel = (status: StatusType): string => {
  switch (status) {
    case 'open':
      return 'Open';
    case 'closed-cleaning':
      return 'Closed (Cleaning)';
    case 'closed-maintenance':
      return 'Closed (Maintenance)';
    case 'unknown':
    default:
      return 'Unknown';
  }
};

const createCustomIcon = (status: StatusType, isNearest: boolean, rank?: number) => {
  const color = getMarkerColor(status, isNearest);

  // For nearest markers, add a star/crown symbol
  const innerSymbol = isNearest && rank
    ? `<text x="16" y="20" text-anchor="middle" fill="#fff" font-size="14" font-weight="bold">${rank}</text>`
    : `<circle cx="16" cy="16" r="6" fill="#fff"/>`;

  const svgIcon = `
    <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24C32 7.163 24.837 0 16 0z"
        fill="${color}"
        stroke="#fff"
        stroke-width="2"/>
      ${innerSymbol}
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });
};

export const HawkerMarker = ({ hawkerCenter, onClick }: HawkerMarkerProps) => {
  const isNearest = hawkerCenter.nearestRank !== undefined;
  const icon = createCustomIcon(hawkerCenter.statusType, isNearest, hawkerCenter.nearestRank);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [hasShownTooltip, setHasShownTooltip] = useState(false);
  const markerRef = useRef<L.Marker>(null);

  // Detect touch device on mount
  useEffect(() => {
    const checkTouchDevice = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches
      );
    };
    setIsTouchDevice(checkTouchDevice());
  }, []);

  const handleMarkerClick = () => {
    if (isTouchDevice) {
      // Mobile: First tap shows tooltip, second tap navigates
      if (hasShownTooltip && onClick) {
        onClick(hawkerCenter);
        setHasShownTooltip(false); // Reset for next time
      } else {
        // First tap: mark that tooltip has been shown
        setHasShownTooltip(true);
        // Tooltip will show automatically via Leaflet
      }
    } else {
      // Desktop: Single click navigates directly
      if (onClick) {
        onClick(hawkerCenter);
      }
    }
  };

  return (
    <Marker
      ref={markerRef}
      position={[hawkerCenter.coordinates.lat, hawkerCenter.coordinates.lng]}
      icon={icon}
      eventHandlers={{
        click: handleMarkerClick,
      }}
    >
      {/* Tooltip for hover on desktop / first tap on mobile */}
      <Tooltip direction="top" offset={[0, -35]} opacity={0.95} permanent={false}>
        <div className="text-sm font-medium">
          <div>{hawkerCenter.name}</div>
          <div className="text-xs font-normal mt-1">
            <span
              className={`inline-block ${
                hawkerCenter.statusType === 'open'
                  ? 'text-green-600'
                  : hawkerCenter.statusType === 'closed-cleaning'
                  ? 'text-red-600'
                  : hawkerCenter.statusType === 'closed-maintenance'
                  ? 'text-orange-600'
                  : 'text-gray-600'
              }`}
            >
              {getStatusLabel(hawkerCenter.statusType)}
            </span>
            {hawkerCenter.distance !== undefined && (
              <span className="text-gray-600 block mt-0.5">
                {hawkerCenter.distance.toFixed(1)} km away
              </span>
            )}
          </div>
        </div>
      </Tooltip>
    </Marker>
  );
};
