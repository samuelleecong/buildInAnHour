"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/hawker/status-badge";
import { HawkerCenterStatus } from "@/types/hawker";
import { MapPin, Store, Crown, XCircle, Clock } from "lucide-react";
import { format, addDays, isBefore } from "date-fns";
import { cn } from "@/lib/utils";

interface HawkerCardProps {
  hawkerCenter: HawkerCenterStatus;
  onClick?: () => void;
  className?: string;
}

export const HawkerCard = ({ hawkerCenter, onClick, className }: HawkerCardProps) => {
  const isNearest = hawkerCenter.nearestRank !== undefined;

  // Check if closing soon (open now but will close within 7 days)
  const sevenDaysFromNow = addDays(new Date(), 7);
  const isClosingSoon =
    hawkerCenter.isOpen &&
    hawkerCenter.closureEnd &&
    isBefore(hawkerCenter.closureEnd, sevenDaysFromNow);

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-300 ease-out",
        "hover:shadow-lg hover:-translate-y-1 hover:scale-[1.01]",
        "border border-border/50 bg-card",
        "group overflow-hidden",
        isNearest && "ring-2 ring-amber-400 ring-offset-2 bg-amber-50/30",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex flex-col gap-3">
          {/* Status and Rank Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={hawkerCenter.statusType} className="w-fit" />
            {isNearest && (
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 hover:from-amber-500 hover:to-amber-600 gap-1.5 shadow-sm"
              >
                <Crown className="h-3.5 w-3.5" />
                #{hawkerCenter.nearestRank} Nearest
              </Badge>
            )}
            {isClosingSoon && (
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600 gap-1.5 shadow-sm animate-pulse"
              >
                <Clock className="h-3.5 w-3.5" />
                Closing Soon
              </Badge>
            )}
          </div>

          {/* Name */}
          <h3 className="font-bold text-lg leading-tight text-foreground group-hover:text-primary transition-colors">
            {hawkerCenter.name}
          </h3>

          {/* Address */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {hawkerCenter.address}
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            {hawkerCenter.distance && (
              <div className="flex items-center gap-1.5 font-medium">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>{hawkerCenter.distance.toFixed(1)} km away</span>
              </div>
            )}

            {hawkerCenter.stallCounts && (
              <div className="flex items-center gap-1.5">
                <Store className="h-3.5 w-3.5" />
                <span>{hawkerCenter.stallCounts.food} food stalls</span>
              </div>
            )}
          </div>

          {/* Closure Info */}
          {!hawkerCenter.isOpen && hawkerCenter.closureEnd && (
            <div className="text-xs text-red-600 font-semibold pt-2 border-t border-red-100 bg-red-50 -mx-5 -mb-5 px-5 py-3 mt-2">
              <div className="flex items-center gap-1.5">
                <XCircle className="h-3.5 w-3.5" />
                Closed until: {format(hawkerCenter.closureEnd, "MMM d, yyyy")}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
