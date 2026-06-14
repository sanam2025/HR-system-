// core/modules/HR/Components/Special_Components/TerminationRequestRow.tsx
import React from "react";
import { Eye, FileText, CheckCircle } from "lucide-react";
import type { TerminationRequest } from "../../types/termination.types";
import { terminationTypeConfig, terminationStatusConfig } from "../../types/termination.types";

interface TerminationRequestRowProps {
  request: TerminationRequest;
  onView: (request: TerminationRequest) => void;
  onProcess: (request: TerminationRequest) => void;
}

export const TerminationRequestRow: React.FC<TerminationRequestRowProps> = ({
  request,
  onView,
  onProcess,
}) => {
  const type = terminationTypeConfig[request.terminationType];
  const status = terminationStatusConfig[request.status];

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-5 py-3.5">
        <div>
          <div className="text-sm font-medium text-gray-800">{request.employeeName}</div>
          <div className="text-xs text-gray-400 mt-0.5">ID: {request.employeeId}</div>
        </div>
      </td>
      <td className="px-5 py-3.5 text-sm text-gray-600">{request.department}</td>
      <td className="px-5 py-3.5">
        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${type.className}`}>
          {type.label}
        </span>
      </td>
      <td className="px-5 py-3.5 text-sm text-gray-500">{request.effectiveDate}</td>
      <td className="px-5 py-3.5">
        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${status.className}`}>
          {status.label}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex gap-2">
          <button onClick={() => onView(request)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg" title="View Details">
            <Eye className="w-4 h-4" />
          </button>
          {request.status === "submitted" && (
            <button onClick={() => onProcess(request)} className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700">
              <CheckCircle className="w-3 h-3" />
              Process
            </button>
          )}
          {request.status === "processed" && (
            <button className="flex items-center gap-1 px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-lg">
              <FileText className="w-3 h-3" />
              Docs Ready
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default TerminationRequestRow;