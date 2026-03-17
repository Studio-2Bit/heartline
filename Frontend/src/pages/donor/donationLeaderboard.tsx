import { useState, useEffect } from 'react';
import { Droplet, Trophy, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import api from '../../services/api';

interface DonorStats {
  name: string;
  initials: string;
  rank: number;
  totalDonations: number;
  livesSaved: number;
  bloodType: string;
  lastDonationDate?: string;
  nextEligibleDate?: string;
  nextMilestone: { current: number; total: number };
}

interface DonationRecord {
  _id: string;
  id: number;
  hospital: string;
  date: string;
  bloodType: string;
  units: number;
  status: string;
  notes?: string;
}

const achievements = [
  { icon: '🩸', label: 'First Donation', required: 1 },
  { icon: '⭐', label: '5 Donations',    required: 5 },
  { icon: '🏅', label: '10 Donations',   required: 10 },
  { icon: '🏆', label: '25 Donations',   required: 25 },
  { icon: '👑', label: '50 Donations',   required: 50 },
  { icon: '💎', label: '100 Donations',  required: 100 },
];

export default function DonorLeaderboard() {
  const [donor, setDonor] = useState<DonorStats | null>(null);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data } = await api.get('/donations/my');
      setDonor(data.donor);
      setDonations(data.donations);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-400 text-lg">Loading your record...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3 max-w-md w-full">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!donor) return null;

  const progressPercent = Math.min(
    (donor.nextMilestone.current / donor.nextMilestone.total) * 100,
    100
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left Sidebar ── */}
            <div className="lg:col-span-1 space-y-6">

              {/* Profile Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center text-2xl font-bold text-amber-900 shadow-md">
                    {donor.initials}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{donor.name}</h2>
                    <div className="flex items-center gap-1 text-amber-600 font-semibold">
                      <Trophy className="w-4 h-4" />
                      Rank #{donor.rank}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-amber-600">{donor.totalDonations}</div>
                    <p className="text-sm text-gray-600 font-medium">Total Donations</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-red-600">{donor.livesSaved}</div>
                    <p className="text-sm text-gray-600 font-medium">Lives Saved</p>
                  </div>
                </div>

                {/* Blood Type */}
                <div className="flex items-center justify-between bg-red-50 rounded-xl px-4 py-3 mb-4">
                  <span className="text-sm font-semibold text-gray-600">Blood Type</span>
                  <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {donor.bloodType}
                  </span>
                </div>

                {/* Dates */}
                {donor.lastDonationDate && (
                  <div className="text-sm text-gray-500 mb-1 flex justify-between">
                    <span>Last Donation</span>
                    <span className="font-semibold text-gray-700">
                      {new Date(donor.lastDonationDate).toLocaleDateString('en-US', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </div>
                )}
                {donor.nextEligibleDate && (
                  <div className="text-sm text-gray-500 flex justify-between mb-4">
                    <span>Next Eligible</span>
                    <span className="font-semibold text-green-600">
                      {new Date(donor.nextEligibleDate).toLocaleDateString('en-US', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </div>
                )}

                {/* Next Milestone */}
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border border-amber-200">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-900">Next Milestone</h3>
                    <span className="text-sm font-bold text-amber-600">
                      {donor.nextMilestone.current}/{donor.nextMilestone.total}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-amber-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2 font-medium">
                    {donor.nextMilestone.total - donor.nextMilestone.current} donations until next badge
                  </p>
                </div>
              </div>

              {/* Achievement Badges */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Achievement Badges</h3>
                <p className="text-sm text-gray-500 mb-4">Unlock badges by donating blood</p>
                <div className="grid grid-cols-3 gap-3">
                  {achievements.map((a, idx) => {
                    const unlocked = donor.totalDonations >= a.required;
                    return (
                      <div
                        key={idx}
                        className={`rounded-xl p-4 text-center border-2 transition-all transform hover:scale-105 ${
                          unlocked
                            ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-amber-300 shadow-md'
                            : 'bg-gray-50 border-gray-200 opacity-40'
                        }`}
                      >
                        <div className="text-3xl mb-1">{a.icon}</div>
                        <p className="text-xs font-bold text-gray-700">{a.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Right — Donation History ── */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100 px-6 py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">Your Donation Record</h2>
                  
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-red-600">{donations.length}</div>
                      <p className="text-sm text-gray-600 font-medium">Total Donations</p>
                    </div>
                  </div>
                </div>

                {donations.length === 0 ? (
                  <div className="text-center py-20">
                    <Droplet className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">No donations recorded yet</p>
                    <p className="text-gray-300 text-sm mt-1">Your donation history will appear here</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {donations.map((donation, idx) => (
                      <div
                        key={idx}
                        className="p-6 hover:bg-gradient-to-r hover:from-red-50/50 hover:to-pink-50/50 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <Droplet className="w-6 h-6 text-red-600 fill-red-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">{donation.hospital}</h3>
                                <p className="text-sm text-gray-500">Donation #{donation.id}</p>
                              </div>
                              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full whitespace-nowrap">
                                {donation.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>{donation.date}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Droplet className="w-4 h-4 text-red-500" />
                                <span className="font-semibold">{donation.bloodType}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <TrendingUp className="w-4 h-4 text-blue-500" />
                                <span>{donation.units} unit(s)</span>
                              </div>
                            </div>
                            {donation.notes && (
                              <p className="text-xs text-gray-400 mt-2 italic">{donation.notes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}