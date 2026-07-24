const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const routesDir = path.join(srcDir, 'routes');
const appRouterPath = path.join(srcDir, 'AppRouter.tsx');

const hrRoutesContent = `import React from 'react';
import { SuspenseWrapper } from './SuspenseWrapper';
import HRLayout from "../shared/layouts/HRLayout";

const Dashboard = React.lazy(() => import('@/core/modules/HR/pages/Dashboard'));
const Employees = React.lazy(() => import('@/core/modules/HR/pages/Employees'));
const Recruitment = React.lazy(() => import('@/core/modules/HR/pages/Recruitment/Recruitment'));
const Payroll = React.lazy(() => import('@/core/modules/HR/pages/Payroll'));
const AcceptedCandidates = React.lazy(() => import('@/core/modules/HR/pages/AcceptedCandidates'));
const Terminations = React.lazy(() => import('@/core/modules/HR/pages/Terminations'));
const Resignations = React.lazy(() => import('@/core/modules/HR/pages/Resignations'));
const Contracts = React.lazy(() => import('@/core/modules/HR/pages/Contracts'));
const JobPostingForm = React.lazy(() => import('@/core/modules/HR/pages/JobPostings/JobPostingForm'));
const JobPostingDetail = React.lazy(() => import('@/core/modules/HR/pages/JobPostings/JobPostingDetail'));
const JobPostings = React.lazy(() => import('@/core/modules/HR/pages/JobPostings/JobPostings'));
const ApplicantDetail = React.lazy(() => import('@/core/modules/HR/pages/ApplicantDetail'));
const AllApplicants = React.lazy(() => import('@/core/modules/HR/pages/AllApplicants/AllApplicants').then(module => ({ default: module.AllApplicants })));
const ScheduleInterview = React.lazy(() => import('@/core/modules/HR/pages/Interviews/ScheduleInterview'));
const Interviews = React.lazy(() => import('@/core/modules/HR/pages/Interviews/Interviews'));
const Attendance = React.lazy(() => import('@/core/modules/HR/pages/Attendance/Attendance'));
const Leaves = React.lazy(() => import('@/core/modules/HR/pages/Leaves/Leaves'));
const LeaveDetail = React.lazy(() => import('@/core/modules/HR/pages/Leaves/LeaveDetail').then(module => ({ default: module.LeaveDetail })));
const HourlyLeaveDetail = React.lazy(() => import('@/core/modules/HR/pages/HourlyLeaves/HourlyLeaveDetail').then(module => ({ default: module.HourlyLeaveDetail })));
const HourlyLeaves = React.lazy(() => import('@/core/modules/HR/pages/HourlyLeaves/HourlyLeaves').then(module => ({ default: module.HourlyLeaves })));
const SendOffer = React.lazy(() => import('@/core/modules/HR/pages/Offers/SendOffer').then(module => ({ default: module.SendOffer })));
const Offers = React.lazy(() => import('@/core/modules/HR/pages/Offers/Offers').then(module => ({ default: module.Offers })));
const JobRequisitionDetail = React.lazy(() => import('@/core/modules/HR/pages/Recruitment/JobRequisitionDetail'));
const Announcements = React.lazy(() => import('@/core/modules/HR/pages/Announcements/Announcements'));
const Complaints = React.lazy(() => import('@/core/modules/HR/pages/Complaints/Complaints'));
const ComplaintDetail = React.lazy(() => import('@/core/modules/HR/pages/Complaints/ComplaintDetail'));
const EmployeeProfileHR = React.lazy(() => import('@/core/modules/HR/pages/EmployeeProfile'));
const DepartmentDetail = React.lazy(() => import('@/core/modules/HR/pages/DepartmentDetail'));

export const hrRoutes = {
  path: "/Hr",
  element: <HRLayout />,
  children: [
    { index: true, element: <SuspenseWrapper><Dashboard /></SuspenseWrapper> },
    { path: "employees", element: <SuspenseWrapper><Employees /></SuspenseWrapper> },
    { path: "Recruitment", element: <SuspenseWrapper><Recruitment /></SuspenseWrapper> },
    { path: "recruitment/:id", element: <SuspenseWrapper><JobRequisitionDetail /></SuspenseWrapper> },
    { path: "payroll", element: <SuspenseWrapper><Payroll /></SuspenseWrapper> },
    { path: "accepted-candidates", element: <SuspenseWrapper><AcceptedCandidates /></SuspenseWrapper> },
    { path: "terminations", element: <SuspenseWrapper><Terminations /></SuspenseWrapper> },
    { path: "resignations", element: <SuspenseWrapper><Resignations /></SuspenseWrapper> },
    { path: "contracts", element: <SuspenseWrapper><Contracts /></SuspenseWrapper> },
    { path: "job-postings", element: <SuspenseWrapper><JobPostings /></SuspenseWrapper> },
    { path: "job-postings/:id", element: <SuspenseWrapper><JobPostingDetail /></SuspenseWrapper> },
    { path: "job-postings/edit/:id", element: <SuspenseWrapper><JobPostingForm /></SuspenseWrapper> },
    { path: "all-applicants", element: <SuspenseWrapper><AllApplicants /></SuspenseWrapper> },
    { path: "recruitment/applicants/:jobId", element: <SuspenseWrapper><AllApplicants /></SuspenseWrapper> },
    { path: "attendance", element: <SuspenseWrapper><Attendance /></SuspenseWrapper> },
    { path: "Leaves", element: <SuspenseWrapper><Leaves /></SuspenseWrapper> },
    { path: "Leaves/:id", element: <SuspenseWrapper><LeaveDetail /></SuspenseWrapper> },
    { path: "recruitment/applicant/:id", element: <SuspenseWrapper><ApplicantDetail /></SuspenseWrapper> },
    { path: "job-postings/:jobId/interviews", element: <SuspenseWrapper><Interviews /></SuspenseWrapper> },
    { path: "job-postings/:jobId/interviews/schedule", element: <SuspenseWrapper><ScheduleInterview /></SuspenseWrapper> },
    { path: "interviews/:id", element: <div>Interview Details - Coming Soon</div> },
    { path: "hourly-leaves", element: <SuspenseWrapper><HourlyLeaves /></SuspenseWrapper> },
    { path: "hourly-leaves/:id", element: <SuspenseWrapper><HourlyLeaveDetail /></SuspenseWrapper> },
    { path: "job-postings/:jobId/offers", element: <SuspenseWrapper><Offers /></SuspenseWrapper> },
    { path: "job-postings/:jobId/offers/send", element: <SuspenseWrapper><SendOffer /></SuspenseWrapper> },
    { path: "announcements", element: <SuspenseWrapper><Announcements /></SuspenseWrapper> },
    { path: "complaints", element: <SuspenseWrapper><Complaints /></SuspenseWrapper> },
    { path: "complaints/:id", element: <SuspenseWrapper><ComplaintDetail /></SuspenseWrapper> },
    { path: "employee/:id", element: <SuspenseWrapper><EmployeeProfileHR /></SuspenseWrapper> },
    { path: "department/:id", element: <SuspenseWrapper><DepartmentDetail /></SuspenseWrapper> },
  ],
};
`;

