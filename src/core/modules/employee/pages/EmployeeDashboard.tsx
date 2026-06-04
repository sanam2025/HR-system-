import { DailyAttendanceCard, LeaveBalanceCard, RecentTasksCard, AnnouncementsCard } from "../components/speciel-components/DashboardComponents";
import { mockDashboardData } from "../data/mockEmployeeData";

export default function EmployeeDashboard() {
  const data = mockDashboardData;
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-dark break-words">{data.greeting}</h1>
        <span className="text-sm text-gray-400 font-medium whitespace-nowrap flex-shrink-0">{data.date}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailyAttendanceCard data={data.dailyAttendance} />
        <LeaveBalanceCard data={data.leaveBalance} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="min-w-0 w-full">
          <RecentTasksCard tasks={data.recentTasks} />
        </div>
        <div className="min-w-0 w-full">
          <AnnouncementsCard announcements={data.announcements} />
        </div>
      </div>
    </div>
  );
}
