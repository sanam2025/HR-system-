export interface Interview {
  id: number;
  candidate_id: number;
  interviewed_by: number;
  scheduled_at: string;
  location_type: string;
  location_details?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending' | 'done';
  rate?: number;
  rate_label?: string;
  notes?: string;
  rank?: number;
  candidate?: {
    id: number;
    full_name: string;
    email: string;
  };
  interviewer?: {
    id: number;
    full_name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ScheduleInterviewData {
  candidate_id: number;
  interviewed_by: number;
  scheduled_at: string;
  location_type: string;
  location_details?: string;
}

export interface UpdateInterviewResultData {
  rate: number;
  notes?: string;
}

export interface SubmitRankingData {
  ranking: {
    interview_id: number;
    rank: number;
  }[];
}