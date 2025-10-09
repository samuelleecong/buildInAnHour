"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { HawkerCenter, HawkerCenterStatus } from "@/types/hawker";
import { useDateSelector } from "@/lib/hooks/use-date-selector";
import { useGeolocation } from "@/lib/hooks/use-geolocation";
import { useHawkerStatus } from "@/lib/hooks/use-hawker-status";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { InstallPrompt } from "@/components/pwa/install-prompt";

// Dynamically import map to avoid SSR issues with Leaflet
const HawkerMap = dynamic(
  () => import("@/components/map/hawker-map").then((mod) => mod.HawkerMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    ),
  }
);

interface HomePageClientProps {
  hawkerCenters: HawkerCenter[];
}

export const HomePageClient = ({ hawkerCenters }: HomePageClientProps) => {
  const router = useRouter();
  const [zoomTrigger, setZoomTrigger] = useState(0);

  // Custom hooks
  const { selectedDate, setSelectedDate } = useDateSelector();
  const { coordinates: userLocation } = useGeolocation();

  // Calculate status for all hawker centers based on selected date and user location
  const hawkerStatuses = useHawkerStatus({
    hawkerCenters,
    selectedDate,
    userLocation,
  });

  // Sort by distance if user location is available, otherwise by name
  const sortedHawkerStatuses = [...hawkerStatuses]
    .sort((a, b) => {
      // If both have distance, sort by distance
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      // If only one has distance, prioritize it
      if (a.distance !== undefined) return -1;
      if (b.distance !== undefined) return 1;
      // If neither has distance, sort by name
      return a.name.localeCompare(b.name);
    })
    .map((center, index) => {
      // Assign nearestRank to top 3 centers with distance
      if (center.distance !== undefined && index < 3) {
        return { ...center, nearestRank: index + 1 };
      }
      return center;
    });

  const handleMarkerClick = (hawkerCenter: HawkerCenterStatus) => {
    // Navigate to detail page
    router.push(`/hawker/${hawkerCenter.id}`);
  };

  const handleListItemClick = (hawkerId: number) => {
    // Navigate to detail page
    router.push(`/hawker/${hawkerId}`);
  };

  const handleNearMeClick = () => {
    // Increment zoom trigger to re-zoom the map to user location
    setZoomTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar - Hidden on mobile */}
        <Sidebar
          hawkerCenters={sortedHawkerStatuses}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onSelectHawker={handleListItemClick}
          onNearMeClick={handleNearMeClick}
        />

        {/* Map - Full width on mobile, remaining space on desktop */}
        <main className="flex-1 relative">
          <HawkerMap
            hawkerCenters={sortedHawkerStatuses}
            onMarkerClick={handleMarkerClick}
            userLocation={userLocation ? [userLocation.lat, userLocation.lng] : undefined}
            zoomTrigger={zoomTrigger}
          />
        </main>
      </div>

      {/* Mobile Navigation - Only visible on mobile */}
      <MobileNav
        hawkerCenters={sortedHawkerStatuses}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onSelectHawker={handleListItemClick}
        onNearMeClick={handleNearMeClick}
      />

      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  );
};
