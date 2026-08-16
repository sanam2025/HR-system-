import SideBar from '../components/SideBar'
import { Outlet } from 'react-router-dom'
import { LayoutDashboard  , Settings , Megaphone , FolderTree , BarChart , Search, CalendarDays, UserX} from 'lucide-react'
import { useState } from 'react'

function AdminLayout() {

  const adminSideBar = [
    {path: '/admin' ,  label: 'Dashboard' , icon: LayoutDashboard , exact: true},
    {path: '/admin/setting' , label: 'Settings' , icon: Settings , exact: false},
    {path: '/admin/announcement' , label: 'Announcements' , icon: Megaphone , exact: false},
    {path: '/admin/organization' , label: 'Organization Structure' , icon: FolderTree , exact: false},
    {path: '/admin/overview' , label: 'Overview' , icon: BarChart , exact: false},
    {path: '/admin/search' , label: 'Employee Search' , icon: Search , exact: false},
    {path: '/admin/holidays' , label: 'Holidays' , icon: CalendarDays , exact: false},
    {path: '/admin/termination' , label: 'Terminations' , icon: UserX , exact: false},
  ]

  const [open , setopen] = useState(false);

  return (
    <div className='flex h-screen'>
      <SideBar navItems={adminSideBar} onToggle={() => setopen(!open)} open={open}/>
      <div className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ${open ? 'md:ms-64' : 'md:ms-16'}`}>
        <main className="flex-1 p-6 pb-16 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout