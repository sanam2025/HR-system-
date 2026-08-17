import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useMarkNotificationRead, useNotifications } from "../../../../../api/hooks/useNotifications";
import { LoadingSkeleton, QueryErrorNotice } from "../commend-components";
import { ApiError } from "../../../../../lib/http/ApiError";
import type { Notification } from "../../../../../api/models";

/**
 * `data` shape is unknown (see models.ts) — falls back to the notification's
 * `type` string when no obviously human-readable field is present, rather
 * than guessing at field names the backend hasn't documented.
 */
function describeNotification(notification: Notification): string {
  const data = notification.data ?? {};
  const candidate = data.message ?? data.title ?? data.body;
  if (typeof candidate === "string" && candidate.trim()) return candidate;
  return notification.type.split("\\").pop() || "Notification";
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const notifications = useNotifications();
  const markRead = useMarkNotificationRead();

  const items = notifications.data?.items ?? [];
  const unreadCount = items.filter((n) => !n.read_at).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors text-dark/60 hover:text-dark"
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-2xl shadow-lg border border-gray-100 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-sm font-semibold text-dark">Notifications</p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.isLoading ? (
              <div className="p-4">
                <LoadingSkeleton lines={3} />
              </div>
            ) : notifications.isError ? (
              <div className="p-4">
                <QueryErrorNotice message={(notifications.error as ApiError).message} />
              </div>
            ) : items.length === 0 ? (
              <p className="text-sm text-gray-400 px-4 py-6 text-center">No notifications yet.</p>
            ) : (
              items.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => !notification.read_at && markRead.mutate(notification.id)}
                  className={`w-full text-left px-4 py-3 text-sm border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors flex items-start gap-2 ${
                    notification.read_at ? "text-gray-400" : "text-dark font-medium"
                  }`}
                >
                  {!notification.read_at && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green mt-1.5 flex-shrink-0" aria-hidden="true" />
                  )}
                  <span className="min-w-0 break-words">{describeNotification(notification)}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
