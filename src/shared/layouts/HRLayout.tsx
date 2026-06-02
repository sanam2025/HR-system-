// layouts/HRLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";
import {
  LayoutDashboard, // للـ Dashboard
  Users, // للـ Employee
  MessageSquareWarning, // للـ Complaints
  CalendarDays, // للـ Leaves
  DollarSign, // للـ Payroll
  UserPlus,
  Clock, // للـ Recruitment
} from "lucide-react";
import { useState } from "react";

export default function HRLayout() {
  const [open, setOpen] = useState(true);
  const hrSideBar = [
    { path: "/Hr", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { path: "employees", label: "Employee", icon: Users, exact: false },
    { path: "Recruitment", label: "Recruitment", icon: UserPlus, exact: false },
    { path: "Attendance", label: "Attendance", icon: Clock, exact: false },
    { path: "Leaves", label: "Leaves", icon: CalendarDays, exact: false },
    { path: "Payroll", label: "Payroll", icon: DollarSign, exact: false },

    {
      path: "Complaints",
      label: "Complaints",
      icon: MessageSquareWarning,
      exact: false,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar
        navItems={hrSideBar}
        onToggle={() => setOpen(!open)}
        open={open}
      />

      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ${open ? "ml-64" : "ml-20"}`}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

