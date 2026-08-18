// src/api/service/HrService/OvertimeService.ts
import { apiClient } from '../../client';

export const OvertimeService = {
  // جلب طلبات الأوفرتايم الإجباري (التي يحتاجها HR)
  getMandatory: () => apiClient.get('/mandatory-overtime'),
  // جلب طلبات الأوفرتايم التطوعي (مشاهدة فقط لـ HR)
  getVoluntary: () => apiClient.get('/voluntary-overtime'),
  // جلب أوفرتايم القسم
  getDepartmentOvertime: () => apiClient.get('/my-department-overtime'),
  // جلب تفاصيل أوفرتايم معين
  getById: (id: number) => apiClient.get(`/overtimes/${id}`),
  // قبول طلب إجباري (لـ HR فقط)
  approveMandatory: (id: number) => apiClient.put(`/mandatory-overtime/${id}/approve`),
  // رفض طلب إجباري (لـ HR فقط)
  rejectMandatory: (id: number) => apiClient.put(`/mandatory-overtime/${id}/reject`),
  // حذف طلب أوفرتايم
  delete: (id: number) => apiClient.delete(`/delete-overtime/${id}/request`),
};