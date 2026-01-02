import { Calendar, MapPin, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatTime } from '../utils/helpers';

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  hospital: string;
  description: string;
}

export const EventCard = ({ id, title, date, location, hospital, description }: EventCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition transform hover:-translate-y-1">
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span className="text-sm">{formatDate(date)} at {formatTime(date)}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="text-sm">{location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Building2 className="h-4 w-4 mr-2" />
          <span className="text-sm">{hospital}</span>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
      <button
        onClick={() => navigate(`/events/${id}`)}
        className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
      >
        View Details
      </button>
    </div>
  );
};
