'use client';

import { useMap } from 'react-leaflet';
import { Plus, Minus, Crosshair, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapControlsProps {
  onRequestLocation?: () => void;
  userLocation?: [number, number];
}

export const MapControls = ({ onRequestLocation, userLocation }: MapControlsProps) => {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const handleRecenter = () => {
    if (userLocation) {
      map.setView(userLocation, 15);
    } else {
      // Default to Singapore center
      map.setView([1.3521, 103.8198], 12);
    }
  };

  const handleFindMe = () => {
    if (onRequestLocation) {
      onRequestLocation();
    }
  };

  return (
    <div className="leaflet-bottom leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <div className="flex flex-col gap-2 bg-white rounded-lg shadow-md p-1">
          {/* Zoom In */}
          <Button
            size="icon"
            variant="ghost"
            onClick={handleZoomIn}
            className="h-10 w-10"
            aria-label="Zoom in"
          >
            <Plus className="h-5 w-5" />
          </Button>

          {/* Zoom Out */}
          <Button
            size="icon"
            variant="ghost"
            onClick={handleZoomOut}
            className="h-10 w-10"
            aria-label="Zoom out"
          >
            <Minus className="h-5 w-5" />
          </Button>

          {/* Divider */}
          <div className="h-px bg-gray-200 mx-1" />

          {/* Recenter */}
          <Button
            size="icon"
            variant="ghost"
            onClick={handleRecenter}
            className="h-10 w-10"
            aria-label="Recenter map"
          >
            <Crosshair className="h-5 w-5" />
          </Button>

          {/* Find Me (only show if location not yet granted) */}
          {!userLocation && onRequestLocation && (
            <Button
              size="icon"
              variant="ghost"
              onClick={handleFindMe}
              className="h-10 w-10"
              aria-label="Find my location"
            >
              <Navigation className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
