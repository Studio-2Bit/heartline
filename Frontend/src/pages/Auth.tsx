import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import { PageWrapper } from '../components/PageWrapper';
import { FormInput } from '../components/FormInput';
import { useAuth } from '../context/AuthContext';

export const Auth = () => {
  const [userType, setUserType] = useState<'donor' | 'hospital'>('donor');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
<<<<<<< HEAD
    password: ''
=======
    password: '',
>>>>>>> 3209f1c223e675f616191de65d46b6815fb75a01
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

<<<<<<< HEAD
    if (authMode === 'login') {
      await login(formData.email, formData.password, userType);
      navigate(userType === 'donor' ? '/donor/dashboard' : '/hospital/dashboard');
    } else {
      await register(formData.name, formData.email, formData.password, userType);
      navigate(userType === 'donor' ? '/donor/complete-profile' : '/hospital/complete-profile');
=======
    // 🔍 VALIDATIONS
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
>>>>>>> 3209f1c223e675f616191de65d46b6815fb75a01
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (authMode === 'register' && !formData.name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      setLoading(true);

      if (authMode === 'login') {
        await login(formData.email, formData.password, userType);
        navigate(userType === 'donor' ? '/donor/dashboard' : '/hospital/dashboard');
      } else {
        await register(formData.name, formData.email, formData.password, userType);
        navigate('/');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '' });
    setError(null);
  };

  const handleUserTypeChange = (type: 'donor' | 'hospital') => {
    setUserType(type);
    setAuthMode('login');
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '' });
  };

  const handleUserTypeChange = (type: 'donor' | 'hospital') => {
    setUserType(type);
    setAuthMode('login');
    resetForm();
  };

  return (
    <MainLayout>
      <PageWrapper>
<<<<<<< HEAD
        <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-shadow duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left Section - Image */}
              <div
                className="hidden md:block bg-cover bg-center relative overflow-hidden"
                style={{
                  backgroundImage: "url('https://images.pexels.com/photos/6823567/pexels-photo-6823567.jpeg?auto=compress&cs=tinysrgb&w=800')"
                }}
              >
                <div className="h-full bg-gradient-to-br from-red-600/95 to-red-800/95 p-12 flex flex-col justify-center relative">
                  <div className="absolute inset-0 opacity-10 bg-pattern"></div>
                  <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/20 relative z-10 transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-center mb-6">
                      <div className="p-4 bg-white/20 rounded-full">
                        <Droplet className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4 text-center leading-tight">
                      Welcome to BloodConnect
                    </h2>
                    <p className="text-white/95 text-base text-center leading-relaxed">
                      Join our community of life-savers. Every donation counts, every donor matters.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Section - Form */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                {/* User Type Selection */}
                <div className="mb-8 animate-fadeIn">
                  <div className="flex gap-3 mb-8 p-1 bg-gray-50 rounded-xl">
                    <button
                      onClick={() => handleUserTypeChange('donor')}
                      className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform ${
                        userType === 'donor'
                          ? 'bg-red-600 text-white shadow-lg scale-105'
                          : 'bg-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      Donor
                    </button>
                    <button
                      onClick={() => handleUserTypeChange('hospital')}
                      className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform ${
                        userType === 'hospital'
                          ? 'bg-red-600 text-white shadow-lg scale-105'
                          : 'bg-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      Hospital
                    </button>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      {authMode === 'login' ? 'Welcome Back' : 'Get Started'}
                    </h3>
                    <p className="text-gray-600 text-base">
                      {authMode === 'login'
                        ? `Sign in to your ${userType} account and continue saving lives`
                        : `Create a new ${userType} account to join our mission`}
                    </p>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {authMode === 'register' && (
                    <div className="animate-fadeIn">
                      <FormInput
                        label={userType === 'donor' ? 'Full Name' : 'Hospital Name'}
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
=======
        <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 bg-gray-50">
          <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">

              {/* LEFT */}
              <div className="hidden md:flex bg-red-700 text-white p-12 flex-col justify-center">
                <Droplet className="h-14 w-14 mb-6" />
                <h2 className="text-4xl font-bold mb-4">BloodConnect</h2>
                <p>Saving lives together.</p>
              </div>

              {/* RIGHT */}
              <div className="p-8 md:p-12">
                <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => handleUserTypeChange('donor')}
                    className={`flex-1 py-2 rounded-md ${
                      userType === 'donor' ? 'bg-red-600 text-white' : ''
                    }`}
                  >
                    Donor
                  </button>
                  <button
                    onClick={() => handleUserTypeChange('hospital')}
                    className={`flex-1 py-2 rounded-md ${
                      userType === 'hospital' ? 'bg-red-600 text-white' : ''
                    }`}
                  >
                    Hospital
                  </button>
                </div>

                <h3 className="text-2xl font-bold mb-2">
                  {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h3>

                {error && (
                  <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {authMode === 'register' && (
                    <FormInput
                      label={userType === 'donor' ? 'Full Name' : 'Hospital Name'}
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
>>>>>>> 3209f1c223e675f616191de65d46b6815fb75a01
                  )}

                  <FormInput
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />

                  <FormInput
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />

<<<<<<< HEAD
                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-white text-gray-800 py-3 rounded-full font-bold border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-sm hover:shadow-lg mt-6"
                  >
                    {authMode === 'login' ? 'Sign In' : 'Sign Up'}
                  </button>
                </form>

                {/* Toggle Auth Mode */}
                <div className="mt-6 text-center">
                  <p className="text-gray-600 text-sm">
                    {authMode === 'login' ? (
                      <>
                        Don't have an account?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('register');
                            resetForm();
                          }}
                          className="text-red-600 font-bold hover:text-red-700 hover:underline transition-all duration-200"
                        >
                          Sign up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('login');
                            resetForm();
                          }}
                          className="text-red-600 font-bold hover:text-red-700 hover:underline transition-all duration-200"
                        >
                          Sign in
                        </button>
                      </>
                    )}
                  </p>
                </div>

                {authMode === 'login' && (
                  <div className="mt-4 text-center animate-fadeIn">
                    <button
                      type="button"
                      className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors duration-200"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
=======
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Please wait...' : authMode === 'login' ? 'Sign In' : 'Sign Up'}
                  </button>
                </form>

                <p className="text-sm text-center mt-4">
                  {authMode === 'login' ? (
                    <>
                      Don’t have an account?{' '}
                      <button
                        onClick={() => {
                          setAuthMode('register');
                          resetForm();
                        }}
                        className="text-red-600 font-semibold"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        onClick={() => {
                          setAuthMode('login');
                          resetForm();
                        }}
                        className="text-red-600 font-semibold"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
>>>>>>> 3209f1c223e675f616191de65d46b6815fb75a01
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-in-out;
          }
        `}</style>
      </PageWrapper>
    </MainLayout>
  );
};