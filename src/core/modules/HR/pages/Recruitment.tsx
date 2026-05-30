// core/modules/HR/pages/Recruitment.tsx
import React, { useState } from "react";
import { Megaphone } from "lucide-react";
import RecruitmentTableRow from "../Components/Special_Components/RecruitmentTableRow";
import JobPostingForm from "../Components/Special_Components/JobPostingForm";
import type { RecruitmentRequest, RecruitmentStatus, JobPostingData } from "../types/recruitment.types";

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
  },
  {
    id: "2",
    jobTitle: "Teaching Assistant",
    department: "Basic Sciences",
    requiredCount: 1,
    requester: "Dr. Samir Haddad",
    priority: "medium",
    status: "pending",
  },
  {
    id: "3",
    jobTitle: "Accountant",
    department: "Administration and Planning",
    requiredCount: 1,
    requester: "Eng. Samer Nahr",
    priority: "low",
    status: "pending",
  },
];

// ============= Main Component =============

export default function Recruitment() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [requests, setRequests] = useState<RecruitmentRequest[]>(recruitmentRequests);

  const handleView = (request: RecruitmentRequest) => {
    console.log("View request:", request);
  };

  const handleEdit = (request: RecruitmentRequest) => {
    console.log("Edit request:", request);
  };

  // ✅ صحيح - حدد النوع بشكل صريح
  const handleStatusChange = (request: RecruitmentRequest, newStatus: RecruitmentStatus) => {
    setRequests(prev =>
      prev.map(r =>
        r.id === request.id ? { ...r, status: newStatus } : r
      )
    );
    console.log(`Request ${request.id} status changed to ${newStatus}`);
  };

  const handlePostJob = (formData: JobPostingData) => {
    const newRequest: RecruitmentRequest = {
      id: String(Date.now()),
      jobTitle: formData.jobTitle,
      department: formData.department,
      requiredCount: formData.requiredCount,
      requester: formData.requester,
      priority: formData.priority,
      status: "pending",
    };
    setRequests(prev => [newRequest, ...prev]);
    setIsFormOpen(false);
    console.log("New job posted:", formData);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recruitment Requests</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Review and manage recruitment requests submitted by department heads.
            </p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm"
          >
            <Megaphone className="w-4 h-4" />
            <span>Post Job Opening</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Total Requests</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{requests.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Approved</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {requests.filter(r => r.status === "approved").length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {requests.filter(r => r.status === "pending").length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Rejected</p>
          <p className="text-2xl font-bold text-gray-600 mt-1">
            {requests.filter(r => r.status === "rejected").length}
          </p>
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
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Priority</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {requests.map((request) => (
                <RecruitmentTableRow
                  key={request.id}
                  request={request}
                  onView={handleView}
                  onEdit={handleEdit}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {requests.length === 0 && (
          <div className="text-center py-12">
            <Megaphone className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No recruitment requests found</p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="mt-2 text-xs text-blue-500 hover:text-blue-600"
            >
              Post a job opening
            </button>
          </div>
        )}
      </div>

      {/* Job Posting Form Modal */}
      <JobPostingForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handlePostJob}
      />
    </div>
  );
}