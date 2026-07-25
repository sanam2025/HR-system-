export type AdminProps = {
  title: string,
  icon: React.ReactNode;
  image?: string;
  adminSidebar: AdminSidebar[];
}

export type AdminSidebar = {
  path: string,
  title: string,
  match?: string,
  icon: React.ReactNode
}

export type HolidaysType = 'official' | 'company';

export type Holidays = {
  id: number,
  name: string,
  type: HolidaysType,
  date: Date,
  updated_at: Date,
  created_at: Date,
}

export type CreateHolidayPayload = {
  name: string;
  type: HolidaysType;
  date: string;
}

export type AnnouncementsPriority = 'low' | 'medium' | 'high';
export type AnnouncementsTargetAudience = 'all' | 'managers' | 'department';
export type AnnouncementsStatus = 'scheduled' | 'active';

export type Announcements = {
  id: number;
  title: string;
  content: string;
  priority: AnnouncementsPriority;
  target_audience: string;
  author:{
    id:number,
    full_name: string,
  };
  status: AnnouncementsStatus;
  starts_at: Date;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
}

export type CreateAnnouncemetPayload = {
  title: string ;
  content: string ;
  priority: AnnouncementsPriority ;
  target_audience: AnnouncementsTargetAudience ;
  starts_at: string ;
  expires_at: string ;
}