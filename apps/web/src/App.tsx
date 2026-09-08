import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FacultyProvider } from './contexts/FacultyContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LoginPage } from './pages/auth/LoginPage';

// ── Student Pages ───────────────────────────────────────────────────────────
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentCoursesPage } from './pages/student/StudentCoursesPage';
import { StudentTimetablePage } from './pages/student/StudentTimetablePage';
import { StudentAttendancePage } from './pages/student/StudentAttendancePage';
import { StudentExamsPage } from './pages/student/StudentExamsPage';
import { StudentMaterialsPage } from './pages/student/StudentMaterialsPage';
import { StudentPerformancePage } from './pages/student/StudentPerformancePage';
import { StudentMentorPage } from './pages/student/StudentMentorPage';
import { StudentLeavePage } from './pages/student/StudentLeavePage';
import { StudentFeesPage } from './pages/student/StudentFeesPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { StudentAdmissionPage } from './pages/student/StudentAdmissionPage';
import { StudentHostelPage } from './pages/student/StudentHostelPage';
import { StudentNotificationsPage } from './pages/student/StudentNotificationsPage';
import { StudentSettingsPage } from './pages/student/StudentSettingsPage';
import { StudentAIAdvisorPage } from './pages/student/StudentAIAdvisorPage';

// ── Faculty Unified & Sub-Role Pages ─────────────────────────────────────────
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';

// HOD Sub-Module
import { HODDashboard } from './pages/faculty/hod/HODDashboard';
import { HODMaterialVerificationPage } from './pages/faculty/hod/HODMaterialVerificationPage';
import { HODApprovedMaterialsPage } from './pages/faculty/hod/HODApprovedMaterialsPage';
import { HODDepartmentFacultyPage } from './pages/faculty/hod/HODDepartmentFacultyPage';
import { HODReportsPage } from './pages/faculty/hod/HODReportsPage';
import { HODNotificationsPage } from './pages/faculty/hod/HODNotificationsPage';
import { HODApplyLeavePage } from './pages/faculty/hod/HODApplyLeavePage';

// Department Faculty Sub-Module
import { DeptFacultyDashboard } from './pages/faculty/dept/DeptFacultyDashboard';
import { DeptFacultySubjectsPage } from './pages/faculty/dept/DeptFacultySubjectsPage';
import { DeptFacultySubmitMaterialPage } from './pages/faculty/dept/DeptFacultySubmitMaterialPage';
import { DeptFacultyMaterialStatusPage } from './pages/faculty/dept/DeptFacultyMaterialStatusPage';
import { DeptFacultyNotificationsPage } from './pages/faculty/dept/DeptFacultyNotificationsPage';
import { DeptFacultyLeavePage } from './pages/faculty/dept/DeptFacultyLeavePage';

// Mentor Sub-Module (Inside Faculty Module)
import { MentorDashboard } from './pages/faculty/mentor/MentorDashboard';
import { MentorStudentsPage } from './pages/faculty/mentor/MentorStudentsPage';
import { MentorStudentProfilePage } from './pages/faculty/mentor/MentorStudentProfilePage';
import { MentorLeaveRequestsPage } from './pages/faculty/mentor/MentorLeaveRequestsPage';
import { MentorExamRemindersPage } from './pages/faculty/mentor/MentorExamRemindersPage';
import { MentorNotificationsPage } from './pages/faculty/mentor/MentorNotificationsPage';

// Warden Sub-Module (Inside Faculty Module)
import { WardenDashboard } from './pages/faculty/warden/WardenDashboard';
import { WardenStudentsPage } from './pages/faculty/warden/WardenStudentsPage';
import { WardenLeavePage } from './pages/faculty/warden/WardenLeavePage';
import { WardenRoomsPage } from './pages/faculty/warden/WardenRoomsPage';
import { WardenNotificationsPage } from './pages/faculty/warden/WardenNotificationsPage';

// Admin Page
import { AdminDashboard } from './pages/admin/AdminDashboard';

import { UserRole } from './types';

