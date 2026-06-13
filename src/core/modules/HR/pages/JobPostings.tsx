// core/modules/HR/pages/JobPostings.tsx
import React, { useState } from "react";
import { Search, XCircle, Trash2, RefreshCw, Eye, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useJobPostings } from "../hooks/useJobPostings";

export default function JobPostings() {
  const navigate = useNavigate();
  const {
    postings,
    loading,
    error,
    fetchAll,
    close,
    delete: deletePosting,
  } = useJobPostings(true);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPostings = postings.filter((p) =>
    p.job_title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const stats = {
    total: postings.length,
    open: postings.filter((p) => p.status === "open").length,
    closed: postings.filter((p) => p.status === "closed").length,
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={fetchAll}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Job Postings (HR)</h1>
        <p className="text-gray-500 text-sm mt-1">Manage all job postings.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-400">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-400">Open</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.open}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-400">Closed</p>
          <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg text-sm"
            />
          </div>
          <button
            onClick={fetchAll}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg"
          >
            <RefreshCw className="w-4 h-4 inline" /> Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400">
                  Job Title
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400">
                  Description
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400">
                  Experience
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPostings.map((posting) => (
                <tr key={posting.id} className="hover:bg-gray-50 border-b">
                  <td className="px-5 py-3 text-sm font-medium">
                    {posting.job_title}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600 max-w-md truncate">
                    {posting.description || "—"}
                  </td>
                  <td className="px-5 py-3 text-sm">
                    {posting.experience}+ years
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        posting.status === "open"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {posting.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/Hr/job-postings/${posting.id}`)
                        }
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/Hr/job-postings/edit/${posting.id}`)
                        }
                        className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {posting.status === "open" && (
                        <button
                          onClick={() => close(posting.id)}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                        >
                          <XCircle className="w-3 h-3" /> Close
                        </button>
                      )}
                      <button
                        onClick={() => deletePosting(posting.id)}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPostings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No job postings found</p>
            <button onClick={fetchAll} className="mt-2 text-blue-500">
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
