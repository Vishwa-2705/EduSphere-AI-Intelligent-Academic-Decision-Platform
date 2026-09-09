import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock3, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getDefaultStudentLeaveApplications, getStudentRecord, getStudentStorageKey, LeaveApplication, normalizeStudentLeaveApplications } from '../../data/studentData';
import { studentList } from '../../data/facultyData';
import { StudentLeaveRequest } from '../../data/facultyData';

export const StudentLeavePage: React.FC = () => {
  const { user } = useAuth();
  const student = getStudentRecord(user?.email);
  const [form, setForm] = useState({ type: 'Medical Leave', from: '', to: '', reason: '' });

  const formatLeaveDate = (value: string) => {
    if (!value) return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day) return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    return new Date(year, month - 1, day).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const [applications, setApplications] = useState<LeaveApplication[]>(() => {
    const storageKey = getStudentStorageKey(user?.email, 'leave_applications');
    const saved = localStorage.getItem(storageKey);
    if (!saved) return getDefaultStudentLeaveApplications(user?.email);
    try {
      return normalizeStudentLeaveApplications(JSON.parse(saved), user?.email);
    } catch {
      return getDefaultStudentLeaveApplications(user?.email);
    }
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const storageKey = getStudentStorageKey(user?.email, 'leave_applications');
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setApplications(normalizeStudentLeaveApplications(JSON.parse(saved), user?.email));
      } catch {
        setApplications(getDefaultStudentLeaveApplications(user?.email));
      }
    } else {
      setApplications(getDefaultStudentLeaveApplications(user?.email));
    }
  }, [user?.email]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.from || !form.to || !form.reason.trim()) {
      setError('Please fill in leave type, dates, and reason.');
      return;
    }
    if (new Date(form.to) < new Date(form.from)) {
      setError('End date cannot be earlier than start date.');
      return;
    }
    setError('');
    const requestId = `lr-${Date.now()}`;
    const approvalLabels = student.studentType === 'DAY_SCHOLAR' ? ['Parent', 'Mentor'] : ['Parent', 'Warden', 'Mentor'];
    const nextApplication: LeaveApplication = {
      date: formatLeaveDate(form.from),
      type: form.type,
      duration: `${Math.max(1, Math.ceil((new Date(form.to).getTime() - new Date(form.from).getTime()) / (1000 * 60 * 60 * 24)) + 1)} Days`,
      status: 'Awaiting',
      approvals: approvalLabels.map((label) => ({ label, status: 'Awaiting' })),
      requestId,
    };
    const nextApplications = [nextApplication, ...applications];
    setApplications(nextApplications);
    localStorage.setItem(getStudentStorageKey(user?.email, 'leave_applications'), JSON.stringify(nextApplications));

    const fromVal = form.from;
    const toVal = form.to;

    // Also publish to shared faculty leave store so mentors/wardens see this request
    try {
      const matched = studentList.find(s => s.email.toLowerCase() === (user?.email || '').toLowerCase() || s.regNo === student.registerNumber);
      const departmentCode = matched?.departmentCode || matched?.departmentName?.slice(0, 3).toUpperCase() || 'CSE';
      const isHostelLeave = Boolean(student.hostelBlock && student.hostelBlock.trim());
      const days = Math.max(1, Math.ceil((new Date(toVal).getTime() - new Date(fromVal).getTime()) / (1000 * 60 * 60 * 24)) + 1);
      const newLeave: StudentLeaveRequest = {
        id: requestId,
        studentId: matched?.id || `std-${(student.registerNumber || '').toLowerCase()}`,
        studentName: student.name,
        regNo: student.registerNumber,
        departmentCode: departmentCode,
        mentorEmail: (matched?.mentorEmail) || (student as any).mentorEmail || '',
        mentorName: (matched?.mentorName) || (student as any).mentorName || '',
        leaveType: form.type,
        fromDate: fromVal,
        toDate: toVal,
        numberOfDays: days,
        reason: form.reason,
        hasDocument: false,
        submittedAt: new Date().toISOString().split('T')[0],
        status: 'Pending',
        isHostelLeave: isHostelLeave,
        hostelBlock: isHostelLeave ? student.hostelBlock : undefined,
        hostelRoom: isHostelLeave ? student.hostelRoom : undefined,
        wardenStatus: isHostelLeave ? 'Pending' : undefined,
      };

      const sharedKey = 'edusphere_leaves';
      const saved = localStorage.getItem(sharedKey);
      const arr = saved ? JSON.parse(saved) : [];
      arr.unshift(newLeave);
      localStorage.setItem(sharedKey, JSON.stringify(arr));
      // notify listeners (FacultyContext) to reload
      window.dispatchEvent(new Event('edusphere_leaves_updated'));
    } catch (e) {
      // ignore failures here to avoid breaking student flow
    }

    setForm({ type: 'Medical Leave', from: '', to: '', reason: '' });
  };

  const statusColor = (status: string) => {
    if (status === 'Approved') return 'badge-emerald';
    if (status === 'Rejected') return 'badge-rose';
    return 'badge-amber';
  };

  const getApplicationStatus = (item: LeaveApplication) => {
    if (item.approvals.some((approval) => approval.status === 'Declined')) return 'Rejected';
    if (item.approvals.length > 0 && item.approvals.every((approval) => approval.status === 'Approved')) return 'Approved';
    return 'Awaiting';
  };

  return (
    <div className="space-y-6 font-serif">
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-lavender mb-2 inline-block">Student Services</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Leave Application</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Apply for authorised leave and monitor approval status</p>
          </div>
          <div className="rounded-xl bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider">Pending Requests</p>
            <p className="text-sm font-bold">{applications.filter((application) => getApplicationStatus(application) === 'Awaiting').length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-5">
          <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-lavender-100 flex items-center gap-2">
              <FileText className="h-4 w-4 text-lavender-700" /> Apply for Leave
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Leave Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif">
                  <option>Medical Leave</option>
                  <option>Personal Leave</option>
                  <option>Emergency Leave</option>
                  <option>Academic Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">From Date</label>
                  <input type="date" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">To Date</label>
                  <input type="date" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason</label>
                <textarea rows={4} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Explain the reason for your leave request" className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif" />
              </div>
              {error && <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold px-3 py-2">{error}</div>}
              <button type="submit" className="w-full px-4 py-3 rounded-xl bg-lavender-700 hover:bg-lavender-800 text-white font-bold text-xs shadow-sm transition">Submit Leave Request</button>
            </form>
          </div>
        </div>

        <div className="xl:col-span-7">
          <div className="bg-white rounded-2xl border border-lavender-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-lavender-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Previous Applications</h3>
              <span className="badge-lavender">{applications.length} Records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="edusphere-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Leave Type</th>
                    <th>Duration</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((item, idx) => (
                    <React.Fragment key={idx}>
                    <tr>
                      <td className="font-mono text-slate-700">{item.date}</td>
                      <td className="font-bold text-slate-900">{item.type}</td>
                      <td className="font-mono text-slate-700">{item.duration}</td>
                      <td><span className={statusColor(getApplicationStatus(item))}>{getApplicationStatus(item)}</span></td>
                    </tr>
                    <tr><td colSpan={4} className="bg-lavender-50/40"><div className="flex flex-wrap gap-2 py-2">{item.approvals.map((approval) => <span key={approval.label} className={statusColor(approval.status === 'Declined' ? 'Rejected' : approval.status === 'Approved' ? 'Approved' : 'Pending')}>{approval.label}: {approval.status}</span>)}</div></td></tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
