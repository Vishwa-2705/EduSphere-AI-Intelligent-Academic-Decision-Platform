import React, { useState } from 'react';
import { useFaculty } from '../../contexts/FacultyContext';
import { useAuth } from '../../contexts/AuthContext';
import { StudyMaterial, studentList } from '../../data/facultyData';
import {
  BookOpen, Search, Filter, Eye, Download, Sparkles, TrendingUp,
  BrainCircuit, Award, Calendar, FileText, CheckCircle2, Flame, ArrowRight
} from 'lucide-react';
import clsx from 'clsx';

export const StudentMaterialsPage: React.FC = () => {
  const { materials } = useFaculty();
  const { user, profile } = useAuth();

  // Determine student's department
  const studentMatch = studentList.find(s => s.email.toLowerCase() === user?.email?.toLowerCase());
  const studentDept = studentMatch?.departmentCode || (profile?.department as any)?.code || (user?.email?.toLowerCase().includes('it') ? 'IT' : 'CSE');

  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedUnit, setSelectedUnit] = useState<number | 'All'>('All');
  const [selectedFaculty, setSelectedFaculty] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [previewMaterial, setPreviewMaterial] = useState<StudyMaterial | null>(null);
  const [studyModalOpen, setStudyModalOpen] = useState(false);

  // Strictly only show HOD Approved materials for the student's department
  const approvedMaterials = materials.filter(
    m => m.status === 'Approved' && (studentDept ? m.departmentCode === studentDept : true)
  );

  // Extract distinct filter values
  const subjects = ['All', ...Array.from(new Set(approvedMaterials.map(m => m.subjectCode)))];
  const units = ['All', 1, 2, 3, 4, 5];
  const faculties = ['All', ...Array.from(new Set(approvedMaterials.map(m => m.facultyName)))];
  const types = ['All', ...Array.from(new Set(approvedMaterials.map(m => m.type)))];

  const filteredMaterials = approvedMaterials.filter(m => {
    const matchSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.topic.toLowerCase().includes(search.toLowerCase()) ||
      m.subjectName.toLowerCase().includes(search.toLowerCase());
    const matchSubject = selectedSubject === 'All' || m.subjectCode === selectedSubject;
    const matchUnit = selectedUnit === 'All' || m.unit === selectedUnit;
    const matchFaculty = selectedFaculty === 'All' || m.facultyName === selectedFaculty;
    const matchType = selectedType === 'All' || m.type === selectedType;

    return matchSearch && matchSubject && matchUnit && matchFaculty && matchType;
  });

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 mb-2">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Verified Academic Repository • HOD Approved Content</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Study Materials & Resources
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Curated notes, question banks, and lecture slides verified by Department Faculty and HOD.
            </p>
          </div>

          <span className="badge-emerald text-xs px-3.5 py-1.5 self-start sm:self-auto">
            {approvedMaterials.length} Approved Materials Active
          </span>
        </div>
      </div>

      {/* 19. AI INTEGRATION WITH EDUSPHERE AI BANNER */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-purple-900 rounded-3xl p-6 text-white shadow-elevated relative overflow-hidden">
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-violet-500/30 border border-violet-400/40 flex items-center justify-center text-violet-300">
              <BrainCircuit className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-widest text-violet-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>EduSphere AI Academic Decision System</span>
              </div>
              <h2 className="text-lg font-bold text-white">
                Personalized AI Study Recommendation
              </h2>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-8 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-rose-500/80 text-white font-extrabold text-[10px] uppercase tracking-wide flex items-center gap-1">
                  <Flame className="h-3 w-3" /> High Priority Topic
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-violet-200 font-bold text-[10px]">
                  Topic Priority Score: 94 / 100
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-violet-200 font-bold text-[10px]">
                  PYQ Trend: 84% Frequency
                </span>
              </div>

              <p className="text-sm text-slate-100 leading-relaxed">
                "Based on your recent performance (68% in IA-1) and upcoming <strong className="text-white">DBMS Examination on 15 September</strong>, <strong className="text-white">Unit 3 – Normalization</strong> is your highest priority revision topic."
              </p>

              <p className="text-xs text-violet-300 flex items-center gap-1.5 font-sans">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Cognitive Forgetting Curve: Last revised 14 days ago • Optimal retention requires review today.</span>
              </p>
            </div>

            <div className="md:col-span-4 bg-white/10 rounded-xl p-4 border border-white/15 space-y-3">
              <div>
                <p className="text-[10px] uppercase font-bold text-violet-300">Recommended Material</p>
                <p className="text-xs font-bold text-white leading-snug mt-0.5">
                  DBMS Unit 3 – Normalization Notes
                </p>
                <p className="text-[11px] text-slate-300">Dr. Priya Kumar • PDF • 1.8 MB</p>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const match = approvedMaterials.find(m => m.id === 'm002');
                    if (match) setPreviewMaterial(match);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition text-center"
                >
                  View Material
                </button>
                <button
                  type="button"
                  onClick={() => setStudyModalOpen(true)}
                  className="flex-1 py-2 px-3 rounded-xl bg-violet-400 hover:bg-violet-300 text-slate-950 text-xs font-extrabold transition flex items-center justify-center gap-1 shadow-sm"
                >
                  Start Studying <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-4 shadow-sm space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search study materials by title, topic, or subject name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-violet-500 bg-white"
            >
              {subjects.map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All Subjects' : s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Unit</label>
            <select
              value={selectedUnit}
              onChange={e => setSelectedUnit(e.target.value === 'All' ? 'All' : Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-violet-500 bg-white"
            >
              {units.map(u => (
                <option key={String(u)} value={u}>{u === 'All' ? 'All Units' : `Unit ${u}`}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Faculty</label>
            <select
              value={selectedFaculty}
              onChange={e => setSelectedFaculty(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-violet-500 bg-white"
            >
              {faculties.map(f => (
                <option key={f} value={f}>{f === 'All' ? 'All Faculty' : f}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Material Type</label>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-violet-500 bg-white"
            >
              {types.map(t => (
                <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMaterials.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-bold text-slate-600">No approved study materials found</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting filters to explore all department materials.</p>
          </div>
        ) : (
          filteredMaterials.map(mat => (
            <div
              key={mat.id}
              className="bg-white rounded-2xl border border-lavender-200/80 p-5 shadow-sm hover:shadow-md hover:border-violet-300 transition flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-200">
                      {mat.subjectCode}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Unit {mat.unit}
                    </span>
                  </div>

                  <span className="badge-lavender text-[10px]">
                    {mat.type}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug">
                  {mat.title}
                </h3>
                <p className="text-xs text-violet-700 font-semibold mt-0.5">
                  {mat.topic}
                </p>

                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {mat.description}
                </p>

                {/* Metadata List */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Faculty:</span>
                    <span className="font-bold text-slate-800">{mat.facultyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Published Date:</span>
                    <span className="font-mono text-slate-700">{mat.publishedAt || mat.submittedAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">File Size:</span>
                    <span className="font-mono text-slate-700">{mat.fileSize}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewMaterial(mat)}
                  className="flex-1 py-2 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-800 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Eye className="h-3.5 w-3.5" /> View
                </button>
                <button
                  type="button"
                  onClick={() => alert(`Downloading ${mat.fileName} (${mat.fileSize})...`)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PDF View Modal */}
      {previewMaterial && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="badge-emerald text-[10px]">HOD Verified & Approved</span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{previewMaterial.title}</h3>
                <p className="text-xs text-slate-500">{previewMaterial.subjectName} • Unit {previewMaterial.unit}</p>
              </div>
              <button
                onClick={() => setPreviewMaterial(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl">
              <div><span className="text-slate-400">Faculty:</span> <strong className="text-slate-800">{previewMaterial.facultyName}</strong></div>
              <div><span className="text-slate-400">Topic:</span> <strong className="text-slate-800">{previewMaterial.topic}</strong></div>
              <div><span className="text-slate-400">File:</span> <span className="font-mono text-slate-700">{previewMaterial.fileName}</span></div>
              <div><span className="text-slate-400">Size:</span> <span className="font-mono text-slate-700">{previewMaterial.fileSize}</span></div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{previewMaterial.description}</p>

            <div className="h-48 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400 text-xs">
              <FileText className="h-10 w-10 mb-2 opacity-50 text-violet-700" />
              <span className="font-bold text-slate-700">Digital Document Viewer</span>
              <span className="text-[11px] text-slate-400">Rendering {previewMaterial.fileName}</span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setPreviewMaterial(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Close Viewer
              </button>
              <button
                onClick={() => {
                  alert(`Downloading verified copy of ${previewMaterial.fileName}...`);
                  setPreviewMaterial(null);
                }}
                className="px-5 py-2 rounded-xl bg-violet-700 hover:bg-violet-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Download className="h-3.5 w-3.5" /> Download Verified PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Study Session Modal */}
      {studyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-violet-700 font-bold">
                <BrainCircuit className="h-5 w-5" />
                <span>EduSphere AI Study Session Initiated</span>
              </div>
              <button
                onClick={() => setStudyModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <p className="font-bold text-slate-900 text-sm">Focus Area: Unit 3 – Normalization (1NF, 2NF, 3NF, BCNF)</p>
              <p>An intelligent adaptive revision plan has been configured for your 45-minute study sprint.</p>
              <div className="p-3 bg-violet-50 rounded-xl border border-violet-200 space-y-1 text-[11px] text-violet-900">
                <p>• 15 mins: Review High-Yield Normalization Decomposition Theorems</p>
                <p>• 15 mins: Practice 5 Previous Year University Exam Questions (2022–2024)</p>
                <p>• 15 mins: AI Diagnostic Quiz to update Cognitive Retention Curve</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setStudyModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-violet-700 text-white font-bold text-xs hover:bg-violet-800"
              >
                Begin Learning Sprint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
