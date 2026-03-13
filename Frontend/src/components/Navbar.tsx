import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Droplet, LogOut, User, Bell as BellIcon, Calendar, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NotificationBell } from './NotificationBell';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    return user.role === 'donor' ? '/donor/dashboard' : '/hospital/dashboard';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-red-600 p-2 rounded-lg">
              <Droplet className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">HeartLine</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {!user ? (
              <>
                <Link to="/" className="text-gray-700 hover:text-red-600 transition">
                  Home
                </Link>
                <Link to="/events" className="text-gray-700 hover:text-red-600 transition">
                  Events
                </Link>
                <Link
                  to="/auth"
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                
                <NotificationBell />
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition">
                    <User className="h-5 w-5" />
                    <span>{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      to={user.role === 'donor' ? '/donor/profile' : '/hospital/Profile'}
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      
    </nav>
  );
};
