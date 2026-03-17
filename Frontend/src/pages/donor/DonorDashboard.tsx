import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet, Calendar, Edit, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { PageWrapper } from '../../components/PageWrapper';
import { ProfileCard } from '../../components/ProfileCard';
import { RequestCard } from '../../components/RequestCard';
import { EventCard } from '../../components/EventCard';
import { StatsCard } from '../../components/StatsCard';
import Chatbot from './Chatbot';
import api from '../../services/api';
import { respondToRequestApi } from '../../services/Bloodrequest.api';

interface DonorStats {
  totalDonations: number;
  livesSaved: number;
  bloodType: string;
  availabilityStatus: string;
  nextEligibleDate?: string;
}

interface BloodRequest {
  _id: string;
  bloodType: string;
  urgency: string;
  notes?: string;
  createdAt: string;
  hospitalId: {
    _id: string;
    name: string;
  };
}

interface Event {
  _id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  hospitalId: {
    _id: string;
    name: string;
  };
}

const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
  return `${Math.floor(hrs / 24)} day(s) ago`;
};

export const DonorDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState<DonorStats | null>(null);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [profileRes, requestsRes, eventsRes] = await Promise.all([
        api.get('/donor/profile'),
        api.get('/blood-requests'),
        api.get('/events'),
      ]);

      const profile = profileRes.data.profile;
      setStats({
        totalDonations: profile.totalDonations,
        livesSaved: profile.totalDonations * 3,
        bloodType: profile.bloodType,
        availabilityStatus: profile.availabilityStatus,
        nextEligibleDate: profile.nextEligibleDate,
      });

      // Show only matching blood type requests, max 2
      const allRequests: BloodRequest[] = requestsRes.data.requests;
      const matched = allRequests.filter(
        (r) => r.bloodType === profile.bloodType
      );
      setRequests((matched.length > 0 ? matched : allRequests).slice(0, 2));

      // Show max 2 upcoming events
      setEvents(eventsRes.data.events.slice(0, 2));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespond = async (requestId: string) => {
    try {
      await respondToRequestApi(requestId);
      alert('Response submitted successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit response');
    }
  };

  return (
    <DashboardLayout>
      <PageWrapper>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-700">
            Welcome back! Here's your donation overview
          </h1>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Donations"
            value={isLoading ? '—' : String(stats?.totalDonations ?? 0)}
            icon={Droplet}
          />
          <StatsCard
            title="Lives Saved"
            value={isLoading ? '—' : String(stats?.livesSaved ?? 0)}
            icon={Droplet}
            color="green"
          />
          <StatsCard
            title="Upcoming Events"
            value={isLoading ? '—' : String(events.length)}
            icon={Calendar}
            color="blue"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            {/* Nearby Blood Requests */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Nearby Blood Requests</h2>
                <button
                  onClick={() => navigate('/donor/requests')}
                  className="text-red-600 hover:text-red-700 font-semibold text-sm"
                >
                  View All
                </button>
              </div>

              {isLoading && (
                <div className="text-center py-8 text-gray-400">Loading requests...</div>
              )}

              {!isLoading && requests.length === 0 && (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <Droplet className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-gray-400">No active blood requests right now</p>
                </div>
              )}

              <div className="space-y-4">
                {requests.map((request) => (
                  <RequestCard
                    key={request._id}
                    id={request._id}
                    bloodType={request.bloodType}
                    urgency={request.urgency}
                    hospital={request.hospitalId?.name ?? 'Unknown Hospital'}
                    location={request.hospitalId?.name ?? ''}
                    timeAgo={timeAgo(request.createdAt)}
                    notes={request.notes}
                    onRespond={() => handleRespond(request._id)}
                  />
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
                <button
                  onClick={() => navigate('/events')}
                  className="text-red-600 hover:text-red-700 font-semibold text-sm"
                >
                  View All
                </button>
              </div>

              {isLoading && (
                <div className="text-center py-8 text-gray-400">Loading events...</div>
              )}

              {!isLoading && events.length === 0 && (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <Calendar className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-gray-400">No upcoming events right now</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {events.map((event) => (
                  <EventCard
                    key={event._id}
                    id={event._id}
                    title={event.title}
                    date={event.date}
                    location={event.location}
                    hospital={event.hospitalId?.name ?? 'Unknown'}
                    description={event.description}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div>
              <ProfileCard />
              <button
                onClick={() => navigate('/donor/profile')}
                className="w-full mt-4 flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Availability Status */}
            {stats && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-gray-800 mb-3">Donor Status</h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Blood Type</span>
                  <span className="bg-red-600 text-white text-sm font-bold px-3 py-0.5 rounded-full">
                    {stats.bloodType}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Availability</span>
                  <span className={`text-sm font-semibold px-3 py-0.5 rounded-full ${
                    stats.availabilityStatus === 'available'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {stats.availabilityStatus === 'available' ? '✓ Available' : '✗ Unavailable'}
                  </span>
                </div>
                {stats.nextEligibleDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Next Eligible</span>
                    <span className="text-sm font-semibold text-gray-700">
                      {new Date(stats.nextEligibleDate).toLocaleDateString('en-US', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Notifications placeholder */}
            
          </div>
        </div>
      </PageWrapper>

      {/* Fixed Chatbot */}
      <div className="fixed bottom-8 left-8 z-50">
        <Chatbot />
      </div>
    </DashboardLayout>
  );
};