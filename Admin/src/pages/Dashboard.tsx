import { useState, useEffect } from 'react';
import { Users, Building2, ClipboardCheck, Activity, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:5000/api/admin';
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
  return `${Math.floor(hrs / 24)} day(s) ago`;
};

interface Stats {
  totalDonors: number;
  totalHospitals: number;
  totalUsers: number;
  pendingVerifications: number;
}

interface Activity {
  action: string;
  user: string;
  time: string;
  type: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data } = await axios.get(`${API}/dashboard-stats`, authHeaders());
      setStats(data.stats);
      setActivities(data.recentActivities);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = stats ? [
    { title: 'Active Donors',          value: stats.totalDonors,          icon: Users,          color: 'bg-red-500' },
    { title: 'Hospitals',              value: stats.totalHospitals,        icon: Building2,      color: 'bg-gray-700' },
    { title: 'Pending Verifications',  value: stats.pendingVerifications,  icon: ClipboardCheck, color: 'bg-red-600' },
    { title: 'Total Users',            value: stats.totalUsers,            icon: Activity,       color: 'bg-gray-800' },
  ] : [];

  // Derived quick stats
  const verificationRate = stats
    ? Math.round(((stats.totalDonors + stats.totalHospitals - stats.pendingVerifications) /
        Math.max(stats.totalDonors + stats.totalHospitals, 1)) * 100)
    : 0;

  return (
    <div>
      <div className="mb-8">
        
        <p className="text-black-600 font-bold text-2xl">Welcome back! Here's what's happening today</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoading
          ? Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4" />
                <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
                <div className="h-8 bg-gray-200 rounded w-16" />
              </div>
            ))
          : statCards.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="text-white" size={24} />
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              );
            })
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activities</h2>
          {isLoading ? (
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="w-2 h-2 mt-2 rounded-full bg-gray-200 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-40 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, i) => (
                <div key={i} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600 truncate">{activity.user}</p>
                    <p className="text-xs text-gray-500 mt-1">{timeAgo(activity.time)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-6">

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Verification Rate</span>
                <span className="text-sm font-semibold text-gray-900">{verificationRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full transition-all duration-500" style={{ width: `${verificationRate}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Hospitals Verified</span>
                <span className="text-sm font-semibold text-gray-900">
                  {stats ? stats.totalHospitals - stats.pendingVerifications : 0} / {stats?.totalHospitals ?? 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gray-700 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: stats?.totalHospitals
                      ? `${Math.round(((stats.totalHospitals - stats.pendingVerifications) / stats.totalHospitals) * 100)}%`
                      : '0%'
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Donors Verified</span>
                <span className="text-sm font-semibold text-gray-900">
                  {stats ? stats.totalDonors - stats.pendingVerifications : 0} / {stats?.totalDonors ?? 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: stats?.totalDonors
                      ? `${Math.round(((stats.totalDonors - stats.pendingVerifications) / stats.totalDonors) * 100)}%`
                      : '0%'
                  }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalDonors ?? '—'}</p>
                  <p className="text-xs text-gray-600 mt-1">Total Donors</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{stats?.pendingVerifications ?? '—'}</p>
                  <p className="text-xs text-gray-600 mt-1">Pending Verifications</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}