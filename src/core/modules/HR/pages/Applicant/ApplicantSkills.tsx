// src/core/modules/HR/pages/ApplicantDetail/ApplicantSkills.tsx
import type { Candidate } from "../../../../../api/service/HrService/Types/CandidatesService.types";

interface ApplicantSkillsProps {
  candidate: Candidate;
}

const skillLevelColors: Record<string, string> = {
  beginner: "bg-gray-100 text-gray-600",
  intermediate: "bg-blue-100 text-blue-600",
  advanced: "bg-green-100 text-green-600",
  expert: "bg-purple-100 text-purple-600",
};

export default function ApplicantSkills({ candidate }: ApplicantSkillsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills</h3>
      <div className="flex flex-wrap gap-3">
        {candidate.skills.map((skill, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center p-3 bg-gray-50 rounded-lg min-w-[100px]"
          >
            <span className="text-sm font-medium text-gray-800">
              {skill.name}
            </span>
            {skill.level && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full mt-1 ${skillLevelColors[skill.level]}`}
              >
                {skill.level}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
