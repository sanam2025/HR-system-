import apiClient from './axios';

export interface JobRequisitionPayload {
  job_title: string;
  description: string;
  experience: number;
  skills: any[]; // currently using strings or IDs
}

export interface CandidateResultPayload {
  rate: number;
  notes: string;
}

export interface CandidateRankingPayload {
  ranking: {
    interview_id: number;
    rank: number;
  }[];
}

// ── طلبات التوظيف (Job Requisitions) ──

export async function createJobRequisition(data: JobRequisitionPayload) {
  const response = await apiClient.post('job-requisitions', data);
  return response.data;
}

// ── المقابلات والمرشحين (Interviews & Candidates) ──

export async function getInterviewCandidates(jobPostingId: number) {
  // يرجع قائمة المرشحين المؤهلين لمقابلة لوظيفة معينة
  const response = await apiClient.get(`job-postings/${jobPostingId}/candidates/interview`);
  return response.data;
}

export async function submitInterviewResult(interviewId: number, data: CandidateResultPayload) {
  // تحديث نتيجة المقابلة (تقييم المرشح)
  const response = await apiClient.patch(`interviews/${interviewId}/result`, data);
  return response.data;
}

export async function submitCandidatesRanking(jobPostingId: number, data: CandidateRankingPayload) {
  // تقديم ترتيب المرشحين
  const response = await apiClient.post(`job-postings/${jobPostingId}/interviews/ranking`, data);
  return response.data;
}
