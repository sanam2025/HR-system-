// src/shared/layouts/HRLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  DollarSign,
  UserPlus,
  UsersRound,
  LogOut,
  FileText,
  Briefcase,
  Clock,
  
} from "lucide-react";
import { useState } from "react";

export default function HRLayout() {
  const [open, setOpen] = useState(true);

  const hrSideBar = [
    { path: "/Hr", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { path: "employees", label: "Employee", icon: Users, exact: false },
    { path: "Recruitment", label: "Recruitment", icon: UserPlus, exact: false },
    {
      path: "all-applicants",
      label: "Applicants",
      icon: UsersRound,
      exact: false,
    },
    { path: "attendance", label: "Attendance", icon: Clock, exact: false }, // ✅ جديد
    { path: "Leaves", label: "Leaves", icon: CalendarDays, exact: false },
    {
      path: "hourly-leaves",
      label: "Hourly Leaves",
      icon: Clock,
      exact: false,
    },
    { path: "Payroll", label: "Payroll", icon: DollarSign, exact: false },
    {
      path: "accepted-candidates",
      label: "Accepted Candidates",
      icon: Users,
      exact: false,
    },
    { path: "terminations", label: "Terminations", icon: Users, exact: false },
    { path: "resignations", label: "Resignations", icon: LogOut, exact: false },
    { path: "contracts", label: "Contracts", icon: FileText, exact: false },
    {
      path: "job-postings",
      label: "Job Postings",
      icon: Briefcase,
      exact: false,
    },
   
  ];

  return (
    <div className="flex overflow-hidden bg-gray-100">
      <Sidebar
        navItems={hrSideBar}
        onToggle={() => setOpen(!open)}
        open={open}
      />
      <div className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ${open ? 'md:ms-64' : 'md:ms-16'}`}>
        <main className="flex-1 p-6 pb-16 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
