import React, { useState } from 'react';
import { Droplet, Trophy, Calendar, MapPin, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';

export default function DonorLeaderboard() {
  const [donor] = useState({
    name: 'John Doe',
    initials: 'JD',
    rank: 42,
    totalDonations: 12,
    livesSaved: 36,
    nextMilestone: { current: 12, total: 15 },
    bloodType: 'O+'
  });

  const [donations] = useState([
    {
      id: 5,
      hospital: 'City General Hospital',
      date: 'Nov 20, 2024',
      bloodType: 'O+',
      units: 1,
      status: 'Completed',
      location: 'New York, NY'
    },
    {
      id: 4,
      hospital: 'North Medical Center',
      date: 'Aug 18, 2024',
      bloodType: 'O+',
      units: 1,
      status: 'Completed',
      location: 'New York, NY'
    },
    {
      id: 3,
      hospital: 'East Side Hospital',
      date: 'May 10, 2024',
      bloodType: 'O+',
      units: 1,
      status: 'Completed',
      location: 'New York, NY'
    }
  ]);

  const achievements = [
    { icon: '🩸', label: 'First Donation', unlocked: true },
    { icon: '⭐', label: '5 Donations', unlocked: true },
    { icon: '🏆', label: '10 Donations', unlocked: false }
  ];

  const progressPercent = (donor.nextMilestone.current / donor.nextMilestone.total) * 100;

  const content = (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
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
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-3 font-medium">
                  {donor.nextMilestone.total - donor.nextMilestone.current} donations until next badge
                </p>
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Achievement Badges</h3>
              <p className="text-sm text-gray-600 mb-6 font-medium">Unlock badges by donating blood</p>
              <div className="grid grid-cols-3 gap-3">
                {achievements.map((achievement, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl p-4 text-center border-2 transition-all transform hover:scale-105 ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-amber-300 shadow-md'
                        : 'bg-gray-50 border-gray-200 opacity-50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <p className="text-xs font-bold text-gray-700">{achievement.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Donation History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100 px-6 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Your Donation Record</h2>
                    <p className="text-gray-600 text-sm">Complete history of all your donations</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-red-600">{donations.length}</div>
                    <p className="text-sm text-gray-600 font-medium">Total Donations</p>
                  </div>
                </div>
              </div>

              {/* Donations List */}
              <div className="divide-y divide-gray-100">
                {donations.map((donation, idx) => (
                  <div
                    key={idx}
                    className="p-6 hover:bg-gradient-to-r hover:from-red-50/50 hover:to-pink-50/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Blood Type Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                          <Droplet className="w-6 h-6 text-red-600 fill-red-600" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{donation.hospital}</h3>
                            <p className="text-sm text-gray-600">Donation #{donation.id}</p>
                          </div>
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full whitespace-nowrap">
                            {donation.status}
                          </span>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
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
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{donation.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return <DashboardLayout>{content}</DashboardLayout>;
}