import React, { useMemo, useState } from 'react';
import { Award, CheckCircle2, Plus, Pencil, ShieldCheck, Trash2 } from 'lucide-react';
import { useFaculty } from '../../../contexts/FacultyContext';
import { facultyMembers, subjects, type ExamType } from '../../../data/facultyData';

type ExamTimetableForm = {
  subjectCode: string;
  subject: string;
  facultyName: string;
  examType: ExamType;
  year: 'I Year' | 'II Year' | 'III Year' | 'IV Year';
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
};

const defaultForm: ExamTimetableForm = {
  subjectCode: 'CS401',
  subject: 'Data Structures',
  facultyName: '',
  examType: 'Periodic Test 1',
  year: 'III Year',
  date: '2026-09-14',
  startTime: '09:00 AM',
  endTime: '10:30 AM',
  venue: 'Tech Block A, Hall 101',
};

const examTimeSlots: Partial<Record<ExamType, Array<{ label: string; start: string; end: string }>>> = {
  'Periodic Test 1': [
    { label: '09:00 AM - 10:30 AM', start: '09:00 AM', end: '10:30 AM' },
    { label: '11:00 AM - 12:30 PM', start: '11:00 AM', end: '12:30 PM' },
    { label: '01:30 PM - 03:00 PM', start: '01:30 PM', end: '03:00 PM' },
  ],
  'Periodic Test 2': [
    { label: '09:00 AM - 10:30 AM', start: '09:00 AM', end: '10:30 AM' },
    { label: '11:00 AM - 12:30 PM', start: '11:00 AM', end: '12:30 PM' },
    { label: '01:30 PM - 03:00 PM', start: '01:30 PM', end: '03:00 PM' },
  ],
  'Internal Exam': [
    { label: '09:00 AM - 10:30 AM', start: '09:00 AM', end: '10:30 AM' },
    { label: '11:00 AM - 12:30 PM', start: '11:00 AM', end: '12:30 PM' },
    { label: '01:30 PM - 03:00 PM', start: '01:30 PM', end: '03:00 PM' },
  ],
  'Lab Exam': [
    { label: '09:00 AM - 10:30 AM', start: '09:00 AM', end: '10:30 AM' },
    { label: '11:00 AM - 12:30 PM', start: '11:00 AM', end: '12:30 PM' },
    { label: '01:30 PM - 03:00 PM', start: '01:30 PM', end: '03:00 PM' },
  ],
  'Final Semester': [
    { label: '09:00 AM - 12:00 PM', start: '09:00 AM', end: '12:00 PM' },
    { label: '01:30 PM - 04:30 PM', start: '01:30 PM', end: '04:30 PM' },
  ],
};

