import React from 'react';
import { MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getDepartmentAcademicProfile } from '../../data/studentData';

export const StudentExamsPage: React.FC = () => {
  const { user } = useAuth();
  const examSchedule = getDepartmentAcademicProfile(user?.email).examSchedule;
  return (
    <div className="space-y-6 font-serif">
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-lavender mb-2 inline-block">Academic Evaluation</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Examinations</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Internal assessments, model exams, and end semester examination schedule</p>
          </div>
          <span className="badge-emerald text-sm px-3 py-1">12 Scheduled</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-lavender-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-lavender-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Exam Schedule</h3>
          <span className="badge-lavender">All 6 Subjects</span>
        </div>

        <div className="overflow-x-auto">
          <table className="edusphere-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Exam Type</th>
                <th>Date</th>
                <th>Time</th>
                <th>Venue</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {examSchedule.map((exam, index) => (
                <tr key={`${exam.subject}-${exam.type}-${index}`}>
                  <td><span className="font-mono font-bold text-lavender-800 mr-2">{exam.subject}</span></td>
                  <td><span className="badge-lavender text-[10px]">{exam.type}</span></td>
                  <td className="font-mono text-slate-700">{exam.date}</td>
                  <td className="font-mono text-slate-700">{exam.time}</td>
                  <td className="text-slate-700"><span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-lavender-700" />{exam.venue}</span></td>
                  <td><span className="badge-emerald">{exam.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
