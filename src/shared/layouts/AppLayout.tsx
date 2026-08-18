import { useState } from "react";
import Sidebar from "../components/SideBar";
import Topbar from "../components/Topbar";
import { Outlet, useLocation } from "react-router-dom";
import type { NavItem } from "../components/SideBar";

export default function AppLayout({
  navItems,
  pageTitles,
  brand,
  user,
  navSectionLabel = "Main Menu",
  onSignOut,
}: {
  navItems: NavItem[];
  pageTitles: Record<string, string>;
  brand?: { logo?: string; title?: string; subtitle?: string };
  user?: { avatar: string; name: string; role: string };
  navSectionLabel?: string;
  onSignOut?: () => void;
}) {

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const currentTitle = pageTitles[location.pathname] ?? "";

  return (
    <div className="flex min-h-screen bg-surface">
        <Sidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          navItems={navItems}
          user={user}
          brand={brand}
          navSectionLabel={navSectionLabel}
          onSignOut={onSignOut}
        />
        <div className={`flex-1 flex flex-col overflow-hidden ${sidebarOpen ? 'ml-0 md:ml-64' : 'ml-0 md:ml-16'}`}>
          <Topbar title={currentTitle} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
          <main className="flex-1 overflow-y-auto bg-beige">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <Outlet />
            </div>
          </main>
        </div>
    </div>
  );
}
