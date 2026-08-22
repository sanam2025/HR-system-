
export type Priority    = 'urgent' | 'normal' | 'info';
export type AudienceType = 'all' | 'department' | 'managers';
export type AnnouncementStatus = 'draft' | 'scheduled' | 'active' | 'expired';

export interface Announcement {
  id: number;
  title: string;
  body: string;
  priority: Priority;
  audience_type: AudienceType;
  department_id: number | null;
  created_by: number;
  role_of_creator: string;
  starts_at: string;     // ISO
  ends_at: string | null;// ISO or null
  status: AnnouncementStatus;
  created_at: string;
  updated_at: string;
}const DEFAULT_STORE: Announcement[] = [
  {
    id: 1,
    title: 'تحديث سياسة الإجازات',
    body: 'نود إعلامكم بأنه تم تحديث سياسة الإجازات السنوية لتشمل يومين إضافيين لجميع الموظفين. يرجى مراجعة دليل الموظف للاطلاع على التفاصيل الكاملة.',
    priority: 'info',
    audience_type: 'all',
    department_id: null,
    created_by: 1,
    role_of_creator: 'manager',
    starts_at: new Date().toISOString(),
    ends_at: null,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'اجتماع طارئ للقسم',
    body: 'اجتماع طارئ غداً في تمام الساعة 10 صباحاً لمناقشة تسليمات الربع الأخير.',
    priority: 'urgent',
    audience_type: 'department',
    department_id: 1,
    created_by: 1,
    role_of_creator: 'manager',
    starts_at: new Date(Date.now() + 3_600_000).toISOString(), // 1hr from now
    ends_at: null,
    status: 'scheduled',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'تذكير: تقديم التقارير الشهرية',
    body: 'يُرجى من جميع المدراء تقديم تقاريرهم الشهرية قبل نهاية الأسبوع.',
    priority: 'normal',
    audience_type: 'managers',
    department_id: null,
    created_by: 1,
    role_of_creator: 'manager',
    starts_at: new Date(Date.now() - 86_400_000).toISOString(), // yesterday
    ends_at: new Date(Date.now() - 3_600_000).toISOString(),    // expired
    status: 'expired',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const STORAGE_KEY = 'hr_system_announcements';const getStore = (): Announcement[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse announcements from localStorage', e);
  }
  return DEFAULT_STORE;
};const saveStore = (store: Announcement[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Failed to save announcements to localStorage', e);
  }
};

let nextId = getStore().reduce((max, a) => Math.max(max, a.id), 0) + 1;

const wait = () => new Promise<void>(r => setTimeout(r, 350));export const getActiveAnnouncements = async (): Promise<Announcement[]> => {
  await wait();
  const store = getStore();
  const now = new Date().toISOString();
  return store.filter(
    a =>
      a.status === 'active' &&
      a.starts_at <= now &&
      (!a.ends_at || a.ends_at > now),
  );
};export const getAnnouncements = async (): Promise<Announcement[]> => {
  await wait();
  return getStore();
};export const createAnnouncement = async (
  data: Omit<Announcement, 'id' | 'created_by' | 'role_of_creator' | 'created_at' | 'updated_at'>,
): Promise<Announcement> => {
  await wait();
  const now = new Date().toISOString();
  const ann: Announcement = {
    ...data,
    id: nextId++,
    created_by: 1,
    role_of_creator: 'manager',
    created_at: now,
    updated_at: now,
  };
  const store = getStore();
  store.push(ann);
  saveStore(store);
  return ann;
};export const updateAnnouncement = async (
  id: number,
  data: Partial<Announcement>,
): Promise<Announcement> => {
  await wait();
  const store = getStore();
  const idx = store.findIndex(a => a.id === id);
  if (idx === -1) throw new Error('Not found');
  store[idx] = { ...store[idx], ...data, updated_at: new Date().toISOString() };
  saveStore(store);
  return store[idx];
};export const deleteAnnouncement = async (id: number): Promise<void> => {
  await wait();
  const store = getStore();
  saveStore(store.filter(a => a.id !== id));
};export const publishAnnouncementNow = async (id: number): Promise<Announcement> => {
  await wait();
  const store = getStore();
  const idx = store.findIndex(a => a.id === id);
  if (idx === -1) throw new Error('Not found');
  store[idx] = {
    ...store[idx],
    status: 'active',
    starts_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  saveStore(store);
  return store[idx];
};
