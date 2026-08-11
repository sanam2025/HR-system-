// src/api/service/HrService/JobPostingsService.ts
import type { APIResponseWithData } from "./Types/types.types";
import { apiClient } from "../../client";
import type { JobPosting, JobPostingSingleResponse } from "./Types/JobPostingsService.types";
import type { Candidate } from "./Types/CandidatesService.types";

export const JobPostingsService = {
  // ✅ جلب عدد الوظائف (بناءً على الصورة الثانية: job posting count h)
  getCount: () => apiClient.get('/jobpostings/count'),

  // جلب كل الوظائف (لـ HR)
  getAll: () => apiClient.get<APIResponseWithData<JobPosting[]>>('HRjob-postings'),
  
  // جلب وظيفة واحدة
  getById: (id: number) => apiClient.get<JobPostingSingleResponse>(`HRjob-postings/${id}`),
  
  // جلب المتقدمين لوظيفة محددة
  getCandidatesByJobPosting: (jobPostingId: number) => 
    apiClient.get<APIResponseWithData<Candidate[]>>(`/job-postings/${jobPostingId}/candidates`),
  
  // تحديث وظيفة
  update: (id: number, data: Partial<{ job_title: string; description: string; experience: number; skills: number[] }>) => 
    apiClient.put<JobPostingSingleResponse>(`HRjob-postings/${id}`, data),
  
  // إغلاق وظيفة
  close: (id: number) => apiClient.patch<JobPostingSingleResponse>(`HRjob-postings/${id}/close`),
  
  // حذف وظيفة
  delete: (id: number) => apiClient.delete(`HRjob-postings/${id}`),
};