import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
// import ManagerLayout from "../layouts/ManagerLayout";
// import E from "../../core/pages/manager/EmployeesList";
// import EmployeeProfile from "../../core/pages/manager/EmployeeProfile";
// import TasksBoard from "../../core/pages/Tasks/TasksBoard";

import EmployeesList from "../../core/pages/manager/EmployeesList";
import EmployeeProfile from "../../core/pages/manager/EmployeeProfile";
import TasksBoard from "../../core/pages/Tasks/TasksBoard";
import ManagerLayout from "../layouts/ManagerLayout";

// ── Placeholder ───
function Page({ title }: { title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
      <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#9ca3af' }}>{title}</p>
    </div>
  );
}

const router = createBrowserRouter([
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
]);

function ManagerRoute() {
  return <RouterProvider router={router} />;
}

export default ManagerRoute;