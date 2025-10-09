import * as fs from 'fs';
import * as path from 'path';
import Papa from 'papaparse';

// Types
interface HawkerCenter {
  serial_no: string;
  name: string;
  latitude_hc: string;
  longitude_hc: string;
  address_myenv: string;
  no_of_food_stalls: string;
  [key: string]: string;
}

interface PlaceResult {
  place_id: string;
  name: string;
  rating?: number;
  user_ratings_total?: number;
  types?: string[];
  vicinity?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  business_status?: string;
  price_level?: number;
  opening_hours?: {
    open_now?: boolean;
  };
}

interface HawkerStallsData {
  hawker_center_id: string;
  hawker_center_name: string;
  hawker_center_location: {
    lat: number;
    lng: number;
  };
  fetched_at: string;
  total_stalls_found: number;
  stalls: PlaceResult[];
}

// Configuration
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const CSV_PATH = path.join(process.cwd(), 'DatesofHawkerCentresClosure.csv');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'hawker-stalls.json');
const SEARCH_RADIUS = 100; // meters - adjust based on hawker center size
const DELAY_BETWEEN_REQUESTS = 200; // ms to avoid rate limiting

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchNearbyPlaces(
  lat: number,
  lng: number,
  apiKey: string
): Promise<PlaceResult[]> {
  const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
  url.searchParams.append('location', `${lat},${lng}`);
  url.searchParams.append('radius', SEARCH_RADIUS.toString());
  url.searchParams.append('type', 'restaurant');
  url.searchParams.append('key', apiKey);

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error(`API Error for location ${lat},${lng}:`, data.status, data.error_message);
      return [];
    }

    return data.results || [];
  } catch (error) {
    console.error(`Failed to fetch places for ${lat},${lng}:`, error);
    return [];
  }
}

async function main() {
  if (!API_KEY) {
    console.error('❌ GOOGLE_PLACES_API_KEY not found in environment variables');
    console.error('Please create a .env.local file with your API key');
    process.exit(1);
  }

  console.log('🚀 Starting hawker stalls data collection...\n');

  // Read CSV file
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const parsed = Papa.parse<HawkerCenter>(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  const hawkerCenters = parsed.data;
  console.log(`📍 Found ${hawkerCenters.length} hawker centers\n`);

  const results: HawkerStallsData[] = [];
  let processedCount = 0;

  for (const center of hawkerCenters) {
    const lat = parseFloat(center.latitude_hc);
    const lng = parseFloat(center.longitude_hc);

    if (isNaN(lat) || isNaN(lng)) {
      console.log(`⚠️  Skipping ${center.name} - invalid coordinates`);
      continue;
    }

    console.log(`🔍 Fetching stalls for: ${center.name}`);

    const stalls = await fetchNearbyPlaces(lat, lng, API_KEY);

    const hawkerData: HawkerStallsData = {
      hawker_center_id: center.serial_no,
      hawker_center_name: center.name,
      hawker_center_location: { lat, lng },
      fetched_at: new Date().toISOString(),
      total_stalls_found: stalls.length,
      stalls: stalls.map(stall => ({
        place_id: stall.place_id,
        name: stall.name,
        rating: stall.rating,
        user_ratings_total: stall.user_ratings_total,
        types: stall.types,
        vicinity: stall.vicinity,
        geometry: stall.geometry,
        business_status: stall.business_status,
        price_level: stall.price_level,
        opening_hours: stall.opening_hours,
      })),
    };

    results.push(hawkerData);
    processedCount++;

    console.log(`   ✅ Found ${stalls.length} stalls (${processedCount}/${hawkerCenters.length})\n`);

    // Rate limiting delay
    if (processedCount < hawkerCenters.length) {
      await sleep(DELAY_BETWEEN_REQUESTS);
    }
  }

  // Save results
  const outputData = {
    generated_at: new Date().toISOString(),
    total_hawker_centers: results.length,
    total_stalls_found: results.reduce((sum, center) => sum + center.total_stalls_found, 0),
    search_radius_meters: SEARCH_RADIUS,
    data: results,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2));

  console.log('\n✨ Done!');
  console.log(`📊 Summary:`);
  console.log(`   - Hawker centers processed: ${results.length}`);
  console.log(`   - Total stalls found: ${outputData.total_stalls_found}`);
  console.log(`   - Output saved to: ${OUTPUT_FILE}`);
  console.log(`   - File size: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2)} KB\n`);
}

main().catch(console.error);
