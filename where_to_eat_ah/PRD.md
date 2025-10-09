# Product Requirements Document
## Hawker Center Availability Tracker

---

## 1. Executive Summary

**Product Name:** Where To Eat Ah?

**Version:** 1.0

**Last Updated:** October 9, 2025

**Document Owner:** Product Team

### 1.1 Product Vision
A location-aware web application that instantly shows users which hawker centers are open or closed on any given date, helping Singaporeans make informed dining decisions and avoid disappointment from visiting closed venues.

### 1.2 Problem Statement
Singapore has 100+ hawker centers that undergo regular quarterly cleaning and occasional maintenance. Users currently have no easy way to:
- Check if their preferred hawker center is open before traveling
- Find nearby alternatives when their preferred center is closed
- Plan meals ahead based on closure schedules
- Discover hawker centers based on proximity to their location

### 1.3 Target Users
- **Primary:** Singapore residents and daily commuters seeking meal options
- **Secondary:** Tourists and visitors exploring local food culture
- **Tertiary:** Food bloggers and hawker center enthusiasts

### 1.4 Success Metrics
- User can determine hawker center status within 3 seconds of page load
- 95% accuracy in open/closed status prediction
- Average session time > 2 minutes (indicates browsing behavior)
- 70% mobile usage (primary device)
- Return user rate > 40% within 7 days

---

## 2. User Research & Personas

### 2.1 Primary Persona: "Lunch Hour Lina"
**Demographics:**
- Age: 28
- Occupation: Office worker in CBD
- Location: Works in Raffles Place, lives in Bedok

**Goals:**
- Quick lunch decision-making (15-minute window)
- Avoid wasted trips to closed hawker centers
- Discover new nearby options

**Pain Points:**
- Traveling 10 minutes to find hawker center closed
- No centralized source for closure information
- Difficulty planning group lunches

**Quote:** *"I just want to know if the hawker center is open before I leave my office."*

### 2.2 Secondary Persona: "Weekend Wanderer William"
**Demographics:**
- Age: 35
- Occupation: Tourist/Expat
- Location: Visiting Singapore, staying in various hotels

**Goals:**
- Explore authentic local food
- Find hawker centers near current location
- Plan food tours in advance

**Pain Points:**
- Unfamiliar with hawker center locations
- No visual reference for planning routes
- Closure schedules not readily available online

**Quote:** *"I wish I could see all hawker centers on a map with their opening status."*

---

## 3. Core Features & Requirements

### 3.1 Feature Priority Matrix

| Feature | Priority | Complexity | Impact |
|---------|----------|------------|--------|
| Date-based closure calculation | P0 | Medium | Critical |
| Interactive map visualization | P0 | High | Critical |
| Geolocation integration | P0 | Medium | High |
| Today/Date toggle | P0 | Low | High |
| Status indicators (open/closed) | P0 | Low | Critical |
| Proximity-based sorting | P1 | Medium | High |
| Hawker center detail view | P1 | Low | Medium |
| Search functionality | P2 | Low | Medium |
| Favorite/bookmark centers | P3 | Low | Low |

### 3.2 Detailed Feature Specifications

#### 3.2.1 Closure Status Engine (P0)
**Description:** Core logic to determine if a hawker center is open or closed on a given date.

**Requirements:**
- Parse CSV data containing quarterly cleaning schedules (q1-q4) and other works
- Accept date input (default: today)
- Return status: OPEN, CLOSED (Cleaning), CLOSED (Maintenance)
- Handle date range overlaps (cleaning + other works)
- Account for multi-day closures

**Business Logic:**
```
For a given hawker center and date:
1. Check if date falls within Q1/Q2/Q3/Q4 cleaning periods
2. Check if date falls within other_works period
3. Priority: other_works > quarterly_cleaning
4. Return status with reason
```

**Edge Cases:**
- TBC (To Be Confirmed) dates → treat as potentially closed, show warning
- NA dates → ignore
- Malformed dates → log error, treat as open
- Date ranges spanning multiple days

**Data Validation:**
- Date format: D/M/YYYY (e.g., 3/3/2025)
- Handle single-day closures (start_date == end_date)
- Handle multi-day ranges

#### 3.2.2 Interactive Map (P0)
**Description:** Visual representation of all hawker centers with status indicators.

**Requirements:**
- Display all ~120 hawker centers as markers on Singapore map
- Color-coded markers:
  - GREEN: Open
  - RED: Closed (cleaning)
  - ORANGE: Closed (maintenance/other works)
  - GRAY: Unknown/TBC
- Default view: Centered on Singapore (1.3521° N, 103.8198° E)
- Zoom levels: 11 (full Singapore) to 18 (street level)
- Marker clustering for performance at low zoom levels

**User Interactions:**
- Click marker → Show popup with basic info (name, address, status)
- Click popup → Navigate to detail view
- Pan and zoom freely
- Recenter button to return to user location

