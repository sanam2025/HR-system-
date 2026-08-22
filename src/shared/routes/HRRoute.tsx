import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HRLayout from "../layouts/HRLayout";
import Dashboard from "../../core/modules/HR/pages/Dashboard";
import Employees from "../../core/modules/HR/pages/Employees";
import Recruitment from "../../core/modules/HR/pages/Recruitment/Recruitment";
import Payroll from "../../core/modules/HR/pages/Payroll";
import ApplicantDetail from "../../core/modules/HR/pages/ApplicantDetail";import Terminations from "../../core/modules/HR/pages/Terminations";
import Attendance from "../../core/modules/HR/pages/Attendance/Attendance";
import Leaves from "../../core/modules/HR/pages/Leaves/Leaves";
import JobRequisitionDetail from "../../core/modules/HR/pages/Recruitment/JobRequisitionDetail";
import Resignations from "../../core/modules/HR/pages/Resignations/Resignations";
import Contracts from "../../core/modules/HR/pages/Contracts/Contracts";
const route = createBrowserRouter([
  {
    path: "/Hr",
    element: <HRLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "employees", element: <Employees /> },
      { path: "attendance", element: <Attendance /> },
      { path: "leaves", element: <Leaves /> },
      { path: "recruitment", element: <Recruitment /> },
      { path: "payroll", element: <Payroll /> },
      { path: "recruitment/applicant/:id", element: <ApplicantDetail /> },
      { path: "terminations", element: <Terminations /> },
      { path: "resignations", element: <Resignations /> },
      { path: "contracts", element: <Contracts /> },
      { path: "recruitment/:id", element: <JobRequisitionDetail /> },    ],
  },
]);

function HRRoute() {
  return <RouterProvider router={route} />;
}

export default HRRoute;
