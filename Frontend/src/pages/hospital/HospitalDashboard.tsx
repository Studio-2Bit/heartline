import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Users, Calendar, Trash2, AlertCircle, Droplet } from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { PageWrapper } from '../../components/PageWrapper';
import { ProfileCard } from '../../components/ProfileCard';
import { StatsCard } from '../../components/StatsCard';
import { FormInput } from '../../components/FormInput';
import { bloodTypes, urgencyLevels } from '../../utils/helpers';
import api from '../../services/api';
import {
  createBloodRequestApi,
  getHospitalRequestsApi,
  updateRequestStatusApi,
  getRequestResponsesApi,
} from '../../services/Bloodrequest.api';
import { getHospitalEventsApi } from '../../services/event.api';

interface BloodRequest {
  _id: string;
  bloodType: string;
  urgency: string;
  status: string;
  notes?: string;
  createdAt: string;
  unitsNeeded: number;
}

interface Event {
  _id: string;
  title: string;
  date: string;
  status: string;
}

const urgencyColors: Record<string, string> = {
  Critical: 'bg-red-100 text-red-800',
  High: 'bg-orange-100 text-orange-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-green-100 text-green-800',
};

const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
  return `${Math.floor(hrs / 24)} day(s) ago`;
};

export const HospitalDashboard = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [responseCounts, setResponseCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Create request form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    bloodType: '',
    urgency: '',
    unitsNeeded: '1',
    contactPerson: '',
    contactPhone: '',
    notes: '',
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [requestsRes, eventsRes] = await Promise.all([
        getHospitalRequestsApi(),
        getHospitalEventsApi(),
      ]);

      const allRequests: BloodRequest[] = requestsRes.data.requests;
      const activeRequests = allRequests.filter((r) => r.status === 'active');
      setRequests(activeRequests);
      setEvents(eventsRes.data.events.filter((e: Event) => ['active', 'pending'].includes(e.status)));

      // fetch response counts for each active request
      const counts: Record<string, number> = {};
      await Promise.all(
        activeRequests.slice(0, 5).map(async (r) => {
          try {
            const res = await getRequestResponsesApi(r._id);
            counts[r._id] = res.data.responses.length;
          } catch {
            counts[r._id] = 0;
          }
        })
      );
      setResponseCounts(counts);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await createBloodRequestApi({
        bloodType: formData.bloodType,
        urgency: formData.urgency,
        unitsNeeded: Number(formData.unitsNeeded),
        contactPerson: formData.contactPerson,
        contactPhone: formData.contactPhone,
        notes: formData.notes,
      });
      setShowCreateForm(false);
      setFormData({ bloodType: '', urgency: '', unitsNeeded: '1', contactPerson: '', contactPhone: '', notes: '' });
      await fetchAll();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create request');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this request?')) return;
    try {
      await updateRequestStatusApi(id, 'cancelled');
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel');
    }
  };

  // Stats
  const totalResponses = Object.values(responseCounts).reduce((a, b) => a + b, 0);

  return (
    <DashboardLayout>
      <PageWrapper>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-700">Manage blood requests and events</h1>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Active Requests"
            value={isLoading ? '—' : String(requests.length)}
            icon={FileText}
          />
          <StatsCard
            title="Total Responses"
            value={isLoading ? '—' : String(totalResponses)}
            icon={Users}
            color="green"
          />
          <StatsCard
            title="Upcoming Events"
            value={isLoading ? '—' : String(events.length)}
            icon={Calendar}
            color="blue"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            {/* Blood Requests Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Active Blood Requests</h2>
                <div className="flex items-center gap-3">
                  
                  <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="flex items-center gap-1 text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    <Plus className="h-4 w-4" />
                    New Request
                  </button>
                </div>
              </div>

              {/* Create Form */}
              {showCreateForm && (
                <form onSubmit={handleCreate} className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-4">New Blood Request</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                      <select
                        value={formData.bloodType}
                        onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
                        required
                      >
                        <option value="">Select Blood Type</option>
                        {bloodTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                      <select
                        value={formData.urgency}
                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
                        required
                      >
                        <option value="">Select Urgency</option>
                        {urgencyLevels.map((l) => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <FormInput
                      label="Units Needed"
                      type="number"
                      value={formData.unitsNeeded}
                      onChange={(e) => setFormData({ ...formData, unitsNeeded: e.target.value })}
                      required
                    />
                    <FormInput
                      label="Contact Person"
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="Name of contact"
                      required
                    />
                    <div className="md:col-span-2">
                      <FormInput
                        label="Contact Phone"
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        placeholder="+94 77 000 0000"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <FormInput
                        label="Additional Notes (Optional)"
                        type="text"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Provide additional context..."
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      {isCreating ? 'Creating...' : 'Create Request'}
                    </button>
                  </div>
                </form>
              )}

              {/* Requests List */}
              {isLoading && (
                <div className="text-center py-10 text-gray-400">Loading requests...</div>
              )}

              {!isLoading && requests.length === 0 && !showCreateForm && (
                <div className="text-center py-10">
                  <Droplet className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-gray-400">No active requests. Create one!</p>
                </div>
              )}

              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl font-bold text-red-600">{request.bloodType}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${urgencyColors[request.urgency] || 'bg-gray-100 text-gray-600'}`}>
                            {request.urgency}
                          </span>
                        </div>
                        {request.notes && (
                          <p className="text-sm text-gray-600">{request.notes}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">Created {timeAgo(request.createdAt)}</p>
                      </div>
                      <button
                        onClick={() => handleCancel(request._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Cancel request"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-sm text-gray-500 flex items-center gap-1 bg-gray-200">
                        <Users className="h-4 w-4" />
                        {responseCounts[request._id] ?? 0} responses
                      </span>
                      
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/hospital/create-event')}
                  className="flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
                >
                  <Plus className="h-5 w-5" />
                  Create Event
                </button>
                
                <button
                  onClick={() => navigate('/hospital/donor-mark')}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                >
                  <FileText className="h-5 w-5" />
                  Mark Donation
                </button>
                
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ProfileCard />

            {/* Upcoming Events */}
            {!isLoading && events.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Upcoming Events</h3>
                  <button
                    onClick={() => navigate('/hospital/events')}
                    className="text-xs text-red-600 font-semibold hover:text-red-700"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {events.slice(0, 3).map((event) => (
                    <div key={event._id} className="border-l-2 border-red-600 pl-3">
                      <p className="text-sm font-semibold text-gray-800">{event.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </PageWrapper>
    </DashboardLayout>
  );
};