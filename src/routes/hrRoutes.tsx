import React from 'react';
import { SuspenseWrapper } from './SuspenseWrapper';
import HRLayout from "../shared/layouts/HRLayout";
import { ProtectedRoute } from './ProtectedRoute';

const Dashboard = React.lazy(() => import('@/core/modules/HR/pages/Dashboard'));
const Recruitment = React.lazy(() => import('@/core/modules/HR/pages/Recruitment/Recruitment'));
const Payroll = React.lazy(() => import('@/core/modules/HR/pages/Payroll'));
const AcceptedCandidates = React.lazy(() => import('@/core/modules/HR/pages/AcceptedCandidates'));
const Terminations = React.lazy(() => import('@/core/modules/HR/pages/Terminations'));
const Resignations = React.lazy(() => import('@/core/modules/HR/pages/Resignations/Resignations'));
const ResignationDetail = React.lazy(() => import('@/core/modules/HR/pages/Resignations/ResignationDetail'));
const Contracts = React.lazy(() => import('@/core/modules/HR/pages/Contracts/Contracts'));
const ContractDetail = React.lazy(() => import('@/core/modules/HR/pages/Contracts/ContractDetail'));
const JobPostingForm = React.lazy(() => import('@/core/modules/HR/pages/JobPostings/JobPostingForm'));
const JobPostingDetail = React.lazy(() => import('@/core/modules/HR/pages/JobPostings/JobPostingDetail'));
const JobPostings = React.lazy(() => import('@/core/modules/HR/pages/JobPostings/JobPostings'));
const ApplicantDetail = React.lazy(() => import('@/core/modules/HR/pages/ApplicantDetail'));
const AllApplicants = React.lazy(() => import('@/core/modules/HR/pages/AllApplicants/AllApplicants').then(module => ({ default: module.AllApplicants })));
const ScheduleInterview = React.lazy(() => import('@/core/modules/HR/pages/Interviews/ScheduleInterview'));
const Interviews = React.lazy(() => import('@/core/modules/HR/pages/Interviews/Interviews'));
const SendOffer = React.lazy(() => import('@/core/modules/HR/pages/Offers/SendOffer').then(module => ({ default: module.SendOffer })));
const Offers = React.lazy(() => import('@/core/modules/HR/pages/Offers/Offers').then(module => ({ default: module.Offers })));
const JobRequisitionDetail = React.lazy(() => import('@/core/modules/HR/pages/Recruitment/JobRequisitionDetail'));
const Announcements = React.lazy(() => import('@/core/pages/Announcements/ManagerAnnouncements'));
const Complaints = React.lazy(() => import('@/core/modules/HR/pages/Complaints/Complaints'));
const ComplaintDetail = React.lazy(() => import('@/core/modules/HR/pages/Complaints/ComplaintDetail'));
const EmployeeProfileHR = React.lazy(() => import('@/core/modules/HR/pages/EmployeeProfile'));
const DepartmentDetail = React.lazy(() => import('@/core/modules/HR/pages/DepartmentDetail'));
const PerformanceDetail = React.lazy(() => import('@/core/modules/HR/pages/Performance/PerformanceDetail'));
const OvertimeDetail = React.lazy(() => import('@/core/modules/HR/pages/Overtime/OvertimeDetail'));
const LeaveDetail = React.lazy(() => import('@/core/modules/HR/pages/Leaves/LeaveDetail').then(module => ({ default: module.LeaveDetail })));
const HourlyLeaveDetail = React.lazy(() => import('@/core/modules/HR/pages/HourlyLeaves/HourlyLeaveDetail').then(module => ({ default: module.HourlyLeaveDetail })));
const UnifiedEmployeeProfile = React.lazy(() => import('@/core/pages/manager/components/EmployeeProfile'));

// === المكوّنات المشتركة مع Manager/Admin (نفس الكود - ربط حقيقي) ===
const LeaveRequests = React.lazy(() => import('@/core/pages/Leaves/LeaveRequests'));
const OvertimeRequests = React.lazy(() => import('@/core/pages/Leaves/OvertimeRequests'));
const AttendanceView = React.lazy(() => import('@/core/pages/Attendance/AttendanceView'));
const PeriodicEvaluation = React.lazy(() => import('@/core/pages/Evaluation/PeriodicEvaluation'));
const TasksBoard = React.lazy(() => import('@/core/pages/Tasks/TasksBoard'));

