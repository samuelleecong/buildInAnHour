import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Info, ExternalLink, Database, Users } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Where To Eat Ah?",
  description: "Learn about Where To Eat Ah?, your reliable source for Singapore hawker center closure information and status updates.",
};

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">About Where To Eat Ah?</h1>
          <p className="text-xl text-muted-foreground">
            Your reliable guide to Singapore hawker center availability
          </p>
        </div>

        {/* What Is This Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              <CardTitle>Why This App?</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              I was inspired by my dad, who often makes trips to the market on cleaning days only to find it closed. One too many disappointed journeys sparked the idea for this app.
            </p>
            <p>
              <strong>Where To Eat Ah?</strong> helps you avoid that disappointment by instantly showing which hawker centers are open or closed on any given date. No more wasted trips!
            </p>
          </CardContent>
        </Card>

        {/* How It Works Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle>How It Works</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Badge variant="secondary">1</Badge>
                View the Map
              </h3>
              <p className="text-muted-foreground">
                Browse all hawker centers on an interactive map with color-coded status indicators:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground ml-4">
                <li><Badge className="bg-green-600">Open</Badge> - Center is operating normally</li>
                <li><Badge className="bg-red-500">Closed (Cleaning)</Badge> - Quarterly cleaning in progress</li>
                <li><Badge className="bg-orange-500">Closed (Maintenance)</Badge> - Under maintenance or other works</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Badge variant="secondary">2</Badge>
                Select a Date
              </h3>
              <p className="text-muted-foreground">
                Use the date selector to check closure status for today, tomorrow, or any future date. Perfect for planning ahead!
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Badge variant="secondary">3</Badge>
                Find Near You
              </h3>
              <p className="text-muted-foreground">
                Enable location access to see hawker centers sorted by distance from you. Quickly find the nearest open options.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Badge variant="secondary">4</Badge>
                View Details
              </h3>
              <p className="text-muted-foreground">
                Click on any hawker center to view detailed information including address, closure schedule, number of stalls, and links to directions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Source Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle>Data Source</CardTitle>
            </div>
            <CardDescription>Accurate, official information you can trust</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              All closure information is sourced directly from the <strong>National Environment Agency (NEA)</strong>, Singapore&apos;s official authority for hawker center management.
            </p>
            <p className="text-muted-foreground">
              The data includes:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Quarterly cleaning schedules (Q1, Q2, Q3, Q4)</li>
              <li>Maintenance and repair works</li>
              <li>Hawker center locations and details</li>
              <li>Number of food and market stalls</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              Data is updated regularly to reflect the latest closure schedules from NEA.
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-semibold mb-2">Official CSV Data Sources:</p>
              <ul className="text-sm space-y-2">
                <li>
                  <Link
                    href="https://data.gov.sg/datasets/d_bda4baa634dd1cc7a6c7cad5f19e2d68/view"
                    target="_blank"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    NEA Hawker Centres Closure Dates
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://data.gov.sg/datasets/d_3751791452397f1b1c80c451447e40b7/view"
                    target="_blank"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    Singapore Public Holidays 2025
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Features Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>Key Features</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Interactive Map</h3>
                <p className="text-sm text-muted-foreground">
                  Visual representation of all hawker centers with real-time status indicators
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Date Selection</h3>
                <p className="text-sm text-muted-foreground">
                  Check closure status for any date, perfect for planning future meals
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Location-Based</h3>
                <p className="text-sm text-muted-foreground">
                  Find hawker centers near you with distance calculations
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Detailed Info</h3>
                <p className="text-sm text-muted-foreground">
                  View complete information about each hawker center including stall counts
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Mobile-Friendly</h3>
                <p className="text-sm text-muted-foreground">
                  Optimized for mobile devices with responsive design
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Fast & Reliable</h3>
                <p className="text-sm text-muted-foreground">
                  Lightning-fast performance with accurate data
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle>Privacy & Location</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Your privacy is important to us. Here&apos;s how we handle location data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Location access is <strong>optional</strong> and only requested when you click &quot;Find Near Me&quot;</li>
              <li>Your location is <strong>never stored</strong> on our servers</li>
              <li>Location data is only used to calculate distances to hawker centers</li>
              <li>The app works fully without location access</li>
              <li>You can revoke location permission at any time through your browser settings</li>
            </ul>
          </CardContent>
        </Card>

        {/* Technology Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-primary" />
              <CardTitle>Technology</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This app is built with modern web technologies to ensure fast performance and great user experience:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li><strong>Next.js 15</strong> - React framework for production</li>
              <li><strong>TypeScript</strong> - Type-safe code</li>
              <li><strong>Tailwind CSS</strong> - Modern styling</li>
              <li><strong>Leaflet.js</strong> - Interactive mapping</li>
              <li><strong>shadcn/ui</strong> - Beautiful UI components</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              The source code is designed to be maintainable, performant, and accessible.
            </p>
          </CardContent>
        </Card>

        {/* Disclaimer Section */}
        <Card className="mb-6 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <CardHeader>
            <CardTitle className="text-orange-900 dark:text-orange-100">Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-orange-800 dark:text-orange-200 space-y-2">
            <p>
              While we strive to provide accurate and up-to-date information, closure schedules may change without prior notice. We recommend:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Checking the app shortly before your visit</li>
              <li>Having backup dining options in mind</li>
              <li>Verifying with local sources if planning special events</li>
            </ul>
            <p className="mt-4">
              This is an independent project and is not officially affiliated with NEA or the Singapore government.
            </p>
          </CardContent>
        </Card>

        {/* Back to Map CTA */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <MapPin className="h-5 w-5" />
            Back to Map
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>
            Made with care for the Singapore community
          </p>
          <p className="mt-2">
            Data source: National Environment Agency (NEA), Singapore
          </p>
        </footer>
      </main>
    </div>
  );
};

export default AboutPage;
