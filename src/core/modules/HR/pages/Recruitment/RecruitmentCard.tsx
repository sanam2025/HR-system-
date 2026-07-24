// src/core/modules/HR/pages/Recruitment/RecruitmentCard.tsx
import { CheckCircle, XCircle, Eye, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useJobPostings } from "../../hooks/useJobPostings";
import type { JobRequisition } from "../../../../../api/service/HrService/Types/HRService.types";
import type { JobPosting } from "../../../../../api/service/HrService/Types/JobPostingsService.types";

interface RecruitmentCardProps {
  req: JobRequisition;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  isLoadingApprove: boolean;
  isLoadingReject: boolean;
}

import React from "react";

export function RecruitmentCard({
  req,
  onApprove,
  onReject,
  isLoadingApprove,
  isLoadingReject,
}: RecruitmentCardProps) {
  const navigate = useNavigate();
  
  // جلب جميع الوظائف المنشورة
  const { postings } = useJobPostings();

  // البحث عن الوظيفة المنشورة التي تطابق job_title
  const getJobPostingId = (): number | undefined => {
    if (!postings || postings.length === 0) return undefined;
    const match = postings.find((p: JobPosting) => p.job_title === req.job_title);
    return match?.id;
  };

  const jobPostingId = getJobPostingId();
  const finalJobId = jobPostingId || req.id;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDepartmentName = (dept: string | { id: number; name: string } | null | undefined): string => {
    if (!dept) return 'N/A';
    if (typeof dept === 'string') return dept;
    if (typeof dept === 'object' && 'name' in dept) return dept.name;
    return 'N/A';
  };

  const getRequesterName = (requester: string | { id: number; full_name: string } | null | undefined): string => {
    if (!requester) return 'N/A';
    if (typeof requester === 'string') return requester;
    if (typeof requester === 'object' && 'full_name' in requester) return requester.full_name;
    return 'N/A';
  };

  const departmentName = getDepartmentName(req.department);
  const requesterName = getRequesterName(req.requested_by);

  const goToDetails = () => {
    if (req?.id) navigate(`/Hr/recruitment/${req.id}`);
  };

  const goToApplicants = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (req?.id) {
      console.log(`🔍 req.id: ${req.id} → job_title: "${req.job_title}" → jobPostingId: ${jobPostingId} → final: ${finalJobId}`);
      navigate(`/Hr/all-applicants?jobId=${finalJobId}`);
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={goToDetails}>
      <td className="px-4 py-3"><span className="font-medium text-gray-900">{req.job_title || 'N/A'}</span></td>
      <td className="px-4 py-3 text-gray-600">{departmentName}</td>
      <td className="px-4 py-3 text-gray-600">{req.experience || 0}+ years</td>
      <td className="px-4 py-3 text-gray-600">{requesterName}</td>
      <td className="px-4 py-3 text-gray-600">{req.skills_count || 0}</td>
      <td className="px-4 py-3">
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(req.status || '')}`}>
          {req.status || 'N/A'}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {req.status === "pending" && (
            <>
              <button onClick={(e) => { e.stopPropagation(); onApprove(req.id); }} disabled={isLoadingApprove} className="p-1 text-green-500 hover:text-green-700 disabled:opacity-50" title="Approve">
                <CheckCircle className="w-4 h-4" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onReject(req.id); }} disabled={isLoadingReject} className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50" title="Reject">
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}
          <button onClick={goToApplicants} className="p-1 text-purple-500 hover:text-purple-700" title="View Applicants">
            <Users className="w-4 h-4" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); goToDetails(); }} className="p-1 text-blue-500 hover:text-blue-700" title="View Details">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default React.memo(RecruitmentCard);