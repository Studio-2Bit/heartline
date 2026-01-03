import { useState } from 'react';
import { Save, User, MapPin, Phone, Droplet, Calendar, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { PageWrapper } from '../../components/PageWrapper';
import { FormInput } from '../../components/FormInput';
import { useAuth } from '../../context/AuthContext';
import { bloodTypes } from '../../utils/helpers';

export const DonorProfile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || ''
    
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    alert('Profile updated successfully!');
  };

  return (
    <DashboardLayout>
      <PageWrapper>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            <p className="text-gray-600">Manage your personal information and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Personal Information</h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Full Name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />

                    <FormInput
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled
                    />

                    <FormInput
                      label="Phone Number"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />

                    

                    <div className="md:col-span-2">
                      <FormInput
                        label="Location"
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="City, State"
                        required
                      />
                    </div>

                    
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition flex items-center justify-center space-x-2"
                  >
                    <Save className="h-5 w-5" />
                    <span>Save Changes</span>
                  </button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Profile Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="text-sm">Profile Verified</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="text-sm">Email Verified</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span className="text-sm">Member since Jan 2025</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-md p-6 text-white">
                <Droplet className="h-12 w-12 mb-4" />
                <h3 className="text-2xl font-bold mb-2">12</h3>
                <p className="text-red-100">Total Donations</p>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-sm">Next eligible donation</p>
                  <p className="font-semibold">March 15, 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </DashboardLayout>
  );
};
