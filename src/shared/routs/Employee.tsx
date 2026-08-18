import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import EmployeeLayout from "../layouts/EmployeeLayout";
import EmployeeDashboard from "../../core/modules/employee/pages/EmployeeDashboard";
import EmployeeProfile from "../../core/modules/employee/pages/EmployeeProfile";
import EmployeeTasks from "../../core/modules/employee/pages/EmployeeTasks";
import EmployeeFinance from "../../core/modules/employee/pages/EmployeeFinance";
import EmployeeAttendance from "../../core/modules/employee/pages/EmployeeAttendance";
import EmployeeComplaints from "../../core/modules/employee/pages/EmployeeComplaints";
import Login from "../pages/Login";
import RequireAuth from "./RequireAuth";
import SessionExpiryListener from "./SessionExpiryListener";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SessionExpiryListener />,
    children: [
      { index: true, element: <Navigate to="/employee" replace /> },
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
          { path: "attendance", element: <EmployeeAttendance /> },
          { path: "complaints", element: <EmployeeComplaints /> },
        ],
      },
      { path: "*", element: <Navigate to="/employee" replace /> },
    ],
  },
]);

function EmployeeRoute() {
  return <RouterProvider router={router} />;
}

export default EmployeeRoute;
