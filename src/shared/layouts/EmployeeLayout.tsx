import {
  LayoutDashboard, User, CalendarCheck, ListTodo, Wallet, MessageSquareWarning,
} from "lucide-react";
import type { NavItem } from "../components/SideBar";
import AppLayout from "./AppLayout";
import useAuthStore from "../../store/authStore";
import { useLogout } from "../../api/hooks/useAuth";

const navItems: NavItem[] = [
  { label: "Dashboard",          icon: LayoutDashboard, path: "/employee",             exact: true  },
  { label: "Profile",            icon: User,           path: "/employee/profile",      exact: false },
  { label: "Attendance & Leaves", icon: CalendarCheck,  path: "/employee/attendance",   exact: false },
  { label: "Tasks",              icon: ListTodo,        path: "/employee/tasks",        exact: false },
  { label: "Finance",            icon: Wallet,          path: "/employee/finance",      exact: false },
  { label: "Complaints",         icon: MessageSquareWarning, path: "/employee/complaints", exact: false },
];

const pageTitles: Record<string, string> = {
  "/employee":             "Dashboard",
  "/employee/profile":     "Profile",
  "/employee/attendance":  "Attendance & Leaves",
  "/employee/tasks":       "Tasks",
  "/employee/finance":     "Finance",
  "/employee/complaints":  "Complaints",
};

export default function EmployeeLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const displayName = user?.fullName ?? "Employee";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "E";

  return (
    <AppLayout
      navItems={navItems}
      pageTitles={pageTitles}
      brand={{ logo: "🌱", title: "Terra Portal", subtitle: "Employee Management" }}
      user={{ avatar: initials, name: displayName, role: "Employee" }}
      navSectionLabel="Main Menu"
      onSignOut={() => logout.mutate()}
    />
  );
}
