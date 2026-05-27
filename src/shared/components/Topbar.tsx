import { Menu, Search } from 'lucide-react';
import { useLanguage } from '../../i18n/translations/LanguageContext';

interface TopbarProps {
  title: string;
  onToggleSidebar: () => void;
  user?: { avatar: string; name: string; role: string };
}

export default function Topbar({
  title,
  onToggleSidebar,
  user = { avatar: 'M', name: 'Mohamed Ahmed' },
}: TopbarProps) {
  const { lang, toggleLang, isRTL } = useLanguage();

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-[60]">
      {/* Left section: Hamburger & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl hover:bg-gray-50 transition-colors text-dark/60 hover:text-dark"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-bold text-dark">{title}</h1>
      </div>

      {/* Right section: Search, Language, Avatar */}
      <div className="flex items-center gap-4">
        {/* Search button */}
        <button className="p-2 rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors">
          <Search size={18} />
        </button>

        {/* Language Switcher Pill */}
        <button
          onClick={toggleLang}
          title={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm cursor-pointer duration-200"
        >
          <span className={lang === 'en' ? 'text-green font-bold' : 'text-gray-400'}>EN</span>
          <span className="text-gray-300 font-normal">|</span>
          <span className={`font-tajawal text-[13px] leading-none ${lang === 'ar' ? 'text-green font-bold' : 'text-gray-400'}`}>ع</span>
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#3d7055] hover:bg-[#2d5440] flex items-center justify-center text-white font-bold text-sm cursor-pointer transition-colors shadow-sm">
          {user.avatar}
        </div>
      </div>
    </header>
  );
}
