import React, { useState } from 'react';
import { useFaculty } from '../../../contexts/FacultyContext';
import { useAuth } from '../../../contexts/AuthContext';
import { FileText, Plus, CheckCircle2, Clock, XCircle, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

const LEAVE_TYPES = ['Casual Leave', 'Medical Leave', 'On Duty (OD)', 'Earned Leave', 'Special Casual Leave'] as const;

export const HODApplyLeavePage: React.FC = () => {
  const { user, profile } = useAuth();
  const { applyFacultyLeave, myOwnFacultyLeaves, myDepartmentFacultyLeaves, facultyDepartmentCode, facultyDepartmentName, updateFacultyLeaveStatus } = useFaculty();
  const facultyDisplayName = profile?.fullName || user?.email || 'Department HOD';

  const [rejectModal, setRejectModal] = useState<{ id: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

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
      facultyName: facultyDisplayName,
      facultyId: user?.email || 'department-hod',
      facultyEmail: user?.email || 'department.hod@edusphere.ai',
      departmentCode: facultyDepartmentCode,
      departmentName: facultyDepartmentName,
      leaveType: form.leaveType,
      fromDate: form.fromDate,
      toDate: form.toDate,
      numberOfDays: calcDays(),
      reason: form.reason.trim(),
      supportingDocument: form.supportingDocument.trim() || undefined,
      isHODLeave: true,
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

  const hodLeaves = myOwnFacultyLeaves.filter(l => l.isHODLeave);

  const handleApprove = (id: string) => updateFacultyLeaveStatus(id, 'Approved');
  const handleRejectConfirm = () => {
    if (rejectModal && rejectReason.trim()) {
      updateFacultyLeaveStatus(rejectModal.id, 'Rejected', rejectReason.trim());
      setRejectModal(null);
      setRejectReason('');
    }
  };

  return (
    <div className="space-y-6 font-serif">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-50 flex items-center justify-center">
            <FileText className="h-6 w-6 text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Apply for Leave</h1>
            <p className="text-sm text-slate-500">{facultyDisplayName} - HOD, {facultyDepartmentCode} | Requests are routed to Admin/Dean</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-5">New Leave Application</h2>
        {submitted && (
          <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="h-4 w-4" />
            Leave application submitted successfully! Routed to Admin/Dean for approval.
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
              placeholder="e.g. Conference_Acceptance_Letter.pdf"
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
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Faculty Leave Approvals</h2>
            <p className="text-xs text-slate-500">Faculties under {facultyDisplayName} are listed here for approval or rejection.</p>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-700">
            {myDepartmentFacultyLeaves.filter(item => item.status === 'Pending').length} pending
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-600">Faculty</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-600">Leave Type</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-600">From</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-600">To</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-600">Days</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-600">Reason</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-600">Status</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {myDepartmentFacultyLeaves.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-xs text-slate-400">No faculty leave requests pending for approval.</td>
                </tr>
              ) : (
                myDepartmentFacultyLeaves.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-bold text-slate-800">{item.facultyName}</td>
                    <td className="px-4 py-3 text-xs text-slate-700">{item.leaveType}</td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-600">{item.fromDate}</td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-600">{item.toDate}</td>
                    <td className="px-4 py-3 text-xs font-bold text-violet-700">{item.numberOfDays}d</td>
                    <td className="px-4 py-3 text-xs text-slate-600 max-w-xs truncate" title={item.reason}>{item.reason}</td>
                    <td className="px-4 py-3">{statusBadge(item.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleApprove(item.id)} className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-[10px] font-bold text-white hover:bg-emerald-700 transition">
                          Approve
                        </button>
                        <button onClick={() => setRejectModal({ id: item.id, name: item.facultyName })} className="px-2.5 py-1.5 rounded-lg bg-rose-600 text-[10px] font-bold text-white hover:bg-rose-700 transition">
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md mx-4 p-6">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">Reject Leave Request</h3>
            <p className="text-xs text-slate-500 mb-4">Mandatory rejection reason for <strong>{rejectModal.name}</strong>.</p>
            <textarea rows={3} value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason (required)..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 resize-none" />
            <div className="flex items-center justify-end gap-3 mt-4">
              <button onClick={() => setRejectModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
              <button onClick={handleRejectConfirm} disabled={!rejectReason.trim()}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white text-xs font-bold transition">
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
