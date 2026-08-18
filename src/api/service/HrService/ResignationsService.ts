// src/api/service/HrService/ResignationsService.ts
import { apiClient } from '../../client';

export const ResignationsService = {
  // جلب كل الاستقالات (مع فلترة حسب النوع)
  getAll: (type?: 'with_notice' | 'immediate') => {
    const url = type ? `/resignations?type=${type}` : '/resignations';
    return apiClient.get(url);
  },

  // جلب تفاصيل استقالة معينة
  getById: (id: number) => apiClient.get(`/resignations/${id}`),

  // تصنيف الاستقالة (لـ HR فقط)
  classify: (id: number, data: { hr_classification: 'mutual_consent' | 'breach_by_company' | 'breach_by_employee'; hr_classification_notes: string }) =>
    apiClient.post(`/resignations/${id}/classify`, data),

  // تنزيل وثيقة الاستقالة
  downloadDocument: (resignationId: number, documentId: number) =>
    apiClient.get(`/resignations/${resignationId}/documents/${documentId}/download`, {
      responseType: 'blob',
    }),
};