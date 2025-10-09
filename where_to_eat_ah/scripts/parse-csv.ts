/**
 * CSV to JSON parser for hawker center data
 * Transforms the NEA hawker closure CSV into our application data format
 * Based on PRD section 6.1
 */

import * as fs from "fs";
import * as path from "path";
import Papa from "papaparse";
import { parseDate } from "../lib/utils/date-utils";
import type {
  HawkerCenterRaw,
  HawkerCenter,
  ClosurePeriod,
} from "../types/hawker";

const CSV_PATH = path.join(process.cwd(), "DatesofHawkerCentresClosure.csv");
const OUTPUT_PATH = path.join(process.cwd(), "lib", "data", "hawker-centers.json");

// Ensure output directory exists
const outputDir = path.dirname(OUTPUT_PATH);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const processCSV = () => {
  console.log("📋 Processing hawker center CSV data...\n");

  // Read CSV file
  const csvContent = fs.readFileSync(CSV_PATH, "utf-8");

  // Parse CSV
  const parsed = Papa.parse<HawkerCenterRaw>(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  if (parsed.errors.length > 0) {
    console.error("❌ CSV parsing errors:", parsed.errors);
  }

  const hawkerCenters: HawkerCenter[] = parsed.data
    .map((row, index) => {
      try {
        const closures: ClosurePeriod[] = [];

        // Parse quarterly cleanings (Q1-Q4)
        const quarters: Array<"q1" | "q2" | "q3" | "q4"> = ["q1", "q2", "q3", "q4"];

        quarters.forEach((quarter) => {
          const startKey = `${quarter}_cleaningstartdate` as keyof HawkerCenterRaw;
          const endKey = `${quarter}_cleaningenddate` as keyof HawkerCenterRaw;
          const remarksKey = `remarks_${quarter}` as keyof HawkerCenterRaw;

          const startDate = parseDate(row[startKey]);
          const endDate = parseDate(row[endKey]);

          if (startDate && endDate) {
            const remarks = (row[remarksKey] || "").trim();
            closures.push({
              startDate,
              endDate,
              type: "cleaning",
              quarter: quarter.toUpperCase() as "Q1" | "Q2" | "Q3" | "Q4",
              remarks: remarks.toLowerCase() === "nil" ? "" : remarks,
            });
          }
        });

        // Parse other works (maintenance)
        const otherWorksStart = parseDate(row.other_works_startdate);
        const otherWorksEnd = parseDate(row.other_works_enddate);

        if (otherWorksStart && otherWorksEnd) {
          const remarks = (row.remarks_other_works || "").trim();
          closures.push({
            startDate: otherWorksStart,
            endDate: otherWorksEnd,
            type: "maintenance",
            remarks: remarks.toLowerCase() === "nil" ? "" : remarks,
          });
        }

        // Parse coordinates
        const lat = parseFloat(row.latitude_hc);
        const lng = parseFloat(row.longitude_hc);

        if (isNaN(lat) || isNaN(lng)) {
          console.warn(`⚠️  Row ${index + 1}: Invalid coordinates for "${row.name}"`);
          return null;
        }

        // Parse stall counts
        const foodStalls = parseInt(row.no_of_food_stalls) || 0;
        const marketStalls = parseInt(row.no_of_market_stalls) || 0;

        // Create Google Maps link
        const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          row.name
        )}`;

        return {
          id: parseInt(row.serial_no) || index + 1,
          name: row.name.trim(),
          coordinates: { lat, lng },
          address: (row.address_myenv || "").trim(),
          closures,
          stallCounts: {
            food: foodStalls,
            market: marketStalls,
            total: foodStalls + marketStalls,
          },
          description: (row.description_myenv || "").trim(),
          status:
            row.status === "Existing"
              ? "existing"
              : row.status === "New"
              ? "new"
              : "closed",
          photos: {
            main:
              row.photourl && row.photourl.toLowerCase() !== "nil"
                ? row.photourl.trim()
                : undefined,
            google3D:
              row.google_3d_view && row.google_3d_view.toLowerCase() !== "nil"
                ? row.google_3d_view.trim()
                : undefined,
          },
          links: {
            googleMaps: googleMapsLink,
          },
        } as HawkerCenter;
      } catch (error) {
        console.error(`❌ Error processing row ${index + 1}:`, error);
        return null;
      }
    })
    .filter((center): center is HawkerCenter => center !== null);

  // Write to JSON
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(hawkerCenters, null, 2));

  console.log(`✅ Processed ${hawkerCenters.length} hawker centers`);
  console.log(`📁 Output saved to: ${OUTPUT_PATH}`);
  console.log(`📦 File size: ${(fs.statSync(OUTPUT_PATH).size / 1024).toFixed(2)} KB\n`);

  // Log some statistics
  const withClosures = hawkerCenters.filter((c) => c.closures.length > 0).length;
  const totalClosures = hawkerCenters.reduce((sum, c) => sum + c.closures.length, 0);

  console.log("📊 Statistics:");
  console.log(`   - Centers with closures: ${withClosures}`);
  console.log(`   - Total closure periods: ${totalClosures}`);
  console.log(`   - Average closures per center: ${(totalClosures / hawkerCenters.length).toFixed(1)}\n`);
};

try {
  processCSV();
} catch (error) {
  console.error("❌ Fatal error:", error);
  process.exit(1);
}
