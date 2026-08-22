import { Mail, Phone, Calendar, Briefcase } from "lucide-react";
import type { Candidate } from "../../../../../api/service/HrService/Types/CandidatesService.types";

interface ApplicantInfoProps {
  candidate: Candidate;
}

export default function ApplicantInfo({ candidate }: ApplicantInfoProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Personal Information
      </h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-gray-600">
          <Mail className="w-4 h-4" />
          <span className="text-sm">{candidate.email}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-600">
          <Phone className="w-4 h-4" />
          <span className="text-sm">{candidate.phone || "Not provided"}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            Applied: {new Date(candidate.applied_date).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-3 text-gray-600">
          <Briefcase className="w-4 h-4" />
          <span className="text-sm">
            {candidate.experience} years of experience
          </span>
        </div>
      </div>
    </div>
  );
}
