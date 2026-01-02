import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'donor' | 'hospital';
  profileCompleted: boolean;
  bloodType?: string;
  location?: string;
  phone?: string;
  verified?: boolean;
  availabilityStatus?: 'available' | 'unavailable';
  nextEligibleDate?: string;
  hospitalName?: string;
  registrationNumber?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'donor' | 'hospital') => Promise<void>;
  register: (name: string, email: string, password: string, role: 'donor' | 'hospital') => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, role: 'donor' | 'hospital') => {
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email,
      role,
      profileCompleted: true,
      bloodType: role === 'donor' ? 'O+' : undefined,
      location: 'New York, NY',
      phone: '+1234567890',
      verified: true,
      availabilityStatus: role === 'donor' ? 'available' : undefined,
      nextEligibleDate: role === 'donor' ? '2025-03-15' : undefined,
      hospitalName: role === 'hospital' ? 'City General Hospital' : undefined,
      registrationNumber: '12345'
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const register = async (name: string, email: string, password: string, role: 'donor' | 'hospital') => {
    const newUser: User = {
      id: '1',
      name,
      email,
      role,
      profileCompleted: false
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
