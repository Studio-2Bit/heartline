import { useState, useEffect } from 'react';
import { Save, Droplet, Calendar, CheckCircle, Timer, AlertCircle, Loader, MapPin } from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { PageWrapper } from '../../components/PageWrapper';
import { FormInput } from '../../components/FormInput';
import api from '../../services/api';

const getDaysUntilAvailable = (nextEligibleDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eligible = new Date(nextEligibleDate);
  eligible.setHours(0, 0, 0, 0);
  const diff = Math.ceil((eligible.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

const formatDate = (date?: string) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
};

export const DonorProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data } = await api.get('/donor/profile');
      const p = data.profile;
      const user = p.userId;

      setProfile(p);
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: p.phone || '',
        location: p.location || '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.put('/donor/profile', {
        phone: formData.phone,
        location: formData.location,
      });
      setSuccess('Profile updated successfully!');
      // refresh profile data
      await fetchProfile();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const daysLeft = profile?.nextEligibleDate
    ? getDaysUntilAvailable(profile.nextEligibleDate)
    : 0;

  if (isLoading) {
    return (
      <DashboardLayout>
        <PageWrapper>
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader className="h-8 w-8 text-red-500 animate-spin" />
          </div>
        </PageWrapper>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageWrapper>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            <p className="text-gray-600">Manage your personal information and preferences</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Form */}
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
                      disabled
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
                        placeholder="City, District"
                        required
                      />
                    </div>
                  </div>

                  {/* Extra read-only info */}
                  {profile?.bloodType && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-gray-50 rounded-lg px-4 py-3">
                        <p className="text-xs text-gray-500 mb-1">Blood Type</p>
                        <p className="font-bold text-red-600 text-lg">{profile.bloodType}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg px-4 py-3">
                        <p className="text-xs text-gray-500 mb-1">Availability</p>
                        <p className={`font-semibold text-sm ${
                          profile.availabilityStatus === 'available'
                            ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {profile.availabilityStatus === 'available' ? '✓ Available' : '✗ Unavailable'}
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full mt-6 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition flex items-center justify-center space-x-2 disabled:bg-gray-400"
                  >
                    {isSaving
                      ? <><Loader className="h-4 w-4 animate-spin" /><span>Saving...</span></>
                      : <><Save className="h-5 w-5" /><span>Save Changes</span></>
                    }
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">

              {/* Profile Status */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Profile Status</h3>
                <div className="space-y-3">
                  <div className={`flex items-center ${profile?.userId?.isVerified ? 'text-green-600' : 'text-gray-400'}`}>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="text-sm">
                      {profile?.userId?.isVerified ? 'Profile Verified' : 'Pending Verification'}
                    </span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="text-sm">Email Verified</span>
                  </div>
                  {formData.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span className="text-sm">{formData.location}</span>
                    </div>
                  )}
                  {profile?.createdAt && (
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span className="text-sm">
                        Member since {new Date(profile.createdAt).toLocaleDateString('en-US', {
                          month: 'short', year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Donation Stats */}
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-md p-6 text-white">
                <Droplet className="h-12 w-12 mb-4" />
                <h3 className="text-2xl font-bold mb-1">
                  {profile?.totalDonations ?? 0}
                </h3>
                <p className="text-red-100">Total Donations</p>

                <div className="mt-4 pt-4 border-t border-white/20 space-y-3">
                  <div>
                    <p className="text-sm text-red-100">Last donation</p>
                    <p className="font-semibold">{formatDate(profile?.lastDonationDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-red-100">Next eligible donation</p>
                    <p className="font-semibold">{formatDate(profile?.nextEligibleDate)}</p>
                    {profile?.nextEligibleDate && (
                      <div className="flex items-center gap-1 mt-1 bg-white/20 px-2 py-1 rounded-full w-fit">
                        <Timer className="h-3 w-3" />
                        <span className="text-xs font-bold">
                          {daysLeft === 0 ? 'Ready to donate!' : `${daysLeft} days left`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </PageWrapper>
    </DashboardLayout>
  );
};