const managerRoutesContent = `import React from 'react';
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
`;

const employeeRoutesContent = `import React from 'react';
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
`;

const adminRoutesContent = `import React from 'react';
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
`;

const suspenseWrapperContent = `import React, { Suspense } from 'react';

export const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="flex items-center justify-center h-48"><p className="text-xl font-semibold text-gray-500">Loading...</p></div>}>
    {children}
  </Suspense>
);
`;

const newAppRouterContent = `// src/AppRouter.tsx
import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { SuspenseWrapper } from './routes/SuspenseWrapper';
import { hrRoutes } from './routes/hrRoutes';
import { managerRoutes } from './routes/managerRoutes';
import { employeeRoutes } from './routes/employeeRoutes';
import { adminRoutes } from './routes/adminRoutes';

const PublicJobsPage = React.lazy(() => import('@/core/pages/PublicJobs/PublicJobsPage'));

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/Hr" replace />
  },
  hrRoutes,
  {
    path: '/careers',
    element: <SuspenseWrapper><PublicJobsPage /></SuspenseWrapper>,
  },
  managerRoutes,
  employeeRoutes,
  adminRoutes,
]);

export default function AppRouter() {
  return <RouterProvider router={appRouter} />;
}
`;

fs.writeFileSync(path.join(routesDir, 'SuspenseWrapper.tsx'), suspenseWrapperContent);
fs.writeFileSync(path.join(routesDir, 'hrRoutes.tsx'), hrRoutesContent);
fs.writeFileSync(path.join(routesDir, 'managerRoutes.tsx'), managerRoutesContent);
fs.writeFileSync(path.join(routesDir, 'employeeRoutes.tsx'), employeeRoutesContent);
fs.writeFileSync(path.join(routesDir, 'adminRoutes.tsx'), adminRoutesContent);
fs.writeFileSync(appRouterPath, newAppRouterContent);

console.log('Routes refactored successfully.');
