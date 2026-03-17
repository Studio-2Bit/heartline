import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PendingVerifications from './pages/PendingVerifications';
import UserManagement from './pages/UserManagement';
import SystemLogs from './pages/SystemLogs';
import Settings from './pages/Settings';



const validPages = ['dashboard', 'verifications', 'users', 'logs', 'settings'];

const getPageFromHash = () => {
  const hash = window.location.hash.replace('#', '');
  return validPages.includes(hash) ? hash : 'dashboard';
};

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState(getPageFromHash);

  // Re-render when hash changes (back/forward or direct hash set)
  useEffect(() => {
    const handleHashChange = () => setCurrentPage(getPageFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: string) => {
    window.location.hash = page; // triggers hashchange → setCurrentPage
  };

  
  //if (!isAuthenticated) return <Login />;

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':     return <Dashboard />;
      case 'verifications': return <PendingVerifications />;
      case 'users':         return <UserManagement />;
      case 'logs':          return <SystemLogs />;
      case 'settings':      return <Settings />;
      default:              return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;