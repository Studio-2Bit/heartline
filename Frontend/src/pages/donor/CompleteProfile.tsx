import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronRight, MapPin, Loader } from 'lucide-react';
import { MainLayout } from '../../layouts/MainLayout';
import { PageWrapper } from '../../components/PageWrapper';
import { FormInput } from '../../components/FormInput';
import { UploadBox } from '../../components/UploadBox';
import { bloodTypes } from '../../utils/helpers';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const DonorCompleteProfile = () => {
  const { markProfileCompleted } = useAuth(); 
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    location: '',
    phone: '',
    bloodType: '',
    registrationNumber: '',
    idProof: null as File | null,
    latitude: null as number | null,
    longitude: null as number | null,
  });

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('GPS not supported by your browser');
      return;
    }
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setLocationDetected(true);
        setIsGettingLocation(false);
      },
      () => {
        alert('Could not get location. Please allow location access.');
        setIsGettingLocation(false);
      }
    );
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = new FormData();
      data.append('location', formData.location);
      data.append('phone', formData.phone);
      data.append('bloodType', formData.bloodType);
      if (formData.registrationNumber) data.append('registrationNumber', formData.registrationNumber);
      if (formData.idProof) data.append('idProof', formData.idProof);
      if (formData.latitude) data.append('latitude', String(formData.latitude));
      if (formData.longitude) data.append('longitude', String(formData.longitude));

      await api.post('/donor/profile/complete', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      markProfileCompleted(); // ← now uses the one declared at top
      navigate('/pending-verification');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to complete profile');
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageWrapper>
        <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Profile</h1>
              <p className="text-gray-600">Help us verify your identity and get started</p>
            </div>

            {/* Stepper */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center flex-1">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      step >= s ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step > s ? <CheckCircle className="h-6 w-6" /> : s}
                    </div>
                    {s < 3 && (
                      <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-red-600' : 'bg-gray-200'}`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-600">Basic Info</span>
                <span className="text-xs text-gray-600">Medical Info</span>
                <span className="text-xs text-gray-600">Verification</span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="mb-8">
              {/* Step 1 */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Basic Information</h2>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location <span className="text-red-600">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="City, District"
                        required
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={isGettingLocation}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-100 transition disabled:opacity-50 whitespace-nowrap"
                      >
                        {isGettingLocation ? <Loader className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                        {isGettingLocation ? 'Getting...' : 'Use GPS'}
                      </button>
                    </div>
                    {locationDetected && (
                      <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        GPS coordinates detected — distance matching enabled
                      </p>
                    )}
                  </div>
                  <FormInput
                    label="Phone Number"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+94 77 000 0000"
                    required
                  />
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Medical Information</h2>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Type <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={formData.bloodType}
                      onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                      required
                    >
                      <option value="">Select Blood Type</option>
                      {bloodTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <FormInput
                    label="Blood Bank Registration Number"
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    placeholder="Enter registration number if available"
                  />
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Verification</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload a government-issued ID or proof of identity to verify your profile
                  </p>
                  <UploadBox
                    label="ID Proof"
                    onFileSelect={(file) => setFormData({ ...formData, idProof: file })}
                  />
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex space-x-4">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={isLoading}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition flex items-center justify-center space-x-2 disabled:bg-gray-400"
              >
                <span>{isLoading ? 'Submitting...' : step === 3 ? 'Complete Profile' : 'Continue'}</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </PageWrapper>
    </MainLayout>
  );
};