**Technical Requirements:**
- Map library: Leaflet or Mapbox GL JS
- Tile provider: OpenStreetMap or Mapbox
- Marker icons: Custom SVG for status colors
- Performance: Render 120 markers in <500ms

#### 3.2.3 Geolocation Integration (P0)
**Description:** Request user's location to personalize experience.

**Requirements:**
- Request geolocation permission on first visit
- Store permission state in localStorage
- If granted:
  - Center map on user location
  - Show user marker (blue dot)
  - Highlight nearest 5 hawker centers
  - Show distances in km
- If denied:
  - Center on Singapore default
  - Show all centers equally
  - No distance calculations
- Graceful degradation (no location API)

**Privacy Considerations:**
- Request permission only when user interacts with "Near Me" feature
- Never store coordinates on server
- Clear explanation of why location is needed

**User Flow:**
```
User lands on page
→ Map shows all centers (no location prompt)
→ User clicks "Find Near Me" button
→ Browser prompts for location
→ If allow: Map recenters, shows distances
→ If deny: Show message, keep current view
```

#### 3.2.4 Date Selector (P0)
**Description:** Toggle between different dates to check future closures.

**Requirements:**
- Default: Today's date
- Date picker component (calendar UI)
- Quick toggles: Today, Tomorrow, This Weekend
- Date range: Current date to +365 days
- Show selected date prominently in header
- Real-time map updates when date changes

**UI Components:**
- Primary: Large "Today" button (most common use case)
- Secondary: Calendar icon → opens date picker
- Display: "Showing status for: Tuesday, Oct 9, 2025"

**Behavior:**
- Date change triggers:
  1. Recalculate all statuses
  2. Update marker colors
  3. Update list view statuses
  4. Persist selection in sessionStorage

#### 3.2.5 Hawker Center Detail View (P1)
**Description:** Comprehensive information page for each hawker center.

**Requirements:**
- **Header Section:**
  - Name
  - Current status (large, color-coded badge)
  - Photo (if available)
  - Address with "Get Directions" link

- **Closure Information:**
  - Next closure dates (upcoming 4 quarters)
  - Maintenance schedule (if applicable)
  - Closure reasons (cleaning, repairs, etc.)

- **Facility Details:**
  - Number of food stalls
  - Number of market stalls
  - Description
  - Year built / Last upgraded

- **External Links:**
  - Google 3D View (if available)
  - Google Maps link
  - NEA photo

**Navigation:**
- Back button to map view
- Share button (copy link)
- "Find Nearby Alternatives" button

---

## 4. Technical Architecture

### 4.1 Technology Stack

**Frontend Framework:**
- Next.js 15 (App Router)
- React 19
- TypeScript 5

**Styling:**
- Tailwind CSS 4
- shadcn/ui components
- Radix UI primitives

**Mapping:**
- Leaflet.js (open-source, lightweight)
- React-Leaflet wrapper
- OpenStreetMap tiles (free tier)

**Data Processing:**
- CSV parsing: PapaParse
- Date handling: date-fns
- Geolocation: Browser Geolocation API

**State Management:**
- React Server Components (default)
- Client state: React hooks (useState, useReducer)
- URL state: Next.js searchParams
- Persistent state: localStorage

**Deployment:**
- Vercel (optimized for Next.js)
- Edge runtime for API routes
- Static generation for data

### 4.2 Data Flow Architecture

```
CSV File (Static)
    ↓
[Build-time Processing]
    ↓
JSON Data Structure
    ↓
[Server Component] ← Serves initial data
    ↓
[Client Component] ← Map + Interactions
    ↓
[User Interactions] → Date change, Location request
    ↓
[Filter & Calculate] → Closure status logic
    ↓
[Update UI] → Markers, lists, badges
```

### 4.3 Data Model

#### 4.3.1 Source Data (CSV)
```typescript
interface HawkerCenterRaw {
  serial_no: string;
  name: string;

  // Q1 Cleaning
  q1_cleaningstartdate: string;
  q1_cleaningenddate: string;
  remarks_q1: string;

  // Q2 Cleaning
  q2_cleaningstartdate: string;
  q2_cleaningenddate: string;
  remarks_q2: string;

  // Q3 Cleaning
  q3_cleaningstartdate: string;
  q3_cleaningenddate: string;
  remarks_q3: string;

  // Q4 Cleaning
  q4_cleaningstartdate: string;
  q4_cleaningenddate: string;
  remarks_q4: string;

  // Other Works
  other_works_startdate: string;
  other_works_enddate: string;
  remarks_other_works: string;

  // Location
  latitude_hc: string;
  longitude_hc: string;
  address_myenv: string;

  // Details
  photourl: string;
  no_of_market_stalls: string;
  no_of_food_stalls: string;
  description_myenv: string;
  status: string;
  google_3d_view: string;
  google_for_stall: string;
}
```

