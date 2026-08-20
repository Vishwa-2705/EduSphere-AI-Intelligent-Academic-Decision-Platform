import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { User, Profile, UserRole, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<{ success: boolean; message?: string; role?: UserRole }>;
  quickDemoLogin: (role: UserRole) => Promise<{ success: boolean; message?: string; role?: UserRole }>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_CREDENTIALS: Record<UserRole, { email: string; password: string; name: string; title: string; rollNo: string }> = {
  STUDENT: {
    email: 'student@edusphere.ai',
    password: 'Student@12345',
    name: 'Aarav Patel',
    title: 'B.Tech Student (Semester 6)',
    rollNo: '22CS084',
  },
  FACULTY: {
    email: 'faculty@edusphere.ai',
    password: 'Faculty@12345',
    name: 'Dr. Rajesh Sharma',
    title: 'Associate Professor & Algorithm Lead',
    rollNo: 'FAC-CSE-042',
  },
  MENTOR: {
    email: 'mentor@edusphere.ai',
    password: 'Mentor@12345',
    name: 'Prof. Anita Verma',
    title: 'Senior Faculty Mentor & Counselor',
    rollNo: 'MNT-CSE-018',
  },
  ADMIN: {
    email: 'admin@edusphere.ai',
    password: 'Admin@12345',
    name: 'Dr. Suresh Nambiar',
    title: 'Dean of Academic Affairs & Admin',
    rollNo: 'ADM-2026-001',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUserData = async () => {
    try {
      const token = localStorage.getItem('edusphere_access_token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.data.user);
        setProfile(res.data.data.profile);
        localStorage.setItem('edusphere_user', JSON.stringify(res.data.data.user));
        if (res.data.data.profile) {
          localStorage.setItem('edusphere_profile', JSON.stringify(res.data.data.profile));
        }
      }
    } catch (err) {
      console.error('Failed to restore session:', err);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cachedUser = localStorage.getItem('edusphere_user');
    const cachedProfile = localStorage.getItem('edusphere_profile');
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
        if (cachedProfile) setProfile(JSON.parse(cachedProfile));
      } catch (e) {
        console.error('Error parsing cached user:', e);
      }
    }
    refreshUserData();
  }, []);

  const handleAuthSuccess = (data: AuthResponse) => {
    setUser(data.user);
    setProfile(data.profile);
    localStorage.setItem('edusphere_access_token', data.accessToken);
    localStorage.setItem('edusphere_refresh_token', data.refreshToken);
    localStorage.setItem('edusphere_user', JSON.stringify(data.user));
    if (data.profile) {
      localStorage.setItem('edusphere_profile', JSON.stringify(data.profile));
    }
  };

  const login = async (email: string, password: string, role?: UserRole) => {
    try {
      setIsLoading(true);
      const payload: any = { email: email.trim(), password };
      if (role) payload.role = role;

      const res = await api.post('/auth/login', payload);
      if (res.data.success) {
        handleAuthSuccess(res.data.data);
        return { success: true, role: res.data.data.user.role };
      }
      return { success: false, message: res.data.message };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Authentication failed. Please check your credentials.';
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const quickDemoLogin = async (role: UserRole) => {
    const creds = DEMO_CREDENTIALS[role];
    return login(creds.email, creds.password, role);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore network errors during logout
    } finally {
      setUser(null);
      setProfile(null);
      localStorage.removeItem('edusphere_access_token');
      localStorage.removeItem('edusphere_refresh_token');
      localStorage.removeItem('edusphere_user');
      localStorage.removeItem('edusphere_profile');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        isLoading,
        login,
        quickDemoLogin,
        logout,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
