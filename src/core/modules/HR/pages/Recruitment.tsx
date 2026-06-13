// core/modules/HR/pages/Recruitment.tsx
import React, { useState } from "react";
import { Megaphone, Search, Users, Trash2, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useJobRequisitions } from "../hooks/useJobRequisitions";
import JobPostingForm from "../Components/Special_Components/JobPostingForm";
import type { JobPostingData } from "../types/recruitment.types";

export default function Recruitment() {
  const navigate = useNavigate();
  const { requests, loading, error, fetchAll, delete: deleteRequest, approve, reject } = useJobRequisitions(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handlePostJob = (formData: JobPostingData) => {
    console.log("New job posted:", formData);
    setIsFormOpen(false);
    alert(`✅ Job "${formData.jobTitle}" has been posted!`);
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch = searchTerm === "" || req.job_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: requests.length,
    approved: requests.filter((r) => r.status === "approved").length,
    pending: requests.filter((r) => r.status === "pending" || r.status === null).length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button onClick={fetchAll} className="px-4 py-2 bg-red-600 text-white rounded-lg">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <JobPostingForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handlePostJob} />

      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recruitment Requests</h1>
            <p className="text-gray-500 text-sm mt-1">Review and manage recruitment requests.</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Megaphone className="w-4 h-4" /> Post Job Opening
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Total</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Approved</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Rejected</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.rejected}</p>
        </div>
      </div>

      {/* ✅ Filters - موجود */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white min-w-[130px] focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            onClick={() => navigate("/Hr/all-applicants")}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            <Users className="w-4 h-4" /> All Applicants
          </button>
          <button onClick={fetchAll} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Exp</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Requester</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Skills</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-800 break-words max-w-xs">{req.job_title}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{req.department?.name || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{req.experience}+y</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{req.requested_by?.full_name || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{req.skills_count} skills</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      req.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                      req.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {req.status === null ? "pending" : req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => approve(req.id)} className="px-2 py-1 text-xs font-medium bg-emerald-600 text-white rounded hover:bg-emerald-700">
                        App
                      </button>
                      <button onClick={() => reject(req.id)} className="px-2 py-1 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700">
                        Rej
                      </button>
                      <button onClick={() => navigate(`/Hr/recruitment/applicants/${req.id}`)} className="p-1 text-blue-500 hover:bg-blue-50 rounded" title="Applicants">
                        <Users className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteRequest(req.id)} className="p-1 text-red-500 hover:bg-red-50 rounded" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No requests found</p>
            <button onClick={fetchAll} className="mt-2 text-blue-500">Refresh</button>
          </div>
        )}
      </div>
    </div>
  );
}