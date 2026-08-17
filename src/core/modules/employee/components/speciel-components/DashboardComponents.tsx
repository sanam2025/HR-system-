import { Clock } from "lucide-react";
import { Badge } from "../commend-components";
import type { AttendanceRecord } from "../../../../../api/models";

function formatTime(isoOrTime: string | null): string | null {
  if (!isoOrTime) return null;
  const asDate = new Date(isoOrTime);
  if (!Number.isNaN(asDate.getTime())) {
    return asDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  // Some Laravel APIs return a bare "HH:MM:SS" time string rather than a
  // full ISO datetime — display it as-is rather than failing to parse.
  return isoOrTime;
}

export interface DailyAttendanceCardProps {
  todayRecord: AttendanceRecord | null | undefined;
  onCheckIn: () => void;
  onCheckOut: () => void;
  isCheckingIn: boolean;
  isCheckingOut: boolean;
  actionError?: string | null;
}

export function DailyAttendanceCard({
  todayRecord,
  onCheckIn,
  onCheckOut,
  isCheckingIn,
  isCheckingOut,
  actionError,
}: DailyAttendanceCardProps) {
  const checkedIn = Boolean(todayRecord?.check_in);
  const checkedOut = Boolean(todayRecord?.check_out);

  const status = checkedOut ? "Checked Out" : checkedIn ? "Checked In" : "Not Checked In";
  const badgeVariant = checkedOut ? "success" : checkedIn ? "warning" : "default";
  const headline = checkedOut
    ? formatTime(todayRecord?.check_out ?? null)
    : checkedIn
      ? formatTime(todayRecord?.check_in ?? null)
      : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <article className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md animate-scale-in">
      <header className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Clock size={16} aria-hidden="true" />
          <span>Daily Attendance</span>
        </div>
        <Badge variant={badgeVariant}>{status}</Badge>
      </header>
      <p className="text-2xl sm:text-3xl font-bold text-dark mb-3 sm:mb-4" aria-live="polite">
        <time>{headline}</time>
      </p>
      {actionError && <p className="text-xs text-red-600 mb-3">{actionError}</p>}
      <div className="flex gap-3 w-full">
        <button
          type="button"
          onClick={onCheckIn}
          disabled={checkedIn || isCheckingIn}
          className="flex-1 py-2.5 px-3 bg-green text-white rounded-xl text-sm font-medium whitespace-nowrap hover:bg-green-dark transition-colors active:scale-[0.97] transition-transform duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Check in for today"
        >
          {isCheckingIn ? "Checking in…" : "Check In"}
        </button>
        <button
          type="button"
          onClick={onCheckOut}
          disabled={!checkedIn || checkedOut || isCheckingOut}
          className="flex-1 py-2.5 px-3 bg-beige text-green border border-green rounded-xl text-sm font-medium whitespace-nowrap hover:bg-beige-dark transition-colors active:scale-[0.97] transition-transform duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Check out for today"
        >
          {isCheckingOut ? "Checking out…" : "Check Out"}
        </button>
      </div>
    </article>
  );
}
