// core/modules/HR/Components/Special_Components/LeaveRequestTableRow.tsx
import React from "react";
import { Eye, Edit, CheckCircle, XCircle, Clock } from "lucide-react";
import type { LeaveRequest, LeaveStatus } from "../../types/leaves.types";
import { leaveTypeConfig, statusConfig } from "../../types/leaves.types";

interface LeaveRequestTableRowProps {
  request: LeaveRequest;
  onView: (request: LeaveRequest) => void;
  onEdit: (request: LeaveRequest) => void;
  onStatusChange: (request: LeaveRequest, status: LeaveStatus) => void;
}

const statusIcons = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
};

export const LeaveRequestTableRow: React.FC<LeaveRequestTableRowProps> = ({
  request,
  onView,
  onEdit,
  onStatusChange,
}) => {
  const leaveType = leaveTypeConfig[request.leaveType];
  const status = statusConfig[request.status];
  const StatusIcon = statusIcons[request.status];

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus: LeaveStatus =
      request.status === "pending"
        ? "approved"
        : request.status === "approved"
          ? "rejected"
          : "pending";
    onStatusChange(request, newStatus);
  };

  const dateRange = `${formatDate(request.startDate)} - ${formatDate(request.endDate)}`;

  return (
    <tr className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
      <td className="px-5 py-3.5">
        <span className="text-sm font-medium text-gray-800">
          {request.employeeName}
        </span>
      </td>
      <td className="px-5 py-3.5 text-sm text-gray-600">
        {request.department}
      </td>
      <td className="px-5 py-3.5">
        <span
          className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${leaveType.className}`}
        >
          {leaveType.label}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <div>
          <span className="text-sm text-gray-600">{dateRange}</span>
          <div className="text-xs text-gray-400 mt-0.5">
            {request.duration} days
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5 text-sm text-gray-600">{request.reason}</td>
      <td className="px-5 py-3.5">
        <button
          onClick={handleStatusClick}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${status.className} hover:opacity-80 transition-opacity`}
        >
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </button>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onView(request)}
            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(request)}
            className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Helper function
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
};

export default LeaveRequestTableRow;
