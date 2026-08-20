import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
} from 'lucide-react';
import clsx from 'clsx';

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
  const { user } = useAuth();
  if (!user) return null;

  const getNavLinks = (role: UserRole): NavItem[] => {
    switch (role) {
      case 'STUDENT':
        return [
          { name: 'Dashboard', href: '/student', icon: LayoutDashboard },
          { name: 'My Courses', href: '/student/courses', icon: BookOpen, badge: '3' },
          { name: 'Timetable', href: '/student/timetable', icon: Calendar },
          { name: 'Attendance', href: '/student/attendance', icon: CalendarCheck },
          { name: 'Examinations', href: '/student/exams', icon: Award },
          { name: 'Study Materials', href: '/student/materials', icon: FileText },
          { name: 'Academic Performance', href: '/student/performance', icon: TrendingUp },
          { name: 'Mentor', href: '/student/mentor', icon: UserCheck },
          { name: 'Leave Application', href: '/student/leave', icon: FileSpreadsheet },
          { name: 'Fees & Payments', href: '/student/fees', icon: CreditCard },
          { name: 'Admission Details', href: '/student/admission', icon: Building },
          { name: 'Hostel', href: '/student/hostel', icon: Home },
          { name: 'Notifications', href: '/student/notifications', icon: Bell },
          { name: 'Profile', href: '/student/profile', icon: User },
        ];
      case 'FACULTY':
        return [
          { name: 'Dashboard', href: '/faculty', icon: LayoutDashboard },
          { name: 'My Courses', href: '/faculty/courses', icon: BookOpen, badge: '3' },
          { name: 'Class Schedule', href: '/faculty/schedule', icon: Calendar },
          { name: 'Student Attendance', href: '/faculty/attendance', icon: CalendarCheck },
          { name: 'Marks & Grades', href: '/faculty/grading', icon: Award, badge: '2 Due' },
          { name: 'Study Materials', href: '/faculty/materials', icon: FileText },
          { name: 'Examinations', href: '/faculty/exams', icon: CheckSquare },
          { name: 'Timetable', href: '/faculty/timetable', icon: Clock },
          { name: 'Leave', href: '/faculty/leave', icon: FileSpreadsheet },
          { name: 'Student Performance', href: '/faculty/performance', icon: TrendingUp },
          { name: 'Notifications', href: '/faculty/notifications', icon: Bell },
          { name: 'Profile', href: '/faculty/profile', icon: User },
        ];
      case 'MENTOR':
        return [
          { name: 'Dashboard', href: '/mentor', icon: LayoutDashboard },
          { name: 'My Mentees', href: '/mentor/mentees', icon: Users, badge: '3 Active' },
          { name: 'Attendance', href: '/mentor/attendance', icon: CalendarCheck },
          { name: 'Academic Performance', href: '/mentor/performance', icon: TrendingUp },
          { name: 'Risk Analysis', href: '/mentor/risk-analytics', icon: AlertTriangle },
          { name: 'Counseling', href: '/mentor/counseling', icon: HeartHandshake },
          { name: 'Intervention History', href: '/mentor/interventions', icon: FileText },
          { name: 'Examination Schedule', href: '/mentor/exams', icon: Award },
          { name: 'Fee Status', href: '/mentor/fees', icon: CreditCard },
          { name: 'Notifications', href: '/mentor/notifications', icon: Bell },
          { name: 'Profile', href: '/mentor/profile', icon: User },
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
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200/80 bg-white transition-transform duration-200 lg:static lg:translate-x-0 font-serif',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header matching login page */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-md shadow-indigo-200 text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-slate-900 font-serif leading-none">
              EduSphere <span className="text-indigo-600">AI</span>
            </h1>
            <p className="text-[10px] font-semibold text-slate-400 font-serif tracking-wider uppercase mt-0.5">
              Decision Platform
            </p>
          </div>
        </div>

        {/* Role Pill */}
        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 px-3 py-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-serif">
              Portal Mode
            </span>
            <span className="rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 text-[10px] font-extrabold uppercase font-serif">
              {user.role}
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href.split('/').length <= 2}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx(
                    'group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-150 font-serif',
                    isActive
                      ? 'bg-indigo-50/90 text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={clsx(
                          'h-4 w-4 transition-colors',
                          isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                        )}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={clsx(
                          'rounded-full px-2 py-0.5 text-[10px] font-bold',
                          isActive
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600'
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
        <div className="border-t border-slate-100 p-4">
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-[11px] text-slate-500 font-serif">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
              <span>EduSphere AI ERP v1.0</span>
            </div>
            <p className="mt-0.5 text-[10px] text-slate-400">
              Times New Roman Theme Active
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
