import {
  LayoutDashboard, User, CalendarCheck, ListTodo, Wallet,
} from "lucide-react";
import type { NavItem } from "../components/SideBar";
import AppLayout from "./AppLayout";

const navItems: NavItem[] = [
  { label: "Dashboard",          icon: LayoutDashboard, path: "/employee",             exact: true  },
  { label: "Profile",            icon: User,           path: "/employee/profile",      exact: false },
  { label: "Attendance & Leaves", icon: CalendarCheck,  path: "/employee/attendance",   exact: false },
  { label: "Tasks",              icon: ListTodo,        path: "/employee/tasks",        exact: false },
  { label: "Finance",            icon: Wallet,          path: "/employee/finance",      exact: false },
];

const pageTitles: Record<string, string> = {
  "/employee":             "Dashboard",
  "/employee/profile":     "Profile",
  "/employee/attendance":  "Attendance & Leaves",
  "/employee/tasks":       "Tasks",
  "/employee/finance":     "Finance",
};

export default function EmployeeLayout() {
  return (
    <AppLayout
      navItems={navItems}
      pageTitles={pageTitles}
      brand={{ logo: "🌱", title: "Terra Portal", subtitle: "Employee Management" }}
      user={{ avatar: "S", name: "Sarah", role: "Employee" }}
      navSectionLabel="Main Menu"
    />
  );
}
