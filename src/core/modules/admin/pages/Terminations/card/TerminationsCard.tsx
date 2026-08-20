import { Briefcase, Calendar, AlertCircle, CheckCircle, XCircle, Eye, ChevronUp, ChevronDown, Loader2, Clock } from "lucide-react";
import React, { useState } from "react";
import { StatusBadge } from "./StatusBadge";
import type { Termination } from "../../../types/types";
import { useApprove, useReject } from "../../../hooks/Terminations/useTerminationMutation";
import toast from "react-hot-toast";

export const TerminationCard = ({ termination }: { termination: Termination }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const typeLabels = {
    immediate: "Immediate Termination",
    mutual: "Mutual Agreement",
    contract_end: "Contract End"
  };

  const typeColors = {
    immediate: "bg-rose-50 text-rose-700 border-rose-200",
    mutual: "bg-blue-50 text-blue-700 border-blue-200",
    contract_end: "bg-purple-50 text-purple-700 border-purple-200"
  };

  const typeColor = typeColors[termination.type as keyof typeof typeColors] || typeColors.contract_end;

  const { mutateAsync: approve, isPending: isLoadingApprove } = useApprove();
  const { mutateAsync: reject, isPending: isLoadingReject } = useReject();

  const handleApprove = async () => {
    try {
      const response = await approve(termination.id);
      toast.success(response?.message || `Termination for ${termination.user?.name} approved successfully`);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to approve termination';
      toast.error(errorMessage);
    }
  };

  const handleReject = async () => {
    try {
      const response = await reject(termination.id);
      toast.success(response?.message || `Termination for ${termination.user?.name} rejected successfully`);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to reject termination';
      toast.error(errorMessage);
    }
  };

  const displayStatus = (() => {
    if (termination.approvals && Array.isArray(termination.approvals)) {
      const roleApproval = termination.approvals.find((a: any) => a.role?.toLowerCase() === 'admin');
      if (roleApproval) return roleApproval.status;
    }
    return termination.status;
  })();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
      <div className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          {/* Left Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">
                  {termination.user?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                </span>
              </div>
              
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-base">
                    {termination.user?.name || 'Unknown User'}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeColor}`}>
                    {typeLabels[termination.type as keyof typeof typeLabels] || termination.type}
                  </span>
                  <StatusBadge status={displayStatus} />
                </div>
                
                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    Contract #{termination.contract_id}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {termination.termination_date ? new Date(termination.termination_date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    }) : 'N/A'}
                  </span>
                  <span className="text-sm text-gray-500">
                    Created by: <span className="font-medium text-gray-700">{termination.created_by?.name || 'N/A'}</span>
                  </span>
                </div>

                {termination.immediate_termination && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-medium">Immediate:</span>
                    <span>{termination.immediate_termination.subtype}</span>
                    {termination.immediate_termination.legal_reason && (
                      <span className="text-rose-500">- {termination.immediate_termination.legal_reason}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 self-start lg:self-center">
            {displayStatus === "pending" && (
              <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-100">
                <button
                  onClick={handleApprove}
                  disabled={isLoadingApprove}
                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Approve"
                >
                  {isLoadingApprove ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={handleReject}
                  disabled={isLoadingReject}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Reject"
                >
                  {isLoadingReject ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                </button>
              </div>
            )}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {termination.approvals && termination.approvals.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Approval Progress:</span>
              <div className="flex items-center gap-2">
                {termination.approvals.map((approval: any, idx: number) => (
                  <React.Fragment key={approval.id}>
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                        approval.status === 'approved' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : approval.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {approval.role}
                        {approval.status === 'approved' && (
                          <span className="ml-1 text-emerald-500">✓</span>
                        )}
                        {approval.status === 'rejected' && (
                          <span className="ml-1 text-rose-500">✗</span>
                        )}
                      </div>
                      {idx < termination.approvals.length - 1 && (
                        <span className="text-gray-300">→</span>
                      )}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Contract ID</p>
                <p className="text-sm font-medium text-gray-700 mt-1">#{termination.contract_id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Last Working Day</p>
                <p className="text-sm font-medium text-gray-700 mt-1">
                  {termination.last_working_day ? new Date(termination.last_working_day).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  }) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Notice Period</p>
                <p className="text-sm font-medium text-gray-700 mt-1">{termination.notice_period_days || 0} days</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Ready for Admin</p>
                <p className="text-sm font-medium text-gray-700 mt-1">
                  {termination.ready_for_admin ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Yes
                    </span>
                  ) : (
                    <span className="text-amber-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Pending
                    </span>
                  )}
                </p>
              </div>
            </div>

            {termination.approvals && termination.approvals.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Approval Details</p>
                <div className="space-y-2">
                  {termination.approvals.map((approval: any) => (
                    <div key={approval.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">
                          Step {approval.step}
                        </span>
                        <span className="text-sm text-gray-500">{approval.role}</span>
                        {approval.decision_reason && (
                          <span className="text-sm text-gray-400">- {approval.decision_reason}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={approval.status} />
                        {approval.approved_at && (
                          <span className="text-xs text-gray-400">
                            {new Date(approval.approved_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};