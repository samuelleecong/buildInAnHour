"use client";

import { WifiOff, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OfflinePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-muted flex items-center justify-center">
            <WifiOff className="h-10 w-10 text-muted-foreground animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold">You&apos;re Offline</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              It looks like you&apos;ve lost your internet connection. Some features may be unavailable.
            </p>
            <p className="text-sm text-muted-foreground">
              Don&apos;t worry, you can still view previously loaded hawker centers!
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => window.location.reload()}
              className="w-full gap-2"
              size="lg"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>

            <Link href="/" className="block">
              <Button variant="outline" className="w-full gap-2" size="lg">
                <Home className="h-4 w-4" />
                Go to Home
              </Button>
            </Link>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-sm">Offline Features:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>View cached hawker center list</li>
              <li>Access recently viewed locations</li>
              <li>Browse saved favorites</li>
            </ul>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Your data will sync automatically when you&apos;re back online
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfflinePage;
