// src/api/service/HrService/JobPostingsService.ts
import type { APIResponseWithData } from "./Types/types.types";
import { apiClient } from "../../client";
import type { JobPosting, JobPostingSingleResponse } from "./Types/JobPostingsService.types";

export const JobPostingsService = {
  // جلب كل الوظائف (لـ HR)
  getAll: () => apiClient.get<APIResponseWithData<JobPosting[]>>('HRjob-postings'),
  
  // جلب وظيفة واحدة
  getById: (id: number) => apiClient.get<JobPostingSingleResponse>(`HRjob-postings/${id}`),
  
  // تحديث وظيفة
  update: (id: number, data: Partial<{ job_title: string; description: string; experience: number; skills: number[] }>) => 
    apiClient.put<JobPostingSingleResponse>(`HRjob-postings/${id}`, data),
  
  // إغلاق وظيفة
  close: (id: number) => apiClient.patch<JobPostingSingleResponse>(`HRjob-postings/${id}/close`),
  
  // حذف وظيفة
  delete: (id: number) => apiClient.delete(`HRjob-postings/${id}`),
};