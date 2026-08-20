// src/shared/layouts/HRLayout.tsx
import AppLayout from './AppLayout';
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
  const navItems: NavItem[] = [
    { label: 'لوحة التحكم', icon: LayoutDashboard, path: '/Hr', exact: true },
    { label: 'التوظيف', icon: UserPlus, path: '/Hr/Recruitment', exact: false },
    { label: 'العروض', icon: FileText, path: '/Hr/offers', exact: false },
    { label: 'الحضور', icon: Clock, path: '/Hr/attendance', exact: false },
    { label: 'الإجازات', icon: CalendarDays, path: '/Hr/Leaves', exact: false },
    { label: 'الرواتب', icon: DollarSign, path: '/Hr/payroll', exact: false },
    { label: 'الإنهاءات', icon: UserCheck, path: '/Hr/terminations', exact: false },
    { label: 'الاستقالات', icon: LogOut, path: '/Hr/resignations', exact: false },
    { label: 'العمل الإضافي', icon: Clock, path: '/Hr/overtime', exact: false },
    { label: 'العقود', icon: FileText, path: '/Hr/contracts', exact: false },
    { label: 'الوظائف', icon: Briefcase, path: '/Hr/job-postings', exact: false },
    { label: 'الأداء', icon: TrendingUp, path: '/Hr/performance', exact: false },
    { label: 'المهام', icon: ClipboardList, path: '/Hr/tasks', exact: false },
    { label: 'التعميمات', icon: Megaphone, path: '/Hr/announcements', exact: false },
    { label: 'الشكاوي', icon: Scale, path: '/Hr/complaints', exact: false },
  ];

  const pageTitles: Record<string, string> = {
    '/Hr': 'لوحة التحكم',
    '/Hr/Recruitment': 'التوظيف',
    '/Hr/offers': 'العروض',
    '/Hr/attendance': 'الحضور',
    '/Hr/Leaves': 'الإجازات',
    '/Hr/hourly-leaves': 'إجازات بالساعة',
    '/Hr/payroll': 'الرواتب',
    '/Hr/terminations': 'الإنهاءات',
    '/Hr/resignations': 'الاستقالات',
    '/Hr/overtime': 'العمل الإضافي',
    '/Hr/contracts': 'العقود',
    '/Hr/job-postings': 'الوظائف',
    '/Hr/performance': 'الأداء',
    '/Hr/tasks': 'المهام',
    '/Hr/announcements': 'التعميمات',
    '/Hr/complaints': 'الشكاوي',
  };

  return (
    <AppLayout
      navItems={navItems}
      pageTitles={pageTitles}
      brand={{
        logo: undefined,
        title: 'MasarHR',
        subtitle: 'إدارة الموارد البشرية',
      }}
      navSectionLabel="القائمة الرئيسية"
      defaultTitle="لوحة التحكم"
    />
  );
}