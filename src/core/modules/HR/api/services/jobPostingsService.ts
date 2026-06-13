// core/modules/HR/api/services/jobPostingsService.ts
import apiClient from '../client';
import type { JobPosting, UpdateJobPostingData } from '../../types/jobPosting.types';

export const jobPostingsService = {
  // 1. جلب كل الوظائف (لـ HR)
  getAllForHR: async (): Promise<JobPosting[]> => {
    const response = await apiClient.get('/HRjob-postings');
    return response.data?.data || [];
  },

  // 2. جلب وظيفة واحدة (لـ HR)
  getByIdForHR: async (id: number): Promise<JobPosting> => {
    const response = await apiClient.get(`/HRjob-postings/${id}`);
    return response.data?.data;
  },

  // 3. تحديث وظيفة
  update: async (id: number, data: UpdateJobPostingData): Promise<JobPosting> => {
    const response = await apiClient.put(`/HRjob-postings/${id}`, data);
    return response.data?.data;
  },

  // 4. إغلاق وظيفة
  close: async (id: number): Promise<JobPosting> => {
    const response = await apiClient.patch(`/HRjob-postings/${id}/close`);
    return response.data?.data;
  },

  // 5. حذف وظيفة
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/HRjob-postings/${id}`);
  },

  // 6. جلب كل الوظائف (عام - بدون توكن)
  getAllPublic: async (): Promise<JobPosting[]> => {
    const response = await apiClient.get('/job-postings');
    return response.data?.data || [];
  },

  // 7. جلب وظيفة واحدة (عام)
  getByIdPublic: async (id: number): Promise<JobPosting> => {
    const response = await apiClient.get(`/job-postings/${id}`);
    return response.data?.data;
  },
};