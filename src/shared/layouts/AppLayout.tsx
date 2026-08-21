import { useCallback, useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import type { NavItem } from '../components/SideBar';
import Sidebar from '../components/SideBar';
import Topbar from '../components/Topbar';
import { useLanguage } from '../../i18n/translations/LanguageContext';
import { useAuthStore } from '../../store/authStore';

interface AppLayoutProps {
  navItems: NavItem[];
  pageTitles: Record<string, string>;
  brand?: { logo?: string; title?: string; subtitle?: string };
  user?: { avatar: string; name: string; role: string };
  navSectionLabel?: string;
  defaultTitle?: string;
}

export default function AppLayout({
  navItems,
  pageTitles,
  brand,
  user,
  navSectionLabel,
  defaultTitle = 'لوحة التحكم',
}: AppLayoutProps) {
  const location = useLocation();
  const { dir } = useLanguage();
  const currentUser = useAuthStore(state => state.currentUser);
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' && window.innerWidth > 1024);

  // Close sidebar automatically on route change on mobile
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const userName = currentUser?.name || currentUser?.full_name || currentUser?.user_name || 'User';
  const activeUser = currentUser ? {
    avatar: userName.charAt(0).toUpperCase(),
    name: userName,
    role: currentUser.role || currentUser.job_title || ''
  } : user;

  const toggleSidebar = useCallback(() => setSidebarOpen(open => !open), []);

  const basePath = '/' + location.pathname.split('/').slice(1, 3).join('/');
  const title =
    pageTitles[location.pathname] ||
    pageTitles[basePath] ||
    defaultTitle;

  return (
    <div className="flex h-screen bg-transparent w-full overflow-hidden" dir={dir}>
      <Sidebar
        open={sidebarOpen}
        onToggle={toggleSidebar}
        navItems={navItems}
        brand={brand}
        user={activeUser}
        navSectionLabel={navSectionLabel}
      />
      <div className={`flex flex-col flex-1 h-screen w-full transition-all duration-300 ${sidebarOpen ? 'md:ms-64' : 'md:ms-16'}`}>
        <Topbar title={title} onToggleSidebar={toggleSidebar} user={activeUser} navItems={navItems} />
        <main className="flex-1 p-3 sm:p-5 md:p-6 pb-16 overflow-x-hidden overflow-y-auto w-full relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
