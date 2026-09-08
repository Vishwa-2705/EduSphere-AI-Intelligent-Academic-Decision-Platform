import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getStudentRecord } from '../../data/studentData';
import { UserRole } from '../../types';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  CalendarCheck,
  Award,
  FileText,
  TrendingUp,
  UserCheck,
  FileSpreadsheet,
  CreditCard,
  Building,
  Building2,
  Home,
  Bell,
  User,
  Users,
  ShieldCheck,
  CheckSquare,
  AlertTriangle,
  HeartHandshake,
  Clock,
  Wifi,
  Zap,
  Droplets,
  BarChart3,
  Settings,
  ShieldAlert,
  GraduationCap,
  LogOut,
} from 'lucide-react';
import clsx from 'clsx';

import { useFaculty } from '../../contexts/FacultyContext';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const {
    activeSubRole,
    setActiveSubRole,
    allowedSubRoles,
    facultyDepartmentCode,
    facultyDepartmentName,
    isExclusiveHOD,
    isWarden,
    pendingDepartmentMaterials,
    myMenteeLeaveRequests,
    materials,
  } = useFaculty();

  const handleLogout = async () => {
    await logout();
    if (onClose) onClose();
  };
  if (!user) return null;
  const isDayScholar = user.role === 'STUDENT' && getStudentRecord(user.email).studentType === 'DAY_SCHOLAR';

  const pendingVerificationCount = pendingDepartmentMaterials.length;
  const pendingLeaveCount = myMenteeLeaveRequests.filter(l => l.status === 'Pending').length;
  const rejectedMaterialCount = materials.filter(m => m.facultyId.includes(user.email.split('@')[0]) && m.status === 'Rejected').length;

  const getNavLinks = (role: UserRole): NavItem[] => {
    switch (role) {
      case 'STUDENT':
        return [
          { name: 'Dashboard', href: '/student', icon: LayoutDashboard },
          { name: 'My Profile', href: '/student/profile', icon: User },
          { name: 'My Courses', href: '/student/courses', icon: BookOpen, badge: '6' },
          { name: 'Timetable', href: '/student/timetable', icon: Calendar },
          { name: 'Attendance', href: '/student/attendance', icon: CalendarCheck },
          { name: 'Examinations', href: '/student/exams', icon: Award },
          { name: 'Study Materials', href: '/student/materials', icon: FileText },
          { name: 'Academic Performance', href: '/student/performance', icon: TrendingUp },
          { name: 'Mentor', href: '/student/mentor', icon: UserCheck },
          { name: 'Leave Application', href: '/student/leave', icon: FileSpreadsheet },
          { name: 'Fees & Payments', href: '/student/fees', icon: CreditCard },
          { name: 'Admission Details', href: '/student/admission', icon: Building },
          ...(!isDayScholar ? [{ name: 'Hostel', href: '/student/hostel', icon: Home }] : []),
          { name: 'Notifications', href: '/student/notifications', icon: Bell },
          { name: 'Settings', href: '/student/settings', icon: Settings },
          { name: 'Logout', href: '/login', icon: LogOut },
        ];
      case 'FACULTY':
        // 1. Exclusive HOD Navigation
        if (isExclusiveHOD || activeSubRole === 'HOD') {
          return [
            { name: 'HOD Dashboard', href: '/faculty/hod', icon: LayoutDashboard },
            { name: 'Department Faculty', href: '/faculty/hod/faculty', icon: Users },
            { name: 'Material Verification', href: '/faculty/hod/verification', icon: CheckSquare, badge: pendingVerificationCount > 0 ? `${pendingVerificationCount} New` : undefined },
            { name: 'Approved Materials', href: '/faculty/hod/approved', icon: FileText },
            { name: 'Department Reports', href: '/faculty/hod/reports', icon: BarChart3 },
            { name: 'Apply Leave', href: '/faculty/hod/leave', icon: FileSpreadsheet },
            { name: 'Notifications', href: '/faculty/hod/notifications', icon: Bell },
            { name: 'Profile', href: '/faculty/profile', icon: User },
          ];
        }

        // 2. Exclusive Warden Navigation
        if (isWarden || activeSubRole === 'WARDEN') {
          return [
            { name: 'Warden Dashboard', href: '/faculty/warden', icon: LayoutDashboard },
            { name: 'Hostel Residents', href: '/faculty/warden/students', icon: Users },
            { name: 'Outing & Leaves', href: '/faculty/warden/leave', icon: FileSpreadsheet },
            { name: 'Hostel Blocks', href: '/faculty/warden/rooms', icon: Building2 },
            { name: 'Warden Alerts', href: '/faculty/warden/notifications', icon: Bell },
            { name: 'Profile', href: '/faculty/profile', icon: User },
          ];
        }

        // 3. Mentor Mode (under Faculty login)
        if (activeSubRole === 'MENTOR') {
          return [
            { name: 'Mentor Dashboard', href: '/faculty/mentor', icon: LayoutDashboard },
            { name: 'My Mentees', href: '/faculty/mentor/students', icon: Users },
            { name: 'Leave Requests', href: '/faculty/mentor/leave', icon: FileSpreadsheet, badge: pendingLeaveCount > 0 ? `${pendingLeaveCount} Due` : undefined },
            { name: 'Attendance & Risk', href: '/faculty/mentor/students', icon: CalendarCheck },
            { name: 'Academic Performance', href: '/faculty/mentor/students', icon: TrendingUp },
            { name: 'Exam Reminders', href: '/faculty/mentor/exams', icon: Award },
            { name: 'Notifications', href: '/faculty/mentor/notifications', icon: Bell },
            { name: 'Profile', href: '/faculty/profile', icon: User },
          ];
        }

        // 4. Department Faculty Mode
        return [
          { name: 'Faculty Dashboard', href: '/faculty/dashboard', icon: LayoutDashboard },
          { name: 'My Assigned Subjects', href: '/faculty/dept/subjects', icon: BookOpen },
          { name: 'Submit Study Material', href: '/faculty/dept/submit', icon: FileSpreadsheet },
          { name: 'Material Status', href: '/faculty/dept/status', icon: Clock, badge: rejectedMaterialCount > 0 ? `${rejectedMaterialCount} Alert` : undefined },
          { name: 'Apply Leave', href: '/faculty/dept/leave', icon: FileText },
          { name: 'Faculty Notifications', href: '/faculty/dept/notifications', icon: Bell },
          { name: 'Profile', href: '/faculty/profile', icon: User },
        ];
      case 'MENTOR':
        return [
          { name: 'Mentor Dashboard', href: '/faculty/mentor', icon: LayoutDashboard },
          { name: 'My Mentees', href: '/faculty/mentor/students', icon: Users },
          { name: 'Leave Requests', href: '/faculty/mentor/leave', icon: FileSpreadsheet, badge: pendingLeaveCount > 0 ? `${pendingLeaveCount} Due` : undefined },
          { name: 'Attendance & Risk', href: '/faculty/mentor/students', icon: CalendarCheck },
          { name: 'Academic Performance', href: '/faculty/mentor/students', icon: TrendingUp },
          { name: 'Exam Reminders', href: '/faculty/mentor/exams', icon: Award },
          { name: 'Notifications', href: '/faculty/mentor/notifications', icon: Bell },
          { name: 'Profile', href: '/faculty/profile', icon: User },
        ];
      case 'ADMIN':
        return [
          { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
          { name: 'Student Management', href: '/admin/students', icon: Users },
          { name: 'Faculty Management', href: '/admin/faculty', icon: UserCheck },
          { name: 'Mentor Management', href: '/admin/mentors', icon: HeartHandshake },
          { name: 'Departments', href: '/admin/departments', icon: Building },
          { name: 'Admissions', href: '/admin/admissions', icon: FileSpreadsheet },
          { name: 'Fees & Payments', href: '/admin/fees', icon: CreditCard },
          { name: 'Hostel Management', href: '/admin/hostel', icon: Home },
          { name: 'Timetable Management', href: '/admin/timetable', icon: Calendar },
          { name: 'Examination Management', href: '/admin/exams', icon: Award },
          { name: 'Attendance Management', href: '/admin/attendance', icon: CalendarCheck },
          { name: 'Study Materials', href: '/admin/materials', icon: FileText },
          { name: 'Infrastructure', href: '/admin/infrastructure', icon: Building },
          { name: 'Wi-Fi / Network', href: '/admin/network', icon: Wifi },
          { name: 'Electricity', href: '/admin/power', icon: Zap },
          { name: 'Water Management', href: '/admin/water', icon: Droplets },
          { name: 'Reports & Analytics', href: '/admin/analytics', icon: BarChart3 },
          { name: 'System Settings', href: '/admin/settings', icon: Settings },
          { name: 'Audit Logs', href: '/admin/logs', icon: ShieldAlert },
        ];
    }
  };

  const navLinks = getNavLinks(user.role);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-lavender-200/80 bg-white transition-transform duration-200 lg:static lg:translate-x-0 font-serif shadow-sm',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-3 border-b border-lavender-100 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lavender-700 shadow-md text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900 font-serif leading-none">
              EduSphere <span className="text-lavender-700">AI</span>
            </h1>
            <p className="text-[11px] font-semibold text-slate-400 font-serif tracking-wider uppercase mt-1">
              Decision Platform
            </p>
          </div>
        </div>

        {/* Role Pill & Sub-Role Switcher */}
        <div className="px-4 pt-3 pb-1 space-y-2">
          <div className="flex items-center justify-between rounded-xl bg-lavender-50/70 border border-lavender-200/70 px-3 py-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-serif">
              Department
            </span>
            <span className="rounded-md bg-lavender-200 text-lavender-900 border border-lavender-300 px-2 py-0.5 text-[11px] font-extrabold font-serif">
              {facultyDepartmentCode}
            </span>
          </div>

          {/* Role Display / Toggle (Only enabled for multi-role faculty like Faculty+Mentor) */}
          {user.role === 'FACULTY' && (
            <div className="rounded-xl bg-slate-50/90 border border-lavender-200/80 p-2 shadow-xs">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pb-1 flex items-center justify-between">
                <span>Active Role</span>
                <span className="text-violet-700 font-extrabold">
                  {isExclusiveHOD ? 'HOD' : isWarden ? 'Warden' : activeSubRole === 'MENTOR' ? 'Mentor' : 'Faculty'}
                </span>
              </div>

              {/* Show role pills ONLY if faculty member has multiple allowed roles (Faculty + Mentor) */}
              {!isExclusiveHOD && !isWarden && allowedSubRoles.length > 1 && (
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {allowedSubRoles.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setActiveSubRole(sub)}
                      className={clsx(
                        'py-1.5 px-2 rounded-lg text-xs font-bold transition text-center',
                        activeSubRole === sub
                          ? 'bg-violet-700 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-lavender-100 hover:text-slate-900'
                      )}
                    >
                      {sub === 'FACULTY' ? 'Faculty Mode' : 'Mentor Mode'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation List */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-2.5">
          {navLinks.map((item) => {
            const Icon = item.icon;
            if (item.name === 'Logout') {
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={handleLogout}
                  className="group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-600 transition-all duration-150 font-serif hover:bg-rose-50 hover:text-rose-700"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4.5 w-4.5 text-slate-400 group-hover:text-rose-600" />
                    <span>{item.name}</span>
                  </div>
                </button>
              );
            }

            return (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href.split('/').length <= 2}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx(
                    'group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold transition-all duration-150 font-serif',
                    isActive
                      ? 'bg-lavender-100/90 text-lavender-950 font-extrabold shadow-sm border-l-4 border-lavender-700'
                      : 'text-slate-600 hover:bg-lavender-50 hover:text-slate-900'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={clsx(
                          'h-4.5 w-4.5 transition-colors',
                          isActive ? 'text-lavender-700' : 'text-slate-400 group-hover:text-slate-600'
                        )}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={clsx(
                          'rounded-full px-2.5 py-0.5 text-xs font-bold',
                          isActive
                            ? 'bg-lavender-700 text-white'
                            : 'bg-lavender-100 text-lavender-800'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-lavender-100 p-4">
          <div className="rounded-xl bg-lavender-50/60 border border-lavender-200/60 p-3 text-xs text-slate-500 font-serif">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <ShieldCheck className="h-4 w-4 text-lavender-700" />
              <span>EduSphere AI ERP v1.0</span>
            </div>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Academic Decision Platform
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
