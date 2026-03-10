import { useState, useEffect } from 'react';
import { LayoutDashboard, ClipboardCheck, Users, FileText, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard',     label: 'Dashboard',            icon: LayoutDashboard },
    { id: 'verifications', label: 'Pending Verifications', icon: ClipboardCheck  },
    { id: 'users',         label: 'User Management',       icon: Users           },
    { id: 'logs',          label: 'System Logs',           icon: FileText        },
    { id: 'settings',      label: 'Settings',              icon: Settings        },
  ];

  // Sync active item when browser back/forward is used
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) onNavigate(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [onNavigate]);

  const handleNavigate = (id: string) => {
    window.location.hash = id;   // updates URL hash → triggers App re-render
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <header className="bg-gray-900 sticky top-0 z-50">

      {/* Main bar */}
      <div className="flex items-center justify-between px-6 h-14">

        {/* Logo */}
        <span className="text-red-500 font-bold text-lg whitespace-nowrap">Blood Bank Admin</span>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleNavigate(id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap border border-transparent ${
                currentPage === id
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={15} className="flex-shrink-0" />
              {label}
            </button>
          ))}
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors ml-2 whitespace-nowrap border border-transparent"
          >
            <LogOut size={15} className="flex-shrink-0" />
            Logout
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-gray-400 hover:text-white"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-gray-800 px-4 py-3 flex flex-col gap-1">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleNavigate(id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-left transition-colors ${
                currentPage === id
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={17} className="flex-shrink-0" />
              {label}
            </button>
          ))}
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors mt-1 border-t border-gray-800 pt-3"
          >
            <LogOut size={17} className="flex-shrink-0" />
            Logout
          </button>
        </nav>
      )}
    </header>
  );
}