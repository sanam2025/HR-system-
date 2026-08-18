// core/modules/HR/Components/Special_Components/ContractTableRow.tsx
import React from "react";
import { Eye, RefreshCw, FileText } from "lucide-react";
import type { EmployeeContract } from "../../types/contract.types";
import { contractStatusConfig } from "../../types/contract.types";

interface ContractTableRowProps {
  contract: EmployeeContract;
  onView: (contract: EmployeeContract) => void;
  onRenew: (contract: EmployeeContract) => void;
}

export const ContractTableRow: React.FC<ContractTableRowProps> = ({ contract, onView, onRenew }) => {
  const status = contractStatusConfig[contract.status];

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-5 py-3.5">
        <span className="text-sm font-medium text-gray-800">{contract.contractNumber}</span>
      </td>
      <td className="px-5 py-3.5">
        <div>
          <div className="text-sm font-medium text-gray-800">{contract.employeeName}</div>
          <div className="text-xs text-gray-400 mt-0.5">{contract.employeeEmail}</div>
        </div>
      </td>
      <td className="px-5 py-3.5 text-sm text-gray-600">{contract.department}</td>
      <td className="px-5 py-3.5 text-sm text-gray-600">{contract.position}</td>
      <td className="px-5 py-3.5 text-sm text-gray-500">{contract.startDate} → {contract.endDate}</td>
      <td className="px-5 py-3.5 text-sm text-gray-600">{contract.salary.toLocaleString()} SYP</td>
      <td className="px-5 py-3.5">
        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${status.className}`}>
          {status.label}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex gap-2">
          <button onClick={() => onView(contract)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg" title="View Contract">
            <Eye className="w-4 h-4" />
          </button>
          {contract.status === "active" && (
            <button onClick={() => onRenew(contract)} className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <RefreshCw className="w-3 h-3" />
              Renew
            </button>
          )}
          {contract.status === "renewed" && (
            <span className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg">
              <FileText className="w-3 h-3" />
              Renewed
            </span>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ContractTableRow;