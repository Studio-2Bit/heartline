import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Users, Calendar, Trash2, Edit } from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { PageWrapper } from '../../components/PageWrapper';
import { ProfileCard } from '../../components/ProfileCard';
import { StatsCard } from '../../components/StatsCard';
import { FormInput } from '../../components/FormInput';
import { bloodTypes, urgencyLevels } from '../../utils/helpers';

const activeRequests = [
  {
    id: '1',
    bloodType: 'O+',
    urgency: 'Critical',
    createdAt: '15 minutes ago',
    responses: 5,
    notes: 'Emergency surgery patient'
  },
  {
    id: '2',
    bloodType: 'AB-',
    urgency: 'High',
    createdAt: '2 hours ago',
    responses: 2,
    notes: 'Cancer treatment'
  }
];

export const HospitalDashboard = () => {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    bloodType: '',
    urgency: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Blood request created successfully!');
    setShowCreateForm(false);
    setFormData({ bloodType: '', urgency: '', notes: '' });
  };

  return (
    <DashboardLayout>
      <PageWrapper>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Hospital Dashboard</h1>
          <p className="text-gray-600">Manage blood requests and events</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard title="Active Requests" value="5" icon={FileText} />
          <StatsCard title="Total Responses" value="28" icon={Users} color="green" />
          <StatsCard title="Upcoming Events" value="2" icon={Calendar} color="blue" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Create Blood Request</h2>
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="text-red-600 hover:text-red-700"
                >
                  {showCreateForm ? 'Cancel' : 'New Request'}
                </button>
              </div>

              {showCreateForm && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Blood Type
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

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Urgency Level
                      </label>
                      <select
                        value={formData.urgency}
                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                        required
                      >
                        <option value="">Select Urgency</option>
                        {urgencyLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <FormInput
                        label="Additional Notes"
                        type="text"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Provide additional context..."
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Create Request</span>
                  </button>
                </form>
              )}

              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Active Requests</h3>
                <div className="space-y-4">
                  {activeRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xl font-bold text-red-600">{request.bloodType}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              request.urgency === 'Critical' ? 'bg-red-100 text-red-800' :
                              request.urgency === 'High' ? 'bg-orange-100 text-orange-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {request.urgency}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{request.notes}</p>
                          <p className="text-xs text-gray-500 mt-1">Created {request.createdAt}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          <Users className="h-4 w-4 inline mr-1" />
                          {request.responses} responses
                        </span>
                        <button className="text-sm text-red-600 hover:text-red-700 font-semibold">
                          View Responses
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/hospital/create-event')}
                  className="flex items-center justify-center space-x-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create Event</span>
                </button>
                <button
                  onClick={() => navigate('/hospital/events')}
                  className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition"
                >
                  <Calendar className="h-5 w-5" />
                  <span>My Events</span>
                </button>
              </div>
            </div>
          </div>

          <div>
            <ProfileCard />
          </div>
        </div>
      </PageWrapper>
    </DashboardLayout>
  );
};
