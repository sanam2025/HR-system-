import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, Calendar, User } from "lucide-react";
import { useJobRequisitions } from "../../hooks/useJobRequisitions";
import Loading from "../../../../../shared/components/Loading";
import { useLanguage } from "../../../../../i18n/translations/LanguageContext";
import type { JobRequisition } from "../../../../../api/service/HrService/Types/HRService.types";

export default function JobRequisitionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const reqId = id ? Number(id) : undefined;

  const { data, isLoading, error } = useJobRequisitions();

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
      <div className={`p-6 bg-gray-50 min-h-screen ${isRTL ? 'font-cairo' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">{isRTL ? 'خطأ في تحميل تفاصيل الطلب' : 'Error loading requisition details'}</p>
          <button
            onClick={() => navigate("/Hr/recruitment")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            {isRTL ? 'العودة للتوظيف' : 'Back to Recruitment'}
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string | null | undefined) => {
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

  const getStatusText = (status: string | null | undefined) => {
    if (!status) return isRTL ? "غير معروف" : "Unknown";
    if (isRTL) {
      if (status === "pending") return "قيد الانتظار";
      if (status === "approved") return "مقبول";
      if (status === "rejected") return "مرفوض";
      return status;
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getRequesterName = (
    requester: string | { id: number; full_name: string } | null | undefined,
  ): string => {
    if (!requester) return isRTL ? "غير متوفر" : "N/A";
    if (typeof requester === "string") return requester;
    if (typeof requester === "object" && "full_name" in requester)
      return requester.full_name;
    return isRTL ? "غير متوفر" : "N/A";
  };

  const getDepartmentName = (
    dept: string | { id: number; name: string } | null | undefined,
  ): string => {
    if (!dept) return isRTL ? "غير متوفر" : "N/A";
    if (typeof dept === "string") return dept;
    if (typeof dept === "object" && "name" in dept) return dept.name;
    return isRTL ? "غير متوفر" : "N/A";
  };

  const getCreatedDate = (date: string | null | undefined): string => {
    if (!date) return isRTL ? "غير متوفر" : "N/A";
    try {
      return new Date(String(date)).toLocaleDateString();
    } catch {
      return isRTL ? "غير متوفر" : "N/A";
    }
  };

  const requesterName = getRequesterName(req.requested_by);
  const departmentName = getDepartmentName(req.department);

  return (
    <div className={`p-6 bg-gray-50 min-h-screen ${isRTL ? 'font-cairo' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <button
          onClick={() => navigate("/Hr/recruitment")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} /> {isRTL ? 'العودة للتوظيف' : 'Back to Recruitment'}
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {req.job_title}
            </h1>
            <p className="text-gray-500 mt-1">{isRTL ? 'طلب رقم' : 'Requisition #'} {req.id}</p>
          </div>
          <span
            className={`px-3 py-1 text-sm rounded-full ${getStatusColor(req.status)}`}
          >
            {getStatusText(req.status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <Briefcase className="w-5 h-5" />
            <span className="text-sm font-medium">{isRTL ? 'تفاصيل الوظيفة' : 'Job Details'}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">{isRTL ? 'المسمى الوظيفي' : 'Title'}</span>
              <span className="text-sm font-medium">{req.job_title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">{isRTL ? 'الخبرة' : 'Experience'}</span>
              <span className="text-sm font-medium" dir="ltr">
                {isRTL ? `+${req.experience} سنوات` : `${req.experience}+ years`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">{isRTL ? 'المهارات' : 'Skills'}</span>
              <span className="text-sm font-medium">
                {req.skills_count || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <User className="w-5 h-5" />
            <span className="text-sm font-medium">{isRTL ? 'مقدم الطلب' : 'Requester'}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">{isRTL ? 'الاسم' : 'Name'}</span>
              <span className="text-sm font-medium">{requesterName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">{isRTL ? 'القسم' : 'Department'}</span>
              <span className="text-sm font-medium">{departmentName}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium">{isRTL ? 'الجدول الزمني' : 'Timeline'}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">{isRTL ? 'تاريخ الإنشاء' : 'Created'}</span>
              <span className="text-sm font-medium">
                {getCreatedDate(req.created_at)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">{isRTL ? 'الحالة' : 'Status'}</span>
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(req.status)}`}
              >
                {getStatusText(req.status)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
