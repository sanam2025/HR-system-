import { NavLink } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '../../i18n/translations/LanguageContext';

// ── Types ──
export interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
  exact?: boolean;
}

export interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  navItems: NavItem[];
  brand?: { logo?: string; title?: string; subtitle?: string };
  user?: { avatar: string; name: string; role: string };
  navSectionLabel?: string;
}

// ── Component ──
export default function Sidebar({
  open,
  onToggle,
  navItems,
  brand = { logo: '🏢', title: 'HR System', subtitle: 'جامعة دمشق' },
  user  = { avatar: 'م', name: 'مستخدم', role: '' },
  navSectionLabel = 'القائمة الرئيسية',
}: SidebarProps) {
  const { isRTL } = useLanguage();
  
  const ToggleIcon = open 
    ? (isRTL ? ChevronRight : ChevronLeft) 
    : (isRTL ? ChevronLeft : ChevronRight);

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={onToggle} />
      )}

      <aside className={`
        fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-screen z-50 flex flex-col
        bg-dark-sidebar shadow-[0_4px_20px_rgba(0,0,0,0.15)]
        transition-all duration-300
        ${open ? 'w-64' : 'w-0 overflow-hidden md:w-16'}
      `}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
          <div className="w-9 h-9 bg-green rounded-xl flex items-center justify-center text-lg flex-shrink-0">
            {brand.logo ?? '🏢'}
          </div>
          {open && (
            <div>
              <p className="text-white font-bold text-sm leading-tight">{brand.title}</p>
              <p className="text-white/40 text-[10px]">{brand.subtitle}</p>
            </div>
          )}
        </div>

        {/* User */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <div className="w-9 h-9 rounded-full bg-green flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user.avatar}
          </div>
          {open && (
            <div className="overflow-hidden">
              <p className="text-white text-xs font-semibold truncate">{user.name}</p>
              <p className="text-gold text-[10px]">{user.role}</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto scrollbar-hide">
          {open && (
            <p className="px-5 py-2 text-white/30 text-[10px] font-bold uppercase tracking-widest">
              {navSectionLabel}
            </p>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact ?? false}
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
          <ToggleIcon size={20} />
        </button>
      </aside>
    </>
  );
}
