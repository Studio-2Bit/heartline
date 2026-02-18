import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { MainLayout } from '../../layouts/MainLayout';
import { PageWrapper } from '../../components/PageWrapper';
import { FormInput } from '../../components/FormInput';
import { UploadBox } from '../../components/UploadBox';
import { useAuth } from '../../context/AuthContext';
import { bloodTypes } from '../../utils/helpers';

export const DonorCompleteProfile = () => {
  const [step, setStep] = useState(1);
  //const { updateProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    location: '',
    phone: '',
    bloodType: '',
    registrationNumber: '',
    idProof: null as File | null
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      updateProfile({
        ...formData,
        profileCompleted: true,
        verified: false
      });
      navigate('/donor/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
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
                      <div className={`flex-1 h-1 mx-2 ${
                        step > s ? 'bg-red-600' : 'bg-gray-200'
                      }`} />
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

            <div className="mb-8">
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Basic Information</h2>
                  <FormInput
                    label="Location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, State"
                    required
                  />
                  <FormInput
                    label="Phone Number"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              )}

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
                      {bloodTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <FormInput
                    label="Blood Bank Registration Number (Optional)"
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    placeholder="Enter registration number if available"
                  />
                </div>
              )}

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
                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition flex items-center justify-center space-x-2"
              >
                <span>{step === 3 ? 'Complete Profile' : 'Continue'}</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </PageWrapper>
    </MainLayout>
  );
};
