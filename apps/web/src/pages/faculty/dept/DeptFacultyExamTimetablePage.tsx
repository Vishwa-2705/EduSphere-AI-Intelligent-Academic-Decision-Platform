import React from 'react';
import { Calendar, Clock, MapPin, Award } from 'lucide-react';
import { useFaculty } from '../../../contexts/FacultyContext';

export const DeptFacultyExamTimetablePage: React.FC = () => {
  const { myDepartmentExams, facultyDepartmentName } = useFaculty();
  const approvedExams = myDepartmentExams.filter(item => item.status === 'Approved');

  return (
    <div className="space-y-6 font-serif">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-amber mb-2 inline-block">Approved exams</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Exam Timetable</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">{facultyDepartmentName} • HOD-approved examination schedule</p>
          </div>
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider">Approved</p>
            <p className="text-sm font-bold">{approvedExams.length} exams</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {approvedExams.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No approved exam timetable entries for this department yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {approvedExams.map(item => (
              <div key={item.id} className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <p className="text-sm font-extrabold text-slate-900">{item.subject}</p>
                    <p className="text-[11px] text-slate-500">{item.subjectCode} • {item.examType}</p>
                  </div>
                  <span className="badge-amber text-[10px]">{item.year}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-amber-700" /> {item.date}</div>
                  <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-amber-700" /> {item.startTime} - {item.endTime}</div>
                  <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-amber-700" /> {item.venue}</div>
                  <div className="flex items-center gap-2"><Award className="h-3.5 w-3.5 text-amber-700" /> Faculty: {item.facultyName || 'TBA'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
