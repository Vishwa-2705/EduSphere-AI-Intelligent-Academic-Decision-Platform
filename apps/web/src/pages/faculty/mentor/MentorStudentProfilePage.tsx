import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mentorStudents, examSchedule } from '../../../data/facultyData';
import { useFaculty } from '../../../contexts/FacultyContext';
import {
  User, ArrowLeft, Award, CalendarCheck, BookOpen, AlertTriangle,
  FileSpreadsheet, CheckCircle2, XCircle, Clock, Phone, Mail, MapPin,
  ShieldCheck, Sparkles
} from 'lucide-react';
import clsx from 'clsx';

export const MentorStudentProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { leaveRequests } = useFaculty();

  // Find student or fallback to first
  const student = mentorStudents.find(s => s.id === id) || mentorStudents[0];
  const studentLeaves = leaveRequests.filter(lr => lr.studentId === student.id);

  return (
    <div className="space-y-6 font-serif">
      {/* Top Bar Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/faculty/mentor/students"
          className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to My Students Roster</span>
        </Link>
        <span className="text-xs text-slate-400">
          Student ID: <strong className="text-slate-600 font-mono">{student.id}</strong>
        </span>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-extrabold text-2xl flex items-center justify-center flex-shrink-0 shadow-md">
              {student.name.split(' ').map(n => n[0]).join('')}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-extrabold text-slate-900 leading-none">
                  {student.name}
                </h1>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {student.regNo}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {student.departmentName || student.departmentCode} • {student.year} (Semester {student.semester}, Section {student.section})
              </p>
              <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-slate-400" />{student.email}</span>
                <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-slate-400" />{student.parentPhone || student.phone || '+91 98765 43210'}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-slate-400" />{student.address}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-end justify-between gap-2 border-t md:border-t-0 pt-4 md:pt-0">
            <span className={clsx(
              'px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border',
              student.academicStatus === 'Excellent' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
              student.academicStatus === 'Good' ? 'bg-blue-50 text-blue-800 border-blue-200' :
              student.academicStatus === 'Average' ? 'bg-amber-50 text-amber-800 border-amber-200' :
              'bg-rose-50 text-rose-800 border-rose-200'
            )}>
              {student.academicStatus}
            </span>
            <p className="text-[11px] text-slate-400">Status: {student.studentType}</p>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-[11px] text-slate-400 font-bold uppercase">Overall Attendance</p>
            <p className={clsx('text-xl font-extrabold mt-0.5', student.attendance < 75 ? 'text-rose-600' : 'text-emerald-600')}>
              {student.attendance}%
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-[11px] text-slate-400 font-bold uppercase">Current CGPA</p>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5 font-mono">
              {student.cgpa} <span className="text-xs text-slate-400 font-normal">/ 10.0</span>
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-[11px] text-slate-400 font-bold uppercase">Active Leaves</p>
            <p className="text-xl font-extrabold text-amber-600 mt-0.5 font-mono">
              {studentLeaves.filter(l => l.status === 'Pending').length} Pending
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-[11px] text-slate-400 font-bold uppercase">Assignments</p>
            <p className="text-xl font-extrabold text-indigo-700 mt-0.5 font-mono">
              {student.assignments.filter(a => a.submitted).length} / {student.assignments.length} Done
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Academic Information & Mentor Info */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left 8 Cols: Academic Details & Subject Marks */}
        <div className="lg:col-span-8 space-y-6">
          {/* Subject-Wise Internal Assessment Marks */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Subject-wise Academic Performance</h3>
                <p className="text-xs text-slate-500">Internal assessment marks and evaluation scores</p>
              </div>
              <span className="badge-indigo">Semester V</span>
            </div>

            <div className="p-6 space-y-4">
              {student.subjectMarks.map((sm, idx) => {
                const percentage = Math.round((sm.internal / sm.maxInternal) * 100);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-800">
                      <span>{sm.subject}</span>
                      <span className="font-mono text-slate-600">
                        {sm.internal} / {sm.maxInternal} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={clsx(
                          'h-2 rounded-full transition-all',
                          percentage >= 80 ? 'bg-emerald-500' :
                          percentage >= 60 ? 'bg-indigo-500' :
                          percentage >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assignment Status Tracker */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Course Assignment Submissions</h3>
              <p className="text-xs text-slate-500">Continuous assessment milestones</p>
            </div>

            <div className="divide-y divide-slate-100 p-2">
              {student.assignments.map((asgn, i) => (
                <div key={i} className="flex items-center justify-between p-3 text-xs">
                  <span className="font-bold text-slate-800">{asgn.name}</span>
                  {asgn.submitted ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Submitted
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-rose-700 font-bold bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-lg">
                      <XCircle className="h-3.5 w-3.5" /> Pending Submission
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Mentorship Activity Feed */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Recent Student Activity & History</h3>
              <p className="text-xs text-slate-500">Leave applications, examination logs, and academic triggers</p>
            </div>

            <div className="p-6 space-y-4">
              {studentLeaves.length === 0 ? (
                <p className="text-xs text-slate-400">No recent activity logged for this student.</p>
              ) : (
                studentLeaves.map(l => (
                  <div key={l.id} className="flex items-start gap-3 text-xs">
                    <div className="h-8 w-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FileSpreadsheet className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-900">{l.leaveType} Request ({l.numberOfDays} days)</p>
                        <span className={clsx(
                          'px-2 py-0.5 rounded-md text-[10px] font-bold border',
                          l.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          l.status === 'Pending' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          'bg-rose-50 text-rose-800 border-rose-200'
                        )}>
                          {l.status}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{l.reason}</p>
                      <p className="text-[11px] text-slate-400 mt-1">Submitted on {l.submittedAt} • Dates: {l.fromDate} to {l.toDate}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Mentor Information & Guardian Details */}
        <div className="lg:col-span-4 space-y-6">
          {/* Assigned Mentor Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <ShieldCheck className="h-5 w-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Assigned Faculty Mentor</h3>
            </div>

            <div className="text-xs space-y-2 text-slate-600">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Mentor Name</p>
                <p className="font-bold text-slate-900 text-sm">Dr. Priya Kumar</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Designation & Department</p>
                <p className="font-semibold text-slate-800">Professor & HOD, Information Technology</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Contact Channels</p>
                <p className="font-medium text-slate-700">faculty@edusphere.ai • +91 98400 11234</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Mentorship Inception</p>
                <p className="font-medium text-slate-700">August 01, 2022 (Batch 2022–2026)</p>
              </div>
            </div>
          </div>

          {/* Parent / Guardian Information */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Guardian & Contact Details
            </h3>
            <div className="text-xs space-y-2">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Parent / Guardian Name</p>
                <p className="font-bold text-slate-900">{student.parentName}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Emergency Phone</p>
                <p className="font-bold text-indigo-600 font-mono">{student.parentPhone}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Permanent Address</p>
                <p className="text-slate-600 leading-snug">{student.address}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Mentor Actions</h3>
            <Link
              to="/faculty/mentor/leave"
              className="w-full py-2 rounded-xl bg-amber-50 text-amber-800 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-amber-100 transition"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" /> Check Leave Requests
            </Link>
            <Link
              to="/faculty/mentor/exams"
              className="w-full py-2 rounded-xl bg-indigo-50 text-indigo-800 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-indigo-100 transition"
            >
              <Award className="h-3.5 w-3.5" /> Send Exam Notice
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
