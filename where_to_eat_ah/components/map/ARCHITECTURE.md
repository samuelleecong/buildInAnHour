# Map Components Architecture

## Component Hierarchy

```
HawkerMap (Main Container)
├── LeafletSetup (CSS & Icon Fix)
├── MapContainer (React-Leaflet)
│   ├── TileLayer (OpenStreetMap)
│   ├── HawkerMarker[] (Multiple markers)
│   │   └── Popup (Info card)
│   ├── UserLocationMarker (Optional)
│   │   ├── Circle (Accuracy)
│   │   └── Marker (Blue dot)
│   └── MapControls (Bottom-right)
│       ├── Zoom In Button
│       ├── Zoom Out Button
│       ├── Recenter Button
│       └── Find Me Button (conditional)
```

## Data Flow

```
Parent Component
    ↓
[hawkerCenters: HawkerCenterStatus[]]
    ↓
HawkerMap
    ↓
    ├→ HawkerMarker (for each center)
    │   ↓
    │   └→ Popup (on click)
    │
    ├→ UserLocationMarker (if permission granted)
    │
    └→ MapControls
        ↓
        ├→ handleZoomIn/Out (map.zoomIn/Out)
        ├→ handleRecenter (map.setView)
        └→ handleRequestLocation (navigator.geolocation)
            ↓
            Updates userLocation state
            ↓
            Triggers UserLocationMarker render
```

## State Management

### HawkerMap Component State

```typescript
const [userLocation, setUserLocation] = useState<[number, number]>();
const [locationAccuracy, setLocationAccuracy] = useState<number>();
const [isClient, setIsClient] = useState(false);
```

### Props Flow

```typescript
// Parent → HawkerMap
interface HawkerMapProps {
  hawkerCenters: HawkerCenterStatus[];  // Required
  onMarkerClick?: (center) => void;     // Optional callback
  center?: [number, number];            // Optional override
  zoom?: number;                        // Optional override
}

// HawkerMap → HawkerMarker
interface HawkerMarkerProps {
  hawkerCenter: HawkerCenterStatus;     // Single center
  onClick?: (center) => void;           // Optional callback
}

// HawkerMap → MapControls
interface MapControlsProps {
  onRequestLocation?: () => void;       // Callback to request location
  userLocation?: [number, number];      // Current user location
}

// HawkerMap → UserLocationMarker
interface UserLocationMarkerProps {
  position: [number, number];           // Required position
  accuracy?: number;                    // Optional accuracy radius
}
```

## Event Flow

### Marker Click Event

```
User clicks marker
    ↓
HawkerMarker eventHandlers.click
    ↓
onClick(hawkerCenter) callback
    ↓
Parent component receives HawkerCenterStatus
    ↓
Navigate to detail page / Show modal / Update state
```

### Location Request Event

```
User clicks "Find Me" button
    ↓
MapControls → handleFindMe()
    ↓
onRequestLocation() callback
    ↓
HawkerMap → handleRequestLocation()
    ↓
navigator.geolocation.getCurrentPosition()
    ↓
Success: setUserLocation([lat, lng])
    ↓
UserLocationMarker renders
    +
Map recenters to user location
```

### Zoom/Recenter Events

```
User clicks zoom/recenter button
    ↓
MapControls → handleZoomIn/Out/Recenter()
    ↓
Uses react-leaflet's useMap() hook
    ↓
map.zoomIn() / map.zoomOut() / map.setView()
    ↓
Map updates immediately
```

## CSS & Styling Strategy

### Leaflet Global Styles
- Imported in `leaflet-setup.tsx`
- Applies to entire app
- Includes default marker, popup, zoom control styles

### Custom Styles (globals.css)
```css
.custom-marker        → Removes default marker background
.custom-popup         → Styles popup wrapper & tip
.user-location-marker → Removes default user marker background
```

### Tailwind Classes
- Used throughout components for layout
- Status badge colors (bg-green-100, bg-red-100, etc.)
- Typography (text-sm, font-semibold)
- Spacing (p-2, mb-2, gap-2)

### Inline Styles
- SVG marker colors (dynamic based on status)
- Circle paths for react-leaflet Circle component

## Performance Considerations

