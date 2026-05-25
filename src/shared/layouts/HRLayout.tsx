// layouts/HRLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";
import { Users } from "lucide-react";
import { useState } from "react";

export default function HRLayout() {
  const [open, setOpen] = useState(true);
  const hrSideBar = [
    { path: "/Hr", label: "Dashboard", icon: Users, exact: true },
    { path: "Job", label: "Job", icon: Users, exact: false },
    { path: "employees", label: "Employee", icon: Users, exact: false },
    { path: "Complaints", label: "Complaints", icon: Users, exact: false },
    { path: "Leaves", label: "Leaves", icon: Users, exact: false },
    { path: "Payroll", label: "Payroll", icon: Users, exact: false },
    { path: "Recruitment", label: "Recruitment", icon: Users, exact: false },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar on the LEFT */}
      <Sidebar
        navItems={hrSideBar}
        onToggle={() => setOpen(!open)}
        open={open}
      />

      {/* Main Content - with margin left for sidebar */}
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
