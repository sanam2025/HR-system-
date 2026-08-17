import {
  LayoutDashboard, Users, CheckSquare,
  CalendarOff, Clock, BarChart2, Briefcase, TrendingUp,
} from 'lucide-react';
import type { NavItem } from '../components/SideBar';
import AppLayout from './AppLayout';

const navItems: NavItem[] = [
  { label: 'Dashboard',   icon: LayoutDashboard, path: '/manager',             exact: true  },
  { label: 'Employees',   icon: Users,           path: '/manager/employees',   exact: false },
  { label: 'Tasks',       icon: CheckSquare,     path: '/manager/tasks',       exact: false },
  { label: 'Leaves',      icon: CalendarOff,     path: '/manager/leaves',      exact: false },
  { label: 'Overtime',    icon: Clock,           path: '/manager/overtime',    exact: false },
  { label: 'Attendance',  icon: BarChart2,       path: '/manager/attendance',  exact: false },
  { label: 'Evaluation',  icon: TrendingUp,      path: '/manager/evaluation',  exact: false },
  { label: 'Recruitment', icon: Briefcase,       path: '/manager/recruitment', exact: false },
];

const pageTitles: Record<string, string> = {
  '/manager':             'Dashboard',
  '/manager/employees':   'Employees',
  '/manager/tasks':       'Tasks',
  '/manager/leaves':      'Leaves',
  '/manager/overtime':    'Overtime',
  '/manager/attendance':  'Attendance',
  '/manager/evaluation':  'Evaluation',
  '/manager/recruitment': 'Recruitment',
};

export default function ManagerLayout() {
  return (
    <AppLayout
      navItems={navItems}
      pageTitles={pageTitles}
      brand={{ logo: '🏢', title: 'HR System', subtitle: 'Damascus University' }}
      user={{ avatar: 'M', name: 'Mohamed Ahmed', role: 'Department Manager' }}
      navSectionLabel="Main Menu"
    />
  );
}
