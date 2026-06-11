// core/modules/HR/pages/AllApplicants.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye } from "lucide-react";
import type { Applicant, ApplicationStatus } from "../types/recruitment.types";

// ============= DATA =============
const ALL_APPLICANTS: Applicant[] = [
  { id: "1", name: "Ahmed Mansour", email: "ahmed.mansour@example.com", phone: "+963 11 1234567", position: "Web Developer", experience: 5, skills: [{ name: "React", level: "expert" }, { name: "TypeScript", level: "advanced" }], status: "pending", appliedDate: "2026-06-01", cvUrl: "/cvs/ahmed.pdf", jobId: "1" },
  { id: "2", name: "Sara Khalil", email: "sara.khalil@example.com", phone: "+963 11 2345678", position: "Web Developer", experience: 3, skills: [{ name: "React", level: "intermediate" }, { name: "CSS", level: "advanced" }], status: "reviewed", appliedDate: "2026-05-28", cvUrl: "/cvs/sara.pdf", jobId: "1" },
  { id: "3", name: "Omar Hassan", email: "omar.hassan@example.com", phone: "+963 11 3456789", position: "Web Developer", experience: 7, skills: [{ name: "React", level: "expert" }, { name: "Node.js", level: "expert" }], status: "interview", appliedDate: "2026-05-25", cvUrl: "/cvs/omar.pdf", jobId: "1" },
];

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  reviewed: "bg-blue-100 text-blue-700",
  interview: "bg-purple-100 text-purple-700",
  accepted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

const STATS_CONFIG = [
  { key: "total", label: "Total", color: "text-gray-800", getValue: (arr: Applicant[]) => arr.length },
  { key: "pending", label: "Pending", color: "text-amber-600", getValue: (arr: Applicant[]) => arr.filter(a => a.status === "pending").length },
  { key: "reviewed", label: "Reviewed", color: "text-blue-600", getValue: (arr: Applicant[]) => arr.filter(a => a.status === "reviewed").length },
  { key: "interview", label: "Interview", color: "text-purple-600", getValue: (arr: Applicant[]) => arr.filter(a => a.status === "interview").length },
  { key: "accepted", label: "Accepted", color: "text-emerald-600", getValue: (arr: Applicant[]) => arr.filter(a => a.status === "accepted").length },
];

const COLUMNS = ["Applicant", "Position", "Skills", "Experience", "Status", "Applied Date", "Actions"];

// ============= COMPONENTS =============
const StatsGrid = ({ applicants }: { applicants: Applicant[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
    {STATS_CONFIG.map(({ label, color, getValue }) => (
      <div key={label} className="bg-white rounded-xl shadow-sm p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
        <p className={`text-2xl font-bold ${color} mt-1`}>{getValue(applicants)}</p>
      </div>
    ))}
  </div>
);

// ============= MAIN =============
export default function AllApplicants() {
  const navigate = useNavigate();

  const handleViewApplicant = (applicant: Applicant) => {
    navigate(`/Hr/recruitment/applicant/${applicant.id}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <div className="mb-8">
        <button onClick={() => navigate("/Hr/recruitment")} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3">
          <ArrowLeft className="w-4 h-4" /> Back to Recruitment
        </button>
        <h1 className="text-2xl font-bold">All Applicants</h1>
        <p className="text-gray-500 text-sm mt-1">View and manage all job applicants across all positions</p>
      </div>

      <StatsGrid applicants={ALL_APPLICANTS} />

      {/* Applicants Table - بدون بوردرات */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {COLUMNS.map((col) => (
                  <th key={col} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_APPLICANTS.map((applicant) => (
                <tr key={applicant.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div>
                      <div className="text-sm font-medium text-gray-800">{applicant.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{applicant.email}</div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{applicant.position}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {applicant.skills.slice(0, 2).map((skill, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{skill.name}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{applicant.experience} years</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${STATUS_COLORS[applicant.status]}`}>
                      {applicant.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{new Date(applicant.appliedDate).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => handleViewApplicant(applicant)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg" title="View Details">
                      <Eye className="w-4 h-4" />
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