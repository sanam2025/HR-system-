// src/core/modules/HR/pages/Recruitment/Recruitment.tsx
import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import { useJobRequisitions } from "../../hooks/useJobRequisitions";
import JobPostingForm from "../../Components/Special_Components/JobPostingForm";
import RecruitmentCard from "./RecruitmentCard";
import Loading from "../../../../../shared/components/Loading";
import StateCard from "./StateCard";
import FilterAndSearchCard from "./FilterAndSearchCard";
import { useJobRequisitionsApprove } from "../../hooks/useJobRequisitionsApprove";
import { useJobRequisitionsReject } from "../../hooks/useJobRequisitionsReject";
import toast from "react-hot-toast";
import type { RecruitmentStatus } from "../../../../../api/service/HrService/Types/HRService.types";

export type FilterStatus = RecruitmentStatus | "all";

interface JobFormData {
  jobTitle: string;
  [key: string]: unknown;
}

export default function Recruitment() {
  const { data, isLoading, error, refetch } = useJobRequisitions();
  const approveRequisition = useJobRequisitionsApprove();
  const rejectRequisition = useJobRequisitionsReject();

  const isLoadingApprove = approveRequisition.isPending;
  const isLoadingReject = rejectRequisition.isPending;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");

  // ✅ تأكد من أن data مصفوفة
  const requests = Array.isArray(data) ? data : [];

  // ✅ Console للتأكد
  useEffect(() => {
    console.log("📊 Raw data:", data);
    console.log("📊 Requests array:", requests);
    console.log("📊 Requests length:", requests.length);
  }, [data, requests]);

  const handlePostJob = (formData: JobFormData) => {
    setIsFormOpen(false);
    alert(`✅ Job "${formData.jobTitle}" has been posted!`);
  };

  const handleApprove = (id: number) => {
    approveRequisition.mutate(id, {
      onSuccess: () => {
        toast.success("Job approved successfully");
        refetch();
      },
      onError: (e) => {
        toast.error("Failed to approve: " + e);
      },
    });
  };

  const handleReject = (id: number) => {
    rejectRequisition.mutate(id, {
      onSuccess: () => {
        toast.success("Job rejected successfully");
        refetch();
      },
      onError: (e) => {
        toast.error("Failed to reject: " + e);
      },
    });
  };

  // ✅ فلترة الطلبات
  const filteredRequests = requests.filter((req) => {
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    return matchesStatus;
  });

  // ✅ Console للفلترة
  useEffect(() => {
    console.log("🔍 Filtered requests:", filteredRequests);
    console.log("🔍 Filtered length:", filteredRequests.length);
  }, [filteredRequests]);

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
        <JobPostingForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handlePostJob}
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
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Megaphone className="w-4 h-4" /> Post Job Opening
            </button>
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
                      onApprove={handleApprove}
                      onReject={handleReject}
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
