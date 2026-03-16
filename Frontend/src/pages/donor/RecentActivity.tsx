import { useState, useEffect } from 'react';
import { Droplet, Calendar, MapPin, Clock, CheckCircle, XCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { PageWrapper } from '../../components/PageWrapper';
import api from '../../services/api';

// ── Types ───────────────────────────────────────────────────────────
interface BloodResponse {
  _id: string;
  createdAt: string;
  request: {
    _id: string;
    bloodType: string;
    urgency: string;
    status: string;
    hospitalName: string;
  };
}

interface EventRegistration {
  _id: string;
  fullName: string;
  bloodType: string;
  timeSlot: string;
  status: 'registered' | 'attended' | 'cancelled';
  createdAt: string;
  event: {
    _id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    status: string;
  };
}

// ── Color helpers ───────────────────────────────────────────────────
const urgencyColors: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
};

const registrationStatusColors: Record<string, string> = {
  registered: 'bg-blue-100 text-blue-700',
  attended: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

const requestStatusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  fulfilled: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

// ── Main Page ───────────────────────────────────────────────────────
export const DonorActivity = () => {
  const [activeTab, setActiveTab] = useState<'responses' | 'registrations'>('responses');

  const [responses, setResponses] = useState<BloodResponse[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [isLoadingResponses, setIsLoadingResponses] = useState(false);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(false);
  const [errorResponses, setErrorResponses] = useState('');
  const [errorRegistrations, setErrorRegistrations] = useState('');

  useEffect(() => { fetchResponses(); fetchRegistrations(); }, []);

  const fetchResponses = async () => {
    setIsLoadingResponses(true);
    setErrorResponses('');
    try {
      const { data } = await api.get('/blood-request-responses/donor');
      setResponses(data.responses);
    } catch (err: any) {
      setErrorResponses(err.response?.data?.message || 'Failed to fetch responses');
    } finally {
      setIsLoadingResponses(false);
    }
  };

  const fetchRegistrations = async () => {
    setIsLoadingRegistrations(true);
    setErrorRegistrations('');
    try {
      const { data } = await api.get('/event-registrations/donor');
      setRegistrations(data.registrations);
    } catch (err: any) {
      setErrorRegistrations(err.response?.data?.message || 'Failed to fetch registrations');
    } finally {
      setIsLoadingRegistrations(false);
    }
  };

  const handleCancelRegistration = async (id: string) => {
    if (!confirm('Cancel this event registration?')) return;
    try {
      await api.patch(`/event-registrations/${id}/cancel`);
      setRegistrations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: 'cancelled' } : r))
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel registration');
    }
  };

  return (
    <DashboardLayout>
      <PageWrapper>
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">My Activity</h1>
            <p className="text-gray-600">Track your blood request responses and event registrations</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setActiveTab('responses')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition ${
                activeTab === 'responses'
                  ? 'bg-red-600 text-white shadow'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Droplet className="h-4 w-4" />
              Blood Responses
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'responses' ? 'bg-white text-red-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {responses.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('registrations')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition ${
                activeTab === 'registrations'
                  ? 'bg-red-600 text-white shadow'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Calendar className="h-4 w-4" />
              Event Registrations
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'registrations' ? 'bg-white text-red-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {registrations.length}
              </span>
            </button>
          </div>

          {/* ── Blood Responses Tab ── */}
          {activeTab === 'responses' && (
            <>
              {errorResponses && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-red-700 text-sm">{errorResponses}</p>
                </div>
              )}

              {isLoadingResponses && (
                <div className="text-center py-16 text-gray-400">Loading...</div>
              )}

              {!isLoadingResponses && responses.length === 0 && (
                <div className="text-center py-16 bg-white rounded-xl shadow-md">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">You haven't responded to any blood requests yet</p>
                 
                </div>
              )}

              <div className="space-y-3">
                {responses.map((item) => (
                  <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-red-100 p-2 rounded-lg">
                          <Droplet className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          
                          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Responded on {new Date(item.createdAt).toLocaleDateString('en-US', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        {item.request?.urgency && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${urgencyColors[item.request.urgency] || 'bg-gray-100 text-gray-600'}`}>
                            {item.request.urgency}
                          </span>
                        )}
                        {item.request?.status && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${requestStatusColors[item.request.status] || 'bg-gray-100 text-gray-500'}`}>
                            {item.request.status.charAt(0).toUpperCase() + item.request.status.slice(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── Event Registrations Tab ── */}
          {activeTab === 'registrations' && (
            <>
              {errorRegistrations && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-red-700 text-sm">{errorRegistrations}</p>
                </div>
              )}

              {isLoadingRegistrations && (
                <div className="text-center py-16 text-gray-400">Loading...</div>
              )}

              {!isLoadingRegistrations && registrations.length === 0 && (
                <div className="text-center py-16 bg-white rounded-xl shadow-md">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">You haven't registered for any events yet</p>
                 
                </div>
              )}

              <div className="space-y-3">
                {registrations.map((item) => (
                  <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-red-100 p-2 rounded-lg">
                          <Calendar className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{item.event?.title ?? 'Event'}</h3>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Registered on {new Date(item.createdAt).toLocaleDateString('en-US', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${registrationStatusColors[item.status] || 'bg-gray-100 text-gray-500'}`}>
                        {item.status === 'registered' && <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" />Registered</span>}
                        
                      </span>
                    </div>

                    {/* Event details */}
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{item.event?.date
                          ? new Date(item.event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                          : '—'
                        } at {item.event?.time ?? '—'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{item.event?.location ?? '—'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Time slot: {item.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Droplet className="h-3.5 w-3.5" />
                        <span>Blood type: {item.bloodType}</span>
                      </div>
                    </div>

                    {/* Cancel button — only if registered and event still active */}
                    {item.status === 'registered' && item.event?.status === 'active' && (
                      <div className="flex justify-end border-t border-gray-100 pt-3">
                        <button
                          onClick={() => handleCancelRegistration(item._id)}
                          className="flex items-center gap-2 text-sm font-semibold text-red-600 border border-red-200 px-4 py-1.5 rounded-lg hover:bg-red-50 transition"
                        >
                          <XCircle className="h-4 w-4" />
                          Cancel Registration
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </PageWrapper>
    </DashboardLayout>
  );
};