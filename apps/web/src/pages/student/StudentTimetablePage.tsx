import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useFaculty } from '../../contexts/FacultyContext';
import { getStudentRecord } from '../../data/studentData';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const formatDisplayDate = (date?: string) => {
  if (!date) return 'Date not available';
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const StudentTimetablePage: React.FC = () => {
  const { user, profile } = useAuth();
  const { departmentSchedules } = useFaculty();
  const student = getStudentRecord(user?.email);
  const studentDepartment = (profile?.department as any)?.code || student.department;

  const approvedEntries = [...departmentSchedules]
    .filter(item => item.departmentCode === studentDepartment && item.status === 'Approved')
    .sort((a, b) => {
      const aDate = a.date ? new Date(`${a.date}T00:00:00`).getTime() : Number.MAX_SAFE_INTEGER;
      const bDate = b.date ? new Date(`${b.date}T00:00:00`).getTime() : Number.MAX_SAFE_INTEGER;
      const dateDiff = aDate - bDate;
      if (dateDiff !== 0) return dateDiff;
      const aStart = Number((a.startTime || '').replace(/[^\d]/g, '')) || 0;
      const bStart = Number((b.startTime || '').replace(/[^\d]/g, '')) || 0;
      return aStart - bStart;
    });

  const grouped = days.map(day => ({
    day,
    entries: approvedEntries.filter(item => item.day === day),
  }));

  return (
    <div className="space-y-6 font-serif">
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-lavender mb-2 inline-block">Weekly Schedule</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Timetable</h1>
          </div>
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider">Approved</p>
            <p className="text-sm font-bold">{approvedEntries.length} entries</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {grouped.map(dayGroup => (
          <div key={dayGroup.day} className="bg-white rounded-2xl border border-lavender-200/80 shadow-sm p-5">
            <h3 className="text-base font-bold text-slate-900 mb-4">{dayGroup.day}</h3>
            {dayGroup.entries.length === 0 ? (
              <p className="text-sm text-slate-400">No approved timetable entries for this day.</p>
            ) : (
              <div className="space-y-3">
                {dayGroup.entries.map(item => (
                  <div key={item.id} className="rounded-xl border border-lavender-200 bg-lavender-50/50 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h4 className="text-sm font-extrabold text-slate-900">{item.subjectName}</h4>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">{item.subjectCode}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 text-xs text-slate-600">
                      <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-lavender-700" /> Date: {formatDisplayDate(item.date)}</div>
                      <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-lavender-700" /> Day: {item.day}</div>
                      <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-lavender-700" /> {item.startTime} - {item.endTime}</div>
                      <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-lavender-700" /> {item.room || item.year}</div>
                    </div>
                    <div className="mt-2 flex flex-col gap-1 text-[11px] text-slate-500">
                      <p>Year: {item.year} • Section {item.section}</p>
                      <p>Faculty: {item.facultyName}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
