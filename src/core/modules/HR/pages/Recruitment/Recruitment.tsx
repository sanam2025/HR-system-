// src/core/modules/HR/pages/Recruitment/Recruitment.tsx
import { useEffect, useState } from "react";
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

export type FilterStatus = RecruitmentStatus | "all";

export default function Recruitment() {
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

  const requests = Array.isArray(data) ? data : [];

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
          toast.success(" Job approved successfully");
          refetch();
          closeConfirmModal();
        },
        onError: (e) => {
          toast.error(" Failed to approve: " + e);
          closeConfirmModal();
        },
      });
    } else {
      rejectRequisition.mutate(modal.id, {
        onSuccess: () => {
          toast.success(" Job rejected successfully");
          refetch();
          closeConfirmModal();
        },
        onError: (e) => {
          toast.error(" Failed to reject: " + e);
          closeConfirmModal();
        },
      });
    }
  };

  const filteredRequests = requests.filter((req) => {
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    return matchesStatus;
  });

  useEffect(() => {
    console.log(" Raw data:", data);
    console.log(" Requests array:", requests);
    console.log(" Requests length:", requests.length);
  }, [data, requests]);

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <Loading />
          <p className="text-gray-500">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">Error: {error.message}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 bg-gray-50" dir="ltr">
        <ConfirmModal
          isOpen={modal.isOpen}
          onClose={closeConfirmModal}
          onConfirm={handleConfirm}
          title={
            modal.type === "approve" ? "Approve Request" : "Reject Request"
          }
          message={
            modal.type === "approve"
              ? "Are you sure you want to approve this recruitment request?"
              : "Are you sure you want to reject this recruitment request?"
          }
          type={modal.type}
          isLoading={isLoadingApprove || isLoadingReject}
        />

        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Recruitment Requests
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Review and manage recruitment requests.
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
                    Job Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Exp
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Requester
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Skills
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((req) => (
                    <RecruitmentCard
                      key={req.id}
                      req={req}
                      onApprove={() => openConfirmModal(req.id, "approve")}
                      onReject={() => openConfirmModal(req.id, "reject")}
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
                      No recruitment requests found
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
