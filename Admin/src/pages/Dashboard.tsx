import { Users, Building2, ClipboardCheck, Activity } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      title: 'Active Donors',
      value: '1,248',
      change: '+12%',
      icon: Users,
      color: 'bg-red-500',
    },
    {
      title: 'Hospitals',
      value: '48',
      change: '+3',
      icon: Building2,
      color: 'bg-gray-700',
    },
    {
      title: 'Pending Verifications',
      value: '8',
      change: '-2',
      icon: ClipboardCheck,
      color: 'bg-red-600',
    },
    {
      title: 'Total Users',
      value: '2,156',
      change: '+24%',
      icon: Activity,
      color: 'bg-gray-800',
    },
  ];

  const recentActivities = [
    { action: 'New donor registered', user: 'John Smith', time: '5 minutes ago', type: 'success' },
    { action: 'Hospital verification approved', user: 'City General Hospital', time: '15 minutes ago', type: 'success' },
    { action: 'Event submission pending', user: 'Community Blood Drive', time: '1 hour ago', type: 'warning' },
    { action: 'Donor verification rejected', user: 'Invalid Documents', time: '2 hours ago', type: 'error' },
    { action: 'New hospital registered', user: 'Memorial Medical Center', time: '3 hours ago', type: 'success' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
                <span className={`text-sm font-semibold ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600 truncate">{activity.user}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Verification Rate</span>
                <span className="text-sm font-semibold text-gray-900">87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: '87%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Active Campaigns</span>
                <span className="text-sm font-semibold text-gray-900">12</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-700 h-2 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Response Time</span>
                <span className="text-sm font-semibold text-gray-900">2.4h avg</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">324</p>
                  <p className="text-xs text-gray-600 mt-1">Donations This Month</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">28</p>
                  <p className="text-xs text-gray-600 mt-1">Urgent Requests</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
