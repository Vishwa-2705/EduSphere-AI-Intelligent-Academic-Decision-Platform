import React, { useState } from 'react';
import { useFaculty } from '../../../contexts/FacultyContext';
import { useAuth } from '../../../contexts/AuthContext';
import { getFacultyByEmail } from '../../../data/facultyData';
import { FileText, Plus, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

const LEAVE_TYPES = ['Casual Leave', 'Medical Leave', 'On Duty (OD)', 'Earned Leave', 'Special Casual Leave'] as const;

export const DeptFacultyLeavePage: React.FC = () => {
  const { user, profile } = useAuth();
  const { applyFacultyLeave, myOwnFacultyLeaves, facultyDepartmentCode, facultyDepartmentName } = useFaculty();
  const facultyInfo = user?.email ? getFacultyByEmail(user.email) : undefined;
  const facultyName = facultyInfo?.name || profile?.fullName || 'Faculty Member';
  const hodName = facultyDepartmentCode === 'IT' ? 'Dr. Rajesh Venkat' : facultyDepartmentCode === 'CSE' ? 'Dr. Priya Kumar' : 'Department HOD';

  const [form, setForm] = useState({
    leaveType: 'Casual Leave' as typeof LEAVE_TYPES[number],
    fromDate: '',
    toDate: '',
    reason: '',
    supportingDocument: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const calcDays = () => {
    if (!form.fromDate || !form.toDate) return 0;
    const from = new Date(form.fromDate);
    const to = new Date(form.toDate);
    const diff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.fromDate || !form.toDate || !form.reason.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (new Date(form.toDate) < new Date(form.fromDate)) {
      setError('To Date must be on or after From Date.');
      return;
    }
    applyFacultyLeave({
      facultyName,
      facultyId: facultyInfo?.id || user?.email || '',
      facultyEmail: user?.email || '',
      departmentCode: facultyDepartmentCode,
      departmentName: facultyDepartmentName,
      leaveType: form.leaveType,
      fromDate: form.fromDate,
      toDate: form.toDate,
      numberOfDays: calcDays(),
      reason: form.reason.trim(),
      supportingDocument: form.supportingDocument.trim() || undefined,
      isHODLeave: false,
    });
    setSubmitted(true);
    setForm({ leaveType: 'Casual Leave', fromDate: '', toDate: '', reason: '', supportingDocument: '' });
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      Pending: 'bg-amber-50 text-amber-700 border-amber-200',
      Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
    };
    return (
      <span className={clsx('px-2.5 py-0.5 rounded-lg text-[11px] font-bold border', map[status] || 'bg-slate-100 text-slate-600 border-slate-200')}>
        {status}
      </span>
    );
  };

  const myLeaves = myOwnFacultyLeaves.filter(l => !l.isHODLeave);

  return (
    <div className="space-y-6 font-serif">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-50 flex items-center justify-center">
            <FileText className="h-6 w-6 text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Apply for Leave</h1>
            <p className="text-sm text-slate-500">{facultyName} - {facultyDepartmentCode} Dept. | Leave requests are routed to HOD {hodName}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-5">New Leave Application</h2>
        {submitted && (
          <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="h-4 w-4" />
            Leave application submitted successfully! Routed to HOD {hodName} for approval.
          </div>
        )}
        {error && (
          <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
            <AlertTriangle className="h-4 w-4" /> {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Leave Type *</label>
            <select value={form.leaveType} onChange={e => setForm(f => ({ ...f, leaveType: e.target.value as any }))}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20">
              {LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div />
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">From Date *</label>
            <input type="date" value={form.fromDate} onChange={e => setForm(f => ({ ...f, fromDate: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">To Date *</label>
            <input type="date" value={form.toDate} onChange={e => setForm(f => ({ ...f, toDate: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
          </div>
          {form.fromDate && form.toDate && calcDays() > 0 && (
            <div className="sm:col-span-2">
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-50 border border-violet-200 text-violet-800 text-xs font-bold">
                <Clock className="h-3.5 w-3.5" /> Duration: {calcDays()} day(s)
              </div>
            </div>
          )}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Reason for Leave *</label>
            <textarea rows={3} value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
              placeholder="Provide a detailed reason for your leave request..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 resize-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Supporting Document (optional)</label>
            <input type="text" value={form.supportingDocument} onChange={e => setForm(f => ({ ...f, supportingDocument: e.target.value }))}
              placeholder="e.g. Medical_Certificate.pdf"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-700 hover:bg-violet-800 text-white text-xs font-bold transition shadow-sm">
              <Plus className="h-4 w-4" /> Submit Leave Application
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">My Leave Requests</h3>
          <p className="text-xs text-slate-500">Status of your leave applications - reviewed by CSE HOD</p>
        </div>
        <div className="overflow-x-auto">
          <table className="edusphere-table">
            <thead>
              <tr>
                <th>Leave Type</th><th>From</th><th>To</th><th>Days</th>
                <th>Reason</th><th>Submitted</th><th>Status</th><th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {myLeaves.map(lr => (
                <tr key={lr.id}>
                  <td className="text-xs font-bold text-slate-800">{lr.leaveType}</td>
                  <td className="text-xs font-mono text-slate-600">{lr.fromDate}</td>
                  <td className="text-xs font-mono text-slate-600">{lr.toDate}</td>
                  <td className="text-center"><span className="text-xs font-extrabold text-violet-700">{lr.numberOfDays}d</span></td>
                  <td className="max-w-xs"><p className="text-[11px] text-slate-600 truncate" title={lr.reason}>{lr.reason}</p></td>
                  <td className="text-xs font-mono text-slate-500">{lr.submittedDate}</td>
                  <td>{statusBadge(lr.status)}</td>
                  <td className="text-[11px] text-rose-600">{lr.rejectionReason || '-'}</td>
                </tr>
              ))}
              {myLeaves.length === 0 && (
                <tr><td colSpan={8} className="text-center text-xs text-slate-400 py-8">No leave applications submitted yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
