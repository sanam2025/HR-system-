// src/api/Types/InterviewsService.types.ts
import type { APIResponseWithData, APIResponseWithDataArray } from "./types.types";

export type LocationType = 'on_site' | 'online';
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Interview {
  id: number;
  candidate_id: number;
  candidate_name: string;
  interviewed_by: number;
  interviewer_name: string;
  scheduled_at: string;
  location_type: LocationType;
  location_details: string;
  status: InterviewStatus;
  rate?: number;
  notes?: string;
  created_at: string;
}

export interface InterviewRanking {
  interview_id: number;
  rank: number;
}

export interface SubmitRankingData {
  ranking: InterviewRanking[];
}

export interface InterviewResultData {
  rate: number;
  notes: string;
}

export type InterviewsResponse = APIResponseWithDataArray<Interview>;
export type InterviewResponse = APIResponseWithData<Interview>;
export type RankingResponse = APIResponseWithData<InterviewRanking[]>;