import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useFaculty } from '../../../contexts/FacultyContext';

export const DeptFacultyTimetablePage: React.FC = () => {
  const { myDepartmentFacultySchedules, facultyDepartmentName } = useFaculty();
  const approvedEntries = myDepartmentFacultySchedules.filter(item => item.status === 'Approved');

  return (
    <div className="space-y-6 font-serif">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-violet mb-2 inline-block">Approved timetable</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Faculty Timetable</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">{facultyDepartmentName} • HOD-approved faculty schedule</p>
          </div>
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider">Approved</p>
            <p className="text-sm font-bold">{approvedEntries.length} entries</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {approvedEntries.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No approved faculty timetable entries for this department yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {approvedEntries.map(item => (
              <div key={item.id} className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <p className="text-sm font-extrabold text-slate-900">{item.facultyName}</p>
                    <p className="text-[11px] text-slate-500">{item.subjectCode} • {item.subjectName}</p>
                  </div>
                  <span className="badge-violet text-[10px]">{item.classYear} • Sec {item.section}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-violet-700" /> {item.day}</div>
                  <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-violet-700" /> {item.startTime} - {item.endTime}</div>
                  <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-violet-700" /> {item.room}</div>
                  <div className="flex items-center gap-2"><span className="font-mono text-violet-700 font-bold">Sem {item.semester}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
