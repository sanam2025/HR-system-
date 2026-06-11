import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HRLayout from "../layouts/HRLayout";
import Dashboard from "../../core/modules/HR/pages/Dashboard";
import Employees from "../../core/modules/HR/pages/Employees";
import Attendance from "../../core/modules/HR/pages/Attendance";
import Leaves from "../../core/modules/HR/pages/Leaves";
import Recruitment from "../../core/modules/HR/pages/Recruitment";
import Payroll from "../../core/modules/HR/pages/Payroll";
import ApplicantDetail from "../../core/modules/HR/pages/ApplicantDetail";
import AllApplicants from "../../core/modules/HR/pages/AllApplicants";
import AcceptedCandidates from "../../core/modules/HR/pages/AcceptedCandidates";
import Terminations from "../../core/modules/HR/pages/Terminations";
import Resignations from "../../core/modules/HR/pages/Resignations";
import Contracts from "../../core/modules/HR/pages/Contracts";


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
      { path: "all-applicants", element: <AllApplicants /> },
      { path: "recruitment/applicant/:id", element: <ApplicantDetail /> },
      { path: "accepted-candidates", element: <AcceptedCandidates /> },
     { path: "terminations", element: <Terminations /> },
     { path: "resignations", element: <Resignations /> },
     { path: "contracts", element: <Contracts /> },
    ],
  },
]);

function HRRoute() {
  return <RouterProvider router={route} />;
}

export default HRRoute;


