import { useState } from 'react';
import { Check, X, Calendar, MapPin, Mail, Phone, Building2, User } from 'lucide-react';
import { mockPendingDonors, mockPendingHospitals, mockPendingEvents } from '../data/mockData';
import { Donor, Hospital, Event } from '../types';

type TabType = 'donors' | 'hospitals' | 'events';

export default function PendingVerifications() {
  const [activeTab, setActiveTab] = useState<TabType>('donors');
  const [donors, setDonors] = useState(mockPendingDonors);
  const [hospitals, setHospitals] = useState(mockPendingHospitals);
  const [events, setEvents] = useState(mockPendingEvents);

  const handleApproveDonor = (id: string) => {
    setDonors(donors.filter(d => d.id !== id));
  };

  const handleRejectDonor = (id: string) => {
    setDonors(donors.filter(d => d.id !== id));
  };

  const handleApproveHospital = (id: string) => {
    setHospitals(hospitals.filter(h => h.id !== id));
  };

  const handleRejectHospital = (id: string) => {
    setHospitals(hospitals.filter(h => h.id !== id));
  };

  const handleApproveEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const handleRejectEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const tabs = [
    { id: 'donors' as TabType, label: 'Donors', count: donors.length },
    { id: 'hospitals' as TabType, label: 'Hospitals', count: hospitals.length },
    { id: 'events' as TabType, label: 'Events', count: events.length },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pending Verifications</h1>
        <p className="text-gray-600">Review and approve or reject pending registrations</p>
      </div>

      <div className="bg-white rounded-xl shadow-md">
        <div className="border-b border-gray-200">
          <div className="flex gap-1 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-red-700'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'donors' && (
            <div className="space-y-4">
              {donors.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No pending donor verifications</p>
              ) : (
                donors.map((donor) => (
                  <DonorCard
                    key={donor.id}
                    donor={donor}
                    onApprove={handleApproveDonor}
                    onReject={handleRejectDonor}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'hospitals' && (
            <div className="space-y-4">
              {hospitals.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No pending hospital verifications</p>
              ) : (
                hospitals.map((hospital) => (
                  <HospitalCard
                    key={hospital.id}
                    hospital={hospital}
                    onApprove={handleApproveHospital}
                    onReject={handleRejectHospital}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-4">
              {events.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No pending event verifications</p>
              ) : (
                events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onApprove={handleApproveEvent}
                    onReject={handleRejectEvent}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DonorCard({ donor, onApprove, onReject }: {
  donor: Donor;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <User className="text-red-600" size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{donor.name}</h3>
            <p className="text-sm text-gray-500">Blood Type: <span className="font-semibold text-red-600">{donor.bloodType}</span></p>
          </div>
        </div>
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
          Pending
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail size={16} className="text-gray-400" />
          <span>{donor.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone size={16} className="text-gray-400" />
          <span>{donor.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 md:col-span-2">
          <MapPin size={16} className="text-gray-400" />
          <span>{donor.address}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Submitted {new Date(donor.submittedAt).toLocaleDateString()}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onReject(donor.id)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <X size={16} />
            Reject
          </button>
          <button
            onClick={() => onApprove(donor.id)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Check size={16} />
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}

function HospitalCard({ hospital, onApprove, onReject }: {
  hospital: Hospital;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Building2 className="text-gray-700" size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{hospital.name}</h3>
            <p className="text-sm text-gray-500">License: <span className="font-mono">{hospital.licenseNumber}</span></p>
          </div>
        </div>
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
          Pending
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail size={16} className="text-gray-400" />
          <span>{hospital.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone size={16} className="text-gray-400" />
          <span>{hospital.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 md:col-span-2">
          <MapPin size={16} className="text-gray-400" />
          <span>{hospital.address}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Submitted {new Date(hospital.submittedAt).toLocaleDateString()}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onReject(hospital.id)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <X size={16} />
            Reject
          </button>
          <button
            onClick={() => onApprove(hospital.id)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Check size={16} />
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event, onApprove, onReject }: {
  event: Event;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg mb-1">{event.title}</h3>
          <p className="text-sm text-gray-600">{event.description}</p>
        </div>
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
          Pending
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} className="text-gray-400" />
          <span>{new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User size={16} className="text-gray-400" />
          <span>{event.organizerName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={16} className="text-gray-400" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail size={16} className="text-gray-400" />
          <span>{event.organizerEmail}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Submitted {new Date(event.submittedAt).toLocaleDateString()}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onReject(event.id)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <X size={16} />
            Reject
          </button>
          <button
            onClick={() => onApprove(event.id)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Check size={16} />
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
