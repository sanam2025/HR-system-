import { createBrowserRouter, RouterProvider } from "react-router-dom";
import EmployeeLayout from "../layouts/EmployeeLayout";
import EmployeeDashboard from "../../core/modules/employee/pages/EmployeeDashboard";
import EmployeeProfile from "../../core/modules/employee/pages/EmployeeProfile";
import EmployeeTasks from "../../core/modules/employee/pages/EmployeeTasks";
import EmployeeFinance from "../../core/modules/employee/pages/EmployeeFinance";
import EmployeeRequests from "../../core/modules/employee/pages/EmployeeRequests";
import EmployeeAttendance from "../../core/modules/employee/pages/EmployeeAttendance";
import Login from "../pages/Login";
import RequireAuth from "./RequireAuth";
import SessionExpiryListener from "./SessionExpiryListener";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SessionExpiryListener />,
    children: [
      { path: "login", element: <Login /> },
      {
        path: "employee",
        element: (
          <RequireAuth>
            <EmployeeLayout />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <EmployeeDashboard /> },
          { path: "profile", element: <EmployeeProfile /> },
          { path: "tasks", element: <EmployeeTasks /> },
          { path: "finance", element: <EmployeeFinance /> },
          { path: "requests", element: <EmployeeRequests /> },
          { path: "attendance", element: <EmployeeAttendance /> },
        ],
      },
    ],
  },
]);

function EmployeeRoute() {
  return <RouterProvider router={router} />;
}

export default EmployeeRoute;
