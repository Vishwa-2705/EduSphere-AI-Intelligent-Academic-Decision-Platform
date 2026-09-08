import React from 'react';
import { useFaculty } from '../../../contexts/FacultyContext';
import { examSchedule, facultyMembers, subjects } from '../../../data/facultyData';
import { BarChart3, TrendingUp, Users, BookOpen, CheckCircle2, Clock, XCircle, FileText } from 'lucide-react';
import clsx from 'clsx';

export const HODReportsPage: React.FC = () => {
  const { materials, facultyDepartmentCode, facultyDepartmentName, myDepartmentExams } = useFaculty();

  const deptMaterials = materials.filter(m => m.departmentCode === facultyDepartmentCode);
  const totalMaterials = deptMaterials.length;
  const approved = deptMaterials.filter(m => m.status === 'Approved').length;
  const pending = deptMaterials.filter(m => ['Submitted', 'Under Verification', 'Resubmitted'].includes(m.status)).length;
  const rejected = deptMaterials.filter(m => m.status === 'Rejected').length;

  // Material by type breakdown
  const typeBreakdown = (() => {
    const counts: Record<string, number> = {};
    deptMaterials.forEach(m => {
      counts[m.type] = (counts[m.type] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  })();

  const maxTypeCount = Math.max(...typeBreakdown.map(([, c]) => c), 1);

  // Faculty contribution
  const facultyContribution = facultyMembers
    .filter(f => f.departmentCode === facultyDepartmentCode)
    .map(f => {
      const fMats = deptMaterials.filter(m => m.facultyId === f.id || m.facultyName === f.name);
      return {
        name: f.name,
        total: fMats.length,
        approved: fMats.filter(m => m.status === 'Approved').length,
      };
    }).sort((a, b) => b.total - a.total);

  // Subject coverage
  const deptSubjects = subjects.filter(s => s.departmentCode === facultyDepartmentCode);
  const subjectCoverage = deptSubjects.map(s => {
    const sMats = deptMaterials.filter(m => m.subjectCode === s.code);
    return {
      code: s.code,
      name: s.name,
      materialsCount: sMats.length,
      approvedCount: sMats.filter(m => m.status === 'Approved').length,
    };
  });

  const typeColors: Record<string, string> = {
    'Notes': 'bg-blue-500',
    'PDF': 'bg-red-500',
    'PPT': 'bg-orange-500',
    'Question Bank': 'bg-purple-500',
    'Previous Year QP': 'bg-amber-500',
    'Assignment': 'bg-teal-500',
    'Lab Material': 'bg-green-500',
    'Reference Material': 'bg-slate-500',
  };

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-50 flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Department Reports</h1>
            <p className="text-sm text-slate-500">{facultyDepartmentName} – Academic Year 2025–2026, Semester VI</p>
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Materials', value: totalMaterials, icon: FileText, color: 'bg-blue-50 text-blue-700 border-blue-200' },
          { label: 'Approved', value: approved, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
          { label: 'Pending Review', value: pending, icon: Clock, color: 'bg-amber-50 text-amber-700 border-amber-200' },
          { label: 'Rejected', value: rejected, icon: XCircle, color: 'bg-rose-50 text-rose-700 border-rose-200' },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className={`bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-3 ${m.color.split(' ')[2]}`}>
              <div className={`h-10 w-10 rounded-xl ${m.color.split(' ').slice(0, 2).join(' ')} flex items-center justify-center flex-shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">{m.value}</p>
                <p className="text-xs text-slate-500 font-semibold">{m.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Material Type Distribution */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-900 mb-5">Material Type Distribution</h3>
            <div className="space-y-3">
              {typeBreakdown.map(([type, count]) => (
                <div key={type} className="flex items-center gap-4">
                  <span className="w-32 text-xs font-semibold text-slate-600 flex-shrink-0">{type}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                    <div
                      className={clsx('h-6 rounded-full flex items-center px-2.5 text-white text-[11px] font-bold transition-all', typeColors[type] || 'bg-violet-500')}
                      style={{ width: `${Math.max((count / maxTypeCount) * 100, 8)}%` }}
                    >
                      {count}
                    </div>
                  </div>
                  <span className="w-6 text-xs font-bold text-slate-500 flex-shrink-0">{Math.round((count / totalMaterials) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subject-wise Coverage */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Subject-wise Material Coverage</h3>
              <p className="text-xs text-slate-500">Number of materials uploaded and approved per subject</p>
            </div>
            <div className="overflow-x-auto">
              <table className="edusphere-table">
                <thead>
                  <tr>
                    <th>Subject Code</th>
                    <th>Subject Name</th>
                    <th>Total Materials</th>
                    <th>Approved</th>
                    <th>Coverage</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectCoverage.map(s => (
                    <tr key={s.code}>
                      <td><span className="font-mono font-bold text-violet-700 text-xs">{s.code}</span></td>
                      <td className="text-xs text-slate-700 max-w-[180px] truncate">{s.name}</td>
                      <td className="text-center font-bold text-slate-800">{s.materialsCount}</td>
                      <td className="text-center">
                        <span className="text-emerald-700 font-bold">{s.approvedCount}</span>
                        <span className="text-slate-400">/{s.materialsCount}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-violet-500"
                              style={{ width: `${s.materialsCount > 0 ? (s.approvedCount / s.materialsCount) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-slate-500">
                            {s.materialsCount > 0 ? Math.round((s.approvedCount / s.materialsCount) * 100) : 0}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Faculty Contribution */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Faculty Contribution</h3>
            <div className="space-y-4">
              {facultyContribution.map((f, i) => (
                <div key={f.name} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {f.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-0.5">
                      <span className="text-xs font-bold text-slate-800 truncate">{f.name.split(' ')[0]} {f.name.split(' ').slice(-1)}</span>
                      <span className="text-xs text-emerald-600 font-bold">{f.approved}/{f.total}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-violet-500" style={{ width: `${f.total > 0 ? (f.approved / Math.max(f.total, 1)) * 100 : 0}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Exam Summary */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Upcoming Exams</h3>
            <div className="space-y-3">
              {myDepartmentExams.slice(0, 4).map((ex) => (
                <div key={ex.id} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-4 w-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 truncate">{ex.subject}</p>
                    <p className="text-[11px] text-slate-400">{ex.examType} • {ex.date}</p>
                  </div>
                </div>
              ))}
              {myDepartmentExams.length === 0 && (
                <p className="text-xs text-slate-400">No upcoming exams scheduled for {facultyDepartmentCode}.</p>
              )}
            </div>
          </div>

          {/* Students Summary */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Student Snapshot</h3>
            <div className="space-y-3 text-xs">
              {[
                { label: 'Total Students', value: '118', color: 'bg-indigo-500' },
                { label: 'Section A', value: '60', color: 'bg-violet-500' },
                { label: 'Section B', value: '58', color: 'bg-purple-500' },
                { label: 'Average Attendance', value: '84%', color: 'bg-emerald-500' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
                    <span className="text-slate-600">{s.label}</span>
                  </div>
                  <span className="font-bold text-slate-800">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
