import { Menu, Search, X, Users, LayoutDashboard, CheckSquare, CalendarOff, Clock, BarChart2, TrendingUp, Briefcase, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../i18n/translations/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockEmployees } from '../../data/mockData';
import NotificationDropdown from './NotificationDropdown';

interface TopbarProps {
  title: string;
  onToggleSidebar: () => void;
  user?: { avatar: string; name: string; role: string };
}

const MANAGER_PAGES = [
  { labelAr: 'لوحة التحكم', labelEn: 'Dashboard', path: '/manager', icon: LayoutDashboard },
  { labelAr: 'الموظفون', labelEn: 'Employees', path: '/manager/employees', icon: Users },
  { labelAr: 'المهام', labelEn: 'Tasks', path: '/manager/tasks', icon: CheckSquare },
  { labelAr: 'الإجازات', labelEn: 'Leave Requests', path: '/manager/leaves', icon: CalendarOff },
  { labelAr: 'العمل الإضافي', labelEn: 'Overtime', path: '/manager/overtime', icon: Clock },
  { labelAr: 'الحضور', labelEn: 'Attendance', path: '/manager/attendance', icon: BarChart2 },
  { labelAr: 'التقييم الدوري', labelEn: 'Periodic Review', path: '/manager/evaluation', icon: TrendingUp },
  { labelAr: 'التوظيف', labelEn: 'Recruitment', path: '/manager/recruitment', icon: Briefcase },
];

const HR_PAGES = [
  { labelAr: 'لوحة التحكم', labelEn: 'Dashboard', path: '/Hr', icon: LayoutDashboard },
  { labelAr: 'الموظفون', labelEn: 'Employees', path: '/Hr/employees', icon: Users },
  { labelAr: 'التوظيف', labelEn: 'Recruitment', path: '/Hr/Recruitment', icon: Briefcase },
  { labelAr: 'الحضور', labelEn: 'Attendance', path: '/Hr/attendance', icon: Clock },
  { labelAr: 'الرواتب', labelEn: 'Payroll', path: '/Hr/Payroll', icon: CheckSquare },
];

const ADMIN_PAGES = [
  { labelAr: 'لوحة التحكم', labelEn: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { labelAr: 'الإعدادات', labelEn: 'Settings', path: '/admin/setting', icon: CheckSquare },
  { labelAr: 'التقارير', labelEn: 'Reports', path: '/admin/report', icon: BarChart2 },
];

const EMPLOYEE_PAGES = [
  { labelAr: 'لوحة التحكم', labelEn: 'Dashboard', path: '/employee', icon: LayoutDashboard },
  { labelAr: 'الحضور', labelEn: 'Attendance', path: '/employee/attendance', icon: Clock },
  { labelAr: 'المهام', labelEn: 'Tasks', path: '/employee/tasks', icon: CheckSquare },
];

export default function Topbar({
  title,
  onToggleSidebar,
  user = { avatar: 'M', name: 'Mohamed Ahmed', role: '' },
}: TopbarProps) {
  const { lang, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Determine active pages based on current route prefix
  const getActivePages = () => {
    if (location.pathname.startsWith('/admin')) return ADMIN_PAGES;
    if (location.pathname.startsWith('/Hr')) return HR_PAGES;
    if (location.pathname.startsWith('/employee')) return EMPLOYEE_PAGES;
    return MANAGER_PAGES;
  };

  const activePages = getActivePages();

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeSearch(); setProfileOpen(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
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
    ? activePages.filter(p =>
      p.labelAr.includes(query) ||
      p.labelEn.toLowerCase().includes(q)
    )
    : activePages;

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

          {/* Notification Dropdown */}
          <NotificationDropdown />

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
                    onClick={() => { navigate(`/${location.pathname.split('/')[1]}/profile`); setProfileOpen(false); }}
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
