import { apiClient } from '../../client';export interface CreateInterviewData {
  candidate_id: number;
  interviewed_by: number;
  scheduled_at: string;
  location_type: string;
  location_details?: string;
}

export interface UpdateInterviewResultData {
  rate: number;
  note?: string;
}

export const InterviewsService = {  getAll: (jobId: number) => apiClient.get(`/job-postings/${jobId}/interviews`),  getRankedByRate: (jobId: number) => apiClient.get(`/job-postings/${jobId}/interviews/ranked-by-rate`),  getById: (id: number) => apiClient.get(`/interviews/${id}`),  create: (jobId: number, data: CreateInterviewData) => apiClient.post(`/job-postings/${jobId}/interviews`, data),  cancel: (id: number) => apiClient.patch(`/interviews/${id}/cancel`),  updateResult: (id: number, data: UpdateInterviewResultData) => apiClient.patch(`/interviews/${id}/result`, data),  submitRanking: (jobId: number, data: any) => apiClient.post(`/job-postings/${jobId}/interviews/ranking`, data),  getRanking: (jobId: number) => apiClient.get(`/job-postings/${jobId}/interviews/ranking`),
};