### Client-Side Only Rendering
```typescript
const [isClient, setIsClient] = useState(false);

useEffect(() => {
  setIsClient(true);
}, []);

if (!isClient) return <LoadingState />;
```

Benefits:
- Prevents SSR hydration mismatch
- Avoids "window is not defined" errors
- Ensures Leaflet only runs in browser

### Optimization Opportunities (Future)

1. **Marker Clustering**
   ```typescript
   import MarkerClusterGroup from 'react-leaflet-cluster';
   
   <MarkerClusterGroup>
     {markers}
   </MarkerClusterGroup>
   ```

2. **Dynamic Imports**
   ```typescript
   const HawkerMap = dynamic(() => import('@/components/map'), {
     ssr: false,
     loading: () => <MapSkeleton />
   });
   ```

3. **Memoization**
   ```typescript
   const markers = useMemo(() => 
     centers.map(center => <HawkerMarker key={center.id} ... />),
     [centers]
   );
   ```

## Integration Example

### Basic Usage
```typescript
'use client';

import { HawkerMap } from '@/components/map';

export default function MapPage() {
  const centers = useHawkerStatus(); // Custom hook
  
  return (
    <div className="h-screen">
      <HawkerMap hawkerCenters={centers} />
    </div>
  );
}
```

### With Navigation
```typescript
'use client';

import { HawkerMap } from '@/components/map';
import { useRouter } from 'next/navigation';

export default function MapPage() {
  const router = useRouter();
  const centers = useHawkerStatus();
  
  const handleMarkerClick = (center: HawkerCenterStatus) => {
    router.push(`/hawker/${center.id}`);
  };
  
  return (
    <HawkerMap 
      hawkerCenters={centers}
      onMarkerClick={handleMarkerClick}
    />
  );
}
```

### With Custom Center
```typescript
const [mapCenter, setMapCenter] = useState<[number, number]>([1.3521, 103.8198]);

<HawkerMap 
  hawkerCenters={centers}
  center={mapCenter}
  zoom={14}
/>
```

## Testing Strategy

### Unit Tests
- Test marker color logic (getMarkerColor)
- Test status label logic (getStatusLabel)
- Test coordinate validation

### Integration Tests
- Test marker click callbacks
- Test location request flow
- Test control button actions

### E2E Tests
- User can view map
- User can click markers
- User can grant location permission
- User can zoom and pan
- User can recenter map

## Dependencies Version Lock

```json
{
  "leaflet": "^1.9.4",           // Stable, well-tested
  "react-leaflet": "^5.0.0",     // Latest major version
  "@types/leaflet": "^1.9.20",   // Type definitions
  "lucide-react": "^0.545.0"     // Icon library
}
```

## Browser Compatibility

| Feature | Chrome | Safari | Firefox | Edge |
|---------|--------|--------|---------|------|
| Map rendering | ✅ | ✅ | ✅ | ✅ |
| Geolocation | ✅ (HTTPS) | ✅ (HTTPS) | ✅ (HTTPS) | ✅ (HTTPS) |
| Custom markers | ✅ | ✅ | ✅ | ✅ |
| Touch events | ✅ | ✅ | ✅ | ✅ |

## Security Considerations

1. **Geolocation Privacy**
   - Never store coordinates on server
   - Request permission only when needed
   - Clear user intent before requesting

2. **XSS Prevention**
   - All user data sanitized in popups
   - No dangerouslySetInnerHTML
   - SVG markers are static strings

3. **HTTPS Requirement**
   - Geolocation API requires HTTPS in production
   - Development (localhost) works without HTTPS

## Future Enhancements Roadmap

### Phase 1 (Current) ✅
- [x] Basic map with markers
- [x] Color-coded status
- [x] Popups with info
- [x] User location
- [x] Map controls

### Phase 2 (Next)
- [ ] Marker clustering
- [ ] Search/filter integration
- [ ] Smooth animations
- [ ] Loading states
- [ ] Error boundaries

### Phase 3 (Future)
- [ ] Offline tile caching
- [ ] Direction routing
- [ ] Custom tile provider (Mapbox)
- [ ] Heatmap visualization
- [ ] Advanced filtering
