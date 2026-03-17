import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { PageWrapper } from '../../components/PageWrapper';
import { FormInput } from '../../components/FormInput';
import { createEventApi } from '../../services/event.api';

export const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    expectedDonors: '',
    contactPerson: '',
    contactPhone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await createEventApi({
        title: formData.title,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        description: formData.description,
        contactPerson: formData.contactPerson,
        contactPhone: formData.contactPhone,
        ...(formData.expectedDonors && { expectedDonors: Number(formData.expectedDonors) }),
      });

      navigate('/hospital/events');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <PageWrapper>
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Create Blood Donation Event</h1>
            <p className="text-gray-600">Organize a new blood donation drive</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <FormInput
                  label="Event Title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Community Blood Drive"
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Event Date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                  <FormInput
                    label="Event Time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>

                <FormInput
                  label="Location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Full address of the event"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Description <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                    placeholder="Describe the event, what to expect, and any special instructions..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Expected Donors"
                    type="number"
                    value={formData.expectedDonors}
                    onChange={(e) => setFormData({ ...formData, expectedDonors: e.target.value })}
                    placeholder="Estimated number"
                    min="1"
                  />
                  <FormInput
                    label="Contact Person"
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="Event coordinator name"
                    required
                  />
                </div>

                <FormInput
                  label="Contact Phone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="+94 123-4567"
                  required
                />

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition flex items-center justify-center space-x-2 disabled:bg-gray-400"
                  >
                    <Calendar className="h-5 w-5" />
                    <span>{isLoading ? 'Creating...' : 'Create Event'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/hospital/dashboard')}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </PageWrapper>
    </DashboardLayout>
  );
};