import { useTranslation } from 'react-i18next';
import AppLayout from "./AppLayout";
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
  Scale,
  Megaphone,
} from "lucide-react";

export default function HRLayout() {
  const { t } = useTranslation();

  const hrSideBar = [
    { path: "/Hr", label: t('dashboard'), icon: LayoutDashboard, exact: true },
    { path: "employees", label: t('employee'), icon: Users, exact: false },
    { path: "Recruitment", label: t('recruitment'), icon: UserPlus, exact: false },
    { path: "all-applicants", label: t('applicants'), icon: UsersRound, exact: false },
    { path: "attendance", label: t('attendance'), icon: Clock, exact: false },
    { path: "Leaves", label: t('leaves'), icon: CalendarDays, exact: false },
    { path: "hourly-leaves", label: t('hourlyLeaves'), icon: Clock, exact: false },
    { path: "Payroll", label: t('payroll'), icon: DollarSign, exact: false },
    { path: "accepted-candidates", label: t('acceptedCandidates'), icon: Users, exact: false },
    { path: "terminations", label: t('terminations'), icon: Users, exact: false },
    { path: "resignations", label: t('resignations'), icon: LogOut, exact: false },
    { path: "contracts", label: t('contracts'), icon: FileText, exact: false },
    { path: "job-postings", label: t('jobPostings'), icon: Briefcase, exact: false },
    {
      path: "announcements",
      label: t('announcements'),
      icon: Megaphone,
      exact: false,
    },
    {
      path: "complaints",
      label: t('complaints'),
      icon: Scale,
      exact: false,
    },
  ];

  const hrPageTitles: Record<string, string> = {
    '/Hr': t('dashboard'),
    '/Hr/employees': t('employee'),
    '/Hr/Recruitment': t('recruitment'),
    '/Hr/all-applicants': t('applicants'),
    '/Hr/attendance': t('attendance'),
    '/Hr/Leaves': t('leaves'),
    '/Hr/hourly-leaves': t('hourlyLeaves'),
    '/Hr/Payroll': t('payroll'),
    '/Hr/accepted-candidates': t('acceptedCandidates'),
    '/Hr/terminations': t('terminations'),
    '/Hr/resignations': t('resignations'),
    '/Hr/contracts': t('contracts'),
    '/Hr/job-postings': t('jobPostings'),
    '/Hr/announcements': t('announcements'),
    '/Hr/complaints': t('complaints'),
  };

  return (
    <AppLayout
      navItems={hrSideBar}
      pageTitles={hrPageTitles}
      brand={{
        title: "HR Portal",
        subtitle: t('department')
      }}
      navSectionLabel={t('hrMenu') || 'HR Menu'}
    />
  );
}