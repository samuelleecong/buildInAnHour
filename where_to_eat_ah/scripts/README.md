# Scripts Documentation

## fetch-hawker-stalls.ts

Fetches nearby restaurant/food stall data from Google Places API for all hawker centers listed in the CSV file.

### Setup

1. **Get Google Places API Key**
   - Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
   - Enable "Places API (New)" or "Places API"
   - Create an API key
   - Restrict the key to Places API only (security best practice)

2. **Configure Environment Variables**
   ```bash
   # Copy the example file
   cp .env.local.example .env.local

   # Edit .env.local and add your API key
   GOOGLE_PLACES_API_KEY=your_actual_api_key_here
   ```

3. **Install Dependencies** (if not already done)
   ```bash
   npm install
   ```

### Usage

```bash
# Run the script
npm run fetch-stalls

# Or run directly with tsx
npx tsx scripts/fetch-hawker-stalls.ts
```

### Output

The script generates a JSON file at `public/data/hawker-stalls.json` with the following structure:

```json
{
  "generated_at": "2025-10-09T...",
  "total_hawker_centers": 123,
  "total_stalls_found": 2500,
  "search_radius_meters": 100,
  "data": [
    {
      "hawker_center_id": "1",
      "hawker_center_name": "Adam Road Food Centre",
      "hawker_center_location": {
        "lat": 1.324131966,
        "lng": 103.8141632
      },
      "fetched_at": "2025-10-09T...",
      "total_stalls_found": 15,
      "stalls": [
        {
          "place_id": "ChIJ...",
          "name": "Stall Name",
          "rating": 4.5,
          "user_ratings_total": 120,
          "types": ["restaurant", "food"],
          "vicinity": "Address",
          "business_status": "OPERATIONAL",
          "price_level": 1
        }
      ]
    }
  ]
}
```

### Configuration Options

Edit the script to adjust these constants:

- `SEARCH_RADIUS`: Search radius in meters (default: 100m)
- `DELAY_BETWEEN_REQUESTS`: Delay between API calls in ms (default: 200ms)

### Important Notes

#### Google Places API Terms of Service

⚠️ **Legal Considerations:**

1. **Caching Policy**: Google's TOS generally prohibits extensive caching of Places data
2. **Allowed**: Storing Place IDs and displaying fresh data
3. **Not Allowed**: Creating a mirror database of Google's Places content
4. **For Production**: Fetch data in real-time or use short-lived caches (30 days max)

#### Costs

- **Nearby Search**: $32 per 1000 requests
- **123 hawker centers** = ~$4 per run
- First $200/month is FREE (monthly credit)

#### Rate Limiting

- Script includes 200ms delay between requests
- Adjust `DELAY_BETWEEN_REQUESTS` if you hit rate limits

### For Production Use

Instead of running this script, consider:

1. **Real-time fetching**: Query Places API when users view a hawker center
2. **Server-side caching**: Use Next.js API routes with Redis/memory cache
3. **Hybrid approach**: Store Place IDs only, fetch details on-demand

Example API route:
```typescript
// app/api/stalls/[hawkerId]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { hawkerId: string } }
) {
  const hawkerCenter = getHawkerCenterById(params.hawkerId);
  const stalls = await fetchNearbyPlaces(
    hawkerCenter.lat,
    hawkerCenter.lng,
    process.env.GOOGLE_PLACES_API_KEY
  );
  return Response.json(stalls);
}
```

### Alternatives to Google Places API

If costs or TOS are concerns, consider:

1. **Data.gov.sg**: Free official data (limited stall information)
2. **Manual data collection**: Crowdsource or manually curate popular stalls
3. **Web scraping**: From review sites (check their TOS first)
4. **Partnership**: Work with NEA or hawker associations for official data
