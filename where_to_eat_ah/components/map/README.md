# Map Components

This directory contains all map-related components for the "Where To Eat Ah?" hawker center tracking application.

## Components

### HawkerMap (`hawker-map.tsx`)
Main map component that integrates Leaflet with React-Leaflet.

**Features:**
- Centers on Singapore (1.3521° N, 103.8198° E)
- Zoom levels 11-18
- Displays all hawker center markers
- Handles geolocation requests
- Client-side rendering only (prevents SSR issues)

**Props:**
```typescript
interface HawkerMapProps {
  hawkerCenters: HawkerCenterStatus[];
  onMarkerClick?: (hawkerCenter: HawkerCenterStatus) => void;
  center?: [number, number];
  zoom?: number;
}
```

**Usage:**
```tsx
import { HawkerMap } from '@/components/map';

<HawkerMap
  hawkerCenters={centers}
  onMarkerClick={(center) => console.log(center)}
/>
```

### HawkerMarker (`hawker-marker.tsx`)
Custom marker component for hawker centers.

**Features:**
- Color-coded by status (green=open, red=closed, orange=maintenance)
- Custom SVG pin icons
- Interactive popups with hawker center information
- Click handlers for navigation

**Color Mapping:**
- Open: Green (#22c55e)
- Closed (Cleaning): Red (#ef4444)
- Closed (Maintenance): Orange (#f97316)
- Unknown: Gray (#6b7280)

### UserLocationMarker (`user-location-marker.tsx`)
Blue dot marker showing user's current location.

**Features:**
- Blue circular marker
- Accuracy circle (if available from geolocation API)
- High z-index to appear above other markers

### MapControls (`map-controls.tsx`)
Custom control panel for map interactions.

**Features:**
- Zoom in/out buttons
- Recenter to user location or Singapore center
- Find me button (requests geolocation permission)
- Positioned at bottom-right of map

**Props:**
```typescript
interface MapControlsProps {
  onRequestLocation?: () => void;
  userLocation?: [number, number];
}
```

### LeafletSetup (`leaflet-setup.tsx`)
Utility component that imports Leaflet CSS and fixes default marker icon issues.

**Features:**
- Imports `leaflet/dist/leaflet.css`
- Fixes Leaflet's default marker icon path issue
- Must be included once in the component tree

## Installation

The following dependencies are required:

```bash
npm install leaflet react-leaflet @types/leaflet
npm install lucide-react # For icons in controls
```

## Usage Example

```tsx
'use client';

import { HawkerMap } from '@/components/map';
import type { HawkerCenterStatus } from '@/types/hawker';

const MapPage = () => {
  const centers: HawkerCenterStatus[] = [
    // ... your hawker centers data
  ];

  const handleMarkerClick = (center: HawkerCenterStatus) => {
    console.log('Clicked:', center.name);
    // Navigate to detail page or show modal
  };

  return (
    <div className="h-screen w-full">
      <HawkerMap
        hawkerCenters={centers}
        onMarkerClick={handleMarkerClick}
      />
    </div>
  );
};

export default MapPage;
```

## Important Notes

1. **Client-Side Only**: All map components must be client components (use 'use client' directive)
2. **SSR Prevention**: The map uses `isClient` state to prevent server-side rendering issues
3. **Geolocation**: Requires HTTPS in production for geolocation API to work
4. **OpenStreetMap**: Uses free OpenStreetMap tiles (no API key required)
5. **CSS Import**: The Leaflet CSS is imported in `leaflet-setup.tsx` and applies globally

## Styling

Custom styles for markers and popups are defined in `/app/globals.css`:
- `.custom-marker`: Removes default Leaflet marker background
- `.custom-popup`: Styles popup content wrapper
- `.user-location-marker`: Styles user location marker

## Future Enhancements

- [ ] Marker clustering for performance at low zoom levels
- [ ] Animated transitions when changing status/date
- [ ] Custom tile provider (Mapbox) option
- [ ] Offline map support (PWA)
- [ ] Direction routing to selected hawker center
