import { Bell, Clock, Megaphone } from "lucide-react";
import { Badge, LoadingSkeleton, QueryErrorNotice } from "../commend-components";
import { humanizeStatus } from "../../../../../lib/text";
import type { AppNotification, AttendanceRecord, Announcement } from "../../../../../api/models";

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

function priorityVariant(priority?: string): "danger" | "warning" | "default" {
  if (priority === "high") return "danger";
  if (priority === "medium") return "warning";
  return "default";
}

export interface AnnouncementsCardProps {
  announcements: Announcement[] | undefined;
  isLoading: boolean;
  errorMessage?: string | null;
}

export function AnnouncementsCard({ announcements, isLoading, errorMessage }: AnnouncementsCardProps) {
  return (
    <article className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-50 h-full">
      <header className="flex items-center gap-2 text-gray-500 text-sm mb-3 sm:mb-4">
        <Megaphone size={16} aria-hidden="true" />
        <span>Announcements</span>
      </header>
      {isLoading ? (
        <LoadingSkeleton lines={3} />
      ) : errorMessage ? (
        <QueryErrorNotice message={errorMessage} />
      ) : !announcements || announcements.length === 0 ? (
        <p className="text-sm text-gray-400">No active announcements right now.</p>
      ) : (
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="p-3 rounded-xl bg-gray-50">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-dark">{announcement.title}</p>
                {announcement.priority && (
                  <Badge variant={priorityVariant(announcement.priority)}>{humanizeStatus(announcement.priority)}</Badge>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">{announcement.content}</p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export interface NotificationsCardProps {
  notifications: AppNotification[] | undefined;
  isLoading: boolean;
  errorMessage?: string | null;
  onMarkRead: (id: string) => void;
  markingReadId?: string | null;
}

/** Turns `App\Notifications\Salary\OverTimePendingApprovalNotification` into "Over Time Pending Approval". */
function humanizeNotificationType(type: string | undefined): string {
  if (!type) return "Notification";
  const className = type.split("\\").pop() ?? type;
  const withoutSuffix = className.replace(/Notification$/, "");
  return withoutSuffix.replace(/([a-z])([A-Z])/g, "$1 $2").trim() || "Notification";
}

export function NotificationsCard({
  notifications,
  isLoading,
  errorMessage,
  onMarkRead,
  markingReadId,
}: NotificationsCardProps) {
  return (
    <article className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-50 h-full">
      <header className="flex items-center gap-2 text-gray-500 text-sm mb-3 sm:mb-4">
        <Bell size={16} aria-hidden="true" />
        <span>Notifications</span>
      </header>
      {isLoading ? (
        <LoadingSkeleton lines={3} />
      ) : errorMessage ? (
        <QueryErrorNotice message={errorMessage} />
      ) : !notifications || notifications.length === 0 ? (
        <p className="text-sm text-gray-400">You're all caught up.</p>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-dark truncate">
                  {humanizeNotificationType(notification.type)}
                </p>
                {notification.data?.message && (
                  <p className="text-xs text-gray-400 truncate">{notification.data.message}</p>
                )}
              </div>
              {!notification.read_at && (
                <button
                  type="button"
                  onClick={() => onMarkRead(notification.id)}
                  disabled={markingReadId === notification.id}
                  className="flex-shrink-0 text-xs font-medium text-green hover:text-green-dark disabled:opacity-50"
                >
                  {markingReadId === notification.id ? "…" : "Mark read"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
