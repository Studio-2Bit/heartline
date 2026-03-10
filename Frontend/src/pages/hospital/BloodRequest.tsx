import { useState, useEffect } from 'react';
import { Clock, XCircle, Droplet, Phone, User, AlertCircle, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { PageWrapper } from '../../components/PageWrapper';
import { getHospitalRequestsApi, updateRequestStatusApi } from '../../services/Bloodrequest.api';

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

const urgencyColors: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
};

export const BloodRequestHistory = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'cancelled'>('active');
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getHospitalRequestsApi();
       console.log('RESPONSE:', data);        
    console.log('REQUESTS:', data.data);   
      setRequests(data.data.requests);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this request?')) return;
    try {
      await updateRequestStatusApi(id, 'cancelled');
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: 'cancelled' } : r))
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel request');
    }
  };

  const filtered = requests.filter((r) =>
    activeTab === 'active' ? r.status === 'active' : r.status === 'cancelled'
  );

  return (
    <DashboardLayout>
      <PageWrapper>
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Blood Request History</h1>
            <p className="text-gray-600">Manage and track your blood donation requests</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition ${
                activeTab === 'active'
                  ? 'bg-red-600 text-white shadow'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              Active
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'active' ? 'bg-white text-red-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {requests.filter((r) => r.status === 'active').length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('cancelled')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition ${
                activeTab === 'cancelled'
                  ? 'bg-gray-700 text-white shadow'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <XCircle className="h-4 w-4" />
              Cancelled
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'cancelled' ? 'bg-white text-gray-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {requests.filter((r) => r.status === 'cancelled').length}
              </span>
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
            <div className="text-center py-16 text-gray-500">Loading requests...</div>
          )}

          {/* Empty */}
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl shadow-md">
              <Droplet className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No {activeTab} requests found</p>
            </div>
          )}

          {/* Cards */}
          {!isLoading && (
            <div className="space-y-4">
              {filtered.map((request) => (
                <div key={request._id} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <Droplet className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          Blood Type: {request.bloodType}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString('en-US', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${urgencyColors[request.urgency] || 'bg-gray-100 text-gray-600'}`}>
                        {request.urgency}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        request.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
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
                    <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3 mb-4">
                      {request.notes}
                    </p>
                  )}

                  {request.status === 'active' && (
                    <div className="flex justify-end">
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
              ))}
            </div>
          )}

        </div>
      </PageWrapper>
    </DashboardLayout>
  );
};