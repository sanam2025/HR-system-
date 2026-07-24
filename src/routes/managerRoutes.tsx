import React from 'react';
import { SuspenseWrapper } from './SuspenseWrapper';
import ManagerLayout from "../shared/layouts/ManagerLayout";

const Dashboard = React.lazy(() => import('@/core/modules/HR/pages/Dashboard'));
const EmployeesList = React.lazy(() => import('@/core/pages/manager/components/EmployeesList'));
const EmployeeProfile = React.lazy(() => import('@/core/pages/manager/components/EmployeeProfile'));
const TasksBoard = React.lazy(() => import('@/core/pages/Tasks/TasksBoard'));
const LeaveRequests = React.lazy(() => import('@/core/pages/Leaves/LeaveRequests'));
const OvertimeRequests = React.lazy(() => import('@/core/pages/Leaves/OvertimeRequests'));
const AttendanceView = React.lazy(() => import('@/core/pages/Attendance/AttendanceView'));
const PeriodicEvaluation = React.lazy(() => import('@/core/pages/Evaluation/PeriodicEvaluation'));
const Recruitment = React.lazy(() => import('@/core/modules/HR/pages/Recruitment/Recruitment'));

export const managerRoutes = {
  path: '/manager',
  element: <ManagerLayout />,
  children: [
    { index: true, element: <SuspenseWrapper><Dashboard /></SuspenseWrapper> },
    { path: 'employees', element: <SuspenseWrapper><EmployeesList /></SuspenseWrapper> },
    { path: 'employees/:id', element: <SuspenseWrapper><EmployeeProfile /></SuspenseWrapper> },
    { path: 'tasks', element: <SuspenseWrapper><TasksBoard /></SuspenseWrapper> },
    { path: 'leaves', element: <SuspenseWrapper><LeaveRequests /></SuspenseWrapper> },
    { path: 'overtime', element: <SuspenseWrapper><OvertimeRequests /></SuspenseWrapper> },
    { path: 'attendance', element: <SuspenseWrapper><AttendanceView /></SuspenseWrapper> },
    { path: 'evaluation', element: <SuspenseWrapper><PeriodicEvaluation /></SuspenseWrapper> },
    { path: 'recruitment', element: <SuspenseWrapper><Recruitment /></SuspenseWrapper> },
  ],
};
