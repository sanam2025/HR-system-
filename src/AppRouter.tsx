// src/AppRouter.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts
import HRLayout from "./shared/layouts/HRLayout";
import ManagerLayout from "./shared/layouts/ManagerLayout";
import EmployeeLayout from "./shared/layouts/EmployeeLayout";

// HR Pages
import Dashboard from "./core/modules/HR/pages/Dashboard";
import Employees from "./core/modules/HR/pages/Employees";
import Recruitment from "./core/modules/HR/pages/Recruitment/Recruitment";
import Payroll from "./core/modules/HR/pages/Payroll";
import Terminations from "./core/modules/HR/pages/Terminations";
import Resignations from "./core/modules/HR/pages/Resignations";
import JobPostingForm from "./core/modules/HR/pages/JobPostings/JobPostingForm";
import JobPostingDetail from "./core/modules/HR/pages/JobPostings/JobPostingDetail";
import JobPostings from "./core/modules/HR/pages/JobPostings/JobPostings";
import ApplicantDetail from "./core/modules/HR/pages/ApplicantDetail";
import { AllApplicants } from "./core/modules/HR/pages/AllApplicants/AllApplicants";
import ScheduleInterview from "./core/modules/HR/pages/Interviews/ScheduleInterview";
import Interviews from "./core/modules/HR/pages/Interviews/Interviews";
import Attendance from "./core/modules/HR/pages/Attendance/Attendance";
import Leaves from "./core/modules/HR/pages/Leaves/Leaves";
import { LeaveDetail } from "./core/modules/HR/pages/Leaves/LeaveDetail";
import { HourlyLeaveDetail } from "./core/modules/HR/pages/HourlyLeaves/HourlyLeaveDetail";
import { HourlyLeaves } from "./core/modules/HR/pages/HourlyLeaves/HourlyLeaves";
import { SendOffer } from "./core/modules/HR/pages/Offers/SendOffer";
import { Offers } from "./core/modules/HR/pages/Offers/Offers";
import JobRequisitionDetail from "./core/modules/HR/pages/Recruitment/JobRequisitionDetail";
import Announcements from "./core/modules/HR/pages/Announcements/Announcements";
import Complaints from "./core/modules/HR/pages/Complaints/Complaints";
import ComplaintDetail from "./core/modules/HR/pages/Complaints/ComplaintDetail";
import EmployeeProfileHR from "./core/modules/HR/pages/EmployeeProfile";
import DepartmentDetail from "./core/modules/HR/pages/DepartmentDetail";
// ✅ استيراد الصفحة الجديدة
import AcceptedCandidates from "./core/modules/HR/pages/AcceptedCandidates/AcceptedCandidates";

// Manager Pages
import EmployeesList from "./core/pages/manager/EmployeesList";
import EmployeeProfile from "./core/pages/manager/EmployeeProfile";
import TasksBoard from "./core/pages/Tasks/TasksBoard";

// Employee Pages
import EmployeeDashboard from "./core/modules/employee/pages/EmployeeDashboard";
import EmployeeProfile_E from "./core/modules/employee/pages/EmployeeProfile";
import EmployeeTasksFinance from "./core/modules/employee/pages/EmployeeTasksFinance";
import EmployeeAttendance from "./core/modules/employee/pages/EmployeeAttendance";
import Overtime from "./core/modules/HR/pages/Overtime/Overtime";
import OvertimeDetail from "./core/modules/HR/pages/Overtime/OvertimeDetail";
import Contracts from "./core/modules/HR/pages/Contracts/Contracts";
import ContractDetail from "./core/modules/HR/pages/Contracts/ContractDetail";

// ============= Helper Component =============
function Page({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-48">
      <p className="text-2xl font-bold text-gray-400">{title}</p>
    </div>
  );
}

// ============= Router Configuration =============
const appRouter = createBrowserRouter([
  // ------------------- HR Module -------------------
  {
    path: "/Hr",
    element: <HRLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "employees", element: <Employees /> },
      { path: "Recruitment", element: <Recruitment /> },
      { path: "recruitment/:id", element: <JobRequisitionDetail /> },
      {
  path: "offers",
  element: <Offers />, // أو <AllOffers /> إذا أنشأت صفحة عامة
},
      { path: "payroll", element: <Payroll /> },
      { path: "terminations", element: <Terminations /> },
      { path: "resignations", element: <Resignations /> },
      { path: "contracts", element: <Contracts /> },
      {
  path: "contracts/:id",
  element: <ContractDetail />,
},
     {
  path: "overtime",
  element: <Overtime />,
},
{
  path: "overtime/:id",
  element: <OvertimeDetail />,
},
      { path: "job-postings", element: <JobPostings /> },
      { path: "job-postings/:id", element: <JobPostingDetail /> },
      { path: "job-postings/edit/:id", element: <JobPostingForm /> },
      { path: "all-applicants", element: <AllApplicants /> },
      { path: "recruitment/applicants/:jobId", element: <AllApplicants /> },
      // ✅ إضافة مسار Accepted Candidates
      {
        path: "accepted-candidates",
        element: <AcceptedCandidates />,
      },
      { path: "recruitment/applicant/:id", element: <ApplicantDetail /> },
      {
        path: "job-postings/:jobId/interviews",
        element: <Interviews />,
      },
      {
        path: "job-postings/:jobId/interviews/schedule",
        element: <ScheduleInterview />,
      },
      {
        path: "interviews/:id",
        element: <div>Interview Details - Coming Soon</div>,
      },
      { path: "attendance", element: <Attendance /> },
      { path: "Leaves", element: <Leaves /> },
      { path: "Leaves/:id", element: <LeaveDetail /> },
      { path: "hourly-leaves", element: <HourlyLeaves /> },
      { path: "hourly-leaves/:id", element: <HourlyLeaveDetail /> },
      {
        path: "job-postings/:jobId/offers",
        element: <Offers />,
      },
      {
        path: "job-postings/:jobId/offers/send",
        element: <SendOffer />,
      },
      { path: "announcements", element: <Announcements /> },
      { path: "complaints", element: <Complaints /> },
      { path: "complaints/:id", element: <ComplaintDetail /> },
      { path: "employee/:id", element: <EmployeeProfileHR /> },
      { path: "department/:id", element: <DepartmentDetail /> },
    ],
  },

  // ------------------- Manager Module -------------------
  {
    path: "/manager",
    element: <ManagerLayout />,
    children: [
      { index: true, element: <Page title="Dashboard" /> },
      { path: "employees", element: <EmployeesList /> },
      { path: "employees/:id", element: <EmployeeProfile /> },
      { path: "tasks", element: <TasksBoard /> },
      { path: "leaves", element: <Page title="Leaves" /> },
      { path: "overtime", element: <Page title="Overtime" /> },
      { path: "attendance", element: <Page title="Attendance" /> },
      { path: "evaluation", element: <Page title="Evaluation" /> },
      { path: "recruitment", element: <Page title="Recruitment" /> },
    ],
  },

  // ------------------- Employee Module -------------------
  {
    path: "/employee",
    element: <EmployeeLayout />,
    children: [
      { index: true, element: <EmployeeDashboard /> },
      { path: "profile", element: <EmployeeProfile_E /> },
      { path: "tasks", element: <EmployeeTasksFinance /> },
      { path: "finance", element: <EmployeeTasksFinance /> },
      { path: "attendance", element: <EmployeeAttendance /> },
    ],
  },
]);

// ============= Main App Router Export =============
export default function AppRouter() {
  return <RouterProvider router={appRouter} />;
}
