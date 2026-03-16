import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronRight, MapPin, Loader } from 'lucide-react';
import { MainLayout } from '../../layouts/MainLayout';
import { PageWrapper } from '../../components/PageWrapper';
import { FormInput } from '../../components/FormInput';
import api from '../../services/api';

export const HospitalCompleteProfile = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    hospitalName: '',
    location: '',
    phone: '',
    registrationNumber: '',
    approvalNumber: '',
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
    if (step < 2) {
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
      await api.post('/hospital/profile/complete', {
        hospitalName: formData.hospitalName,
        location: formData.location,
        phone: formData.phone,
        registrationNumber: formData.registrationNumber,
        approvalNumber: formData.approvalNumber,
        ...(formData.latitude && { latitude: formData.latitude }),
        ...(formData.longitude && { longitude: formData.longitude }),
      });

      navigate('/hospital/dashboard');
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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Hospital Profile</h1>
              <p className="text-gray-600">Provide your hospital details for verification</p>
            </div>

            {/* Stepper */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {[1, 2].map((s) => (
                  <div key={s} className="flex items-center flex-1">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      step >= s ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step > s ? <CheckCircle className="h-6 w-6" /> : s}
                    </div>
                    {s < 2 && (
                      <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-red-600' : 'bg-gray-200'}`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 px-2">
                <span className="text-xs text-gray-600">Basic Details</span>
                <span className="text-xs text-gray-600">Registration</span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="mb-8">
              {/* Step 1 — Basic Details */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Hospital Information</h2>
                  <FormInput
                    label="Hospital Name"
                    type="text"
                    value={formData.hospitalName}
                    onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                    placeholder="Official hospital name"
                    required
                  />

                  {/* Location + GPS */}
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
                        {isGettingLocation
                          ? <Loader className="h-4 w-4 animate-spin" />
                          : <MapPin className="h-4 w-4" />
                        }
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
                    label="Contact Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+94 11 000 0000"
                    required
                  />
                </div>
              )}

              {/* Step 2 — Registration */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Registration Details</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Provide your hospital registration and approval numbers for verification
                  </p>
                  <FormInput
                    label="Hospital Registration Number"
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    placeholder="Official registration number"
                    required
                  />
                  <FormInput
                    label="Government Approval Number"
                    type="text"
                    value={formData.approvalNumber}
                    onChange={(e) => setFormData({ ...formData, approvalNumber: e.target.value })}
                    placeholder="Health department approval number"
                    required
                  />
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-blue-800">
                      Your profile will be reviewed by our team. You will receive a notification once verified.
                    </p>
                  </div>
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
                <span>{isLoading ? 'Submitting...' : step === 2 ? 'Submit for Review' : 'Continue'}</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </PageWrapper>
    </MainLayout>
  );
};