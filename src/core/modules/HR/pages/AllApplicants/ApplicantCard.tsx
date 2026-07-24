// src/core/modules/HR/pages/AllApplicants/ApplicantCard.tsx
import React from 'react';
import { Calendar } from 'lucide-react';
import type { Candidate } from '../../../../../api/service/HrService/Types/CandidatesService.types';

interface ApplicantCardProps {
  candidate: Candidate;
  jobId?: number;
  onScheduleInterview: (candidateId: number) => void;
}

interface Skill {
  id?: number;
  name?: string;
  skill_name?: string;
  level?: string;
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({
  candidate,
  jobId,
  onScheduleInterview,
}) => {
  // تغيير الحالة من rejected إلى applied
  const displayStatus = candidate.status === 'rejected' ? 'applied' : candidate.status;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'applied': return 'bg-gray-100 text-gray-800';
      case 'interviewed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const fullName = candidate.full_name || 'N/A';
  const appliedDate = candidate.applied_date || null;
  
  const skills = candidate.skills?.map((skill: string | Skill) => {
    if (typeof skill === 'string') return skill;
    return skill?.name || '';
  }).filter(Boolean) || [];
  
  const experience = candidate.experience || 0;
  const status = displayStatus as string;

  // إظهار أيقونة التقويم فقط لـ applied
  const showScheduleButton = jobId && status === 'applied';
  
  // تم حذف أيقونة Offer من هنا (نقلت لصفحة JobPostingDetail)

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
            {fullName.charAt(0) || '?'}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{fullName}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{candidate.email || 'N/A'}</div>
        <div className="text-sm text-gray-500">{candidate.phone || 'N/A'}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{experience} years</div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1">
          {skills.slice(0, 3).map((skill: string, index: number) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
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
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(status)}`}>
          {status || 'N/A'}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">
          {appliedDate ? new Date(appliedDate).toLocaleDateString() : 'N/A'}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end">
          {/* أيقونة التقويم (لـ applied فقط) */}
          {showScheduleButton && (
            <button
              onClick={() => onScheduleInterview(candidate.id)}
              className="p-2 text-purple-500 hover:text-purple-700 transition-colors"
              title="Schedule Interview"
            >
              <Calendar className="w-5 h-5" />
            </button>
          )}
          {/* تم حذف أيقونة Offer */}
        </div>
      </td>
    </tr>
  );
};

export default ApplicantCard;