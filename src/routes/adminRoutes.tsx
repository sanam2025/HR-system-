import React from 'react';
import { SuspenseWrapper } from './SuspenseWrapper';
import AdminLayout from "../shared/layouts/AdminLayout";

// ── Admin pages (new AdminBranch structure) ──
const DashboardAdmin = React.lazy(() => import('@/core/modules/admin/pages/Dashboard/Dashboard'));
const SystemSettings = React.lazy(() => import('@/core/modules/admin/pages/settings/SystemSettings'));
const AdminAnnouncements = React.lazy(() => import('@/core/modules/admin/pages/Announcements/Announcements'));
const OrganizationlStructure = React.lazy(() => import('@/core/modules/admin/pages/Organization/OrganizationlStructure'));
const EmployeeSearch = React.lazy(() => import('@/core/modules/admin/pages/Employees/EmployeeSearch'));
const AdminHolidays = React.lazy(() => import('@/core/modules/admin/pages/Holidays/Holidays'));
const Overview = React.lazy(() => import('@/core/modules/admin/pages/Overview/Overview'));
const AdminTerminations = React.lazy(() => import('@/core/modules/admin/pages/Terminations/Termination'));
const MyProfile = React.lazy(() => import('@/core/modules/employee/pages/EmployeeProfile'));

export const adminRoutes = {
  path: '/admin',
  element: <AdminLayout />,
  children: [
    { index: true, element: <SuspenseWrapper><DashboardAdmin /></SuspenseWrapper> },
    { path: 'profile', element: <SuspenseWrapper><MyProfile /></SuspenseWrapper> },
    { path: 'setting', element: <SuspenseWrapper><SystemSettings /></SuspenseWrapper> },
    { path: 'announcement', element: <SuspenseWrapper><AdminAnnouncements /></SuspenseWrapper> },
    { path: 'organization', element: <SuspenseWrapper><OrganizationlStructure /></SuspenseWrapper> },
    { path: 'search', element: <SuspenseWrapper><EmployeeSearch /></SuspenseWrapper> },
    { path: 'holidays', element: <SuspenseWrapper><AdminHolidays /></SuspenseWrapper> },
    // ── New routes from AdminBranch ──
    { path: 'Overview', element: <SuspenseWrapper><Overview /></SuspenseWrapper> },
    { path: 'termination', element: <SuspenseWrapper><AdminTerminations /></SuspenseWrapper> },
  ]
};
