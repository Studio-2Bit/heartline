import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, MapPin, Users, Edit, Trash2 } from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { PageWrapper } from '../../components/PageWrapper';
import { formatDate, formatTime } from '../../utils/helpers';

const myEvents = [
  {
    id: '1',
    title: 'Community Blood Drive',
    date: '2025-01-15T10:00:00',
    location: 'City Community Center, Downtown',
    expectedDonors: 150,
    registeredDonors: 87,
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Corporate Blood Donation Day',
    date: '2025-01-25T11:00:00',
    location: 'Tech Hub Convention Center',
    expectedDonors: 200,
    registeredDonors: 142,
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Monthly Blood Camp',
    date: '2024-12-20T09:00:00',
    location: 'City General Hospital',
    expectedDonors: 100,
    registeredDonors: 95,
    status: 'completed'
  }
];

export const HospitalEvents = () => {
  const navigate = useNavigate();

  const upcomingEvents = myEvents.filter(e => e.status === 'upcoming');
  const completedEvents = myEvents.filter(e => e.status === 'completed');

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

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Events</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">{formatDate(event.date)} at {formatTime(event.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                    Upcoming
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Registered Donors</span>
                    <span className="font-semibold">{event.registeredDonors} / {event.expectedDonors}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full transition-all"
                      style={{ width: `${(event.registeredDonors / event.expectedDonors) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition">
                    <Users className="h-4 w-4" />
                    <span>View Registrations</span>
                  </button>
                  <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Completed Events</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-md p-6 opacity-75">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </div>
                  </div>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                    Completed
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Donors</span>
                    <span className="text-lg font-bold text-gray-800">{event.registeredDonors}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageWrapper>
    </DashboardLayout>
  );
};
