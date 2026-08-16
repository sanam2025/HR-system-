import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Announcements from "./core/modules/admin/pages/Announcements/Announcements";
import EmployeeSearch from "./core/modules/admin/pages/Employees/EmployeeSearch";
import OrganizationlStructure from "./core/modules/admin/pages/Organization/OrganizationlStructure";
import SystemSettings from "./core/modules/admin/pages/settings/SystemSettings";
import AdminLayout from "./shared/layouts/AdminLayout";
import DashboardAdmin from "./core/modules/admin/pages/Dashboard";
import Holidays from "./core/modules/admin/pages/Holidays/Holidays";
import Login from "./core/modules/auth/Login";
import Overview from "./core/modules/admin/pages/Overview/Overview";
import Terminations from "./core/modules/admin/pages/Terminations/Termination";


function Page({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-48">
      <p className="text-2xl font-bold text-gray-400">{title}</p>
    </div>
  );
}

const appRouter = createBrowserRouter([
  {
    path:'/',
    element:<Login/>,
  },
  {
    path:'/admin',
    element:<AdminLayout/>,
    children:[
      {index:true , element:<DashboardAdmin/>},
      {path:'setting' , element:<SystemSettings/>},
      {path:'announcement' , element:<Announcements/>},
      {path:'organization' , element:<OrganizationlStructure/>},
      {path:'Overview' , element:<Overview/>},
      {path:'search' , element:<EmployeeSearch/>},
      {path:'holidays' , element:<Holidays/>},
      {path:'termination' , element:<Terminations/>}
    ]
  }
]);

export default function AppRouter() {
  return <RouterProvider router={appRouter} />;
}
