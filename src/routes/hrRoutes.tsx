import React from 'react';
import { SuspenseWrapper } from './SuspenseWrapper';
import HRLayout from "../shared/layouts/HRLayout";

const Dashboard = React.lazy(() => import('@/core/modules/HR/pages/Dashboard'));
const Employees = React.lazy(() => import('@/core/modules/HR/pages/Employees'));
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
const Attendance = React.lazy(() => import('@/core/modules/HR/pages/Attendance/Attendance'));
const Overtime = React.lazy(() => import('@/core/modules/HR/pages/Overtime/Overtime'));
const OvertimeDetail = React.lazy(() => import('@/core/modules/HR/pages/Overtime/OvertimeDetail'));
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
const Performance = React.lazy(() => import('@/core/modules/HR/pages/Performance/Performance'));
const PerformanceDetail = React.lazy(() => import('@/core/modules/HR/pages/Performance/PerformanceDetail'));
const MyProfile = React.lazy(() => import('@/core/modules/employee/pages/EmployeeProfile'));

export const hrRoutes = {
  path: "/Hr",
  element: <HRLayout />,
  children: [
    { index: true, element: <SuspenseWrapper><Dashboard /></SuspenseWrapper> },
    { path: "profile", element: <SuspenseWrapper><MyProfile /></SuspenseWrapper> },
    { path: "employees", element: <SuspenseWrapper><Employees /></SuspenseWrapper> },
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
    { path: "attendance", element: <SuspenseWrapper><Attendance /></SuspenseWrapper> },
    { path: "overtime", element: <SuspenseWrapper><Overtime /></SuspenseWrapper> },
    { path: "Leaves", element: <SuspenseWrapper><Leaves /></SuspenseWrapper> },
    { path: "Leaves/:id", element: <SuspenseWrapper><LeaveDetail /></SuspenseWrapper> },
    { path: "recruitment/applicant/:id", element: <SuspenseWrapper><ApplicantDetail /></SuspenseWrapper> },
    { path: "job-postings/:jobId/interviews", element: <SuspenseWrapper><Interviews /></SuspenseWrapper> },
    { path: "job-postings/:jobId/interviews/schedule", element: <SuspenseWrapper><ScheduleInterview /></SuspenseWrapper> },
    { path: "interviews/:id", element: <div>Interview Details - Coming Soon</div> },
    { path: "hourly-leaves", element: <SuspenseWrapper><HourlyLeaves /></SuspenseWrapper> },
    { path: "hourly-leaves/:id", element: <SuspenseWrapper><HourlyLeaveDetail /></SuspenseWrapper> },
    { path: "offers", element: <SuspenseWrapper><Offers /></SuspenseWrapper> },
    { path: "job-postings/:jobId/offers", element: <SuspenseWrapper><Offers /></SuspenseWrapper> },
    { path: "job-postings/:jobId/offers/send", element: <SuspenseWrapper><SendOffer /></SuspenseWrapper> },
    { path: "announcements", element: <SuspenseWrapper><Announcements /></SuspenseWrapper> },
    { path: "complaints", element: <SuspenseWrapper><Complaints /></SuspenseWrapper> },
    { path: "complaints/:id", element: <SuspenseWrapper><ComplaintDetail /></SuspenseWrapper> },
    { path: "employee/:id", element: <SuspenseWrapper><EmployeeProfileHR /></SuspenseWrapper> },
    { path: "department/:id", element: <SuspenseWrapper><DepartmentDetail /></SuspenseWrapper> },
    { path: "performance", element: <SuspenseWrapper><Performance /></SuspenseWrapper> },
    { path: "performance/:id", element: <SuspenseWrapper><PerformanceDetail /></SuspenseWrapper> },
    { path: "overtime/:id", element: <SuspenseWrapper><OvertimeDetail /></SuspenseWrapper> },
  ],
};
