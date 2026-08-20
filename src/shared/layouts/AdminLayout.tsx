import { useTranslation } from 'react-i18next';
import AppLayout from "./AppLayout";
import { LayoutDashboard, Settings, Megaphone, FolderTree, BarChart, Search, CalendarDays, UserX } from 'lucide-react';

function AdminLayout() {
  const { t } = useTranslation()

  const adminSideBar = [
    { path: '/admin', label: t('dashboard'), icon: LayoutDashboard, exact: true },
    { path: '/admin/setting', label: t('settings'), icon: Settings, exact: false },
    { path: '/admin/announcement', label: t('announcements'), icon: Megaphone, exact: false },
    { path: '/admin/organization', label: t('organizationStructure'), icon: FolderTree, exact: false },
    { path: '/admin/report', label: t('reports'), icon: BarChart, exact: false },
    { path: '/admin/search', label: t('employeeSearch'), icon: Search, exact: false },
    { path: '/admin/holidays', label: t('holidays') || 'Holidays', icon: CalendarDays, exact: false },
    { path: '/admin/termination', label: t('termination') || 'Terminations', icon: UserX, exact: false },
  ];

  const adminPageTitles: Record<string, string> = {
    '/admin': t('dashboard'),
    '/admin/setting': t('settings'),
    '/admin/announcement': t('announcements'),
    '/admin/organization': t('organizationStructure'),
    '/admin/report': t('reports'),
    '/admin/search': t('employeeSearch'),
    '/admin/holidays': t('holidays') || 'Holidays',
    '/admin/termination': t('termination') || 'Terminations',
  };

  return (
    <AppLayout
      navItems={adminSideBar}
      pageTitles={adminPageTitles}
      brand={{
        title: t('adminPortal') || "Admin Portal",
        subtitle: t('administration') || 'Administration'
      }}
      navSectionLabel={t('adminMenu') || 'Admin Menu'}
    />
  );
}

export default AdminLayout;