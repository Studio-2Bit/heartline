import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import { PageWrapper } from '../components/PageWrapper';
import { EventCard } from '../components/EventCard';

const allEvents = [
  {
    id: '1',
    title: 'Community Blood Drive',
    date: '2025-01-15T10:00:00',
    location: 'City Community Center, Downtown',
    hospital: 'City General Hospital',
    description: 'Join us for our monthly community blood drive. Your donation can save up to 3 lives! Free refreshments and health screening for all donors.'
  },
  {
    id: '2',
    title: 'Emergency Blood Donation Camp',
    date: '2025-01-20T09:00:00',
    location: 'Central Park Plaza',
    hospital: 'Metropolitan Hospital',
    description: 'Critical need for O+ and AB- blood types. Walk-ins welcome! Mobile blood collection units will be available throughout the day.'
  },
  {
    id: '3',
    title: 'Corporate Blood Donation Day',
    date: '2025-01-25T11:00:00',
    location: 'Tech Hub Convention Center',
    hospital: 'University Medical Center',
    description: 'Special corporate event with free health checkups for all donors. Partnership with local tech companies to encourage workplace blood donation.'
  },
  {
    id: '4',
    title: 'Weekend Blood Drive',
    date: '2025-02-01T08:00:00',
    location: 'Riverside Mall',
    hospital: 'St. Mary\'s Hospital',
    description: 'Convenient weekend blood donation event at the mall. Shop and save lives!'
  },
  {
    id: '5',
    title: 'University Blood Donation Camp',
    date: '2025-02-05T10:00:00',
    location: 'State University Campus',
    hospital: 'University Medical Center',
    description: 'Special event for students and faculty. First-time donors receive educational materials about blood donation.'
  },
  {
    id: '6',
    title: 'Mobile Blood Drive - North District',
    date: '2025-02-10T09:00:00',
    location: 'North District Community Hall',
    hospital: 'Regional Medical Center',
    description: 'Bringing blood donation services to underserved communities. All blood types needed.'
  }
];

export const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [events] = useState(allEvents);

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.hospital.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <PageWrapper>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Upcoming Blood Donation Events</h1>
            <p className="text-xl text-gray-600">Find and join blood donation events near you</p>
          </div>

          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search events by location, hospital, or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
            </div>
            <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No events found matching your search.</p>
            </div>
          )}
        </div>
      </PageWrapper>
    </MainLayout>
  );
};
