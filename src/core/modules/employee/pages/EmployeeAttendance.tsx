import { useMemo } from "react";
import {
  AlertBannerCard,
  LeaveBalanceCard,
  PendingHourlyRequestsCard,
  PendingRequestsCard,
  RecentAttendanceLogCard,
  RequestHourlyLeaveCard,
  RequestLeaveCard,
} from "../components/speciel-components/AttendanceComponents";
import { useMyLeaveBalance, useMyLeaveRequests, useCreateLeaveRequest, useDeleteLeaveRequest } from "../../../../api/hooks/useLeaveRequests";
import {
  useCreateHourlyLeaveRequest,
  useDeleteHourlyLeaveRequest,
  useMyHourlyLeaveRequests,
} from "../../../../api/hooks/useHourlyLeaveRequests";
import { useMyMonthlyAttendance } from "../../../../api/hooks/useAttendance";
import { ApiError } from "../../../../lib/http/ApiError";
import { isSameCalendarDay } from "../../../../lib/date";

export default function EmployeeAttendance() {
  const pendingLeaveRequests = useMyLeaveRequests("pending");
  const pendingHourlyLeaveRequests = useMyHourlyLeaveRequests("pending");
  const leaveBalance = useMyLeaveBalance();
  const monthly = useMyMonthlyAttendance();
  const createLeaveRequest = useCreateLeaveRequest();
  const deleteLeaveRequest = useDeleteLeaveRequest();
  const createHourlyLeaveRequest = useCreateHourlyLeaveRequest();
  const deleteHourlyLeaveRequest = useDeleteHourlyLeaveRequest();

  const alertMessage = useMemo(() => {
    if (!monthly.data) return null;
    const today = monthly.data.find((r) => isSameCalendarDay(r.date));
    if (!today?.check_in) return "You haven't checked in yet today.";
    return null;
  }, [monthly.data]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <AlertBannerCard message={alertMessage} />
      <LeaveBalanceCard
        balance={leaveBalance.data}
        isLoading={leaveBalance.isLoading}
        errorMessage={(leaveBalance.error as ApiError | null)?.message ?? null}
      />
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
            log={monthly.data}
            isLoading={monthly.isLoading}
            errorMessage={(monthly.error as ApiError | null)?.message ?? null}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <RequestHourlyLeaveCard
          onSubmit={(payload) => createHourlyLeaveRequest.mutate(payload)}
          isSubmitting={createHourlyLeaveRequest.isPending}
          errorMessage={(createHourlyLeaveRequest.error as ApiError | null)?.message ?? null}
        />
        <PendingHourlyRequestsCard
          requests={pendingHourlyLeaveRequests.data}
          isLoading={pendingHourlyLeaveRequests.isLoading}
          errorMessage={(pendingHourlyLeaveRequests.error as ApiError | null)?.message ?? null}
          onCancel={(id) => deleteHourlyLeaveRequest.mutate(id)}
          cancelingId={deleteHourlyLeaveRequest.isPending ? (deleteHourlyLeaveRequest.variables as number) : null}
        />
      </div>
    </div>
  );
}
