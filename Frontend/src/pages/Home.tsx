import { useNavigate } from 'react-router-dom';
import { Heart, Users, Award, Calendar, ArrowRight } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import { PageWrapper } from '../components/PageWrapper';
import { EventCard } from '../components/EventCard';

const upcomingEvents = [
  {
    id: '1',
    title: 'Community Blood Drive',
    date: '2025-01-15T10:00:00',
    location: 'City Community Center, Downtown',
    hospital: 'City General Hospital',
    description: 'Join us for our monthly community blood drive. Your donation can save up to 3 lives!'
  },
  {
    id: '2',
    title: 'Emergency Blood Donation Camp',
    date: '2025-01-20T09:00:00',
    location: 'Central Park Plaza',
    hospital: 'Metropolitan Hospital',
    description: 'Critical need for O+ and AB- blood types. Walk-ins welcome!'
  },
  {
    id: '3',
    title: 'Corporate Blood Donation Day',
    date: '2025-01-25T11:00:00',
    location: 'Tech Hub Convention Center',
    hospital: 'University Medical Center',
    description: 'Special corporate event with free health checkups for all donors.'
  }
];

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

export const Home = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <PageWrapper>
        <div
          className="relative bg-cover bg-center h-[600px] flex items-center"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/6823567/pexels-photo-6823567.jpeg?auto=compress&cs=tinysrgb&w=1920')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/90 to-red-600/70"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>

            <button
              onClick={() => navigate('/events')}
              className="md:hidden w-full mt-6 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
            >
              View All Events
            </button>
          </div>

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
