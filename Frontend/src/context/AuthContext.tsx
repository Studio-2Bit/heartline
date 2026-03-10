import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginApi, registerApi } from '../services/auth.api';


interface User {
  id: string;
  name: string;
  email: string;
  role: 'donor' | 'hospital';
  profileCompleted: boolean;
  verified?: boolean;
  bloodType?: string;
  location?: string;
  phone?: string;
  nextEligibleDate?: string;
  lastDonationDate?: string;
  availabilityStatus?: 'available' | 'unavailable';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'donor' | 'hospital') => Promise<void>;
  register: (name: string, email: string, password: string, role: 'donor' | 'hospital') => Promise<void>;
  logout: () => void;
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

  // 🔐 LOGIN
  const login = async (email: string, password: string, role: 'donor' | 'hospital') => {
    const response = await loginApi({ email, password, role });
    const { user, token } = response.data;

   /* if (!user.verified) {
      throw new Error('Your account is not verified yet');
    }*/

    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  };

  // 📝 REGISTER
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

  // 🚪 LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
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
