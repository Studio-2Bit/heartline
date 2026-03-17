import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Award, Calendar, ArrowRight } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import { PageWrapper } from '../components/PageWrapper';
import { EventCard } from '../components/EventCard';
import api from '../services/api';

const reasons = [
  {
    icon: Heart,
    title: 'Save Lives',
    description: 'One donation can save up to three lives. Your contribution makes a real difference.'
  },
  {
    icon: Users,
    title: 'Join Community',
    description: 'Be part of a community of heroes who regularly donate blood to help others.'
  },
  {
    icon: Award,
    title: 'Stay Healthy',
    description: 'Regular blood donation has health benefits and includes free health screenings.'
  }
];

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

export const Home = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/events');
      setEvents(data.events.slice(0, 3));
    } catch {
      // silent fail
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageWrapper>

        {/* Hero */}
        <div
          className="relative bg-cover bg-center h-[600px] flex items-center"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/6823567/pexels-photo-6823567.jpeg?auto=compress&cs=tinysrgb&w=1920')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/90 to-red-600/70" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Smart Blood Donation Network
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">
              Connecting compassionate donors with hospitals in need. Save lives, build community, make a difference today.
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition transform hover:scale-105 flex items-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          {/* Why Donate */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Donate Blood?</h2>
            <p className="text-xl text-gray-600">Every donation makes a difference</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {reasons.map((reason, index) => {
              const Icon = reason.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition transform hover:-translate-y-2"
                >
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{reason.title}</h3>
                  <p className="text-gray-600">{reason.description}</p>
                </div>
              );
            })}
          </div>

          {/* Upcoming Events */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-2">Upcoming Events</h2>
                <p className="text-xl text-gray-600">Join our next blood donation drive</p>
              </div>
              <button
                onClick={() => navigate('/events')}
                className="hidden md:flex items-center space-x-2 text-red-600 hover:text-red-700 font-semibold"
              >
                <span>View All Events</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            {/* Loading skeletons */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!isLoading && events.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No upcoming events right now</p>
              </div>
            )}

            {/* Events grid */}
            {!isLoading && events.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            )}

            <button
              onClick={() => navigate('/events')}
              className="md:hidden w-full mt-6 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
            >
              View All Events
            </button>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-xl p-12 text-center text-white">
            <Calendar className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-xl mb-6 max-w-2xl mx-auto">
              Register today and join thousands of donors who are saving lives every day
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition transform hover:scale-105"
            >
              Register Now
            </button>
          </div>
        </div>
      </PageWrapper>
    </MainLayout>
  );
};