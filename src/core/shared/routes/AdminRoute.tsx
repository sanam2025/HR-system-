import { createBrowserRouter, RouterProvider } from "react-router-dom"
import AdminLayout from "../layouts/AdminLayout"
import Dashboard from "../../modules/admin/pages/Dashboard"
import SystemSettings from "../../modules/admin/pages/SystemSettings"
import Announcements from "../../modules/admin/pages/Announcements"
import OrganizationlStructure from "../../modules/admin/pages/OrganizationlStructure"
import Reports from "../../modules/admin/pages/Reports"
import EmployeeSearch from "../../modules/admin/pages/EmployeeSearch"

const router = createBrowserRouter([
    {
        path:'/admin',
        element:<AdminLayout/>,
        children:[
            {index:true , element:<Dashboard/>},
            {path:'setting' , element:<SystemSettings/>},
            {path:'announcement' , element:<Announcements/>},
            {path:'organization' , element:<OrganizationlStructure/>},
            {path:'report' , element:<Reports/>},
            {path:'search' , element:<EmployeeSearch/>}
        ]
    }
])

function AdminRoute() {
  return (
    <>
        <RouterProvider router={router}/>
    </>
  )
}

export default AdminRoute