import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { Events } from './pages/Events';
import { EventDetails } from './pages/EventDetails';
import { Notifications } from './pages/Notifications';
import EventRegister from './pages/EventRegister';
import { DonorDashboard } from './pages/donor/DonorDashboard';
import { DonorActivity } from './pages/donor/RecentActivity';
import { DonorProfile } from './pages/donor/DonorProfile';
import { DonorRequests } from './pages/donor/DonorRequests';
import DonorLeaderboard from './pages/donor/donationLeaderboard';
import { DonorCompleteProfile } from './pages/donor/CompleteProfile';
import { HospitalDashboard } from './pages/hospital/HospitalDashboard';
import { PendingVerification } from './pages/PendingVerification';
import { HospitalProfile } from './pages/hospital/HospitalProfile';
import { CreateRequest } from './pages/hospital/CreateRequest';
import { BloodRequestHistory } from './pages/hospital/BloodRequest';
import DonorMark from './pages/hospital/donorMark';
import { CreateEvent } from './pages/hospital/CreateEvent';
import { HospitalEvents } from './pages/hospital/HospitalEvents';
import { HospitalCompleteProfile } from './pages/hospital/CompleteProfile';

// ── Guards ───────────────────────────────────────────────────────────

// Full access: logged in + profile completed + admin verified
const ProtectedRoute = ({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole?: 'donor' | 'hospital';
}) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  if (allowedRole && user.role !== allowedRole)
    return <Navigate to={user.role === 'donor' ? '/donor/dashboard' : '/hospital/dashboard'} replace />;
  if (!user.profileCompleted)
    return <Navigate to={user.role === 'donor' ? '/donor/complete-profile' : '/hospital/complete-profile'} replace />;
  if (!user.isVerified)
    return <Navigate to="/pending-verification" replace />;
  return <>{children}</>;
};

// Profile completion: logged in + profile NOT completed
const ProfileCompletionRoute = ({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole: 'donor' | 'hospital';
}) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== requiredRole)
    return <Navigate to={user.role === 'donor' ? '/donor/complete-profile' : '/hospital/complete-profile'} replace />;
  // Profile already completed
  if (user.profileCompleted) {
    if (user.isVerified)
      return <Navigate to={user.role === 'donor' ? '/donor/dashboard' : '/hospital/dashboard'} replace />;
    return <Navigate to="/pending-verification" replace />;
  }
  return <>{children}</>;
};

// Pending page: logged in + profile completed + NOT verified
const PendingRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  if (!user.profileCompleted)
    return <Navigate to={user.role === 'donor' ? '/donor/complete-profile' : '/hospital/complete-profile'} replace />;
  if (user.isVerified)
    return <Navigate to={user.role === 'donor' ? '/donor/dashboard' : '/hospital/dashboard'} replace />;
  return <>{children}</>;
};

// ── Routes ───────────────────────────────────────────────────────────

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/events/register/:eventId" element={<EventRegister />} />

      {/* Pending verification */}
      <Route path="/pending-verification" element={<PendingRoute><PendingVerification /></PendingRoute>} />

      {/* Notifications */}
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

      {/* Donor profile completion */}
      <Route path="/donor/complete-profile" element={<ProfileCompletionRoute requiredRole="donor"><DonorCompleteProfile /></ProfileCompletionRoute>} />

      {/* Donor pages */}
      <Route path="/donor/dashboard"      element={<ProtectedRoute allowedRole="donor"><DonorDashboard /></ProtectedRoute>} />
      <Route path="/donor/RecentActivity" element={<ProtectedRoute allowedRole="donor"><DonorActivity /></ProtectedRoute>} />
      <Route path="/donor/profile"        element={<ProtectedRoute allowedRole="donor"><DonorProfile /></ProtectedRoute>} />
      <Route path="/donor/requests"       element={<ProtectedRoute allowedRole="donor"><DonorRequests /></ProtectedRoute>} />
      <Route path="/donor/leaderboard"    element={<ProtectedRoute allowedRole="donor"><DonorLeaderboard /></ProtectedRoute>} />

      {/* Hospital profile completion */}
      <Route path="/hospital/complete-profile" element={<ProfileCompletionRoute requiredRole="hospital"><HospitalCompleteProfile /></ProfileCompletionRoute>} />

      {/* Hospital pages */}
      <Route path="/hospital/dashboard"      element={<ProtectedRoute allowedRole="hospital"><HospitalDashboard /></ProtectedRoute>} />
      <Route path="/hospital/Profile"        element={<ProtectedRoute allowedRole="hospital"><HospitalProfile /></ProtectedRoute>} />
      <Route path="/hospital/BloodRequest"   element={<ProtectedRoute allowedRole="hospital"><BloodRequestHistory /></ProtectedRoute>} />
      <Route path="/hospital/create-request" element={<ProtectedRoute allowedRole="hospital"><CreateRequest /></ProtectedRoute>} />
      <Route path="/hospital/donorMark"      element={<ProtectedRoute allowedRole="hospital"><DonorMark /></ProtectedRoute>} />
      <Route path="/hospital/create-event"   element={<ProtectedRoute allowedRole="hospital"><CreateEvent /></ProtectedRoute>} />
      <Route path="/hospital/events"         element={<ProtectedRoute allowedRole="hospital"><HospitalEvents /></ProtectedRoute>} />

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