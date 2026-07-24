// core/modules/HR/Components/Special_Components/ResignationRequestRow.tsx
import React, { useState } from "react";
import { Eye, CheckCircle, XCircle, Clock, DollarSign } from "lucide-react";
import type {
  ResignationRequest,
  
} from "../../types/resignation.types";
import {
  resignationTypeConfig,
  resignationStatusConfig,
  calculateResignationCompensation,
} from "../../types/resignation.types";

interface ResignationRequestRowProps {
  request: ResignationRequest;
  onView: (request: ResignationRequest) => void;
  onApprove: (request: ResignationRequest, compensation: number) => void;
  onReject: (request: ResignationRequest) => void;
}

const statusIcons = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
  withdrawn: XCircle,
};

export const ResignationRequestRow: React.FC<ResignationRequestRowProps> = ({
  request,
  onView,
  onApprove,
  onReject,
}) => {
  const type = resignationTypeConfig[request.resignationType];
  const status = resignationStatusConfig[request.status];
  const StatusIcon = statusIcons[request.status];
  const [showCompensation, setShowCompensation] = useState(false);
  const compensation = calculateResignationCompensation(
    request.baseSalary,
    request.yearsOfService,
    request.resignationType,
  );

  const handleApproveWithCompensation = () => {
    setShowCompensation(true);
  };

  const confirmApproval = () => {
    onApprove(request, compensation.totalCompensation);
    setShowCompensation(false);
  };

  return (
    <>
      <tr className="hover:bg-gray-50/50 transition-colors">
        <td className="px-5 py-3.5">
          <div>
            <div className="text-sm font-medium text-gray-800">
              {request.employeeName}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              ID: {request.employeeId}
            </div>
          </div>
        </td>
        <td className="px-5 py-3.5 text-sm text-gray-600">
          {request.department}
        </td>
        <td className="px-5 py-3.5 text-sm text-gray-600">
          {request.position}
        </td>
        <td className="px-5 py-3.5">
          <span
            className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${type.className}`}
          >
            {type.label}
          </span>
        </td>
        <td className="px-5 py-3.5 text-sm text-gray-500">
          {request.lastWorkingDay}
        </td>
        <td className="px-5 py-3.5">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${status.className}`}
          >
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </span>
        </td>
        <td className="px-5 py-3.5">
          <div className="flex gap-2">
            <button
              onClick={() => onView(request)}
              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            {request.status === "pending" && (
              <>
                <button
                  onClick={handleApproveWithCompensation}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  <CheckCircle className="w-3 h-3" />
                  Approve
                </button>
                <button
                  onClick={() => onReject(request)}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <XCircle className="w-3 h-3" />
                  Reject
                </button>
              </>
            )}
            {request.status === "approved" && (
              <span className="flex items-center gap-1 px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-lg">
                <DollarSign className="w-3 h-3" />
                {request.compensationAmount?.toLocaleString()} SYP
              </span>
            )}
          </div>
        </td>
      </tr>

      {/* Compensation Modal */}
      {showCompensation && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Compensation Details
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Employee:</span>{" "}
                  {request.employeeName}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Resignation Type:</span>{" "}
                  {type.label}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Years of Service:</span>{" "}
                  {request.yearsOfService}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Base Salary:</span>{" "}
                  {request.baseSalary.toLocaleString()} SYP
                </p>
                <div className="border-t border-gray-200 my-3 pt-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">End of Service Benefit:</span>{" "}
                    <span className="text-green-600 font-semibold">
                      {compensation.endOfServiceBenefit.toLocaleString()} SYP
                    </span>
                  </p>
                  {compensation.immediateResignationPenalty > 0 && (
                    <p className="text-sm text-red-600">
                      <span className="font-medium">
                        Immediate Resignation Penalty (20%):
                      </span>{" "}
                      -
                      {compensation.immediateResignationPenalty.toLocaleString()}{" "}
                      SYP
                    </p>
                  )}
                  <p className="text-lg font-bold text-green-600 mt-3">
                    Total Compensation:{" "}
                    {compensation.totalCompensation.toLocaleString()} SYP
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCompensation(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmApproval}
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Confirm Approval
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResignationRequestRow;
