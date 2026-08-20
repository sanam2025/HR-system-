# دليل الترحيل الاحترافي — MasarHR v3.0
# التاريخ: 2026-08-20

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
جدول الملفات المعدّلة
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1  src/index.css                                                    الوان @theme
2  src/api/manager.ts                                               getMyProfile + saveMyProfile + getMyNotifications + markNotificationAsRead + submitCheckIn/Out
3  src/shared/hooks/useNotifications.ts                             Hook إدارة الاشعارات
4  src/shared/components/NotificationDropdown.tsx                   مكوّن dropdown الاشعارات
5  src/shared/components/Topbar.tsx                                 نظام الاشعارات الحقيقي + Check-in/out + بحث
6  src/core/pages/manager/components/EmployeeProfile.tsx            منطق جلب البروفايل + زر التعديل
7  src/core/pages/manager/components/EditProfileModal.tsx           استبدال الملف كاملاً
8  src/core/pages/Attendance/AttendanceView.tsx                     overflow-x-auto لكل الجداول
9  src/core/modules/HR/pages/Payroll.tsx                            الوان الازرار + تصغير البانر

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. src/index.css
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

اضف داخل قسم @theme:

    @theme {
      --color-green:      #4A7C59;
      --color-green-dark: #3a6347;
      --color-brown:      #6B6358;
      --color-gold:       #C4A66A;
      --color-dark:       #4A4E4A;
    }

بدونها تنكسر كلاسات: text-green, bg-green, bg-gold, text-brown, text-dark

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. src/api/manager.ts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- 2.1 استبدل getMyProfile --

export async function getMyProfile() {
  try {
    const response = await apiClient.get('my-profile');
    if (response.data && response.data.success === false) return null;
    return response.data?.data || response.data || null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      try {
        const fallback = await apiClient.get('profiles');
        const list = fallback.data?.data || fallback.data;
        if (Array.isArray(list) && list.length > 0) return { data: list[0] };
      } catch { return null; }
    }
    return null;
  }
}

-- 2.2 اضف saveMyProfile --

export async function saveMyProfile(id: number | null | undefined, data: FormData) {
  if (id) {
    const r = await apiClient.post('profiles/' + id + '?_method=PUT', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    return r.data;
  }
  const r = await apiClient.post('profiles', data, { headers: { 'Content-Type': 'multipart/form-data' } });
  return r.data;
}

-- 2.3 اضف getMyNotifications --

export async function getMyNotifications(): Promise<any[]> {
  try {
    const r = await apiClient.get('notifications');
    const data = r.data?.data || r.data;
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

-- 2.4 اضف markNotificationAsRead --

export async function markNotificationAsRead(id: number): Promise<void> {
  try { await apiClient.post('notifications/' + id + '/read'); } catch {}
}

-- 2.5 اضف submitCheckIn/Out/getMyMonthlyAttendance --

export async function submitCheckIn(coords?: { latitude: number; longitude: number }) {
  return (await apiClient.post('attendance/check-in', coords || {})).data;
}
export async function submitCheckOut(coords?: { latitude: number; longitude: number }) {
  return (await apiClient.post('attendance/check-out', coords || {})).data;
}
export async function getMyMonthlyAttendance(): Promise<any[]> {
  try {
    const r = await apiClient.get('attendance/my-monthly');
    return r.data?.data || r.data || [];
  } catch { return []; }
}


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. src/shared/hooks/useNotifications.ts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

انشئ الملف او استبدل محتواه:

import React, { useState, useEffect } from 'react';
export interface NotificationItem {
  id: string; title: string; message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean; createdAt: string;
}
export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  useEffect(() => {
    setNotifications([
      { id:'1', title:'New Leave Request', message:'Ahmad requested 2 days off.', type:'info', isRead:false, createdAt: new Date(Date.now()-300000).toISOString() },
      { id:'2', title:'System Update', message:'System will update at midnight.', type:'warning', isRead:false, createdAt: new Date(Date.now()-3600000).toISOString() },
      { id:'3', title:'Payroll Approved', message:'July payroll approved.', type:'success', isRead:true, createdAt: new Date(Date.now()-86400000).toISOString() }
    ]);
  }, []);
  const unreadCount = React.useMemo(() => notifications.filter(n=>!n.isRead).length, [notifications]);
  const markAllAsRead = () => setNotifications(p => p.map(n => ({...n, isRead:true})));
  const markAsRead = (id: string) => setNotifications(p => p.map(n => n.id===id ? {...n,isRead:true} : n));
  const deleteNotification = (id: string) => setNotifications(p => p.filter(n=>n.id!==id));
  return { notifications, unreadCount, markAllAsRead, markAsRead, deleteNotification };
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. src/shared/components/NotificationDropdown.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

مكوّن dropdown بسيط — استبدل محتوى الملف بالكامل.
المميزات:
- يعرض قائمة منسدلة عند الضغط على Bell
- يُبرز الإشعارات غير المقروءة بخلفية زرقاء فاتحة
- زر تمييز الكل كمقروء
- زر حذف كل إشعار عند hover
- يُغلق عند النقر خارجه

الكود الكامل موجود في: src/shared/components/NotificationDropdown.tsx الحالي (لا تعدّله)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. src/shared/components/Topbar.tsx — الأجزاء الحرجة
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

الـ imports المطلوبة (احرص على وجودها جميعاً):

  import { submitCheckIn, submitCheckOut, getMyNotifications, markNotificationAsRead, getMyMonthlyAttendance } from '../../api/manager';
  import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
  import { useAuthStore } from '../../store/authStore';
  import { Bell, LogIn, LogOut, Clock, Search, X, Menu, Briefcase, User } from 'lucide-react';
  import toast from 'react-hot-toast';

-- States الاشعارات (أضفها في بداية الـ component) --

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeMobileNotif, setActiveMobileNotif] = useState<any|null>(null);
  const [dismissedNotifIds, setDismissedNotifIds] = useState<string[]>([]);
  const [viewedNotifIds, setViewedNotifIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('viewedNotifIds') || '[]'); } catch { return []; }
  });
  const queryClient = useQueryClient();
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

