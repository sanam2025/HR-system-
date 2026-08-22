import type { APIResponseWithData } from "./Types/types.types";
import { apiClient } from "../../client";
import type { JobPosting, JobPostingSingleResponse } from "./Types/JobPostingsService.types";
import type { Candidate } from "./Types/CandidatesService.types";

export const JobPostingsService = {  getCount: () => apiClient.get('/jobpostings/count'),  getAll: () => apiClient.get<APIResponseWithData<JobPosting[]>>('HRjob-postings'),  getById: (id: number) => apiClient.get<JobPostingSingleResponse>(`job-postings/${id}`),  getCandidatesByJobPosting: (jobPostingId: number) => 
    apiClient.get<APIResponseWithData<Candidate[]>>(`/job-postings/${jobPostingId}/candidates`),  update: (id: number, data: Partial<{ job_title: string; description: string; experience: number; skills: number[] }>) => 
    apiClient.put<JobPostingSingleResponse>(`HRjob-postings/${id}`, data),  close: (id: number) => apiClient.patch<JobPostingSingleResponse>(`HRjob-postings/${id}/close`),  delete: (id: number) => apiClient.delete(`HRjob-postings/${id}`),
};