#### 4.3.2 Processed Data Model
```typescript
interface ClosurePeriod {
  startDate: Date | null;
  endDate: Date | null;
  type: 'cleaning' | 'maintenance';
  quarter?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  remarks: string;
}

interface HawkerCenter {
  id: number;
  name: string;

  // Location
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;

  // Closure Schedule
  closures: ClosurePeriod[];

  // Facility Info
  stallCounts: {
    food: number;
    market: number;
    total: number;
  };

  description: string;
  yearBuilt?: string;
  status: 'existing' | 'new' | 'closed';

  // Media
  photos: {
    main?: string;
    google3D?: string;
  };

  // External Links
  links: {
    googleMaps?: string;
  };
}
```

#### 4.3.3 Runtime Status Model
```typescript
interface HawkerCenterStatus {
  id: number;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };

  // Calculated for selected date
  isOpen: boolean;
  statusType: 'open' | 'closed-cleaning' | 'closed-maintenance' | 'unknown';
  closureReason?: string;
  closureEnd?: Date;

  // If user location enabled
  distance?: number; // in km
  bearing?: number; // compass direction
}
```

### 4.4 File Structure

```
where_to_eat_ah/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page (map view)
│   ├── hawker/
│   │   └── [id]/
│   │       └── page.tsx           # Detail page
│   └── api/
│       └── hawker-data/
│           └── route.ts           # API endpoint (optional)
│
├── components/
│   ├── map/
│   │   ├── hawker-map.tsx         # Main map component
│   │   ├── hawker-marker.tsx      # Custom marker
│   │   ├── map-controls.tsx       # Zoom, recenter controls
│   │   └── user-location-marker.tsx
│   │
│   ├── ui/                        # shadcn components
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── calendar.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   └── sheet.tsx
│   │
│   ├── hawker/
│   │   ├── date-selector.tsx     # Date picker + quick toggles
│   │   ├── status-badge.tsx      # Colored status indicator
│   │   ├── hawker-card.tsx       # List item card
│   │   ├── hawker-detail.tsx     # Detail view
│   │   └── hawker-list.tsx       # Sidebar list
│   │
│   └── layout/
│       ├── header.tsx
│       ├── sidebar.tsx
│       └── mobile-nav.tsx
│
├── lib/
│   ├── data/
│   │   ├── process-csv.ts         # CSV to JSON converter
│   │   └── hawker-centers.json    # Processed data
│   │
│   ├── utils/
│   │   ├── date-utils.ts          # Date parsing, comparison
│   │   ├── closure-calculator.ts  # Status determination logic
│   │   ├── distance-calculator.ts # Haversine formula
│   │   └── cn.ts                  # Class name merger
│   │
│   └── hooks/
│       ├── use-geolocation.ts     # Location hook
│       ├── use-hawker-status.ts   # Status calculation hook
│       └── use-date-selector.ts   # Date state management
│
├── types/
│   └── hawker.ts                  # TypeScript interfaces
│
├── public/
│   ├── icons/
│   │   ├── marker-open.svg
│   │   ├── marker-closed.svg
│   │   └── marker-maintenance.svg
│   └── DatesofHawkerCentresClosure.csv
│
└── scripts/
    └── parse-csv.ts               # Build-time data processing
```

### 4.5 Performance Considerations

**Build-time Optimizations:**
- Parse CSV once during build → generate static JSON
- Pre-calculate common date ranges
- Optimize image sizes (use Next.js Image component)

**Runtime Optimizations:**
- Use React Server Components for initial data load
- Client-side hydration for interactive map
- Lazy load map library (dynamic import)
- Implement marker clustering (react-leaflet-cluster)
- Memoize closure calculations (useMemo)
- Debounce date selector changes

**Bundle Size:**
- Code splitting by route
- Tree-shake unused shadcn components
- Use lightweight date library (date-fns over moment.js)
- Lazy load calendar component

**Target Metrics:**
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Bundle size: <150KB (initial)
- Lighthouse score: >90

---

## 5. UI/UX Design System

### 5.1 Design Philosophy

**Principles:**
1. **Speed First:** Users want answers in seconds
2. **Mobile Priority:** 70% of users on mobile devices
3. **Visual Clarity:** Status should be obvious at a glance
4. **Minimal Friction:** Zero clicks to see today's status
5. **Singapore Context:** Local sensibilities, familiar patterns

**Inspiration:**
- Google Maps (familiar map patterns)
- Grab Food (location-based services)
- Government services (MyTransport.sg, OneMap)

### 5.2 Color System

