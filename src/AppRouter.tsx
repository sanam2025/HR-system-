// src/AppRouter.tsx
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import HRLayout from "./shared/layouts/HRLayout";
import Dashboard from "./core/modules/HR/pages/Dashboard";
import Employees from "./core/modules/HR/pages/Employees";
import Recruitment from "./core/modules/HR/pages/Recruitment/Recruitment";
import Payroll from "./core/modules/HR/pages/Payroll";
import AcceptedCandidates from "./core/modules/HR/pages/AcceptedCandidates";
import Terminations from "./core/modules/HR/pages/Terminations";
import Resignations from "./core/modules/HR/pages/Resignations";
import Contracts from "./core/modules/HR/pages/Contracts";
import ManagerLayout from "./shared/layouts/ManagerLayout";
// import EmployeesList from "./core/pages/manager/EmployeesList";
// import EmployeeProfile from "./core/pages/manager/EmployeeProfile";
import EmployeesList from "./core/pages/manager/components/EmployeesList";
import EmployeeProfile from "./core/pages/manager/components/EmployeeProfile";
import TasksBoard from "./core/pages/Tasks/TasksBoard";
import EmployeeLayout from "./shared/layouts/EmployeeLayout";
import EmployeeDashboard from "./core/modules/employee/pages/EmployeeDashboard";
import EmployeeProfile_E from "./core/modules/employee/pages/EmployeeProfile";
import EmployeeTasksFinance from "./core/modules/employee/pages/EmployeeTasksFinance";
import EmployeeAttendance from "./core/modules/employee/pages/EmployeeAttendance";
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
// ✅ Announcements (HR)
import Announcements from "./core/modules/HR/pages/Announcements/Announcements";
// ✅ Complaints
import Complaints from "./core/modules/HR/pages/Complaints/Complaints";
import ComplaintDetail from "./core/modules/HR/pages/Complaints/ComplaintDetail";
// ✅ Employee Profile (HR)
import EmployeeProfileHR from "./core/modules/HR/pages/EmployeeProfile";
// ✅ Department Detail
import DepartmentDetail from "./core/modules/HR/pages/DepartmentDetail";
import PublicJobsPage from "./core/pages/PublicJobs/PublicJobsPage";
import LeaveRequests from "./core/pages/Leaves/LeaveRequests";
import OvertimeRequests from "./core/pages/Leaves/OvertimeRequests";
import AttendanceView from "./core/pages/Attendance/AttendanceView";
import PeriodicEvaluation from "./core/pages/Evaluation/PeriodicEvaluation";
import AdminLayout from "./shared/layouts/AdminLayout";
import SystemSettings from "./core/modules/admin/pages/SystemSettings";
import AdminAnnouncements from "./core/modules/admin/pages/Announcements";
import OrganizationlStructure from "./core/modules/admin/pages/OrganizationlStructure";
import Reports from "./core/modules/admin/pages/Reports";
import EmployeeSearch from "./core/modules/admin/pages/EmployeeSearch";
import DashboardAdmin from "./core/modules/admin/pages/Dashboard";

function Page({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-48">
      <p className="text-2xl font-bold text-gray-400">{title}</p>
    </div>
  );
}

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/Hr" replace />
  },
  {
    path: "/Hr",
    element: <HRLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "employees", element: <Employees /> },
      { path: "Recruitment", element: <Recruitment /> },
      {
        path: "recruitment/:id",
        element: <JobRequisitionDetail />,
      },
      { path: "payroll", element: <Payroll /> },
      { path: "accepted-candidates", element: <AcceptedCandidates /> },
      { path: "terminations", element: <Terminations /> },
      { path: "resignations", element: <Resignations /> },
      { path: "contracts", element: <Contracts /> },
      { path: "job-postings", element: <JobPostings /> },
      { path: "job-postings/:id", element: <JobPostingDetail /> },
      { path: "job-postings/edit/:id", element: <JobPostingForm /> },
      { path: "all-applicants", element: <AllApplicants /> },
      { path: "recruitment/applicants/:jobId", element: <AllApplicants /> },
      {
        path: "attendance",
        element: <Attendance />,
      },
      {
        path: "Leaves",
        element: <Leaves />,
      },
      {
        path: "Leaves/:id",
        element: <LeaveDetail />,
      },
      { path: "recruitment/applicant/:id", element: <ApplicantDetail /> },
      // ✅ Interviews
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
      {
        path: "hourly-leaves",
        element: <HourlyLeaves />,
      },
      {
        path: "hourly-leaves/:id",
        element: <HourlyLeaveDetail />,
      },
      {
        path: "job-postings/:jobId/offers",
        element: <Offers />,
      },
      {
        path: "job-postings/:jobId/offers/send",
        element: <SendOffer />,
      },
      // ✅ Announcements
      {
        path: "announcements",
        element: <Announcements />,
      },
      // ✅ Complaints
      {
        path: "complaints",
        element: <Complaints />,
      },
      {
        path: "complaints/:id",
        element: <ComplaintDetail />,
      },
      // ✅ Employee Profile (HR)
      {
        path: "employee/:id",
        element: <EmployeeProfileHR />,
      },
      // ✅ Department Detail
      {
        path: "department/:id",
        element: <DepartmentDetail />,
      },
    ],
  },
  {
    path: '/careers',
    element: <PublicJobsPage />,
  },
  {
    path: '/manager',
    element: <ManagerLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'employees', element: <EmployeesList /> },
      { path: 'employees/:id', element: <EmployeeProfile /> },
      { path: 'tasks', element: <TasksBoard /> },
      { path: 'leaves', element: <LeaveRequests /> },
      { path: 'overtime', element: <OvertimeRequests /> },
      { path: 'attendance', element: <AttendanceView /> },
      { path: 'evaluation', element: <PeriodicEvaluation /> },
      { path: 'recruitment', element: <Recruitment /> },
    ],
  },
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
  {
        path:'/admin',
        element:<AdminLayout/>,
        children:[
            {index:true , element:<DashboardAdmin/>},
            {path:'setting' , element:<SystemSettings/>},
            {path:'announcement' , element:<AdminAnnouncements/>},
            {path:'organization' , element:<OrganizationlStructure/>},
            {path:'report' , element:<Reports/>},
            {path:'search' , element:<EmployeeSearch/>}
        ]
    }
]);

export default function AppRouter() {
  return <RouterProvider router={appRouter} />;
}