import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useFaculty } from '../../../contexts/FacultyContext';
import { facultyMembers, subjects } from '../../../data/facultyData';
import { Sparkles, AlertTriangle, BookOpen, CheckCircle2, Clock, XCircle, FileText } from 'lucide-react';
import clsx from 'clsx';

export const HODDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const {
    materials,
    facultyDepartmentCode,
    facultyDepartmentName,
    myDepartmentFacultyLeaves,
    myDepartmentExams,
    updateFacultyLeaveStatus,
  } = useFaculty();

  const [rejectModal, setRejectModal] = useState<{ id: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const facultyDisplayName = profile?.fullName || user?.email || 'Department HOD';
  const deptCode = facultyDepartmentCode;
  const deptName = facultyDepartmentName || 'Computer Science & Engineering';
  const pendingLeaveCount = myDepartmentFacultyLeaves.filter(l => l.status === 'Pending').length;

  const deptMaterials = materials.filter(m => m.departmentCode === deptCode);
  const totalMaterials = deptMaterials.length;
  const approvedMaterials = deptMaterials.filter(m => m.status === 'Approved').length;
  const pendingMaterials = deptMaterials.filter(m => ['Submitted', 'Under Verification', 'Resubmitted'].includes(m.status)).length;
  const rejectedMaterials = deptMaterials.filter(m => m.status === 'Rejected').length;

  const typeBreakdown = (() => {
    const counts: Record<string, number> = {};
    deptMaterials.forEach(m => {
      counts[m.type] = (counts[m.type] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  })();

  const maxTypeCount = Math.max(...typeBreakdown.map(([, count]) => count), 1);

  const facultyContribution = Array.from(
    new Map(
      facultyMembers
        .filter(f => f.departmentCode === deptCode && f.facultyRole !== 'HOD')
        .map(f => [f.email || f.name, f])
    ).values()
  )
    .map(f => {
      const fMats = deptMaterials.filter(m => m.facultyId === f.id || m.facultyName === f.name);
      const displayName = f.name === 'Mr. Arun Kumar' && deptCode === 'CSE' ? 'Dr. Priya Kumar' : f.name;
      return {
        name: displayName,
        total: fMats.length,
        approved: fMats.filter(m => m.status === 'Approved').length,
      };
    })
    .sort((a, b) => b.total - a.total);

  const deptSubjects = subjects.filter(s => s.departmentCode === deptCode);
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
    Notes: 'bg-blue-500',
    PDF: 'bg-red-500',
    PPT: 'bg-orange-500',
    'Question Bank': 'bg-purple-500',
    'Previous Year QP': 'bg-amber-500',
    Assignment: 'bg-teal-500',
    'Lab Material': 'bg-green-500',
    'Reference Material': 'bg-slate-500',
  };

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

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-xs font-bold text-violet-700 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>HOD Leave Review - {deptName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome, {facultyDisplayName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Assigned faculty leave requests for <strong className="text-slate-800">{deptName} ({deptCode})</strong>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              {pendingLeaveCount} pending leave request{pendingLeaveCount === 1 ? '' : 's'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Materials', value: totalMaterials, icon: FileText, color: 'bg-blue-50 text-blue-700 border-blue-200' },
          { label: 'Approved', value: approvedMaterials, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
          { label: 'Pending Review', value: pendingMaterials, icon: Clock, color: 'bg-amber-50 text-amber-700 border-amber-200' },
          { label: 'Rejected', value: rejectedMaterials, icon: XCircle, color: 'bg-rose-50 text-rose-700 border-rose-200' },
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className={`bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-3 ${metric.color}`}>
              <div className="h-10 w-10 rounded-xl bg-white/70 flex items-center justify-center flex-shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">{metric.value}</p>
                <p className="text-xs text-slate-500 font-semibold">{metric.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
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
                  <span className="w-8 text-xs font-bold text-slate-500 flex-shrink-0">{Math.round((count / totalMaterials) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>

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
                  {subjectCoverage.map(subject => (
                    <tr key={subject.code}>
                      <td><span className="font-mono font-bold text-violet-700 text-xs">{subject.code}</span></td>
                      <td className="text-xs text-slate-700 max-w-[180px] truncate">{subject.name}</td>
                      <td className="text-center font-bold text-slate-800">{subject.materialsCount}</td>
                      <td className="text-center">
                        <span className="text-emerald-700 font-bold">{subject.approvedCount}</span>
                        <span className="text-slate-400">/{subject.materialsCount}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-violet-500"
                              style={{ width: `${subject.materialsCount > 0 ? (subject.approvedCount / subject.materialsCount) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-slate-500">
                            {subject.materialsCount > 0 ? Math.round((subject.approvedCount / subject.materialsCount) * 100) : 0}%
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

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Faculty Contribution</h3>
            <div className="space-y-4">
              {facultyContribution.map(faculty => (
                <div key={faculty.name} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {faculty.name.split(' ').map(part => part[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-0.5">
                      <span className="text-xs font-bold text-slate-800 truncate">{faculty.name}</span>
                      <span className="text-xs text-emerald-600 font-bold">{faculty.approved}/{faculty.total}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-violet-500" style={{ width: `${faculty.total > 0 ? (faculty.approved / Math.max(faculty.total, 1)) * 100 : 0}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Upcoming Exams</h3>
            <div className="space-y-3">
              {myDepartmentExams.slice(0, 4).map(exam => (
                <div key={exam.id} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-4 w-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 truncate">{exam.subject}</p>
                    <p className="text-[11px] text-slate-400">{exam.examType} • {exam.date}</p>
                  </div>
                </div>
              ))}
              {myDepartmentExams.length === 0 && (
                <p className="text-xs text-slate-400">No upcoming exams scheduled for {deptCode}.</p>
              )}
            </div>
          </div>
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
