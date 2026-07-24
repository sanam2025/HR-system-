import {
  LayoutDashboard, Users, CheckSquare,
  CalendarOff, Clock, BarChart2, Briefcase, TrendingUp,
} from 'lucide-react';
import type { NavItem } from '../components/SideBar';
import AppLayout from './AppLayout';
import { useTranslation } from 'react-i18next';

export default function ManagerLayout() {
  const { t } = useTranslation();

  const navItems: NavItem[] = [
    { label: t('dashboard'),   icon: LayoutDashboard, path: '/manager',             exact: true  },
    { label: t('employee'),    icon: Users,           path: '/manager/employees',   exact: false },
    { label: t('tasks'),       icon: CheckSquare,     path: '/manager/tasks',       exact: false },
    { label: t('leaves'),      icon: CalendarOff,     path: '/manager/leaves',      exact: false },
    { label: t('hourlyLeaves'),icon: Clock,           path: '/manager/overtime',    exact: false },
    { label: t('attendance'),  icon: BarChart2,       path: '/manager/attendance',  exact: false },
    { label: t('evaluation') || 'Evaluation',  icon: TrendingUp,      path: '/manager/evaluation',  exact: false },
    { label: t('recruitment'), icon: Briefcase,       path: '/manager/recruitment', exact: false },
  ];

  const pageTitles: Record<string, string> = {
    '/manager':             t('dashboard'),
    '/manager/employees':   t('employee'),
    '/manager/tasks':       t('tasks'),
    '/manager/leaves':      t('leaves'),
    '/manager/overtime':    t('hourlyLeaves'),
    '/manager/attendance':  t('attendance'),
    '/manager/evaluation':  t('evaluation') || 'Evaluation',
    '/manager/recruitment': t('recruitment'),
  };

  return (
    <AppLayout
      navItems={navItems}
      pageTitles={pageTitles}
      brand={{ logo: '🏢', title: t('systemName') || 'HR System', subtitle: t('university') || 'University of Damascus' }}
      user={{ avatar: t('userAvatar') || 'M', name: t('userName') || 'Mohamed Ahmed', role: t('managerRole') || 'Department Manager' }}
      navSectionLabel={t('mainMenu') || 'Main Menu'}
      defaultTitle={t('dashboard') || 'Dashboard'}
    />
  );
}
