// core/modules/HR/types/recruitment.types.ts
export type RecruitmentPriority = "high" | "medium" | "low";
export type RecruitmentStatus = "approved" | "pending" | "rejected";

export interface RecruitmentRequest {
  id: string;
  jobTitle: string;
  department: string;
  requiredCount: number;
  requester: string;
  priority: RecruitmentPriority;
  status: RecruitmentStatus;
}

export interface JobPostingData {
  jobTitle: string;
  department: string;
  requiredCount: number;
  requester: string;
  priority: RecruitmentPriority;
  description: string;
  requirements: string;
  deadline: string;
}