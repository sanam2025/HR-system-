import { useMemo } from "react";
import {
  AnnouncementsCard,
  DailyAttendanceCard,
  NotificationsCard,
} from "../components/speciel-components/DashboardComponents";
import { LoadingSkeleton, QueryErrorNotice } from "../components/commend-components";
import { useCheckIn, useCheckOut, useMyMonthlyAttendance } from "../../../../api/hooks/useAttendance";
import { useActiveAnnouncements } from "../../../../api/hooks/useAnnouncements";
import { useMarkNotificationRead, useNotifications } from "../../../../api/hooks/useNotifications";
import useAuthStore from "../../../../store/authStore";
import { ApiError } from "../../../../lib/http/ApiError";
import { isSameCalendarDay } from "../../../../lib/date";

export default function EmployeeDashboard() {
  const user = useAuthStore((s) => s.user);
  const monthly = useMyMonthlyAttendance();
  const checkIn = useCheckIn();
  const checkOut = useCheckOut();
  const announcements = useActiveAnnouncements();
  const notifications = useNotifications();
  const markRead = useMarkNotificationRead();

  const todayRecord = useMemo(() => {
    if (!monthly.data) return undefined;
    return monthly.data.find((record) => isSameCalendarDay(record.date)) ?? null;
  }, [monthly.data]);

  const greeting = user?.fullName ? `Welcome back, ${user.fullName.split(" ")[0]}` : "Welcome back";
  const date = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const actionError =
    (checkIn.error as ApiError | null)?.message ?? (checkOut.error as ApiError | null)?.message ?? null;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-dark break-words">{greeting}</h1>
        <span className="text-sm text-gray-400 font-medium whitespace-nowrap flex-shrink-0">{date}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="min-w-0 w-full">
          {monthly.isLoading ? (
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-50">
              <LoadingSkeleton />
            </div>
          ) : monthly.isError ? (
            <QueryErrorNotice message={(monthly.error as ApiError).message} />
          ) : (
            <DailyAttendanceCard
              todayRecord={todayRecord}
              onCheckIn={() => checkIn.mutate()}
              onCheckOut={() => checkOut.mutate()}
              isCheckingIn={checkIn.isPending}
              isCheckingOut={checkOut.isPending}
              actionError={actionError}
            />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <AnnouncementsCard
          announcements={announcements.data}
          isLoading={announcements.isLoading}
          errorMessage={(announcements.error as ApiError | null)?.message ?? null}
        />
        <NotificationsCard
          notifications={notifications.data}
          isLoading={notifications.isLoading}
          errorMessage={(notifications.error as ApiError | null)?.message ?? null}
          onMarkRead={(id) => markRead.mutate(id)}
          markingReadId={markRead.isPending ? (markRead.variables as string) : null}
        />
      </div>
    </div>
  );
}
