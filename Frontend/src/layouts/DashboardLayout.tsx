import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, FileText, User, Plus, List } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user } = useAuth();
  const location = useLocation();

  const donorLinks = [
    { path: '/donor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/donor/requests', label: 'Blood Requests', icon: FileText },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/donor/profile', label: 'Profile', icon: User }
  ];

  const hospitalLinks = [
    { path: '/hospital/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/hospital/create-request', label: 'Create Request', icon: Plus },
    { path: '/hospital/events', label: 'My Events', icon: List },
    { path: '/events', label: 'All Events', icon: Calendar }
  ];

  const links = user?.role === 'donor' ? donorLinks : hospitalLinks;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <aside className="hidden lg:block w-64 bg-white shadow-md min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-red-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
