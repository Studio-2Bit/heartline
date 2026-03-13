import { useState, useEffect } from 'react';
import { Save, Building2, CheckCircle, MapPin, Phone, Loader, AlertCircle, Hash } from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { PageWrapper } from '../../components/PageWrapper';
import { FormInput } from '../../components/FormInput';
import api from '../../services/api';

export const HospitalProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState<any>(null);

  const [formData, setFormData] = useState({
    hospitalName: '',
    location: '',
    phone: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data } = await api.get('/hospital/profile');
      const p = data.profile;
      setProfile(p);
      setFormData({
        hospitalName: p.hospitalName || '',
        location: p.location || '',
        phone: p.phone || '',
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
      await api.put('/hospital/profile', {
        hospitalName: formData.hospitalName,
        location: formData.location,
        phone: formData.phone,
      });
      setSuccess('Profile updated successfully!');
      await fetchProfile();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-800">Hospital Profile</h1>
            <p className="text-gray-600">Manage your hospital information</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

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
                <h2 className="text-xl font-bold text-gray-800 mb-6">Hospital Information</h2>
                <form onSubmit={handleSubmit}>
                  <FormInput
                    label="Hospital Name"
                    type="text"
                    value={formData.hospitalName}
                    onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                    placeholder="Official hospital name"
                    required
                  />
                  <FormInput
                    label="Location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, District"
                    required
                  />
                  <FormInput
                    label="Contact Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+94 11 000 0000"
                    required
                  />

                  {/* Read-only registration info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="bg-gray-50 rounded-lg px-4 py-3">
                      <p className="text-xs text-gray-500 mb-1">Registration Number</p>
                      <p className="font-semibold text-gray-700 text-sm">
                        {profile?.registrationNumber || '—'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-4 py-3">
                      <p className="text-xs text-gray-500 mb-1">Approval Number</p>
                      <p className="font-semibold text-gray-700 text-sm">
                        {profile?.approvalNumber || '—'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full mt-6 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:bg-gray-400"
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

              {/* Hospital Card */}
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-md p-6 text-white">
                <Building2 className="h-12 w-12 mb-4 opacity-90" />
                <h3 className="text-xl font-bold mb-1">{profile?.hospitalName}</h3>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mt-2 ${
                  profile?.isVerified
                    ? 'bg-white/20 text-white'
                    : 'bg-white/10 text-red-100'
                }`}>
                  {profile?.isVerified
                    ? <><CheckCircle className="h-3 w-3" /> Verified</>
                    : <>⏳ Pending Verification</>
                  }
                </div>

                <div className="mt-5 pt-4 border-t border-white/20 space-y-3">
                  <div className="flex items-center gap-2 text-red-100 text-sm">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{profile?.location || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-100 text-sm">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span>{profile?.phone || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-100 text-sm">
                    <Hash className="h-4 w-4 flex-shrink-0" />
                    <span>{profile?.registrationNumber || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Verification Status */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Profile Status</h3>
                <div className="space-y-3">
                  <div className={`flex items-center gap-2 ${profile?.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                    {profile?.isVerified
                      ? <CheckCircle className="h-5 w-5" />
                      : <AlertCircle className="h-5 w-5" />
                    }
                    <span className="text-sm font-medium">
                      {profile?.isVerified ? 'Hospital Verified' : 'Awaiting Admin Verification'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm">Email Verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="h-5 w-5" />
                    <span className="text-sm">{profile?.location || 'No location set'}</span>
                  </div>
                </div>

                {!profile?.isVerified && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-xs text-yellow-700">
                      Your profile is under review. You'll be notified once an admin approves it.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </PageWrapper>
    </DashboardLayout>
  );
};