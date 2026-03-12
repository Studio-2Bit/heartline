import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, MapPin, Users, Trash2, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { PageWrapper } from '../../components/PageWrapper';
import { formatDate } from '../../utils/helpers';
import { getHospitalEventsApi, cancelEventApi } from '../../services/event.api';
import { getEventRegistrationsApi } from '../../services/EventRegister.api';

interface Event {
  _id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  expectedDonors?: number;
  status: 'pending' | 'active' | 'rejected' | 'cancelled';
  createdAt: string;
}

interface Registration {
  _id: string;
  fullName: string;
  bloodType: string;
  timeSlot: string;
  status: string;
}

interface RegistrationsMap {
  [eventId: string]: Registration[];
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

export const HospitalEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationsMap>({});
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getHospitalEventsApi();
      setEvents(data.data.events);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRegistrations = async (eventId: string) => {
    if (registrations[eventId]) {
      // already loaded — just toggle
      setExpandedEvent(expandedEvent === eventId ? null : eventId);
      return;
    }
    try {
      const data = await getEventRegistrationsApi(eventId);
      setRegistrations((prev) => ({ ...prev, [eventId]: data.data.registrations }));
      setExpandedEvent(eventId);
    } catch (err) {
      alert('Failed to fetch registrations');
    }
  };

  const handleCancel = async (eventId: string) => {
    if (!confirm('Are you sure you want to cancel this event?')) return;
    try {
      await cancelEventApi(eventId);
      setEvents((prev) =>
        prev.map((e) => (e._id === eventId ? { ...e, status: 'cancelled' } : e))
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel event');
    }
  };

  const activeEvents = events.filter((e) => ['active', 'pending'].includes(e.status));
  const pastEvents = events.filter((e) => ['cancelled', 'rejected'].includes(e.status));

  return (
    <DashboardLayout>
      <PageWrapper>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Events</h1>
            <p className="text-gray-600">Manage your blood donation events</p>
          </div>
          <button
            onClick={() => navigate('/hospital/create-event')}
            className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            <Plus className="h-5 w-5" />
            <span>Create Event</span>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-16 text-gray-500">Loading events...</div>
        )}

        {/* Active / Pending Events */}
        {!isLoading && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Active & Pending Events</h2>
            {activeEvents.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <p className="text-gray-500">No active events. Create one!</p>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeEvents.map((event) => (
                <div key={event._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="text-sm">{formatDate(event.date)} at {event.time}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="text-sm">{event.location}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[event.status]}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </div>

                  {event.expectedDonors && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Registrations</span>
                        <span className="font-semibold">
                          {registrations[event._id]?.length || 0} / {event.expectedDonors}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min(((registrations[event._id]?.length || 0) / event.expectedDonors) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 mb-4">
                    <button
                      onClick={() => fetchRegistrations(event._id)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition"
                    >
                      <Users className="h-4 w-4" />
                      <span>{expandedEvent === event._id ? 'Hide' : 'View'} Registrations</span>
                    </button>
                    <button
                      onClick={() => handleCancel(event._id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Registrations list */}
                  {expandedEvent === event._id && (
                    <div className="border-t border-gray-100 pt-4">
                      {registrations[event._id]?.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">No registrations yet</p>
                      ) : (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {registrations[event._id].map((reg) => (
                            <div key={reg._id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 text-sm">
                              <div>
                                <p className="font-semibold text-gray-800">{reg.fullName}</p>
                                <p className="text-gray-500">{reg.timeSlot}</p>
                              </div>
                              <div className="text-right">
                                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                  {reg.bloodType}
                                </span>
                                <p className={`text-xs mt-1 font-semibold ${
                                  reg.status === 'attended' ? 'text-green-600' :
                                  reg.status === 'cancelled' ? 'text-red-500' : 'text-yellow-600'
                                }`}>
                                  {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cancelled / Rejected Events */}
        {!isLoading && pastEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Cancelled & Rejected Events</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pastEvents.map((event) => (
                <div key={event._id} className="bg-white rounded-xl shadow-md p-6 opacity-75">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="text-sm">{formatDate(event.date)} at {event.time}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="text-sm">{event.location}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[event.status]}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </PageWrapper>
    </DashboardLayout>
  );
};