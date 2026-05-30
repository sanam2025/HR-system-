// core/modules/HR/Components/Special_Components/ResignationTableRow.tsx
import React from "react";
import { Eye, Edit, CheckCircle, XCircle, Clock } from "lucide-react";
import type { ResignationRequest, ResignationStatus } from "../../types/complaints.types";
import { resignationStatusConfig, formatDate } from "../../types/complaints.types";

interface ResignationTableRowProps {
  resignation: ResignationRequest;  // <- غيرت من request إلى resignation
  onView: (resignation: ResignationRequest) => void;  // <- غيرت
  onEdit: (resignation: ResignationRequest) => void;  // <- غيرت
  onStatusChange: (resignation: ResignationRequest, status: ResignationStatus) => void;  // <- غيرت
}

const statusIcons = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
  withdrawn: XCircle,
};

export const ResignationTableRow: React.FC<ResignationTableRowProps> = ({ 
  resignation,  // <- غيرت من request إلى resignation
  onView, 
  onEdit, 
  onStatusChange 
}) => {
  const status = resignationStatusConfig[resignation.status];
  const StatusIcon = statusIcons[resignation.status];

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus: ResignationStatus = 
      resignation.status === "pending" ? "approved" :
      resignation.status === "approved" ? "rejected" : "pending";
    onStatusChange(resignation, nextStatus);
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
      <td className="px-5 py-3.5">
        <span className="text-sm font-medium text-gray-800">{resignation.employeeName}</span>
      </td>
      <td className="px-5 py-3.5">
        <div>
          <span className="text-sm text-gray-800">{resignation.position}</span>
          <div className="text-xs text-gray-400 mt-0.5">{resignation.department}</div>
        </div>
      </td>
      <td className="px-5 py-3.5 text-sm text-gray-600">{formatDate(resignation.lastWorkingDay)}</td>
      <td className="px-5 py-3.5 text-sm text-gray-500">{resignation.reason}</td>
      <td className="px-5 py-3.5">
        <button
          onClick={handleStatusClick}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${status.className} hover:opacity-80 transition-opacity`}
        >
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </button>
      </td>
      <td className="px-5 py-3.5 text-sm text-gray-500">{formatDate(resignation.submittedDate)}</td>
      <td className="px-5 py-3.5">
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onView(resignation)}
            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(resignation)}
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

export default ResignationTableRow;