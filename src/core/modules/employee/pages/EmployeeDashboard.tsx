import { useMemo } from "react";
import { DailyAttendanceCard } from "../components/speciel-components/DashboardComponents";
import { LoadingSkeleton, QueryErrorNotice } from "../components/commend-components";
import { useMyMonthlyAttendance, useCheckIn, useCheckOut } from "../../../../api/hooks/useAttendance";
import useAuthStore from "../../../../store/authStore";
import { ApiError } from "../../../../lib/http/ApiError";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function EmployeeDashboard() {
  const user = useAuthStore((s) => s.user);
  const monthly = useMyMonthlyAttendance();
  const checkIn = useCheckIn();
  const checkOut = useCheckOut();

  const todayRecord = useMemo(() => {
    if (!monthly.data) return undefined;
    return monthly.data.find((record) => record.date === todayIso()) ?? null;
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
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <div className="min-w-0 w-full rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-50 bg-white">
          <h2 className="text-base font-semibold text-dark">More employee features coming soon</h2>
          <p className="text-sm text-gray-500 mt-2">
            Additional self-service features will appear here as backend routes become available.
          </p>
        </div>
      </div>
    </div>
  );
}