export const hrRoutes = {
  path: "/Hr",
  element: (
    <ProtectedRoute allowedRoles={['hr']}>
      <HRLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <SuspenseWrapper><Dashboard /></SuspenseWrapper> },
    { path: "profile", element: <SuspenseWrapper><UnifiedEmployeeProfile /></SuspenseWrapper> },
    { path: "Recruitment", element: <SuspenseWrapper><Recruitment /></SuspenseWrapper> },
    { path: "recruitment/:id", element: <SuspenseWrapper><JobRequisitionDetail /></SuspenseWrapper> },
    { path: "payroll", element: <SuspenseWrapper><Payroll /></SuspenseWrapper> },
    { path: "accepted-candidates", element: <SuspenseWrapper><AcceptedCandidates /></SuspenseWrapper> },
    { path: "terminations", element: <SuspenseWrapper><Terminations /></SuspenseWrapper> },
    { path: "resignations", element: <SuspenseWrapper><Resignations /></SuspenseWrapper> },
    { path: "resignations/:id", element: <SuspenseWrapper><ResignationDetail /></SuspenseWrapper> },
    { path: "contracts", element: <SuspenseWrapper><Contracts /></SuspenseWrapper> },
    { path: "contracts/:id", element: <SuspenseWrapper><ContractDetail /></SuspenseWrapper> },
    { path: "job-postings", element: <SuspenseWrapper><JobPostings /></SuspenseWrapper> },
    { path: "job-postings/:id", element: <SuspenseWrapper><JobPostingDetail /></SuspenseWrapper> },
    { path: "job-postings/edit/:id", element: <SuspenseWrapper><JobPostingForm /></SuspenseWrapper> },
    { path: "all-applicants", element: <SuspenseWrapper><AllApplicants /></SuspenseWrapper> },
    { path: "recruitment/applicants/:jobId", element: <SuspenseWrapper><AllApplicants /></SuspenseWrapper> },
    { path: "recruitment/applicant/:id", element: <SuspenseWrapper><ApplicantDetail /></SuspenseWrapper> },

    // === الإجازات — نفس مكوّن المدير الكامل ===
    { path: "Leaves", element: <SuspenseWrapper><LeaveRequests /></SuspenseWrapper> },
    { path: "Leaves/:id", element: <SuspenseWrapper><LeaveDetail /></SuspenseWrapper> },
    { path: "hourly-leaves", element: <SuspenseWrapper><LeaveRequests /></SuspenseWrapper> },
    { path: "hourly-leaves/:id", element: <SuspenseWrapper><HourlyLeaveDetail /></SuspenseWrapper> },

    // === الأوفرتايم — نفس مكوّن المدير الكامل ===
    { path: "overtime", element: <SuspenseWrapper><OvertimeRequests /></SuspenseWrapper> },
    { path: "overtime/:id", element: <SuspenseWrapper><OvertimeDetail /></SuspenseWrapper> },

    // === الحضور — نفس مكوّن المدير الكامل ===
    { path: "attendance", element: <SuspenseWrapper><AttendanceView /></SuspenseWrapper> },

    // === الأداء — نفس مكوّن المدير الكامل ===
    { path: "performance", element: <SuspenseWrapper><PeriodicEvaluation /></SuspenseWrapper> },
    { path: "performance/:id", element: <SuspenseWrapper><PerformanceDetail /></SuspenseWrapper> },

    // === المهام — نفس مكوّن المدير ===
    { path: "tasks", element: <SuspenseWrapper><TasksBoard /></SuspenseWrapper> },

    // === التوظيف والمقابلات ===
    { path: "job-postings/:jobId/interviews", element: <SuspenseWrapper><Interviews /></SuspenseWrapper> },
    { path: "job-postings/:jobId/interviews/schedule", element: <SuspenseWrapper><ScheduleInterview /></SuspenseWrapper> },
    { path: "interviews/:id", element: <div>Interview Details - Coming Soon</div> },

    // === العروض ===
    { path: "offers", element: <SuspenseWrapper><Offers /></SuspenseWrapper> },
    { path: "job-postings/:jobId/offers", element: <SuspenseWrapper><Offers /></SuspenseWrapper> },
    { path: "job-postings/:jobId/offers/send", element: <SuspenseWrapper><SendOffer /></SuspenseWrapper> },

    // === الإعلانات والشكاوى ===
    { path: "announcements", element: <SuspenseWrapper><Announcements /></SuspenseWrapper> },
    { path: "complaints", element: <SuspenseWrapper><Complaints /></SuspenseWrapper> },
    { path: "complaints/:id", element: <SuspenseWrapper><ComplaintDetail /></SuspenseWrapper> },

    // === الموظفون ===
    { path: "employee/:id", element: <SuspenseWrapper><UnifiedEmployeeProfile /></SuspenseWrapper> },
    { path: "employees/:id", element: <SuspenseWrapper><UnifiedEmployeeProfile /></SuspenseWrapper> },
    { path: "department/:id", element: <SuspenseWrapper><DepartmentDetail /></SuspenseWrapper> },
  ],
};
