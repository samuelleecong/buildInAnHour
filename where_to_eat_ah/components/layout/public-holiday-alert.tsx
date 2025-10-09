import { AlertCircle } from "lucide-react";
import { getPublicHolidayForDate } from "@/lib/utils/public-holidays";

interface PublicHolidayAlertProps {
  selectedDate: Date;
}

export const PublicHolidayAlert = ({ selectedDate }: PublicHolidayAlertProps) => {
  const holiday = getPublicHolidayForDate(selectedDate);

  if (!holiday) {
    return null;
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex gap-3">
      <div className="flex-shrink-0">
        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
          {holiday.holiday}
        </p>
        <p className="text-xs text-amber-800 dark:text-amber-200">
          Operating hours may be affected on public holidays. Some stalls may be closed or operate on reduced hours.
        </p>
      </div>
    </div>
  );
};
