import {
  LayoutDashboard, Users, CheckSquare,
  CalendarOff, Clock, BarChart2, Briefcase, TrendingUp,
} from 'lucide-react';
import type { NavItem } from '../components/SideBar';
import AppLayout from './AppLayout';
import { useLanguage } from '../../i18n/translations/LanguageContext';

export default function ManagerLayout() {
  const { t } = useLanguage();

  const navItems: NavItem[] = [
    { label: t.nav.dashboard,   icon: LayoutDashboard, path: '/manager',             exact: true  },
    { label: t.nav.employees,   icon: Users,           path: '/manager/employees',   exact: false },
    { label: t.nav.tasks,       icon: CheckSquare,     path: '/manager/tasks',       exact: false },
    { label: t.nav.leaves,      icon: CalendarOff,     path: '/manager/leaves',      exact: false },
    { label: t.nav.overtime,    icon: Clock,           path: '/manager/overtime',    exact: false },
    { label: t.nav.attendance,  icon: BarChart2,       path: '/manager/attendance',  exact: false },
    { label: t.nav.evaluation,  icon: TrendingUp,      path: '/manager/evaluation',  exact: false },
    { label: t.nav.recruitment, icon: Briefcase,       path: '/manager/recruitment', exact: false },
  ];

  const pageTitles: Record<string, string> = {
    '/manager':             t.nav.dashboard,
    '/manager/employees':   t.nav.employees,
    '/manager/tasks':       t.nav.tasks,
    '/manager/leaves':      t.nav.leaves,
    '/manager/overtime':    t.nav.overtime,
    '/manager/attendance':  t.nav.attendance,
    '/manager/evaluation':  t.nav.evaluation,
    '/manager/recruitment': t.nav.recruitment,
  };

  return (
    <AppLayout
      navItems={navItems}
      pageTitles={pageTitles}
      brand={{ logo: '🏢', title: t.layout.systemName, subtitle: t.layout.university }}
      user={{ avatar: t.layout.userAvatar, name: t.layout.userName, role: t.layout.managerRole }}
      navSectionLabel={t.nav.mainMenu}
      defaultTitle={t.nav.dashboard}
    />
  );
}
