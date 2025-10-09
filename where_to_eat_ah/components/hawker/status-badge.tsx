import { Badge } from "@/components/ui/badge";
import { StatusType } from "@/types/hawker";
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  showIcon?: boolean;
}

const statusConfig = {
  open: {
    variant: "open" as const,
    label: "OPEN",
    icon: CheckCircle2,
  },
  "closed-cleaning": {
    variant: "closed" as const,
    label: "CLOSED",
    icon: XCircle,
  },
  "closed-maintenance": {
    variant: "maintenance" as const,
    label: "MAINTENANCE",
    icon: AlertTriangle,
  },
  unknown: {
    variant: "unknown" as const,
    label: "UNKNOWN",
    icon: HelpCircle,
  },
};

export const StatusBadge = ({ status, className, showIcon = true }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        "inline-flex items-center gap-1.5",
        "transition-all duration-200 ease-in-out",
        "shadow-sm",
        className
      )}
    >
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      {config.label}
    </Badge>
  );
};
