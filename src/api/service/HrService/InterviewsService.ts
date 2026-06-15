// src/api/service/HrService/InterviewsService.ts
import { apiClient } from "../../client";
import type { InterviewResponse, InterviewResultData, InterviewsResponse, RankingResponse, SubmitRankingData } from "./Types/InterviewsService.types";
import type { APIResponseWithDataArray } from "./Types/types.types";

export const InterviewsService = {
  // جلب قائمة المقابلات لوظيفة
  getByJobId: (jobId: number) => 
    apiClient.get<InterviewsResponse>(`job-postings/${jobId}/interviews`),
  
  // جلب ترتيب المقابلات
  getRanking: (jobId: number) => 
    apiClient.get<RankingResponse>(`job-postings/${jobId}/interviews/ranking`),
  
  // إرسال ترتيب (للمدير)
  submitRanking: (jobId: number, data: SubmitRankingData) => 
    apiClient.post<RankingResponse>(`job-postings/${jobId}/interviews/ranking`, data),
  
  // جلب الترتيب النهائي حسب التقييم
  getRankedByRate: (jobId: number) => 
    apiClient.get<RankingResponse>(`job-postings/${jobId}/interviews/ranked-by-rate`),
  
  // جلب المرشحين المؤهلين للمقابلة (مع نوع صحيح)
  getEligibleCandidates: (jobId: number) => 
    apiClient.get<APIResponseWithDataArray<{ id: number; full_name: string; email: string; experience: number }>>(`job-postings/${jobId}/candidates/interview`),
  
  // جدولة مقابلة جديدة
  schedule: (jobId: number, data: {
    candidate_id: number;
    interviewed_by: number;
    scheduled_at: string;
    location_type: string;
    location_details: string;
  }) => apiClient.post<InterviewResponse>(`job-postings/${jobId}/interviews`, null, { params: data }),
  
  // جلب تفاصيل مقابلة
  getById: (id: number) => 
    apiClient.get<InterviewResponse>(`interviews/${id}`),
  
  // تحديث نتيجة المقابلة
  updateResult: (id: number, data: InterviewResultData) => 
    apiClient.patch<InterviewResponse>(`interviews/${id}/result`, data),
  
  // إلغاء مقابلة
  cancel: (id: number) => 
    apiClient.patch<InterviewResponse>(`interviews/${id}/cancel`),
  
  // مقابلات المدير الحالي
  getMyInterviews: () => 
    apiClient.get<InterviewsResponse>(`my-interviews`),
};