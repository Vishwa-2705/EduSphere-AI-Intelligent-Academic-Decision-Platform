import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Building, Plus, CheckCircle2, Users, BookOpen } from 'lucide-react';

export const AdminDepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [establishedYear, setEstablishedYear] = useState(2026);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/academics/departments');
      if (res.data.success) {
        setDepartments(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load departments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) return;

    try {
      setIsSubmitting(true);
      const res = await api.post('/academics/departments', {
        code,
        name,
        establishedYear,
      });

      if (res.data.success) {
        setMsg('Academic department created successfully');
        setShowModal(false);
        setCode('');
        setName('');
        setTimeout(() => setMsg(null), 4000);
        fetchDepartments();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create department');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && departments.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center font-serif">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-lavender-700 border-t-transparent" />
          <p className="text-sm font-bold text-slate-700">Loading Academic Departments...</p>
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
            <span className="badge-lavender mb-2 inline-block">Institutional Governance</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Academic Departments & Degree Units
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Institutional faculties, established curricula, student allocations, and degree councils
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-lavender-700 hover:bg-lavender-800 text-white font-bold text-xs shadow-md shadow-lavender-700/20 flex items-center gap-2 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Create Academic Department</span>
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-serif flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {departments.map((dept) => (
          <div key={dept._id} className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm hover:border-lavender-400 transition">
            <div className="flex items-start justify-between">
              <span className="font-mono font-bold text-xs bg-lavender-700 text-white px-2.5 py-0.5 rounded-md">
                {dept.code}
              </span>
              <span className="badge-emerald text-[10px]">Est. {dept.establishedYear}</span>
            </div>

            <h3 className="text-base font-bold text-slate-900 mt-3">{dept.name}</h3>

            <div className="mt-5 pt-4 border-t border-lavender-100 grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-lavender-700" />
                <span><strong>{dept.studentCount || 0}</strong> Students Enrolled</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-lavender-700" />
                <span><strong>{dept.courseCount || 0}</strong> Active Courses</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl border border-lavender-200 shadow-elevated p-6 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Create Academic Department</h3>
            <p className="text-xs text-slate-500 mb-4">Provision a new academic division and degree unit</p>

            <form onSubmit={handleCreateDepartment} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Code</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. IT"
                    className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif uppercase font-bold"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Established Year</label>
                  <input
                    type="number"
                    value={establishedYear}
                    onChange={(e) => setEstablishedYear(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Department Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Department of Information Technology"
                  className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-lavender-700 hover:bg-lavender-800 text-white font-bold text-xs shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
