// src/core/modules/HR/pages/Recruitment/RecruitmentCard.tsx
import type { JobRequisition } from "../../../../../api/service/HrService/Types/HRService.types";
import { Trash2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ApproveForm from "./ApproveForm";
import { useState } from "react";
import RejectForm from "./RejectForm";
import toast from "react-hot-toast";

type RecruitmentCardProps = {
  req: JobRequisition;
  isLoadingApprove: boolean;
  isLoadingReject: boolean;

  onApprove: (id: number) => void;
  onReject: (id: number) => void;
};

function RecruitmentCard({
  req,
  isLoadingApprove,
  isLoadingReject,

  onApprove,
  onReject,
}: RecruitmentCardProps) {
  const navigate = useNavigate();
  const [isApproveForm, setIsApproveForm] = useState(false);
  const [isRejectFrom, setIsRejectForm] = useState(false);

  const handleDeleteRequest = () => {
    console.log("Delete request:", req.id);
  };

  // ✅ التحقق من وجود id قبل التنقل
  const handleViewApplicants = () => {
    if (req.id) {
      navigate(`/Hr/recruitment/applicants/${req.id}`);
    } else {
      toast.error("Invalid job ID");
    }
  };

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3">
          <span className="text-sm font-medium text-gray-800 break-words max-w-xs">
            {req.job_title}
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-gray-600">
          {req.department?.name || "-"}
        </td>
        <td className="px-4 py-3 text-sm text-gray-600">{req.experience}+y</td>
        <td className="px-4 py-3 text-sm text-gray-600">
          {req.requested_by?.full_name || "-"}
        </td>
        <td className="px-4 py-3 text-sm text-gray-600">
          {req.skills_count} skills
        </td>
        <td className="px-4 py-3">
          <span
            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
              req.status === "approved"
                ? "bg-emerald-100 text-emerald-700"
                : req.status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
            }`}
          >
            {req.status === null ? "pending" : req.status}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsApproveForm(true)}
              disabled={req.status === "approved" || req.status === "rejected"}
              className="px-3 py-2 text-xs font-medium bg-emerald-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-700"
            >
              App
            </button>
            <button
              onClick={() => setIsRejectForm(true)}
              disabled={req.status === "approved" || req.status === "rejected"}
              className="px-3 py-2 text-xs font-medium bg-red-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700"
            >
              Rej
            </button>
            {/* ✅ زر المتقدمين مع تحقق */}
            <button
              onClick={handleViewApplicants}
              className="p-1 text-blue-500 hover:bg-blue-50 rounded"
              title="Applicants"
            >
              <Users className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDeleteRequest}
              disabled={isLoadingReject || isLoadingApprove}
              className="p-1 text-red-500 hover:bg-red-50 rounded"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </td>
      </tr>

      {isApproveForm && (
        <ApproveForm
          isLoading={isLoadingApprove}
          onClose={() => setIsApproveForm(false)}
          onConfirm={() => onApprove(req.id)}
        />
      )}
      {isRejectFrom && (
        <RejectForm
          isLoading={isLoadingReject}
          onClose={() => setIsRejectForm(false)}
          onConfirm={() => onReject(req.id)}
        />
      )}
    </>
  );
}

export default RecruitmentCard;
