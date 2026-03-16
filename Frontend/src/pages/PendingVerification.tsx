import { Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';

export const PendingVerification = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="h-10 w-10 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Profile Submitted!</h1>
          <p className="text-gray-600 mb-6">
            Your profile is under review. An admin will verify your details shortly.
            You will receive an SMS once your account is approved.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left space-y-2">
            <div className="flex items-center gap-2 text-yellow-800 text-sm">
              <CheckCircle className="h-4 w-4" /> Profile information saved
            </div>
            <div className="flex items-center gap-2 text-yellow-800 text-sm">
              <CheckCircle className="h-4 w-4" /> ID proof uploaded
            </div>
            <div className="flex items-center gap-2 text-yellow-600 text-sm">
              <Clock className="h-4 w-4" /> Waiting for admin verification
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Back to Login
          </button>
        </div>
      </div>
    </MainLayout>
  );
};