// src/shared/layouts/HRLayout.tsx
import AppLayout from './AppLayout';
import { useLanguage } from '../../i18n/translations/LanguageContext';
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
  TrendingUp,
  ClipboardList,
  UserCheck,
} from 'lucide-react';
import type { NavItem } from '../components/SideBar';

export default function HRLayout() {
  const { lang, t } = useLanguage();

  const navItems: NavItem[] = [
    { label: t.hrNav?.dashboard || (lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'), icon: LayoutDashboard, path: '/Hr', exact: true },
    { label: t.hrNav?.recruitment || (lang === 'ar' ? 'التوظيف' : 'Recruitment'), icon: UserPlus, path: '/Hr/Recruitment', exact: false },
    { label: t.hrNav?.offers || (lang === 'ar' ? 'العروض' : 'Offers'), icon: FileText, path: '/Hr/offers', exact: false },
    { label: t.hrNav?.attendance || (lang === 'ar' ? 'الحضور' : 'Attendance'), icon: Clock, path: '/Hr/attendance', exact: false },
    { label: t.hrNav?.leaves || (lang === 'ar' ? 'الإجازات' : 'Leaves'), icon: CalendarDays, path: '/Hr/Leaves', exact: false },
    { label: t.hrNav?.payroll || (lang === 'ar' ? 'الرواتب' : 'Payroll'), icon: DollarSign, path: '/Hr/payroll', exact: false },
    { label: t.hrNav?.terminations || (lang === 'ar' ? 'الإنهاءات' : 'Terminations'), icon: UserCheck, path: '/Hr/terminations', exact: false },
    { label: t.hrNav?.resignations || (lang === 'ar' ? 'الاستقالات' : 'Resignations'), icon: LogOut, path: '/Hr/resignations', exact: false },
    { label: t.hrNav?.overtime || (lang === 'ar' ? 'العمل الإضافي' : 'Overtime'), icon: Clock, path: '/Hr/overtime', exact: false },
    { label: t.hrNav?.contracts || (lang === 'ar' ? 'العقود' : 'Contracts'), icon: FileText, path: '/Hr/contracts', exact: false },
    { label: t.hrNav?.jobPostings || (lang === 'ar' ? 'الوظائف' : 'Job Postings'), icon: Briefcase, path: '/Hr/job-postings', exact: false },
    { label: t.hrNav?.performance || (lang === 'ar' ? 'الأداء' : 'Performance'), icon: TrendingUp, path: '/Hr/performance', exact: false },
    { label: t.hrNav?.tasks || (lang === 'ar' ? 'المهام' : 'Tasks'), icon: ClipboardList, path: '/Hr/tasks', exact: false },
    { label: t.hrNav?.announcements || (lang === 'ar' ? 'التعميمات' : 'Announcements'), icon: Megaphone, path: '/Hr/announcements', exact: false },
    { label: t.hrNav?.complaints || (lang === 'ar' ? 'الشكاوي' : 'Complaints'), icon: Scale, path: '/Hr/complaints', exact: false },
  ];

  const pageTitles: Record<string, string> = {
    '/Hr': t.hrNav?.dashboard || (lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'),
    '/Hr/Recruitment': t.hrNav?.recruitment || (lang === 'ar' ? 'التوظيف' : 'Recruitment'),
    '/Hr/offers': t.hrNav?.offers || (lang === 'ar' ? 'العروض' : 'Offers'),
    '/Hr/attendance': t.hrNav?.attendance || (lang === 'ar' ? 'الحضور' : 'Attendance'),
    '/Hr/Leaves': t.hrNav?.leaves || (lang === 'ar' ? 'الإجازات' : 'Leaves'),
    '/Hr/hourly-leaves': t.hrNav?.hourlyLeaves || (lang === 'ar' ? 'إجازات بالساعة' : 'Hourly Leaves'),
    '/Hr/payroll': t.hrNav?.payroll || (lang === 'ar' ? 'الرواتب' : 'Payroll'),
    '/Hr/terminations': t.hrNav?.terminations || (lang === 'ar' ? 'الإنهاءات' : 'Terminations'),
    '/Hr/resignations': t.hrNav?.resignations || (lang === 'ar' ? 'الاستقالات' : 'Resignations'),
    '/Hr/overtime': t.hrNav?.overtime || (lang === 'ar' ? 'العمل الإضافي' : 'Overtime'),
    '/Hr/contracts': t.hrNav?.contracts || (lang === 'ar' ? 'العقود' : 'Contracts'),
    '/Hr/job-postings': t.hrNav?.jobPostings || (lang === 'ar' ? 'الوظائف' : 'Job Postings'),
    '/Hr/performance': t.hrNav?.performance || (lang === 'ar' ? 'الأداء' : 'Performance'),
    '/Hr/tasks': t.hrNav?.tasks || (lang === 'ar' ? 'المهام' : 'Tasks'),
    '/Hr/announcements': t.hrNav?.announcements || (lang === 'ar' ? 'التعميمات' : 'Announcements'),
    '/Hr/complaints': t.hrNav?.complaints || (lang === 'ar' ? 'الشكاوي' : 'Complaints'),
  };

  return (
    <AppLayout
      navItems={navItems}
      pageTitles={pageTitles}
      brand={{
        logo: undefined,
        title: 'MasarHR',
        subtitle: lang === 'ar' ? 'إدارة الموارد البشرية' : 'Human Resources Management',
      }}
      navSectionLabel={lang === 'ar' ? 'القائمة الرئيسية' : 'Main Menu'}
      defaultTitle={t.hrNav?.dashboard || (lang === 'ar' ? 'لوحة التحكم' : 'Dashboard')}
    />
  );
}