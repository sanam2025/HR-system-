// core/modules/HR/Components/Special_Components/RecruitmentTableRow.tsx
import React from "react";
import { Eye, Edit, CheckCircle, XCircle, Clock } from "lucide-react";
import type {
  RecruitmentRequest,
  RecruitmentStatus,
} from "../../types/recruitment.types";

interface RecruitmentTableRowProps {
  request: RecruitmentRequest;
  onView: (request: RecruitmentRequest) => void;
  onEdit: (request: RecruitmentRequest) => void;
  onStatusChange: (
    request: RecruitmentRequest,
    status: RecruitmentStatus,
  ) => void;
}

const statusConfig: Record<
  RecruitmentStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  approved: {
    label: "Approved",
    className: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle,
  },
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700",
    icon: Clock,
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-700",
    icon: XCircle,
  },
};

const priorityConfig = {
  high: { label: "High", className: "bg-red-100 text-red-700" },
  medium: { label: "Medium", className: "bg-yellow-100 text-yellow-700" },
  low: { label: "Low", className: "bg-green-100 text-green-700" },
};

export const RecruitmentTableRow: React.FC<RecruitmentTableRowProps> = ({
  request,
  onView,
  onEdit,
  onStatusChange,
}) => {
  const priority = priorityConfig[request.priority];
  const status = statusConfig[request.status];
  const StatusIcon = status.icon;

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus: RecruitmentStatus =
      request.status === "approved" ? "pending" : "approved";
    onStatusChange(request, newStatus);
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
      <td className="px-5 py-3.5">
        <span className="text-sm font-medium text-gray-800">
          {request.jobTitle}
        </span>
      </td>
      <td className="px-5 py-3.5 text-sm text-gray-600">
        {request.department}
      </td>
      <td className="px-5 py-3.5">
        <span className="text-sm font-medium text-gray-800">
          {request.requiredCount}
        </span>
      </td>
      <td className="px-5 py-3.5 text-sm text-gray-600">{request.requester}</td>
      <td className="px-5 py-3.5">
        <span
          className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${priority.className}`}
        >
          {priority.label}
        </span>
      </td>
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

export default RecruitmentTableRow;
