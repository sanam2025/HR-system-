// core/modules/HR/Components/Special_Components/AttendanceTableRow.tsx
import React from "react";
import { Eye, Edit } from "lucide-react";
import type { AttendanceRecord } from "../../types/attendance.types";
import { statusConfig } from "../../types/attendance.types";

interface AttendanceTableRowProps {
  record: AttendanceRecord;
  onView: (record: AttendanceRecord) => void;
  onEdit: (record: AttendanceRecord) => void;
}

export const AttendanceTableRow: React.FC<AttendanceTableRowProps> = ({
  record,
  onView,
  onEdit,
}) => {
  const status = statusConfig[record.status];

  // Format note text
  const getNoteText = () => {
    if (record.notes) return record.notes;
    if (record.lateMinutes) return `${record.lateMinutes} min late`;
    if (record.earlyLeaveMinutes) return `${record.earlyLeaveMinutes} min early leave`;
    return "-";
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
      <td className="px-5 py-3.5">
        <span className="text-sm font-medium text-gray-800">{record.employeeName}</span>
      </td>
      <td className="px-5 py-3.5 text-sm text-gray-600">{record.department}</td>
      <td className="px-5 py-3.5">
        <span className="text-sm text-gray-600">{record.checkInTime || "-"}</span>
      </td>
      <td className="px-5 py-3.5">
        <span className="text-sm text-gray-600">{record.checkOutTime || "-"}</span>
      </td>
      <td className="px-5 py-3.5">
        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${status.className}`}>
          {status.label}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <span className="text-sm text-gray-500">{getNoteText()}</span>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onView(record)}
            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(record)}
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

export default AttendanceTableRow;