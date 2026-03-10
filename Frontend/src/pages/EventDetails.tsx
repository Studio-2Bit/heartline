import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Building2, Clock, Users, ArrowLeft, Edit } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import { PageWrapper } from '../components/PageWrapper';
import { formatDate, formatTime } from '../utils/helpers';


const eventData: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Community Blood Drive',
    date: '2025-01-15T10:00:00',
    location: 'City Community Center, Downtown',
    hospital: 'City General Hospital',
    description: 'Join us for our monthly community blood drive. Your donation can save up to 3 lives! Free refreshments and health screening for all donors.',
    fullDescription: 'This monthly community blood drive is organized in partnership with the City Community Center and City General Hospital. We welcome all eligible donors to participate in this life-saving event. Professional medical staff will be on-site to ensure a safe and comfortable donation experience. All donated blood will be used to help patients in local hospitals who need transfusions due to surgery, trauma, cancer treatment, and other medical conditions.',
    requirements: [
      'Must be at least 17 years old (16 with parental consent)',
      'Weigh at least 110 pounds',
      'Be in good general health',
      'Bring a valid ID'
    ],
    expectedDonors: 150
  }
};

export const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = eventData[id || '1'] || eventData['1'];

  return (
    <MainLayout>
      <PageWrapper>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate('/events')}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700 mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Events</span>
          </button>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div
              className="h-64 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.pexels.com/photos/6823567/pexels-photo-6823567.jpeg?auto=compress&cs=tinysrgb&w=1200')"
              }}
            >
              <div className="h-full bg-gradient-to-r from-red-900/80 to-red-600/60 flex items-center justify-center">
                <h1 className="text-4xl font-bold text-white text-center px-4">{event.title}</h1>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Calendar className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date & Time</p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(event.date)} at {formatTime(event.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <MapPin className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-800">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Building2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Organized By</p>
                    <p className="font-semibold text-gray-800">{event.hospital}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Users className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Expected Donors</p>
                    <p className="font-semibold text-gray-800">{event.expectedDonors}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Event</h2>
                <p className="text-gray-600 leading-relaxed mb-4">{event.fullDescription}</p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {event.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 rounded-xl p-6 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Save Lives?</h3>
                <p className="text-gray-600 mb-4">Register for this event and make a difference</p>
                <button 
                   onClick={() => navigate('/EventRegister')}
                className="w-full bg-red-500 mt-4 flex items-center justify-center space-x-2  border-gray-300 text-gray-900 py-2 rounded-lg hover:bg-gray-70 transition"
              >
                <Edit className="h-4 w-4" />
                <span>Register</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </MainLayout>
  );
};
