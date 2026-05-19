
import SideBar from '../components/SideBar'
import { Outlet } from 'react-router-dom'

function AdminLayout() {

  const adminSideBar = [
    {path: '/admin' , title: 'Dashboard' , icon: ''},
    {path: '/admin/setting' , title: 'Settings' , icon: ''},
    {path: '/admin/announcement' , title: 'Announcements' , icon: ''},
    {path: '/admin/organization' , title: 'Organization Structure' , icon: ''},
    {path: '/admin/report' , title: 'Reports & Analytics' , icon: ''},
    {path: '/admin/search' , title: 'Employee Search' , icon: ''},
  ]


  return (
    <div className='min-h-screen w-screen flex'>
      <SideBar title='Admin' adminSidebar={adminSideBar}/>
      <main className='bg-amber-500 flex-1'>
        <Outlet/>
      </main>
    </div>
  )
}

export default AdminLayout