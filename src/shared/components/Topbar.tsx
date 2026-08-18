import { Menu } from 'lucide-react';

export default function Topbar({
  title,
  onToggleSidebar,
  sidebarOpen = false,
}: {
  title: string;
  onToggleSidebar: () => void;
  sidebarOpen?: boolean;
}) {
  return (
    <header className={`h-16 bg-white border-b border-gray-100 flex items-center px-4 sm:px-6 gap-3 sm:gap-4 sticky top-0 ${sidebarOpen ? 'z-10 md:z-[60]' : 'z-[60]'}`}>
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-xl hover:bg-gray-50 transition-colors text-dark/60 hover:text-dark"
      >
        <Menu size={20} />
      </button>
      <h1 className="text-base sm:text-lg font-bold text-dark truncate">{title}</h1>
    </header>
  );
}
