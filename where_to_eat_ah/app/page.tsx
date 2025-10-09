import { HawkerCenter, HawkerCenterJSON } from "@/types/hawker";
import hawkerCentersData from "@/lib/data/hawker-centers.json";
import { HomePageClient } from "@/components/pages/home-page-client";

// Server component that loads hawker data
const HomePage = () => {
  // Load hawker centers data from JSON (dates are strings in JSON)
  const hawkerCentersRaw = hawkerCentersData as HawkerCenterJSON[];

  // Convert string dates back to Date objects
  const processedHawkerCenters: HawkerCenter[] = hawkerCentersRaw.map((center) => ({
    ...center,
    closures: center.closures.map((closure) => ({
      ...closure,
      startDate: closure.startDate ? new Date(closure.startDate) : null,
      endDate: closure.endDate ? new Date(closure.endDate) : null,
    })),
  }));

  return <HomePageClient hawkerCenters={processedHawkerCenters} />;
};

export default HomePage;
