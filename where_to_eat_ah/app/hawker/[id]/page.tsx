import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, ExternalLink, Calendar, Store, Info } from "lucide-react";
import { HawkerCenter, HawkerCenterJSON } from "@/types/hawker";
import hawkerCentersData from "@/lib/data/hawker-centers.json";
import { calculateStatus, getUpcomingClosures } from "@/lib/utils/closure-calculator";
import { StatusBadge } from "@/components/hawker/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface PageProps {
  params: Promise<{ id: string }>;
}

const HawkerDetailPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const hawkerId = parseInt(id);

  // Load hawker centers data (JSON has string dates)
  const hawkerCentersRaw = hawkerCentersData as HawkerCenterJSON[];

  // Find the specific hawker center
  const rawCenter = hawkerCentersRaw.find((center) => center.id === hawkerId);

  if (!rawCenter) {
    notFound();
  }

  // Process dates (convert from JSON strings to Date objects)
  const hawkerCenter: HawkerCenter = {
    ...rawCenter,
    closures: rawCenter.closures.map((closure) => ({
      ...closure,
      startDate: closure.startDate ? new Date(closure.startDate) : null,
      endDate: closure.endDate ? new Date(closure.endDate) : null,
    })),
  };

  // Calculate current status
  const currentStatus = calculateStatus(hawkerCenter, new Date());

  // Get upcoming closures
  const upcomingClosures = getUpcomingClosures(hawkerCenter, new Date()).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Map
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="space-y-4">
          {/* Photo */}
          {hawkerCenter.photos.main && (
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted relative">
              <Image
                src={hawkerCenter.photos.main}
                alt={hawkerCenter.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
              />
            </div>
          )}

          {/* Name and Status */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{hawkerCenter.name}</h1>
            <div className="flex items-center gap-3">
              <StatusBadge status={currentStatus.statusType} />
              {!currentStatus.isOpen && currentStatus.closureEnd && (
                <span className="text-sm text-muted-foreground">
                  Until {format(currentStatus.closureEnd, "d MMM yyyy")}
                </span>
              )}
            </div>
          </div>

          {/* Address and Directions */}
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm">{hawkerCenter.address}</p>
              {hawkerCenter.links.googleMaps && (
                <a
                  href={hawkerCenter.links.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  Get Directions
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Facility Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Facility Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Food Stalls</span>
                <span className="font-medium">{hawkerCenter.stallCounts.food}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Market Stalls</span>
                <span className="font-medium">{hawkerCenter.stallCounts.market}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Stalls</span>
                <span className="font-medium">{hawkerCenter.stallCounts.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="font-medium capitalize">{hawkerCenter.status}</span>
              </div>
            </CardContent>
          </Card>

          {/* Current Closure Info */}
          {!currentStatus.isOpen && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Current Closure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Reason</span>
                  <p className="font-medium">{currentStatus.closureReason}</p>
                </div>
                {currentStatus.closureEnd && (
                  <div>
                    <span className="text-sm text-muted-foreground">Reopens</span>
                    <p className="font-medium">
                      {format(currentStatus.closureEnd, "EEEE, d MMMM yyyy")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {hawkerCenter.description && (
            <Card className={!currentStatus.isOpen ? "" : "md:col-span-2"}>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{hawkerCenter.description}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Upcoming Closures */}
        {upcomingClosures.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Closures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingClosures.map((closure, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b last:border-b-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium">
                        {closure.quarter && `${closure.quarter} `}
                        {closure.type === "cleaning" ? "Cleaning" : "Maintenance"}
                      </p>
                      {closure.remarks && (
                        <p className="text-sm text-muted-foreground">{closure.remarks}</p>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground sm:text-right">
                      {closure.startDate && closure.endDate && (
                        <>
                          <p>{format(closure.startDate, "d MMM yyyy")}</p>
                          <p>to {format(closure.endDate, "d MMM yyyy")}</p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* External Links */}
        <div className="mt-6 flex flex-wrap gap-3">
          {hawkerCenter.links.googleMaps && (
            <a href={hawkerCenter.links.googleMaps} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                <MapPin className="h-4 w-4" />
                View on Google Maps
                <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          )}
          {hawkerCenter.photos.google3D && (
            <a href={hawkerCenter.photos.google3D} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                Google 3D View
                <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          )}
        </div>
      </main>
    </div>
  );
};

export default HawkerDetailPage;
