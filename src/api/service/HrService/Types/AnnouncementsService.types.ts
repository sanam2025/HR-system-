// src/api/service/HrService/Types/AnnouncementsService.types.ts
export interface Announcement {
  id: number;
  title: string;
  content: string;
  audience: 'all' | 'employees' | 'managers' | 'hr';
  status: 'active' | 'scheduled' | 'draft' | 'expired';
  starts_at: string;
  ends_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
  audience: 'all' | 'employees' | 'managers' | 'hr';
  status: 'draft' | 'scheduled' | 'active';
  starts_at: string;
  ends_at?: string;
}

export interface UpdateAnnouncementData {
  title?: string;
  content?: string;
  audience?: 'all' | 'employees' | 'managers' | 'hr';
  status?: 'draft' | 'scheduled' | 'active' | 'expired';
  starts_at?: string;
  ends_at?: string;
}