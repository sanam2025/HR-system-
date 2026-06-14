import type{  APIResponseWithData } from "../../../Types/types.types";
import { apiClient } from "../../client";
import type{ JobRequisitionReject, JobRequisition, JobRequisitionApprove } from "./Types/HRService.types";


// // core/modules/HR/types/recruitment.types.ts

// export type RecruitmentPriority = "high" | "medium" | "low";

// export type ApplicationStatus = "pending" | "reviewed" | "interview" | "accepted" | "rejected";
// export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

// // JobRequisition من الـ API


// // ✅ JobPostingData (للفورم - مطلوب)
// export interface JobPostingData {
//   jobTitle: string;
//   department: string;
//   requiredCount: number;
//   requester: string;
//   priority: RecruitmentPriority;
//   description: string;
//   requirements: string;
//   deadline: string;
// }

// export interface Skill {
//   name: string;
//   level: SkillLevel;
// }

// export interface Applicant {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   position: string;
//   experience: number;
//   skills: Skill[];
//   status: ApplicationStatus;
//   appliedDate: string;
//   cvUrl?: string;
//   notes?: string;
//   jobId?: string;
// }

// export interface RecruitmentRequest {
//   id: string;
//   jobTitle: string;
//   department: string;
//   requiredCount: number;
//   requester: string;
//   priority: RecruitmentPriority;
//   status: RecruitmentStatus;
//   applicants?: Applicant[];
//   applicantsCount?: number;
//   recommendedCount?: number;
// }

// // Configurations
// export const priorityConfig: Record<RecruitmentPriority, { label: string; className: string }> = {
//   high: { label: "High", className: "bg-red-100 text-red-700" },
//   medium: { label: "Medium", className: "bg-yellow-100 text-yellow-700" },
//   low: { label: "Low", className: "bg-green-100 text-green-700" },
// };

// export const statusConfig: Record<RecruitmentStatus, { label: string; className: string }> = {
//   approved: { label: "Approved", className: "bg-emerald-100 text-emerald-700" },
//   pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
//   rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
// };

// export const applicationStatusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
//   pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
//   reviewed: { label: "Reviewed", className: "bg-blue-100 text-blue-700" },
//   interview: { label: "Interview", className: "bg-purple-100 text-purple-700" },
//   accepted: { label: "Accepted", className: "bg-emerald-100 text-emerald-700" },
//   rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
// };


export const RequestionService = {
  allRequestion: () => apiClient.get<APIResponseWithData<JobRequisition>>('job-requisitions/all'),
  approveRequestion: (id: number) => apiClient.post<APIResponseWithData<JobRequisitionApprove>>(`job-requisitions/${id}/approve`),
  rejectRequestion: (id: number) => apiClient.post<APIResponseWithData<JobRequisitionReject>>(`job-requisitions/${id}/reject`)
};