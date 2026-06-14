// core/modules/HR/Components/Special_Components/PayrollTableRow.tsx
import React from "react";
import { Eye, Edit, DollarSign, FileText, CheckCircle } from "lucide-react";
import type { PayrollRecord, PayrollStatus } from "../../types/payroll.types";
import { statusConfig, formatSalary } from "../../types/payroll.types";
interface PayrollTableRowProps {
  record: PayrollRecord;
  onView: (record: PayrollRecord) => void;
  onEdit: (record: PayrollRecord) => void;
  onStatusChange: (record: PayrollRecord, status: PayrollStatus) => void;
}
const actionButtons: Record<
  PayrollStatus,
  { label: string; icon: React.ReactNode; color: string }
> = {
  paid: {
    label: "Receipt",
    icon: <FileText className="w-3.5 h-3.5" />,
    color: "text-gray-500 hover:bg-gray-50",
  },
  issued: {
    label: "Process Payment",
    icon: <DollarSign className="w-3.5 h-3.5" />,
    color: "text-emerald-600 hover:bg-emerald-50",
  },
  draft: {
    label: "Process Payment",
    icon: <DollarSign className="w-3.5 h-3.5" />,
    color: "text-emerald-600 hover:bg-emerald-50",
  },
  pending: {
    label: "Process Payment",
    icon: <DollarSign className="w-3.5 h-3.5" />,
    color: "text-emerald-600 hover:bg-emerald-50",
  },
};
export const PayrollTableRow: React.FC<PayrollTableRowProps> = ({
  record,
  onView,
  onEdit,
  onStatusChange,
}) => {
  const status = statusConfig[record.status];
  const action = actionButtons[record.status];
  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (record.status === "issued") {
      onStatusChange(record, "paid");
    } else if (record.status === "draft") {
      onStatusChange(record, "issued");
    } else if (record.status === "pending") {
      onStatusChange(record, "issued");
    }
  };
  return (
    <tr className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
      <td className="px-5 py-3.5">
        <span className="text-sm font-medium text-gray-800">
          {record.employeeName}
        </span>
      </td>
      <td className="px-5 py-3.5 text-sm text-gray-600">{record.department}</td>
      <td className="px-5 py-3.5">
        <div>
          <span className="text-sm font-medium text-gray-800">
            {formatSalary(record.baseSalary)}
          </span>
          <div className="text-xs text-gray-400 mt-0.5">Base Salary</div>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <div>
          <span className="text-sm font-semibold text-gray-900">
            {formatSalary(record.netSalary)}
          </span>
          {record.deductions > 0 && (
            <div className="text-xs text-red-500 mt-0.5">
              -{formatSalary(record.deductions)}
            </div>
          )}
          {record.bonuses > 0 && (
            <div className="text-xs text-green-500 mt-0.5">
              +{formatSalary(record.bonuses)}
            </div>
          )}
        </div>
      </td>
      <td className="px-5 py-3.5">
        <span
          className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${status.className}`}
        >
          {status.label}
        </span>
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
          {record.status !== "paid" && (
            <button
              onClick={handleActionClick}
              className={`p-1.5 rounded-lg transition-all ${action.color}`}
              title={action.label}
            >
              {action.icon}
            </button>
          )}
          {record.status === "paid" && (
            <button
              className="p-1.5 text-gray-400 cursor-default rounded-lg"
              title="Already Paid"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};
export default PayrollTableRow;
