import React, { useState } from 'react';
import { useFaculty } from '../../../contexts/FacultyContext';
import { StudyMaterial } from '../../../data/facultyData';
import { StatusBadge } from './HODDashboard';
import { Search, Download, Eye, Filter, FileText, X, BookOpen, Users, GraduationCap } from 'lucide-react';
import clsx from 'clsx';

export const HODApprovedMaterialsPage: React.FC = () => {
  const { materials, facultyDepartmentCode } = useFaculty();
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [previewMaterial, setPreviewMaterial] = useState<StudyMaterial | null>(null);

  const approved = materials.filter(m => m.status === 'Approved' && m.departmentCode === facultyDepartmentCode);
  const subjects = ['All', ...Array.from(new Set(approved.map(m => m.subjectCode)))];
  const types = ['All', ...Array.from(new Set(approved.map(m => m.type)))];

  const filtered = approved.filter(m => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.facultyName.toLowerCase().includes(search.toLowerCase()) ||
      m.topic.toLowerCase().includes(search.toLowerCase());
    const matchSubject = subjectFilter === 'All' || m.subjectCode === subjectFilter;
    const matchType = typeFilter === 'All' || m.type === typeFilter;
    return matchSearch && matchSubject && matchType;
  });

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Approved Materials</h1>
            <p className="text-sm text-slate-500 mt-1">All HOD-approved materials currently visible to students.</p>
          </div>
          <span className="badge-emerald text-base px-4 py-2">{approved.length} Published</span>
        </div>

        {/* Summary Row */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: FileText, label: 'Total Materials', value: approved.length, color: 'text-emerald-600' },
            { icon: BookOpen, label: 'Subjects Covered', value: new Set(approved.map(m => m.subjectCode)).size, color: 'text-blue-600' },
            { icon: Users, label: 'Faculty Contributed', value: new Set(approved.map(m => m.facultyId)).size, color: 'text-violet-600' },
            { icon: GraduationCap, label: 'Student Access', value: 118, color: 'text-indigo-600' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${item.color} flex-shrink-0`} />
                <div>
                  <p className="text-sm font-extrabold text-slate-900">{item.value}</p>
                  <p className="text-[11px] text-slate-500">{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, faculty, or topic..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <select
          value={subjectFilter}
          onChange={e => setSubjectFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none"
        >
          {subjects.map(s => <option key={s} value={s}>{s === 'All' ? 'All Subjects' : s}</option>)}
        </select>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none"
        >
          {types.map(t => <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>)}
        </select>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-3 text-center py-16 text-slate-400">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No approved materials found.</p>
          </div>
        ) : (
          filtered.map(mat => (
            <div key={mat.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 hover:shadow-md hover:border-emerald-300 transition">
              <div className="flex items-start gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug truncate">{mat.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{mat.subjectCode} • Unit {mat.unit}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-3 line-clamp-2">{mat.description}</p>
              <div className="space-y-1.5 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span>Faculty:</span>
                  <span className="font-semibold">{mat.facultyName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-semibold">{mat.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Published:</span>
                  <span className="font-semibold">{mat.publishedAt || mat.reviewedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span>File Size:</span>
                  <span className="font-semibold">{mat.fileSize}</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => setPreviewMaterial(mat)}
                  className="flex-1 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Eye className="h-3.5 w-3.5" /> View
                </button>
                <button className="flex-1 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition">
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Preview Modal */}
      {previewMaterial && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Material Preview</h3>
              <button onClick={() => setPreviewMaterial(null)} className="p-2 rounded-lg hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <h4 className="text-lg font-extrabold text-slate-900">{previewMaterial.title}</h4>
              <StatusBadge status={previewMaterial.status} />
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  ['Subject', `${previewMaterial.subjectCode} – ${previewMaterial.subjectName}`],
                  ['Unit & Topic', `Unit ${previewMaterial.unit} – ${previewMaterial.topic}`],
                  ['Type', previewMaterial.type],
                  ['Faculty', previewMaterial.facultyName],
                  ['Section', previewMaterial.section],
                  ['Published', previewMaterial.publishedAt || '—'],
                ].map(([l, v]) => (
                  <div key={l} className="bg-lavender-50/60 rounded-xl p-2.5 border border-lavender-100">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">{l}</p>
                    <p className="font-bold text-slate-800 mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
              <div className="h-40 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <FileText className="h-8 w-8 mx-auto mb-1" />
                  <p className="text-xs">{previewMaterial.fileName}</p>
                </div>
              </div>
              <button className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition">
                <Download className="h-4 w-4" /> Download {previewMaterial.type}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
