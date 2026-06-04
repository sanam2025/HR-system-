import { createBrowserRouter, RouterProvider } from "react-router-dom";
import EmployeeLayout from "../layouts/EmployeeLayout";
import EmployeeDashboard from "../../core/modules/employee/pages/EmployeeDashboard";
import EmployeeProfile from "../../core/modules/employee/pages/EmployeeProfile";
import EmployeeTasksFinance from "../../core/modules/employee/pages/EmployeeTasksFinance";
import EmployeeAttendance from "../../core/modules/employee/pages/EmployeeAttendance";

const router = createBrowserRouter([
  {
    path: "/employee",
    element: <EmployeeLayout />,
    children: [
      { index: true, element: <EmployeeDashboard /> },
      { path: "profile", element: <EmployeeProfile /> },
      { path: "tasks", element: <EmployeeTasksFinance /> },
      { path: "finance", element: <EmployeeTasksFinance /> },
      { path: "attendance", element: <EmployeeAttendance /> },
    ],
  },
]);

function EmployeeRoute() {
  return <RouterProvider router={router} />;
}

export default EmployeeRoute;
