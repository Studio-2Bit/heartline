import { useState, useEffect } from 'react';
import { User, MapPin, Phone, Droplet, Calendar, Building2, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const ProfileCard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    const endpoint = user.role === 'donor' ? '/donor/profile' : '/hospital/profile';
    api.get(endpoint)
      .then(({ data }) => setProfile(data.profile))
      .catch(() => {});
  }, [user]);

  if (!user) return null;

  // ── Donor Card ──────────────────────────────────────────────────
  if (user.role === 'donor') {
    const daysLeft = profile?.nextEligibleDate
      ? Math.max(0, Math.ceil(
          (new Date(profile.nextEligibleDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
        ))
      : 0;

    return (
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center mb-4">
          <div className="bg-white/20 p-4 rounded-full mr-4">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-red-100">Blood Donor</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {profile?.bloodType && (
            <div className="flex items-center gap-2">
              <Droplet className="h-4 w-4" />
              <span>Blood Type: <strong>{profile.bloodType}</strong></span>
            </div>
          )}
          
        </div>

        <div className="pt-4 border-t border-white/20 space-y-2">
          {/* Availability */}
          <div className="flex items-center gap-2">
            {profile?.availabilityStatus === 'available'
              ? <CheckCircle className="h-4 w-4 text-green-300" />
              : <Clock className="h-4 w-4 text-red-200" />
            }
            <span className="text-sm font-semibold">
              {profile?.availabilityStatus === 'available' ? 'Ready to donate!' : `${daysLeft} days until eligible`}
            </span>
          </div>

          {/* Total donations */}
          {profile?.totalDonations !== undefined && (
            <div className="flex items-center gap-2">
              <Droplet className="h-4 w-4" />
              <span className="text-sm">{profile.totalDonations} donation{profile.totalDonations !== 1 ? 's' : ''} total</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Hospital Card ───────────────────────────────────────────────
  return (
    <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center mb-4">
        <div className="bg-white/20 p-4 rounded-full mr-4">
          <Building2 className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold">{profile?.hospitalName ?? user.name}</h2>
          <div className="flex items-center gap-1 mt-0.5">
            {profile?.isVerified
              ? <><CheckCircle className="h-3.5 w-3.5 text-green-300" /><span className="text-xs text-green-200">Verified</span></>
              : <span className="text-xs text-red-200">⏳ Pending Verification</span>
            }
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {profile?.location && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{profile.location}</span>
          </div>
        )}
        {profile?.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span className="text-sm">{profile.phone}</span>
          </div>
        )}
        {profile?.registrationNumber && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Reg: {profile.registrationNumber}</span>
          </div>
        )}
      </div>
    </div>
  );
};