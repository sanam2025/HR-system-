// core/modules/HR/pages/Recruitment.tsx
import React, { useState } from "react";
import { Megaphone, Search, ThumbsUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JobPostingForm from "../Components/Special_Components/JobPostingForm";
import type { RecruitmentRequest, JobPostingData } from "../types/recruitment.types";

// ============= Constants (رفع البيانات خارج المكون) =============
const RECRUITMENT_DATA: RecruitmentRequest[] = [
  {
    id: "1",
    jobTitle: "Web Developer",
    department: "Information Technology Engineering",
    requiredCount: 2,
    requester: "Dr. Khaled Al-Sayed",
    priority: "high",
    status: "approved",
    recommendedCount: 1,
  },
  {
    id: "2",
    jobTitle: "Teaching Assistant",
    department: "Basic Sciences",
    requiredCount: 1,
    requester: "Dr. Samir Haddad",
    priority: "medium",
    status: "pending",
    recommendedCount: 0,
  },
  {
    id: "3",
    jobTitle: "Accountant",
    department: "Administration and Planning",
    requiredCount: 1,
    requester: "Eng. Samer Nahr",
    priority: "low",
    status: "pending",
    recommendedCount: 0,
  },
] as const;

// قائمة المهارات للفلترة
const SKILLS_LIST = [
  "All Skills",
  "React",
  "TypeScript",
  "Node.js",
  "CSS",
  "JavaScript",
  "MongoDB",
  "Tailwind CSS",
] as const;

// ============= Helper Functions =============
const getStatusBadge = (status: string) => {
  const isApproved = status === "approved";
  return {
    label: isApproved ? "Approved" : "Pending",
    className: isApproved 
      ? "bg-emerald-100 text-emerald-700" 
      : "bg-amber-100 text-amber-700"
  };
};

const getStats = (requests: RecruitmentRequest[]) => ({
  total: requests.length,
  approved: requests.filter(r => r.status === "approved").length,
  pending: requests.filter(r => r.status === "pending").length,
  rejected: requests.filter(r => r.status === "rejected").length,
});

// ============= Stats Cards Component =============
const StatsCards: React.FC<{ stats: ReturnType<typeof getStats> }> = ({ stats }) => {
  const STATS_CONFIG = [
    { label: "Total Requests", value: stats.total, color: "text-gray-800" },
    { label: "Approved", value: stats.approved, color: "text-emerald-600" },
    { label: "Pending", value: stats.pending, color: "text-amber-600" },
    { label: "Rejected", value: stats.rejected, color: "text-gray-600" },
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {STATS_CONFIG.map(({ label, value, color }) => (
        <div key={label} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
          <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
        </div>
      ))}
    </div>
  );
};

// ============= Table Row Component =============
const RecruitmentTableRow: React.FC<{ 
  request: RecruitmentRequest; 
  onRecommend: (jobTitle: string) => void;
}> = ({ request, onRecommend }) => {
  const statusBadge = getStatusBadge(request.status);

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-5 py-3.5 text-sm font-medium text-gray-800">{request.jobTitle}</td>
      <td className="px-5 py-3.5 text-sm text-gray-600">{request.department}</td>
      <td className="px-5 py-3.5 text-sm text-gray-600">{request.requiredCount}</td>
      <td className="px-5 py-3.5 text-sm text-gray-600">{request.requester}</td>
      <td className="px-5 py-3.5">
        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${statusBadge.className}`}>
          {statusBadge.label}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <span className="inline-flex items-center gap-1 text-sm text-green-600">
          <ThumbsUp className="w-4 h-4" /> {request.recommendedCount || 0}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <button
          onClick={() => onRecommend(request.jobTitle)}
          className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
        >
          Recommend
        </button>
      </td>
    </tr>
  );
};

// ============= Main Component =============
export default function Recruitment() {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const stats = getStats(RECRUITMENT_DATA as RecruitmentRequest[]);

  const handleViewAllApplicants = () => navigate("/Hr/all-applicants");
  
  const handleRecommend = (jobTitle: string) => {
    alert(`✅ ${jobTitle} position has been recommended for review!`);
  };

  const handlePostJob = (formData: JobPostingData) => {
    console.log("New job posted:", formData);
    setIsFormOpen(false);
    alert(`✅ Job "${formData.jobTitle}" has been posted successfully!`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      {/* Job Posting Form Modal */}
      <JobPostingForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handlePostJob}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recruitment Requests</h1>
            <p className="text-gray-500 mt-1 text-sm">Review and manage recruitment requests.</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            <Megaphone className="w-4 h-4" /> Post Job Opening
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <StatsCards stats={stats} />

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Filter by skill:</span>
          </div>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm min-w-[180px] bg-white">
            {SKILLS_LIST.map((skill) => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
          <button
            onClick={handleViewAllApplicants}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors ml-auto"
          >
            <Users className="w-4 h-4" /> All Applicants
          </button>
        </div>
      </div>

      {/* Recruitment Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/30">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Job Title</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Department</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Required Count</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Requester</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Recommended</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(RECRUITMENT_DATA as RecruitmentRequest[]).map((request) => (
                <RecruitmentTableRow
                  key={request.id}
                  request={request}
                  onRecommend={handleRecommend}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}