// src/core/modules/HR/pages/AllApplicants/ApplicantCard.tsx
import React from "react";
import { Eye, Calendar } from "lucide-react";
import type { Candidate } from "../../../../../api/service/HrService/Types/CandidatesService.types";

// ✅ تعريف نوع المهارة
interface Skill {
  id?: number;
  name?: string;
  skill_name?: string;
  level?: string;
}

interface ApplicantCardProps {
  candidate: Candidate;
  jobId?: number;
  onUpdateStatus: (status: string) => void;
  isUpdating: boolean;
  onViewDetails: () => void;
  onScheduleInterview?: (candidateId: number) => void;
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({
  candidate,
  jobId,
  onUpdateStatus,
  isUpdating,
  onViewDetails,
  onScheduleInterview,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // ✅ استخراج الاسم
  const fullName = candidate.full_name || "N/A";

  // ✅ استخراج تاريخ التقديم
  const appliedDate = candidate.applied_date || null;

  // ✅ استخراج المهارات بدون استخدام any
  const skills =
    candidate.skills
      ?.map((skill: string | Skill) => {
        if (typeof skill === "string") return skill;
        return skill?.name || skill?.skill_name || "";
      })
      .filter(Boolean) || [];

  // ✅ استخراج الخبرة
  const experience = candidate.experience || 0;

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
            {fullName.charAt(0) || "?"}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{fullName}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{candidate.email || "N/A"}</div>
        <div className="text-sm text-gray-500">{candidate.phone || "N/A"}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{experience} years</div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1">
          {skills.slice(0, 3).map((skill: string, index: number) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
            >
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              +{skills.length - 3}
            </span>
          )}
          {skills.length === 0 && (
            <span className="text-xs text-gray-400">No skills</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(candidate.status)}`}
        >
          {candidate.status || "N/A"}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">
          {appliedDate ? new Date(appliedDate).toLocaleDateString() : "N/A"}
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <select
            value={candidate.status}
            onChange={(e) => onUpdateStatus(e.target.value)}
            disabled={isUpdating}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* ✅ زر Schedule Interview */}
          {onScheduleInterview && jobId && (
            <button
              onClick={() => onScheduleInterview(candidate.id)}
              className="p-1 text-purple-500 hover:text-purple-700"
              title="Schedule Interview"
            >
              <Calendar className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onViewDetails}
            className="p-1 text-blue-500 hover:text-blue-700"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ApplicantCard;
