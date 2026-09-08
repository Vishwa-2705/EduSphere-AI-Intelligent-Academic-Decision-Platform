import React, { useState } from 'react';
import { useFaculty } from '../../../contexts/FacultyContext';
import { useAuth } from '../../../contexts/AuthContext';
import { StudyMaterial, MaterialType, subjects } from '../../../data/facultyData';
import { Upload, FileText, X, CheckCircle2, AlertCircle } from 'lucide-react';

const materialTypes: MaterialType[] = [
  'Notes', 'PDF', 'PPT', 'Question Bank', 'Previous Year QP', 'Assignment', 'Lab Material', 'Reference Material',
];

const units = [1, 2, 3, 4, 5];
const sections = ['A', 'B', 'A & B'];
const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

export const DeptFacultySubmitMaterialPage: React.FC = () => {
  const { submitMaterial, facultyDepartmentCode, facultyDepartmentName } = useFaculty();
  const { user, profile } = useAuth();
  const mySubjects = subjects.filter(s => s.departmentCode === facultyDepartmentCode);

  const facultyDisplayName = profile?.firstName
    ? `${profile.firstName} ${profile.lastName}`
    : user?.email || 'Faculty Member';

  const [form, setForm] = useState({
    title: '',
    subjectCode: mySubjects[0]?.code || '',
    unit: 1,
    topic: '',
    type: 'Notes' as MaterialType,
    description: '',
    fileName: '',
    fileSize: '',
    academicYear: '2025–2026',
    semester: 5,
    targetClass: `B.Tech ${facultyDepartmentCode}`,
    section: 'A & B',
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedSubject = mySubjects.find(s => s.code === form.subjectCode);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = 'Material title is required.';
    if (!form.subjectCode) newErrors.subjectCode = 'Please select a subject.';
    if (!form.topic.trim()) newErrors.topic = 'Topic is required.';
    if (!form.description.trim()) newErrors.description = 'Description is required.';
    if (!uploadedFile) newErrors.file = 'Please upload a file.';
    return newErrors;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setForm(prev => ({
        ...prev,
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    const subject = mySubjects.find(s => s.code === form.subjectCode);
    submitMaterial({
      title: form.title,
      subjectCode: form.subjectCode,
      subjectName: subject?.name || '',
      departmentCode: facultyDepartmentCode,
      unit: form.unit,
      topic: form.topic,
      type: form.type,
      description: form.description,
      fileName: form.fileName || `${form.title.replace(/\s+/g, '_')}.pdf`,
      fileSize: form.fileSize || '0 MB',
      academicYear: form.academicYear,
      semester: form.semester,
      targetClass: form.targetClass,
      section: form.section,
      facultyId: user?.email || 'faculty@edusphere.ai',
      facultyName: facultyDisplayName,
    });
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm({ title: '', subjectCode: mySubjects[0]?.code || '', unit: 1, topic: '', type: 'Notes', description: '', fileName: '', fileSize: '', academicYear: '2025–2026', semester: 5, targetClass: 'B.Tech IT', section: 'A & B' });
    setUploadedFile(null);
    setSubmitted(false);
    setErrors({});
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 font-serif space-y-5">
        <div className="h-20 w-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-slate-900">Material Submitted Successfully!</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-md">
            Your material "{form.title}" has been submitted to the HOD for verification. You'll be notified once it's approved or rejected.
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-md text-center">
          <p className="text-xs text-blue-800 font-semibold">
            ⚠️ Your material is NOT yet visible to students. It will be published only after HOD approval.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleReset} className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition">
            Submit Another Material
          </button>
          <a href="/faculty/dept/status" className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-bold transition">
            View Material Status
          </a>
        </div>
      </div>
    );
  }

  const field = (label: string, key: keyof typeof form, children: React.ReactNode) => (
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1.5">{label}</label>
      {children}
      {errors[key] && <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors[key]}</p>}
    </div>
  );

  const inputClass = (key: string) =>
    `w-full px-3 py-2.5 rounded-xl border text-xs text-slate-800 focus:outline-none focus:ring-2 transition ${errors[key] ? 'border-rose-400 focus:ring-rose-400/20' : 'border-slate-200 focus:border-violet-500 focus:ring-violet-500/20'}`;

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Upload className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Submit Study Material</h1>
            <p className="text-sm text-slate-500 mt-0.5">Fill in the details and upload your academic material for HOD verification.</p>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800">
            <strong>Important:</strong> Materials submitted here will be sent to the HOD for verification. You cannot directly publish materials to students. The HOD must approve before students can access the content.
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
        {/* Basic Info */}
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 mb-4 pb-2 border-b border-slate-100">Material Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('Material Title *', 'title',
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g., DBMS Unit 2 – SQL Queries and Joins"
                className={inputClass('title')}
              />
            )}
            {field('Subject *', 'subjectCode',
              <select
                value={form.subjectCode}
                onChange={e => setForm(p => ({ ...p, subjectCode: e.target.value }))}
                className={inputClass('subjectCode')}
              >
                {mySubjects.map(s => (
                  <option key={s.code} value={s.code}>{s.code} – {s.name}</option>
                ))}
              </select>
            )}
            {field('Subject Code', 'subjectCode',
              <input
                type="text"
                value={form.subjectCode}
                readOnly
                className={`${inputClass('subjectCode')} bg-slate-50 text-slate-500 cursor-not-allowed`}
              />
            )}
            {field('Unit *', 'unit',
              <select
                value={form.unit}
                onChange={e => setForm(p => ({ ...p, unit: Number(e.target.value) }))}
                className={inputClass('unit')}
              >
                {units.map(u => <option key={u} value={u}>Unit {u}</option>)}
              </select>
            )}
            {field('Topic *', 'topic',
              <input
                type="text"
                value={form.topic}
                onChange={e => setForm(p => ({ ...p, topic: e.target.value }))}
                placeholder="e.g., SQL Queries and Joins"
                className={inputClass('topic')}
              />
            )}
            {field('Material Type *', 'type',
              <select
                value={form.type}
                onChange={e => setForm(p => ({ ...p, type: e.target.value as MaterialType }))}
                className={inputClass('type')}
              >
                {materialTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Description *</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            placeholder="Briefly describe what this material covers, key topics, and how it benefits students..."
            className={inputClass('description') + ' resize-none'}
          />
          {errors.description && <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.description}</p>}
        </div>

        {/* File Upload */}
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 mb-4 pb-2 border-b border-slate-100">File Upload</h3>
          <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition ${errors.file ? 'border-rose-400 bg-rose-50/40' : 'border-slate-200 hover:border-violet-400 bg-slate-50/50'}`}>
            <input
              type="file"
              id="file-upload"
              accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              {uploadedFile ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-emerald-600" />
                  </div>
                  <p className="text-sm font-bold text-emerald-700">{uploadedFile.name}</p>
                  <p className="text-xs text-slate-500">{(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB • Click to change</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-violet-50 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-400 mt-1">PDF, PPT, PPTX, DOC, DOCX, XLS, XLSX (Max 50MB)</p>
                  </div>
                </div>
              )}
            </label>
          </div>
          {errors.file && <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.file}</p>}
        </div>

        {/* Academic Info */}
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 mb-4 pb-2 border-b border-slate-100">Academic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Academic Year', key: 'academicYear' as const, type: 'text' as const, placeholder: '2025–2026' },
            ].map(f => field(f.label, f.key,
              <input
                type={f.type}
                value={form[f.key] as string}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className={inputClass(f.key)}
              />
            ))}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Semester</label>
              <select value={form.semester} onChange={e => setForm(p => ({ ...p, semester: Number(e.target.value) }))} className={inputClass('semester')}>
                {semesters.map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Class</label>
              <input type="text" value={form.targetClass} onChange={e => setForm(p => ({ ...p, targetClass: e.target.value }))} className={inputClass('targetClass')} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Section</label>
              <select value={form.section} onChange={e => setForm(p => ({ ...p, section: e.target.value }))} className={inputClass('section')}>
                {sections.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition flex items-center gap-2"
          >
            <X className="h-4 w-4" /> Clear Form
          </button>
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-violet-700 hover:bg-violet-800 text-white text-sm font-bold flex items-center gap-2 transition shadow-lg shadow-violet-200/50"
          >
            <Upload className="h-4 w-4" /> Submit to HOD for Verification
          </button>
        </div>
      </form>
    </div>
  );
};
