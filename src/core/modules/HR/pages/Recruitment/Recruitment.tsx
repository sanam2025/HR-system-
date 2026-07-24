// src/core/modules/HR/pages/Recruitment/Recruitment.tsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useJobRequisitions } from "../../hooks/useJobRequisitions";
import RecruitmentCard from "./RecruitmentCard";
import Loading from "../../../../../shared/components/Loading";
import StateCard from "./StateCard";
import FilterAndSearchCard from "./FilterAndSearchCard";
import { useJobRequisitionsApprove } from "../../hooks/useJobRequisitionsApprove";
import { useJobRequisitionsReject } from "../../hooks/useJobRequisitionsReject";
import toast from "react-hot-toast";
import type { RecruitmentStatus } from "../../../../../api/service/HrService/Types/HRService.types";
import ConfirmModal from "../../Components/Special_Components/ConfirmModal";
import { useTranslation } from "react-i18next";

export type FilterStatus = RecruitmentStatus | "all";

export default function Recruitment() {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useJobRequisitions();
  const approveRequisition = useJobRequisitionsApprove();
  const rejectRequisition = useJobRequisitionsReject();

  const isLoadingApprove = approveRequisition.isPending;
  const isLoadingReject = rejectRequisition.isPending;

  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");

  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: "approve" | "reject";
    id: number | null;
  }>({
    isOpen: false,
    type: "approve",
    id: null,
  });

  const openConfirmModal = (id: number, type: "approve" | "reject") => {
    setModal({ isOpen: true, type, id });
  };

  const closeConfirmModal = () => {
    setModal({ isOpen: false, type: "approve", id: null });
  };

  const handleConfirm = () => {
    if (!modal.id) return;

    if (modal.type === "approve") {
      approveRequisition.mutate(modal.id, {
        onSuccess: () => {
          toast.success(t('jobApproved') || "Job approved successfully");
          refetch();
          closeConfirmModal();
        },
        onError: (e) => {
          toast.error((t('failedToApprove') || "Failed to approve:") + " " + e);
          closeConfirmModal();
        },
      });
    } else {
      rejectRequisition.mutate(modal.id, {
        onSuccess: () => {
          toast.success(t('jobRejected') || "Job rejected successfully");
          refetch();
          closeConfirmModal();
        },
        onError: (e) => {
          toast.error((t('failedToReject') || "Failed to reject:") + " " + e);
          closeConfirmModal();
        },
      });
    }
  };

  const EMPTY_ARRAY = React.useMemo(() => [], []);
  const requests = Array.isArray(data) ? data : EMPTY_ARRAY;

  const filteredRequests = React.useMemo(() => {
    return requests.filter((req) => {
      return statusFilter === "all" || req.status === statusFilter;
    });
  }, [requests, statusFilter]);

  const handleApproveClick = React.useCallback((id: number) => {
    openConfirmModal(id, "approve");
  }, []);

  const handleRejectClick = React.useCallback((id: number) => {
    openConfirmModal(id, "reject");
  }, []);

  useEffect(() => {
    console.log("Requests length:", requests.length);
  }, [requests.length]);

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <Loading />
          <p className="text-gray-500">{t('loadingRequests') || 'Loading requests...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">{t('error') || 'Error'}: {error.message}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            {t('retry') || 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 bg-gray-50">
        <ConfirmModal
          isOpen={modal.isOpen}
          onClose={closeConfirmModal}
          onConfirm={handleConfirm}
          title={
            modal.type === "approve" ? (t('approveRequest') || "Approve Request") : (t('rejectRequest') || "Reject Request")
          }
          message={
            modal.type === "approve"
              ? (t('approveRequestConfirm') || "Are you sure you want to approve this recruitment request?")
              : (t('rejectRequestConfirm') || "Are you sure you want to reject this recruitment request?")
          }
          type={modal.type}
          isLoading={isLoadingApprove || isLoadingReject}
        />

        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('recruitmentRequests') || 'Recruitment Requests'}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {t('manageRecruitmentRequests') || 'Review and manage recruitment requests.'}
              </p>
            </div>
          </div>
        </div>

        <StateCard data={requests} />
        <FilterAndSearchCard
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          refetch={refetch}
        />

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {t('jobTitle') || 'Job Title'}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {t('department') || 'Department'}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {t('exp') || 'Exp'}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {t('requester') || 'Requester'}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {t('skills') || 'Skills'}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {t('status') || 'Status'}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {t('actions') || 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((req) => (
                    <RecruitmentCard
                      key={req.id}
                      req={req}
                      onApprove={handleApproveClick}
                      onReject={handleRejectClick}
                      isLoadingApprove={isLoadingApprove}
                      isLoadingReject={isLoadingReject}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-gray-400"
                    >
                      {t('noRecruitmentRequests') || 'No recruitment requests found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
