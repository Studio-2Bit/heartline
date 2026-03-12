import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Building2, Users, ArrowLeft, Edit, Phone, User, AlertCircle } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import { PageWrapper } from '../components/PageWrapper';
import { formatDate } from '../utils/helpers';
import { getEventByIdApi } from '../services/event.api';

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

export const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getEventByIdApi(id!);
      setEvent(data.data.event);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch event details');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <PageWrapper>
          <div className="text-center py-24 text-gray-500">Loading event...</div>
        </PageWrapper>
      </MainLayout>
    );
  }

  if (error || !event) {
    return (
      <MainLayout>
        <PageWrapper>
          <div className="max-w-4xl mx-auto px-4 py-12">
            <button onClick={() => navigate('/events')} className="flex items-center space-x-2 text-red-600 hover:text-red-700 mb-6">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Events</span>
            </button>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <p className="text-red-700">{error || 'Event not found'}</p>
            </div>
          </div>
        </PageWrapper>
      </MainLayout>
    );
  }

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
                      {formatDate(event.date)} at {event.time}
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
                    <p className="font-semibold text-gray-800">{event.hospitalId?.name || 'Unknown Hospital'}</p>
                  </div>
                </div>

                {event.expectedDonors && (
                  <div className="flex items-start space-x-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <Users className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Expected Donors</p>
                      <p className="font-semibold text-gray-800">{event.expectedDonors}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <User className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact Person</p>
                    <p className="font-semibold text-gray-800">{event.contactPerson}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Phone className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact Phone</p>
                    <p className="font-semibold text-gray-800">{event.contactPhone}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Event</h2>
                <p className="text-gray-600 leading-relaxed">{event.description}</p>
              </div>

              <div className="bg-red-50 rounded-xl p-6 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Save Lives?</h3>
                <p className="text-gray-600 mb-4">Register for this event and make a difference</p>
                <button
                  onClick={() => navigate(`/events/register/${event._id}`)}
                  className="w-full bg-red-500 mt-4 flex items-center justify-center space-x-2 border-gray-300 text-white py-2 rounded-lg hover:bg-red-600 transition"
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