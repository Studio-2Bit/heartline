import { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { PageWrapper } from '../../components/PageWrapper';
import { RequestCard } from '../../components/RequestCard';
import { getAllActiveRequestsApi, respondToRequestApi } from '../../services/Bloodrequest.api';
import Chatbot from './Chatbot';

interface BloodRequest {
  _id: string;
  bloodType: string;
  urgency: string;
  unitsNeeded: number;
  contactPerson: string;
  contactPhone: string;
  notes?: string;
  status: string;
  createdAt: string;
  hospitalId: {
    _id: string;
    name: string;
    email: string;
  };
}

export const DonorRequests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
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
      const data = await getAllActiveRequestsApi();
      setRequests(data.data.requests);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespond = async (requestId: string) => {
  try {
    await respondToRequestApi(requestId);
    alert('Thank you! Your response has been submitted.');
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to submit response');
  }
};

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${mins} minute${mins > 1 ? 's' : ''} ago`;
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.hospitalId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.bloodType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUrgency =
      selectedUrgency === 'all' || request.urgency === selectedUrgency;
    return matchesSearch && matchesUrgency;
  });

  return (
    <DashboardLayout>
      <PageWrapper>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-700">
            Find and respond to blood donation requests near you
          </h1>
        </div>

        <div className="mb-6 bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by hospital or blood type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
            </div>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            >
              <option value="all">All Urgency Levels</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12 text-gray-500">Loading requests...</div>
        )}

        {/* Cards */}
        {!isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRequests.map((request) => (
              <RequestCard
                key={request._id}
                id={request._id}
                bloodType={request.bloodType}
                urgency={request.urgency}
                hospital={request.hospitalId?.name || 'Unknown Hospital'}
                location={request.hospitalId?.name || 'Unknown Location'}
                timeAgo={timeAgo(request.createdAt)}
                notes={request.notes || ''}
                onRespond={() => handleRespond(request._id)}
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && filteredRequests.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No blood requests found matching your criteria.</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </PageWrapper>
      <div className="fixed bottom-8 left-8 z-50">
              <Chatbot />
            </div>
    </DashboardLayout>
  );
};