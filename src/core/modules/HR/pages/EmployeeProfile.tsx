// src/core/modules/HR/pages/EmployeeProfile.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Building2,
  Briefcase,
} from "lucide-react";
import { useProfile } from "../hooks/useDepartments";
import { useEmployee } from "../hooks/useEmployees";
import Loading from "../../../../shared/components/Loading";

export default function EmployeeProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = id ? Number(id) : undefined;

  const { profile, isLoading: profileLoading } = useProfile(userId);
  const { employee, isLoading: employeeLoading } = useEmployee(userId);

  const isLoading = profileLoading || employeeLoading;

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!employee && !profile) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-400">Employee not found</p>
          <button
            onClick={() => navigate("/Hr/employees")}
            className="mt-4 text-blue-500"
          >
            Back to Departments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
              {employee?.full_name?.charAt(0) || "?"}
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {employee?.full_name || "N/A"}
              </h1>
              <p className="text-white/80">
                {employee?.position || "Employee"}
              </p>
              <p className="text-white/60 text-sm">
                {employee?.department_name || "No Department"}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{employee?.email || "N/A"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{profile?.phone_number || "N/A"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>
                  {profile?.birth_date
                    ? new Date(profile.birth_date).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Building2 className="w-4 h-4" />
                <span>{profile?.address || "N/A"}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
              Work Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Briefcase className="w-4 h-4" />
                <span>{employee?.position || "N/A"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Building2 className="w-4 h-4" />
                <span>{employee?.department_name || "N/A"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <User className="w-4 h-4" />
                <span>
                  Status:{" "}
                  <span
                    className={`font-medium ${employee?.status === "active" ? "text-green-600" : "text-red-600"}`}
                  >
                    {employee?.status || "N/A"}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
