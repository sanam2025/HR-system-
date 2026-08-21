// src/api/service/HrService/Types/AnnouncementsService.types.ts

export type AnnouncementStatus = 'active' | 'scheduled' | 'draft' | 'expired';
export type Priority = 'low' | 'medium' | 'high';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  audience?: 'all' | 'employees' | 'managers' | 'hr';
  target_audience?: string;
  audience_type?: string;
  priority?: Priority;
  status: AnnouncementStatus;
  starts_at: string;
  expires_at?: string;
  ends_at?: string;
  created_at: string;
  updated_at: string;
  department_id?: number | '';
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
  audience?: 'all' | 'employees' | 'managers' | 'hr';
  target_audience?: string;
  audience_type?: string;
  priority?: Priority;
  status: AnnouncementStatus;
  starts_at: string;
  expires_at?: string;
  ends_at?: string;
  department_id?: number | '';
}

export interface UpdateAnnouncementData {
  title?: string;
  content?: string;
  audience?: 'all' | 'employees' | 'managers' | 'hr';
  target_audience?: string;
  audience_type?: string;
  priority?: Priority;
  status?: AnnouncementStatus;
  starts_at?: string;
  expires_at?: string;
  ends_at?: string;
  department_id?: number | '';
}