import React, { useState, useEffect } from 'react';
import { Search, Droplet, Calendar, Clock, User, Phone, MapPin, Check, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { searchDonorApi, markDonationApi, getRecentDonationsApi } from '../../services/Donation.api';

interface DonorInfo {
  _id: string;
  name: string;
  email: string;
  phone: string;
  bloodType: string;
  location: string;
  availabilityStatus: string;
  lastDonationDate?: string;
  nextEligibleDate?: string;
  totalDonations: number;
}

interface DonationRecord {
  _id: string;
  donorId: { name: string };
  donationDate: string;
  donationTime: string;
  bloodType: string;
  status: string;
}

export default function DonorMark() {
  const [searchId, setSearchId] = useState('');
  const [foundDonor, setFoundDonor] = useState<DonorInfo | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchError, setSearchError] = useState('');

  const [formData, setFormData] = useState({ date: '', time: '', notes: '' });
  const [donationRecords, setDonationRecords] = useState<DonationRecord[]>([]);
  const [searchRecords, setSearchRecords] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchRecentDonations();
  }, []);

  useEffect(() => {
    if (foundDonor) {
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const time = now.toTimeString().slice(0, 5);
      setFormData({ date, time, notes: '' });
    }
  }, [foundDonor]);

  const fetchRecentDonations = async () => {
    try {
      const data = await getRecentDonationsApi();
      setDonationRecords(data.data.donations);
    } catch (err) {
      console.error('Failed to fetch recent donations');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setIsSearching(true);
    setNotFound(false);
    setSearchError('');
    setFoundDonor(null);
    setSuccessMessage('');

    try {
      const data = await searchDonorApi(searchId.trim());
      setFoundDonor(data.data.donor);
      setNotFound(false);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setNotFound(true);
      } else {
        setSearchError(err.response?.data?.message || 'Search failed. Please try again.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleMarkDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundDonor || !formData.date || !formData.time) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await markDonationApi({
        donorId: foundDonor._id,
        donationDate: formData.date,
        donationTime: formData.time,
        ...(formData.notes && { notes: formData.notes }),
      });

      setSuccessMessage(`✓ Donation recorded successfully for ${foundDonor.name}`);
      setFoundDonor(null);
      setSearchId('');
      setFormData({ date: '', time: '', notes: '' });
      fetchRecentDonations(); // refresh list
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to record donation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRecords = donationRecords.filter((r) =>
    r.donorId?.name?.toLowerCase().includes(searchRecords.toLowerCase())
  );

  const content = (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-8 border border-red-100">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Mark Donor Donation</h1>
        <p className="text-gray-600">Search for donors by MongoDB ID and record their blood donations</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-300 rounded-xl p-4 flex items-center gap-3">
          <Check className="w-6 h-6 text-green-600" />
          <p className="text-green-700 font-semibold">{successMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left - Search and Form */}
        <div className="lg:col-span-2 space-y-6">

          {/* Search Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Donor</h2>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Donor ID</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchId}
                    onChange={(e) => {
                      setSearchId(e.target.value);
                      setNotFound(false);
                      setSearchError('');
                    }}
                    placeholder="Enter donor's MongoDB ID..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none transition"
                  />
                  <Search className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {isSearching ? 'Searching...' : 'Search Donor'}
              </button>
            </form>

            {notFound && (
              <div className="mt-4 bg-red-50 border border-red-300 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800">Donor Not Found</p>
                  <p className="text-sm text-red-700">Please check the donor ID and try again.</p>
                </div>
              </div>
            )}

            {searchError && (
              <div className="mt-4 bg-yellow-50 border border-yellow-300 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-yellow-800 text-sm">{searchError}</p>
              </div>
            )}
          </div>

          {/* Donor Info */}
          {foundDonor && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Donor Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center gap-4 md:col-span-2">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-3xl font-bold text-white">
                    {foundDonor.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{foundDonor.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Droplet className="w-5 h-5 text-red-600" />
                      <span className="font-bold text-lg text-gray-700">{foundDonor.bloodType}</span>
                    </div>
                  </div>
                  <div className={`ml-auto px-3 py-1 rounded-full flex items-center gap-1 ${
                    foundDonor.availabilityStatus === 'available'
                      ? 'bg-green-100'
                      : 'bg-red-100'
                  }`}>
                    <span className={`text-sm font-semibold ${
                      foundDonor.availabilityStatus === 'available'
                        ? 'text-green-700'
                        : 'text-red-700'
                    }`}>
                      {foundDonor.availabilityStatus === 'available' ? '✓ Available' : '✗ Unavailable'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold">{foundDonor.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold">{foundDonor.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold">{foundDonor.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <Droplet className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Total Donations</p>
                    <p className="font-semibold">{foundDonor.totalDonations}</p>
                  </div>
                </div>

                {foundDonor.lastDonationDate && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Last Donation</p>
                      <p className="font-semibold">
                        {new Date(foundDonor.lastDonationDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {foundDonor.nextEligibleDate && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Next Eligible Date</p>
                      <p className="font-semibold">
                        {new Date(foundDonor.nextEligibleDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mark Donation Form */}
          {foundDonor && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Record Donation</h2>
              <form onSubmit={handleMarkDonation} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none transition"
                        required
                      />
                      <Calendar className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                    <div className="relative">
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none transition"
                        required
                      />
                      <Clock className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Add any additional notes about the donation..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  {isSubmitting ? 'Recording...' : 'Mark Donation as Completed'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right - Recent Donations */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Donations</h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by donor name..."
                value={searchRecords}
                onChange={(e) => setSearchRecords(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none transition text-sm"
              />
            </div>

            {filteredRecords.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No donations recorded yet</p>
            ) : (
              <div className="space-y-4">
                {filteredRecords.map((record) => (
                  <div key={record._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900">{record.donorId?.name}</h3>
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                        {record.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(record.donationDate).toLocaleDateString()}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {record.donationTime}
                      </p>
                      <p className="flex items-center gap-2">
                        <Droplet className="w-4 h-4 text-red-600" />
                        {record.bloodType}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return <DashboardLayout>{content}</DashboardLayout>;
}