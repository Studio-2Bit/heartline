import { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Calendar, MapPin, Mail, Phone, Building2, User } from 'lucide-react';

type TabType = 'donors' | 'hospitals';

interface Donor {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bloodType?: string;
  certificateImage?: string;
  submittedAt?: string;
  role: string;
  isVerified: boolean;
}

interface Hospital {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  licenseNumber?: string;
  submittedAt?: string;
  role: string;
  isVerified: boolean;
}

export default function PendingVerifications() {

  const [activeTab, setActiveTab] = useState<TabType>('donors');

  const [donors, setDonors] = useState<Donor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {

      const res = await axios.get("http://localhost:5000/api/auth/");

      const users = res.data;

      const pendingDonors = users.filter(
        (u: any) => u.role === "donor" && u.isVerified === false
      );

      const pendingHospitals = users.filter(
        (u: any) => u.role === "hospital" && u.isVerified === false
      );

      setDonors(pendingDonors);
      setHospitals(pendingHospitals);

    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const approveUser = async (id: string) => {

    try {

      await axios.put(`http://localhost:5000/api/auth/verify/${id}`);

      setDonors(donors.filter(d => d._id !== id));
      setHospitals(hospitals.filter(h => h._id !== id));

    } catch (error) {
      console.error("Verification error", error);
    }
  };

  const rejectUser = async (id: string) => {

    try {

      await axios.delete(`http://localhost:5000/api/auth/${id}`);

      setDonors(donors.filter(d => d._id !== id));
      setHospitals(hospitals.filter(h => h._id !== id));

    } catch (error) {
      console.error("Delete error", error);
    }
  };

  const tabs = [
    { id: 'donors' as TabType, label: 'Donors', count: donors.length },
    { id: 'hospitals' as TabType, label: 'Hospitals', count: hospitals.length },
  ];

  return (
    <div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pending Verifications
        </h1>

        <p className="text-gray-600">
          Review and approve or reject pending registrations
        </p>
      </div>


      <div className="bg-white rounded-xl shadow-md">

        {/* Tabs */}

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
                <p className="text-center text-gray-500 py-8">
                  No pending donor verifications
                </p>
              ) : (
                donors.map((donor) => (

                  <DonorCard
                    key={donor._id}
                    donor={donor}
                    onApprove={approveUser}
                    onReject={rejectUser}
                  />

                ))
              )}

            </div>

          )}


          {activeTab === 'hospitals' && (

            <div className="space-y-4">

              {hospitals.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No pending hospital verifications
                </p>
              ) : (
                hospitals.map((hospital) => (

                  <HospitalCard
                    key={hospital._id}
                    hospital={hospital}
                    onApprove={approveUser}
                    onReject={rejectUser}
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


function DonorCard({ donor, onApprove, onReject }: any) {

  return (

    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md">

      <div className="flex items-start justify-between mb-4">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <User className="text-red-600" size={24} />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {donor.name}
            </h3>

            <p className="text-sm text-gray-500">
              Blood Type:
              <span className="font-semibold text-red-600 ml-1">
                {donor.bloodType || "N/A"}
              </span>
            </p>

          </div>

        </div>

        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
          Pending
        </span>

      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail size={16}/>
          {donor.email}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone size={16}/>
          {donor.phone || "N/A"}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 md:col-span-2">
          <MapPin size={16}/>
          {donor.address || "N/A"}
        </div>

      </div>


      <div className="flex justify-end gap-2">

        <button
          onClick={() => onReject(donor._id)}
          className="px-4 py-2 border rounded-lg flex items-center gap-2"
        >
          <X size={16}/>
          Reject
        </button>

        <button
          onClick={() => onApprove(donor._id)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2"
        >
          <Check size={16}/>
          Approve
        </button>

      </div>

    </div>

  );

}


function HospitalCard({ hospital, onApprove, onReject }: any) {

  return (

    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md">

      <div className="flex items-start justify-between mb-4">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Building2 size={24}/>
          </div>

          <div>

            <h3 className="font-semibold text-gray-900 text-lg">
              {hospital.name}
            </h3>

            <p className="text-sm text-gray-500">
              License: {hospital.licenseNumber || "N/A"}
            </p>

          </div>

        </div>

        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
          Pending
        </span>

      </div>


      <div className="flex justify-end gap-2">

        <button
          onClick={() => onReject(hospital._id)}
          className="px-4 py-2 border rounded-lg flex items-center gap-2"
        >
          <X size={16}/>
          Reject
        </button>

        <button
          onClick={() => onApprove(hospital._id)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2"
        >
          <Check size={16}/>
          Approve
        </button>

      </div>

    </div>

  );

}