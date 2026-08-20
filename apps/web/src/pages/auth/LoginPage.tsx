import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, DEMO_CREDENTIALS } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import {
  GraduationCap,
  ShieldCheck,
  Briefcase,
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
  const { login, quickDemoLogin, isLoading } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [email, setEmail] = useState(DEMO_CREDENTIALS.STUDENT.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.STUDENT.password);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmittingDemo, setIsSubmittingDemo] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(DEMO_CREDENTIALS[role].email);
    setPassword(DEMO_CREDENTIALS[role].password);
    setErrorMessage('');
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both institutional email and password.');
      return;
    }
    const res = await login(email, password, selectedRole);
    if (res.success && res.role) {
      navigate(`/${res.role.toLowerCase()}`);
    } else {
      setErrorMessage(res.message || 'Authentication failed. Please verify your credentials.');
    }
  };

  const handleQuickDemo = async () => {
    setErrorMessage('');
    setIsSubmittingDemo(true);
    const res = await quickDemoLogin(selectedRole);
    setIsSubmittingDemo(false);
    if (res.success && res.role) {
      navigate(`/${res.role.toLowerCase()}`);
    } else {
      setErrorMessage(res.message || 'Demo authentication failed.');
    }
  };

  const roleTabs: { role: UserRole; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { role: 'STUDENT', label: 'Student', icon: GraduationCap },
    { role: 'FACULTY', label: 'Faculty', icon: Briefcase },
    { role: 'MENTOR', label: 'Mentor', icon: Compass },
    { role: 'ADMIN', label: 'Admin', icon: ShieldCheck },
  ];

  const features = [
    { icon: BarChart3, title: 'Performance Analysis', desc: 'Analyze your performance with AI-powered insights.' },
    { icon: Target, title: 'Personalized Guidance', desc: 'Get personalized study plans and recommendations.' },
    { icon: BrainCircuit, title: 'Smart Predictions', desc: 'Predict outcomes and identify areas of improvement.' },
    { icon: Building, title: 'Academic Governance', desc: 'Unified college attendance, grading & timetable ERP.' },
  ];

  const roleDisplayNames: Record<UserRole, string> = {
    STUDENT: 'Student',
    FACULTY: 'Faculty',
    MENTOR: 'Mentor',
    ADMIN: 'Admin',
  };

  const isBusy = isLoading || isSubmittingDemo;

  return (
    <div className="min-h-screen w-full font-serif flex overflow-hidden">
      {/* ===== LEFT PANEL — Purple gradient background ===== */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[58%] flex-col justify-between relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #e8e4ff 0%, #d5caff 20%, #a78bfa 55%, #7c3aed 100%)' }}
      >
        {/* Subtle ambient orbs */}
        <div className="absolute top-[-80px] left-[-80px] w-[320px] h-[320px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #c4b5fd, transparent)' }} />
        <div className="absolute bottom-[-60px] right-[-60px] w-[280px] h-[280px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />

        <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 mb-12">
            <div className="h-11 w-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shadow-md">
              {/* 3D-style cube logo matching reference */}
              <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none">
                <path d="M16 3L29 10.5V21.5L16 29L3 21.5V10.5L16 3Z" fill="white" fillOpacity="0.9" />
                <path d="M16 3L29 10.5L16 18L3 10.5L16 3Z" fill="white" fillOpacity="0.5" />
                <path d="M16 18V29L3 21.5V10.5L16 18Z" fill="white" fillOpacity="0.3" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight leading-none">
                EduSphere <span className="text-violet-200">AI</span>
              </h2>
              <p className="text-xs text-violet-200 font-medium mt-0.5">Intelligent Academic Decision Platform</p>
            </div>
          </div>

          {/* Main Headline */}
          <div className="mb-10">
            <h1 className="text-4xl xl:text-5xl font-extrabold leading-[1.15] tracking-tight text-slate-900">
              Smarter <span className="text-violet-700">Academics</span>.<br />
              Better <span className="text-violet-700">Decisions</span>.
            </h1>
            <p className="mt-4 text-sm xl:text-base text-slate-700 leading-relaxed max-w-md">
              EduSphere AI analyzes your academic performance, understands your strengths, predicts early-warning trajectories, and unifies college management across students, faculty, mentors, and administrators.
            </p>
          </div>

          {/* Feature Cards 2x2 */}
          <div className="grid grid-cols-2 gap-3 max-w-lg mb-10">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/70 shadow-sm">
                  <div className="h-9 w-9 rounded-xl bg-white/80 flex items-center justify-center text-violet-600 flex-shrink-0 shadow-sm">
                    <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 leading-snug">{feat.title}</h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-snug">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Illustration — laptop + mortar board on purple platform */}
          <div className="flex-1 flex items-end">
            <div className="relative w-full">
              {/* Purple ellipse platform */}
              <div className="absolute bottom-0 left-0 right-0 h-28 rounded-[50%] opacity-40"
                style={{ background: 'radial-gradient(ellipse, #6d28d9 0%, transparent 70%)' }} />

              <img
                src="/edusphere-illustration.jpg"
                alt="EduSphere AI Academic Dashboard"
                className="relative z-10 w-full max-w-lg mx-auto rounded-2xl shadow-2xl object-cover"
                style={{ maxHeight: '280px', objectPosition: 'center top' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== RIGHT PANEL — White login card ===== */}
      <div className="w-full lg:w-[45%] xl:w-[42%] flex items-center justify-center bg-white p-6 sm:p-10">
        <div className="w-full max-w-md">

          {/* "Sign In" Header matching reference — with underline */}
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign In
            </h2>
            <div className="mt-1.5 h-[3px] w-16 rounded-full bg-violet-600" />
          </div>

          {/* Card welcome text */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Welcome to EduSphere AI</h3>
            <p className="text-sm text-slate-500 mt-1">Sign in to continue to your account</p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-serif flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <div>
                <p className="font-bold">Authentication Notice</p>
                <p className="mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* 4 Role Tabs — matching reference: icon top, label below, active = purple bg + checkmark */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {roleTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedRole === tab.role;
              return (
                <button
                  key={tab.role}
                  type="button"
                  onClick={() => handleRoleChange(tab.role)}
                  className={clsx(
                    'relative flex flex-col items-center justify-center gap-1.5 py-3 px-1 rounded-2xl border text-xs font-bold transition-all duration-200',
                    isActive
                      ? 'bg-violet-50 border-violet-400 text-violet-700 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
                  )}
                >
                  {isActive && (
                    <CheckCircle2 className="absolute top-1.5 right-1.5 h-3.5 w-3.5 text-violet-600" />
                  )}
                  <Icon className={clsx('h-5 w-5', isActive ? 'text-violet-600' : 'text-slate-400')} />
                  <span className="leading-none">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">
                Institutional Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your institutional email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition font-serif"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition font-serif"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 accent-violet-600"
                />
                <span className="text-sm">Remember me</span>
              </label>
              <button type="button" className="text-sm text-violet-600 font-semibold hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Primary: Sign In as [Role] — Full purple button */}
            <button
              type="submit"
              disabled={isBusy}
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition duration-200 disabled:opacity-50 shadow-lg shadow-violet-500/25"
              style={{ background: isBusy ? '#7c3aed' : 'linear-gradient(135deg, #6d28d9, #7c3aed)' }}
            >
              {isBusy ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In as {roleDisplayNames[selectedRole]}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Continue with Google — white button with G icon */}
            <button
              type="button"
              disabled={isBusy}
              className="w-full py-3 rounded-2xl font-bold text-sm text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center gap-2.5 transition duration-200 shadow-sm disabled:opacity-50"
            >
              {/* Google G SVG */}
              <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          {/* Footer — matches reference bottom line */}
          <div className="mt-8 text-center text-xs text-slate-400">
            EduSphere AI &nbsp;·&nbsp; Intelligent Academic Decision Platform
          </div>
        </div>
      </div>
    </div>
  );
};