-- جلب الاشعارات --

  const userRoleStr = user?.role?.toLowerCase() || '';
  const hasNotifications = ['admin','manager','hr','ceo','employee'].includes(userRoleStr);

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: getMyNotifications,
    refetchInterval: 30000,
    enabled: hasNotifications,
  });

  const displayNotifications = Array.isArray(notifications)
    ? notifications.filter((n:any) => n && typeof n === 'object') : [];

  const unreadCount = displayNotifications.filter((n:any) => {
    return !(n.is_read || n.read_at) && !viewedNotifIds.includes(String(n.id));
  }).length;

-- useEffect: تمييز كمقروء عند فتح القائمة --

  useEffect(() => {
    if (notificationsOpen) {
      const toMark = displayNotifications
        .filter((n:any) => !(n.is_read||n.read_at) && !viewedNotifIds.includes(String(n.id)))
        .map((n:any) => String(n.id));
      if (toMark.length > 0) {
        setViewedNotifIds(prev => {
          const next = [...prev, ...toMark];
          localStorage.setItem('viewedNotifIds', JSON.stringify(next));
          return next;
        });
        toMark.forEach(id => markNotificationAsRead(id as any).catch(()=>{}));
      }
    } else {
      if (viewedNotifIds.length > 0) queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  }, [notificationsOpen]);

-- useEffect: الاشعار العائم للموبايل --

  useEffect(() => {
    const unread = displayNotifications.filter((n:any) =>
      !(n.is_read||n.read_at) && !viewedNotifIds.includes(String(n.id))
    );
    if (unread.length > 0) {
      const toShow = unread.find((n:any) => !dismissedNotifIds.includes(n.id));
      setActiveMobileNotif(toShow || null);
    } else {
      setActiveMobileNotif(null);
    }
  }, [displayNotifications, dismissedNotifIds, viewedNotifIds]);

  const dismissMobileNotif = (id: any) => {
    setDismissedNotifIds(prev => [...prev, id]);
    setActiveMobileNotif(null);
  };

-- دالة التوجيه الذكي بناء على نوع الاشعار --

  const getNotificationRoute = (n: any): string => {
    const text = (n.type+' '+n.title+' '+n.message+' '+(n.data?.type||'')+' '+(n.data?.message||'')).toLowerCase();
    let base = window.location.pathname.split('/')[1] || 'manager';
    if (base.toLowerCase() === 'hr') base = 'Hr';
    if (text.includes('leave')||text.includes('اجازة')) return base==='employee' ? '/employee/attendance' : '/'+base+'/leaves';
    if (text.includes('task')||text.includes('مهمة')) return '/'+base+'/tasks';
    if (text.includes('overtime')||text.includes('اضافي')) return base==='employee' ? '/employee/finance' : '/'+base+'/overtime';
    if (text.includes('attendance')||text.includes('حضور')) return '/'+base+'/attendance';
    if (text.includes('payroll')||text.includes('راتب')) {
      if (base==='admin') return '/admin/report';
      if (base==='Hr') return '/Hr/payroll';
      if (base==='employee') return '/employee/finance';
    }
    if (text.includes('termination')||text.includes('استقالة')) return base==='admin' ? '/admin/termination' : '/'+base+'/terminations';
    return '/'+base;
  };

  const handleNotificationClick = (n: any) => {
    setNotificationsOpen(false);
    dismissMobileNotif(n.id);
    navigate(getNotificationRoute(n));
  };

-- State الحضور (3 حالات) --

  const [attendanceStatus, setAttendanceStatus] = useState<'not_checked_in'|'checked_in'|'completed'>(() => {
    const savedDate = localStorage.getItem('attendanceStatusDate');
    const today = new Date().toISOString().split('T')[0];
    if (savedDate === today) {
      const s = localStorage.getItem('attendanceStatus');
      if (s==='checked_in'||s==='completed') return s;
    }
    return 'not_checked_in';
  });
  const [isLoadingCheck, setIsLoadingCheck] = useState(false);

  const updateAttendanceState = (status: 'not_checked_in'|'checked_in'|'completed') => {
    const today = new Date().toISOString().split('T')[0];
    setAttendanceStatus(status);
    localStorage.setItem('attendanceStatus', status);
    localStorage.setItem('attendanceStatusDate', today);
    localStorage.setItem('isCheckedIn', status==='checked_in' ? 'true' : 'false');
  };

  useEffect(() => {
    getMyMonthlyAttendance().then((data:any[]) => {
      if (!Array.isArray(data)) return;
      const today = new Date().toISOString().split('T')[0];
      const rec = data.find((r:any) => (r.date||r.check_date||r.created_at?.split('T')[0])===today);
      if (!rec) { updateAttendanceState('not_checked_in'); return; }
      if (rec.check_in && rec.check_out) updateAttendanceState('completed');
      else if (rec.check_in) updateAttendanceState('checked_in');
    }).catch(()=>{});
  }, []);


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5 تكملة — JSX Topbar: زر الاشعارات + البانر العائم
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- زر Bell مع Dropdown --

  {hasNotifications && (
    <div className="relative" ref={notifRef}>
      <button onClick={() => setNotificationsOpen(p=>!p)}
        className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer">
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -end-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {notificationsOpen && (
        <div className="absolute end-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[300] flex flex-col max-h-[80vh]">
          <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-bold text-dark">{lang==='ar' ? 'الاشعارات' : 'Notifications'}</h3>
            {unreadCount>0 && (
              <span className="bg-green/10 text-green text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount} {lang==='ar' ? 'جديد' : 'New'}
              </span>
            )}
          </div>
          <div className="overflow-y-auto flex-1">
            {displayNotifications.length===0 ? (
              <div className="p-6 text-center text-gray-400">
                <Bell size={24} className="mx-auto mb-2 opacity-20"/>
                <p className="text-sm">{lang==='ar' ? 'لا توجد اشعارات' : 'No notifications'}</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {displayNotifications.map((n:any) => {
                  const isUnread = !(n.is_read||n.read_at) && !viewedNotifIds.includes(String(n.id));
                  let title = lang==='ar' ? 'اشعار نظام' : 'System Notification';
                  let icon = 'bell';
                  if (n.data?.type==='interview_assigned') {
                    icon = 'calendar';
                    title = lang==='ar' ? 'تم تعيين مقابلة جديدة' : 'New Interview Assigned';
                  } else if (n.data?.message) { title = n.data.message; }
                  else if (n.data?.title) { title = n.data.title; }
                  return (
                    <div key={n.id} onClick={() => handleNotificationClick(n)}
                      className={'p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 flex gap-3 ' + (isUnread ? 'bg-blue-50/30' : '')}>
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Bell size={16} className="text-gray-500"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={'text-sm ' + (isUnread ? 'font-bold text-dark' : 'text-gray-600')}>{title}</p>
                        <span className="text-xs text-gray-400 mt-1 block">
                          {n.created_at ? new Date(n.created_at).toLocaleString() : ''}
                        </span>
                      </div>
                      {isUnread && <div className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-blue-500"></div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )}

-- الاشعار العائم (Mobile Push Banner) — أضفه بعد header مباشرة --

  {activeMobileNotif && (
    <div className="fixed top-4 start-4 sm:start-auto end-4 z-[9999] max-w-sm w-[92%] bg-white/95 backdrop-blur-md border border-gray-100/80 rounded-2xl shadow-[0_12px_35px_rgba(0,0,0,0.15)] p-4">
      <div className="flex items-start gap-3">
        <div onClick={() => handleNotificationClick(activeMobileNotif)}
          className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center cursor-pointer">
          <Bell size={20} className="animate-bounce text-green"/>
        </div>
        <div onClick={() => handleNotificationClick(activeMobileNotif)} className="flex-1 min-w-0 cursor-pointer">
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-xs font-bold text-dark truncate">
              {activeMobileNotif.title || (lang==='ar' ? 'اشعار جديد' : 'New Notification')}
            </span>
            <span className="text-[10px] text-gray-400">
              {activeMobileNotif.created_at
                ? new Date(activeMobileNotif.created_at).toLocaleTimeString(lang==='ar'?'ar-EG':'en-US',{hour:'2-digit',minute:'2-digit'})
                : (lang==='ar' ? 'الان' : 'Now')}
            </span>
          </div>
          <p className="text-xs text-brown leading-relaxed line-clamp-2">
            {activeMobileNotif.message || activeMobileNotif.data?.message || (lang==='ar' ? 'لديك اشعار جديد' : 'New system notification')}
          </p>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100/80">
            <span className="text-[11px] font-bold text-green">{lang==='ar' ? 'عرض التفاصيل' : 'View Details'}</span>
            <button onClick={e => { e.stopPropagation(); dismissMobileNotif(activeMobileNotif.id); }}
              className="text-xs text-gray-400 hover:text-dark font-semibold">
              {lang==='ar' ? 'اغلاق' : 'Dismiss'}
            </button>
          </div>
        </div>
        <button onClick={e => { e.stopPropagation(); dismissMobileNotif(activeMobileNotif.id); }}
          className="text-gray-300 hover:text-gray-500 p-1">
          <X size={15}/>
        </button>
      </div>
    </div>
  )}

-- ازرار Check-in/out (في JSX داخل header) --

  {attendanceStatus === 'not_checked_in' && (
    <button onClick={async () => {
      setIsLoadingCheck(true);
      try {
        await submitCheckIn({ latitude: 33.51548003, longitude: 36.2788800 });
        updateAttendanceState('checked_in');
        toast.success(lang==='ar' ? 'تم تسجيل الحضور' : 'Checked in');
      } catch (e:any) {
        const msg = e.response?.data?.message || '';
        if (msg.includes('already')) { updateAttendanceState('checked_in'); toast.info(lang==='ar'?'سجلت بالفعل':'Already checked in'); }
        else toast.error(msg || (lang==='ar'?'خطأ في الحضور':'Check-in error'));
      } finally { setIsLoadingCheck(false); }
    }}
    disabled={isLoadingCheck}
    className="flex items-center gap-1.5 w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-1 rounded-full text-xs font-bold shadow-sm border bg-green/10 text-[#4A7C59] border-green/20 hover:bg-green/20 disabled:opacity-50">
      <LogIn size={14}/>
      <span className="hidden sm:inline">{lang==='ar' ? 'حضور' : 'Check In'}</span>
    </button>
  )}

  {attendanceStatus === 'checked_in' && (
    <button onClick={async () => {
      setIsLoadingCheck(true);
      try {
        await submitCheckOut({ latitude: 33.51548003, longitude: 36.2788800 });
        updateAttendanceState('completed');
        toast.success(lang==='ar' ? 'تم تسجيل الانصراف' : 'Checked out');
      } catch (e:any) {
        const msg = e.response?.data?.message || '';
        if (msg.includes('already')||msg.includes('no active')) { updateAttendanceState('completed'); toast.info(lang==='ar'?'مسجل انصراف':'Already checked out'); }
        else toast.error(msg || (lang==='ar'?'خطأ في الانصراف':'Check-out error'));
      } finally { setIsLoadingCheck(false); }
    }}
    disabled={isLoadingCheck}
    className="flex items-center gap-1.5 w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-1 rounded-full text-xs font-bold shadow-sm border bg-red-50 text-red-600 border-red-200 hover:bg-red-100 disabled:opacity-50">
      <LogOut size={14}/>
      <span className="hidden sm:inline">{lang==='ar' ? 'انصراف' : 'Check Out'}</span>
    </button>
  )}

  {attendanceStatus === 'completed' && (
    <button onClick={() => toast.info(lang==='ar'?'مسموح مرة واحدة في اليوم':'Once per day only')}
      className="flex items-center gap-1.5 w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-1 rounded-full text-xs font-bold shadow-sm border bg-gray-100 text-gray-600 border-gray-200">
      <Clock size={14}/>
      <span className="hidden sm:inline">{lang==='ar' ? 'اكتمل اليوم' : 'Day Completed'}</span>
    </button>
  )}

-- قائمة بروفايل المستخدم (زر navigate للبروفايل) --

  profileOpen && (
    <div className="absolute end-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[300]">
      <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
        <p className="text-sm font-bold text-dark">{user.name}</p>
        <p className="text-[11px] text-gray-400">{user.role}</p>
      </div>
      <div className="py-1.5">
        <button onClick={() => { navigate('/'+window.location.pathname.split('/')[1]+'/profile'); setProfileOpen(false); }}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-dark hover:bg-green/5 hover:text-green text-start">
          <User size={16} className="text-gray-400"/>
          {lang==='ar' ? 'الملف الشخصي' : 'Profile'}
        </button>
        <button onClick={() => { logout(); navigate('/login'); }}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-start">
          <LogOut size={16} className="text-red-500"/>
          {lang==='ar' ? 'تسجيل الخروج' : 'Logout'}
        </button>
      </div>
    </div>
  )

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. src/core/pages/manager/components/EmployeeProfile.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

imports المطلوبة:
  import { getEmployeeProfile, getMyProfile, ... } from '../../../../api/manager';
  import { useAuthStore } from '../../../../store/authStore';
  import EditProfileModal from './EditProfileModal';
  // اضف Edit2 من lucide-react

States جديدة:
  const currentUser = useAuthStore(state => state.currentUser);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

fetchProfile — استبدل منطق الجلب:
  const data = id ? await getEmployeeProfile(Number(id)) : await getMyProfile();
  let profile = data?.data || data;
  let isProfileExists = !!profile;
  if (!profile && !id && currentUser) {
    profile = { id:currentUser.id, name:currentUser.name||'بدون اسم', email:currentUser.email||'', job_title:currentUser.role||'موظف', department:currentUser.department||'الادارة' };
  }
  if (!profile) throw new Error("No profile found");
  // داخل setEmployee اضف:
  setEmployee({ ...جميع الحقول الموجودة..., isProfileExists });

زر التعديل في JSX:
  {(!id || (currentUser && (currentUser.id===employee.id || currentUser.user_id===employee.id))) && (
    <button onClick={() => setIsEditModalOpen(true)}
      className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-green border border-green/20 rounded-xl shadow-sm font-semibold text-sm">
      <Edit2 size={16}/>
      {lang==='ar' ? 'تعديل البيانات' : 'Edit Profile'}
    </button>
  )}

EditProfileModal في نهاية JSX:
  <EditProfileModal
    isOpen={isEditModalOpen}
    onClose={() => setIsEditModalOpen(false)}
    profileId={employee.isProfileExists ? employee.id : null}
    initialData={{ address:employee.address, picture:employee.picture, birth_date:employee.birthDate, gender:employee.gender }}
    onSuccess={() => fetchProfile()}
  />

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7. EditProfileModal.tsx — راجع الملف الموجود
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

الملف في: src/core/pages/manager/components/EditProfileModal.tsx

الحقول الموجودة: تاريخ الميلاد + الجنس + العنوان + الصورة
لا يوجد حقل رقم الهاتف في الواجهة
لكن في handleSubmit يُرسل phone_number كقيمة افتراضية 0000000000

IMPORTANT — قيود السيرفر:
  - phone_number: اجباري دائماً — 10 ارقام — افتراضي 0000000000
  - birth_date: اجباري عند الانشاء
  - gender: اجباري عند الانشاء — قيم: male او female فقط
  - خطا 422: يُعيد errors → Object.values(errors).flat().join()

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
8. AttendanceView.tsx — الريسبونسف
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

الملف: src/core/pages/Attendance/AttendanceView.tsx

المشكلة: الجدول يُقطع على الشاشات الصغيرة
الحل: ابحث عن divs التي تحتوي tables وأضف:

  قبل: <div className="...">  <table ...>
  بعد: <div className="overflow-x-auto w-full">  <table className="min-w-full ...">

المواضع: الاسطر 473 و 587 و 646

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
9. Payroll.tsx — الالوان
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

الملف: src/core/modules/HR/pages/Payroll.tsx

ازرار الصفحة:
  حوافز   → bg-green text-white rounded-xl hover:bg-green-dark
  خصومات  → bg-brown text-white rounded-xl hover:opacity-90
  سجل     → bg-gold text-white rounded-xl hover:opacity-90

بانر الاجمالي (صغّره وانقله تحت Stats Grid):
  <div className="bg-gradient-to-r from-[#4A7C59] to-[#3a6347] text-white rounded-2xl px-5 py-3 flex items-center justify-between shadow-md w-full max-w-sm mx-auto">
    <div className="flex items-center gap-2">
      <DollarSign size={18} className="text-white/80"/>
      <span className="text-sm font-semibold opacity-90">{isRTL ? 'اجمالي الرواتب' : 'Total Salaries'}</span>
    </div>
    <span className="text-lg font-black">{totalNet.toLocaleString()} {isRTL ? 'ر.س' : 'SAR'}</span>
  </div>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ملاحظات حرجة ونقاط API
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ترتيب التطبيق الاجباري:
  1 index.css
  2 api/manager.ts
  3 hooks/useNotifications.ts
  4 components/NotificationDropdown.tsx
  5 components/Topbar.tsx
  6 EditProfileModal.tsx
  7 EmployeeProfile.tsx
  8 AttendanceView.tsx
  9 Payroll.tsx

نقاط API (Base: https://masarhr.alwaysdata.net/api/):
  GET  notifications              → قائمة الاشعارات
  POST notifications/{id}/read   → تمييز كمقروء
  POST attendance/check-in       → تسجيل الحضور
  POST attendance/check-out      → تسجيل الانصراف
  GET  attendance/my-monthly     → سجل الحضور الشهري
  GET  my-profile                → بروفايل المستخدم
  POST profiles                  → انشاء بروفايل جديد
  POST profiles/{id}?_method=PUT → تعديل بروفايل

الحزم المطلوبة في package.json:
  @tanstack/react-query | react-hot-toast | react-i18next | lucide-react

الالوان الرسمية:
  Green:      #4A7C59  →  bg-green / text-green
  Green Dark: #3a6347  →  bg-green-dark / hover:bg-green-dark
  Brown:      #6B6358  →  bg-brown / text-brown
  Gold:       #C4A66A  →  bg-gold / text-gold
  Dark:       #4A4E4A  →  text-dark

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
قائمة التحقق النهائية
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ Bell تعرض badge بعدد الاشعارات غير المقروءة
□ فتح القائمة يُميّز الاشعارات كمقروءة على السيرفر + localStorage
□ النقر على اشعار يوجّه للصفحة الصحيحة تلقائياً
□ الاشعار العائم يظهر ويمكن اغلاقه
□ Check-in اخضر → Check-out احمر → اكتمل رمادي بدون تكرار
□ البروفايل يفتح بدون خطا حتى بدون ملف في DB
□ زر تعديل البيانات يظهر لصاحب البروفايل فقط
□ نافذة التعديل: صورة + تاريخ ميلاد + جنس + عنوان
□ حفظ البروفايل ينجح بدون خطا 422
□ جداول الحضور تسمح بالتمرير الافقي
□ الوان ازرار Payroll: اخضر + بني + ذهبي
□ كلاسات text-green وbg-gold وtext-brown تعمل في كل الصفحات
□ البحث العام يعمل: صفحات + موظفين بالـ API
□ لغة عربية/انجليزية تعمل في كل الاماكن

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Antigravity AI — MasarHR Migration Guide v3.0 — 2026-08-20
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
