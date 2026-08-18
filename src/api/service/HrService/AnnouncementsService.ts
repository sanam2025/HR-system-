// src/api/service/HrService/AnnouncementsService.ts
import apiClient from '@/api/axios';
import type {
  Announcement,
  CreateAnnouncementData,
  UpdateAnnouncementData,
} from './Types/AnnouncementsService.types';

export const AnnouncementsService = {
  // جلب جميع التعميمات
  getAll: () => apiClient.get('announcements'),

  // جلب التعميمات النشطة (للواجهة الرئيسية)
  getActive: () => apiClient.get('announcements/active'),

  // جلب تعميم واحد
  getById: (id: number) => apiClient.get(`announcements/${id}`),

  // إنشاء تعميم جديد
  create: (data: CreateAnnouncementData) => apiClient.post<{ data: Announcement }>('announcements', data),

  // تحديث تعميم
  update: (id: number, data: UpdateAnnouncementData) => apiClient.put<{ data: Announcement }>(`announcements/${id}`, data),

  // حذف تعميم
  delete: (id: number) => apiClient.delete(`announcements/${id}`),

  // نشر فوري — الخادم يقبل PATCH فقط
  publishNow: (id: number) => apiClient.patch(`announcements/${id}/publish`),
};