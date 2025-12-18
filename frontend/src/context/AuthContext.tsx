import { createContext, useContext, useEffect, useState } from 'react';
import { api, setAccessToken } from '../lib/api';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  email: string;
  name?: string;
  role: 'INSTRUCTOR' | 'USER';
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in on app mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.post('/auth/refresh');
        setAccessToken(data.access_token);
        setUser(data.user);
      } catch (error) {
        console.log("Not authenticated");
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Login 
  const login = (token: string, userData: User) => {
    setAccessToken(token);
    setUser(userData);
    navigate(userData.role === 'INSTRUCTOR' ? '/dashboard' : '/courses');
  };

  // Logout 
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setAccessToken(null);
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context){
    throw new Error('useAuth must be used within AuthProvider');
  } 
  return context;
};