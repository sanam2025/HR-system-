// core/modules/HR/pages/JobRequisitionForm.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, RefreshCw } from "lucide-react";
import { useJobRequisitions } from "../hooks/useJobRequisitions";

// تعريف نوع الخطأ
interface ApiError {
  message: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

const getErrorMessage = (err: ApiError): string => {
  if (err.response?.data?.message) {
    return err.response.data.message;
  }
  if (err.message) {
    return err.message;
  }
  return "An unknown error occurred";
};

export default function JobRequisitionForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { create, update, getById, getPrefill } = useJobRequisitions(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    job_title: "",
    description: "",
    experience: 0,
    skills: [] as number[],
  });

  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode && id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      const data = await getById(Number(id));
      setFormData({
        job_title: data.job_title,
        description: data.description || "",
        experience: data.experience,
        skills: [],
      });
    } catch (err) {
      const errorMessage = getErrorMessage(err as ApiError);
      alert("Failed to load data: " + errorMessage);
    }
  };

  const handlePrefill = async () => {
    if (!id) return;
    try {
      const prefill = await getPrefill(Number(id));
      setFormData((prev) => ({
        ...prev,
        job_title: prefill.job_title || prev.job_title,
        description: prefill.description || prev.description,
        experience: prefill.experience || prev.experience,
      }));
      alert("Form pre-filled!");
    } catch (err) {
      const errorMessage = getErrorMessage(err as ApiError);
      alert("Failed to prefill: " + errorMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditMode && id) {
        await update(Number(id), formData);
      } else {
        await create(formData);
      }
      navigate("/Hr/recruitment");
    } catch (err) {
      const errorMessage = getErrorMessage(err as ApiError);
      alert(errorMessage || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <div className="mb-6">
        <button
          onClick={() => navigate("/Hr/recruitment")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Recruitment
        </button>
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Edit" : "Create"} Job Requisition
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          {isEditMode && (
            <button
              type="button"
              onClick={handlePrefill}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Prefill
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate("/Hr/recruitment")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />{" "}
            {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
