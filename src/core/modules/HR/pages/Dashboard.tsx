// core/modules/HR/pages/Dashboard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Calendar, TrendingUp, DollarSign } from "lucide-react";
import StatCard from "../Components/common_Components/StatCard";
import LeaveRequestItem from "../Components/Special_Components/LeaveRequestItem";

// ============= Data (Static) =============

const statsData = {
  totalEmployees: 6,
  pendingLeaves: 2,
  attendanceRate: "88.5%",
  payrollCost: "4,520,000 SYP",
};

const leaveRequests = [
  { name: "Rana Al-Ali", title: "Professor", department: "Basic Sciences" },
  {
    name: "Mohammed Al-Hassan",
    title: "Teaching Assistant",
    department: "Information Technology Engineering",
  },
];

// ============= Main Component =============

export default function Dashboard() {
  const navigate = useNavigate();

  // Navigation functions
  const goToEmployees = () => navigate("/Hr/employees");
  const goToLeaves = () => navigate("/Hr/leaves");
  const goToAttendance = () => navigate("/Hr/attendance");
  const goToPayroll = () => navigate("/Hr/payroll");

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome to HR Dashboard
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Overview of employee performance and statistics.
        </p>
      </div>

      {/* Stats Grid - 4 Cards (بدون شكاوى) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Employees"
          value={statsData.totalEmployees}
          icon={<Users className="w-5 h-5" />}
          color="blue"
          onClick={goToEmployees}
        />
        <StatCard
          title="Pending Leave Requests"
          value={statsData.pendingLeaves}
          icon={<Calendar className="w-5 h-5" />}
          color="orange"
          onClick={goToLeaves}
        />
        <StatCard
          title="Payroll Cost"
          value={statsData.payrollCost}
          icon={<DollarSign className="w-5 h-5" />}
          color="green"
          onClick={goToPayroll}
        />
        <StatCard
          title="Attendance Rate"
          value={statsData.attendanceRate}
          icon={<TrendingUp className="w-5 h-5" />}
          color="teal"
          onClick={goToAttendance}
        />
      </div>

      {/* Leave Requests Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            Leave Requests
          </h3>
          <span
            onClick={goToLeaves}
            className="text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded-full cursor-pointer hover:bg-amber-100 transition-colors"
          >
            {statsData.pendingLeaves} Pending
          </span>
        </div>
        <div className="divide-y divide-gray-50">
          {leaveRequests.map((request, idx) => (
            <LeaveRequestItem key={idx} {...request} />
          ))}
        </div>
      </div>
    </div>
  );
}
