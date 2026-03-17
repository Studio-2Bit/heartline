import { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, MapPin, Mail, Phone, Building2, User, AlertCircle, Droplet, Hash, ImageIcon } from 'lucide-react';

const API = 'http://localhost:5000/api/admin';
const getToken = () => localStorage.getItem('token');
const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

type TabType = 'donors' | 'hospitals';

interface Donor {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  bloodType?: string;
  registrationNumber?: string;
  totalDonations?: number;
  idProof?: string;   
  createdAt?: string;
}

interface Hospital {
  _id: string;
  name: string;
  email: string;
  hospitalName?: string;
  phone?: string;
  location?: string;
  registrationNumber?: string;
  approvalNumber?: string;
  createdAt?: string;
}

export default function PendingVerifications() {
  const [activeTab, setActiveTab] = useState<TabType>('donors');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [dRes, hRes] = await Promise.all([
        axios.get(`${API}/pending-donors`, authHeaders()),
        axios.get(`${API}/pending-hospitals`, authHeaders()),
      ]);
      setDonors(dRes.data.donors);
      setHospitals(hRes.data.hospitals);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch pending verifications');
    } finally {
      setIsLoading(false);
    }
  };

  const approveUser = async (id: string) => {
    try {
      await axios.patch(`${API}/verify/${id}`, {}, authHeaders());
      setDonors((prev) => prev.filter((d) => d._id !== id));
      setHospitals((prev) => prev.filter((h) => h._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to verify user');
    }
  };

  const rejectUser = async (id: string) => {
    if (!confirm('Are you sure you want to reject and delete this user?')) return;
    try {
      await axios.delete(`${API}/reject/${id}`, authHeaders());
      setDonors((prev) => prev.filter((d) => d._id !== id));
      setHospitals((prev) => prev.filter((h) => h._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to reject user');
    }
  };

  const tabs = [
    { id: 'donors' as TabType, label: 'Donors', count: donors.length },
    { id: 'hospitals' as TabType, label: 'Hospitals', count: hospitals.length },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pending Verifications</h1>
        <p className="text-gray-600">Review and approve or reject pending registrations</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-1 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id ? 'bg-red-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-red-700' : 'bg-gray-200 text-gray-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {isLoading && <div className="text-center py-12 text-gray-400">Loading...</div>}

          {/* Donors Tab */}
          {!isLoading && activeTab === 'donors' && (
            <div className="space-y-4">
              {donors.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No pending donor verifications</p>
              ) : (
                donors.map((donor) => (
                  <div key={donor._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          <User className="text-red-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{donor.name}</h3>
                          <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit mt-0.5">
                            <Droplet size={10} /> {donor.bloodType || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        Pending
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={15} className="text-gray-400" />{donor.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={15} className="text-gray-400" />{donor.phone || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={15} className="text-gray-400" />{donor.location || 'N/A'}
                      </div>
                      {donor.registrationNumber && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Hash size={15} className="text-gray-400" />{donor.registrationNumber}
                        </div>
                      )}
                    </div>

                    {/* ID Proof Image */}
                    {donor.idProof ? (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                          <ImageIcon size={14} /> ID Proof
                        </p>
                        <a href={donor.idProof} target="_blank" rel="noopener noreferrer">
                          <img
                            src={donor.idProof}
                            alt="ID Proof"
                            className="w-full max-h-52 object-cover rounded-lg border border-gray-200 hover:opacity-90 transition cursor-pointer"
                          />
                          <p className="text-xs text-blue-600 mt-1">Click to view full image</p>
                        </a>
                      </div>
                    ) : (
                      <div className="mb-4 bg-gray-50 rounded-lg p-3 flex items-center gap-2 text-gray-400 text-sm">
                        <ImageIcon size={14} />
                        No ID proof uploaded
                      </div>
                    )}

                    {donor.createdAt && (
                      <p className="text-xs text-gray-400 mb-4">
                        Registered on {new Date(donor.createdAt).toLocaleDateString('en-US', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    )}

                    <div className="flex justify-end gap-2">
                      <button onClick={() => rejectUser(donor._id)} className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition text-sm font-medium">
                        <X size={15} /> Reject
                      </button>
                      <button onClick={() => approveUser(donor._id)} className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 transition text-sm font-medium">
                        <Check size={15} /> Approve
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Hospitals Tab */}
          {!isLoading && activeTab === 'hospitals' && (
            <div className="space-y-4">
              {hospitals.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No pending hospital verifications</p>
              ) : (
                hospitals.map((hospital) => (
                  <div key={hospital._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Building2 className="text-blue-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{hospital.hospitalName || hospital.name}</h3>
                          <p className="text-sm text-gray-500">{hospital.name}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Pending</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={15} className="text-gray-400" />{hospital.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={15} className="text-gray-400" />{hospital.phone || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={15} className="text-gray-400" />{hospital.location || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Hash size={15} className="text-gray-400" />Reg: {hospital.registrationNumber || 'N/A'}
                      </div>
                      {hospital.approvalNumber && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 md:col-span-2">
                          <Hash size={15} className="text-gray-400" />Approval: {hospital.approvalNumber}
                        </div>
                      )}
                    </div>

                    {hospital.createdAt && (
                      <p className="text-xs text-gray-400 mb-4">
                        Registered on {new Date(hospital.createdAt).toLocaleDateString('en-US', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    )}

                    <div className="flex justify-end gap-2">
                      <button onClick={() => rejectUser(hospital._id)} className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition text-sm font-medium">
                        <X size={15} /> Reject
                      </button>
                      <button onClick={() => approveUser(hospital._id)} className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 transition text-sm font-medium">
                        <Check size={15} /> Approve
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}