// src/shared/layouts/HRLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  DollarSign,
  UserPlus,
 
  LogOut,
  FileText,
  Briefcase,
  Clock,
  Scale,
  Megaphone,
  CheckCircle, // ✅ تمت إضافة أيقونة CheckCircle
} from "lucide-react";
import { useState } from "react";

export default function HRLayout() {
  const [open, setOpen] = useState(true);
  const { t } = useTranslation();

  const hrSideBar = [
    { path: "/Hr", label: t("dashboard"), icon: LayoutDashboard, exact: true },
    { path: "employees", label: t("employee"), icon: Users, exact: false },
    {
      path: "Recruitment",
      label: t("recruitment"),
      icon: UserPlus,
      exact: false,
    },
    {
  path: "offers", // أو "job-postings/offers" حسب تنسيقك
  label: t("offers") || "Offers",
  icon: FileText, // أيقونة مناسبة
  exact: false,
},
    
    // ✅ إضافة Accepted Candidates في الـ Sidebar
    {
      path: "accepted-candidates",
      label: t("acceptedCandidates") || "Accepted Candidates",
      icon: CheckCircle,
      exact: false,
    },
    { path: "attendance", label: t("attendance"), icon: Clock, exact: false },
    { path: "Leaves", label: t("leaves"), icon: CalendarDays, exact: false },
    {
      path: "hourly-leaves",
      label: t("hourlyLeaves"),
      icon: Clock,
      exact: false,
    },
    { path: "Payroll", label: t("payroll"), icon: DollarSign, exact: false },
    {
      path: "terminations",
      label: t("terminations"),
      icon: Users,
      exact: false,
    },
    {
      path: "resignations",
      label: t("resignations"),
      icon: LogOut,
      exact: false,
    },
    {
  
  path: "overtime",
  label: t("overtime") || "Overtime",
  icon: Clock,
  exact: false,
},
    { path: "contracts", label: t("contracts"), icon: FileText, exact: false },
    {
      path: "job-postings",
      label: t("jobPostings"),
      icon: Briefcase,
      exact: false,
    },
    {
      path: "announcements",
      label: t("announcements") || "التعميمات",
      icon: Megaphone,
      exact: false,
    },
    {
      path: "complaints",
      label: t("complaints") || "الشكاوي",
      icon: Scale,
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
      <main
        className={`flex-1 transition-all duration-300 ${open ? "ml-64" : "ml-20"}`}
      >
        <div className="p-4 border-b bg-white flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800"></h1>
          <LanguageSwitcher />
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}