import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './SideBar';
import Topbar from './Topbar';

// ── عناوين الصفحات ──
const pageTitles: Record<string, string> = {
  '/manager':             'لوحة التحكم',
  '/manager/employees':   'الموظفون',
  '/manager/tasks':       'المهام',
  '/manager/leaves':      'الإجازات',
  '/manager/overtime':    'العمل الإضافي',
  '/manager/attendance':  'الحضور',
  '/manager/evaluation':  'التقييم الدوري',
  '/manager/recruitment': 'التوظيف',
};

export default function ManagerLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const basePath = '/' + location.pathname.split('/').slice(1, 3).join('/');
  const title = pageTitles[location.pathname] || pageTitles[basePath] || 'لوحة التحكم';

  const sidebarWidth = sidebarOpen ? 256 : 64;

  return (
    <div className="flex min-h-screen bg-surface" dir="rtl">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(v => !v)} />
      <div
        className="flex flex-col flex-1 min-h-screen transition-all duration-300"
        style={{ marginRight: sidebarWidth }}
      >
        <Topbar title={title} onToggleSidebar={() => setSidebarOpen(v => !v)} />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
