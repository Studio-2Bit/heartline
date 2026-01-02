import { User, MapPin, Phone, Droplet, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfileCard = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center mb-4">
        <div className="bg-white/20 p-4 rounded-full mr-4">
          <User className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-red-100">{user.role === 'donor' ? 'Blood Donor' : 'Hospital'}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {user.bloodType && (
          <div className="flex items-center">
            <Droplet className="h-4 w-4 mr-2" />
            <span>Blood Type: {user.bloodType}</span>
          </div>
        )}
        {user.location && (
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{user.location}</span>
          </div>
        )}
        {user.phone && (
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2" />
            <span>{user.phone}</span>
          </div>
        )}
        {user.nextEligibleDate && (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Next Eligible: {user.nextEligibleDate}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/20">
        <div className="flex items-center">
          {user.verified ? (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="text-sm">Verified</span>
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 mr-2" />
              <span className="text-sm">Not Verified</span>
            </>
          )}
        </div>
        {user.availabilityStatus && (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            user.availabilityStatus === 'available'
              ? 'bg-green-500'
              : 'bg-gray-500'
          }`}>
            {user.availabilityStatus === 'available' ? 'Available' : 'Unavailable'}
          </span>
        )}
      </div>
    </div>
  );
};
