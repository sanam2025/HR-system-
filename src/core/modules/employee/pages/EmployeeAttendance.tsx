import { AlertBannerCard, RequestLeaveCard, PendingRequestsCard, RecentAttendanceLogCard } from "../components/speciel-components/AttendanceComponents";
import { mockAttendanceData } from "../data/mockEmployeeData";

export default function EmployeeAttendance() {
  const data = mockAttendanceData;
  return (
    <div className="space-y-6 animate-fade-in">
      <AlertBannerCard message={data.alertMessage} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6 min-w-0">
          <RequestLeaveCard />
          <PendingRequestsCard requests={data.pendingRequests} />
        </div>
        <div className="min-w-0">
          <RecentAttendanceLogCard log={data.recentLog} />
        </div>
      </div>
    </div>
  );
}
