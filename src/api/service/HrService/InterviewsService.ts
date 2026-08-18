// src/api/service/HrService/InterviewsService.ts
import { apiClient } from '../../client';

// ✅ تعريف أنواع البيانات للإرسال
export interface CreateInterviewData {
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

export const InterviewsService = {
  // جلب كل المقابلات لوظيفة معينة
  getAll: (jobId: number) => apiClient.get(`/job-postings/${jobId}/interviews`),
  
  // جلب الترتيب حسب التقييم (Ranked by rate)
  getRankedByRate: (jobId: number) => apiClient.get(`/job-postings/${jobId}/interviews/ranked-by-rate`),

  // جلب تفاصيل مقابلة معينة
  getById: (id: number) => apiClient.get(`/interviews/${id}`),

  // جدولة مقابلة جديدة
  create: (jobId: number, data: CreateInterviewData) => apiClient.post(`/job-postings/${jobId}/interviews`, data),

  // إلغاء مقابلة
  cancel: (id: number) => apiClient.patch(`/interviews/${id}/cancel`),

  // تحديث نتيجة المقابلة
  updateResult: (id: number, data: UpdateInterviewResultData) => apiClient.patch(`/interviews/${id}/result`, data),
};