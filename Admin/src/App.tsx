import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PendingVerifications from './pages/PendingVerifications';
import UserManagement from './pages/UserManagement';
import SystemLogs from './pages/SystemLogs';
import Settings from './pages/Settings';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');



  //  tempory disable login page ...
  // if (!isAuthenticated) {
  //   return <Login />;
  // }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'verifications':
        return <PendingVerifications />;
      case 'users':
        return <UserManagement />;
      case 'logs':
        return <SystemLogs />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
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
