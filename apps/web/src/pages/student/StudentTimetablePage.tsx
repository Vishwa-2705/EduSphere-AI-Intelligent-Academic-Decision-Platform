import React, { useState } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../contexts/AuthContext';
import { getDepartmentAcademicProfile, getStudentRecord } from '../../data/studentData';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const StudentTimetablePage: React.FC = () => {
  const { user } = useAuth();
  const student = getStudentRecord(user?.email);
  const academicProfile = getDepartmentAcademicProfile(user?.email);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const currentSlots = academicProfile.timetableByDay[selectedDay as keyof typeof academicProfile.timetableByDay] || [];

  return (
    <div className="space-y-6 font-serif">
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-lavender mb-2 inline-block">{student.semester} • Weekly Schedule</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Timetable</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Class timings, subjects, faculty, and room allocations across the week</p>
          </div>
          <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-lavender-700" /><span className="badge-emerald text-xs px-3 py-1">{student.department}</span></div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {days.map((day) => (
          <button key={day} onClick={() => setSelectedDay(day)} className={clsx('px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition duration-150', selectedDay === day ? 'bg-lavender-700 text-white shadow-md shadow-lavender-700/20' : 'bg-white border border-lavender-200 text-slate-700 hover:bg-lavender-50')}>
            {day}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-lavender-200/80 shadow-sm overflow-hidden p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-lavender-100 flex items-center justify-between">
          <span>{selectedDay} Schedule</span>
          <span className="text-xs text-slate-500 font-mono">{currentSlots.length} Sessions</span>
        </h3>

        <div className="space-y-4">
          {currentSlots.map((slot, index) => (
            <div key={`${slot.time}-${index}`} className="p-4 sm:p-5 rounded-2xl border border-lavender-200 bg-lavender-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-lavender-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm">{index + 1}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-lavender-100 text-lavender-900 border border-lavender-300 px-2 py-0.5 rounded-md">{slot.subject}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-mono"><Clock className="h-3.5 w-3.5 text-lavender-700" />{slot.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-lavender-700" />{slot.room}</span>
                  </div>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs text-slate-500">Faculty</p>
                <p className="font-bold text-slate-900">{slot.faculty}</p>
                <span className="badge-emerald text-[10px] mt-2 inline-block">{slot.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
