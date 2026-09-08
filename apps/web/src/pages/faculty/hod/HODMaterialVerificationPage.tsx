import React, { useState } from 'react';
import { useFaculty } from '../../../contexts/FacultyContext';
import { StudyMaterial, MaterialStatus } from '../../../data/facultyData';
import { StatusBadge } from './HODDashboard';
import {
  Search, Filter, Eye, Download, CheckCircle2, XCircle, AlertCircle,
  ChevronDown, FileText, X, Send,
} from 'lucide-react';
import clsx from 'clsx';

const typeColors: Record<string, string> = {
  'Notes': 'bg-blue-50 text-blue-700 border-blue-200',
  'PDF': 'bg-red-50 text-red-700 border-red-200',
  'PPT': 'bg-orange-50 text-orange-700 border-orange-200',
  'Question Bank': 'bg-purple-50 text-purple-700 border-purple-200',
  'Previous Year QP': 'bg-amber-50 text-amber-700 border-amber-200',
  'Assignment': 'bg-teal-50 text-teal-700 border-teal-200',
  'Lab Material': 'bg-green-50 text-green-700 border-green-200',
  'Reference Material': 'bg-slate-50 text-slate-700 border-slate-200',
};

export const HODMaterialVerificationPage: React.FC = () => {
  const { materials, updateMaterialStatus, facultyDepartmentCode } = useFaculty();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [previewMaterial, setPreviewMaterial] = useState<StudyMaterial | null>(null);
  const [rejectModal, setRejectModal] = useState<{ open: boolean; materialId: string; title: string }>({ open: false, materialId: '', title: '' });
  const [rejectionReason, setRejectionReason] = useState('');
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; materialId: string; title: string }>({ open: false, materialId: '', title: '' });
  const [actionSuccess, setActionSuccess] = useState('');

  const allMaterials = materials.filter(m => m.status !== 'Draft' && m.departmentCode === facultyDepartmentCode);
  const filtered = allMaterials.filter(m => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.facultyName.toLowerCase().includes(search.toLowerCase()) ||
      m.subjectCode.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleApprove = (mat: StudyMaterial) => {
    setConfirmModal({ open: true, materialId: mat.id, title: mat.title });
  };

  const confirmApprove = () => {
    updateMaterialStatus(confirmModal.materialId, 'Approved');
    setActionSuccess(`"${confirmModal.title}" has been approved and published to students.`);
    setConfirmModal({ open: false, materialId: '', title: '' });
    setTimeout(() => setActionSuccess(''), 4000);
  };

  const handleReject = (mat: StudyMaterial) => {
    setRejectionReason('');
    setRejectModal({ open: true, materialId: mat.id, title: mat.title });
  };

  const confirmReject = () => {
    if (!rejectionReason.trim()) return;
    updateMaterialStatus(rejectModal.materialId, 'Rejected', rejectionReason);
    setActionSuccess(`"${rejectModal.title}" has been rejected. Faculty has been notified.`);
    setRejectModal({ open: false, materialId: '', title: '' });
    setTimeout(() => setActionSuccess(''), 4000);
  };

  const handleRequestMod = (mat: StudyMaterial) => {
    updateMaterialStatus(mat.id, 'Under Verification');
    setActionSuccess(`Modification requested for "${mat.title}". Faculty has been notified.`);
    setTimeout(() => setActionSuccess(''), 4000);
  };

  const statuses: string[] = ['All', 'Submitted', 'Under Verification', 'Resubmitted', 'Approved', 'Rejected'];

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Material Verification</h1>
            <p className="text-sm text-slate-500 mt-1">Review, approve or reject academic materials submitted by department faculty.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge-amber">{allMaterials.filter(m => ['Submitted', 'Under Verification', 'Resubmitted'].includes(m.status)).length} Pending</span>
            <span className="badge-emerald">{allMaterials.filter(m => m.status === 'Approved').length} Approved</span>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {actionSuccess && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          {actionSuccess}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by material name, faculty, or subject code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={clsx(
                'px-3 py-2 rounded-xl text-xs font-bold transition border',
                statusFilter === s
                  ? 'bg-violet-700 text-white border-violet-700'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="edusphere-table">
            <thead>
              <tr>
                <th>Material Name</th>
                <th>Faculty</th>
                <th>Subject</th>
                <th>Unit</th>
                <th>Submitted</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400 text-sm">
                    No materials found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(mat => (
                  <tr key={mat.id}>
                    <td>
                      <div>
                        <p className="text-xs font-bold text-slate-800 max-w-[200px] truncate">{mat.title}</p>
                        <p className="text-[11px] text-slate-400">{mat.fileName} • {mat.fileSize}</p>
                      </div>
                    </td>
                    <td className="text-xs text-slate-600 whitespace-nowrap">{mat.facultyName}</td>
                    <td>
                      <span className="font-mono text-[11px] font-bold text-violet-700">{mat.subjectCode}</span>
                      <p className="text-[10px] text-slate-400 max-w-[120px] truncate">{mat.subjectName}</p>
                    </td>
                    <td className="text-xs text-slate-600 text-center">Unit {mat.unit}</td>
                    <td className="text-xs text-slate-500 font-mono whitespace-nowrap">{mat.submittedAt}</td>
                    <td>
                      <span className={clsx('px-2 py-0.5 rounded-lg text-[11px] font-bold border', typeColors[mat.type])}>
                        {mat.type}
                      </span>
                    </td>
                    <td><StatusBadge status={mat.status} /></td>
                    <td>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          onClick={() => setPreviewMaterial(mat)}
                          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                          title="Preview"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition" title="Download">
                          <Download className="h-3.5 w-3.5" />
                        </button>
                        {['Submitted', 'Under Verification', 'Resubmitted'].includes(mat.status) && (
                          <>
                            <button
                              onClick={() => handleApprove(mat)}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
                              title="Approve"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleReject(mat)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
                              title="Reject"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleRequestMod(mat)}
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition"
                              title="Request Modification"
                            >
                              <AlertCircle className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {previewMaterial && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Material Preview</h3>
              <button onClick={() => setPreviewMaterial(null)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-7 w-7 text-violet-600" />
                </div>
                <div>
                  <h4 className="text-lg font-extrabold text-slate-900">{previewMaterial.title}</h4>
                  <p className="text-sm text-slate-500">{previewMaterial.fileName} • {previewMaterial.fileSize}</p>
                  <StatusBadge status={previewMaterial.status} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ['Subject', `${previewMaterial.subjectCode} – ${previewMaterial.subjectName}`],
                  ['Unit', `Unit ${previewMaterial.unit}`],
                  ['Topic', previewMaterial.topic],
                  ['Type', previewMaterial.type],
                  ['Faculty', previewMaterial.facultyName],
                  ['Target Class', `${previewMaterial.targetClass} – Sec ${previewMaterial.section}`],
                  ['Academic Year', previewMaterial.academicYear],
                  ['Semester', `Semester ${previewMaterial.semester}`],
                  ['Submitted On', previewMaterial.submittedAt],
                ].map(([label, value]) => (
                  <div key={label} className="bg-lavender-50/50 rounded-xl p-3 border border-lavender-100">
                    <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">{label}</p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-lavender-50/50 rounded-xl p-4 border border-lavender-100">
                <p className="text-xs text-slate-500 font-semibold mb-1">Description</p>
                <p className="text-sm text-slate-700">{previewMaterial.description}</p>
              </div>
              {previewMaterial.rejectionReason && (
                <div className="bg-rose-50 rounded-xl p-4 border border-rose-200">
                  <p className="text-xs text-rose-700 font-semibold mb-1">Previous Rejection Reason</p>
                  <p className="text-sm text-rose-800">{previewMaterial.rejectionReason}</p>
                </div>
              )}
              {/* Simulated PDF Preview Area */}
              <div className="h-48 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <FileText className="h-10 w-10 mx-auto mb-2" />
                  <p className="text-xs font-semibold">PDF Preview Area</p>
                  <p className="text-[11px]">{previewMaterial.fileName}</p>
                </div>
              </div>
              {['Submitted', 'Under Verification', 'Resubmitted'].includes(previewMaterial.status) && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { handleApprove(previewMaterial); setPreviewMaterial(null); }}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Approve & Publish
                  </button>
                  <button
                    onClick={() => { handleReject(previewMaterial); setPreviewMaterial(null); }}
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
                  >
                    <XCircle className="h-4 w-4" /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-rose-700">Reject Material</h3>
              <button onClick={() => setRejectModal({ open: false, materialId: '', title: '' })} className="p-2 rounded-lg hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">
                You are rejecting: <strong className="text-slate-900">"{rejectModal.title}"</strong>
              </p>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Reason for Rejection *</label>
                <textarea
                  rows={4}
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  placeholder="e.g., Please correct the Unit number and re-upload the updated version..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/20 resize-none"
                />
                {!rejectionReason.trim() && (
                  <p className="text-[11px] text-rose-500 mt-1">Rejection reason is required.</p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setRejectModal({ open: false, materialId: '', title: '' })}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReject}
                  disabled={!rejectionReason.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" /> Send Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Approve Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Confirm Approval</h3>
                  <p className="text-xs text-slate-500">This will publish the material to students.</p>
                </div>
              </div>
              <p className="text-sm text-slate-600">
                Are you sure you want to approve <strong>"{confirmModal.title}"</strong>? It will be immediately visible to all relevant students.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmModal({ open: false, materialId: '', title: '' })} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
                <button onClick={confirmApprove} className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Approve & Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
