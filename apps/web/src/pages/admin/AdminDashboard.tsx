import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { MetricCard } from '../../components/common/MetricCard';
import {
  Users,
  Building2,
  CalendarCheck,
  Activity,
  Sparkles,
  Server,
  ShieldCheck,
  CreditCard,
  Home,
  GraduationCap,
  BookOpen,
  Wifi,
  Zap,
  Droplets,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import clsx from 'clsx';

export const AdminDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get('/dashboard/admin');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err: any) {
        console.error('Error loading admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center font-serif">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm font-bold text-slate-700">Loading Campus Governance Console...</p>
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalStudents: 1240,
    totalFaculty: 86,
    totalMentors: 34,
    totalDepartments: 6,
    totalActiveCourses: 42,
    campusAverageAttendance: 86.4,
    atRiskStudentsCampusWide: 18,
    systemUptime: '99.98%',
  };

  const departments = data?.departmentBreakdown || [
    { code: 'CSE', name: 'Department of Computer Science & Engineering', established: 2008, students: 420, faculty: 28, status: 'Active' },
    { code: 'ECE', name: 'Department of Electronics & Communication Engineering', established: 2010, students: 380, faculty: 24, status: 'Active' },
    { code: 'AI_DS', name: 'Department of Artificial Intelligence & Data Science', established: 2021, students: 160, faculty: 14, status: 'Active' },
    { code: 'MECH', name: 'Department of Mechanical Engineering', established: 2006, students: 280, faculty: 20, status: 'Active' },
  ];

  const alerts = data?.recentSystemAlerts || [];

  const auditLogs = [
    { action: 'Student Login: student@edusphere.ai', time: 'Just now', type: 'AUTH', status: 'success' },
    { action: 'Faculty Login: faculty@edusphere.ai', time: '2 min ago', type: 'AUTH', status: 'success' },
    { action: 'Mentor Login: mentor@edusphere.ai', time: '5 min ago', type: 'AUTH', status: 'success' },
    { action: 'Admin Login: admin@edusphere.ai', time: '10 min ago', type: 'AUTH', status: 'success' },
    { action: 'DB Seed: 4 demo users initialized', time: '15 min ago', type: 'SYSTEM', status: 'info' },
  ];

  const infraStatus = [
    { label: 'Wi-Fi / Network Coverage', icon: Wifi, value: '98.2%', status: 'Operational', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { label: 'Electrical Grid Load', icon: Zap, value: '73% Load', status: 'Normal', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    { label: 'Water Management', icon: Droplets, value: '100%', status: 'All Blocks', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  ];

  return (
    <div className="space-y-6 font-serif">
      {/* Welcome Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-xs font-bold text-amber-700 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Campus Governance & Institutional Administration • Session 2025–2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome, {profile?.fullName || 'Dr. Suresh Nambiar'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Designation: <strong className="text-slate-800">{profile?.designation || 'Dean of Academic Affairs & Chief Administrator'}</strong> • Institutional Master Control • Central Administration Block
            </p>
          </div>
          <button className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm shadow-indigo-200/50 transition flex items-center gap-2 flex-shrink-0">
            <UserCheck className="h-4 w-4" />
            <span>Provision New User</span>
          </button>
        </div>

        {/* Quick Info Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <GraduationCap className="h-4 w-4 text-indigo-500" />
            <span><strong>Degree Programs:</strong> B.Tech, M.Tech, Ph.D.</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <CalendarCheck className="h-4 w-4 text-emerald-500" />
            <span><strong>Campus Avg Attendance:</strong> <span className="font-mono font-bold text-emerald-600">{metrics.campusAverageAttendance}%</span></span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="h-4 w-4 text-indigo-500" />
            <span><strong>Security:</strong> RBAC & JWT Session Active</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Enrolled Students"
          value={metrics.totalStudents.toLocaleString()}
          subtext="Undergraduate & Postgraduate"
          icon={Users}
          variant="indigo"
          trend={{ value: 'Full Capacity', isPositive: true }}
        />
        <MetricCard
          title="Faculty & Mentors"
          value={metrics.totalFaculty + metrics.totalMentors}
          subtext={`${metrics.totalFaculty} Faculty · ${metrics.totalMentors} Mentors`}
          icon={Building2}
          variant="emerald"
        />
        <MetricCard
          title="Campus Avg Attendance"
          value={`${metrics.campusAverageAttendance}%`}
          subtext="Statutory threshold: 75%"
          icon={CalendarCheck}
          variant="amber"
          trend={{ value: 'Healthy Baseline', isPositive: true }}
        />
        <MetricCard
          title="Platform Uptime"
          value={metrics.systemUptime}
          subtext="MongoDB & Express services"
          icon={Server}
          variant="slate"
          trend={{ value: 'Phase 1 Verified', isNeutral: true }}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Department Matrix & Infrastructure */}
        <div className="space-y-6 lg:col-span-8">
          {/* Departments Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Academic Departments & Degree Units</h3>
                <p className="text-xs text-slate-500">Institutional divisions, student counts, and academic councils</p>
              </div>
              <span className="badge-indigo">{departments.length} Departments</span>
            </div>

            <div className="overflow-x-auto">
              <table className="edusphere-table">
                <thead>
                  <tr>
                    <th>Dept. Code</th>
                    <th>Department Name</th>
                    <th>Est. Year</th>
                    <th>Students</th>
                    <th>Faculty</th>
                    <th>Status</th>
                    <th className="text-right">Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((d: any) => (
                    <tr key={d.code}>
                      <td>
                        <span className="font-mono font-bold text-indigo-600">[{d.code}]</span>
                      </td>
                      <td className="font-bold text-slate-900">{d.name}</td>
                      <td className="font-mono text-slate-500">{d.established}</td>
                      <td className="font-mono font-bold text-slate-700">{d.students?.toLocaleString() || '—'}</td>
                      <td className="font-mono font-bold text-slate-700">{d.faculty || '—'}</td>
                      <td><span className="badge-emerald">{d.status}</span></td>
                      <td className="text-right">
                        <button className="text-xs text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-1 ml-auto transition">
                          Manage <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial & Infrastructure */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-900 mb-5">Financial & Infrastructure Status</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1 text-xs">
                  <CreditCard className="h-4 w-4 text-emerald-600" />
                  <span>Fee Collection</span>
                </div>
                <p className="text-2xl font-extrabold text-emerald-700 font-mono">94.8%</p>
                <p className="text-xs text-emerald-600 mt-0.5">Reconciled this semester</p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
                <div className="flex items-center gap-2 font-bold text-indigo-900 mb-1 text-xs">
                  <Home className="h-4 w-4 text-indigo-600" />
                  <span>Hostel Occupancy</span>
                </div>
                <p className="text-2xl font-extrabold text-indigo-700 font-mono">840<span className="text-base font-normal">/900</span></p>
                <p className="text-xs text-indigo-600 mt-0.5">Blocks 1–5 Operational</p>
              </div>

              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                <div className="flex items-center gap-2 font-bold text-purple-900 mb-1 text-xs">
                  <ShieldCheck className="h-4 w-4 text-purple-600" />
                  <span>Phase 1 Status</span>
                </div>
                <p className="text-xl font-extrabold text-purple-700">Ready ✓</p>
                <p className="text-xs text-purple-600 mt-0.5">4 Roles & Data Models</p>
              </div>
            </div>

            {/* Infrastructure */}
            <h4 className="text-sm font-bold text-slate-700 mb-3">Infrastructure Monitoring</h4>
            <div className="space-y-2">
              {infraStatus.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className={clsx('flex items-center justify-between p-3 rounded-xl border', item.bg, item.border)}>
                    <div className="flex items-center gap-2.5">
                      <Icon className={clsx('h-4 w-4', item.color)} />
                      <span className="text-xs font-bold text-slate-700">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className={clsx('font-mono font-bold', item.color)}>{item.value}</span>
                      <span className={clsx('px-2 py-0.5 rounded-full font-bold text-[10px] border', item.bg, item.color, item.border)}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Campus-Wide Attendance & Risk Overview */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Campus-Wide Academic Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {[
                { label: 'Overall Attendance Compliance', value: metrics.campusAverageAttendance, suffix: '%', color: 'bg-emerald-500', text: 'text-emerald-700' },
                { label: 'Course Completion Progress', value: 72, suffix: '%', color: 'bg-indigo-500', text: 'text-indigo-700' },
                { label: 'Assignment Submission Rate', value: 88, suffix: '%', color: 'bg-purple-500', text: 'text-purple-700' },
                { label: 'Fee Collection Rate', value: 94.8, suffix: '%', color: 'bg-amber-500', text: 'text-amber-700' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-slate-700 mb-1.5">
                    <span>{item.label}</span>
                    <span className={clsx('font-bold font-mono', item.text)}>{item.value}{item.suffix}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className={clsx('h-2 rounded-full', item.color)} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Audit Logs & Alerts */}
        <div className="space-y-6 lg:col-span-4">
          {/* System Alerts */}
          {(alerts.length > 0 || metrics.atRiskStudentsCampusWide > 0) && (
            <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-amber-100 flex items-center gap-2 bg-amber-50/60">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <div>
                  <h3 className="text-sm font-bold text-amber-900">Campus Risk Alerts</h3>
                  <p className="text-xs text-amber-600">{metrics.atRiskStudentsCampusWide} at-risk students campus-wide</p>
                </div>
              </div>
              <div className="p-5 space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200">
                  <p className="font-bold text-amber-900">{metrics.atRiskStudentsCampusWide} Students Below 75% Attendance</p>
                  <p className="text-amber-700 mt-0.5">Review eligibility for upcoming semester examinations</p>
                </div>
                <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-200">
                  <p className="font-bold text-indigo-900">Phase 1 ERP Deployment Active</p>
                  <p className="text-indigo-700 mt-0.5">All 4 role portals verified with JWT authentication</p>
                </div>
              </div>
            </div>
          )}

          {/* System Activity / Audit Logs */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">System Activity & Security Audit</h3>
                <p className="text-xs text-slate-500">Recent authentication and system events</p>
              </div>
            </div>

            <div className="p-5 space-y-2">
              {(alerts.length > 0 ? alerts : auditLogs).map((item: any, i: number) => (
                <div key={item.id || i} className="p-3 rounded-xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-slate-900 flex-1">{item.action || item.title}</p>
                    <span className={clsx(
                      'rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap flex-shrink-0',
                      item.status === 'success' ? 'badge-emerald' :
                      item.status === 'info' ? 'badge-indigo' :
                      'badge-slate'
                    )}>
                      {item.type || 'SYS'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{item.time || item.source}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Platform Module Status</h3>
            <div className="space-y-3 text-xs">
              {[
                { module: 'Authentication & RBAC', status: 'Phase 1 ✓', color: 'badge-emerald' },
                { module: 'Student Academic Portal', status: 'Phase 1 ✓', color: 'badge-emerald' },
                { module: 'Faculty Console', status: 'Phase 1 ✓', color: 'badge-emerald' },
                { module: 'Mentorship Hub', status: 'Phase 1 ✓', color: 'badge-emerald' },
                { module: 'AI Risk Engine (XGBoost)', status: 'Phase 2', color: 'badge-slate' },
                { module: 'OR-Tools Timetable', status: 'Phase 2', color: 'badge-slate' },
                { module: 'Cloud Deployment', status: 'Phase 3', color: 'badge-slate' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-slate-600">{item.module}</span>
                  <span className={item.color}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
