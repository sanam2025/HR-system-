import React from 'react';
import { SuspenseWrapper } from './SuspenseWrapper';
import EmployeeLayout from "../shared/layouts/EmployeeLayout";
import { ProtectedRoute } from './ProtectedRoute';

const EmployeeDashboard = React.lazy(() => import('@/core/modules/employee/pages/EmployeeDashboard'));
const EmployeeProfile = React.lazy(() => import('@/core/modules/employee/pages/EmployeeProfile'));
const EmployeeTasks = React.lazy(() => import('@/core/modules/employee/pages/EmployeeTasks'));
const EmployeeFinance = React.lazy(() => import('@/core/modules/employee/pages/EmployeeFinance'));
const EmployeeAttendance = React.lazy(() => import('@/core/modules/employee/pages/EmployeeAttendance'));
const EmployeeComplaints = React.lazy(() => import('@/core/modules/employee/pages/EmployeeComplaints'));
const EmployeeResignation = React.lazy(() => import('@/core/modules/employee/pages/EmployeeResignation'));

export const employeeRoutes = {
  path: "/employee",
  element: (
    <ProtectedRoute allowedRoles={['employee']}>
      <EmployeeLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <SuspenseWrapper><EmployeeDashboard /></SuspenseWrapper> },
    { path: "profile", element: <SuspenseWrapper><EmployeeProfile /></SuspenseWrapper> },
    { path: "tasks", element: <SuspenseWrapper><EmployeeTasks /></SuspenseWrapper> },
    { path: "finance", element: <SuspenseWrapper><EmployeeFinance /></SuspenseWrapper> },
    { path: "attendance", element: <SuspenseWrapper><EmployeeAttendance /></SuspenseWrapper> },
    { path: "complaints", element: <SuspenseWrapper><EmployeeComplaints /></SuspenseWrapper> },
    { path: "resignation", element: <SuspenseWrapper><EmployeeResignation /></SuspenseWrapper> },
  ],
};
