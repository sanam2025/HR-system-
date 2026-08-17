// src/api/service/HrService/PerformanceService.ts
import { apiClient } from '../../client';

export const PerformanceService = {
  // جلب التقييمات المعلقة (pending_hr_review)
  getPendingEvaluations: () => apiClient.get('/evaluations?pending_only=true'),

  // جلب تفاصيل تقييم معين
  getEvaluationById: (id: number) => apiClient.get(`/evaluations/${id}`),

  // إضافة ملاحظات الـ HR واعتماد التقييم
  approveEvaluation: (id: number, data: { hr_notes: string }) =>
    apiClient.post(`/evaluations/${id}/hr-approve`, data),
};