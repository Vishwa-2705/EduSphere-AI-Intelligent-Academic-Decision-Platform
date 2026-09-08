import React, { useState } from 'react';
import { mentorStudents, examSchedule } from '../../../data/facultyData';
import { useFaculty } from '../../../contexts/FacultyContext';
import { Search, Users, User, ArrowRight, BookOpen, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

export const MentorStudentsPage: React.FC = () => {
  const { leaveRequests } = useFaculty();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sectionFilter, setSectionFilter] = useState('All');

  const filteredStudents = mentorStudents.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.regNo.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || s.academicStatus === statusFilter;
    const matchSection = sectionFilter === 'All' || s.section === sectionFilter;
    return matchSearch && matchStatus && matchSection;
  });

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 mb-2">
              <Users className="h-3.5 w-3.5" />
              <span>Assigned Mentorship Group • Information Technology</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Students
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              You are assigned to mentor <strong className="text-slate-800">{mentorStudents.length} undergraduate students</strong> in III Year B.Tech IT.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="badge-indigo">{mentorStudents.length} Assigned Mentees</span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name or register number..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <select
          value={sectionFilter}
          onChange={e => setSectionFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none"
        >
          <option value="All">All Sections</option>
          <option value="A">Section A</option>
          <option value="B">Section B</option>
        </select>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none"
        >
          <option value="All">All Academic Statuses</option>
          <option value="Excellent">Excellent</option>
          <option value="Good">Good</option>
          <option value="Average">Average</option>
          <option value="At Risk">At Risk</option>
        </select>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStudents.map(student => {
          const studentPendingLeaves = leaveRequests.filter(
            lr => lr.studentId === student.id && lr.status === 'Pending'
          ).length;

          return (
            <div
              key={student.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 hover:shadow-md hover:border-indigo-300 transition flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-indigo-50 text-indigo-700 font-extrabold text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-tight">
                        {student.name}
                      </h3>
                      <p className="font-mono text-xs text-indigo-700 font-bold mt-0.5">
                        {student.regNo}
                      </p>
                    </div>
                  </div>

                  <span className={clsx(
                    'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border',
                    student.academicStatus === 'Excellent' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                    student.academicStatus === 'Good' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                    student.academicStatus === 'Average' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                    'bg-rose-50 text-rose-800 border-rose-200'
                  )}>
                    {student.academicStatus}
                  </span>
                </div>

                {/* Details Table */}
                <div className="space-y-2 py-3 border-y border-slate-100 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Class / Cohort:</span>
                    <span className="font-semibold text-slate-700">{student.year} • Sec {student.section}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Department:</span>
                    <span className="font-semibold text-slate-700">{student.departmentName || student.departmentCode}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Attendance:</span>
                    <span className={clsx(
                      'font-bold px-2 py-0.5 rounded-md text-xs',
                      student.attendance < 75 ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      student.attendance < 85 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    )}>
                      {student.attendance}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current CGPA:</span>
                    <span className="font-bold text-slate-800 font-mono">{student.cgpa} / 10.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pending Leaves:</span>
                    <span className={studentPendingLeaves > 0 ? 'font-bold text-amber-600' : 'text-slate-500'}>
                      {studentPendingLeaves > 0 ? `${studentPendingLeaves} Request Pending` : 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Next Examination:</span>
                    <span className="font-medium text-slate-700 truncate max-w-[150px] text-right">
                      {examSchedule[0]?.subject || 'DBMS Internal'}
                    </span>
                  </div>
                </div>
              </div>

              {/* View Profile Action Button */}
              <div className="mt-4 pt-2">
                <Link
                  to={`/faculty/mentor/students/${student.id}`}
                  className="w-full py-2.5 rounded-xl bg-lavender-100 hover:bg-lavender-200/90 text-lavender-900 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-lavender-200"
                >
                  <User className="h-3.5 w-3.5 text-lavender-700" />
                  <span>View Full Profile</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
