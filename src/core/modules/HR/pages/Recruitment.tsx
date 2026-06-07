// core/modules/HR/pages/Recruitment.tsx
import React, { useState } from "react";
import { Megaphone, Search, ThumbsUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JobPostingForm from "../Components/Special_Components/JobPostingForm";
import type { RecruitmentRequest, JobPostingData } from "../types/recruitment.types";

// ============= Data (Static) =============
const recruitmentRequests: RecruitmentRequest[] = [
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
];

// قائمة المهارات للفلترة
const skillsList = [
  "All Skills",
  "React",
  "TypeScript",
  "Node.js",
  "CSS",
  "JavaScript",
  "MongoDB",
  "Tailwind CSS",
];

export default function Recruitment() {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleViewAllApplicants = () => {
    navigate("/Hr/all-applicants");
  };

  const handleRecommend = (jobTitle: string) => {
    alert(`✅ ${jobTitle} position has been recommended for review!`);
  };

  const handlePostJob = (formData: JobPostingData) => {
    console.log("New job posted:", formData);
    setIsFormOpen(false);
    alert(`✅ Job "${formData.jobTitle}" has been posted successfully!`);
  };

  // بدون فلترة (static)
  const filteredRequests = recruitmentRequests;

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Total Requests</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{recruitmentRequests.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Approved</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{recruitmentRequests.filter(r => r.status === "approved").length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{recruitmentRequests.filter(r => r.status === "pending").length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Rejected</p>
          <p className="text-2xl font-bold text-gray-600 mt-1">{recruitmentRequests.filter(r => r.status === "rejected").length}</p>
        </div>
      </div>

      {/* Filters - فلتر المهارة فقط (Static UI) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Filter by skill:</span>
          </div>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm min-w-[180px] bg-white">
            {skillsList.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
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
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-800">{request.jobTitle}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{request.department}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{request.requiredCount}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{request.requester}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${request.status === "approved" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {request.status === "approved" ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 text-sm text-green-600">
                      <ThumbsUp className="w-4 h-4" /> {request.recommendedCount || 0}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => handleRecommend(request.jobTitle)}
                      className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      Recommend
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}