import React from 'react';
import clsx from 'clsx';
import { useAuth } from '../../contexts/AuthContext';
import { getDepartmentAcademicProfile } from '../../data/studentData';

export const StudentAttendancePage: React.FC = () => {
  const { user } = useAuth();
  const subjects = getDepartmentAcademicProfile(user?.email).attendanceList;
  const overall = Math.round(subjects.reduce((sum, s) => sum + s.percentage, 0) / subjects.length);
  return (
    <div className="space-y-6 font-serif">
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-lavender mb-2 inline-block">Attendance Monitor</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Attendance</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Subject-wise attendance, exam clearance eligibility, and overall compliance</p>
          </div>
          <div className={`rounded-xl border px-4 py-2.5 text-right ${overall >= 75 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
            <p className="text-[10px] font-bold uppercase tracking-wider">Exam Eligibility</p>
            <p className="text-sm font-bold">{overall >= 75 ? 'Eligible for Exams ✓' : 'Compulsory Recovery Needed ⚠'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Overall Attendance</p>
          <h3 className="text-3xl font-extrabold text-slate-900 font-mono mt-2">{overall}%</h3>
          <p className="text-xs text-slate-500 mt-2">Across 6 subjects</p>
        </div>
        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Minimum Eligibility</p>
          <h3 className="text-3xl font-extrabold text-emerald-700 font-mono mt-2">75%</h3>
          <p className="text-xs text-emerald-700 font-bold mt-2">Required for exams</p>
        </div>
        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Eligible Subjects</p>
          <h3 className="text-3xl font-extrabold text-slate-900 font-mono mt-2">{subjects.filter((s) => s.percentage >= 75).length}</h3>
          <p className="text-xs text-slate-500 mt-2">of 6 subjects</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-lavender-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-lavender-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Subject-wise Attendance</h3>
          <span className="badge-lavender">6 Subjects</span>
        </div>

        <div className="overflow-x-auto">
          <table className="edusphere-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Classes Conducted</th>
                <th>Classes Attended</th>
                <th>Attendance %</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.code}>
                  <td>
                    <span className="font-mono font-bold text-lavender-800 mr-2">{subject.code}</span>
                    <span className="font-bold text-slate-900">{subject.subject}</span>
                  </td>
                  <td className="font-mono text-slate-700">{subject.total}</td>
                  <td className="font-mono text-slate-700">{subject.attended}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-lavender-100 rounded-full h-2 overflow-hidden">
                        <div className={clsx('h-2 rounded-full', subject.percentage >= 75 ? 'bg-emerald-600' : 'bg-rose-500')} style={{ width: `${subject.percentage}%` }} />
                      </div>
                      <span className="font-mono font-bold text-xs">{subject.percentage}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={subject.percentage >= 75 ? 'badge-emerald' : 'badge-rose'}>{subject.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
