// core/modules/HR/pages/Dashboard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Calendar, TrendingUp, DollarSign } from "lucide-react";
import StatCard from "../Components/common_Components/StatCard";
import LeaveRequestItem from "../Components/Special_Components/LeaveRequestItem";

// ============= Constants (رفع البيانات خارج المكون) =============
const STATS_DATA = {
  totalEmployees: 6,
  pendingLeaves: 2,
  attendanceRate: "88.5%",
  payrollCost: "4,520,000 SYP",
} as const;

const LEAVE_REQUESTS = [
  { name: "Rana Al-Ali", title: "Professor", department: "Basic Sciences" },
  { name: "Mohammed Al-Hassan", title: "Teaching Assistant", department: "Information Technology Engineering" },
] as const;

// ============= Configuration (تكوين البطاقات) =============
const STATS_CONFIG = [
  { key: "totalEmployees" as const, title: "Total Employees", icon: Users, color: "blue" as const, path: "/Hr/employees" },
  { key: "pendingLeaves" as const, title: "Pending Leave Requests", icon: Calendar, color: "orange" as const, path: "/Hr/leaves" },
  { key: "payrollCost" as const, title: "Payroll Cost", icon: DollarSign, color: "green" as const, path: "/Hr/payroll" },
  { key: "attendanceRate" as const, title: "Attendance Rate", icon: TrendingUp, color: "teal" as const, path: "/Hr/attendance" },
] as const;

// ============= Helper Functions =============
const getStatValue = (key: keyof typeof STATS_DATA) => STATS_DATA[key];

// ============= Main Component =============
export default function Dashboard() {
  const navigate = useNavigate();

  // Single navigation handler
  const handleNavigate = (path: string) => () => navigate(path);

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      {/* Header - يمكن نقله إلى Component منفصل مستقبلاً */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to HR Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">Overview of employee performance and statistics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {STATS_CONFIG.map(({ key, title, icon: Icon, color, path }) => (
          <StatCard
            key={key}
            title={title}
            value={getStatValue(key)}
            icon={<Icon className="w-5 h-5" />}
            color={color}
            onClick={handleNavigate(path)}
          />
        ))}
      </div>

      {/* Leave Requests Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Leave Requests</h3>
          <span
            onClick={handleNavigate("/Hr/leaves")}
            className="text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded-full cursor-pointer hover:bg-amber-100 transition-colors"
          >
            {STATS_DATA.pendingLeaves} Pending
          </span>
        </div>
        <div className="divide-y divide-gray-50">
          {LEAVE_REQUESTS.map((request, idx) => (
            <LeaveRequestItem key={idx} {...request} />
          ))}
        </div>
      </div>
    </div>
  );
}