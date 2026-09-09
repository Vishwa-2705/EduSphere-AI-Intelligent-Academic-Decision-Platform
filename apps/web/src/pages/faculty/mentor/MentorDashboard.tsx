import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useFaculty } from '../../../contexts/FacultyContext';
import { mentorStudents, examSchedule } from '../../../data/facultyData';
import {
  Users, CalendarCheck, FileSpreadsheet, AlertTriangle, CheckCircle2,
  TrendingUp, Award, Bell, ChevronRight, Clock, MapPin, Send, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

export const MentorDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const { leaveRequests, sendExamReminder, examSchedule: exams, facultyDepartmentName } = useFaculty();

  const facultyDisplayName = profile?.fullName || user?.email || 'Faculty Mentor';
  const departmentLabel = facultyDepartmentName || 'Department of Information Technology';
  const myStudents = mentorStudents; // assigned students for this mentor
  const pendingLeaves = leaveRequests.filter(lr => lr.status === 'Pending');
  const atRiskCount = myStudents.filter(s => s.academicStatus === 'At Risk' || s.attendance < 75).length;
  const avgAttendance = Math.round(myStudents.reduce((acc, s) => acc + s.attendance, 0) / myStudents.length);
  const avgCgpa = (myStudents.reduce((acc, s) => acc + s.cgpa, 0) / myStudents.length).toFixed(1);

  const quickActions = [
    { label: 'View My Students', icon: Users, color: 'bg-indigo-600 hover:bg-indigo-700', href: '/faculty/mentor/students' },
    { label: 'Pending Leaves', icon: FileSpreadsheet, color: 'bg-amber-600 hover:bg-amber-700', href: '/faculty/mentor/leave' },
    { label: 'Send Exam Reminder', icon: Award, color: 'bg-violet-600 hover:bg-violet-700', href: '/faculty/mentor/exams' },
    { label: 'Student Performance', icon: TrendingUp, color: 'bg-emerald-600 hover:bg-emerald-700', href: '/faculty/mentor/students' },
  ];

  return (
    <div className="space-y-6 font-serif">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Mentor Advisory Desk • {departmentLabel}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome, {facultyDisplayName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Designated Mentor for <strong className="text-slate-800">B.Tech {departmentLabel.replace('Department of ', '')} (Batch 2022–2026, Semester V, Sec A & B)</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {pendingLeaves.length > 0 && (
              <Link
                to="/faculty/mentor/leave"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-100 transition"
              >
                <FileSpreadsheet className="h-4 w-4 text-amber-600" />
                <span>{pendingLeaves.length} Student Leave{pendingLeaves.length > 1 ? 's' : ''} Pending</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Assigned Mentees', value: myStudents.length, sub: 'B.Tech IT Cohort', icon: Users, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
          { label: 'Pending Leaves', value: pendingLeaves.length, sub: 'Requires Review', icon: FileSpreadsheet, color: 'bg-amber-50 text-amber-700 border-amber-200' },
          { label: 'Cohort Avg Attendance', value: `${avgAttendance}%`, sub: 'Target: ≥80%', icon: CalendarCheck, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
          { label: 'Average CGPA', value: avgCgpa, sub: 'Out of 10.0', icon: Award, color: 'bg-violet-50 text-violet-700 border-violet-200' },
        ].map((m, i) => {
          const Icon = m.icon;
          const [bg, text, border] = m.color.split(' ');
          return (
            <div key={i} className={`bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-3.5 ${border}`}>
              <div className={`h-11 w-11 rounded-xl ${bg} ${text} flex items-center justify-center flex-shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 leading-tight">{m.value}</p>
                <p className="text-xs font-bold text-slate-700">{m.label}</p>
                <p className="text-[10px] text-slate-400">{m.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left 8 Cols: Assigned Students Quick List + Pending Leaves */}
        <div className="lg:col-span-8 space-y-6">
          {/* Assigned Students Summary */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">My Assigned Students</h2>
                <p className="text-xs text-slate-500">Mentees under your direct academic mentorship</p>
              </div>
              <Link
                to="/faculty/mentor/students"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                View Full Roster <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="edusphere-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Reg No</th>
                    <th>Section</th>
                    <th>Attendance</th>
                    <th>CGPA</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {myStudents.map(student => (
                    <tr key={student.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-700 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{student.name}</p>
                            <p className="text-[10px] text-slate-400">{student.year}</p>
                          </div>
                        </div>
                      </td>
                      <td className="font-mono text-xs font-bold text-slate-700">{student.regNo}</td>
                      <td className="text-xs text-slate-600">Sec {student.section}</td>
                      <td>
                        <span className={clsx(
                          'font-bold text-xs px-2 py-0.5 rounded-md',
                          student.attendance < 75 ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          student.attendance < 85 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        )}>
                          {student.attendance}%
                        </span>
                      </td>
                      <td className="font-mono text-xs font-bold text-slate-800">{student.cgpa}</td>
                      <td>
                        <span className={clsx(
                          'px-2 py-0.5 rounded-lg text-[10px] font-bold border',
                          student.academicStatus === 'Excellent' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          student.academicStatus === 'Good' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                          student.academicStatus === 'Average' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          'bg-rose-50 text-rose-800 border-rose-200'
                        )}>
                          {student.academicStatus}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/faculty/mentor/students/${student.id}`}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          Profile <ChevronRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Leave Requests */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Student Leave Requests</h2>
                <p className="text-xs text-slate-500">Requires mentor verification and formal approval</p>
              </div>
              <Link
                to="/faculty/mentor/leave"
                className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
              >
                Review All <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="p-6 divide-y divide-slate-100">
              {pendingLeaves.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No pending leave requests at this time.</p>
              ) : (
                pendingLeaves.map(lr => (
                  <div key={lr.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{lr.studentName}</span>
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">{lr.regNo}</span>
                        <span className="badge-amber text-[10px]">{lr.leaveType}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{lr.reason}</p>
                      <div className="mt-1 flex items-center gap-4 text-[11px] text-slate-400">
                        <span>Period: <strong className="text-slate-700">{lr.fromDate} to {lr.toDate}</strong> ({lr.numberOfDays} days)</span>
                        <span>Submitted: {lr.submittedAt}</span>
                      </div>
                    </div>

                    <Link
                      to="/faculty/mentor/leave"
                      className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-100 transition whitespace-nowrap text-center"
                    >
                      Process Request →
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Quick Actions & Upcoming Examination Reminders */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Mentor Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((act, i) => {
                const Icon = act.icon;
                return (
                  <Link
                    key={i}
                    to={act.href}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl ${act.color} text-white text-xs font-bold transition shadow-sm`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-center leading-tight">{act.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Upcoming Examination Reminder Module */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Exam Reminder System</h3>
                <p className="text-xs text-slate-500">Notify assigned cohort of upcoming evaluations</p>
              </div>
              <span className="badge-purple text-[10px]">Active Schedule</span>
            </div>

            <div className="p-5 space-y-4">
              {exams.slice(0, 3).map(exam => (
                <div key={exam.id} className="p-3.5 rounded-xl bg-lavender-50/50 border border-lavender-200/80 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{exam.subject}</h4>
                    <span className="badge-indigo text-[10px] whitespace-nowrap">{exam.examType}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 space-y-0.5">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Clock className="h-3 w-3 text-violet-600" />
                      <span>{exam.date} • {exam.startTime} – {exam.endTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-violet-600" />
                      <span>{exam.venue}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    {exam.reminderSent ? (
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Reminder Sent to Students
                      </span>
                    ) : (
                      <button
                        onClick={() => sendExamReminder(exam.id)}
                        className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Send className="h-3 w-3" /> Send Reminder to Mentees
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <Link
                to="/faculty/mentor/exams"
                className="block text-center text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-1"
              >
                View Full Exam Schedule & Announce →
              </Link>
            </div>
          </div>

          {/* Academic Alerts */}
          {atRiskCount > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                <span>Attendance / Academic Risk Flag</span>
              </div>
              <p className="text-xs text-rose-700 leading-relaxed">
                {atRiskCount} student{atRiskCount > 1 ? 's' : ''} in your mentorship group fall below the 75% attendance threshold or maintain sub-optimal CGPA. Early counseling is advised.
              </p>
              <Link
                to="/faculty/mentor/students"
                className="inline-block text-xs font-extrabold text-rose-900 underline mt-1"
              >
                Review Student Roster →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
