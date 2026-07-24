import React from 'react';
import { SuspenseWrapper } from './SuspenseWrapper';
import AdminLayout from "../shared/layouts/AdminLayout";

const DashboardAdmin = React.lazy(() => import('@/core/modules/admin/pages/Dashboard'));
const SystemSettings = React.lazy(() => import('@/core/modules/admin/pages/SystemSettings'));
const AdminAnnouncements = React.lazy(() => import('@/core/modules/admin/pages/Announcements'));
const OrganizationlStructure = React.lazy(() => import('@/core/modules/admin/pages/OrganizationlStructure'));
const Reports = React.lazy(() => import('@/core/modules/admin/pages/Reports'));
const EmployeeSearch = React.lazy(() => import('@/core/modules/admin/pages/EmployeeSearch'));

export const adminRoutes = {
  path: '/admin',
  element: <AdminLayout />,
  children: [
    { index: true, element: <SuspenseWrapper><DashboardAdmin /></SuspenseWrapper> },
    { path: 'setting', element: <SuspenseWrapper><SystemSettings /></SuspenseWrapper> },
    { path: 'announcement', element: <SuspenseWrapper><AdminAnnouncements /></SuspenseWrapper> },
    { path: 'organization', element: <SuspenseWrapper><OrganizationlStructure /></SuspenseWrapper> },
    { path: 'report', element: <SuspenseWrapper><Reports /></SuspenseWrapper> },
    { path: 'search', element: <SuspenseWrapper><EmployeeSearch /></SuspenseWrapper> }
  ]
};
