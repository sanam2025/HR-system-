import { useMemo, useState } from "react";
import { Percent, Sun, Thermometer, Ban } from "lucide-react";
import {
  AlertBannerCard,
  RequestLeaveCard,
  PendingRequestsCard,
  RecentAttendanceLogCard,
} from "../components/speciel-components/AttendanceComponents";
import { useMyLeaveRequests, useCreateLeaveRequest, useDeleteLeaveRequest, useMyLeaveBalance } from "../../../../api/hooks/useLeaveRequests";
import { useMyMonthlyAttendance, useFilteredAttendance, useAttendancePercentage } from "../../../../api/hooks/useAttendance";
import { StatCard, LoadingSkeleton, QueryErrorNotice } from "../components/commend-components";
import { ApiError } from "../../../../lib/http/ApiError";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function AttendanceStatsRow() {
  const percentage = useAttendancePercentage();
  const balance = useMyLeaveBalance();

  if (percentage.isLoading || balance.isLoading) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        <LoadingSkeleton lines={2} />
      </div>
    );
  }
  if (percentage.isError || balance.isError) {
    return (
      <QueryErrorNotice
        message={((percentage.error ?? balance.error) as ApiError).message}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {percentage.data && (
        <StatCard
          icon={Percent}
          label="Attendance rate"
          value={`${percentage.data.percentage}%`}
        />
      )}
      {balance.data && (
        <>
          <StatCard icon={Sun} label="Annual leave left" value={String(balance.data.annual)} />
          <StatCard icon={Thermometer} label="Sick leave left" value={String(balance.data.sick)} />
          <StatCard icon={Ban} label="Unpaid leave used" value={String(balance.data.unpaid)} />
        </>
      )}
    </div>
  );
}

export default function EmployeeAttendance() {
  const pendingLeaveRequests = useMyLeaveRequests("pending");
  const monthly = useMyMonthlyAttendance();
  const createLeaveRequest = useCreateLeaveRequest();
  const deleteLeaveRequest = useDeleteLeaveRequest();

  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });
  const isFiltered = Boolean(dateFilter.from && dateFilter.to);
  const filtered = useFilteredAttendance(dateFilter);

  const alertMessage = useMemo(() => {
    if (!monthly.data) return null;
    const today = monthly.data.find((r) => r.date === todayIso());
    if (!today?.check_in) return "You haven't checked in yet today.";
    return null;
  }, [monthly.data]);

  const log = isFiltered ? filtered.data : monthly.data;
  const logIsLoading = isFiltered ? filtered.isLoading : monthly.isLoading;
  const logError = isFiltered
    ? (filtered.error as ApiError | null)?.message ?? null
    : (monthly.error as ApiError | null)?.message ?? null;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <AlertBannerCard message={alertMessage} />
      <AttendanceStatsRow />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-4 sm:space-y-6 min-w-0">
          <RequestLeaveCard
            onSubmit={(payload) => createLeaveRequest.mutate(payload)}
            isSubmitting={createLeaveRequest.isPending}
            errorMessage={(createLeaveRequest.error as ApiError | null)?.message ?? null}
          />
          <PendingRequestsCard
            requests={pendingLeaveRequests.data}
            isLoading={pendingLeaveRequests.isLoading}
            errorMessage={(pendingLeaveRequests.error as ApiError | null)?.message ?? null}
            onCancel={(id) => deleteLeaveRequest.mutate(id)}
            cancelingId={deleteLeaveRequest.isPending ? (deleteLeaveRequest.variables as number) : null}
          />
        </div>
        <div className="min-w-0">
          <RecentAttendanceLogCard
            log={log}
            isLoading={logIsLoading}
            errorMessage={logError}
            filter={dateFilter}
            onFilterChange={setDateFilter}
            onClearFilter={() => setDateFilter({ from: "", to: "" })}
            isFiltered={isFiltered}
          />
        </div>
      </div>
    </div>
  );
}
