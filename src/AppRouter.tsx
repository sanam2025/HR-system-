
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HRLayout from "./shared/layouts/HRLayout";
import Dashboard from "./core/modules/HR/pages/Dashboard";
import Employees from "./core/modules/HR/pages/Employees";
import Attendance from "./core/modules/HR/pages/Attendance";
import Leaves from "./core/modules/HR/pages/Leaves";
import Recruitment from "./core/modules/HR/pages/Recruitment/Recruitment";
import Payroll from "./core/modules/HR/pages/Payroll";
import ApplicantDetail from "./core/modules/HR/pages/ApplicantDetail";
import AcceptedCandidates from "./core/modules/HR/pages/AcceptedCandidates";
import Terminations from "./core/modules/HR/pages/Terminations";
import Resignations from "./core/modules/HR/pages/Resignations";
import Contracts from "./core/modules/HR/pages/Contracts";
import JobRequisitionDetail from "./core/modules/HR/pages/JobRequisitionDetail";
import JobRequisitionForm from "./core/modules/HR/pages/JobRequisitionForm";
import ManagerLayout from "./shared/layouts/ManagerLayout";
import EmployeesList from "./core/pages/manager/EmployeesList";
import EmployeeProfile from "./core/pages/manager/EmployeeProfile";
import TasksBoard from "./core/pages/Tasks/TasksBoard";
import EmployeeLayout from "./shared/layouts/EmployeeLayout";
import EmployeeDashboard from "./core/modules/employee/pages/EmployeeDashboard";
import EmployeeProfile_E from "./core/modules/employee/pages/EmployeeProfile";
import EmployeeTasksFinance from "./core/modules/employee/pages/EmployeeTasksFinance";
import EmployeeAttendance from "./core/modules/employee/pages/EmployeeAttendance";

function Page({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-48">
      <p className="text-2xl font-bold text-gray-400">{title}</p>
    </div>
  );
}

const appRouter = createBrowserRouter([
  {
    path: "/Hr",
    element: <HRLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "employees", element: <Employees /> },
      { path: "attendance", element: <Attendance /> },
      { path: "leaves", element: <Leaves /> },
      { path: "Recruitment", element: <Recruitment /> },
      { path: "payroll", element: <Payroll /> },
      { path: "recruitment/applicant/:id", element: <ApplicantDetail /> },
      { path: "accepted-candidates", element: <AcceptedCandidates /> },
      { path: "terminations", element: <Terminations /> },
      { path: "resignations", element: <Resignations /> },
      { path: "contracts", element: <Contracts /> },
      { path: "recruitment/:id", element: <JobRequisitionDetail /> },
      { path: "recruitment/create", element: <JobRequisitionForm /> },
      { path: "recruitment/edit/:id", element: <JobRequisitionForm /> },
    ],
  },
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

export default function AppRouter() {
  return <RouterProvider router={appRouter} />;
}