export const HODCreateExamTimetablePage: React.FC = () => {
  const { facultyDepartmentCode, facultyDepartmentName, createExam, updateExam, deleteExam, approveExam, myDepartmentExams } = useFaculty();
  const [form, setForm] = useState(defaultForm);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const departmentSubjects = useMemo(
    () => subjects.filter(s => s.departmentCode === facultyDepartmentCode),
    [facultyDepartmentCode]
  );

  const departmentFaculty = useMemo(
    () => facultyMembers.filter(f => f.departmentCode === facultyDepartmentCode && f.facultyRole !== 'HOD'),
    [facultyDepartmentCode]
  );

  const selectedFacultySubjects = useMemo(() => {
    if (!form.facultyName) return departmentSubjects;
    const selectedFaculty = departmentFaculty.find(f => f.name === form.facultyName);
    if (!selectedFaculty) return departmentSubjects;
    return departmentSubjects.filter(subject =>
      selectedFaculty.assignedSubjects.includes(subject.code) || subject.assignedFaculty === selectedFaculty.name
    );
  }, [departmentFaculty, departmentSubjects, form.facultyName]);

  const timeSlots = examTimeSlots[form.examType] || examTimeSlots['Internal Exam'] || [
    { label: '09:00 AM - 10:30 AM', start: '09:00 AM', end: '10:30 AM' },
  ];

  const examTypeOptions: ExamType[] = [
    'Periodic Test 1',
    'Periodic Test 2',
    'Internal Exam',
    'Lab Exam',
    'Semester Exam',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      departmentCode: facultyDepartmentCode,
      subjectCode: form.subjectCode,
      subject: form.subject,
      facultyName: form.facultyName,
      examType: form.examType,
      year: form.year,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      venue: form.venue,
      semester: 6,
    };

    if (editingId) {
      updateExam(editingId, payload);
      setMessage('Exam timetable entry updated successfully.');
    } else {
      createExam(payload);
      setMessage('Exam timetable entry created successfully.');
    }

    setEditingId(null);
    setForm(defaultForm);
  };

  const handleEdit = (item: typeof myDepartmentExams[number]) => {
    setEditingId(item.id);
    setForm({
      subjectCode: item.subjectCode,
      subject: item.subject,
      facultyName: item.facultyName || '',
      examType: item.examType,
      year: item.year || 'III Year',
      date: item.date,
      startTime: item.startTime,
      endTime: item.endTime,
      venue: item.venue,
    });
    setMessage('Editing saved exam timetable entry.');
  };

  return (
    <div className="space-y-6 font-serif">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Create Exam Timetable</h1>
            <p className="text-sm text-slate-500">{facultyDepartmentName} • Department exam schedule</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Plus className="h-4 w-4 text-amber-600" /> New Exam Entry
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Faculty</label>
              <select value={form.facultyName} onChange={e => setForm({ ...form, facultyName: e.target.value, subjectCode: '', subject: '' })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                <option value="">Select faculty</option>
                {departmentFaculty.map(f => (
                  <option key={f.id} value={f.name}>{f.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
              <select value={form.subjectCode} onChange={e => {
                const selected = selectedFacultySubjects.find(s => s.code === e.target.value);
                setForm({ ...form, subjectCode: e.target.value, subject: selected?.name || form.subject });
              }} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                <option value="">Select subject</option>
                {selectedFacultySubjects.map(subject => (
                  <option key={subject.code} value={subject.code}>{subject.code} - {subject.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Exam Type</label>
              <select value={form.examType} onChange={e => {
                const nextType = e.target.value as ExamTimetableForm['examType'];
                const slotList = examTimeSlots[nextType];
                const firstSlot = slotList?.[0] || { start: '09:00 AM', end: '10:30 AM' };
                setForm({ ...form, examType: nextType, startTime: firstSlot.start, endTime: firstSlot.end });
              }} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                {examTypeOptions.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Year</label>
              <select value={form.year} onChange={e => setForm({ ...form, year: e.target.value as 'I Year' | 'II Year' | 'III Year' | 'IV Year' })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                <option>I Year</option>
                <option>II Year</option>
                <option>III Year</option>
                <option>IV Year</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot</label>
              <select value={`${form.startTime} - ${form.endTime}`} onChange={e => {
                const slot = timeSlots.find(s => `${s.start} - ${s.end}` === e.target.value);
                if (slot) setForm({ ...form, startTime: slot.start, endTime: slot.end });
              }} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                <option value="">Select time slot</option>
                {timeSlots.map(slot => (
                  <option key={slot.label} value={`${slot.start} - ${slot.end}`}>{slot.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Venue</label>
              <input value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
            </div>
          </div>

          {message && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> {message}
            </div>
          )}

          <button type="submit" className="w-full rounded-xl bg-amber-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-amber-700">{editingId ? 'Update Exam Timetable' : 'Save Exam Timetable'}</button>
        </form>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4">Created Exam Timetable</h2>
          {myDepartmentExams.length === 0 ? (
            <p className="text-xs text-slate-400">No exam timetable entries created yet.</p>
          ) : (
            <div className="space-y-3">
              {myDepartmentExams.slice(0, 8).map(item => (
                <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex justify-between gap-3">
                    <span className="text-xs font-bold text-slate-800">{item.subject}</span>
                    <span className="text-[11px] text-slate-500">{item.examType}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">{item.date} • {item.startTime} - {item.endTime}</p>
                  <p className="text-[11px] text-slate-500">{item.venue}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <button type="button" onClick={() => handleEdit(item)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-700">
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                    <button type="button" onClick={() => approveExam(item.id)} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white">
                      <ShieldCheck className="h-3 w-3" /> Final Approve
                    </button>
                    <button type="button" onClick={() => {
                      if (window.confirm('Delete this exam timetable entry?')) deleteExam(item.id);
                    }} className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-[10px] font-bold text-rose-700">
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-slate-500">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
