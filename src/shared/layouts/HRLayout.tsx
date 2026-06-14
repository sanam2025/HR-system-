// layouts/HRLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  DollarSign,
  UserPlus,
  Clock,
  UsersRound,
  LogOut,
  FileText,
  Briefcase, // للاستقالات
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
    { path: "Attendance", label: "Attendance", icon: Clock, exact: false },
    { path: "Leaves", label: "Leaves", icon: CalendarDays, exact: false },
    { path: "Payroll", label: "Payroll", icon: DollarSign, exact: false },
    {
      path: "accepted-candidates",
      label: "Accepted Candidates",
      icon: Users,
      exact: false,
    },
    { path: "terminations", label: "Terminations", icon: Users, exact: false },
    { path: "resignations", label: "Resignations", icon: LogOut, exact: false },
    { path: "contracts", label: "Contracts", icon: FileText, exact: false }, // أضف في hrSideBar
    {
      path: "job-postings",
      label: "Job Postings",
      icon: Briefcase,
      exact: false,
    }, //
  ];

  return (
    <div className="flex overflow-hidden bg-gray-100">
      <Sidebar
        navItems={hrSideBar}
        onToggle={() => setOpen(!open)}
        open={open}
      />
      <main
        className={`flex-1 transition-all duration-300 ${open ? "ml-64" : "ml-20"}`}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
