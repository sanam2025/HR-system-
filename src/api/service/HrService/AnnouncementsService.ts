// src/api/service/HrService/AnnouncementsService.ts
import { apiClient } from '../../client';
import type {
  Announcement,
  CreateAnnouncementData,
  UpdateAnnouncementData,
} from './Types/AnnouncementsService.types';

export const AnnouncementsService = {
  // ✅ جلب جميع التعميمات
  getAll: (params?: Record<string, unknown>) => 
    apiClient.get<{ data: Announcement[] }>('/announcements', { params }),

  // ✅ جلب التعميمات النشطة (تصحيح المسار: announcements/active)
  getActive: (params?: Record<string, unknown>) => 
    apiClient.get<{ data: Announcement[] }>('/announcements/active', { params }),

  // ✅ جلب تعميم واحد
  getById: (id: number) => apiClient.get<{ data: Announcement }>(`/announcements/${id}`),

  // ✅ إنشاء تعميم جديد
  create: (data: CreateAnnouncementData) => apiClient.post<{ data: Announcement }>('/announcements', data),

  // ✅ تحديث تعميم
  update: (id: number, data: UpdateAnnouncementData) => apiClient.put<{ data: Announcement }>(`/announcements/${id}`, data),

  // ✅ حذف تعميم
  delete: (id: number) => apiClient.delete(`/announcements/${id}`),

  // ✅ نشر فوري
  publishNow: (id: number) => apiClient.post(`/announcements/${id}/publish`),
};