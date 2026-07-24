// src/api/service/HrService/InterviewsService.ts
import apiClient from '@/api/axios';

// تعريف أنواع البيانات
export interface ScheduleInterviewData {
  candidate_id: number;
  scheduled_at: string;
  location_type: string;
  location_details?: string;
  // interviewed_by محذوف (يتم تعيينه تلقائياً)
}

export interface UpdateResultData {
  rate: number;
  notes?: string;
}

export interface SubmitRankingData {
  ranking: { interview_id: number; rank: number }[];
}

export const InterviewsService = {
  // جلب كل المقابلات (للسايد بار)
  getAll: () => apiClient.get('/interviews'),
  
  // جلب مقابلات وظيفة معينة
  getByJobId: (jobId: number) => apiClient.get(`/job-postings/${jobId}/interviews`),
  
  // جدولة مقابلة جديدة (بدون interviewed_by)
  schedule: (jobId: number, data: ScheduleInterviewData) => 
    apiClient.post(`/job-postings/${jobId}/interviews`, data),
  
  // تحديث نتيجة مقابلة
  updateResult: (id: number, data: UpdateResultData) => 
    apiClient.patch(`/interviews/${id}/result`, data),
  
  // إلغاء مقابلة
  cancel: (id: number) => apiClient.patch(`/interviews/${id}/cancel`),
  
  // جلب ترتيب المقابلات
  getRanking: (jobId: number) => apiClient.get(`/job-postings/${jobId}/interviews/ranking`),
  
  // حفظ ترتيب المقابلات
  submitRanking: (jobId: number, data: SubmitRankingData) => 
    apiClient.post(`/job-postings/${jobId}/interviews/ranking`, data),
};