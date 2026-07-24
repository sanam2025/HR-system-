import React from 'react';
import { SuspenseWrapper } from './SuspenseWrapper';
import EmployeeLayout from "../shared/layouts/EmployeeLayout";

const EmployeeDashboard = React.lazy(() => import('@/core/modules/employee/pages/EmployeeDashboard'));
const EmployeeProfile_E = React.lazy(() => import('@/core/modules/employee/pages/EmployeeProfile'));
const EmployeeTasksFinance = React.lazy(() => import('@/core/modules/employee/pages/EmployeeTasksFinance'));
const EmployeeAttendance = React.lazy(() => import('@/core/modules/employee/pages/EmployeeAttendance'));

export const employeeRoutes = {
  path: "/employee",
  element: <EmployeeLayout />,
  children: [
    { index: true, element: <SuspenseWrapper><EmployeeDashboard /></SuspenseWrapper> },
    { path: "profile", element: <SuspenseWrapper><EmployeeProfile_E /></SuspenseWrapper> },
    { path: "tasks", element: <SuspenseWrapper><EmployeeTasksFinance /></SuspenseWrapper> },
    { path: "finance", element: <SuspenseWrapper><EmployeeTasksFinance /></SuspenseWrapper> },
    { path: "attendance", element: <SuspenseWrapper><EmployeeAttendance /></SuspenseWrapper> },
  ],
};
