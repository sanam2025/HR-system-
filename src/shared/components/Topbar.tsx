import { Menu, Search, X, Users, LayoutDashboard, CheckSquare, CalendarOff, Clock, BarChart2, TrendingUp, Briefcase, User, LogIn, LogOut, Bell } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../i18n/translations/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { mockEmployees } from '../../data/mockData';
import toast from 'react-hot-toast';
import { submitCheckIn, submitCheckOut, getMyNotifications, markNotificationAsRead, getMyMonthlyAttendance } from '../../api/manager';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { NavItem } from './SideBar';

interface TopbarProps {
  title: string;
  onToggleSidebar: () => void;
  user?: { avatar: string; name: string; role: string };
  navItems?: NavItem[];
}

export default function Topbar({
  title,
  onToggleSidebar,
  user = { avatar: 'A', name: 'Ahmad Front', role: '' },
  navItems = [],
}: TopbarProps) {
  const { lang, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  
  // Notifications state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeMobileNotif, setActiveMobileNotif] = useState<any | null>(null);
  const [dismissedNotifIds, setDismissedNotifIds] = useState<number[]>([]);
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: getMyNotifications,
    refetchInterval: 30000,
  });

  const unreadCount = notifications.filter((n: any) => !n.is_read && !n.read_at).length;

  // Trigger mobile notification popups when unread notifications exist
  useEffect(() => {
    const list = Array.isArray(notifications) ? notifications : [];
    const unreadList = list.filter(
      (n: any) => !n.is_read && !n.read_at && !dismissedNotifIds.includes(n.id)
    );
    if (unreadList.length > 0) {
      setActiveMobileNotif(unreadList[0]);
    } else {
      setActiveMobileNotif(null);
    }
  }, [notifications, dismissedNotifIds, lang]);

  const dismissMobileNotif = (id: number) => {
    setDismissedNotifIds(prev => [...prev, id]);
    setActiveMobileNotif(null);
  };

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const getNotificationRoute = (n: any): string => {
    const text = `${n.type || ''} ${n.title || ''} ${n.message || ''} ${n.data?.type || ''} ${n.data?.message || ''}`.toLowerCase();
    
    if (text.includes('leave') || text.includes('إجازة') || text.includes('مغادرة')) return '/manager/leaves';
    if (text.includes('task') || text.includes('مهمة') || text.includes('مهام')) return '/manager/tasks';
    if (text.includes('overtime') || text.includes('إضافي')) return '/manager/overtime';
    if (text.includes('evaluation') || text.includes('تقييم') || text.includes('أداء')) return '/manager/evaluation';
    if (text.includes('interview') || text.includes('مقابلة')) return '/manager/interviews';
    if (text.includes('recruitment') || text.includes('job') || text.includes('توظيف') || text.includes('احتياج')) return '/manager/recruitment';
    if (text.includes('attendance') || text.includes('حضور') || text.includes('انصراف')) return '/manager/attendance';

    return '/manager';
  };

  const handleNotificationClick = (n: any) => {
    if (!n.is_read && !n.read_at && n.id !== 9991) {
      markAsReadMutation.mutate(n.id);
    }
    setNotificationsOpen(false);
    dismissMobileNotif(n.id);
    const targetPath = getNotificationRoute(n);
    navigate(targetPath);
  };

  // ── Check-in state: local + API-backed init (3-state logic for 1 check per day) ──
  const [attendanceStatus, setAttendanceStatus] = useState<'not_checked_in' | 'checked_in' | 'completed'>(() => {
    const savedDate = localStorage.getItem('attendanceStatusDate');
    const todayStr = new Date().toISOString().split('T')[0];
    if (savedDate === todayStr) {
      const saved = localStorage.getItem('attendanceStatus');
      if (saved === 'checked_in' || saved === 'completed') return saved;
    }
    return 'not_checked_in';
  });
  const [isLoadingCheck, setIsLoadingCheck] = useState(false);

  const updateAttendanceState = (status: 'not_checked_in' | 'checked_in' | 'completed') => {
    const todayStr = new Date().toISOString().split('T')[0];
    setAttendanceStatus(status);
    localStorage.setItem('attendanceStatus', status);
    localStorage.setItem('attendanceStatusDate', todayStr);
    // keep legacy isCheckedIn synced
    localStorage.setItem('isCheckedIn', status === 'checked_in' ? 'true' : 'false');
  };

  // Initialize from API on mount (source of truth)
  useEffect(() => {
    getMyMonthlyAttendance().then((data: any[]) => {
      if (!Array.isArray(data)) return;
      const todayStr = new Date().toISOString().split('T')[0];
      const todayRec = data.find((r: any) =>
        (r.date || r.check_date || r.created_at?.split('T')[0]) === todayStr
      );
      if (!todayRec) {
        updateAttendanceState('not_checked_in');
        return;
      }
      if (todayRec.check_in && todayRec.check_out) {
        updateAttendanceState('completed');
      } else if (todayRec.check_in) {
        updateAttendanceState('checked_in');
      }
    }).catch(() => { /* silent: keep localStorage value */ });
  }, []);

  const handleCheckInOut = async () => {
    setIsLoadingCheck(true);
    try {
      if (isCheckedIn) {
        await submitCheckOut();
        setIsCheckedIn(false);
        localStorage.setItem('isCheckedIn', 'false');
        toast.success(lang === 'ar' ? 'تم تسجيل الانصراف بنجاح' : 'Checked out successfully');
      } else {
        await submitCheckIn();
        setIsCheckedIn(true);
        localStorage.setItem('isCheckedIn', 'true');
        toast.success(lang === 'ar' ? 'تم تسجيل الحضور بنجاح' : 'Checked in successfully');
      }
    } catch (error: any) {
      const backendMessage = error.response?.data?.message || error.response?.data?.error;
      const defaultMessage = lang === 'ar' ? 'حدث خطأ في التسجيل' : 'Error recording attendance';
      toast.error(backendMessage ? `${defaultMessage}: ${backendMessage}` : defaultMessage);
      console.error("Check-in/out error:", error.response || error);
    } finally {
      setIsLoadingCheck(false);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeSearch(); setProfileOpen(false); setNotificationsOpen(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Close profile and notif dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [searchOpen]);

  const openSearch = () => { setSearchOpen(true); setQuery(''); };
  const closeSearch = () => { setSearchOpen(false); setQuery(''); };

  const q = query.trim().toLowerCase();

  const matchedPages = q
    ? navItems.filter(p =>
      p.label.toLowerCase().includes(q)
    )
    : navItems;

  const matchedEmployees = q
    ? mockEmployees.filter(e =>
      e.name.includes(query) ||
      (e.nameEn || '').toLowerCase().includes(q) ||
      (e.title || '').includes(query) ||
      (e.titleEn || '').toLowerCase().includes(q)
    )
    : mockEmployees.slice(0, 4);

  const handlePageClick = (path: string) => {
    navigate(path);
    closeSearch();
  };

  const handleEmployeeClick = (id: number) => {
    navigate(`/manager/employees/${id}`);
    closeSearch();
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-[60]">
        {/* Left section: Hamburger & Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl hover:bg-gray-50 transition-colors text-dark/60 hover:text-dark"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-bold text-dark">{title}</h1>
        </div>

        {/* Right section: Search, Language, Avatar */}
        <div className="flex items-center gap-4">
          {/* Search button */}
          <button
            onClick={openSearch}
            className="p-2 rounded-full hover:bg-green/10 text-gray-400 hover:text-green transition-all duration-200"
            title={lang === 'ar' ? 'بحث' : 'Search'}
          >
            <Search size={18} />
          </button>

          {/* Public Jobs Link */}
          <a
            href="/careers"
            target="_blank"
            rel="noopener noreferrer"
            title={lang === 'ar' ? 'بوابة الوظائف العامة' : 'Public Careers Portal'}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4A7C59]/10 text-[#4A7C59] text-xs font-bold hover:bg-[#4A7C59]/20 transition-all cursor-pointer"
          >
            <Briefcase size={14} />
            <span className="hidden sm:inline">{lang === 'ar' ? 'الوظائف' : 'Careers'}</span>
          </a>

          {/* Check-in / Check-out Buttons (1 per day logic) */}
          <div className="flex items-center gap-2">
            {attendanceStatus === 'not_checked_in' && (
              <button
                onClick={async () => {
                  setIsLoadingCheck(true);
                  try {
                    const coords = { latitude: 33.51548003, longitude: 36.2788800 };
                    await submitCheckIn(coords);
                    updateAttendanceState('checked_in');
                    toast.success(lang === 'ar' ? 'تم تسجيل الحضور بنجاح ✅' : 'Checked in successfully ✅');
                  } catch (error: any) {
                    const msg: string = error.response?.data?.message || error.response?.data?.error || error.message || '';
                    if (
                      msg.includes('already checked in') ||
                      msg.includes('check in again') ||
                      msg.includes('hourly leave') ||
                      msg.includes('already')
                    ) {
                      updateAttendanceState('checked_in');
                      toast.info(lang === 'ar' ? 'سجّلت حضورك بالفعل — اضغط لتسجيل الانصراف' : 'Already checked in — click to check out', { duration: 5000 });
                    } else {
                      toast.error(msg || (lang === 'ar' ? 'خطأ في تسجيل الحضور' : 'Check-in error'));
                    }
                  } finally {
                    setIsLoadingCheck(false);
                  }
                }}
                disabled={isLoadingCheck}
                title={lang === 'ar' ? 'تسجيل حضور' : 'Check In'}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm border bg-green/10 text-[#4A7C59] border-green/20 hover:bg-green/20 disabled:opacity-50"
              >
                <LogIn size={14} />
                <span className="hidden sm:inline">{lang === 'ar' ? 'حضور' : 'Check In'}</span>
              </button>
            )}

            {attendanceStatus === 'checked_in' && (
              <button
                onClick={async () => {
                  setIsLoadingCheck(true);
                  try {
                    const coords = { latitude: 33.51548003, longitude: 36.2788800 };
                    await submitCheckOut(coords);
                    updateAttendanceState('completed');
                    toast.success(lang === 'ar' ? 'تم تسجيل الانصراف بنجاح! اكتمل يوم عملك 🎉' : 'Checked out successfully! Work day completed 🎉');
                  } catch (error: any) {
                    const msg: string = error.response?.data?.message || error.response?.data?.error || error.message || '';
                    if (
                      msg.includes('no active check in') ||
                      msg.includes('already checked out') ||
                      msg.includes('not checked in')
                    ) {
                      updateAttendanceState('completed');
                      toast.info(lang === 'ar' ? 'أنت مسجل انصراف بالفعل لهذا اليوم' : 'Already checked out for today', { duration: 5000 });
                    } else {
                      toast.error(msg ? (lang === 'ar' ? `خطأ انصراف: ${msg}` : `Check-out error: ${msg}`) : (lang === 'ar' ? 'خطأ في تسجيل الانصراف' : 'Check-out error'));
                      console.error(error);
                    }
                  } finally {
                    setIsLoadingCheck(false);
                  }
                }}
                disabled={isLoadingCheck}
                title={lang === 'ar' ? 'تسجيل انصراف' : 'Check Out'}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm border bg-red-50 text-red-600 border-red-200 hover:bg-red-100 disabled:opacity-50"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">{lang === 'ar' ? 'انصراف' : 'Check Out'}</span>
              </button>
            )}

            {attendanceStatus === 'completed' && (
              <button
                onClick={() => {
                  toast.info(lang === 'ar' ? 'تسجيل الحضور والانصراف مسموح به مرة واحدة فقط في اليوم' : 'Check-in & Check-out allowed only once per day', { duration: 4000 });
                }}
                title={lang === 'ar' ? 'اكتمل الحضور والانصراف اليوم' : 'Attendance completed today'}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm border bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
              >
                <Clock size={14} className="text-gray-500" />
                <span className="hidden sm:inline">{lang === 'ar' ? 'اكتمل اليوم' : 'Day Completed'}</span>
              </button>
            )}
          </div>

          {/* Language Switcher Pill */}
          <button
            onClick={toggleLang}
            title={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm cursor-pointer duration-200"
          >
            <span className={lang === 'en' ? 'text-green font-bold' : 'text-gray-400'}>EN</span>
            <span className="text-gray-300 font-normal">|</span>
            <span className={`font-tajawal text-[13px] leading-none ${lang === 'ar' ? 'text-green font-bold' : 'text-gray-400'}`}>ع</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificationsOpen(p => !p)}
              className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer"
              title={lang === 'ar' ? 'الإشعارات' : 'Notifications'}
            >
              <Bell size={20} />
            </button>

            {notificationsOpen && (
              <div className="absolute end-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[300] animate-slide-down flex flex-col max-h-[80vh]">
                <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center sticky top-0">
                  <h3 className="font-bold text-dark">{lang === 'ar' ? 'الإشعارات' : 'Notifications'}</h3>
                  {unreadCount > 0 && (
                    <span className="bg-green/10 text-green text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} {lang === 'ar' ? 'جديد' : 'New'}
                    </span>
                  )}
                </div>
                <div className="overflow-y-auto flex-1">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-400">
                      <Bell size={24} className="mx-auto mb-2 opacity-20" />
                      <p className="text-sm">{lang === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {notifications.map((n: any) => {
                        const isUnread = !n.read_at;
                        
                        // استخراج النص حسب نوع الإشعار
                        let title = lang === 'ar' ? 'إشعار نظام' : 'System Notification';
                        let subtitle = '';
                        let extraInfo = '';
                        let icon = '🔔';
                        let targetPath = '';

                        if (n.data?.type === 'interview_assigned') {
                          icon = '🗓️';
                          title = lang === 'ar' ? 'تم تعيين مقابلة جديدة لك' : 'New Interview Assigned';
                          subtitle = lang === 'ar' 
                            ? `المرشح: ${n.data.candidate || 'غير محدد'}` 
                            : `Candidate: ${n.data.candidate || 'Unknown'}`;
                          if (n.data.scheduled_at) {
                            const d = new Date(n.data.scheduled_at);
                            extraInfo = lang === 'ar'
                              ? `الموعد: ${d.toLocaleDateString('ar-SY')} - ${d.toLocaleTimeString('ar-SY', { hour: '2-digit', minute: '2-digit' })}`
                              : `Scheduled: ${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                          }
                          targetPath = '/manager/interviews';
                        } else if (n.data?.message) {
                          title = n.data.message;
                        } else if (n.data?.title) {
                          title = n.data.title;
                        }

                        return (
                          <div
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 flex gap-3 ${isUnread ? 'bg-blue-50/30' : ''}`}
                          >
                            {/* أيقونة نوع الإشعار */}
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-base">
                              {icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm leading-snug ${isUnread ? 'font-bold text-dark' : 'text-gray-600'}`}>{title}</p>
                              {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
                              {extraInfo && <p className="text-xs text-green font-semibold mt-0.5">{extraInfo}</p>}
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

          {/* User Avatar + Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(p => !p)}
              className="w-8 h-8 rounded-full bg-[#3d7055] hover:bg-[#2d5440] flex items-center justify-center text-white font-bold text-sm cursor-pointer transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green/20"
            >
              {user.avatar}
            </button>

            {profileOpen && (
              <div
                className="absolute end-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[300] animate-slide-down"
              >
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#3d7055] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {user.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-dark truncate">{user.name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{lang === 'ar' ? 'مدير القسم' : 'Department Manager'}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1.5">
                  <button
                    onClick={() => { navigate('/manager/profile'); setProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-dark hover:bg-green/5 hover:text-green transition-colors text-start"
                  >
                    <User size={16} className="text-gray-400" />
                    {lang === 'ar' ? 'الملف الشخصي' : 'Profile'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-start justify-center pt-24"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
          onClick={closeSearch}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-slide-down"
            onClick={e => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
              <Search size={18} className="text-green flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={lang === 'ar' ? 'ابحث عن صفحة أو موظف...' : 'Search pages or employees...'}
                className="flex-1 outline-none text-sm text-dark placeholder-gray-400 bg-transparent"
                style={{ fontFamily: 'inherit' }}
              />
              <button onClick={closeSearch} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto py-2">

              {/* Pages */}
              {matchedPages.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 py-2">
                    {lang === 'ar' ? 'الصفحات' : 'Pages'}
                  </p>
                  {matchedPages.map(page => (
                    <button
                      key={page.path}
                      onClick={() => handlePageClick(page.path)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-green/5 transition-colors text-start group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-green/10 flex items-center justify-center flex-shrink-0 group-hover:bg-green/20 transition-colors">
                        <page.icon size={15} className="text-green" />
                      </div>
                      <span className="text-sm font-semibold text-dark">
                        {page.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Employees */}
              {matchedEmployees.length > 0 && (
                <div className="mt-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 py-2">
                    {lang === 'ar' ? 'الموظفون' : 'Employees'}
                  </p>
                  {matchedEmployees.map(emp => (
                    <button
                      key={emp.id}
                      onClick={() => handleEmployeeClick(emp.id)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-green/5 transition-colors text-start"
                    >
                      <div className="w-8 h-8 rounded-full bg-green/20 flex items-center justify-center text-green font-bold text-sm flex-shrink-0">
                        {emp.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-dark">
                          {lang === 'en' ? emp.nameEn || emp.name : emp.name}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {lang === 'en' ? emp.titleEn || emp.title : emp.title}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* No results */}
              {matchedPages.length === 0 && matchedEmployees.length === 0 && (
                <div className="py-10 text-center text-gray-400 text-sm">
                  {lang === 'ar' ? 'لا توجد نتائج' : 'No results found'}
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2.5 border-t border-gray-50 flex items-center gap-2">
              <kbd className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-mono">ESC</kbd>
              <span className="text-[10px] text-gray-400">{lang === 'ar' ? 'للإغلاق' : 'to close'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Push Notification Popup Banner */}
      {activeMobileNotif && (
        <div className="fixed top-4 start-4 sm:start-auto end-4 z-[9999] max-w-sm w-[92%] sm:w-84 bg-white/95 backdrop-blur-md border border-gray-100/80 rounded-2xl shadow-[0_12px_35px_rgba(0,0,0,0.15)] p-4 transition-all duration-300 animate-slide-down">
          <div className="flex items-start gap-3">
            <div 
              onClick={() => handleNotificationClick(activeMobileNotif)}
              className="w-10 h-10 rounded-xl bg-green/10 text-green flex items-center justify-center font-bold flex-shrink-0 cursor-pointer hover:bg-green/20 transition-colors"
            >
              <Bell size={20} className="animate-bounce text-green" />
            </div>

            <div 
              onClick={() => handleNotificationClick(activeMobileNotif)}
              className="flex-1 min-w-0 cursor-pointer"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-bold text-dark truncate hover:text-green transition-colors">
                  {activeMobileNotif.title || (lang === 'ar' ? 'إشعار جديد 📲' : 'New Notification 📲')}
                </span>
                <span className="text-[10px] text-gray-400">
                  {activeMobileNotif.created_at
                    ? new Date(activeMobileNotif.created_at).toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })
                    : (lang === 'ar' ? 'الآن' : 'Now')}
                </span>
              </div>

              <p className="text-xs text-brown leading-relaxed line-clamp-2">
                {activeMobileNotif.message || activeMobileNotif.data?.message || activeMobileNotif.body || activeMobileNotif.content || (lang === 'ar' ? 'لديك إشعار جديد في النظام' : 'You have a new system notification')}
              </p>

              <div className="flex items-center justify-between gap-3 mt-3 pt-2 border-t border-gray-100/80">
                <span className="text-[11px] font-bold text-green flex items-center gap-1 hover:underline">
                  {lang === 'ar' ? 'عرض التفاصيل ➔' : 'View Details ➔'}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissMobileNotif(activeMobileNotif.id);
                  }}
                  className="text-xs text-gray-400 hover:text-dark cursor-pointer font-semibold"
                >
                  {lang === 'ar' ? 'إغلاق' : 'Dismiss'}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                dismissMobileNotif(activeMobileNotif.id);
              }}
              className="text-gray-300 hover:text-gray-500 p-1 cursor-pointer transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
