import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { MetricCard } from '../../components/common/MetricCard';
import { MenteeItem } from '../../types';
import {
  Users,
  AlertTriangle,
  FileText,
  Search,
  Eye,
  Sparkles,
  Phone,
  Calendar,
  X,
  UserCheck,
  HeartHandshake,
  CheckCircle2,
  TrendingDown,
  Mail,
} from 'lucide-react';
import clsx from 'clsx';

export const MentorDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('ALL');
  const [selectedMentee, setSelectedMentee] = useState<MenteeItem | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get('/dashboard/mentor');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err: any) {
        console.error('Error loading mentor dashboard:', err);
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
          <p className="text-sm font-bold text-slate-700">Loading Mentorship Intelligence Hub...</p>
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalMentees: 3,
    atRiskCount: 2,
    openInterventionsCount: 1,
    scheduledCounselingSessions: 3,
  };

  const riskSummary = data?.riskSummary || { critical: 1, high: 0, moderate: 1, low: 1, total: 3 };
  const mentees: MenteeItem[] = data?.mentees || [];
  const interventions = data?.interventions || [];

  const filteredMentees = mentees.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.registrationNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = selectedRiskFilter === 'ALL' || m.riskLevel === selectedRiskFilter;
    return matchesSearch && matchesRisk;
  });

  const recentCounseling = [
    { name: 'Rohit Kumar', rollNo: '22CS105', date: 'Aug 12, 2026', type: 'Academic Warning', notes: 'Discussed attendance improvement plan. Student has committed to attending all remaining classes.', status: 'IN_PROGRESS', parentNotified: true },
    { name: 'Meena Patel', rollNo: '22CS091', date: 'Aug 09, 2026', type: 'Performance Review', notes: 'Reviewed mid-term performance. Suggested joining peer study group for Algorithms.', status: 'RESOLVED', parentNotified: false },
  ];

  return (
    <div className="space-y-6 font-serif">
      {/* Welcome Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-xs font-bold text-purple-700 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Student Mentorship & Early-Warning Decision Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome, {profile?.fullName || 'Prof. Anita Verma'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Designation: <strong className="text-slate-800">{profile?.designation || 'Senior Faculty Mentor & Counselor'}</strong> • Mentorship Center, Desk 04 • <strong className="text-indigo-600">{metrics.totalMentees} Assigned Mentees</strong>
            </p>
          </div>
          <button className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm shadow-purple-200/50 transition flex items-center gap-2 flex-shrink-0">
            <HeartHandshake className="h-4 w-4" />
            <span>Log Counseling Note</span>
          </button>
        </div>

        {/* Quick Info Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Users className="h-4 w-4 text-purple-500" />
            <span><strong>Assigned Cohort:</strong> B.Tech CSE (Class of 2026)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <AlertTriangle className="h-4 w-4 text-rose-500" />
            <span><strong>Early Warning:</strong> <span className="font-bold text-rose-600">{riskSummary.critical} Critical</span> • <span className="font-bold text-amber-600">{riskSummary.moderate} Moderate</span></span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="h-4 w-4 text-emerald-500" />
            <span><strong>Upcoming Counseling:</strong> {metrics.scheduledCounselingSessions} Sessions This Week</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Assigned Mentees"
          value={metrics.totalMentees}
          subtext="Undergraduate B.Tech cohort"
          icon={Users}
          variant="indigo"
        />
        <MetricCard
          title="At-Risk Students"
          value={metrics.atRiskCount}
          subtext="Requires active intervention"
          icon={AlertTriangle}
          variant={metrics.atRiskCount > 0 ? 'rose' : 'emerald'}
          trend={{
            value: `${riskSummary.critical} Critical · ${riskSummary.moderate} Moderate`,
            isPositive: metrics.atRiskCount === 0,
          }}
        />
        <MetricCard
          title="Open Action Plans"
          value={metrics.openInterventionsCount}
          subtext="Remedial cases in progress"
          icon={FileText}
          variant="amber"
        />
        <MetricCard
          title="Counseling Sessions"
          value={metrics.scheduledCounselingSessions}
          subtext="Scheduled this academic week"
          icon={Calendar}
          variant="slate"
        />
      </div>

      {/* Mentee Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Assigned Mentee Cohort & Risk Scorecards</h3>
              <p className="text-xs text-slate-500">360° diagnostics computed via Explainable ML (XGBoost + SHAP)</p>
            </div>

            {/* Risk Filter Tabs */}
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              {[
                { key: 'ALL', label: `All (${mentees.length})`, active: 'bg-indigo-600 text-white border-indigo-600', inactive: 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50' },
                { key: 'CRITICAL', label: `Critical (${riskSummary.critical})`, active: 'bg-rose-600 text-white border-rose-600', inactive: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' },
                { key: 'MODERATE', label: `Moderate (${riskSummary.moderate})`, active: 'bg-amber-500 text-white border-amber-500', inactive: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
                { key: 'LOW', label: `Healthy (${riskSummary.low})`, active: 'bg-emerald-600 text-white border-emerald-600', inactive: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
              ].map((btn) => (
                <button
                  key={btn.key}
                  onClick={() => setSelectedRiskFilter(btn.key)}
                  className={clsx(
                    'px-3 py-1.5 rounded-xl border transition',
                    selectedRiskFilter === btn.key ? btn.active : btn.inactive
                  )}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mentee by name or roll number..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-serif placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="edusphere-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Register No.</th>
                <th>Attendance</th>
                <th>CGPA</th>
                <th>AI Risk Tier</th>
                <th>Primary Warning Factor</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMentees.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {m.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900">{m.name}</span>
                    </div>
                  </td>
                  <td className="font-mono text-slate-600">{m.registrationNo}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={clsx('h-1.5 rounded-full', m.attendancePercentage >= 85 ? 'bg-emerald-500' : m.attendancePercentage >= 75 ? 'bg-amber-500' : 'bg-rose-500')}
                          style={{ width: `${m.attendancePercentage}%` }}
                        />
                      </div>
                      <span className={clsx(
                        'font-mono font-bold text-xs',
                        m.attendancePercentage >= 85 ? 'text-emerald-600' : m.attendancePercentage >= 75 ? 'text-amber-600' : 'text-rose-600'
                      )}>
                        {m.attendancePercentage}%
                      </span>
                    </div>
                  </td>
                  <td className="font-mono font-bold text-slate-900">{m.currentCgpa.toFixed(2)}</td>
                  <td>
                    <span className={clsx(
                      'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase',
                      m.riskLevel === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      m.riskLevel === 'MODERATE' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    )}>
                      {m.riskLevel}
                    </span>
                  </td>
                  <td className="text-xs text-slate-500 max-w-[200px] truncate">{m.primaryFactor}</td>
                  <td className="text-right">
                    <button
                      onClick={() => setSelectedMentee(m)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>360° Dossier</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Counseling Interventions */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Active Counseling & Intervention Plans</h3>
            <p className="text-xs text-slate-500">Logged mentorship cases, parent notifications, and follow-up schedules</p>
          </div>
          <span className="badge-purple">{recentCounseling.length + interventions.length} Active</span>
        </div>

        <div className="p-6 divide-y divide-slate-100">
          {[...(interventions.length > 0 ? interventions.map((inv: any) => ({
            name: inv.title,
            rollNo: '',
            date: new Date(inv.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
            type: inv.concernType,
            notes: inv.notes,
            status: inv.status,
            parentNotified: inv.parentNotified,
          })) : recentCounseling)].map((item, i) => (
            <div key={i} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{item.name}</span>
                  {item.rollNo && <span className="font-mono text-xs text-slate-400">{item.rollNo}</span>}
                  <span className="badge-rose">{item.type}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-snug">{item.notes}</p>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">{item.date}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={clsx(
                  'rounded-xl px-2.5 py-1 text-xs font-bold',
                  item.status === 'RESOLVED' ? 'badge-emerald' : 'badge-amber'
                )}>
                  {item.status}
                </span>
                {item.parentNotified && (
                  <span className="badge-slate">Parent Notified</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 360° Student Dossier Modal */}
      {selectedMentee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-white/20 text-white flex items-center justify-center font-extrabold text-lg">
                  {selectedMentee.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">{selectedMentee.name}</h3>
                  <p className="text-xs text-indigo-200 font-mono">
                    {selectedMentee.registrationNo} • Semester {selectedMentee.semester}, Section {selectedMentee.section}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMentee(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 bg-slate-50/50">
              {/* 3 Key Stats */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                {[
                  { label: 'Attendance', value: `${selectedMentee.attendancePercentage}%`, color: selectedMentee.attendancePercentage >= 75 ? 'text-emerald-600' : 'text-rose-600' },
                  { label: 'CGPA', value: selectedMentee.currentCgpa.toFixed(2), color: 'text-slate-900' },
                  { label: 'Risk Score', value: `${selectedMentee.riskScore}/100`, color: selectedMentee.riskScore > 60 ? 'text-rose-600' : selectedMentee.riskScore > 40 ? 'text-amber-600' : 'text-emerald-600' },
                ].map((stat, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white border border-slate-200">
                    <p className="text-slate-400 uppercase text-[10px] font-bold">{stat.label}</p>
                    <p className={clsx('text-xl font-extrabold font-mono mt-0.5', stat.color)}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Risk Warning */}
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                <p className="text-xs font-bold text-rose-900 uppercase mb-1 flex items-center gap-1.5">
                  <TrendingDown className="h-4 w-4" />
                  Primary Early Warning Factor
                </p>
                <p className="text-xs text-rose-700">{selectedMentee.primaryFactor}</p>
              </div>

              {/* Contact Info */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Student: <strong>{selectedMentee.phone || '+91 91234 56789'}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-rose-500" />
                  <span>Parent/Guardian: <strong>{selectedMentee.parentPhone || '+91 98111 22334'}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setSelectedMentee(null)}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-sm"
                >
                  Initiate Remedial Action Plan
                </button>
                <button
                  onClick={() => setSelectedMentee(null)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
