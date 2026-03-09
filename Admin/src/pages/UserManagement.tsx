import { useState } from 'react';
import { Search, Trash2, Filter, Heart, Building2, ShieldCheck, Users } from 'lucide-react';

const mockUsers = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@email.com', role: 'donor', status: 'active', bloodType: 'A+', createdAt: '2024-01-15', donations: 12 },
  { id: '2', name: 'Marcus Johnson', email: 'marcus@email.com', role: 'donor', status: 'active', bloodType: 'O-', createdAt: '2024-02-20', donations: 8 },
  { id: '3', name: 'Elena Rodriguez', email: 'elena@email.com', role: 'donor', status: 'inactive', bloodType: 'B+', createdAt: '2024-03-10', donations: 3 },
  { id: '4', name: 'James Okafor', email: 'james@email.com', role: 'donor', status: 'active', bloodType: 'AB+', createdAt: '2024-01-28', donations: 20 },
  { id: '5', name: 'Priya Patel', email: 'priya@email.com', role: 'donor', status: 'active', bloodType: 'O+', createdAt: '2024-04-05', donations: 5 },
  { id: '6', name: 'City General Hospital', email: 'admin@citygeneral.com', role: 'hospital', status: 'active', location: 'New York, NY', beds: 450, createdAt: '2023-11-01' },
  { id: '7', name: 'St. Mary Medical Center', email: 'info@stmary.com', role: 'hospital', status: 'active', location: 'Los Angeles, CA', beds: 320, createdAt: '2023-12-15' },
  { id: '8', name: 'Northside Health Clinic', email: 'contact@northside.com', role: 'hospital', status: 'inactive', location: 'Chicago, IL', beds: 180, createdAt: '2024-01-10' },
  { id: '9', name: 'Metro Blood Bank', email: 'ops@metrobbb.com', role: 'hospital', status: 'active', location: 'Houston, TX', beds: 90, createdAt: '2024-02-28' },
];

const BLOOD_BADGE = {
  'A+': 'bg-red-100 text-red-600',
  'A-': 'bg-red-200 text-red-700',
  'B+': 'bg-orange-100 text-orange-600',
  'B-': 'bg-orange-200 text-orange-700',
  'O+': 'bg-blue-100 text-blue-600',
  'O-': 'bg-blue-200 text-blue-700',
  'AB+': 'bg-purple-100 text-purple-600',
  'AB-': 'bg-purple-200 text-purple-700',
};

export default function UserManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [activeTab, setActiveTab] = useState('donor');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const tabUsers = users.filter(u => u.role === activeTab);
  const filteredUsers = tabUsers.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm('Delete this user?')) setUsers(users.filter(u => u.id !== id));
  };

  const handleToggle = (id: string) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ));
  };

  const donorCount = users.filter(u => u.role === 'donor').length;
  const hospitalCount = users.filter(u => u.role === 'hospital').length;
  const activeCount = users.filter(u => u.role === activeTab && u.status === 'active').length;

  const switchTab = (tab: string) => {
    setActiveTab(tab);
    setSearchTerm('');
    setFilterStatus('all');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-3 flex items-center justify-center shadow-lg">
          <Users size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">User Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage donors & hospital accounts</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 border border-gray-100">
          <div className="bg-red-100 text-red-600 rounded-xl p-3 flex items-center justify-center">
            <Heart size={20} />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{donorCount}</div>
            <div className="text-xs text-gray-400 font-medium mt-0.5">Total Donors</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 border border-gray-100">
          <div className="bg-blue-100 text-blue-600 rounded-xl p-3 flex items-center justify-center">
            <Building2 size={20} />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{hospitalCount}</div>
            <div className="text-xs text-gray-400 font-medium mt-0.5">Total Hospitals</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 border border-gray-100">
          <div className="bg-green-100 text-green-600 rounded-xl p-3 flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{activeCount}</div>
            <div className="text-xs text-gray-400 font-medium mt-0.5">
              Active {activeTab === 'donor' ? 'Donors' : 'Hospitals'}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => switchTab('donor')}
          className={`flex items-center gap-2 px-6 py-3 rounded font-semibold text-sm transition-all duration-200 ${
            activeTab === 'donor'
              ? 'bg-red-600 text-white shadow-lg shadow-red-200'
              : 'bg-white text-gray-500 shadow-sm hover:shadow-md border border-gray-100'
          }`}
        >
          <Heart size={16} />
          Donors
          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
            activeTab === 'donor' ? 'bg-white bg-opacity-25 text-white' : 'bg-red-100 text-red-600'
          }`}>
            {donorCount}
          </span>
        </button>

        <button
          onClick={() => switchTab('hospital')}
          className={`flex items-center gap-2 px-6 py-3 rounded  font-semibold text-sm transition-all duration-200 ${
            activeTab === 'hospital'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
              : 'bg-white text-gray-500 shadow-sm hover:shadow-md border border-gray-100'
          }`}
        >
          <Building2 size={16} />
          Hospitals
          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
            activeTab === 'hospital' ? 'bg-white bg-opacity-25 text-white' : 'bg-blue-100 text-blue-600'
          }`}>
            {hospitalCount}
          </span>
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
            onChange={e => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none transition-colors focus:border-${activeTab === 'donor' ? 'red' : 'blue'}-400 focus:ring-2 focus:ring-${activeTab === 'donor' ? 'red' : 'blue'}-100`}
          />
        </div>
        <div className="relative">
          <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none bg-white appearance-none cursor-pointer focus:border-gray-400"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Beds</th>
                  </>
                )}
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-400 text-sm">
                    No {activeTab}s found
                  </td>
                </tr>
              ) : filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  {/* User Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                        activeTab === 'donor' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{user.name}</div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Dynamic Columns */}
                  {activeTab === 'donor' ? (
                    <>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${BLOOD_BADGE[user.bloodType as keyof typeof BLOOD_BADGE] || 'bg-gray-100 text-gray-600'}`}>
                          {user.bloodType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <Heart size={13} className="text-red-500 fill-red-500" />
                          <span className="font-semibold text-gray-900 text-sm">{user.donations}</span>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.location}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900 text-sm">{user.beds}</span>
                        <span className="text-gray-400 text-xs"> beds</span>
                      </td>
                    </>
                  )}

                  {/* Status */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggle(user.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {user.status === 'active' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      )}
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </button>
                  </td>

                  {/* Joined */}
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing <span className="font-semibold text-gray-600">{filteredUsers.length}</span> of{' '}
            <span className="font-semibold text-gray-600">{tabUsers.length}</span> {activeTab}s
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors font-medium">
              Previous
            </button>
            <button className={`px-4 py-2 rounded-lg text-sm text-white font-medium transition-colors ${
              activeTab === 'donor' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}