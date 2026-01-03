export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'donor' | 'hospital';
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Donor {
  id: string;
  name: string;
  email: string;
  bloodType: string;
  certificateImage: string;
  phone: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface Hospital {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  organizerName: string;
  organizerEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface SystemLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  type: 'info' | 'warning' | 'error';
}

export interface DashboardStats {
  activeDonors: number;
  hospitals: number;
  pendingVerifications: number;
  totalUsers: number;
}
