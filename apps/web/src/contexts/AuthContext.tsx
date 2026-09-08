import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { isDemoSession } from '../services/api';
import { User, Profile, UserRole, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<{ success: boolean; message?: string; role?: UserRole }>;
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
      if (token.startsWith('demo-')) {
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

  const getPasswordStore = () => {
    const raw = localStorage.getItem('edusphere_passwords');
    if (!raw) return {} as Record<string, string>;
    try {
      return JSON.parse(raw) as Record<string, string>;
    } catch {
      return {} as Record<string, string>;
    }
  };

  const setPasswordStore = (passwords: Record<string, string>) => {
    localStorage.setItem('edusphere_passwords', JSON.stringify(passwords));
  };

  const getSavedPassword = (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const store = getPasswordStore();
    return localStorage.getItem(`edusphere_password_${normalizedEmail}`) || store[normalizedEmail] || null;
  };

  const savePasswordForUser = (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const passwordStore = getPasswordStore();
    passwordStore[normalizedEmail] = password;
    setPasswordStore(passwordStore);
    localStorage.setItem(`edusphere_password_${normalizedEmail}`, password);
  };

  const getDefaultPasswordForEmail = (email: string, selectedRole?: UserRole) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (selectedRole === 'FACULTY' || selectedRole === 'MENTOR') {
      const facultyDefaults: Record<string, string> = {
        'faculty@edusphere.ai': 'Faculty@12345',
        'priya.kumar@edusphere.ai': 'Faculty@12345',
        'aarav.patil@edusphere.ai': 'Faculty@12345',
        'aarav@edusphere.ai': 'Faculty@12345',
        'arun.kumar@edusphere.ai': 'Faculty@12345',
        'rohit.kumar@edusphere.ai': 'Faculty@12345',
        'rohit.sharma@edusphere.ai': 'Faculty@12345',
        'hod.it@edusphere.ai': 'Faculty@12345',
        'warden@edusphere.ai': 'Faculty@12345',
        'mentor@edusphere.ai': 'Mentor@12345',
      };
      return facultyDefaults[normalizedEmail] || null;
    }

    if (selectedRole === 'ADMIN') {
      if (normalizedEmail === 'admin@edusphere.ai') return 'Admin@12345';
      return null;
    }

    // Student defaults
    const studentDefaults: Record<string, string> = {
      'aarav@edusphere.ai': 'Student@12345',
      'nisha.kulkarni@edusphere.ai': 'Student@12345',
      'priya.sharma@edusphere.ai': 'Student@12345',
      'rohit.kumar@edusphere.ai': 'Student@12345',
      'rahul.s@student.edusphere.ai': 'Student@12345',
      'rahul.s@edusphere.ai': 'Student@12345',
      'sameer.sen@edusphere.ai': 'Student@12345',
      'vikram.s@student.edusphere.ai': 'Student@12345',
      'vikram.s@edusphere.ai': 'Student@12345',
    };
    return studentDefaults[normalizedEmail] || null;
  };

  const isEmailAllowedForRole = (email: string, role: UserRole): boolean => {
    const normalizedEmail = email.trim().toLowerCase();
    if (role === 'ADMIN') {
      return normalizedEmail === 'admin@edusphere.ai' || normalizedEmail.includes('admin');
    }

    if (role === 'FACULTY' || role === 'MENTOR') {
      const allowedFaculty = [
        'faculty@edusphere.ai',
        'priya.kumar@edusphere.ai',
        'aarav.patil@edusphere.ai',
        'aarav@edusphere.ai',
        'arun.kumar@edusphere.ai',
        'rohit.kumar@edusphere.ai',
        'rohit.sharma@edusphere.ai',
        'hod.it@edusphere.ai',
        'warden@edusphere.ai',
        'mentor@edusphere.ai',
      ];
      return allowedFaculty.includes(normalizedEmail) || normalizedEmail.includes('faculty') || normalizedEmail.includes('mentor') || normalizedEmail.includes('warden');
    }

    if (role === 'STUDENT') {
      const allowedStudents = [
        'aarav@edusphere.ai',
        'nisha.kulkarni@edusphere.ai',
        'priya.sharma@edusphere.ai',
        'rohit.kumar@edusphere.ai',
        'rahul.s@student.edusphere.ai',
        'rahul.s@edusphere.ai',
        'sameer.sen@edusphere.ai',
        'vikram.s@student.edusphere.ai',
        'vikram.s@edusphere.ai',
      ];
      return allowedStudents.includes(normalizedEmail) || normalizedEmail.includes('student.');
    }

    return false;
  };

  const isKnownUser = (email: string): boolean => {
    const normalizedEmail = email.trim().toLowerCase();
    const allUsers = [
      'admin@edusphere.ai',
      'faculty@edusphere.ai',
      'priya.kumar@edusphere.ai',
      'aarav.patil@edusphere.ai',
      'aarav@edusphere.ai',
      'arun.kumar@edusphere.ai',
      'rohit.kumar@edusphere.ai',
      'rohit.sharma@edusphere.ai',
      'hod.it@edusphere.ai',
      'warden@edusphere.ai',
      'mentor@edusphere.ai',
      'nisha.kulkarni@edusphere.ai',
      'priya.sharma@edusphere.ai',
      'rahul.s@student.edusphere.ai',
      'rahul.s@edusphere.ai',
      'sameer.sen@edusphere.ai',
      'vikram.s@student.edusphere.ai',
      'vikram.s@edusphere.ai',
    ];
    return allUsers.includes(normalizedEmail);
  };

  const getSystemRoleFromEmail = (email: string): UserRole | null => {
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail === 'admin@edusphere.ai' || normalizedEmail.includes('admin')) {
      return 'ADMIN';
    }

    const facultyEmails = [
      'faculty@edusphere.ai',
      'priya.kumar@edusphere.ai',
      'aarav.patil@edusphere.ai',
      'arun.kumar@edusphere.ai',
      'rohit.sharma@edusphere.ai',
      'hod.it@edusphere.ai',
      'warden@edusphere.ai',
      'mentor@edusphere.ai',
    ];
    if (facultyEmails.includes(normalizedEmail) || normalizedEmail.includes('faculty') || normalizedEmail.includes('mentor') || normalizedEmail.includes('warden')) {
      return 'FACULTY';
    }

    const studentEmails = [
      'nisha.kulkarni@edusphere.ai',
      'priya.sharma@edusphere.ai',
      'rahul.s@student.edusphere.ai',
      'rahul.s@edusphere.ai',
      'sameer.sen@edusphere.ai',
      'vikram.s@student.edusphere.ai',
      'vikram.s@edusphere.ai',
    ];
    if (studentEmails.includes(normalizedEmail) || normalizedEmail.includes('student.')) {
      return 'STUDENT';
    }

    // Dual accounts (Aarav, Rohit) default to student if unspecified
    if (normalizedEmail === 'aarav@edusphere.ai' || normalizedEmail === 'rohit.kumar@edusphere.ai') {
      return 'STUDENT';
    }

    return null;
  };

  const getRoleFromEmail = (email: string): UserRole => {
    return getSystemRoleFromEmail(email) || 'STUDENT';
  };

  const buildDemoAuthResponse = (email: string, selectedRole?: UserRole): AuthResponse => {
    const normalizedEmail = email.trim().toLowerCase();
    const resolvedRole = selectedRole || getRoleFromEmail(normalizedEmail);

    let fullName = 'Faculty User';
    let designation = 'Faculty Member';
    let facultyRole: 'HOD' | 'FACULTY' | 'MENTOR' | 'WARDEN' = 'FACULTY';
    let isMentor = false;
    let isWarden = false;
    let deptCode = 'CSE';
    let deptName = 'Computer Science & Engineering';

    if (resolvedRole === 'STUDENT') {
      if (normalizedEmail.includes('aarav')) {
        fullName = 'Aarav Patel';
        deptCode = 'CSE';
        deptName = 'Computer Science & Engineering';
      } else if (normalizedEmail.includes('priya.sharma')) {
        fullName = 'Priya Sharma';
        deptCode = 'ECE';
        deptName = 'Electronics & Communication Engineering';
      } else if (normalizedEmail.includes('rohit.kumar')) {
        fullName = 'Rohit Kumar';
        deptCode = 'MECH';
        deptName = 'Mechanical Engineering';
      } else if (normalizedEmail.includes('nisha')) {
        fullName = 'Nisha Kulkarni';
        deptCode = 'AI_DS';
        deptName = 'Artificial Intelligence & Data Science';
      } else if (normalizedEmail.includes('rahul')) {
        fullName = 'Rahul S';
        deptCode = 'IT';
        deptName = 'Information Technology';
      } else {
        fullName = 'Student User';
      }

      return {
        user: {
          id: `std-${normalizedEmail.split('@')[0]}`,
          email: normalizedEmail,
          role: 'STUDENT',
          lastLogin: new Date().toISOString(),
        },
        profile: {
          _id: `profile-${normalizedEmail.split('@')[0]}`,
          user: `std-${normalizedEmail.split('@')[0]}`,
          firstName: fullName.split(' ')[0],
          lastName: fullName.split(' ').slice(1).join(' '),
          registrationNo: normalizedEmail.includes('aarav') ? '22CS084' : normalizedEmail.includes('nisha') ? '23AI042' : '22CS105',
          fullName,
          department: { _id: `dept-${deptCode.toLowerCase()}`, code: deptCode, name: deptName, establishedYear: 2008 },
        },
        accessToken: `demo-access-${Date.now()}`,
        refreshToken: `demo-refresh-${Date.now()}`,
      };
    }

    if (resolvedRole === 'ADMIN') {
      return {
        user: {
          id: 'adm-suresh',
          email: normalizedEmail,
          role: 'ADMIN',
          lastLogin: new Date().toISOString(),
        },
        profile: {
          _id: 'profile-admin',
          user: 'adm-suresh',
          firstName: 'Dr. Suresh',
          lastName: 'Nambiar',
          fullName: 'Dr. Suresh Nambiar',
          registrationNo: 'ADM-2026-001',
          designation: 'Dean of Academic Affairs & Chief Administrator',
          department: { _id: 'dept-admin', code: 'ADMIN', name: 'Campus Administration', establishedYear: 2000 },
        },
        accessToken: `demo-access-${Date.now()}`,
        refreshToken: `demo-refresh-${Date.now()}`,
      };
    }

    // Faculty side accounts:
    if (normalizedEmail.includes('priya') || normalizedEmail === 'faculty@edusphere.ai') {
      fullName = 'Dr. Priya Kumar';
      designation = 'Professor & Head of Department';
      facultyRole = 'HOD';
      isMentor = false;
      deptCode = 'CSE';
      deptName = 'Computer Science & Engineering';
    } else if (normalizedEmail.includes('aarav')) {
      fullName = 'Aarav Patil';
      designation = 'Assistant Professor & Faculty Mentor';
      facultyRole = 'FACULTY';
      isMentor = true;
      deptCode = 'CSE';
      deptName = 'Computer Science & Engineering';
    } else if (normalizedEmail.includes('arun')) {
      fullName = 'Mr. Arun Kumar';
      designation = 'Associate Professor & Faculty Mentor';
      facultyRole = 'FACULTY';
      isMentor = true;
      deptCode = 'CSE';
      deptName = 'Computer Science & Engineering';
    } else if (normalizedEmail.includes('rohit.kumar')) {
      fullName = 'Mr. Rohit Kumar';
      designation = 'Assistant Professor';
      facultyRole = 'FACULTY';
      isMentor = false;
      deptCode = 'MECH';
      deptName = 'Mechanical Engineering';
    } else if (normalizedEmail.includes('rohit.sharma') || normalizedEmail.includes('rohit')) {
      fullName = 'Dr. Rohit Sharma';
      designation = 'Associate Professor & Faculty Mentor';
      facultyRole = 'FACULTY';
      isMentor = true;
      deptCode = 'IT';
      deptName = 'Information Technology';
    } else if (normalizedEmail.includes('hod.it')) {
      fullName = 'Dr. Rajesh Venkat';
      designation = 'Professor & Head of Department';
      facultyRole = 'HOD';
      isMentor = false;
      deptCode = 'IT';
      deptName = 'Information Technology';
    } else if (normalizedEmail.includes('warden')) {
      fullName = 'Mr. K. Narayanan';
      designation = 'Chief Hostel Warden';
      facultyRole = 'WARDEN';
      isWarden = true;
      deptCode = 'HOSTEL';
      deptName = 'Campus Residential Services';
    } else if (normalizedEmail.includes('mentor')) {
      fullName = 'Prof. Anita Verma';
      designation = 'Senior Academic Counselor & Mentor';
      facultyRole = 'MENTOR';
      isMentor = true;
      deptCode = 'CSE';
      deptName = 'Computer Science & Engineering';
    }

    return {
      user: {
        id: `fac-${normalizedEmail.split('@')[0]}`,
        email: normalizedEmail,
        role: 'FACULTY',
        lastLogin: new Date().toISOString(),
      },
      profile: {
        _id: `profile-${normalizedEmail.split('@')[0]}`,
        user: `fac-${normalizedEmail.split('@')[0]}`,
        firstName: fullName.split(' ')[0],
        lastName: fullName.split(' ').slice(1).join(' '),
        registrationNo: `FAC-${deptCode}-001`,
        fullName,
        designation,
        facultyRole,
        isMentor,
        isWarden,
        department: { _id: `dept-${deptCode.toLowerCase()}`, code: deptCode, name: deptName, establishedYear: 2008 },
      },
      accessToken: `demo-access-${Date.now()}`,
      refreshToken: `demo-refresh-${Date.now()}`,
    };
  };

  const login = async (email: string, password: string, role?: UserRole) => {
    try {
      setIsLoading(true);
      const normalizedEmail = email.trim().toLowerCase();

      // Check if user is known at all
      if (!isKnownUser(normalizedEmail)) {
        return { success: false, message: 'Invalid credentials.' };
      }

      // Check role authorization for tab
      const targetRole = role || getRoleFromEmail(normalizedEmail);
      if (!isEmailAllowedForRole(normalizedEmail, targetRole)) {
        return { success: false, message: 'Invalid credentials or unauthorized role.' };
      }

      // 2. Password verification
      const storedPassword = getSavedPassword(normalizedEmail);
      const defaultPassword = getDefaultPasswordForEmail(normalizedEmail, targetRole);

      const isValid = storedPassword
        ? storedPassword === password
        : defaultPassword === password || (normalizedEmail.includes('warden') && password === 'Warden@12345');

      if (!isValid) {
        return { success: false, message: 'Invalid credentials.' };
      }

      // 3. Construct session & determine target dashboard
      const authData = buildDemoAuthResponse(normalizedEmail, targetRole);
      savePasswordForUser(normalizedEmail, password);
      handleAuthSuccess(authData);

      // Determine redirect URL
      let redirectUrl = '/student';
      if (targetRole === 'ADMIN') {
        redirectUrl = '/admin';
      } else if (targetRole === 'FACULTY') {
        const facRole = authData.profile?.facultyRole;
        if (facRole === 'HOD') {
          redirectUrl = '/faculty/hod';
        } else if (facRole === 'WARDEN') {
          redirectUrl = '/faculty/warden';
        } else if (facRole === 'MENTOR') {
          redirectUrl = '/faculty/mentor';
        } else {
          redirectUrl = '/faculty/dashboard';
        }
      }

      return {
        success: true,
        role: targetRole,
        facultyRole: authData.profile?.facultyRole,
        redirectUrl,
      };
    } catch (err: any) {
      return { success: false, message: 'Invalid credentials or unauthorized role.' };
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    if (!user?.email) {
      return { success: false, message: 'You must be signed in to change the password.' };
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { success: false, message: 'Please fill in all password fields.' };
    }

    if (newPassword.length < 8) {
      return { success: false, message: 'New password must be at least 8 characters long.' };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, message: 'New password and confirm password do not match.' };
    }

    const normalizedEmail = user.email.trim().toLowerCase();
    const passwordStore = getPasswordStore();
    const storedPassword = getSavedPassword(normalizedEmail);
    const defaultPassword = getDefaultPasswordForEmail(normalizedEmail);
    const currentMatchesStored = storedPassword ? currentPassword === storedPassword : false;
    const currentMatchesDefault = !storedPassword && defaultPassword ? currentPassword === defaultPassword : false;

    if (!currentMatchesStored && !currentMatchesDefault) {
      return { success: false, message: 'Current password is incorrect.' };
    }

    if (currentPassword === newPassword) {
      return { success: false, message: 'New password must be different from the current password.' };
    }

    if (isDemoSession()) {
      savePasswordForUser(normalizedEmail, newPassword);
      return { success: true, message: 'Password changed successfully. Use the new password to sign in next time.' };
    }

    try {
      const res = await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (res.data.success) {
        savePasswordForUser(normalizedEmail, newPassword);
        return { success: true, message: res.data.message || 'Password changed successfully.' };
      }

      return { success: false, message: res.data.message || 'Password change failed.' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Password change failed. Please try again.' };
    }
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
        changePassword,
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
