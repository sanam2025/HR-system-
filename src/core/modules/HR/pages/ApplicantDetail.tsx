// src/core/modules/HR/pages/ApplicantDetail.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { CandidatesService } from "../../../../api/service/HrService/CandidatesService";
import ApplicantInfo from "./ApplicantDetail/ApplicantInfo";
import ApplicantSkills from "./ApplicantDetail/ApplicantSkills";
import Loading from "../../../../shared/components/Loading";
import toast from "react-hot-toast";
import type {
  CandidateStatus,
  Candidate,
} from "../../../../api/service/HrService/Types/CandidatesService.types";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// نوع ممتد من Candidate مع الحقول الإضافية (مع جعلها اختيارية)
interface ExtendedCandidate extends Candidate {
  job_posting_id?: number;
  job_id?: number;
}

const statusColors: Record<CandidateStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  reviewed: "bg-blue-100 text-blue-700",
  interview: "bg-purple-100 text-purple-700",
  accepted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

export default function ApplicantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["candidate", id],
    queryFn: () => CandidatesService.getById(Number(id)),
    enabled: !!id && !isNaN(Number(id)),
  });

  const candidate = response?.data?.data as ExtendedCandidate;

  // استخراج jobId من المتقدم (باستخدام ExtendedCandidate)
  const jobId = candidate?.job_posting_id || candidate?.job_id;

  const handleStatusChange = async (status: CandidateStatus) => {
    if (!id) return;
    setIsUpdating(true);
    try {
      await CandidatesService.updateStatus(Number(id), status);
      toast.success(`Status updated to ${status}`);
      refetch();
    } catch (err) {
      const error = err as ApiError;
      toast.error(error?.response?.data?.message || "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownloadCV = async () => {
    if (!id) return;
    try {
      const res = await CandidatesService.getCV(Number(id));
      const url = res.data?.data?.url;
      if (url) window.open(url, "_blank");
    } catch (err) {
      const error = err as ApiError;
      toast.error(error?.response?.data?.message || "Failed to load CV");
    }
  };

  const handleScheduleInterview = () => {
    if (!jobId) {
      toast.error("No job associated with this candidate");
      return;
    }
    navigate(`/Hr/job-postings/${jobId}/interviews/schedule?candidateId=${id}`);
  };

  if (!id || id === "NaN" || isNaN(Number(id))) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <p className="text-yellow-600 mb-4">Invalid Applicant ID</p>
          <button
            onClick={() => navigate("/Hr/all-applicants")}
            className="px-4 py-2 bg-green text-white rounded-lg"
          >
            Back to Applicants
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">Error loading applicant details</p>
          <button
            onClick={() => navigate("/Hr/all-applicants")}
            className="px-4 py-2 bg-green text-white rounded-lg"
          >
            Back to Applicants
          </button>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="text-center py-12">
          <p className="text-gray-500">Applicant not found</p>
          <button
            onClick={() => navigate("/Hr/all-applicants")}
            className="mt-4 text-blue-500"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <button
          onClick={() => navigate("/Hr/all-applicants")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Applicants
        </button>
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {candidate.full_name}
            </h1>
            <p className="text-gray-500 mt-1">{candidate.position || "N/A"}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleDownloadCV}
              className="flex items-center gap-2 px-4 py-2 bg-green text-white rounded-lg hover:bg-green-dark"
            >
              <FileText className="w-4 h-4" /> Download CV
            </button>
            <button
              onClick={handleScheduleInterview}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Calendar className="w-4 h-4" /> Schedule Interview
            </button>
            <select
              value={candidate.status}
              onChange={(e) =>
                handleStatusChange(e.target.value as CandidateStatus)
              }
              disabled={isUpdating}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="interview">Interview</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        <div className="mt-2">
          <span
            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[candidate.status]}`}
          >
            {candidate.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ApplicantInfo candidate={candidate} />
        </div>
        <div className="lg:col-span-2">
          <ApplicantSkills candidate={candidate} />
        </div>
      </div>
    </div>
  );
}
