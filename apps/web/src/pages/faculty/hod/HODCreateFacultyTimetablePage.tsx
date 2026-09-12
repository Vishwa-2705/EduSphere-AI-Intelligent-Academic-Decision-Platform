import React, { useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Plus, Pencil, ShieldCheck, Trash2 } from 'lucide-react';
import { useFaculty } from '../../../contexts/FacultyContext';
import { facultyMembers, subjects } from '../../../data/facultyData';

type FacultyTimetableForm = {
  facultyName: string;
  subjectCode: string;
  subjectName: string;
  classYear: 'I Year' | 'II Year' | 'III Year' | 'IV Year';
  semester: number;
  section: 'A' | 'B';
  date: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  room: string;
};

const getWeekdayFromDate = (value: string): FacultyTimetableForm['day'] => {
  if (!value) return 'Monday';
  const date = new Date(`${value}T00:00:00`);
  const dayIndex = date.getDay();
  const map: Record<number, FacultyTimetableForm['day']> = {
    0: 'Monday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  };
  return map[dayIndex] ?? 'Monday';
};

const defaultForm: FacultyTimetableForm = {
  facultyName: '',
  subjectCode: 'CS401',
  subjectName: 'Data Structures',
  classYear: 'III Year',
  semester: 6,
  section: 'A',
  date: '2026-09-14',
  day: 'Monday',
  startTime: '09:00 AM',
  endTime: '10:00 AM',
  room: 'Tech Block A, Room 201',
};

export const HODCreateFacultyTimetablePage: React.FC = () => {
  const { facultyDepartmentCode, facultyDepartmentName, createFacultySchedule, updateFacultySchedule, deleteFacultySchedule, approveFacultySchedule, myDepartmentFacultySchedules } = useFaculty();
  const [form, setForm] = useState(defaultForm);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const departmentFaculty = useMemo(
    () => facultyMembers.filter(f => f.departmentCode === facultyDepartmentCode && f.facultyRole !== 'HOD'),
    [facultyDepartmentCode]
  );

  const departmentSubjects = useMemo(
    () => subjects.filter(s => s.departmentCode === facultyDepartmentCode),
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

  const timeSlots = [
    { label: '09:00 AM - 10:00 AM', start: '09:00 AM', end: '10:00 AM' },
    { label: '10:15 AM - 11:15 AM', start: '10:15 AM', end: '11:15 AM' },
    { label: '11:30 AM - 12:30 PM', start: '11:30 AM', end: '12:30 PM' },
    { label: '01:30 PM - 02:30 PM', start: '01:30 PM', end: '02:30 PM' },
    { label: '02:45 PM - 03:45 PM', start: '02:45 PM', end: '03:45 PM' },
    { label: '04:00 PM - 05:00 PM', start: '04:00 PM', end: '05:00 PM' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.facultyName) {
      setMessage('Please select a faculty member.');
      return;
    }

    const payload = {
      departmentCode: facultyDepartmentCode,
      facultyName: form.facultyName,
      facultyEmail: departmentFaculty.find(f => f.name === form.facultyName)?.email || `${form.facultyName.toLowerCase().replace(/\s+/g, '.')}@edusphere.ai`,
      subjectCode: form.subjectCode,
      subjectName: form.subjectName,
      classYear: form.classYear,
      semester: form.semester,
      section: form.section,
      date: form.date,
      day: form.day,
      startTime: form.startTime,
      endTime: form.endTime,
      room: form.room,
      status: 'Draft' as const,
    };

    if (editingId) {
      updateFacultySchedule(editingId, payload);
      setMessage('Faculty timetable entry updated successfully.');
    } else {
      createFacultySchedule(payload);
      setMessage('Faculty timetable entry created successfully.');
    }

    setEditingId(null);
    setForm({ ...defaultForm, facultyName: form.facultyName });
  };

  const handleEdit = (item: typeof myDepartmentFacultySchedules[number]) => {
    setEditingId(item.id);
    setForm({
      facultyName: item.facultyName,
      subjectCode: item.subjectCode,
      subjectName: item.subjectName,
      classYear: item.classYear,
      semester: item.semester,
      section: item.section,
      date: item.date || defaultForm.date,
      day: item.day,
      startTime: item.startTime,
      endTime: item.endTime,
      room: item.room,
    });
    setMessage('Editing saved faculty timetable entry.');
  };

  return (
    <div className="space-y-6 font-serif">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Create Faculty Timetable</h1>
            <p className="text-sm text-slate-500">{facultyDepartmentName} • Department schedule creation</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Plus className="h-4 w-4 text-violet-600" /> New Schedule Entry
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Faculty</label>
            <select value={form.facultyName} onChange={e => setForm({ ...form, facultyName: e.target.value, subjectCode: '', subjectName: '' })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              <option value="">Select faculty</option>
              {departmentFaculty.map(f => (
                <option key={f.id} value={f.name}>{f.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
              <select value={form.subjectCode} onChange={e => {
                const selected = selectedFacultySubjects.find(s => s.code === e.target.value);
                setForm({ ...form, subjectCode: e.target.value, subjectName: selected?.name || form.subjectName });
              }} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                <option value="">Select subject</option>
                {selectedFacultySubjects.map(subject => (
                  <option key={subject.code} value={subject.code}>{subject.code} - {subject.name}</option>
                ))}
              </select>
            </div>
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
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Year</label>
              <select value={form.classYear} onChange={e => setForm({ ...form, classYear: e.target.value as 'I Year' | 'II Year' | 'III Year' | 'IV Year' })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                <option>I Year</option>
                <option>II Year</option>
                <option>III Year</option>
                <option>IV Year</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Semester</label>
              <input type="number" value={form.semester} onChange={e => setForm({ ...form, semester: Number(e.target.value || 0) })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Section</label>
              <select value={form.section} onChange={e => setForm({ ...form, section: e.target.value as 'A' | 'B' })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                <option>A</option>
                <option>B</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value, day: getWeekdayFromDate(e.target.value) })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Day</label>
              <select
                value={form.day}
                disabled
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-600"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Room</label>
            <input value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
          </div>

          {message && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> {message}
            </div>
          )}

          <button type="submit" className="w-full rounded-xl bg-violet-700 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-violet-800">{editingId ? 'Update Faculty Timetable' : 'Save Faculty Timetable'}</button>
        </form>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4">Created Faculty Timetable</h2>
          {myDepartmentFacultySchedules.length === 0 ? (
            <p className="text-xs text-slate-400">No faculty timetable entries created yet.</p>
          ) : (
            <div className="space-y-3">
              {myDepartmentFacultySchedules.slice(0, 8).map(item => (
                <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex justify-between gap-3">
                    <span className="text-xs font-bold text-slate-800">{item.facultyName}</span>
                    <span className="text-[11px] text-slate-500">{item.day}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">{item.subjectCode} • {item.subjectName}</p>
                  <p className="text-[11px] text-slate-500">{item.classYear} • Section {item.section} • {item.startTime} - {item.endTime}</p>
                  <p className="text-[11px] text-slate-500">{item.room}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <button type="button" onClick={() => handleEdit(item)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-700">
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                    <button type="button" onClick={() => approveFacultySchedule(item.id)} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white">
                      <ShieldCheck className="h-3 w-3" /> Final Approve
                    </button>
                    <button type="button" onClick={() => {
                      if (window.confirm('Delete this faculty timetable entry?')) deleteFacultySchedule(item.id);
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