**Status Colors:**
```css
/* Primary Status Colors */
--status-open: hsl(142, 76%, 36%);      /* Green 600 */
--status-open-bg: hsl(142, 76%, 96%);   /* Green 50 */

--status-closed: hsl(0, 84%, 60%);      /* Red 500 */
--status-closed-bg: hsl(0, 84%, 97%);   /* Red 50 */

--status-maintenance: hsl(25, 95%, 53%); /* Orange 500 */
--status-maintenance-bg: hsl(25, 95%, 97%); /* Orange 50 */

--status-unknown: hsl(215, 16%, 47%);   /* Gray 600 */
--status-unknown-bg: hsl(215, 16%, 98%); /* Gray 50 */

/* Map Marker Colors */
--marker-open: hsl(142, 71%, 45%);
--marker-closed: hsl(0, 72%, 51%);
--marker-maintenance: hsl(25, 95%, 53%);
--marker-user: hsl(221, 83%, 53%);      /* Blue for user location */
```

**Base Colors (shadcn defaults):**
```css
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--card: 0 0% 100%;
--card-foreground: 222.2 84% 4.9%;
--popover: 0 0% 100%;
--popover-foreground: 222.2 84% 4.9%;
--primary: 221.2 83.2% 53.3%;
--primary-foreground: 210 40% 98%;
--secondary: 210 40% 96.1%;
--secondary-foreground: 222.2 47.4% 11.2%;
--muted: 210 40% 96.1%;
--muted-foreground: 215.4 16.3% 46.9%;
--accent: 210 40% 96.1%;
--accent-foreground: 222.2 47.4% 11.2%;
--destructive: 0 84.2% 60.2%;
--destructive-foreground: 210 40% 98%;
--border: 214.3 31.8% 91.4%;
--input: 214.3 31.8% 91.4%;
--ring: 221.2 83.2% 53.3%;
```

### 5.3 Typography

**Font Stack:**
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
--font-heading: 'Inter', sans-serif;
```

**Type Scale:**
```css
--text-xs: 0.75rem;    /* 12px - captions, labels */
--text-sm: 0.875rem;   /* 14px - body small, secondary info */
--text-base: 1rem;     /* 16px - body text */
--text-lg: 1.125rem;   /* 18px - emphasized text */
--text-xl: 1.25rem;    /* 20px - card titles */
--text-2xl: 1.5rem;    /* 24px - section headers */
--text-3xl: 1.875rem;  /* 30px - page titles */
--text-4xl: 2.25rem;   /* 36px - hero text (desktop) */
```

**Font Weights:**
- Regular: 400 (body text)
- Medium: 500 (labels, buttons)
- Semibold: 600 (headings, emphasis)
- Bold: 700 (status badges, CTAs)

### 5.4 Spacing System

Following Tailwind's 4px base unit:
```
0.5 → 2px
1   → 4px
2   → 8px
3   → 12px
4   → 16px
6   → 24px
8   → 32px
12  → 48px
16  → 64px
```

**Component Spacing:**
- Card padding: 4-6 (16-24px)
- Section gaps: 8-12 (32-48px)
- Button padding: 3-4 horizontal, 2-3 vertical
- Map controls margin: 4 (16px)

### 5.5 Component Specifications

#### 5.5.1 Status Badge
```typescript
<Badge variant="open">        {/* Green background */}
<Badge variant="closed">      {/* Red background */}
<Badge variant="maintenance"> {/* Orange background */}
<Badge variant="unknown">     {/* Gray background */}
```

**Styling:**
- Border radius: 9999px (full round)
- Padding: 2px 12px
- Font size: 12px
- Font weight: 600
- Text transform: uppercase
- Letter spacing: 0.5px

**States:**
- Default: Solid background
- Hover: Darken 10%
- Active: Darken 15%

#### 5.5.2 Map Marker
**Design:**
- Shape: Teardrop pin (classic map marker)
- Size: 32x40px (desktop), 28x35px (mobile)
- Shadow: 0 4px 8px rgba(0,0,0,0.2)
- Icon: Simple dot or stall icon (white)

**Color Variants:**
- Open: Green (#22c55e)
- Closed: Red (#ef4444)
- Maintenance: Orange (#f97316)
- Selected: Blue (#3b82f6) with pulse animation

**Interactions:**
- Hover: Scale 1.1, shadow increase
- Click: Bounce animation, open popup

#### 5.5.3 Hawker Card (List View)
```
┌─────────────────────────────────────────┐
│ [Status Badge]                          │
│                                         │
│ Hawker Center Name                      │
│ 123 Street Name, Singapore 123456       │
│                                         │
│ 📍 1.2 km away  •  32 food stalls       │
│                                         │
│ Closed until: Oct 10, 2025              │ ← If closed
└─────────────────────────────────────────┘
```

**Styling:**
- Background: White card
- Border: 1px solid border-color
- Border radius: 12px
- Padding: 16px
- Shadow: Small (hover: medium)
- Gap between elements: 8px

#### 5.5.4 Date Selector
```
┌──────────────────────────────────────────┐
│  📅 Showing status for:                  │
│                                          │
│  ┌──────────┐  ┌───────────┐            │
│  │  TODAY   │  │  Oct 10   │  [📅]      │
│  └──────────┘  └───────────┘            │
└──────────────────────────────────────────┘
```

**Components:**
- "TODAY" button: Primary style, bold
- Date button: Shows selected date
- Calendar icon: Opens date picker dialog

**Behavior:**
- Sticky position on mobile
- Fixed header on desktop
- Smooth transition when date changes

#### 5.5.5 Map Controls
**Position:** Bottom-right corner

**Controls:**
- [+] Zoom in
- [-] Zoom out
- [⊙] Recenter on user
- [🎯] Find near me (if location not granted)

**Styling:**
- Background: White
- Border radius: 8px
- Shadow: Medium
- Size: 40x40px per button
- Stack vertically with 8px gap

### 5.6 Layout Structure

#### 5.6.1 Desktop Layout (>1024px)
```
┌───────────────────────────────────────────────┐
│  Header: Logo | Date Selector        [Menu]  │
├──────────┬────────────────────────────────────┤
│          │                                    │
│ Sidebar  │         Map View                   │
│  (320px) │         (Full height)              │
│          │                                    │
│ [List]   │   [Markers] [Controls]             │
│ [List]   │                                    │
│ [List]   │                                    │
│   ...    │                                    │
│          │                                    │
└──────────┴────────────────────────────────────┘
```

**Sidebar:**
- Width: 320px
- Scrollable list of hawker centers
- Sorted by: Distance (if location) or Name
- Filter controls at top

**Map:**
- Full remaining width
- Height: 100vh - header
- Controls in bottom-right
- Popups on marker click

#### 5.6.2 Mobile Layout (<768px)
```
┌──────────────────────────┐
│  Header: Logo            │
│  Date Selector (sticky)  │
├──────────────────────────┤
│                          │
│     Map View             │
│     (60vh)               │
│                          │
│   [Markers] [Controls]   │
│                          │
├──────────────────────────┤
│  [Sheet Pull Handle]     │ ← Draggable
│  ─────────────────       │
│                          │
│  [Hawker List]           │
│  [Hawker List]           │
│  [Hawker List]           │
│      ...                 │
└──────────────────────────┘
```

**Mobile Optimizations:**
- Bottom sheet (shadcn Sheet component)
- Swipe up to reveal full list
- Swipe down to dismiss
- Snap points: 30%, 60%, 90% of screen height
- Map collapses when sheet expanded

### 5.7 User Flows

#### 5.7.1 First-Time User Flow
```
1. Land on homepage
   → See map centered on Singapore
   → Header explains purpose briefly
   → Date selector shows "TODAY"

