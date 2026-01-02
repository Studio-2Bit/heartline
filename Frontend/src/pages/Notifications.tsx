import { Bell, CheckCircle, AlertCircle, Info, Calendar } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import { PageWrapper } from '../components/PageWrapper';

const notifications = [
  {
    id: '1',
    type: 'request',
    icon: AlertCircle,
    title: 'Urgent Blood Request',
    message: 'City General Hospital needs O+ blood urgently. You are a match!',
    time: '5 minutes ago',
    unread: true
  },
  {
    id: '2',
    type: 'event',
    icon: Calendar,
    title: 'Upcoming Event Tomorrow',
    message: 'Community Blood Drive at City Community Center starts at 10:00 AM',
    time: '1 hour ago',
    unread: true
  },
  {
    id: '3',
    type: 'success',
    icon: CheckCircle,
    title: 'Profile Verified',
    message: 'Your profile has been verified successfully. You can now respond to blood requests.',
    time: '2 hours ago',
    unread: false
  },
  {
    id: '4',
    type: 'info',
    icon: Info,
    title: 'Eligibility Update',
    message: 'You will be eligible to donate blood again from March 15, 2025.',
    time: '1 day ago',
    unread: false
  },
  {
    id: '5',
    type: 'request',
    icon: AlertCircle,
    title: 'Blood Request Near You',
    message: 'Metropolitan Hospital needs AB- blood type within 2km from your location.',
    time: '2 days ago',
    unread: false
  },
  {
    id: '6',
    type: 'event',
    icon: Calendar,
    title: 'New Event Added',
    message: 'Weekend Blood Drive at Riverside Mall has been scheduled for February 1st.',
    time: '3 days ago',
    unread: false
  }
];

export const Notifications = () => {
  const getIconColor = (type: string) => {
    switch (type) {
      case 'request':
        return 'bg-red-100 text-red-600';
      case 'event':
        return 'bg-blue-100 text-blue-600';
      case 'success':
        return 'bg-green-100 text-green-600';
      case 'info':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <MainLayout>
      <PageWrapper>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Notifications</h1>
              <p className="text-xl text-gray-600">Stay updated with the latest information</p>
            </div>
            <button className="text-red-600 hover:text-red-700 font-semibold">
              Mark all as read
            </button>
          </div>

          <div className="space-y-4">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition ${
                    notification.unread ? 'border-l-4 border-red-600' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${getIconColor(notification.type)}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                        {notification.unread && (
                          <span className="bg-red-600 rounded-full w-2 h-2"></span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{notification.message}</p>
                      <p className="text-sm text-gray-500">{notification.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PageWrapper>
    </MainLayout>
  );
};
