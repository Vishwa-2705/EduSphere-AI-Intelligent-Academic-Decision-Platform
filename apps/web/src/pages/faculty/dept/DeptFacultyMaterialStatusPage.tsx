import React, { useState } from 'react';
import { useFaculty } from '../../../contexts/FacultyContext';
import { StatusBadge } from '../hod/HODDashboard';
import { Search, Edit3, Send, FileText, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const statusOrder: Record<string, number> = {
  'Rejected': 0, 'Resubmitted': 1, 'Submitted': 2, 'Under Verification': 3, 'Approved': 4, 'Draft': 5,
};

export const DeptFacultyMaterialStatusPage: React.FC = () => {
  const { materials, updateMaterialStatus } = useFaculty();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editModal, setEditModal] = useState<{ open: boolean; materialId: string; title: string }>({ open: false, materialId: '', title: '' });
  const [successMsg, setSuccessMsg] = useState('');

  const myMaterials = materials
    .filter(m => m.facultyId === 'f001')
    .sort((a, b) => (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9));

  const filtered = myMaterials.filter(m => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.subjectCode.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleResubmit = (materialId: string, title: string) => {
    updateMaterialStatus(materialId, 'Resubmitted');
    setSuccessMsg(`"${title}" has been resubmitted to the HOD for re-verification.`);
    setEditModal({ open: false, materialId: '', title: '' });
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const statuses = ['All', 'Draft', 'Submitted', 'Under Verification', 'Resubmitted', 'Approved', 'Rejected'];

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900">Material Status</h1>
        <p className="text-sm text-slate-500 mt-1">Track the verification status of all your submitted academic materials.</p>

        {/* Status Summary */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-4">
          {[
            { label: 'Total', count: myMaterials.length, color: 'text-slate-700' },
            { label: 'Approved', count: myMaterials.filter(m => m.status === 'Approved').length, color: 'text-emerald-600' },
            { label: 'Pending', count: myMaterials.filter(m => ['Submitted', 'Under Verification', 'Resubmitted'].includes(m.status)).length, color: 'text-amber-600' },
            { label: 'Rejected', count: myMaterials.filter(m => m.status === 'Rejected').length, color: 'text-rose-600' },
            { label: 'Draft', count: myMaterials.filter(m => m.status === 'Draft').length, color: 'text-slate-400' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <span className={clsx('text-xl font-extrabold', s.color)}>{s.count}</span>
              <span className="text-xs text-slate-500">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold">
          <Send className="h-4 w-4 text-emerald-600" /> {successMsg}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or subject code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={clsx(
                'px-3 py-2 rounded-xl text-xs font-bold transition border',
                statusFilter === s ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
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
                <th>Material Title</th>
                <th>Subject</th>
                <th>Unit</th>
                <th>Type</th>
                <th>Submitted</th>
                <th>Reviewed</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400 text-xs">No materials found.</td>
                </tr>
              ) : (
                filtered.map(mat => (
                  <tr key={mat.id}>
                    <td>
                      <div>
                        <p className="text-xs font-bold text-slate-800 max-w-[200px] truncate">{mat.title}</p>
                        <p className="text-[11px] text-slate-400">{mat.fileName}</p>
                      </div>
                    </td>
                    <td><span className="font-mono text-[11px] font-bold text-blue-700">{mat.subjectCode}</span></td>
                    <td className="text-xs text-slate-600 text-center">Unit {mat.unit}</td>
                    <td><span className="badge-lavender">{mat.type}</span></td>
                    <td className="text-xs text-slate-500 font-mono whitespace-nowrap">{mat.submittedAt}</td>
                    <td className="text-xs text-slate-500 font-mono whitespace-nowrap">{mat.reviewedAt || '—'}</td>
                    <td>
                      <div className="space-y-1">
                        <StatusBadge status={mat.status} />
                        {mat.rejectionReason && (
                          <p className="text-[10px] text-rose-600 max-w-[160px] truncate" title={mat.rejectionReason}>
                            Reason: {mat.rejectionReason}
                          </p>
                        )}
                      </div>
                    </td>
                    <td>
                      {mat.status === 'Rejected' && (
                        <button
                          onClick={() => setEditModal({ open: true, materialId: mat.id, title: mat.title })}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition border border-blue-200"
                        >
                          <Edit3 className="h-3.5 w-3.5" /> Edit & Resubmit
                        </button>
                      )}
                      {mat.status === 'Draft' && (
                        <button
                          onClick={() => updateMaterialStatus(mat.id, 'Submitted')}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-bold transition border border-violet-200"
                        >
                          <Send className="h-3.5 w-3.5" /> Submit to HOD
                        </button>
                      )}
                      {mat.status === 'Approved' && (
                        <span className="text-xs text-emerald-600 font-bold">✓ Published to Students</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit & Resubmit Modal */}
      {editModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Edit3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit & Resubmit Material</h3>
                  <p className="text-xs text-slate-500 mt-0.5">"{editModal.title}"</p>
                </div>
              </div>
              <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
                <p className="text-xs text-amber-800 font-semibold mb-1">HOD Rejection Reason:</p>
                <p className="text-xs text-amber-700">
                  {materials.find(m => m.id === editModal.materialId)?.rejectionReason}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-600 font-semibold mb-2">Upload Updated File</p>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center cursor-pointer hover:border-blue-400 transition">
                  <FileText className="h-6 w-6 mx-auto text-slate-400 mb-1" />
                  <p className="text-xs text-slate-500">Click to upload the corrected file</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setEditModal({ open: false, materialId: '', title: '' })} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
                <button
                  onClick={() => handleResubmit(editModal.materialId, editModal.title)}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <Send className="h-3.5 w-3.5" /> Resubmit to HOD
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
