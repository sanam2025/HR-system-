import { useMemo } from "react";
import {
  LeaveBalanceCard,
  HourlyLeaveRequestsCard,
  LeaveRequestsCard,
  MonthlyAttendanceCard,
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
  const leaveRequests = useMyLeaveRequests();
  const hourlyLeaveRequests = useMyHourlyLeaveRequests();
  const leaveBalance = useMyLeaveBalance();
  const monthly = useMyMonthlyAttendance();
  const createLeaveRequest = useCreateLeaveRequest();
  const deleteLeaveRequest = useDeleteLeaveRequest();
  const createHourlyLeaveRequest = useCreateHourlyLeaveRequest();
  const deleteHourlyLeaveRequest = useDeleteHourlyLeaveRequest();

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <LeaveBalanceCard
        balance={leaveBalance.data}
        isLoading={leaveBalance.isLoading}
        errorMessage={(leaveBalance.error as ApiError | null)?.message ?? null}
      />
      <MonthlyAttendanceCard
        records={monthly.data}
        isLoading={monthly.isLoading}
        errorMessage={(monthly.error as ApiError | null)?.message ?? null}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <RequestLeaveCard
          onSubmit={(payload) => createLeaveRequest.mutate(payload)}
          isSubmitting={createLeaveRequest.isPending}
          errorMessage={(createLeaveRequest.error as ApiError | null)?.message ?? null}
        />
        <LeaveRequestsCard
          requests={leaveRequests.data}
          isLoading={leaveRequests.isLoading}
          errorMessage={(leaveRequests.error as ApiError | null)?.message ?? null}
          onCancel={(id) => deleteLeaveRequest.mutate(id)}
          cancelingId={deleteLeaveRequest.isPending ? (deleteLeaveRequest.variables as number) : null}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <RequestHourlyLeaveCard
          onSubmit={(payload) => createHourlyLeaveRequest.mutate(payload)}
          isSubmitting={createHourlyLeaveRequest.isPending}
          errorMessage={(createHourlyLeaveRequest.error as ApiError | null)?.message ?? null}
        />
        <HourlyLeaveRequestsCard
          requests={hourlyLeaveRequests.data}
          isLoading={hourlyLeaveRequests.isLoading}
          errorMessage={(hourlyLeaveRequests.error as ApiError | null)?.message ?? null}
          onCancel={(id) => deleteHourlyLeaveRequest.mutate(id)}
          cancelingId={deleteHourlyLeaveRequest.isPending ? (deleteHourlyLeaveRequest.variables as number) : null}
        />
      </div>
    </div>
  );
}
