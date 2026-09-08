import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import {
  GraduationCap,
  ShieldCheck,
  BriefcaseBusiness,
  Compass,
  ArrowRight,
  Lock,
  Mail,
  AlertCircle,
  Eye,
  EyeOff,
  BarChart3,
  Target,
  BrainCircuit,
  Building,
  CheckCircle2,
} from 'lucide-react';
import clsx from 'clsx';

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both institutional email and password.');
      return;
    }
    const res = await login(email, password, selectedRole);
    if (res.success && res.role) {
      const targetUrl = (res as any).redirectUrl || `/${res.role.toLowerCase()}`;
      navigate(targetUrl);
    } else {
      setErrorMessage(res.message || 'Invalid credentials or unauthorized role.');
    }
  };

  const features = [
    { icon: BarChart3, title: 'Performance Analysis', desc: 'Analyze your performance with AI-powered insights' },
    { icon: Target, title: 'Personalized Guidance', desc: 'Get personalized study plans and recommendations' },
    { icon: BrainCircuit, title: 'Smart Predictions', desc: 'Predict outcomes and identify areas of improvement' },
    { icon: Building, title: 'Academic Governance', desc: 'Unified college attendance, grading & timetable ERP' },
  ];

  const roleTabs: { role: UserRole; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { role: 'STUDENT', label: 'Student', icon: GraduationCap },
    { role: 'FACULTY', label: 'Faculty', icon: BriefcaseBusiness },
    { role: 'ADMIN', label: 'Admin', icon: ShieldCheck },
  ];

  const roleDisplayNames: Record<UserRole, string> = {
    STUDENT: 'Student',
    FACULTY: 'Faculty',
    MENTOR: 'Faculty',
    ADMIN: 'Admin',
  };

  const isBusy = isLoading;

  return (
    <div className="h-screen w-full overflow-hidden bg-lavender-50 font-serif flex items-center justify-center p-0 sm:p-4 lg:p-6 relative">
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-lavender-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-indigo-100/80 blur-3xl" />
      {/* Container holding the 2-column layout - scaled to fit viewport perfectly */}
      <div className="relative w-full max-w-6xl h-full sm:h-[min(760px,94vh)] bg-white sm:rounded-3xl border border-lavender-100 shadow-elevated flex overflow-hidden">
        
        {/* ===== LEFT PANEL — Lavender Gradient Hero Section ===== */}
        <div
          className="hidden lg:flex lg:w-[56%] flex-col justify-between p-8 xl:p-10 relative overflow-hidden text-slate-900"
          style={{
            background: 'linear-gradient(135deg, #f8f6ff 0%, #eef0ff 52%, #e9e6ff 100%)',
          }}
        >
          <div className="pointer-events-none absolute -left-24 -top-16 h-64 w-64 rounded-full bg-indigo-200/40 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-10 h-72 w-[32rem] rotate-6 rounded-[50%] bg-indigo-500/70 blur-sm" />
          {/* Top: Brand Header */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-900/20">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900">
                    EduSphere <span className="text-indigo-600">AI</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold tracking-wide mt-0.5">
                Intelligent Academic Decision Platform
              </p>
            </div>
          </div>

          {/* Middle: Headline, Description & 2x2 Features */}
          <div className="relative z-10 my-auto space-y-3.5 py-1">
            <div>
              <h1 className="text-3xl xl:text-5xl font-extrabold text-slate-900 leading-[1.05]">
                Smarter <span className="text-indigo-600">Academics</span>.<br />
                Better <span className="text-indigo-600">Decisions</span>.
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed mt-4 max-w-md">
                EduSphere AI analyzes your academic performance, understands your strengths, predicts early-warning trajectories, and unifies college management across students, faculty, mentors, and administrators.
              </p>
            </div>

            {/* 2x2 Feature Grid */}
            <div className="grid grid-cols-2 gap-2.5 max-w-md">
              {features.map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-white/75 backdrop-blur-sm border border-white shadow-sm"
                  >
                    <div className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 leading-snug">{feat.title}</h3>
                      <p className="text-[10px] text-slate-600 leading-tight mt-0.5">{feat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ===== RIGHT PANEL — Clean Lavender/White Sign In Form ===== */}
        <div className="w-full lg:w-[44%] flex flex-col justify-between p-6 sm:p-10 xl:p-12 bg-white overflow-hidden">
          <div>
            {/* Header: Sign In */}
            <div className="mb-4">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Sign In
              </h2>
              <div className="mt-3 h-0.5 w-full bg-slate-100 relative"><div className="h-0.5 w-36 bg-indigo-600" /></div>
            </div>

            {/* Sub-header */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900">Welcome to EduSphere AI</h3>
              <p className="text-sm text-slate-500 mt-1">Sign in to continue to your account</p>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-serif flex items-start gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-rose-600" />
                <span className="leading-tight">{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 mb-5">
              {roleTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = selectedRole === tab.role;
                return (
                  <button
                    key={tab.role}
                    type="button"
                    onClick={() => { setSelectedRole(tab.role); setErrorMessage(''); }}
                    className={clsx(
                      'relative flex min-h-[68px] flex-col items-center justify-center gap-1 rounded-lg border text-[11px] font-bold transition',
                      isActive ? 'border-indigo-400 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:text-indigo-600'
                    )}
                  >
                    {isActive && <CheckCircle2 className="absolute right-1 top-1 h-3.5 w-3.5 fill-indigo-600 text-white" />}
                    <Icon className={clsx('h-5 w-5', isActive ? 'text-indigo-600' : 'text-slate-400')} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleManualLogin} className="space-y-3">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Institutional Email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Mail className="h-3.5 w-3.5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your institutional email"
                    className="w-full pl-10 pr-3 py-3 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition font-serif"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Lock className="h-3.5 w-3.5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-9 py-3 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition font-serif"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
                  />
                  <span>Remember me</span>
                </label>
                <span className="text-xs text-indigo-600 font-semibold hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>

              {/* Primary Action Button */}
              <div className="pt-1.5 space-y-2">
                <button
                  type="submit"
                  disabled={isBusy}
                  className="w-full py-3.5 px-4 rounded-lg font-bold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2 transition duration-150 disabled:opacity-50 shadow-lg shadow-indigo-600/25"
                >
                  {isBusy ? (
                    <div className="flex items-center gap-2">
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <>
                      <span>Sign In as {roleDisplayNames[selectedRole]}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer Info */}
          <div className="pt-3 border-t border-slate-100 text-center text-[10px] text-slate-400 font-serif">
            EduSphere AI • Intelligent Academic Decision Platform
          </div>
        </div>
      </div>
    </div>
  );
};
