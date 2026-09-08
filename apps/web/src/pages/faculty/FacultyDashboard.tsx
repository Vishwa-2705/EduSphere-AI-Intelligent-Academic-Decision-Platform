import React from 'react';
import { useFaculty } from '../../contexts/FacultyContext';
import { useAuth } from '../../contexts/AuthContext';
import { FacultySubRole } from '../../data/facultyData';
import { HODDashboard } from './hod/HODDashboard';
import { DeptFacultyDashboard } from './dept/DeptFacultyDashboard';
import { MentorDashboard } from './mentor/MentorDashboard';
import { WardenDashboard } from './warden/WardenDashboard';
import { BookOpen, Compass, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { Navigate } from 'react-router-dom';

export const FacultyDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const {
    activeSubRole,
    setActiveSubRole,
    allowedSubRoles,
    facultyDepartmentName,
    isExclusiveHOD,
    isWarden,
  } = useFaculty();

  // If exclusive HOD, redirect to dedicated HOD route
  if (isExclusiveHOD) {
    return <Navigate to="/faculty/hod" replace />;
  }

  // If exclusive Warden, redirect to dedicated Warden route
  if (isWarden) {
    return <Navigate to="/faculty/warden" replace />;
  }

  const facultyDisplayName = profile?.firstName
    ? `${profile.firstName} ${profile.lastName}`
    : user?.email || 'Faculty Member';

  interface SubRoleTab {
    id: FacultySubRole;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }

  const allTabs: SubRoleTab[] = [
    {
      id: 'FACULTY',
      label: 'Department Faculty',
      description: 'Course preparation, syllabus progression & study material submission to HOD',
      icon: BookOpen,
    },
    {
      id: 'MENTOR',
      label: 'Mentor Advisory Desk',
      description: 'Assigned student monitoring, leave approvals, attendance & exam reminders',
      icon: Compass,
    },
  ];

  const subRoleTabs = allTabs.filter(tab => allowedSubRoles.includes(tab.id));

  return (
    <div className="space-y-6 font-serif">
      {/* Universal Top Role Selector Bar - Shown only if faculty has multiple responsibilities (Faculty + Mentor) */}
      {subRoleTabs.length > 1 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  Faculty Multi-Responsibility Console
                </h2>
                <p className="text-[11px] text-slate-400">
                  Logged in as: <strong className="text-slate-700">{facultyDisplayName}</strong> ({facultyDepartmentName})
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <span>Active Responsibility:</span>
              <span className="font-extrabold text-violet-700 px-2.5 py-0.5 rounded-full bg-violet-50 border border-violet-200">
                {activeSubRole === 'FACULTY' ? 'Department Faculty' : 'Mentor Advisory Desk'}
              </span>
            </div>
          </div>

          {/* Role Switcher Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {subRoleTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubRole === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSubRole(tab.id)}
                  className={clsx(
                    'p-3 rounded-xl border text-left transition flex items-start gap-3',
                    isActive
                      ? 'bg-violet-50/70 border-violet-400/80 shadow-xs ring-1 ring-violet-400/30'
                      : 'bg-white border-slate-200 hover:border-violet-200 hover:bg-slate-50/60'
                  )}
                >
                  <div
                    className={clsx(
                      'h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 transition',
                      isActive ? 'bg-violet-700 text-white shadow-xs' : 'bg-slate-100 text-slate-500'
                    )}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={clsx('text-xs font-bold leading-tight', isActive ? 'text-violet-950' : 'text-slate-700')}>
                        {tab.label}
                      </span>
                      {isActive && (
                        <span className="h-2 w-2 rounded-full bg-violet-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                      {tab.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Render Active Sub-Role Dashboard Component */}
      {activeSubRole === 'FACULTY' && <DeptFacultyDashboard />}
      {activeSubRole === 'MENTOR' && <MentorDashboard />}
      {activeSubRole === 'WARDEN' && <WardenDashboard />}
      {activeSubRole === 'HOD' && <HODDashboard />}
    </div>
  );
};

