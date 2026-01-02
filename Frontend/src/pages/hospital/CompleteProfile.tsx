import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { MainLayout } from '../../layouts/MainLayout';
import { PageWrapper } from '../../components/PageWrapper';
import { FormInput } from '../../components/FormInput';
import { useAuth } from '../../context/AuthContext';

export const HospitalCompleteProfile = () => {
  const [step, setStep] = useState(1);
  const { updateProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hospitalName: '',
    location: '',
    phone: '',
    registrationNumber: '',
    approvalNumber: ''
  });

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      updateProfile({
        ...formData,
        profileCompleted: true,
        verified: false
      });
      navigate('/hospital/dashboard');
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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Hospital Profile</h1>
              <p className="text-gray-600">Provide your hospital details for verification</p>
            </div>

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
                      <div className={`flex-1 h-1 mx-2 ${
                        step > s ? 'bg-red-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 px-2">
                <span className="text-xs text-gray-600">Basic Details</span>
                <span className="text-xs text-gray-600">Registration</span>
              </div>
            </div>

            <div className="mb-8">
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
                  <FormInput
                    label="Location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, State"
                    required
                  />
                  <FormInput
                    label="Contact Phone"
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
                <span>{step === 2 ? 'Submit for Review' : 'Continue'}</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </PageWrapper>
    </MainLayout>
  );
};
