import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useFaculty } from '../../../contexts/FacultyContext';
import { facultyMembers, subjects } from '../../../data/facultyData';
import {
  Users, BookOpen, CheckCircle2, XCircle, GraduationCap,
  Bell, FileText, Sparkles, ChevronRight,
  Clock, AlertTriangle, Filter,
} from 'lucide-react';
import clsx from 'clsx';

export const HODDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const {
    materials, notifications, facultyDepartmentCode,
    facultyDepartmentName, myDepartmentFacultyLeaves, myDepartmentStudentSchedules,
    myDepartmentFacultySchedules, updateFacultyLeaveStatus, myDepartmentExams,
  } = useFaculty();

  const [rejectModal, setRejectModal] = useState<{ id: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [detailModal, setDetailModal] = useState<any | null>(null);
  const [scheduleYearFilter, setScheduleYearFilter] = useState('All');
  const [scheduleSectionFilter, setScheduleSectionFilter] = useState('All');
  const [scheduleDayFilter, setScheduleDayFilter] = useState('All');
  const [facultyScheduleFilter, setFacultyScheduleFilter] = useState('All');
  const [facultyScheduleDayFilter, setFacultyScheduleDayFilter] = useState('All');

  const facultyDisplayName = profile?.fullName || user?.email || 'Department HOD';
  const deptCode = facultyDepartmentCode;
  const deptName = facultyDepartmentName || 'Computer Science & Engineering';
  const deptMaterials = materials.filter(m => m.departmentCode === deptCode);
  const pending = deptMaterials.filter(m => ['Submitted', 'Under Verification', 'Resubmitted'].includes(m.status)).length;
  const approved = deptMaterials.filter(m => m.status === 'Approved').length;
  const rejected = deptMaterials.filter(m => m.status === 'Rejected').length;
  const pendingLeaveCount = myDepartmentFacultyLeaves.filter(l => l.status === 'Pending').length;
  const deptFacultyCount = facultyMembers.filter(f => f.departmentCode === deptCode && f.facultyRole !== 'HOD').length;

  const overviewCards = [
    { label: 'Department Faculty', value: deptFacultyCount, icon: Users, color: 'bg-violet-50 text-violet-700', border: 'border-violet-200' },
    { label: 'Total Subjects', value: subjects.filter(s => s.departmentCode === deptCode).length, icon: BookOpen, color: 'bg-blue-50 text-blue-700', border: 'border-blue-200' },
    { label: 'Leave Requests', value: pendingLeaveCount, icon: Clock, color: 'bg-amber-50 text-amber-700', border: 'border-amber-200' },
    { label: 'Approved Materials', value: approved, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-200' },
    { label: 'Total Students', value: deptCode === 'CSE' ? 118 : 96, icon: GraduationCap, color: 'bg-indigo-50 text-indigo-700', border: 'border-indigo-200' },
  ];

  const recentActivity = [
    { text: 'Mr. Arun Kumar submitted "SE Unit 1 - SDLC Models" for verification.', time: '2 hours ago', type: 'submit' },
    { text: 'Aarav Patil submitted "DBMS Unit 3 - Transactions" for verification.', time: '5 hours ago', type: 'submit' },
    { text: '"Web Technologies Lab Manual" approved and published.', time: '5 days ago', type: 'approve' },
    { text: '"Algorithms Question Bank" rejected with feedback.', time: '6 days ago', type: 'reject' },
  ];

  const uniqueDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const uniqueFacultyNames = Array.from(new Set(myDepartmentFacultySchedules.map(s => s.facultyName)));

  const filteredStudentSchedule = myDepartmentStudentSchedules.filter(s => {
    if (scheduleYearFilter !== 'All' && s.year !== scheduleYearFilter) return false;
    if (scheduleSectionFilter !== 'All' && s.section !== scheduleSectionFilter) return false;
    if (scheduleDayFilter !== 'All' && s.day !== scheduleDayFilter) return false;
    return true;
  });

  const filteredFacultySchedule = myDepartmentFacultySchedules.filter(s => {
    if (facultyScheduleFilter !== 'All' && s.facultyName !== facultyScheduleFilter) return false;
    if (facultyScheduleDayFilter !== 'All' && s.day !== facultyScheduleDayFilter) return false;
    return true;
  });

  const handleApprove = (id: string) => updateFacultyLeaveStatus(id, 'Approved');
  const handleRejectConfirm = () => {
    if (rejectModal && rejectReason.trim()) {
      updateFacultyLeaveStatus(rejectModal.id, 'Rejected', rejectReason.trim());
      setRejectModal(null);
      setRejectReason('');
    }
  };

  const leaveStatusBadge = (status: string) => {
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

      {/* HOD Welcome Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-xs font-bold text-violet-700 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>HOD Console - {deptName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome, {facultyDisplayName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Head of Department &bull; <strong className="text-slate-800">{deptName} ({deptCode})</strong> &bull; Academic Year 2025-2026 &bull; Semester VI
            </p>
          </div>
          <div className="flex items-center gap-3">
            {pending > 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                {pending} material{pending > 1 ? 's' : ''} awaiting your review
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5 Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {overviewCards.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className={`bg-white rounded-2xl border ${m.border} shadow-sm p-4 flex items-center gap-3`}>
              <div className={`h-10 w-10 rounded-xl ${m.color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">{m.value}</p>
                <p className="text-xs text-slate-500 font-semibold leading-tight">{m.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Department Overview */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Department Overview</h3>
            <p className="text-xs text-slate-500">{deptCode} - Faculty and Materials Summary</p>
          </div>
          <a href="/faculty/hod/faculty" className="text-xs font-bold text-violet-700 hover:text-violet-900 flex items-center gap-1">
            View All Faculty <ChevronRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="p-5">
            <p className="text-xs text-slate-500 font-semibold mb-3 uppercase tracking-wider">Material Stats</p>
            {[
              { label: 'Approval Rate', value: `${approved}/${deptMaterials.length}`, pct: Math.round((approved / Math.max(deptMaterials.length, 1)) * 100), color: 'bg-emerald-500' },
              { label: 'Under Review', value: `${pending} materials`, pct: Math.round((pending / Math.max(deptMaterials.length, 1)) * 100), color: 'bg-amber-400' },
              { label: 'Rejection Rate', value: `${rejected} materials`, pct: Math.round((rejected / Math.max(deptMaterials.length, 1)) * 100), color: 'bg-rose-500' },
            ].map((item, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between mb-1 text-xs text-slate-700">
                  <span>{item.label}</span><span className="font-bold">{item.value}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className={clsx('h-2 rounded-full', item.color)} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="p-5">
            <p className="text-xs text-slate-500 font-semibold mb-3 uppercase tracking-wider">{deptCode} Faculty</p>
            {facultyMembers.filter(f => f.departmentCode === deptCode).slice(0, 4).map(f => (
              <div key={f.id} className="flex items-center gap-2.5 mb-3">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs font-extrabold flex items-center justify-center flex-shrink-0">
                  {f.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{f.name}</p>
                  <p className="text-[11px] text-slate-400">{f.facultyRole === 'HOD' ? 'HOD' : f.isMentor ? 'Faculty and Mentor' : 'Dept. Faculty'}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-5">
            <p className="text-xs text-slate-500 font-semibold mb-3 uppercase tracking-wider">Recent Activity</p>
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-2 mb-3">
                <div className={clsx('h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                  activity.type === 'submit' ? 'bg-blue-50 text-blue-600' :
                  activity.type === 'approve' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600')}>
                  {activity.type === 'submit' ? <FileText className="h-3 w-3" /> :
                   activity.type === 'approve' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                </div>
                <div>
                  <p className="text-[11px] text-slate-700 font-semibold leading-snug">{activity.text}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Faculty Leave Requests */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Faculty Leave Requests</h3>
            <p className="text-xs text-slate-500">{deptCode} Department Faculty leave applications requiring your approval</p>
          </div>
          <div className="flex items-center gap-2">
            {pendingLeaveCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-50 border border-amber-200 text-amber-700">
                {pendingLeaveCount} Pending
              </span>
            )}
            <a href="/faculty/hod/leave" className="text-xs font-bold text-violet-700 hover:text-violet-900 flex items-center gap-1">
              Apply My Leave <ChevronRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="edusphere-table">
            <thead>
              <tr>
                <th>Faculty Name</th><th>Leave Type</th><th>From</th><th>To</th>
                <th>Days</th><th>Reason</th><th>Document</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myDepartmentFacultyLeaves.map((lr) => (
                <tr key={lr.id}>
                  <td>
                    <p className="text-xs font-bold text-slate-800">{lr.facultyName}</p>
                    <p className="text-[11px] text-slate-400">{lr.departmentCode}</p>
                  </td>
                  <td className="text-xs text-slate-700 font-semibold">{lr.leaveType}</td>
                  <td className="text-xs font-mono text-slate-600">{lr.fromDate}</td>
                  <td className="text-xs font-mono text-slate-600">{lr.toDate}</td>
                  <td className="text-center"><span className="text-xs font-extrabold text-violet-700">{lr.numberOfDays}d</span></td>
                  <td className="max-w-xs">
                    <p className="text-[11px] text-slate-600 truncate" title={lr.reason}>{lr.reason}</p>
                  </td>
                  <td>
                    {lr.supportingDocument
                      ? <span className="px-2 py-0.5 rounded-lg bg-blue-50 border border-blue-200 text-[11px] font-bold text-blue-700">Attached</span>
                      : <span className="text-[11px] text-slate-400">None</span>}
                  </td>
                  <td>{leaveStatusBadge(lr.status)}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setDetailModal(lr)}
                        className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition">
                        View
                      </button>
                      {lr.status === 'Pending' && (
                        <>
                          <button onClick={() => handleApprove(lr.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 transition">
                            Approve
                          </button>
                          <button onClick={() => { setRejectModal({ id: lr.id, name: lr.facultyName }); setRejectReason(''); }}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition">
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {myDepartmentFacultyLeaves.length === 0 && (
                <tr><td colSpan={9} className="text-center text-xs text-slate-400 py-8">No faculty leave requests for CSE department.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Material Verification Summary */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Materials Pending Verification</h3>
            <p className="text-xs text-slate-500">Recently submitted by CSE department faculty</p>
          </div>
          <a href="/faculty/hod/verification" className="text-xs font-bold text-violet-700 hover:text-violet-900 flex items-center gap-1">
            View All <ChevronRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="edusphere-table">
            <thead>
              <tr><th>Material</th><th>Faculty</th><th>Subject</th><th>Submitted</th><th>Status</th></tr>
            </thead>
            <tbody>
              {deptMaterials.filter(m => ['Submitted', 'Under Verification', 'Resubmitted'].includes(m.status)).slice(0, 5).map((mat) => (
                <tr key={mat.id}>
                  <td>
                    <p className="text-xs font-bold text-slate-800 truncate max-w-xs">{mat.title}</p>
                    <p className="text-[11px] text-slate-400">{mat.type}</p>
                  </td>
                  <td className="text-xs text-slate-600">{mat.facultyName}</td>
                  <td><span className="font-mono text-[11px] text-violet-700 font-bold">{mat.subjectCode}</span></td>
                  <td className="text-xs text-slate-500 font-mono">{mat.submittedAt}</td>
                  <td><StatusBadge status={mat.status} /></td>
                </tr>
              ))}
              {deptMaterials.filter(m => ['Submitted', 'Under Verification', 'Resubmitted'].includes(m.status)).length === 0 && (
                <tr><td colSpan={5} className="text-center text-xs text-slate-400 py-6">No materials pending verification.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Schedule */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Student Class Schedule</h3>
              <p className="text-xs text-slate-500">CSE Dept. - All Years (I, II, III, IV) and Sections (A, B)</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
              <select value={scheduleYearFilter} onChange={e => setScheduleYearFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:border-violet-500 focus:outline-none">
                <option value="All">All Years</option>
                {['I Year', 'II Year', 'III Year', 'IV Year'].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <select value={scheduleSectionFilter} onChange={e => setScheduleSectionFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:border-violet-500 focus:outline-none">
                <option value="All">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
              </select>
              <select value={scheduleDayFilter} onChange={e => setScheduleDayFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:border-violet-500 focus:outline-none">
                <option value="All">All Days</option>
                {uniqueDays.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="edusphere-table">
            <thead>
              <tr><th>Year</th><th>Sec</th><th>Day</th><th>Time</th><th>Subject</th><th>Faculty</th><th>Room</th></tr>
            </thead>
            <tbody>
              {filteredStudentSchedule.slice(0, 15).map(s => (
                <tr key={s.id}>
                  <td><span className="text-xs font-bold text-violet-700">{s.year}</span></td>
                  <td><span className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-[11px] font-bold text-indigo-700">Sec {s.section}</span></td>
                  <td className="text-xs text-slate-700 font-semibold">{s.day}</td>
                  <td className="text-[11px] text-slate-500 font-mono whitespace-nowrap">{s.startTime} - {s.endTime}</td>
                  <td>
                    <p className="text-xs font-bold text-slate-800">{s.subjectName}</p>
                    <p className="text-[11px] text-violet-600 font-mono">{s.subjectCode}</p>
                  </td>
                  <td className="text-xs text-slate-600">{s.facultyName}</td>
                  <td className="text-[11px] text-slate-400">{s.room}</td>
                </tr>
              ))}
              {filteredStudentSchedule.length === 0 && (
                <tr><td colSpan={7} className="text-center text-xs text-slate-400 py-6">No schedule entries match the selected filters.</td></tr>
              )}
            </tbody>
          </table>
          {filteredStudentSchedule.length > 15 && (
            <div className="px-6 py-3 border-t border-slate-100 text-xs text-slate-500">
              Showing 15 of {filteredStudentSchedule.length} entries. Use filters to narrow down.
            </div>
          )}
        </div>
      </div>

      {/* Faculty Schedule */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Faculty Teaching Schedule</h3>
              <p className="text-xs text-slate-500">CSE Dept. - Combined timetable of all department faculty</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
              <select value={facultyScheduleFilter} onChange={e => setFacultyScheduleFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:border-violet-500 focus:outline-none">
                <option value="All">All Faculty</option>
                {uniqueFacultyNames.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <select value={facultyScheduleDayFilter} onChange={e => setFacultyScheduleDayFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:border-violet-500 focus:outline-none">
                <option value="All">All Days</option>
                {uniqueDays.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="edusphere-table">
            <thead>
              <tr><th>Faculty</th><th>Day</th><th>Time</th><th>Subject</th><th>Class</th><th>Sec</th><th>Room</th></tr>
            </thead>
            <tbody>
              {filteredFacultySchedule.slice(0, 15).map(s => (
                <tr key={s.id}>
                  <td>
                    <p className="text-xs font-bold text-slate-800">{s.facultyName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{s.facultyEmail}</p>
                  </td>
                  <td className="text-xs text-slate-700 font-semibold">{s.day}</td>
                  <td className="text-[11px] text-slate-500 font-mono whitespace-nowrap">{s.startTime} - {s.endTime}</td>
                  <td>
                    <p className="text-xs font-bold text-slate-800">{s.subjectName}</p>
                    <p className="text-[11px] text-violet-600 font-mono">{s.subjectCode}</p>
                  </td>
                  <td><span className="text-xs font-bold text-violet-700">{s.classYear}</span></td>
                  <td><span className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-[11px] font-bold text-indigo-700">Sec {s.section}</span></td>
                  <td className="text-[11px] text-slate-400">{s.room}</td>
                </tr>
              ))}
              {filteredFacultySchedule.length === 0 && (
                <tr><td colSpan={7} className="text-center text-xs text-slate-400 py-6">No faculty schedule entries match the selected filters.</td></tr>
              )}
            </tbody>
          </table>
          {filteredFacultySchedule.length > 15 && (
            <div className="px-6 py-3 border-t border-slate-100 text-xs text-slate-500">
              Showing 15 of {filteredFacultySchedule.length} entries.
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Exams */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Upcoming Examinations</h3>
          <p className="text-xs text-slate-500">CSE Department - Examination Schedule</p>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myDepartmentExams.slice(0, 6).map(ex => (
            <div key={ex.id} className="p-4 rounded-xl bg-lavender-50/50 border border-lavender-100">
              <p className="text-xs font-bold text-slate-800 truncate">{ex.subject}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{ex.examType} - {ex.date}</p>
              <p className="text-[11px] text-violet-600 font-semibold">{ex.startTime} - {ex.endTime} | {ex.venue}</p>
            </div>
          ))}
          {myDepartmentExams.length === 0 && (
            <p className="text-xs text-slate-400 col-span-3">No upcoming exams scheduled.</p>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Notifications</h3>
            <p className="text-xs text-slate-500">HOD alerts and department updates</p>
          </div>
          <a href="/faculty/hod/notifications" className="text-xs font-bold text-violet-700 hover:text-violet-900 flex items-center gap-1">
            View All <ChevronRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="p-5 space-y-3">
          {notifications.filter(n => n.recipientRole === 'HOD').slice(0, 5).map(n => (
            <div key={n.id} className={clsx('flex items-start gap-3 p-3 rounded-xl', n.isRead ? 'bg-slate-50' : 'bg-violet-50/60 border border-violet-100')}>
              <div className="h-8 w-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center flex-shrink-0">
                <Bell className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800">{n.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">{n.message}</p>
                <p className="text-[10px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </div>
              {!n.isRead && <span className="h-2 w-2 rounded-full bg-violet-500 flex-shrink-0 mt-1.5" />}
            </div>
          ))}
          {notifications.filter(n => n.recipientRole === 'HOD').length === 0 && (
            <p className="text-xs text-slate-400 text-center py-4">No notifications yet.</p>
          )}
        </div>
      </div>

      {/* Reject Modal */}
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

      {/* Detail Modal */}
      {detailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-slate-900">Leave Request Details</h3>
              <button onClick={() => setDetailModal(null)}
                className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition text-xs font-bold">X</button>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Faculty Name', value: detailModal.facultyName },
                { label: 'Department', value: detailModal.departmentName },
                { label: 'Leave Type', value: detailModal.leaveType },
                { label: 'From Date', value: detailModal.fromDate },
                { label: 'To Date', value: detailModal.toDate },
                { label: 'Duration', value: `${detailModal.numberOfDays} day(s)` },
                { label: 'Status', value: detailModal.status },
                { label: 'Submitted', value: detailModal.submittedDate },
                { label: 'Document', value: detailModal.supportingDocument || 'None attached' },
              ].map((row: any) => (
                <div key={row.label} className="flex gap-2 border-b border-slate-50 pb-2">
                  <span className="w-28 font-semibold text-slate-500 flex-shrink-0">{row.label}:</span>
                  <span className="font-bold text-slate-800">{row.value}</span>
                </div>
              ))}
              <div className="pt-2">
                <span className="font-semibold text-slate-500 block mb-1">Reason:</span>
                <p className="text-slate-700 bg-slate-50 rounded-lg px-3 py-2">{detailModal.reason}</p>
              </div>
              {detailModal.rejectionReason && (
                <div className="pt-2">
                  <span className="font-semibold text-rose-500 block mb-1">Rejection Reason:</span>
                  <p className="text-slate-700 bg-rose-50 rounded-lg px-3 py-2">{detailModal.rejectionReason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, string> = {
    'Draft': 'bg-slate-100 text-slate-600 border-slate-200',
    'Submitted': 'bg-blue-50 text-blue-700 border-blue-200',
    'Under Verification': 'bg-amber-50 text-amber-700 border-amber-200',
    'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Rejected': 'bg-rose-50 text-rose-700 border-rose-200',
    'Resubmitted': 'bg-violet-50 text-violet-700 border-violet-200',
  };
  return (
    <span className={clsx('px-2.5 py-0.5 rounded-lg text-[11px] font-bold border', map[status] || 'bg-slate-100 text-slate-600 border-slate-200')}>
      {status}
    </span>
  );
};
