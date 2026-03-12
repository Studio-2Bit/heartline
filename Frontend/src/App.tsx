import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { Events } from './pages/Events';
import { EventDetails } from './pages/EventDetails';
import { Notifications } from './pages/Notifications';
import  EventRegister from './pages/EventRegister';
import { DonorDashboard } from './pages/donor/DonorDashboard';
import { DonorProfile } from './pages/donor/DonorProfile';
import { DonorRequests } from './pages/donor/DonorRequests';
import  DonorLeaderboard  from './pages/donor/donationLeaderboard';
import { DonorCompleteProfile } from './pages/donor/CompleteProfile';
import { HospitalDashboard } from './pages/hospital/HospitalDashboard';
import { CreateRequest } from './pages/hospital/CreateRequest';
import  { BloodRequestHistory } from './pages/hospital/BloodRequest'; 
import  DonorMark from './pages/hospital/donorMark';
import { CreateEvent } from './pages/hospital/CreateEvent';
import { HospitalEvents } from './pages/hospital/HospitalEvents';
import { HospitalCompleteProfile } from './pages/hospital/CompleteProfile';

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode; allowedRole?: 'donor' | 'hospital' }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'donor' ? '/donor/dashboard' : '/hospital/dashboard'} replace />;
  }

  /*if (!user.profileCompleted) {
    return <Navigate to={user.role === 'donor' ? '/donor/complete-profile' : '/hospital/complete-profile'} replace />;
  }*/

  return <>{children}</>;
};

const ProfileCompletionRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole: 'donor' | 'hospital' }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role !== requiredRole) {
    return <Navigate to={user.role === 'donor' ? '/donor/complete-profile' : '/hospital/complete-profile'} replace />;
  }

  if (user.profileCompleted) {
    return <Navigate to={user.role === 'donor' ? '/donor/dashboard' : '/hospital/dashboard'} replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/EventRegister"
        element={
          <ProtectedRoute>
            <EventRegister />
          </ProtectedRoute>
        }
      />

       <Route path="/events/register/:eventId" element={<EventRegister />} />
      <Route
        path="/Events"
        element={
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        }
      />
      

      <Route
        path="/donor/complete-profile"
        element={
          <ProfileCompletionRoute requiredRole="donor">
            <DonorCompleteProfile />
          </ProfileCompletionRoute>
        }
      />
      <Route
        path="/donor/dashboard"
        element={
          <ProtectedRoute allowedRole="donor">
            <DonorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donor/profile"
        element={
          <ProtectedRoute allowedRole="donor">
            <DonorProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donor/requests"
        element={
          <ProtectedRoute allowedRole="donor">
            <DonorRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donor/leaderboard"
        element={
          <ProtectedRoute allowedRole="donor">
            <DonorLeaderboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hospital/complete-profile"
        element={
          <ProfileCompletionRoute requiredRole="hospital">
            <HospitalCompleteProfile />
          </ProfileCompletionRoute>
        }
      />
      <Route
        path="/hospital/dashboard"
        element={
          <ProtectedRoute allowedRole="hospital">
            <HospitalDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hospital/BloodRequest"
        element={
          <ProtectedRoute allowedRole="hospital">
            <BloodRequestHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hospital/create-request"
        element={
          <ProtectedRoute allowedRole="hospital">
            <CreateRequest />
          </ProtectedRoute>
        }
      
      />
      <Route
        path="/hospital/donorMark"
        element={
          <ProtectedRoute allowedRole="hospital">
            <DonorMark />
          </ProtectedRoute>
        }
      
      />
      
      <Route
        path="/hospital/create-event"
        element={
          <ProtectedRoute allowedRole="hospital">
            <CreateEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hospital/events"
        element={
          <ProtectedRoute allowedRole="hospital">
            <HospitalEvents />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
