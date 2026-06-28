// src/core/modules/HR/pages/JobRequisitionDetail.tsx
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, Calendar, User } from "lucide-react";
import { useJobRequisitions } from "../../hooks/useJobRequisitions";
import Loading from "../../../../../shared/components/Loading";
import type { JobRequisition } from "../../../../../api/service/HrService/Types/HRService.types";

export default function JobRequisitionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const reqId = id ? Number(id) : undefined;

  const { data, isLoading, error } = useJobRequisitions();

  // ✅ تأكد من أن data مصفوفة وابحث عن الـ requisition المطلوب
  const requisitions = Array.isArray(data) ? data : [];
  const req = requisitions.find((item: JobRequisition) => item.id === reqId);

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error || !req) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">Error loading requisition details</p>
          <button
            onClick={() => navigate("/Hr/recruitment")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back to Recruitment
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string | null | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800";
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRequesterName = (
    requester: string | { id: number; full_name: string } | null | undefined,
  ): string => {
    if (!requester) return "N/A";
    if (typeof requester === "string") return requester;
    if (typeof requester === "object" && "full_name" in requester)
      return requester.full_name;
    return "N/A";
  };

  const getDepartmentName = (
    dept: string | { id: number; name: string } | null | undefined,
  ): string => {
    if (!dept) return "N/A";
    if (typeof dept === "string") return dept;
    if (typeof dept === "object" && "name" in dept) return dept.name;
    return "N/A";
  };

  const getCreatedDate = (date: string | null | undefined): string => {
    if (!date) return "N/A";
    try {
      return new Date(String(date)).toLocaleDateString();
    } catch {
      return "N/A";
    }
  };

  const requesterName = getRequesterName(req.requested_by);
  const departmentName = getDepartmentName(req.department);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <button
          onClick={() => navigate("/Hr/recruitment")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Recruitment
        </button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {req.job_title}
            </h1>
            <p className="text-gray-500 mt-1">Requisition #{req.id}</p>
          </div>
          <span
            className={`px-3 py-1 text-sm rounded-full ${getStatusColor(req.status)}`}
          >
            {req.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <Briefcase className="w-5 h-5" />
            <span className="text-sm font-medium">Job Details</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Title</span>
              <span className="text-sm font-medium">{req.job_title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Experience</span>
              <span className="text-sm font-medium">
                {req.experience}+ years
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Skills</span>
              <span className="text-sm font-medium">
                {req.skills_count || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <User className="w-5 h-5" />
            <span className="text-sm font-medium">Requester</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Name</span>
              <span className="text-sm font-medium">{requesterName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Department</span>
              <span className="text-sm font-medium">{departmentName}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium">Timeline</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Created</span>
              <span className="text-sm font-medium">
                {getCreatedDate(req.created_at)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Status</span>
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(req.status)}`}
              >
                {req.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
