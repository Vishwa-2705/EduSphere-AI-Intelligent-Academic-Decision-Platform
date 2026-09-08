import React, { useState } from 'react';
import { facultyMembers, subjects } from '../../../data/facultyData';
import { useFaculty } from '../../../contexts/FacultyContext';
import { Search, Mail, Phone, BookOpen, CheckCircle2, Clock, Users } from 'lucide-react';
import clsx from 'clsx';

export const HODDepartmentFacultyPage: React.FC = () => {
  const { materials, facultyDepartmentCode, facultyDepartmentName } = useFaculty();
  const [search, setSearch] = useState('');

  // Department faculty excluding HOD
  const deptFaculty = facultyMembers.filter(
    f => f.departmentCode === facultyDepartmentCode && f.facultyRole !== 'HOD'
  );

  const filtered = deptFaculty.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.designation.toLowerCase().includes(search.toLowerCase()) ||
    f.email.toLowerCase().includes(search.toLowerCase())
  );

  const getFacultySubjectNames = (faculty: typeof facultyMembers[0]) =>
    subjects.filter(s => s.departmentCode === faculty.departmentCode).map(s => s.name);

  const getFacultyMaterialStats = (facultyId: string) => {
    const fMats = materials.filter(m => m.facultyId === facultyId || m.departmentCode === facultyDepartmentCode);
    return {
      total: fMats.length,
      approved: fMats.filter(m => m.status === 'Approved').length,
      pending: fMats.filter(m => ['Submitted', 'Under Verification', 'Resubmitted'].includes(m.status)).length,
      rejected: fMats.filter(m => m.status === 'Rejected').length,
    };
  };

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Department Faculty</h1>
            <p className="text-sm text-slate-500 mt-1">{facultyDepartmentName} – All Faculty Members</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-50 border border-violet-200 text-violet-800 text-xs font-bold">
              <Users className="h-4 w-4" />
              {deptFaculty.length} Faculty Members
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, designation, or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
        </div>
      </div>

      {/* Faculty Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filtered.map(faculty => {
          const stats = getFacultyMaterialStats(faculty.id);
          const subjectNames = getFacultySubjectNames(faculty);
          const roles = faculty.subRoles || (faculty.isMentor ? ['FACULTY', 'MENTOR'] : ['FACULTY']);
          return (
            <div key={faculty.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 hover:shadow-md transition">
              {/* Faculty Header */}
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xl font-extrabold flex-shrink-0 shadow-md">
                  {faculty.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-extrabold text-slate-900">{faculty.name}</h3>
                  <p className="text-xs text-violet-700 font-semibold">{faculty.designation}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{faculty.qualification || 'Ph.D / M.Tech'} • {faculty.experience || '8+ Years'} experience</p>
                </div>
                <div className="flex flex-col gap-1">
                  {roles.map(r => (
                    <span key={r} className={clsx(
                      'px-2 py-0.5 rounded-full text-[10px] font-bold border',
                      r === 'MENTOR' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-violet-50 text-violet-700 border-violet-200'
                    )}>
                      {r === 'FACULTY' ? 'Dept. Faculty' : r}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-4 flex flex-col gap-1.5 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                  <span>{faculty.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                  <span>{faculty.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                  <span className="font-medium text-slate-700">Cabin: {faculty.cabin}</span>
                </div>
              </div>

              {/* Subjects */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-2">Assigned Subjects</p>
                <div className="flex flex-wrap gap-1.5">
                  {subjectNames.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-lavender-50 border border-lavender-200 text-[11px] font-semibold text-slate-700">{s}</span>
                  ))}
                </div>
              </div>

              {/* Material Stats */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-4 gap-3">
                {[
                  { label: 'Total', value: stats.total, color: 'text-slate-800' },
                  { label: 'Approved', value: stats.approved, color: 'text-emerald-600' },
                  { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
                  { label: 'Rejected', value: stats.rejected, color: 'text-rose-600' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p className={clsx('text-lg font-extrabold', s.color)}>{s.value}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
