// DonorDashboard.tsx
import { useNavigate } from 'react-router-dom';
import { Droplet, Calendar, MapPin, Bell, Edit } from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { PageWrapper } from '../../components/PageWrapper';
import { ProfileCard } from '../../components/ProfileCard';
import { RequestCard } from '../../components/RequestCard';
import { EventCard } from '../../components/EventCard';
import { StatsCard } from '../../components/StatsCard';
import Chatbot from "./Chatbot"; 

const nearbyRequests = [
  { id: '1', bloodType: 'O+', urgency: 'Critical', location: 'City General Hospital, 2km away', hospital: 'City General Hospital', timeAgo: '15 minutes ago', notes: 'Emergency surgery patient needs immediate transfusion' },
  { id: '2', bloodType: 'O+', urgency: 'High', location: 'Metropolitan Hospital, 5km away', hospital: 'Metropolitan Hospital', timeAgo: '1 hour ago', notes: 'Cancer patient requires blood for chemotherapy' }
];

const upcomingEvents = [
  { id: '1', title: 'Community Blood Drive', date: '2025-01-15T10:00:00', location: 'City Community Center', hospital: 'City General Hospital', description: 'Join us for our monthly community blood drive.' }
];

const recentNotifications = [
  { id: '1', message: 'New blood request matches your type', time: '5 min ago' },
  { id: '2', message: 'Upcoming event tomorrow at 10:00 AM', time: '1 hour ago' },
  { id: '3', message: 'Your profile has been verified', time: '2 hours ago' }
];

export const DonorDashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <PageWrapper>
        {/* Dashboard Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-700">Welcome back! Here's your donation overview</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard title="Total Donations" value="12" icon={Droplet} />
          <StatsCard title="Lives Saved" value="36" icon={Droplet} color="green" />
          <StatsCard title="Upcoming Events" value="3" icon={Calendar} color="blue" />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Nearby Requests */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Nearby Blood Requests</h2>
                <button onClick={() => navigate('/donor/requests')} className="text-red-600 hover:text-red-700 font-semibold text-sm">View All</button>
              </div>
              <div className="space-y-4">
                {nearbyRequests.map((request) => (
                  <RequestCard key={request.id} {...request} onRespond={() => alert('Response submitted!')} />
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
                <button onClick={() => navigate('/events')} className="text-red-600 hover:text-red-700 font-semibold text-sm">View All</button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div>
              <ProfileCard />
              <button onClick={() => navigate('/donor/profile')} className="w-full mt-4 flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition">
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Recent Notifications</h3>
                <Bell className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {recentNotifications.map((notif) => (
                  <div key={notif.id} className="border-l-2 border-red-600 pl-3">
                    <p className="text-sm text-gray-700">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/notifications')} className="w-full mt-4 text-red-600 hover:text-red-700 font-semibold text-sm">View All Notifications</button>
            </div>
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