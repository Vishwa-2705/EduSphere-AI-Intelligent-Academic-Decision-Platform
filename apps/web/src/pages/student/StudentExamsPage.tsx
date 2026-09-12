import React from 'react';
import { Award, CalendarDays, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useFaculty } from '../../contexts/FacultyContext';
import { getStudentRecord } from '../../data/studentData';

const parseTimeToMinutes = (time: string) => {
  const cleaned = time.trim().toUpperCase();
  const [clockTime, modifier] = cleaned.split(' ');
  const [hourText, minuteText] = (clockTime || '00:00').split(':');
  let hour = Number(hourText || 0);
  const minutes = Number(minuteText || 0);

  if (modifier === 'PM' && hour < 12) hour += 12;
  if (modifier === 'AM' && hour === 12) hour = 0;

  return hour * 60 + minutes;
};

export const StudentExamsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { examSchedule } = useFaculty();
  const student = getStudentRecord(user?.email);
  const studentDepartment = (profile?.department as any)?.code || student.department;

  const approvedExams = [...examSchedule]
    .filter(exam => exam.departmentCode === studentDepartment && exam.status === 'Approved')
    .sort((a, b) => {
      const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime);
    });

  return (
    <div className="space-y-6 font-serif">
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-lavender mb-2 inline-block">Examinations</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Examinations</h1>
          </div>
          <div className="rounded-xl bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider">Published</p>
            <p className="text-sm font-bold">{approvedExams.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-lavender-200/80 shadow-sm p-6">
        {approvedExams.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No approved examination entries are available in this view.</p>
        ) : (
          <div className="space-y-3">
            {approvedExams.map(exam => (
              <div key={exam.id} className="rounded-xl border border-lavender-200 bg-lavender-50/50 p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-extrabold text-slate-900">{exam.subject}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-amber-700">{exam.examType}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 text-lavender-700" /> {exam.date}</div>
                  <div className="flex items-center gap-2"><Award className="h-3.5 w-3.5 text-lavender-700" /> {exam.startTime} - {exam.endTime}</div>
                  <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-lavender-700" /> {exam.venue}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
