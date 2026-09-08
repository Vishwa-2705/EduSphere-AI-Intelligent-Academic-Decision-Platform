import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Users, AlertTriangle, Eye, Phone, HeartHandshake, CheckCircle2, X, Plus, Search, Sparkles } from 'lucide-react';
import clsx from 'clsx';

export const MentorMenteesPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('ALL');
  const [selectedMentee, setSelectedMentee] = useState<any | null>(null);
  const [showCounselModal, setShowCounselModal] = useState(false);
  const [isSubmittingLog, setIsSubmittingLog] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Counseling Form State
  const [counselStudentId, setCounselStudentId] = useState('');
  const [concernType, setConcernType] = useState('ATTENDANCE_DROP');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [actionPlan, setActionPlan] = useState('');
  const [parentNotified, setParentNotified] = useState(false);

  const fetchMentorshipData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/mentorship/mentees');
      if (res.data.success) {
        setData(res.data.data);
        if (res.data.data.mentees?.length > 0) {
          setCounselStudentId(res.data.data.mentees[0].studentId);
        }
      }
    } catch (err) {
      console.error('Failed to load mentorship roster:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorshipData();
  }, []);

  const handleCounselSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!counselStudentId || !title || !notes) return;

    try {
      setIsSubmittingLog(true);
      const res = await api.post('/mentorship/interventions', {
        studentId: counselStudentId,
        concernType,
        title,
        notes,
        actionPlan,
        parentNotified,
      });

      if (res.data.success) {
        setFeedback('Counseling note and remediation action plan logged successfully');
        setShowCounselModal(false);
        setTitle('');
        setNotes('');
        setActionPlan('');
        setTimeout(() => setFeedback(null), 4000);
        fetchMentorshipData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to log counseling note');
    } finally {
      setIsSubmittingLog(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex h-96 items-center justify-center font-serif">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-lavender-700 border-t-transparent" />
          <p className="text-sm font-bold text-slate-700">Loading Mentee Roster & Risk Scores...</p>
        </div>
      </div>
    );
  }

  const mentees: any[] = data?.mentees || [];
  const riskSummary = data?.riskSummary || { critical: 1, moderate: 1, low: 1 };
  const interventions: any[] = data?.interventions || [];

  const filteredMentees = mentees.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.registrationNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = selectedRiskFilter === 'ALL' || m.riskLevel === selectedRiskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-lavender mb-2 inline-block">1-on-1 Mentorship & Counseling</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Assigned Mentee Cohort & Academic Dossiers
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-time early warning diagnostics, attendance velocity, and personalized remediation plans
            </p>
          </div>

          <button
            onClick={() => setShowCounselModal(true)}
            className="px-4 py-2.5 rounded-xl bg-lavender-700 hover:bg-lavender-800 text-white font-bold text-xs shadow-md shadow-lavender-700/20 flex items-center gap-2 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Log Counseling Case Note</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-serif flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Risk Filter & Search */}
      <div className="bg-white rounded-2xl border border-lavender-200/80 shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 text-xs font-bold font-serif">
            {[
              { key: 'ALL', label: `All Mentees (${mentees.length})`, color: 'bg-lavender-700 text-white' },
              { key: 'CRITICAL', label: `Critical Risk (${riskSummary.critical})`, color: 'bg-rose-600 text-white' },
              { key: 'MODERATE', label: `Moderate Risk (${riskSummary.moderate})`, color: 'bg-amber-500 text-white' },
              { key: 'LOW', label: `Healthy Tier (${riskSummary.low})`, color: 'bg-emerald-600 text-white' },
            ].map((btn) => (
              <button
                key={btn.key}
                onClick={() => setSelectedRiskFilter(btn.key)}
                className={clsx(
                  'px-3.5 py-1.5 rounded-xl border transition',
                  selectedRiskFilter === btn.key
                    ? `${btn.color} border-transparent shadow-sm`
                    : 'bg-white border-lavender-200 text-slate-700 hover:bg-lavender-50'
                )}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mentee name or reg no..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-lavender-50/50 border border-slate-200 text-xs font-serif focus:bg-white focus:border-lavender-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Mentee Roster Table */}
        <div className="overflow-x-auto">
          <table className="edusphere-table">
            <thead>
              <tr>
                <th>Student Full Name</th>
                <th>Register No</th>
                <th>Attendance %</th>
                <th>CGPA</th>
                <th>Risk Tier</th>
                <th>Early Warning Factor</th>
                <th className="text-right">360° Dossier</th>
              </tr>
            </thead>
            <tbody>
              {filteredMentees.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-lavender-700 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {m.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900">{m.name}</span>
                    </div>
                  </td>
                  <td className="font-mono text-slate-600">{m.registrationNo}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-lavender-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={clsx(
                            'h-1.5 rounded-full',
                            m.attendancePercentage >= 85 ? 'bg-emerald-600' : m.attendancePercentage >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                          )}
                          style={{ width: `${m.attendancePercentage}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-xs">{m.attendancePercentage}%</span>
                    </div>
                  </td>
                  <td className="font-mono font-bold text-slate-900">{m.currentCgpa.toFixed(2)}</td>
                  <td>
                    <span className={clsx(
                      'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase',
                      m.riskLevel === 'CRITICAL' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                      m.riskLevel === 'MODERATE' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    )}>
                      {m.riskLevel}
                    </span>
                  </td>
                  <td className="text-xs text-slate-500 max-w-[220px] truncate">{m.primaryFactor}</td>
                  <td className="text-right">
                    <button
                      onClick={() => setSelectedMentee(m)}
                      className="px-3 py-1.5 rounded-xl bg-lavender-700 hover:bg-lavender-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 ml-auto transition"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View 360°</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Counseling Intervention History */}
      <div className="bg-white rounded-2xl border border-lavender-200/80 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-lavender-100">
          Recent Mentorship Interventions & Action Plans
        </h3>

        <div className="divide-y divide-lavender-100">
          {interventions.map((inv: any) => (
            <div key={inv.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{inv.title}</span>
                  <span className="badge-rose">{inv.concernType}</span>
                </div>
                <p className="text-slate-600 mt-1">{inv.notes}</p>
                <p className="text-lavender-900 font-bold mt-1">
                  Remediation Action: {inv.actionPlan}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={inv.status === 'RESOLVED' ? 'badge-emerald' : 'badge-amber'}>
                  {inv.status}
                </span>
                {inv.parentNotified && <span className="badge-slate">Parent Alerted ✓</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 360° Student Academic Dossier Modal */}
      {selectedMentee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-lavender-200 shadow-elevated overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-lavender-700 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold text-base">
                  {selectedMentee.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">{selectedMentee.name}</h3>
                  <p className="text-xs text-lavender-200 font-mono">
                    {selectedMentee.registrationNo} • Semester {selectedMentee.semester} (Sec {selectedMentee.section})
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedMentee(null)} className="p-1 rounded-lg text-white hover:bg-white/20">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 bg-lavender-50/40">
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-white border border-lavender-200">
                  <p className="text-slate-500 uppercase text-[10px] font-bold">Attendance</p>
                  <p className="text-xl font-bold text-slate-900 font-mono mt-0.5">{selectedMentee.attendancePercentage}%</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-lavender-200">
                  <p className="text-slate-500 uppercase text-[10px] font-bold">CGPA</p>
                  <p className="text-xl font-bold text-slate-900 font-mono mt-0.5">{selectedMentee.currentCgpa.toFixed(2)}</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-lavender-200">
                  <p className="text-slate-500 uppercase text-[10px] font-bold">Risk Score</p>
                  <p className="text-xl font-bold text-rose-700 font-mono mt-0.5">{selectedMentee.riskScore}/100</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-lavender-200 space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-lavender-700" />
                  <span>Student Contact: <strong>{selectedMentee.phone}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-rose-600" />
                  <span>Parent: <strong>{selectedMentee.parentName}</strong> ({selectedMentee.parentPhone})</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    setCounselStudentId(selectedMentee.studentId);
                    setSelectedMentee(null);
                    setShowCounselModal(true);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-lavender-700 hover:bg-lavender-800 text-white font-bold text-xs shadow-sm transition"
                >
                  Create Remediation Action Plan
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

      {/* Log Counseling Modal */}
      {showCounselModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-lavender-200 shadow-elevated p-6 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Log Mentorship Counseling Case</h3>
            <p className="text-xs text-slate-500 mb-4">Record 1-on-1 counseling guidance, target actions, and parent alerts</p>

            <form onSubmit={handleCounselSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Mentee</label>
                  <select
                    value={counselStudentId}
                    onChange={(e) => setCounselStudentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif"
                  >
                    {mentees.map((m) => (
                      <option key={m.studentId} value={m.studentId}>
                        {m.name} ({m.registrationNo})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Concern Category</label>
                  <select
                    value={concernType}
                    onChange={(e) => setConcernType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif"
                  >
                    <option value="ATTENDANCE_DROP">Attendance Deficit</option>
                    <option value="GRADE_DEFICIT">Academic / Internal Marks</option>
                    <option value="COUNSELING">Personal Counseling</option>
                    <option value="BEHAVIORAL">Behavioral / Discipline</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Intervention Case Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mid-Term Performance & Lab Attendance Review"
                  className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Counselor Discussion Notes</label>
                <textarea
                  rows={3}
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Summary of counseling conversation with mentee..."
                  className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Agreed Remediation Action Plan</label>
                <input
                  type="text"
                  value={actionPlan}
                  onChange={(e) => setActionPlan(e.target.value)}
                  placeholder="e.g. Mandatory peer tutoring attendance and weekly progress check"
                  className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="parentAlert"
                  checked={parentNotified}
                  onChange={(e) => setParentNotified(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 accent-lavender-700"
                />
                <label htmlFor="parentAlert" className="text-xs text-slate-700 font-bold select-none cursor-pointer">
                  Send Parent / Guardian Notification (SMS Alert)
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCounselModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingLog}
                  className="px-5 py-2 rounded-xl bg-lavender-700 hover:bg-lavender-800 text-white font-bold text-xs shadow-sm disabled:opacity-50"
                >
                  {isSubmittingLog ? 'Saving Case...' : 'Save Counseling Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
