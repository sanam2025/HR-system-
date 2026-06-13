// core/modules/HR/pages/AllApplicants.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import type { Applicant, ApplicationStatus } from "../types/recruitment.types";
import apiClient from "../api/client";

interface ApiError {
  message: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

const getErrorMessage = (err: ApiError): string => {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.message) return err.message;
  return "An unknown error occurred";
};

const statusColors: Record<ApplicationStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  reviewed: "bg-blue-100 text-blue-700",
  interview: "bg-purple-100 text-purple-700",
  accepted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

export default function AllApplicants() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      if (!jobId) {
        setError("No job ID provided. Please select a job first.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // ✅ استخدام endpoint صحيح من Postman Collection
        const response = await apiClient.get(
          `/job-postings/${jobId}/candidates`,
        );
        console.log("API Response:", response.data);
        const candidates = response.data?.data || [];
        setApplicants(candidates);
        setError(null);
      } catch (err) {
        console.error("Error fetching applicants:", err);
        const errorMessage = getErrorMessage(err as ApiError);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  const updateStatus = async (applicantId: string, newStatus: string) => {
    try {
      setLoading(true);
      // ✅ استخدام endpoint صحيح
      await apiClient.patch(
        `/candidates/${applicantId}/status?status=${newStatus}`,
      );
      setApplicants((prev) =>
        prev.map((a) =>
          a.id === applicantId
            ? { ...a, status: newStatus as ApplicationStatus }
            : a,
        ),
      );
      alert(`✅ Status updated to ${newStatus}`);
    } catch (err) {
      const errorMessage = getErrorMessage(err as ApiError);
      alert(`❌ Failed to update status: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (applicant: Applicant) => {
    updateStatus(applicant.id, "accepted");
  };

  const handleReject = (applicant: Applicant) => {
    updateStatus(applicant.id, "rejected");
  };

  const stats = {
    total: applicants.length,
    pending: applicants.filter((a) => a.status === "pending").length,
    reviewed: applicants.filter((a) => a.status === "reviewed").length,
    interview: applicants.filter((a) => a.status === "interview").length,
  };

  if (loading && applicants.length === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading applicants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <p className="text-sm text-gray-500 mb-4">
            Make sure you have job postings with candidates.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!jobId) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <p className="text-yellow-600 mb-4">No job selected</p>
          <button
            onClick={() => navigate("/Hr/recruitment")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Go to Recruitment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <div className="mb-8">
        <button
          onClick={() => navigate("/Hr/recruitment")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Recruitment
        </button>
        <h1 className="text-2xl font-bold">All Applicants</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage job applicants for Job ID: {jobId}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase">Reviewed</p>
          <p className="text-2xl font-bold text-blue-600">{stats.reviewed}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase">Interview</p>
          <p className="text-2xl font-bold text-purple-600">
            {stats.interview}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                  Applicant
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                  Position
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                  Experience
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applicants.map((applicant) => (
                <tr
                  key={applicant.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {applicant.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {applicant.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">
                    {applicant.position}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">
                    {applicant.experience} years
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${statusColors[applicant.status]}`}
                    >
                      {applicant.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(applicant)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(applicant)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {applicants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">
              No applicants found for this job posting
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