2. See colored markers
   → Green = open, Red = closed
   → Click marker → popup with name, address, status

3. (Optional) Click "Find Near Me"
   → Browser prompts for location
   → If allow: Map recenters, shows distances
   → If deny: Shows message, map stays

4. Browse list or map
   → Click hawker center → Navigate to detail page

5. (Optional) Change date
   → Click calendar icon
   → Pick date → Map updates instantly
```

#### 5.7.2 Returning User Flow
```
1. Land on homepage
   → Location permission remembered (if granted)
   → Map centers on user immediately
   → Shows nearest centers highlighted

2. Quick scan
   → Glance at nearby markers
   → See status at a glance

3. Make decision
   → Pick open hawker center
   → (Optional) View details or get directions
```

#### 5.7.3 Planning Future Visit Flow
```
1. User wants to plan weekend lunch

2. Click calendar icon
   → Opens date picker
   → Select Saturday

3. Map updates
   → All markers recalculate status for Saturday
   → Some previously open centers now red (closed)

4. Browse alternatives
   → Find open center
   → View details, note address

5. (Optional) Share link
   → Copy URL (includes date parameter)
   → Send to friends
```

### 5.8 Responsive Breakpoints

```css
/* Mobile First Approach */
sm: '640px'   // Small tablets
md: '768px'   // Tablets
lg: '1024px'  // Small laptops (sidebar appears)
xl: '1280px'  // Desktops
2xl: '1536px' // Large desktops
```

**Layout Shifts:**
- `<lg`: Single column, bottom sheet
- `≥lg`: Sidebar + map layout
- `≥xl`: Increased sidebar width (360px), more list items visible

### 5.9 Accessibility Standards

**WCAG 2.1 Level AA Compliance:**

**Color Contrast:**
- Status text on badges: ≥4.5:1
- Body text: ≥4.5:1
- Large text: ≥3:1

**Keyboard Navigation:**
- Tab order: Header → Date Selector → Sidebar → Map
- Map markers focusable with Tab
- Enter/Space to activate
- Escape to close popups/modals

**Screen Reader Support:**
- Semantic HTML (header, nav, main, section)
- ARIA labels on map controls
- ARIA live regions for status updates
- Alt text for all images

**Focus Indicators:**
- Visible focus ring (2px solid primary color)
- Focus within compound components
- Skip to content link

**Motion:**
- Respect `prefers-reduced-motion`
- Disable animations if requested
- Static fallbacks for animated markers

---

## 6. API & Data Processing

### 6.1 CSV to JSON Transformation

**Build-time Script:** `scripts/parse-csv.ts`

```typescript
import fs from 'fs';
import Papa from 'papaparse';
import { parseDate } from '@/lib/utils/date-utils';

