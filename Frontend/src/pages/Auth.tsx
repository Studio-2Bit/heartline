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
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 🔍 VALIDATIONS
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
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

  return (
    <MainLayout>
      <PageWrapper>
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
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </MainLayout>
  );
};
