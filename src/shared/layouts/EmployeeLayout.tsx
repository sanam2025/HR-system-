import {
  LayoutDashboard, User, CalendarCheck, ListTodo, Wallet,
} from "lucide-react";
import type { NavItem } from "../components/SideBar";
import AppLayout from "./AppLayout";

import { useTranslation } from 'react-i18next';

export default function EmployeeLayout() {
  const { t } = useTranslation();

  const navItems: NavItem[] = [
    { label: t('dashboard'), icon: LayoutDashboard, path: "/employee", exact: true },
    { label: t('profile'), icon: User, path: "/employee/profile", exact: false },
    { label: t('attendance'), icon: CalendarCheck, path: "/employee/attendance", exact: false },
    { label: t('tasks'), icon: ListTodo, path: "/employee/tasks", exact: false },
    { label: t('finance'), icon: Wallet, path: "/employee/finance", exact: false },
  ];

  const pageTitles: Record<string, string> = {
    "/employee": t('dashboard'),
    "/employee/profile": t('profile'),
    "/employee/attendance": t('attendance'),
    "/employee/tasks": t('tasks'),
    "/employee/finance": t('finance'),
  };
  return (
    <AppLayout
      navItems={navItems}
      pageTitles={pageTitles}
      brand={{ logo: "🌱", title: "Terra Portal", subtitle: "Employee Management" }}
      navSectionLabel="Main Menu"
    />
  );
}
