import { Menu, Search, X, Users, LayoutDashboard, CheckSquare, CalendarOff, Clock, BarChart2, TrendingUp, Briefcase, User, LogIn, LogOut, Bell } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../i18n/translations/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { mockEmployees } from '../../data/mockData';
import toast from 'react-hot-toast';
import { submitCheckIn, submitCheckOut, getMyNotifications, markNotificationAsRead } from '../../api/manager';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface TopbarProps {
  title: string;
  onToggleSidebar: () => void;
  user?: { avatar: string; name: string; role: string };
}

const PAGES = [
  { labelAr: 'لوحة التحكم', labelEn: 'Dashboard', path: '/manager', icon: LayoutDashboard },
  { labelAr: 'الموظفون', labelEn: 'Employees', path: '/manager/employees', icon: Users },
  { labelAr: 'المهام', labelEn: 'Tasks', path: '/manager/tasks', icon: CheckSquare },
  { labelAr: 'الإجازات', labelEn: 'Leave Requests', path: '/manager/leaves', icon: CalendarOff },
  { labelAr: 'العمل الإضافي', labelEn: 'Overtime', path: '/manager/overtime', icon: Clock },
  { labelAr: 'الحضور', labelEn: 'Attendance', path: '/manager/attendance', icon: BarChart2 },
  { labelAr: 'التقييم الدوري', labelEn: 'Periodic Review', path: '/manager/evaluation', icon: TrendingUp },
  { labelAr: 'التوظيف', labelEn: 'Recruitment', path: '/manager/recruitment', icon: Briefcase },
];

export default function Topbar({
  title,
  onToggleSidebar,
  user = { avatar: 'M', name: 'Mohamed Ahmed', role: '' },
}: TopbarProps) {
  const { lang, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  
  // Notifications state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: getMyNotifications,
    refetchInterval: 30000,
  });

  const unreadCount = notifications.filter((n: any) => !n.is_read && !n.read_at).length;

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const handleNotificationClick = (n: any) => {
    if (!n.is_read && !n.read_at) {
      markAsReadMutation.mutate(n.id);
    }
  };

  // Check-in state
  const [isCheckedIn, setIsCheckedIn] = useState(() => localStorage.getItem('isCheckedIn') === 'true');
  const [isLoadingCheck, setIsLoadingCheck] = useState(false);

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
    ? PAGES.filter(p =>
      p.labelAr.includes(query) ||
      p.labelEn.toLowerCase().includes(q)
    )
    : PAGES;

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

          {/* Check-in / Check-out Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                setIsLoadingCheck(true);
                try {
                  await submitCheckIn();
                  toast.success(lang === 'ar' ? 'تم تسجيل الحضور بنجاح' : 'Checked in successfully');
                } catch (error: any) {
                  const msg = error.response?.data?.message || error.response?.data?.error;
                  toast.error(msg ? `خطأ حضور: ${msg}` : (lang === 'ar' ? 'خطأ في تسجيل الحضور' : 'Check-in error'));
                  console.error(error);
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

            <button
              onClick={async () => {
                setIsLoadingCheck(true);
                try {
                  await submitCheckOut();
                  toast.success(lang === 'ar' ? 'تم تسجيل الانصراف بنجاح' : 'Checked out successfully');
                } catch (error: any) {
                  const msg = error.response?.data?.message || error.response?.data?.error;
                  toast.error(msg ? `خطأ انصراف: ${msg}` : (lang === 'ar' ? 'خطأ في تسجيل الانصراف' : 'Check-out error'));
                  console.error(error);
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
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
              )}
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
                            onClick={() => {
                              if (isUnread) markAsReadMutation.mutate(n.id);
                              setNotificationsOpen(false);
                              if (targetPath) navigate(targetPath);
                            }}
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
                        {lang === 'ar' ? page.labelAr : page.labelEn}
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

    </>
  );
}
