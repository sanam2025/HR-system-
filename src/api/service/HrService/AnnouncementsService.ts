import { apiClient } from '../../client';
import type {
  Announcement,
  CreateAnnouncementData,
  UpdateAnnouncementData,
} from './Types/AnnouncementsService.types';

export const AnnouncementsService = {  getAll: (params?: Record<string, unknown>) => 
    apiClient.get<{ data: Announcement[] }>('/announcements', { params }),  getActive: (params?: Record<string, unknown>) => 
    apiClient.get<{ data: Announcement[] }>('/announcements/active', { params }),  getById: (id: number) => apiClient.get<{ data: Announcement }>(`/announcements/${id}`),  create: (data: CreateAnnouncementData) => apiClient.post<{ data: Announcement }>('/announcements', data),  update: (id: number, data: UpdateAnnouncementData) => apiClient.put<{ data: Announcement }>(`/announcements/${id}`, data),  delete: (id: number) => apiClient.delete(`/announcements/${id}`),  publishNow: (id: number) => apiClient.patch(`/announcements/${id}/publish`),
};