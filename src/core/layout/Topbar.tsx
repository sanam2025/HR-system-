import { Menu } from 'lucide-react';

export default function Topbar({ title, onToggleSidebar }: { title: string; onToggleSidebar: () => void }) {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 gap-4 sticky top-0 z-[60]">
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-xl hover:bg-gray-50 transition-colors text-dark/60 hover:text-dark"
      >
        <Menu size={20} />
      </button>
      <h1 className="text-lg font-bold text-dark">{title}</h1>
    </header>
  );
}
