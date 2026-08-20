import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import {
  Bell,
  LogOut,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Briefcase,
  Compass,
  GraduationCap,
  CheckCircle2,
  Search,
} from 'lucide-react';
import clsx from 'clsx';

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
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: ShieldCheck,
  },
  FACULTY: {
    label: 'Faculty Member',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: Briefcase,
  },
  MENTOR: {
    label: 'Academic Mentor',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    icon: Compass,
  },
  STUDENT: {
    label: 'Student',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    icon: GraduationCap,
  },
};

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, profile, logout, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  if (!user) return null;

  const currentBadge = roleBadgeConfig[user.role];
  const RoleIcon = currentBadge.icon;

  const handleRoleSwitch = async (targetRole: UserRole) => {
    if (targetRole === user.role) {
      setShowRoleMenu(false);
      return;
    }
    setIsSwitching(true);
    const res = await quickDemoLogin(targetRole);
    setIsSwitching(false);
    setShowRoleMenu(false);
    if (res.success && res.role) {
      navigate(`/${res.role.toLowerCase()}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Get current portal title
  const getPortalTitle = () => {
    switch (user.role) {
      case 'STUDENT':
        return 'Student Academic Portal';
      case 'FACULTY':
        return 'Faculty Instruction & Evaluation Console';
      case 'MENTOR':
        return 'Mentorship & Academic Decision Hub';
      case 'ADMIN':
        return 'Campus Governance & Master Admin';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 backdrop-blur-md font-serif shadow-subtle">
      {/* Left side: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="rounded-xl p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold text-slate-900 font-serif">{getPortalTitle()}</span>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <span className="text-xs text-indigo-600 font-medium hidden sm:inline capitalize">
            {location.pathname.replace('/', '') || 'Overview'}
          </span>
        </div>
      </div>

      {/* Right side: Search, Demo Switcher, Role Badge, Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Demo Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-100 font-serif"
            title="Switch roles instantly for evaluation"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Role Switcher</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 font-serif">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Switch Active Portal</p>
                <p className="text-[11px] text-slate-500">1-click demo role transition</p>
              </div>

              {(['STUDENT', 'FACULTY', 'MENTOR', 'ADMIN'] as UserRole[]).map((r) => {
                const config = roleBadgeConfig[r];
                const Icon = config.icon;
                const isCurrent = user.role === r;

                return (
                  <button
                    key={r}
                    disabled={isSwitching}
                    onClick={() => handleRoleSwitch(r)}
                    className={clsx(
                      'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium transition font-serif',
                      isCurrent
                        ? 'bg-indigo-50 text-indigo-900 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={clsx('flex h-7 w-7 items-center justify-center rounded-lg border', config.bg, config.text, config.border)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span>{config.label}</span>
                    </div>
                    {isCurrent && <CheckCircle2 className="h-4 w-4 text-indigo-600" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Current Active Role Badge */}
        <div
          className={clsx(
            'hidden sm:flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold font-serif',
            currentBadge.bg,
            currentBadge.text,
            currentBadge.border
          )}
        >
          <RoleIcon className="h-3.5 w-3.5" />
          <span>{currentBadge.label}</span>
        </div>

        {/* Notifications Icon */}
        <button className="relative rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-600"></span>
        </button>

        <div className="h-5 w-px bg-slate-200" />

        {/* User profile dropdown & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-sm">
              {profile?.firstName ? profile.firstName.charAt(0) : user.email.charAt(0).toUpperCase()}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-xs font-bold text-slate-900 leading-tight font-serif">
                {profile?.fullName || user.email.split('@')[0]}
              </p>
              <p className="text-[11px] text-slate-500 font-serif">
                {profile?.registrationNo || user.role}
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
