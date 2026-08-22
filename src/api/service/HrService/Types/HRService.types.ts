import type { UserStatus } from "./types.types";

export type RecruitmentStatus = "approved" | "pending" | "rejected";
export type PostingStatus = 'open' | 'closed';

export type JobRequisition = {
  id: number;
  job_title: string;
  experience: number;
  status: RecruitmentStatus | null;
  created_at: string;
  department: { id: number; name: string };
  requested_by: { id: number; full_name: string };
  skills_count: number;
  is_posted: boolean;
}

export type Requisition = {
  id: number;
  job_title: string;
  description: string;
  experience: string;
  status: RecruitmentStatus | null;
}

export type Posting = {
  id: number;
  job_title: string;
  description: string;
  status: PostingStatus;
  posted_at: Date;
  updated_at: Date;
}

export type JobRequisitionApprove = {
  requisition: Requisition;
  posting: Posting;
}

export type JobRequisitionReject = {
  id: number;
  job_title: string;
  description: string;
  experience: string;
  status: RecruitmentStatus | null;
  requested_by: { id: number; full_name: string; status: UserStatus };
  department: { id: number; name: string };
  skills: { id: number; name: string }[];
}