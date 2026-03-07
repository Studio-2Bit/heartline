import { Droplet, MapPin, Clock, AlertCircle } from 'lucide-react';

interface RequestCardProps {
  id: string;
  bloodType: string;
  urgency: string;
  location: string;
  hospital: string;
  timeAgo: string;
  notes?: string;
  onRespond?: () => void;
}

export const RequestCard = ({
  bloodType,
  urgency,
  location,
  hospital,
  timeAgo,
  notes,
  onRespond
}: RequestCardProps) => {
  const urgencyColors = {
    Low: 'bg-blue-100 text-blue-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-orange-100 text-orange-800',
    Critical: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-red-100 p-3 rounded-lg mr-4">
            <Droplet className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{bloodType}</h3>
            <p className="text-sm text-gray-600">{hospital}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${urgencyColors[urgency as keyof typeof urgencyColors]}`}>
          {urgency}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="text-sm">{location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          <span className="text-sm">{timeAgo}</span>
        </div>
        {notes && (
          <div className="flex items-start text-gray-600">
            <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
            <span className="text-sm">{notes}</span>
          </div>
        )}
      </div>
          <div className="flex gap-2">
            {onRespond && (
              <>
                <button
                  onClick={onRespond}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Submit Response
                </button>
                <button
                  onClick={onRespond}
                  className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
                >
                  Reject
                </button>
              </>
            )}
          </div>
      

        

        
        
      
    </div>
  );
};
