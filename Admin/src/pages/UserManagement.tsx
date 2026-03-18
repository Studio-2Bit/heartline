import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Trash2, Filter, Heart, Building2, ShieldCheck, Users, AlertCircle, Droplet } from 'lucide-react';

const API = 'http://localhost:5000/api/admin';
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
});

const BLOOD_BADGE: Record<string, string> = {
  'A+': 'bg-red-100 text-red-600', 'A-': 'bg-red-200 text-red-700',
  'B+': 'bg-orange-100 text-orange-600', 'B-': 'bg-orange-200 text-orange-700',
  'O+': 'bg-blue-100 text-blue-600', 'O-': 'bg-blue-200 text-blue-700',
  'AB+': 'bg-purple-100 text-purple-600', 'AB-': 'bg-purple-200 text-purple-700',
};

interface Donor {
  _id: string;
  name: string;
  email: string;
  bloodType?: string;
  phone?: string;
  location?: string;
  totalDonations: number;
  availabilityStatus?: string;
  isVerified: boolean;
  createdAt: string;
}

interface Hospital {
  _id: string;
  name: string;
  email: string;
  hospitalName?: string;
  phone?: string;
  location?: string;
  registrationNumber?: string;
  isVerified: boolean;
  createdAt: string;
}

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState<'donor' | 'hospital'>('donor');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [dRes, hRes] = await Promise.all([
        axios.get(`${API}/all-donors`, authHeaders()),
        axios.get(`${API}/all-hospitals`, authHeaders()),
      ]);
      setDonors(dRes.data.donors);
      setHospitals(hRes.data.hospitals);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      await axios.delete(`${API}/delete/${id}`, authHeaders());
      setDonors((prev) => prev.filter((d) => d._id !== id));
      setHospitals((prev) => prev.filter((h) => h._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  // Filter logic
  const filteredDonors = donors.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && u.isVerified) ||
      (filterStatus === 'inactive' && !u.isVerified);
    return matchSearch && matchStatus;
  });

  const filteredHospitals = hospitals.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.hospitalName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && u.isVerified) ||
      (filterStatus === 'inactive' && !u.isVerified);
    return matchSearch && matchStatus;
  });

  const filtered = activeTab === 'donor' ? filteredDonors : filteredHospitals;
  const switchTab = (tab: 'donor' | 'hospital') => {
    setActiveTab(tab); setSearchTerm(''); setFilterStatus('all');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-3 shadow-lg">
          <Users size={24} className="text-white" />
        </div>
        <div>
          
          <p className="text-black-500 text-2xl mt-0.5 font-bold">Manage donors & hospital accounts</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 border border-gray-100">
          <div className="bg-red-100 text-red-600 rounded-xl p-3">
            <Heart size={20} />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{donors.length}</div>
            <div className="text-xs text-gray-400 font-medium mt-0.5">Total Donors</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 border border-gray-100">
          <div className="bg-blue-100 text-blue-600 rounded-xl p-3">
            <Building2 size={20} />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{hospitals.length}</div>
            <div className="text-xs text-gray-400 font-medium mt-0.5">Total Hospitals</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 border border-gray-100">
          <div className="bg-green-100 text-green-600 rounded-xl p-3">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {activeTab === 'donor'
                ? donors.filter((d) => d.isVerified).length
                : hospitals.filter((h) => h.isVerified).length}
            </div>
            <div className="text-xs text-gray-400 font-medium mt-0.5">
              Verified {activeTab === 'donor' ? 'Donors' : 'Hospitals'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => switchTab('donor')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'donor' ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-100 hover:shadow-md'
          }`}
        >
          <Heart size={16} />
          Donors
          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
            activeTab === 'donor' ? 'bg-red-700 text-white' : 'bg-red-100 text-red-600'
          }`}>{donors.length}</span>
        </button>
        <button
          onClick={() => switchTab('hospital')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'hospital' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-100 hover:shadow-md'
          }`}
        >
          <Building2 size={16} />
          Hospitals
          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
            activeTab === 'hospital' ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-600'
          }`}>{hospitals.length}</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}s...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-colors"
          />
        </div>
        <div className="relative">
          <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none bg-white appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Verified</option>
            <option value="inactive">Unverified</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {activeTab === 'donor' ? 'Donor' : 'Hospital'}
                </th>
                {activeTab === 'donor' ? (
                  <>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Blood Type</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Donations</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Hospital Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Location</th>
                  </>
                )}
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-400 text-sm">Loading...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-400 text-sm">No {activeTab}s found</td>
                </tr>
              ) : activeTab === 'donor' ? (
                filteredDonors.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{user.name}</div>
                          <div className="text-xs text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${BLOOD_BADGE[user.bloodType || ''] || 'bg-gray-100 text-gray-500'}`}>
                        <Droplet size={10} />{user.bloodType || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Heart size={13} className="text-red-500 fill-red-500" />
                        <span className="font-semibold text-gray-900 text-sm">{user.totalDonations}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {user.isVerified ? '✓ Verified' : '⏳ Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                filteredHospitals.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{user.name}</div>
                          <div className="text-xs text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{user.hospitalName || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.location || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {user.isVerified ? '✓ Verified' : '⏳ Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of{' '}
            <span className="font-semibold text-gray-600">
              {activeTab === 'donor' ? donors.length : hospitals.length}
            </span> {activeTab}s
          </p>
        </div>
      </div>
    </div>
  );
}