import {
  LayoutDashboard, User, CalendarCheck, ListTodo, Wallet, MessageCircle
} from "lucide-react";
import type { NavItem } from "../components/SideBar";
import AppLayout from "./AppLayout";

import { useTranslation } from 'react-i18next';

export default function EmployeeLayout() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const navItems: NavItem[] = [
    { label: t('dashboard'), icon: LayoutDashboard, path: "/employee", exact: true },
    { label: t('profile'), icon: User, path: "/employee/profile", exact: false },
    { label: isAr ? 'الحضور & الاجازات' : 'Attendance & Leaves', icon: CalendarCheck, path: "/employee/attendance", exact: false },
    { label: t('tasks'), icon: ListTodo, path: "/employee/tasks", exact: false },
    { label: isAr ? 'المالية & العمل الاضافي' : 'Finance & Overtime', icon: Wallet, path: "/employee/finance", exact: false },
    { label: isAr ? 'الشكاوي' : 'Complaints', icon: MessageCircle, path: "/employee/complaints", exact: false },
  ];

  const pageTitles: Record<string, string> = {
    "/employee": t('dashboard'),
    "/employee/profile": t('profile'),
    "/employee/attendance": isAr ? 'الحضور & الاجازات' : 'Attendance & Leaves',
    "/employee/tasks": t('tasks'),
    "/employee/finance": isAr ? 'المالية & العمل الاضافي' : 'Finance & Overtime',
    "/employee/complaints": isAr ? 'الشكاوي' : 'Complaints',
  };
  return (
    <AppLayout
      navItems={navItems}
      pageTitles={pageTitles}
      brand={{ logo: "🌱", title: "MasarHR", subtitle: "Employee Portal" }}
      navSectionLabel={isAr ? "القائمة الرئيسية" : "Main Menu"}
    />
  );
}
