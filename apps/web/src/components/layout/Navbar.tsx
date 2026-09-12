import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import {
  Bell,
  LogOut,
  ShieldCheck,
  Briefcase,
  Compass,
  GraduationCap,
} from 'lucide-react';
import clsx from 'clsx';
import { getDefaultStudentNotifications, getStudentStorageKey, normalizeStudentNotifications, StudentNotification } from '../../data/studentData';

import { useFaculty } from '../../contexts/FacultyContext';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

const roleBadgeConfig: Record<
  UserRole,
  { label: string; bg: string; text: string; border: string; icon: React.ComponentType<{ className?: string }> }
> = {
  ADMIN: {
    label: 'Campus Admin',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    icon: ShieldCheck,
  },
  FACULTY: {
    label: 'Faculty Member',
    bg: 'bg-violet-50',
    text: 'text-violet-800',
    border: 'border-violet-200',
    icon: Briefcase,
  },
  MENTOR: {
    label: 'Academic Mentor',
    bg: 'bg-lavender-100',
    text: 'text-lavender-800',
    border: 'border-lavender-300',
    icon: Compass,
  },
  STUDENT: {
    label: 'Student',
    bg: 'bg-lavender-100',
    text: 'text-lavender-800',
    border: 'border-lavender-300',
    icon: GraduationCap,
  },
};

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, profile, logout } = useAuth();
  const { activeSubRole, facultyDepartmentName, isExclusiveHOD, isWarden } = useFaculty();
  const navigate = useNavigate();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const currentBadge = user ? roleBadgeConfig[user.role] : roleBadgeConfig.STUDENT;
  const RoleIcon = currentBadge.icon;

  const storageKey = getStudentStorageKey(user?.email, 'notifications');
  const savedNotifs = user?.email ? localStorage.getItem(storageKey) : null;
  const notificationsList: StudentNotification[] = savedNotifs
    ? normalizeStudentNotifications(JSON.parse(savedNotifs), user?.email)
    : getDefaultStudentNotifications(user?.email);
  const unreadNotifications = notificationsList.filter(n => n.unread);

  const getPortalTitle = () => {
    if (!user) return 'EduSphere AI';
    switch (user.role) {
      case 'STUDENT':
        return 'Student Portal';
      case 'FACULTY':
        if (isExclusiveHOD || activeSubRole === 'HOD') return 'HOD Academic Governance Console';
        if (isWarden || activeSubRole === 'WARDEN') return 'Campus Hostel & Residential Console';
        if (activeSubRole === 'MENTOR') return 'Faculty Mentorship & Advisory Hub';
        return 'Faculty Instruction & Evaluation Console';
      case 'MENTOR':
        return 'Mentorship & Academic Decision Hub';
      case 'ADMIN':
        return 'Campus Governance & Master Admin';
      default:
        return 'EduSphere AI';
    }
  };

  const getFacultySubRoleLabel = () => {
    if (isExclusiveHOD || activeSubRole === 'HOD') return 'Role: HOD';
    if (isWarden || activeSubRole === 'WARDEN') return 'Role: Warden';
    if (activeSubRole === 'MENTOR') return 'Role: Mentor';
    if (profile?.isMentor) return 'Role: Faculty • Mentor';
    return 'Role: Department Faculty';
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-lavender-200/80 bg-white/95 px-4 sm:px-6 lg:px-8 backdrop-blur-md font-serif shadow-subtle">
      {/* Left side: Mobile Toggle & Breadcrumbs / Title */}
      <div className="flex items-center gap-4 py-2">
        <button
          onClick={onToggleSidebar}
          className="rounded-xl p-2 text-slate-500 hover:bg-lavender-50 lg:hidden"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2.5 text-sm sm:text-base">
          <span className="font-bold text-slate-900 font-serif">{getPortalTitle()}</span>
          {user?.role === 'FACULTY' && (
            <span className="hidden md:inline-flex text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {facultyDepartmentName}
            </span>
          )}
        </div>
      </div>

      {/* Right side: Role Badge, Notifications & Profile */}
      <div className="flex items-center gap-3 sm:gap-4 py-2">
        {/* Role Badge */}
        {user?.role === 'FACULTY' ? (
          <div
            className={clsx(
              'hidden sm:flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold font-serif',
              (isExclusiveHOD || activeSubRole === 'HOD') ? 'bg-violet-50 text-violet-800 border-violet-200' :
              (isWarden || activeSubRole === 'WARDEN') ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
              activeSubRole === 'MENTOR' ? 'bg-indigo-50 text-indigo-800 border-indigo-200' :
              'bg-blue-50 text-blue-800 border-blue-200'
            )}
          >
            <RoleIcon className="h-3.5 w-3.5" />
            <span>{getFacultySubRoleLabel()}</span>
          </div>
        ) : (
          <div
            className={clsx(
              'hidden sm:flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-bold font-serif',
              currentBadge.bg,
              currentBadge.text,
              currentBadge.border
            )}
          >
            <RoleIcon className="h-3.5 w-3.5" />
            <span>{currentBadge.label}</span>
          </div>
        )}

        {/* Notifications Icon */}
        <div ref={notificationRef} className="relative">
          <button type="button" aria-label="Open notifications" onClick={() => setNotificationOpen((open) => !open)} className="relative rounded-full p-2 text-slate-400 hover:bg-lavender-50 hover:text-slate-600 transition">
            <Bell className="h-4 w-4" />
            {unreadNotifications.length > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-lavender-600"></span>}
          </button>
          {notificationOpen && (
            <div className="absolute right-0 top-11 z-50 w-80 rounded-2xl border border-lavender-200 bg-white p-3 shadow-elevated">
              <div className="flex items-center justify-between border-b border-lavender-100 px-2 pb-2">
                <h3 className="text-sm font-bold text-slate-900">New notifications</h3>
                <span className="badge-lavender">{unreadNotifications.length}</span>
              </div>
              {unreadNotifications.length === 0 ? (
                <p className="px-2 py-5 text-center text-xs text-slate-500">There is no new notification</p>
              ) : (
                <div className="max-h-72 divide-y divide-lavender-100 overflow-y-auto">
                  {unreadNotifications.slice(0, 5).map((note) => (
                    <button key={note.title} type="button" onClick={() => navigate(user?.role === 'STUDENT' ? '/student/notifications' : '/faculty/dept/notifications')} className="block w-full px-2 py-3 text-left hover:bg-lavender-50">
                      <p className="text-xs font-bold text-slate-900">{note.title}</p>
                      <p className="mt-1 text-[11px] text-slate-500">{note.time}</p>
                    </button>
                  ))}
                </div>
              )}
              <button type="button" onClick={() => navigate(user?.role === 'STUDENT' ? '/student/notifications' : '/faculty/dept/notifications')} className="mt-2 w-full rounded-lg bg-lavender-50 px-3 py-2 text-xs font-bold text-lavender-800">View all notifications</button>
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-lavender-200" />

        {/* User profile dropdown & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-lavender-700 text-white font-bold text-xs shadow-sm">
              {profile?.firstName ? profile.firstName.charAt(0) : (user?.email ? user.email.charAt(0).toUpperCase() : 'U')}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-xs font-bold text-slate-900 leading-tight font-serif">
                {profile?.fullName || profile?.firstName ? `${profile?.firstName} ${profile?.lastName}` : user?.email?.split('@')[0]}
              </p>
              <p className="text-[11px] text-slate-500 font-serif">
                {profile?.registrationNo || user?.role}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
