import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, CheckSquare, CalendarOff,
  Clock, BarChart2, Briefcase, ChevronRight, ChevronLeft, TrendingUp,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const navItems = [
  { label: 'لوحة التحكم',    icon: LayoutDashboard, path: '/manager',             exact: true  },
  { label: 'الموظفون',       icon: Users,           path: '/manager/employees',   exact: false },
  { label: 'المهام',         icon: CheckSquare,     path: '/manager/tasks',       exact: false },
  { label: 'الإجازات',       icon: CalendarOff,     path: '/manager/leaves',      exact: false },
  { label: 'العمل الإضافي',  icon: Clock,           path: '/manager/overtime',    exact: false },
  { label: 'الحضور',         icon: BarChart2,       path: '/manager/attendance',  exact: false },
  { label: 'التقييم الدوري', icon: TrendingUp,      path: '/manager/evaluation',  exact: false },
  { label: 'التوظيف',        icon: Briefcase,       path: '/manager/recruitment', exact: false },
];

export default function Sidebar({ open, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={onToggle} />
      )}

      <aside className={`
        fixed top-0 right-0 h-screen z-50 flex flex-col
        bg-dark-sidebar shadow-[0_4px_20px_rgba(0,0,0,0.15)]
        transition-all duration-300
        ${open ? 'w-64' : 'w-0 overflow-hidden md:w-16'}
      `}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
          <div className="w-9 h-9 bg-green rounded-xl flex items-center justify-center text-lg flex-shrink-0">
            🏢
          </div>
          {open && (
            <div>
              <p className="text-white font-bold text-sm leading-tight">HR System</p>
              <p className="text-white/40 text-[10px]">جامعة دمشق</p>
            </div>
          )}
        </div>

        {/* User */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <div className="w-9 h-9 rounded-full bg-green flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            م
          </div>
          {open && (
            <div className="overflow-hidden">
              <p className="text-white text-xs font-semibold truncate">محمد أحمد</p>
              <p className="text-gold text-[10px]">مدير القسم</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto scrollbar-hide">
          {open && (
            <p className="px-5 py-2 text-white/30 text-[10px] font-bold uppercase tracking-widest">
              القائمة الرئيسية
            </p>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-2.5 text-sm cursor-pointer transition-all duration-200
                  ${isActive
                    ? 'bg-green/25 text-white border-r-[3px] border-green'
                    : 'text-white/65 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon size={18} className="flex-shrink-0" />
                {open && <span className="flex-1 truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Toggle */}
        <button
          onClick={onToggle}
          className="flex items-center justify-center py-4 text-white/40 hover:text-white transition-colors border-t border-white/10"
        >
          {open ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </aside>
    </>
  );
}
