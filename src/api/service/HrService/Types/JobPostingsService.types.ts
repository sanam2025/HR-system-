// src/api/Types/JobPostingsService.types.ts
import type { APIResponseWithData } from "./types.types";

export type PostingStatus = 'open' | 'closed';

export interface JobPosting {
  id: number;
  job_title: string;
  description: string;
  experience: number;
  department?: string;
  skills: string[] | number[];
  status: PostingStatus;
  posted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface JobPostingResponse {
  id: number;
  job_title: string;
  description: string;
  experience: number;
  status: PostingStatus;
  created_at: string;
  updated_at: string;
}

export type JobPostingsResponse = APIResponseWithData<JobPosting[]>;
export type JobPostingSingleResponse = APIResponseWithData<JobPosting>;