import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginApi, registerApi } from '../services/auth.api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'donor' | 'hospital';
  profileCompleted: boolean;
  isVerified: boolean;
  bloodType?: string;
  location?: string;
  phone?: string;
  nextEligibleDate?: string;
  lastDonationDate?: string;
  availabilityStatus?: 'available' | 'unavailable';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;  // ← new
  login: (email: string, password: string, role: 'donor' | 'hospital') => Promise<void>;
  register: (name: string, email: string, password: string, role: 'donor' | 'hospital') => Promise<void>;
  logout: () => void;
  markProfileCompleted: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);  // ← start true

  useEffect(() => {
    // Read from localStorage on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);  // ← done loading
  }, []);

  const login = async (email: string, password: string, role: 'donor' | 'hospital') => {
    const response = await loginApi({ email, password, role });
    const { user, token } = response.data;
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: 'donor' | 'hospital'
  ) => {
    const response = await registerApi({ name, email, password, role });
    const { user, token } = response.data;
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  };

  const markProfileCompleted = () => {
    if (!user) return;
    const updated = { ...user, profileCompleted: true };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, markProfileCompleted }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};