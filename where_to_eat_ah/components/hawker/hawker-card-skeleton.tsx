"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface HawkerCardSkeletonProps {
  className?: string;
}

export const HawkerCardSkeleton = ({ className }: HawkerCardSkeletonProps) => {
  return (
    <Card
      className={cn(
        "border border-border/50 bg-card overflow-hidden",
        className
      )}
    >
      <CardContent className="p-5">
        <div className="flex flex-col gap-3 animate-pulse">
          {/* Status Badge Skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-6 w-20 bg-muted rounded-full" />
            <div className="h-6 w-24 bg-muted rounded-full" />
          </div>

          {/* Name Skeleton */}
          <div className="h-6 w-3/4 bg-muted rounded" />

          {/* Address Skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-2/3 bg-muted rounded" />
          </div>

          {/* Metadata Skeleton */}
          <div className="flex items-center gap-4">
            <div className="h-4 w-20 bg-muted rounded" />
            <div className="h-4 w-24 bg-muted rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Component for loading multiple skeletons
interface HawkerCardSkeletonsProps {
  count?: number;
  className?: string;
}

export const HawkerCardSkeletons = ({ count = 5, className }: HawkerCardSkeletonsProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <HawkerCardSkeleton key={index} />
      ))}
    </div>
  );
};
