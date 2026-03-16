import { useState, useEffect } from 'react';
import { Clock, XCircle, Droplet, Phone, User, AlertCircle, CheckCircle, ChevronDown, MapPin, MessageSquare, X } from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { PageWrapper } from '../../components/PageWrapper';
import { getHospitalRequestsApi, updateRequestStatusApi, getDonorSuggestionsApi, getRequestResponsesApi } from '../../services/Bloodrequest.api';

interface BloodRequest {
  _id: string;
  bloodType: string;
  urgency: string;
  unitsNeeded: number;
  contactPerson: string;
  contactPhone: string;
  notes?: string;
  status: 'active' | 'fulfilled' | 'cancelled';
  createdAt: string;
}

interface DonorInfo {
  _id: string;
  name: string;
  bloodType: string;
  phone: string;
  location: string;
  availabilityStatus: string;
}

interface Suggestion extends DonorInfo {
  distance: number | null;
  totalDonations: number;
}

interface Response {
  _id: string;
  createdAt: string;
  donor: DonorInfo;
}

interface ExpandedData {
  suggestions: Suggestion[];
  responses: Response[];
  isLoading: boolean;
}

const urgencyColors: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
};

// ── Donor Modal ─────────────────────────────────────────────────────
const DonorModal = ({ donor, onClose }: { donor: DonorInfo | null; onClose: () => void }) => {
  if (!donor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>

        {/* Avatar + Name */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-xl">
            {donor.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{donor.name}</h2>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              donor.availabilityStatus === 'available'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}>
              {donor.availabilityStatus === 'available' ? '✓ Available' : '✗ Unavailable'}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
            <Droplet className="h-4 w-4 text-red-500" />
            <div>
              <p className="text-xs text-gray-500">Blood Type</p>
              <p className="text-sm font-bold text-gray-800">{donor.bloodType}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
            <MapPin className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="text-sm font-semibold text-gray-800">{donor.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
            <Phone className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="text-sm font-semibold text-gray-800">{donor.phone}</p>
            </div>
          </div>
        </div>

        {/* Call Button */}
        <a
          href={`tel:${donor.phone}`}
          className="mt-5 w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold"
        >
          <Phone className="h-4 w-4" />
          Call Donor
        </a>
      </div>
    </div>
  );
};

// ── Main Page ───────────────────────────────────────────────────────
export const BloodRequestHistory = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'cancelled'>('active');
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedData, setExpandedData] = useState<Record<string, ExpandedData>>({});
  const [selectedDonor, setSelectedDonor] = useState<DonorInfo | null>(null);

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getHospitalRequestsApi();
      setRequests(data.data.requests);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpand = async (requestId: string) => {
    if (expandedId === requestId) { setExpandedId(null); return; }
    setExpandedId(requestId);
    if (expandedData[requestId]) return;

    setExpandedData((prev) => ({ ...prev, [requestId]: { suggestions: [], responses: [], isLoading: true } }));

    try {
      const [sRes, rRes] = await Promise.all([
        getDonorSuggestionsApi(requestId),
        getRequestResponsesApi(requestId),
      ]);
      setExpandedData((prev) => ({
        ...prev,
        [requestId]: {
          suggestions: sRes.data.suggestions,
          responses: rRes.data.responses,
          isLoading: false,
        },
      }));
    } catch {
      setExpandedData((prev) => ({ ...prev, [requestId]: { suggestions: [], responses: [], isLoading: false } }));
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this request?')) return;
    try {
      await updateRequestStatusApi(id, 'cancelled');
      setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status: 'cancelled' } : r)));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const filtered = requests.filter((r) =>
    activeTab === 'active' ? r.status === 'active' : r.status === 'cancelled'
  );

  return (
    <DashboardLayout>
      <PageWrapper>
        <div className="max-w-4xl mx-auto">

          <DonorModal donor={selectedDonor} onClose={() => setSelectedDonor(null)} />

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Blood Request History</h1>
            <p className="text-gray-600">Manage and track your blood donation requests</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mb-6">
            {(['active', 'cancelled'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition ${
                  activeTab === tab
                    ? tab === 'active' ? 'bg-red-600 text-white shadow' : 'bg-gray-700 text-white shadow'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {tab === 'active' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === tab ? 'bg-white text-gray-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {requests.filter((r) => r.status === tab).length}
                </span>
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {isLoading && <div className="text-center py-16 text-gray-500">Loading requests...</div>}

          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl shadow-md">
              <Droplet className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No {activeTab} requests found</p>
            </div>
          )}

          {!isLoading && (
            <div className="space-y-4">
              {filtered.map((request) => {
                const data = expandedData[request._id];
                const isExpanded = expandedId === request._id;

                return (
                  <div key={request._id} className="bg-white rounded-xl shadow-md border border-gray-100">

                    {/* Card Header */}
                    <button
                      onClick={() => handleExpand(request._id)}
                      className="w-full p-6 hover:bg-gray-50 transition text-left"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-red-100 p-2 rounded-lg">
                            <Droplet className="h-6 w-6 text-red-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-800">Blood Type: {request.bloodType}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(request.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${urgencyColors[request.urgency] || 'bg-gray-100 text-gray-600'}`}>
                            {request.urgency}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${request.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                          <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{request.unitsNeeded} person{request.unitsNeeded > 1 ? 's' : ''} needed</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>{request.contactPerson}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{request.contactPhone}</span>
                        </div>
                      </div>
                      {request.notes && (
                        <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3 mt-4">{request.notes}</p>
                      )}
                    </button>

                    {/* Expanded */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 px-6 py-5 space-y-6">
                        {data?.isLoading && (
                          <div className="text-center py-6 text-gray-400 text-sm">Loading...</div>
                        )}

                        {!data?.isLoading && (
                          <>
                            {/* Suggested Donors */}
                            <div>
                              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <User className="h-4 w-4 text-red-600" />
                                Suggested Donors
                                <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-bold">
                                  {data?.suggestions.length || 0}
                                </span>
                              </h4>
                              {data?.suggestions.length === 0 ? (
                                <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4">No available donors for blood type {request.bloodType}</p>
                              ) : (
                                <div className="space-y-2">
                                  {data.suggestions.map((donor) => (
                                    <button
                                      key={donor._id}
                                      onClick={() => setSelectedDonor(donor)}
                                      className="w-full flex items-center justify-between bg-gray-50 hover:bg-red-50 rounded-lg px-4 py-3 transition text-left"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-xs">
                                          {donor.name.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                          <p className="font-semibold text-gray-800 text-sm">{donor.name}</p>
                                          <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />{donor.location}
                                            {donor.distance !== null && ` · ${donor.distance} km`}
                                          </p>
                                        </div>
                                      </div>
                                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold">{donor.bloodType}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Donor Responses */}
                            <div>
                              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-blue-600" />
                                Donor Responses
                                <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full font-bold">
                                  {data?.responses.length || 0}
                                </span>
                              </h4>
                              {data?.responses.length === 0 ? (
                                <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4">No donors have responded yet</p>
                              ) : (
                                <div className="space-y-2">
                                  {data.responses.map((response) => (
                                    <button
                                      key={response._id}
                                      onClick={() => setSelectedDonor(response.donor)}
                                      className="w-full flex items-center justify-between bg-blue-50 hover:bg-blue-100 rounded-lg px-4 py-3 transition text-left"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">
                                          {response.donor.name.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                          <p className="font-semibold text-gray-800 text-sm">{response.donor.name}</p>
                                          <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />{response.donor.location}
                                          </p>
                                        </div>
                                      </div>
                                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold">{response.donor.bloodType}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </>
                        )}

                        {request.status === 'active' && (
                          <div className="flex justify-end pt-2 border-t border-gray-100">
                            <button
                              onClick={() => handleCancel(request._id)}
                              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                            >
                              <XCircle className="h-4 w-4" />
                              Cancel Request
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </PageWrapper>
    </DashboardLayout>
  );
};