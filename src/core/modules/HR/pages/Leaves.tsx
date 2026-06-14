// core/modules/HR/pages/Leaves.tsx
import React, { useState } from "react";
import { Calendar, CheckCircle, Clock, XCircle, Users } from "lucide-react";
import StatCard from "../Components/common_Components/StatCard";
import LeaveRequestTableRow from "../Components/Special_Components/LeaveRequestTableRow";
import type { LeaveRequest, LeaveStatus, LeaveStats } from "../types/leaves.types";
import { calculateLeaveStats } from "../types/leaves.types";

// ============= Constants (رفع البيانات خارج المكون) =============
const LEAVE_REQUESTS_DATA: LeaveRequest[] = [
  {
    id: "1",
    employeeName: "Mohammed Al-Hassan",
    department: "Information Technology Engineering",
    leaveType: "annual",
    startDate: "2026-05-19",
    endDate: "2026-05-25",
    duration: 7,
    reason: "Annual vacation",
    status: "pending",
    processedBy: "Admin",
  },
  {
    id: "2",
    employeeName: "Karim Salman",
    department: "Student Affairs",
    leaveType: "sick",
    startDate: "2026-05-16",
    endDate: "2026-05-18",
    duration: 3,
    reason: "Documented illness",
    status: "approved",
    processedBy: "Admin",
  },
  {
    id: "3",
    employeeName: "Wael Al-Masri",
    department: "Electrical Engineering",
    leaveType: "emergency",
    startDate: "2026-05-15",
    endDate: "2026-05-16",
    duration: 2,
    reason: "Family circumstances",
    status: "approved",
    processedBy: "Admin",
  },
  {
    id: "4",
    employeeName: "Zena Al-Ali",
    department: "Basic Sciences",
    leaveType: "annual",
    startDate: "2026-06-01",
    endDate: "2026-06-10",
    duration: 10,
    reason: "Annual vacation",
    status: "pending",
    processedBy: "Admin",
  },
] as const;

// ============= Stats Cards Configuration =============
const STATS_CARDS_CONFIG = [
  { key: "pending" as const, title: "Pending Requests", icon: Clock, color: "orange" as const },
  { key: "approved" as const, title: "Approved", icon: CheckCircle, color: "green" as const },
  { key: "rejected" as const, title: "Rejected", icon: XCircle, color: "red" as const },
  { key: "total" as const, title: "Total Requests", icon: Users, color: "blue" as const },
] as const;

// ============= Table Columns Configuration =============
const TABLE_COLUMNS = [
  { key: "employee", label: "Employee", className: "text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider" },
  { key: "department", label: "Department", className: "text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider" },
  { key: "leaveType", label: "Leave Type", className: "text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider" },
  { key: "duration", label: "Duration", className: "text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider" },
  { key: "reason", label: "Reason", className: "text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider" },
  { key: "status", label: "Status", className: "text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider" },
  { key: "actions", label: "Actions", className: "text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider" },
] as const;

// ============= Helper Functions =============
const getStats = (stats: LeaveStats) => STATS_CARDS_CONFIG.map(({ key, title, icon, color }) => ({
  title,
  value: stats[key],
  icon,
  color,
}));

// ============= Stats Cards Component =============
const StatsCards: React.FC<{ stats: LeaveStats }> = ({ stats }) => {
  const statsList = getStats(stats);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {statsList.map(({ title, value, icon: Icon, color }) => (
        <StatCard
          key={title}
          title={title}
          value={value}
          icon={<Icon className="w-5 h-5" />}
          color={color}
        />
      ))}
    </div>
  );
};

// ============= Empty State Component =============
const EmptyState: React.FC = () => (
  <div className="text-center py-12">
    <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
    <p className="text-sm text-gray-400">No leave requests found</p>
  </div>
);

// ============= Main Component =============
export default function Leaves() {
  const [requests, setRequests] = useState<LeaveRequest[]>(LEAVE_REQUESTS_DATA as LeaveRequest[]);
  const stats = calculateLeaveStats(requests);

  const handleView = (request: LeaveRequest) => {
    console.log("View request:", request);
  };

  const handleEdit = (request: LeaveRequest) => {
    console.log("Edit request:", request);
  };

  const handleStatusChange = (request: LeaveRequest, newStatus: LeaveStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === request.id ? { ...r, status: newStatus } : r))
    );
    console.log(`Request ${request.id} status changed to ${newStatus}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Review and manage leave requests submitted by employees.
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Leave Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/30">
                {TABLE_COLUMNS.map((col) => (
                  <th key={col.key} className={col.className}>
                    {col.label}
                  </th>
                ))}
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {requests.map((request) => (
                <LeaveRequestTableRow
                  key={request.id}
                  request={request}
                  onView={handleView}
                  onEdit={handleEdit}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </tbody>
           </table>
        </div>

        {/* Empty State */}
        {requests.length === 0 && <EmptyState />}
      </div>
    </div>
  );
}