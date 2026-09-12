import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useFaculty } from '../../../contexts/FacultyContext';
import { CheckCircle2, Clock, FileText, XCircle } from 'lucide-react';
import clsx from 'clsx';

export const HODFacultyLeaveApprovalsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { myDepartmentFacultyLeaves, updateFacultyLeaveStatus, facultyDepartmentCode, facultyDepartmentName } = useFaculty();
  const [rejectModal, setRejectModal] = useState<{ id: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const facultyDisplayName = profile?.fullName || user?.email || 'Department HOD';

  const handleApprove = (id: string) => updateFacultyLeaveStatus(id, 'Approved');

  const handleRejectConfirm = () => {
    if (rejectModal && rejectReason.trim()) {
      updateFacultyLeaveStatus(rejectModal.id, 'Rejected', rejectReason.trim());
      setRejectModal(null);
      setRejectReason('');
    }
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

  return (
    <div className="space-y-6 font-serif">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-50 flex items-center justify-center">
            <FileText className="h-6 w-6 text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Faculty Leave Approvals</h1>
            <p className="text-sm text-slate-500">
              {facultyDisplayName} · {facultyDepartmentName || 'Department'} ({facultyDepartmentCode})
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Approvals Queue</h2>
            <p className="text-xs text-slate-500">Faculties under Priya Kumar will appear here for approval or rejection.</p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-700">
            <Clock className="h-3.5 w-3.5" />
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
                  <td colSpan={8} className="px-4 py-10 text-center text-xs text-slate-400">No faculty leave requests available for approval.</td>
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

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4" />
        Approved and rejected decisions update the faculty request status instantly.
      </div>
    </div>
  );
};
