import {
  LayoutDashboard, User, CalendarCheck, ListTodo, Wallet, Inbox,
} from "lucide-react";
import type { NavItem } from "../components/SideBar";
import AppLayout from "./AppLayout";
import useAuthStore from "../../store/authStore";
import { useLogout } from "../../api/hooks/useAuth";
import NotificationBell from "../../core/modules/employee/components/speciel-components/NotificationBell";

const navItems: NavItem[] = [
  { label: "Dashboard",          icon: LayoutDashboard, path: "/employee",             exact: true  },
  { label: "Profile",            icon: User,           path: "/employee/profile",      exact: false },
  { label: "Attendance & Leaves", icon: CalendarCheck,  path: "/employee/attendance",   exact: false },
  { label: "Tasks",              icon: ListTodo,        path: "/employee/tasks",        exact: false },
  { label: "Finance",            icon: Wallet,          path: "/employee/finance",      exact: false },
  { label: "Requests",           icon: Inbox,           path: "/employee/requests",     exact: false },
];

const pageTitles: Record<string, string> = {
  "/employee":             "Dashboard",
  "/employee/profile":     "Profile",
  "/employee/attendance":  "Attendance & Leaves",
  "/employee/tasks":       "Tasks",
  "/employee/finance":     "Finance",
  "/employee/requests":    "Requests",
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
      topbarRightSlot={<NotificationBell />}
    />
  );
}
