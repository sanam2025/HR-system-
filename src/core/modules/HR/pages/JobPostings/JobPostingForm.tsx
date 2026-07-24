// src/core/modules/HR/pages/JobPostingForm.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { JobPostingsService } from "../../../../../api/service/HrService/JobPostingsService";
import Loading from "../../../../../shared/components/Loading";

// تعريف نوع الخطأ
interface ApiError {
  message: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

const getErrorMessage = (err: unknown): string => {
  const apiError = err as ApiError;
  if (apiError.response?.data?.message) {
    return apiError.response.data.message;
  }
  if (apiError.message) {
    return apiError.message;
  }
  return "An error occurred";
};

export default function JobPostingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    job_title: "",
    description: "",
    experience: 0,
    skills: [] as number[],
  });

  // جلب البيانات إذا كان في وضع التعديل
  const { data: response, isLoading } = useQuery({
    queryKey: ["job-posting", id],
    queryFn: () => JobPostingsService.getById(Number(id)),
    enabled: isEditMode && !!id,
  });

  const posting = response?.data?.data;

  useEffect(() => {
    if (isEditMode && posting) {
      setFormData({
        job_title: posting.job_title,
        description: posting.description || "",
        experience: posting.experience,
        skills: posting.skills || [],
      });
    }
  }, [isEditMode, posting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditMode && id) {
        await JobPostingsService.update(Number(id), formData);
        toast.success("Job posting updated successfully!");
      }
      navigate("/Hr/job-postings");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && isEditMode) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <button
          onClick={() => navigate("/Hr/job-postings")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Job Postings
        </button>
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Edit Job Posting" : "Create Job Posting"}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm p-6 max-w-2xl space-y-5"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Job Title *</label>
          <input
            type="text"
            value={formData.job_title}
            onChange={(e) =>
              setFormData({ ...formData, job_title: e.target.value })
            }
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Experience (years) *
          </label>
          <input
            type="number"
            value={formData.experience}
            onChange={(e) =>
              setFormData({ ...formData, experience: Number(e.target.value) })
            }
            required
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/Hr/job-postings")}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />{" "}
            {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
