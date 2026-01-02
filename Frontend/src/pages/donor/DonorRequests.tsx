import { useState } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { PageWrapper } from '../../components/PageWrapper';
import { RequestCard } from '../../components/RequestCard';

const allRequests = [
  {
    id: '1',
    bloodType: 'O+',
    urgency: 'Critical',
    location: 'City General Hospital, 2km away',
    hospital: 'City General Hospital',
    timeAgo: '15 minutes ago',
    notes: 'Emergency surgery patient needs immediate transfusion'
  },
  {
    id: '2',
    bloodType: 'O+',
    urgency: 'High',
    location: 'Metropolitan Hospital, 5km away',
    hospital: 'Metropolitan Hospital',
    timeAgo: '1 hour ago',
    notes: 'Cancer patient requires blood for chemotherapy'
  },
  {
    id: '3',
    bloodType: 'O+',
    urgency: 'Medium',
    location: 'St. Mary\'s Hospital, 8km away',
    hospital: 'St. Mary\'s Hospital',
    timeAgo: '3 hours ago',
    notes: 'Routine surgery scheduled for tomorrow'
  },
  {
    id: '4',
    bloodType: 'A+',
    urgency: 'Low',
    location: 'Regional Medical Center, 12km away',
    hospital: 'Regional Medical Center',
    timeAgo: '5 hours ago',
    notes: 'Building blood bank inventory'
  },
  {
    id: '5',
    bloodType: 'O+',
    urgency: 'High',
    location: 'University Hospital, 6km away',
    hospital: 'University Hospital',
    timeAgo: '6 hours ago',
    notes: 'Trauma patient in ICU'
  }
];

export const DonorRequests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [requests] = useState(allRequests);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUrgency = selectedUrgency === 'all' || request.urgency === selectedUrgency;
    return matchesSearch && matchesUrgency;
  });

  return (
    <DashboardLayout>
      <PageWrapper>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Blood Requests</h1>
          <p className="text-gray-600">Find and respond to blood donation requests near you</p>
        </div>

        <div className="mb-6 bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by hospital or location..."
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              {...request}
              onRespond={() => alert('Thank you! Your response has been submitted.')}
            />
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No blood requests found matching your criteria.</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </PageWrapper>
    </DashboardLayout>
  );
};
