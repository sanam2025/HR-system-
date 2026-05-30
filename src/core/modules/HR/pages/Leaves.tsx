// core/modules/HR/pages/Leaves.tsx
import React, { useState } from "react";
import { Calendar, CheckCircle, Clock, XCircle, Users } from "lucide-react";
import StatCard from "../Components/common_Components/StatCard";
import LeaveRequestTableRow from "../Components/Special_Components/LeaveRequestTableRow";
import type {
  LeaveRequest,
  LeaveStatus,
  LeaveStats,
} from "../types/leaves.types";
import { calculateLeaveStats } from "../types/leaves.types";

// ============= Data (Static) =============

const leaveRequests: LeaveRequest[] = [
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
];

// ============= Main Component =============

export default function Leaves() {
  const [requests, setRequests] = useState<LeaveRequest[]>(leaveRequests);
  const stats: LeaveStats = calculateLeaveStats(requests);

  const handleView = (request: LeaveRequest) => {
    console.log("View request:", request);
  };

  const handleEdit = (request: LeaveRequest) => {
    console.log("Edit request:", request);
  };

  const handleStatusChange = (
    request: LeaveRequest,
    newStatus: LeaveStatus,
  ) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === request.id ? { ...r, status: newStatus } : r)),
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

      {/* Stats Grid - 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Pending Requests"
          value={stats.pending}
          icon={<Clock className="w-5 h-5" />}
          color="orange"
        />
        <StatCard
          title="Approved"
          value={stats.approved}
          icon={<CheckCircle className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={<XCircle className="w-5 h-5" />}
          color="red"
        />
        <StatCard
          title="Total Requests"
          value={stats.total}
          icon={<Users className="w-5 h-5" />}
          color="blue"
        />
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/30">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Employee
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Department
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Leave Type
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Reason
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
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
        {requests.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No leave requests found</p>
          </div>
        )}
      </div>
    </div>
  );
}
