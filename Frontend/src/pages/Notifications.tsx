import { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, Calendar, Loader } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import { PageWrapper } from '../components/PageWrapper';
import api from '../services/api';

interface NotificationItem {
  _id: string;
  type: 'request' | 'event' | 'success' | 'info';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const iconMap = {
  request: AlertCircle,
  event:   Calendar,
  success: CheckCircle,
  info:    Info,
};

const colorMap: Record<string, string> = {
  request: 'bg-red-100 text-red-600',
  event:   'bg-blue-100 text-blue-600',
  success: 'bg-green-100 text-green-600',
  info:    'bg-gray-100 text-gray-600',
};

const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
  return `${Math.floor(hrs / 24)} day(s) ago`;
};

export const Notifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.notifications);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      alert('Failed to mark as read');
    }
  };

  const handleMarkOneRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      // silent fail
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <MainLayout>
      <PageWrapper>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Notifications</h1>
              <p className="text-xl text-gray-600">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                  : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-red-600 hover:text-red-700 font-semibold"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader className="h-8 w-8 text-red-500 animate-spin" />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Empty */}
          {!isLoading && notifications.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl shadow-md">
              <Bell className="h-16 w-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No notifications yet</p>
              <p className="text-gray-400 text-sm mt-1">
                You'll be notified about blood requests, events, and profile updates
              </p>
            </div>
          )}

          {/* Notifications List */}
          {!isLoading && (
            <div className="space-y-4">
              {notifications.map((notification) => {
                const Icon = iconMap[notification.type] || Info;
                return (
                  <div
                    key={notification._id}
                    onClick={() => !notification.isRead && handleMarkOneRead(notification._id)}
                    className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer ${
                      !notification.isRead ? 'border-l-4 border-red-600' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg flex-shrink-0 ${colorMap[notification.type]}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                          {!notification.isRead && (
                            <span className="bg-red-600 rounded-full w-2 h-2 flex-shrink-0 mt-1.5 ml-2" />
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{notification.message}</p>
                        <p className="text-sm text-gray-500">{timeAgo(notification.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </PageWrapper>
    </MainLayout>
  );
};