interface ParsedHawkerCenter {
  id: number;
  name: string;
  coordinates: { lat: number; lng: number };
  address: string;
  closures: ClosurePeriod[];
  stallCounts: { food: number; market: number };
  description: string;
  photos: { main?: string; google3D?: string };
  status: string;
}

async function processCSV() {
  const file = fs.readFileSync('./public/DatesofHawkerCentresClosure.csv', 'utf8');

  const result = Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
  });

  const hawkerCenters: ParsedHawkerCenter[] = result.data.map((row: any) => {
    const closures: ClosurePeriod[] = [];

    // Parse quarterly cleanings
    ['q1', 'q2', 'q3', 'q4'].forEach((quarter) => {
      const start = parseDate(row[`${quarter}_cleaningstartdate`]);
      const end = parseDate(row[`${quarter}_cleaningenddate`]);

      if (start && end) {
        closures.push({
          startDate: start,
          endDate: end,
          type: 'cleaning',
          quarter: quarter.toUpperCase() as 'Q1' | 'Q2' | 'Q3' | 'Q4',
          remarks: row[`remarks_${quarter}`] || '',
        });
      }
    });

    // Parse other works
    const otherStart = parseDate(row.other_works_startdate);
    const otherEnd = parseDate(row.other_works_enddate);

    if (otherStart && otherEnd) {
      closures.push({
        startDate: otherStart,
        endDate: otherEnd,
        type: 'maintenance',
        remarks: row.remarks_other_works || '',
      });
    }

    return {
      id: parseInt(row.serial_no),
      name: row.name,
      coordinates: {
        lat: parseFloat(row.latitude_hc),
        lng: parseFloat(row.longitude_hc),
      },
      address: row.address_myenv,
      closures,
      stallCounts: {
        food: parseInt(row.no_of_food_stalls) || 0,
        market: parseInt(row.no_of_market_stalls) || 0,
      },
      description: row.description_myenv,
      photos: {
        main: row.photourl !== 'nil' ? row.photourl : undefined,
        google3D: row.google_3d_view !== 'nil' ? row.google_3d_view : undefined,
      },
      status: row.status,
    };
  });

  // Write to JSON
  fs.writeFileSync(
    './lib/data/hawker-centers.json',
    JSON.stringify(hawkerCenters, null, 2)
  );

  console.log(`✅ Processed ${hawkerCenters.length} hawker centers`);
}

processCSV();
```

**Run during build:**
```json
// package.json
{
  "scripts": {
    "prebuild": "tsx scripts/parse-csv.ts",
    "build": "next build"
  }
}
```

### 6.2 Status Calculation Logic

**File:** `lib/utils/closure-calculator.ts`

```typescript
import { isWithinInterval, parseISO } from 'date-fns';

export type StatusType = 'open' | 'closed-cleaning' | 'closed-maintenance' | 'unknown';

export interface CalculatedStatus {
  isOpen: boolean;
  statusType: StatusType;
  closureReason?: string;
  closureEnd?: Date;
}

export function calculateStatus(
  hawkerCenter: HawkerCenter,
  targetDate: Date
): CalculatedStatus {
  // Check all closure periods
  for (const closure of hawkerCenter.closures) {
    if (!closure.startDate || !closure.endDate) {
      continue; // Skip TBC or invalid dates
    }

    const isWithin = isWithinInterval(targetDate, {
      start: closure.startDate,
      end: closure.endDate,
    });

    if (isWithin) {
      // Prioritize maintenance over cleaning
      const statusType = closure.type === 'maintenance'
        ? 'closed-maintenance'
        : 'closed-cleaning';

      return {
        isOpen: false,
        statusType,
        closureReason: closure.remarks || `${closure.quarter || ''} Cleaning`,
        closureEnd: closure.endDate,
      };
    }
  }

  // No closures found for this date
  return {
    isOpen: true,
    statusType: 'open',
  };
}

export function getUpcomingClosures(
  hawkerCenter: HawkerCenter,
  fromDate: Date = new Date()
): ClosurePeriod[] {
  return hawkerCenter.closures
    .filter(c => c.startDate && c.startDate >= fromDate)
    .sort((a, b) => a.startDate!.getTime() - b.startDate!.getTime());
}
```

### 6.3 Distance Calculation

**File:** `lib/utils/distance-calculator.ts`

```typescript
/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
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
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Sort hawker centers by distance from user location
 */
