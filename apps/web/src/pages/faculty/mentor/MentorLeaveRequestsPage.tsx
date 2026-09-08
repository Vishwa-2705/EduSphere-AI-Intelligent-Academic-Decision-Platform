import React, { useState } from 'react';
import { useFaculty } from '../../../contexts/FacultyContext';
import { LeaveRequest } from '../../../data/facultyData';
import {
  FileSpreadsheet, CheckCircle2, XCircle, Search, Clock, FileText,
  Send, AlertCircle, X, CheckCheck
} from 'lucide-react';
import clsx from 'clsx';

export const MentorLeaveRequestsPage: React.FC = () => {
  const { leaveRequests, updateLeaveStatus } = useFaculty();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [rejectModal, setRejectModal] = useState<{ open: boolean; request: LeaveRequest | null }>({
    open: false,
    request: null,
  });
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionNotice, setActionNotice] = useState('');

  const filtered = leaveRequests.filter(lr => {
    const matchSearch = lr.studentName.toLowerCase().includes(search.toLowerCase()) ||
      lr.regNo.toLowerCase().includes(search.toLowerCase()) ||
      lr.reason.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || lr.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleApprove = (lr: LeaveRequest) => {
    updateLeaveStatus(lr.id, 'Approved');
    setActionNotice(
      `Leave request for ${lr.studentName} (${lr.fromDate} to ${lr.toDate}) has been APPROVED. Automated notification dispatched to student.`
    );
    setTimeout(() => setActionNotice(''), 5000);
  };

  const handleOpenReject = (lr: LeaveRequest) => {
    setRejectionReason('');
    setRejectModal({ open: true, request: lr });
  };

  const handleConfirmReject = () => {
    if (!rejectModal.request || !rejectionReason.trim()) return;
    updateLeaveStatus(rejectModal.request.id, 'Rejected', rejectionReason.trim());
    setActionNotice(
      `Leave request for ${rejectModal.request.studentName} has been REJECTED with reason: "${rejectionReason.trim()}". Automated notification dispatched to student.`
    );
    setRejectModal({ open: false, request: null });
    setRejectionReason('');
    setTimeout(() => setActionNotice(''), 5000);
  };

  const pendingCount = leaveRequests.filter(l => l.status === 'Pending').length;
  const approvedCount = leaveRequests.filter(l => l.status === 'Approved').length;
  const rejectedCount = leaveRequests.filter(l => l.status === 'Rejected').length;

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800 mb-2">
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Attendance & Leave Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Mentee Leave Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review formal leave applications submitted by students assigned to your advisory desk.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge-amber">{pendingCount} Pending Approval</span>
          <span className="badge-emerald">{approvedCount} Approved</span>
        </div>
      </div>

      {/* Success/Action Banner */}
      {actionNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-3">
          <CheckCheck className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, roll number, or reason..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex gap-2">
          {['All', 'Pending', 'Approved', 'Rejected'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={clsx(
                'px-3.5 py-2 rounded-xl text-xs font-bold transition border',
                statusFilter === st
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200'
              )}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leave Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="edusphere-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Reg Number</th>
                <th>Leave Dates</th>
                <th>Duration</th>
                <th>Reason</th>
                <th>Submitted On</th>
                <th>Status</th>
                <th>Verification Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400 text-xs font-semibold">
                    No leave applications match the selected criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(lr => (
                  <tr key={lr.id}>
                    <td>
                      <div className="font-bold text-slate-900 text-xs">{lr.studentName}</div>
                      <span className="badge-lavender text-[10px] mt-0.5">{lr.leaveType}</span>
                    </td>
                    <td className="font-mono text-xs font-bold text-indigo-700">{lr.regNo}</td>
                    <td className="text-xs text-slate-700 font-medium whitespace-nowrap">
                      {lr.fromDate} <span className="text-slate-400">to</span> {lr.toDate}
                    </td>
                    <td className="text-xs font-bold text-slate-800 text-center">
                      {lr.numberOfDays} Day{lr.numberOfDays > 1 ? 's' : ''}
                    </td>
                    <td>
                      <p className="text-xs text-slate-600 max-w-[220px] leading-relaxed" title={lr.reason}>
                        {lr.reason}
                      </p>
                      {lr.hasDocument && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 font-bold mt-1">
                          <FileText className="h-3 w-3" /> Medical Certificate Attached
                        </span>
                      )}
                      {lr.rejectionReason && (
                        <p className="text-[10px] text-rose-600 font-medium mt-1">
                          Rejection Reason: {lr.rejectionReason}
                        </p>
                      )}
                    </td>
                    <td className="text-xs text-slate-500 font-mono whitespace-nowrap">{lr.submittedAt}</td>
                    <td>
                      <span className={clsx(
                        'px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border',
                        lr.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        lr.status === 'Pending' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        'bg-rose-50 text-rose-800 border-rose-200'
                      )}>
                        {lr.status}
                      </span>
                    </td>
                    <td>
                      {lr.status === 'Pending' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(lr)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleOpenReject(lr)}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition flex items-center gap-1"
                          >
                            <XCircle className="h-3.5 w-3.5" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">
                          Processed ({lr.actionAt || 'Completed'})
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Reason Modal */}
      {rejectModal.open && rejectModal.request && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-rose-700 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>Reject Student Leave Request</span>
              </h3>
              <button
                onClick={() => setRejectModal({ open: false, request: null })}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="text-xs space-y-2 text-slate-600">
              <p>
                Rejecting application for: <strong className="text-slate-900">{rejectModal.request.studentName}</strong> ({rejectModal.request.regNo})
              </p>
              <p>
                Requested Period: <strong className="text-slate-800">{rejectModal.request.fromDate} to {rejectModal.request.toDate}</strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Reason for Rejection *
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="e.g., Internal assessment scheduled during this period. Attendance is below minimum threshold."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 resize-none"
              />
              {!rejectionReason.trim() && (
                <p className="text-[11px] text-rose-500 mt-1">A valid reason is required to notify the mentee.</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectModal({ open: false, request: null })}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!rejectionReason.trim()}
                onClick={handleConfirmReject}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" /> Confirm & Notify Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
