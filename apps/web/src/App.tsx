import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { MentorDashboard } from './pages/mentor/MentorDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserRole } from './types';

// Root redirector based on authenticated user role
const RootRedirect: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const roleRedirectMap: Record<UserRole, string> = {
    STUDENT: '/student',
    FACULTY: '/faculty',
    MENTOR: '/mentor',
    ADMIN: '/admin',
  };

  return <Navigate to={roleRedirectMap[user.role] || '/login'} replace />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Root Redirector */}
          <Route path="/" element={<RootRedirect />} />

          {/* Student Role Routes */}
          <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/*" element={<StudentDashboard />} />
            </Route>
          </Route>

          {/* Faculty Role Routes */}
          <Route element={<ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/faculty" element={<FacultyDashboard />} />
              <Route path="/faculty/*" element={<FacultyDashboard />} />
            </Route>
          </Route>

          {/* Mentor Role Routes */}
          <Route element={<ProtectedRoute allowedRoles={['MENTOR', 'ADMIN']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/mentor" element={<MentorDashboard />} />
              <Route path="/mentor/*" element={<MentorDashboard />} />
            </Route>
          </Route>

          {/* Admin Role Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
