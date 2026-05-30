// core/modules/HR/Components/Special_Components/ComplaintTableRow.tsx
import React from "react";
import { Eye, Edit, CheckCircle, Clock, AlertCircle } from "lucide-react";
import type { Complaint, ComplaintStatus } from "../../types/complaints.types";
import { priorityConfig, complaintStatusConfig, formatDate } from "../../types/complaints.types";

interface ComplaintTableRowProps {
  complaint: Complaint;
  onView: (complaint: Complaint) => void;
  onEdit: (complaint: Complaint) => void;
  onStatusChange: (complaint: Complaint, status: ComplaintStatus) => void;
}

const statusIcons = {
  open: AlertCircle,
  inProgress: Clock,
  resolved: CheckCircle,
  closed: CheckCircle,
};

export const ComplaintTableRow: React.FC<ComplaintTableRowProps> = ({
  complaint,
  onView,
  onEdit,
  onStatusChange,
}) => {
  const priority = priorityConfig[complaint.priority];
  const status = complaintStatusConfig[complaint.status];
  const StatusIcon = statusIcons[complaint.status];

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus: ComplaintStatus = 
      complaint.status === "open" ? "inProgress" :
      complaint.status === "inProgress" ? "resolved" :
      complaint.status === "resolved" ? "closed" : "open";
    onStatusChange(complaint, nextStatus);
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
      <td className="px-5 py-3.5">
        <span className="text-sm font-medium text-gray-800">{complaint.employeeName}</span>
      </td>
      <td className="px-5 py-3.5">
        <div>
          <span className="text-sm text-gray-800">{complaint.subject}</span>
          <div className="text-xs text-gray-400 mt-0.5">{complaint.department}</div>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${priority.className}`}>
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
      <td className="px-5 py-3.5 text-sm text-gray-500">{formatDate(complaint.submittedDate)}</td>
      <td className="px-5 py-3.5">
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onView(complaint)}
            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(complaint)}
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

export default ComplaintTableRow;