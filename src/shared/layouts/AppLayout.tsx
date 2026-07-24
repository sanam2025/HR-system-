import { useCallback, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import type { NavItem } from '../components/SideBar';
import Sidebar from '../components/SideBar';
import Topbar from '../components/Topbar';
import { useTranslation } from 'react-i18next';
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
  const { i18n, t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768);

  const toggleSidebar = useCallback(() => setSidebarOpen(open => !open), []);

  const basePath = '/' + location.pathname.split('/').slice(1, 3).join('/');
  const title =
    pageTitles[location.pathname] ||
    pageTitles[basePath] ||
    t('dashboard');

  return (
    <div className="flex min-h-screen bg-surface" dir={i18n.dir()}>
      <Sidebar
        open={sidebarOpen}
        onToggle={toggleSidebar}
        navItems={navItems}
        brand={brand}
        user={displayUser}
        navSectionLabel={navSectionLabel}
      />
      <div className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ${sidebarOpen ? 'md:ms-64' : 'md:ms-16'}`}>
        <Topbar title={title} onToggleSidebar={toggleSidebar} />
        <main className="flex-1 p-6 pb-16 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
