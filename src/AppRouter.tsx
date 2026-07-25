import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Announcements from "./core/modules/admin/pages/Announcements/Announcements";
import EmployeeSearch from "./core/modules/admin/pages/EmployeeSearch";
import OrganizationlStructure from "./core/modules/admin/pages/OrganizationlStructure";
import Reports from "./core/modules/admin/pages/Reports";
import SystemSettings from "./core/modules/admin/pages/SystemSettings";
import AdminLayout from "./shared/layouts/AdminLayout";
import DashboardAdmin from "./core/modules/admin/pages/Dashboard";
import Holidays from "./core/modules/admin/pages/Holidays/Holidays";



function Page({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-48">
      <p className="text-2xl font-bold text-gray-400">{title}</p>
    </div>
  );
}

const appRouter = createBrowserRouter([
  {
    path:'/admin',
    element:<AdminLayout/>,
    children:[
        {index:true , element:<DashboardAdmin/>},
        {path:'setting' , element:<SystemSettings/>},
        {path:'announcement' , element:<Announcements/>},
        {path:'organization' , element:<OrganizationlStructure/>},
        {path:'report' , element:<Reports/>},
        {path:'search' , element:<EmployeeSearch/>},
        {path:'holidays' , element:<Holidays/>}
    ]
  }
]);

export default function AppRouter() {
  return <RouterProvider router={appRouter} />;
}
