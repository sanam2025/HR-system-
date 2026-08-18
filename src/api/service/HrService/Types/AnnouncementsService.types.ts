// src/api/service/HrService/Types/AnnouncementsService.types.ts
export type Priority = 'high' | 'medium' | 'low';
export type AnnouncementStatus = 'active' | 'scheduled' | 'draft' | 'expired';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: Priority;
  target_audience: string;
  department?: { id: number; name: string } | null;
  author?: { id: number; full_name: string } | null;
  status: AnnouncementStatus;
  starts_at: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
  priority: Priority;
  audience?: string;
  status?: 'draft' | 'scheduled' | 'active';
  starts_at: string;
  expires_at: string;
}

export interface UpdateAnnouncementData {
  title?: string;
  content?: string;
  priority?: Priority;
  audience?: string;
  status?: AnnouncementStatus;
  starts_at?: string;
  expires_at?: string;
}