// Root redirector based on authenticated user role
const RootRedirect: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-lavender-50 font-serif">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-lavender-700 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const roleRoutes: Record<UserRole, string> = {
    STUDENT: '/student',
    FACULTY: '/faculty',
    MENTOR: '/faculty',
    ADMIN: '/admin',
  };

  return <Navigate to={roleRoutes[user.role]} replace />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FacultyProvider>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<RootRedirect />} />

            {/* ── STUDENT ───────────────────────────────────────────────────── */}
            <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/student/profile" element={<StudentProfilePage />} />
                <Route path="/student/courses" element={<StudentCoursesPage />} />
                <Route path="/student/timetable" element={<StudentTimetablePage />} />
                <Route path="/student/attendance" element={<StudentAttendancePage />} />
                <Route path="/student/exams" element={<StudentExamsPage />} />
                <Route path="/student/materials" element={<StudentMaterialsPage />} />
                <Route path="/student/performance" element={<StudentPerformancePage />} />
                <Route path="/student/mentor" element={<StudentMentorPage />} />
                <Route path="/student/leave" element={<StudentLeavePage />} />
                <Route path="/student/fees" element={<StudentFeesPage />} />
                <Route path="/student/admission" element={<StudentAdmissionPage />} />
                <Route path="/student/hostel" element={<StudentHostelPage />} />
                <Route path="/student/notifications" element={<StudentNotificationsPage />} />
                <Route path="/student/settings" element={<StudentSettingsPage />} />
                <Route path="/student/ai-advisor" element={<StudentAIAdvisorPage />} />
                <Route path="/student/*" element={<StudentDashboard />} />
              </Route>
            </Route>

            {/* ── FACULTY (Includes HOD, Dept Faculty & Mentor Roles) ───────── */}
            <Route element={<ProtectedRoute allowedRoles={['FACULTY', 'MENTOR']} />}>
              <Route element={<DashboardLayout />}>
                {/* Main Unified Dashboard */}
                <Route path="/faculty" element={<FacultyDashboard />} />

                {/* HOD Sub-Routes */}
                <Route path="/faculty/hod" element={<HODDashboard />} />
                <Route path="/faculty/hod/faculty" element={<HODDepartmentFacultyPage />} />
                <Route path="/faculty/hod/verification" element={<HODMaterialVerificationPage />} />
                <Route path="/faculty/hod/approved" element={<HODApprovedMaterialsPage />} />
                <Route path="/faculty/hod/reports" element={<HODReportsPage />} />
                <Route path="/faculty/hod/leave" element={<HODApplyLeavePage />} />
                <Route path="/faculty/hod/notifications" element={<HODNotificationsPage />} />

                {/* Department Faculty Sub-Routes */}
                <Route path="/faculty/dept" element={<DeptFacultyDashboard />} />
                <Route path="/faculty/dept/subjects" element={<DeptFacultySubjectsPage />} />
                <Route path="/faculty/dept/submit" element={<DeptFacultySubmitMaterialPage />} />
                <Route path="/faculty/dept/status" element={<DeptFacultyMaterialStatusPage />} />
                <Route path="/faculty/dept/leave" element={<DeptFacultyLeavePage />} />
                <Route path="/faculty/dept/notifications" element={<DeptFacultyNotificationsPage />} />

                {/* Mentor Sub-Routes */}
                <Route path="/faculty/mentor" element={<MentorDashboard />} />
                <Route path="/faculty/mentor/students" element={<MentorStudentsPage />} />
                <Route path="/faculty/mentor/students/:id" element={<MentorStudentProfilePage />} />
                <Route path="/faculty/mentor/leave" element={<MentorLeaveRequestsPage />} />
                <Route path="/faculty/mentor/exams" element={<MentorExamRemindersPage />} />
                <Route path="/faculty/mentor/notifications" element={<MentorNotificationsPage />} />

                {/* Warden Sub-Routes */}
                <Route path="/faculty/warden" element={<WardenDashboard />} />
                <Route path="/faculty/warden/students" element={<WardenStudentsPage />} />
                <Route path="/faculty/warden/leave" element={<WardenLeavePage />} />
                <Route path="/faculty/warden/rooms" element={<WardenRoomsPage />} />
                <Route path="/faculty/warden/notifications" element={<WardenNotificationsPage />} />

                {/* Fallbacks */}
                <Route path="/faculty/profile" element={<FacultyDashboard />} />
                <Route path="/faculty/*" element={<FacultyDashboard />} />

                {/* Mentor Legacy Route Redirection */}
                <Route path="/mentor/*" element={<Navigate to="/faculty/mentor" replace />} />
              </Route>
            </Route>

            {/* ── ADMIN ─────────────────────────────────────────────────────── */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/*" element={<AdminDashboard />} />
              </Route>
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </FacultyProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
