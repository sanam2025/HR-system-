// core/modules/HR/pages/ApplicantDetail.tsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase, 
  FileText,
  Download,
  Send,
  X,
  User
} from "lucide-react";
import type { Applicant, SkillLevel } from "../types/recruitment.types";

// بيانات تجريبية للمتقدم
const applicant: Applicant = {
  id: "1",
  name: "Ahmed Mansour",
  email: "ahmed.mansour@example.com",
  phone: "+963 11 1234567",
  position: "Web Developer",
  experience: 5,
  skills: [
    { name: "React", level: "expert" },
    { name: "TypeScript", level: "advanced" },
    { name: "Node.js", level: "intermediate" },
    { name: "Tailwind CSS", level: "advanced" },
  ],
  status: "pending",
  appliedDate: "2026-06-01",
  cvUrl: "/cvs/ahmed.pdf",
  notes: "Strong portfolio, previous experience in similar role",
};

const skillLevelColors: Record<SkillLevel, string> = {
  beginner: "bg-gray-100 text-gray-600",
  intermediate: "bg-blue-100 text-blue-600",
  advanced: "bg-green-100 text-green-600",
  expert: "bg-purple-100 text-purple-600",
};

// Interview Form Component
const InterviewFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { interviewDate: string; managerName: string }) => void;
  candidateName: string;
}> = ({ isOpen, onClose, onSubmit, candidateName }) => {
  const [interviewDate, setInterviewDate] = useState("");
  const [managerName, setManagerName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ interviewDate, managerName });
    setInterviewDate("");
    setManagerName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="ltr">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Schedule Interview</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Candidate: <span className="font-semibold text-gray-800">{candidateName}</span></p>
          </div>

          {/* Interview Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interview Date *</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Manager Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manager Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="e.g., Dr. Khaled Al-Sayed"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
              Cancel
            </button>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              <Send className="w-4 h-4" />
              Schedule Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function ApplicantDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isInterviewFormOpen, setIsInterviewFormOpen] = useState(false);

  const handleRecommendForInterview = () => {
    setIsInterviewFormOpen(true);
  };

  const handleScheduleInterview = (data: { interviewDate: string; managerName: string }) => {
    console.log("Interview scheduled:", { ...data, candidateId: id, candidateName: applicant.name });
    alert(`✅ Interview scheduled for ${applicant.name} with ${data.managerName} on ${new Date(data.interviewDate).toLocaleString()}`);
    navigate("/Hr/all-applicants");
  };

  const handleDownloadCV = () => {
    console.log("Download CV:", applicant.cvUrl);
    alert("Downloading CV...");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      {/* Interview Form Modal */}
      <InterviewFormModal
        isOpen={isInterviewFormOpen}
        onClose={() => setIsInterviewFormOpen(false)}
        onSubmit={handleScheduleInterview}
        candidateName={applicant.name}
      />

      {/* Header */}
      <div className="mb-6">
        <button onClick={() => navigate("/Hr/all-applicants")} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Applicants
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{applicant.name}</h1>
            <p className="text-gray-500 mt-1">{applicant.position}</p>
          </div>
          <button
            onClick={handleRecommendForInterview}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
          >
            <Send className="w-4 h-4" />
            Recommend for Interview
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Personal Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{applicant.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{applicant.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Applied: {new Date(applicant.appliedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Briefcase className="w-4 h-4" />
                <span className="text-sm">{applicant.experience} years of experience</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">CV & Documents</h3>
            <button
              onClick={handleDownloadCV}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <span className="text-sm">CV_Ahmed_Mansour.pdf</span>
              </div>
              <Download className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Right Column - Skills & Recommendation */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-3">
              {applicant.skills.map((skill, idx) => (
                <div key={idx} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg min-w-[100px]">
                  <span className="text-sm font-medium text-gray-800">{skill.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full mt-1 ${skillLevelColors[skill.level]}`}>
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommendation Note</h3>
            <textarea
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Add notes for the manager about this candidate..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}