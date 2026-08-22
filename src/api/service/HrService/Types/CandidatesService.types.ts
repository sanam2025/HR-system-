import type { APIResponseWithData, APIResponseWithDataArray } from "./types.types";

export type CandidateStatus = 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected';

export interface Candidate {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  experience: number;
  skills: { id: number; name: string; level?: string }[];
  status: CandidateStatus;
  applied_date: string;
  cv_url?: string;
  notes?: string;
}

export interface CandidateCVResponse {
  url: string;
  expires: number;
  signature: string;
}

export type CandidatesResponse = APIResponseWithDataArray<Candidate>;
export type CandidateResponse = APIResponseWithData<Candidate>;