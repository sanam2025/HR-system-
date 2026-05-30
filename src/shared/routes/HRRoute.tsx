import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HRLayout from "../layouts/HRLayout";
import Dashboard from "../../core/modules/HR/pages/Dashboard";
import Employees from "../../core/modules/HR/pages/Employees";
import Attendance from "../../core/modules/HR/pages/Attendance";
import Complaints from "../../core/modules/HR/pages/Complaints";
import Leaves from "../../core/modules/HR/pages/Leaves";
import Recruitment from "../../core/modules/HR/pages/Recruitment";
import Payroll from "../../core/modules/HR/pages/Payroll";

const route = createBrowserRouter([
  {
    path: "/Hr",
    element: <HRLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "employees", element: <Employees /> },
      { path: "attendance", element: <Attendance /> },
      { path: "complaints", element: <Complaints /> },
      { path: "leaves", element: <Leaves /> },
      { path: "recruitment", element: <Recruitment /> },
      { path: "payroll", element: <Payroll /> },
      { path: "Attendance", element: <Attendance /> },
    ],
  },
]);

function HRRoute() {
  return <RouterProvider router={route} />;
}

export default HRRoute;
