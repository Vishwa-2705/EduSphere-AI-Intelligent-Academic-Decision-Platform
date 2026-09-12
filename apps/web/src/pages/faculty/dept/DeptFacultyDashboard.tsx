import React from 'react';
import { useFaculty } from '../../../contexts/FacultyContext';
import { useAuth } from '../../../contexts/AuthContext';
import { subjects } from '../../../data/facultyData';
import {
  BookOpen, FileText, CheckCircle2, Clock, XCircle, Upload, TrendingUp,
  ChevronRight, Sparkles, AlertCircle,
} from 'lucide-react';
import { StatusBadge } from '../hod/HODDashboard';
import clsx from 'clsx';

export const DeptFacultyDashboard: React.FC = () => {
  const { materials, notifications, facultyDepartmentCode, facultyDepartmentName } = useFaculty();
  const { user, profile } = useAuth();

  const facultyDisplayName = profile?.firstName
    ? `${profile.firstName} ${profile.lastName}`
    : user?.email || 'Faculty Member';

  // Materials of the faculty's department
  const myMaterials = materials.filter(
    m => m.departmentCode === facultyDepartmentCode || m.facultyId === user?.email
  );
  const approved = myMaterials.filter(m => m.status === 'Approved').length;
  const pending = myMaterials.filter(m => ['Submitted', 'Under Verification', 'Resubmitted'].includes(m.status)).length;
  const rejected = myMaterials.filter(m => m.status === 'Rejected').length;
  const draft = myMaterials.filter(m => m.status === 'Draft').length;

  const mySubjects = subjects.filter(s => s.departmentCode === facultyDepartmentCode);
  const deptNotifs = notifications.filter(n => n.recipientRole === 'FACULTY' && !n.isRead).length;

  const recentMaterials = myMaterials.slice(0, 4);

  return (
    <div className="space-y-6 font-serif">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Department Faculty – {facultyDepartmentName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome, {facultyDisplayName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Designation: <strong className="text-slate-800">Professor</strong> • Dept. of Information Technology • Semester V
            </p>
          </div>
          {rejected > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
              <XCircle className="h-4 w-4 text-rose-500" />
              {rejected} material{rejected > 1 ? 's' : ''} rejected – edit & resubmit
            </div>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Assigned Subjects', value: mySubjects.length, icon: BookOpen, color: 'bg-blue-50 text-blue-700 border-blue-200' },
          { label: 'Approved Materials', value: approved, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
          { label: 'Pending / Under Review', value: pending, icon: Clock, color: 'bg-amber-50 text-amber-700 border-amber-200' },
          { label: 'Rejected (Action Req.)', value: rejected, icon: XCircle, color: 'bg-rose-50 text-rose-700 border-rose-200' },
        ].map((m, i) => {
          const Icon = m.icon;
          const [bg, text, border] = m.color.split(' ');
          return (
            <div key={i} className={`bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-3 ${border}`}>
              <div className={`h-10 w-10 rounded-xl ${bg} ${text} flex items-center justify-center flex-shrink-0`}>
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Recent Materials */}
        <div className="lg:col-span-8 space-y-6">
          {/* Rejected Materials Alert */}
          {rejected > 0 && (
            <div className="bg-rose-50 rounded-2xl border border-rose-200 p-5 flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                <XCircle className="h-5 w-5 text-rose-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-rose-900 mb-2">Action Required – Rejected Materials</h3>
                {myMaterials.filter(m => m.status === 'Rejected').map(mat => (
                  <div key={mat.id} className="mb-2 last:mb-0">
                    <p className="text-xs font-semibold text-rose-800">"{mat.title}"</p>
                    <p className="text-xs text-rose-600 mt-0.5">Reason: {mat.rejectionReason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Materials Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">My Materials</h3>
                <p className="text-xs text-slate-500">Recent submissions and their verification status</p>
              </div>
              <a href="/faculty/dept/status" className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1">
                View All <ChevronRight className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="edusphere-table">
                <thead>
                  <tr>
                    <th>Material Title</th>
                    <th>Subject</th>
                    <th>Type</th>
                    <th>Submitted</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMaterials.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-slate-400 text-xs">No materials submitted yet.</td>
                    </tr>
                  ) : (
                    recentMaterials.map(mat => (
                      <tr key={mat.id}>
                        <td>
                          <p className="text-xs font-bold text-slate-800 max-w-[200px] truncate">{mat.title}</p>
                          <p className="text-[11px] text-slate-400">Unit {mat.unit}</p>
                        </td>
                        <td><span className="font-mono text-[11px] font-bold text-blue-700">{mat.subjectCode}</span></td>
                        <td><span className="badge-lavender">{mat.type}</span></td>
                        <td className="text-xs text-slate-500 font-mono">{mat.submittedAt}</td>
                        <td><StatusBadge status={mat.status} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Material Workflow Explainer */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Material Approval Workflow</h3>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {[
                { label: 'You Upload', color: 'bg-slate-100 text-slate-700 border-slate-200' },
                { label: '→', plain: true },
                { label: 'Submit to HOD', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                { label: '→', plain: true },
                { label: 'HOD Verifies', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                { label: '→', plain: true },
                { label: 'Approved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                { label: '→', plain: true },
                { label: 'Students Access', color: 'bg-violet-50 text-violet-700 border-violet-200' },
              ].map((step, i) =>
                step.plain ? (
                  <span key={i} className="text-slate-400 font-bold">{step.label}</span>
                ) : (
                  <span key={i} className={`px-3 py-1.5 rounded-lg border font-bold ${step.color}`}>{step.label}</span>
                )
              )}
            </div>
            <p className="text-xs text-slate-500 mt-3">
              ⚠️ You cannot directly publish materials to students. All materials must be reviewed and approved by the HOD first.
            </p>
          </div>
        </div>

        {/* Right: Subject List */}
        <div className="lg:col-span-4 space-y-6">
          {/* My Subjects */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">My Assigned Subjects</h3>
            <div className="space-y-3">
              {mySubjects.map(s => (
                <div key={s.code} className="p-3 rounded-xl bg-lavender-50/50 border border-lavender-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-blue-700">{s.code}</span>
                    <span className="text-[11px] text-slate-500">{s.credits} credits</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800">{s.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{s.totalStudents} students • Sec {s.sections?.join(', ') || 'A'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
