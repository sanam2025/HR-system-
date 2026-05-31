import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import type { NavItem } from '../components/SideBar';
import Sidebar from '../components/SideBar';
import Topbar from '../components/Topbar';

// ── Types ───
interface AppLayoutProps {
  navItems: NavItem[];
  pageTitles: Record<string, string>;
  brand?: { logo?: string; title?: string; subtitle?: string };
  user?: { avatar: string; name: string; role: string };
  navSectionLabel?: string;
  defaultTitle?: string;
}

// ── Component ──
export default function AppLayout({
  navItems,
  pageTitles,
  brand,
  user,
  navSectionLabel,
  defaultTitle = 'لوحة التحكم',
}: AppLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const basePath = '/' + location.pathname.split('/').slice(1, 3).join('/');
  const title =
    pageTitles[location.pathname] ||
    pageTitles[basePath] ||
    defaultTitle;

  return (
    <div className="flex min-h-screen bg-surface" dir="rtl">
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(v => !v)}
        navItems={navItems}
        brand={brand}
        user={user}
        navSectionLabel={navSectionLabel}
      />
      <div
        className="flex flex-col flex-1 min-h-screen transition-all duration-300"
        style={{ marginRight: sidebarOpen ? 256 : 64 }}
      >
        <Topbar
          title={title}
          onToggleSidebar={() => setSidebarOpen(v => !v)}
        />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
