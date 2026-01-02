import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import { PageWrapper } from '../components/PageWrapper';
import { FormInput } from '../components/FormInput';
import { useAuth } from '../context/AuthContext';

export const Auth = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'donor' as 'donor' | 'hospital'
  });
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'login') {
      await login(formData.email, formData.password, formData.role);
      navigate(formData.role === 'donor' ? '/donor/dashboard' : '/hospital/dashboard');
    } else {
      await register(formData.name, formData.email, formData.password, formData.role);
      navigate(formData.role === 'donor' ? '/donor/complete-profile' : '/hospital/complete-profile');
    }
  };

  return (
    <MainLayout>
      <PageWrapper>
        <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div
                className="hidden md:block bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://images.pexels.com/photos/6823567/pexels-photo-6823567.jpeg?auto=compress&cs=tinysrgb&w=800')"
                }}
              >
                <div className="h-full bg-gradient-to-br from-red-600/90 to-red-800/90 p-12 flex flex-col justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-8">
                    <Droplet className="h-16 w-16 text-white mb-4" />
                    <h2 className="text-3xl font-bold text-white mb-4">
                      Welcome to BloodConnect
                    </h2>
                    <p className="text-white/90 text-lg">
                      Join our community of life-savers. Every donation counts, every donor matters.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-12">
                <div className="mb-8">
                  <div className="flex space-x-4 mb-6">
                    <button
                      onClick={() => setActiveTab('login')}
                      className={`flex-1 py-3 rounded-lg font-semibold transition ${
                        activeTab === 'login'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => setActiveTab('register')}
                      className={`flex-1 py-3 rounded-lg font-semibold transition ${
                        activeTab === 'register'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Register
                    </button>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
                  </h3>
                  <p className="text-gray-600">
                    {activeTab === 'login'
                      ? 'Login to continue saving lives'
                      : 'Register to start your journey'}
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  {activeTab === 'register' && (
                    <FormInput
                      label="Full Name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  )}

                  <FormInput
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />

                  <FormInput
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />

                  {activeTab === 'register' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        I am a
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as 'donor' | 'hospital' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                      >
                        <option value="donor">Blood Donor</option>
                        <option value="hospital">Hospital</option>
                      </select>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition transform hover:scale-[1.02]"
                  >
                    {activeTab === 'login' ? 'Login' : 'Register'}
                  </button>
                </form>

                {activeTab === 'login' && (
                  <div className="mt-4 text-center">
                    <button className="text-sm text-red-600 hover:text-red-700">
                      Forgot Password?
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </MainLayout>
  );
};
