import React from 'react';
import { BarChart3, TrendingUp, Trophy } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { getDepartmentAcademicProfile, getStudentRecord } from '../../data/studentData';

export const StudentPerformancePage: React.FC = () => {
  const { user } = useAuth();
  const student = getStudentRecord(user?.email);
  const academicProfile = getDepartmentAcademicProfile(user?.email);
  const subjects = academicProfile.courseCatalog.map((subject) => ({
    name: subject.subject,
    code: subject.code,
    credits: subject.credits,
    sgpa: Number((subject.progress / 10).toFixed(1)),
    internal: Math.min(30, Math.max(20, Math.round(subject.progress / 3))),
    assignment: Math.min(25, Math.max(18, Math.round(subject.progress / 3.2))),
    exam: Math.min(50, Math.max(35, Math.round(subject.progress / 2.1))),
    grade: subject.grade,
  }));
  const semesterHistory = academicProfile.semesterHistory;
  const chartData = semesterHistory.map((semester) => ({ name: semester.semester.replace('Semester ', 'Sem '), cgpa: semester.cgpa }));
  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
  const cgpa = student.cgpa.toFixed(2);
  const sgpa = student.sgpa.toFixed(2);

  return (
    <div className="space-y-6 font-serif">
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-lavender mb-2 inline-block">Academic Standing</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Academic Performance</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Semester and subject-wise academic performance summary</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-lavender-100 border border-lavender-200 text-lavender-800 px-4 py-2 font-bold">
            <Trophy className="h-4 w-4" />
            CGPA {cgpa}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">CGPA</p>
          <h3 className="text-3xl font-extrabold text-slate-900 font-mono mt-2">{cgpa}</h3>
          <p className="text-xs text-emerald-700 font-bold mt-2 flex items-center gap-1"><TrendingUp className="h-4 w-4" />Upward trend</p>
        </div>
        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">SGPA</p>
          <h3 className="text-3xl font-extrabold text-lavender-800 font-mono mt-2">{sgpa}</h3>
          <p className="text-xs text-slate-500 mt-2">Current semester</p>
        </div>
        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Credits</p>
          <h3 className="text-3xl font-extrabold text-slate-900 font-mono mt-2">{totalCredits}</h3>
          <p className="text-xs text-slate-500 mt-2">Completed this semester</p>
        </div>
        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Standing</p>
          <h3 className="text-lg font-extrabold text-emerald-700 mt-2">Dean's Honor Roll</h3>
          <p className="text-xs text-slate-500 mt-2">Top 5% cohort</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <BarChart3 className="h-4 w-4 text-lavender-700" />
            <h3 className="text-base font-bold text-slate-900">Semester CGPA Performance</h3>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 10]} />
              <Tooltip />
              <Bar dataKey="cgpa" name="CGPA" fill="#7c3aed" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-lavender-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-lavender-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Semester-wise Academic Record</h3>
          <span className="badge-lavender">6 Semesters</span>
        </div>

        <div className="overflow-x-auto">
          <table className="edusphere-table">
            <thead>
              <tr>
                <th>Semester</th>
                <th>SGPA</th>
                <th>CGPA</th>
                <th>Result</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {semesterHistory.map((semester) => (
                <tr key={semester.semester}>
                  <td className="font-bold text-slate-900">{semester.semester}</td>
                  <td className="font-mono text-slate-700">{semester.sgpa.toFixed(1)}</td>
                  <td className="font-mono text-slate-700">{semester.cgpa.toFixed(1)}</td>
                  <td>
                    <span className={semester.result === 'In Progress' ? 'badge-amber' : 'badge-emerald'}>{semester.result}</span>
                  </td>
                  <td>
                    <span className={semester.status === 'Current' ? 'badge-indigo' : 'badge-slate'}>{semester.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-lavender-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-lavender-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Subject-Wise Marks</h3>
          <span className="badge-lavender">6 Subjects</span>
        </div>

        <div className="overflow-x-auto">
          <table className="edusphere-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Credits</th>
                <th>Internal</th>
                <th>Assignment</th>
                <th>Exam</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.code}>
                  <td>
                    <span className="font-mono font-bold text-lavender-800 mr-2">{subject.code}</span>
                    <span className="font-bold text-slate-900">{subject.name}</span>
                  </td>
                  <td className="font-bold text-slate-700">{subject.credits}</td>
                  <td className="font-mono text-slate-700">{subject.internal}/30</td>
                  <td className="font-mono text-slate-700">{subject.assignment}/25</td>
                  <td className="font-mono text-slate-700">{subject.exam}/50</td>
                  <td>
                    <span className="badge-emerald font-mono">{subject.grade}</span>
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