export function sortByDistance(
  centers: HawkerCenter[],
  userLat: number,
  userLng: number
): HawkerCenter[] {
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
}
```

---

## 7. Implementation Phases

### Phase 1: MVP (Week 1-2)
**Goal:** Basic functionality - map + status for today

**Tasks:**
- [ ] Setup Next.js 15 project with TypeScript
- [ ] Install and configure Tailwind CSS + shadcn/ui
- [ ] Create CSV parsing script
- [ ] Build data model and types
- [ ] Implement closure calculator logic
- [ ] Create basic map component with Leaflet
- [ ] Display all hawker centers as markers
- [ ] Color-code markers by status (today only)
- [ ] Add marker popups with basic info
- [ ] Deploy to Vercel

**Deliverables:**
- Functional map showing all hawker centers
- Accurate open/closed status for today
- Basic mobile responsiveness

### Phase 2: Core Features (Week 3)
**Goal:** Date selection + geolocation

**Tasks:**
- [ ] Build date selector component
- [ ] Implement date state management
- [ ] Add quick toggles (Today, Tomorrow)
- [ ] Recalculate statuses on date change
- [ ] Integrate Geolocation API
- [ ] Add "Find Near Me" functionality
- [ ] Calculate and display distances
- [ ] Sort list by proximity
- [ ] Create sidebar list view (desktop)
- [ ] Create bottom sheet (mobile)

**Deliverables:**
- Working date selector with calendar
- Location-aware features
- Split-view layout (desktop)
- Bottom sheet (mobile)

### Phase 3: Polish (Week 4)
**Goal:** Detail pages + UX refinements

**Tasks:**
- [ ] Create hawker center detail page
- [ ] Display full closure schedule
- [ ] Add facility information
- [ ] Link to external resources (Google Maps, photos)
- [ ] Implement search functionality
- [ ] Add filter options (open only, has food stalls, etc.)
- [ ] Performance optimizations (memoization, lazy loading)
- [ ] Accessibility audit and fixes
- [ ] Add loading states and skeletons
- [ ] Error handling and fallbacks

**Deliverables:**
- Complete detail pages
- Search and filters
- Polished animations
- WCAG 2.1 AA compliance

### Phase 4: Enhancements (Future)
**Goal:** Advanced features (post-launch)

**Ideas:**
- Favorite/bookmark hawker centers
- Share specific centers via URL
- PWA support (offline mode, install prompt)
- Push notifications for closure alerts
- Popular food recommendations per center
- User reviews/ratings integration
- Alternative data sources (real-time updates)
- Multi-language support (EN, CN, ML, TM)

---

## 8. Success Metrics & KPIs

### 8.1 User Engagement
- **Daily Active Users (DAU):** Target 1,000+ within first month
- **Average Session Duration:** >2 minutes (indicates exploration)
- **Bounce Rate:** <40%
- **Return User Rate:** >35% within 7 days

### 8.2 Performance Metrics
- **Time to Interactive (TTI):** <3 seconds
- **First Contentful Paint (FCP):** <1.5 seconds
- **Largest Contentful Paint (LCP):** <2.5 seconds
- **Cumulative Layout Shift (CLS):** <0.1

### 8.3 Functional Metrics
- **Status Accuracy:** 99%+ (verified against NEA data)
- **Geolocation Opt-in Rate:** >50%
- **Map Interaction Rate:** >70% of users click at least one marker
- **Detail Page Views:** >30% of sessions navigate to detail page

### 8.4 Technical Metrics
- **API Response Time:** <100ms (static JSON)
- **Error Rate:** <0.5%
- **Mobile Usage:** >70% of traffic
- **Browser Support:** Chrome, Safari, Firefox, Edge (latest 2 versions)

---

## 9. Risks & Mitigation

### 9.1 Data Quality Risks

**Risk:** CSV data contains errors, TBC dates, or outdated information

**Impact:** Users visit closed centers, lose trust in app

**Mitigation:**
- Implement data validation during CSV parsing
- Flag "TBC" dates with warning badges
- Add "Last Updated" timestamp from CSV metadata
- Provide feedback mechanism for users to report errors
- Set up alerts for data discrepancies

### 9.2 Performance Risks

**Risk:** Map with 120+ markers causes slow load on mobile

**Impact:** Poor user experience, high bounce rate

**Mitigation:**
- Implement marker clustering (combine nearby markers at low zoom)
- Lazy load map library (dynamic import)
- Use CDN for tile images (Mapbox CDN)
- Optimize bundle size (code splitting, tree shaking)
- Test on low-end devices (e.g., iPhone SE, older Androids)

### 9.3 Privacy Risks

**Risk:** Users concerned about location tracking

**Impact:** Low geolocation opt-in rate

**Mitigation:**
- Never request location on page load
- Only prompt when user clicks "Find Near Me"
- Clear explanation of why location is needed
- Never store coordinates server-side
- Provide full functionality without location

### 9.4 Maintenance Risks

**Risk:** CSV structure changes, breaking parsing logic

**Impact:** App shows incorrect data

**Mitigation:**
- Version CSV schema
- Add schema validation in parsing script
- Automated tests for CSV parsing
- Monitor for parsing errors in CI/CD
- Have rollback plan for bad data

---

## 10. Open Questions & Decisions Needed

### 10.1 Design Decisions

**Q1:** Should we show permanently closed hawker centers?
- **Option A:** Hide them (cleaner UI, less clutter)
- **Option B:** Show with special "Permanently Closed" badge
- **Recommendation:** Option B for transparency, allow filter to hide

**Q2:** How to handle "TBC" (To Be Confirmed) closure dates?
- **Option A:** Treat as closed, show warning
- **Option B:** Treat as open, show notice
- **Recommendation:** Option A (conservative), with clear "Date TBC" badge

**Q3:** Should we include market stalls in status calculation?
- **Option A:** Only food stalls matter for "eating"
- **Option B:** Show separate statuses for market vs food
- **Recommendation:** Option A (simpler), but note in details if market is open

### 10.2 Technical Decisions

**Q1:** Map library: Leaflet vs Mapbox GL JS?
- **Leaflet:** Free, lightweight, open-source
- **Mapbox GL:** Better performance, modern, 50k views/month free
- **Recommendation:** Start with Leaflet (no API key needed), migrate if needed

**Q2:** Data refresh strategy?
- **Option A:** Static build-time only (rebuild when CSV updates)
- **Option B:** Fetch CSV on client-side at runtime
- **Option C:** API endpoint with revalidation
- **Recommendation:** Option A for MVP (simple, fast, cacheable)

**Q3:** URL structure for detail pages?
- **Option A:** `/hawker/[id]` (e.g., `/hawker/1`)
- **Option B:** `/hawker/[slug]` (e.g., `/hawker/adam-road-food-centre`)
- **Recommendation:** Option A (IDs are stable), add slug for SEO later

---

## 11. Appendix

### 11.1 Data Source
- **Provider:** National Environment Agency (NEA), Singapore
- **Dataset:** Dates of Hawker Centre Closures
- **Update Frequency:** Quarterly (or as needed)
- **Format:** CSV file
- **Fields:** 27 columns (see Section 4.3.1)

### 11.2 External Dependencies
- **Next.js 15:** React framework
- **Tailwind CSS 4:** Utility-first styling
- **shadcn/ui:** Component library
- **Leaflet.js:** Map rendering
- **React-Leaflet:** React wrapper for Leaflet
- **date-fns:** Date manipulation
- **PapaParse:** CSV parsing
- **Lucide Icons:** Icon library

### 11.3 Browser Support
- **Chrome:** Latest 2 versions
- **Safari:** Latest 2 versions (iOS + macOS)
- **Firefox:** Latest 2 versions
- **Edge:** Latest 2 versions
- **Mobile:** iOS Safari 14+, Chrome Android 90+

### 11.4 Accessibility Checklist
- [ ] Semantic HTML structure
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation support
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Screen reader tested (NVDA, VoiceOver)
- [ ] Alt text for images
- [ ] Form labels associated
- [ ] Skip to content link
- [ ] Reduced motion support

### 11.5 SEO Considerations
- **Meta Tags:**
  - Title: "Where To Eat Ah? | Singapore Hawker Center Status"
  - Description: "Check if your favorite hawker center is open today. Real-time closure information for all Singapore hawker centers."
  - OG Image: Map screenshot with logo

- **Structured Data:**
  - LocalBusiness schema for each hawker center
  - OpeningHours schema (dynamic based on closures)

- **Sitemap:**
  - Homepage: /
  - Detail pages: /hawker/[id] (generate dynamically)

---

## 12. Style Guide Summary

### Visual Style
**Theme:** Clean, modern, government-adjacent (trustworthy)

**Color Palette:**
- Primary: Blue (#3b82f6) - trustworthy, tech
- Success: Green (#22c55e) - open status
- Danger: Red (#ef4444) - closed status
- Warning: Orange (#f97316) - maintenance
- Neutral: Gray scale for backgrounds

**Imagery:**
- Photos: Official NEA photos (if available)
- Icons: Lucide icons (consistent, open-source)
- Map markers: Custom SVG (color-coded)

**Tone:**
- Friendly but professional
- Informative without jargon
- Singapore context (local terminology)

### Component Style
**Buttons:**
- Primary: Solid blue, rounded-md
- Secondary: Outline, white background
- Ghost: No background, hover state

**Cards:**
- White background
- Subtle shadow
- Rounded corners (12px)
- Hover: Slight elevation increase

**Badges:**
- Rounded-full (pill shape)
- Solid backgrounds (status colors)
- White text for contrast
- Small, uppercase text

**Map:**
- Light color scheme (better visibility)
- Subtle blue water
- Gray/beige land
- Bold marker colors stand out

---

## Document Sign-off

**Version:** 1.0
**Status:** Draft for Review
**Next Review:** After initial development feedback
**Approval Required From:**
- [ ] Product Manager
- [ ] Engineering Lead
- [ ] Design Lead
- [ ] Stakeholder (NEA data steward)

---

**End of PRD**
