import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { FileText, Plus, CheckCircle2, Download, Trash2, Layers } from 'lucide-react';

export const FacultyMaterialsPage: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Upload Form State
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [unitNumber, setUnitNumber] = useState(1);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cRes, mRes] = await Promise.all([
        api.get('/academics/my-courses'),
        api.get('/materials'),
      ]);
      if (cRes.data.success) {
        setCourses(cRes.data.data);
        if (cRes.data.data.length > 0) setCourseId(cRes.data.data[0].courseId);
      }
      if (mRes.data.success) setMaterials(mRes.data.data);
    } catch (err) {
      console.error('Failed to load materials data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !title) return;

    try {
      setIsUploading(true);
      const res = await api.post('/materials', {
        courseId,
        title,
        description,
        unitNumber,
        fileUrl: `/materials/${title.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        fileType: 'PDF',
      });

      if (res.data.success) {
        setMsg('Study material published successfully');
        setShowUploadModal(false);
        setTitle('');
        setDescription('');
        setTimeout(() => setMsg(null), 4000);
        fetchData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to upload material');
    } finally {
      setIsUploading(false);
    }
  };

  if (loading && materials.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center font-serif">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-lavender-700 border-t-transparent" />
          <p className="text-sm font-bold text-slate-700">Loading Study Material Console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-lavender mb-2 inline-block">Curriculum Resource Manager</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Study Materials & Notes Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Publish lecture slide decks, syllabus reading notes, and laboratory experiment manuals
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 rounded-xl bg-lavender-700 hover:bg-lavender-800 text-white font-bold text-xs shadow-md shadow-lavender-700/20 flex items-center gap-2 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Upload New Study Resource</span>
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-serif flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Materials List */}
      <div className="bg-white rounded-2xl border border-lavender-200/80 shadow-sm overflow-hidden p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-lavender-100 flex items-center justify-between">
          <span>Active Digital Lecture Resources</span>
          <span className="badge-lavender">{materials.length} Materials Published</span>
        </h3>

        <div className="space-y-3">
          {materials.map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-xl border border-lavender-200 bg-lavender-50/40 hover:bg-lavender-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-lavender-100 text-lavender-800 border border-lavender-300 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-lavender-100 text-lavender-900 border border-lavender-300 px-2 py-0.5 rounded">
                      {m.courseCode}
                    </span>
                    <span className="badge-lavender text-[10px]">Unit {m.unitNumber}</span>
                    <span className="text-xs text-slate-500 font-mono">({m.fileSize})</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{m.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{m.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs flex-shrink-0">
                <span className="badge-slate font-mono">Downloads: {m.downloadCount}</span>
                <span className="text-slate-400 text-[11px]">{new Date(m.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-lavender-200 shadow-elevated p-6 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Upload New Course Study Material</h3>
            <p className="text-xs text-slate-500 mb-4">Add digital notes and resources for enrolled students</p>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Course</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif"
                >
                  {courses.map((c) => (
                    <option key={c.courseId} value={c.courseId}>
                      {c.code} – {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Resource Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Unit 3 Dijkstra Graph Notes"
                    className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit Number</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={unitNumber}
                    onChange={(e) => setUnitNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description & Topic Outline</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key concepts covered in this document..."
                  className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-xl bg-lavender-700 hover:bg-lavender-800 text-white font-bold text-xs shadow-sm disabled:opacity-50"
                >
                  {isUploading ? 'Publishing...' : 'Publish Study Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
