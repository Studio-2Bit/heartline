import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { MainLayout } from '../layouts/MainLayout';
import { PageWrapper } from '../components/PageWrapper';
import { EventCard } from '../components/EventCard';
import { getAllActiveEventsApi } from '../services/event.api';

interface Event {
  _id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  expectedDonors?: number;
  contactPerson: string;
  contactPhone: string;
  status: string;
  hospitalId: {
    _id: string;
    name: string;
  };
}

export const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getAllActiveEventsApi();
      setEvents(data.data.events);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.hospitalId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
  
      <PageWrapper>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-700 mb-2">
              Upcoming Blood Donation Events
            </h1>
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

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-12 text-gray-500">Loading events...</div>
          )}

          {/* Cards */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event._id}
                  id={event._id}
                  title={event.title}
                  date={event.date}
                  location={event.location}
                  hospital={event.hospitalId?.name || 'Unknown Hospital'}
                  description={event.description}
                />
              ))}
            </div>
          )}

          {!isLoading && filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No events found matching your search.</p>
            </div>
          )}
        </div>
      </PageWrapper>
   
    </DashboardLayout>
  );
};