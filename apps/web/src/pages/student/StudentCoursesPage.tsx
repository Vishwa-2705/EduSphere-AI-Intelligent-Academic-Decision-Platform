import React, { useState } from 'react';
import { BookOpen, Layers, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getDepartmentAcademicProfile, getStudentRecord } from '../../data/studentData';

export const StudentCoursesPage: React.FC = () => {
  const { user } = useAuth();
  const student = getStudentRecord(user?.email);
  const academicProfile = getDepartmentAcademicProfile(user?.email);
  const sixSubjects = academicProfile.courseCatalog;
  const [selectedCourse, setSelectedCourse] = useState<typeof sixSubjects[number]>(sixSubjects[0]);

  return (
    <div className="space-y-6 font-serif">
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-lavender mb-2 inline-block">Semester VI • Registered Courses</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">My Courses</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Academic curriculum, faculty allocation, credit weightage, and progress tracking</p>
          </div>
          <span className="badge-emerald self-start sm:self-auto text-sm px-3 py-1">6 Active Subjects</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          {sixSubjects.map((course) => {
            const isSelected = selectedCourse.code === course.code;
            return (
              <div
                key={course.code}
                onClick={() => setSelectedCourse(course)}
                className={`cursor-pointer rounded-2xl border p-5 transition duration-150 ${
                  isSelected ? 'bg-white border-lavender-500 shadow-md ring-2 ring-lavender-400/20' : 'bg-white border-lavender-200/80 hover:border-lavender-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs bg-lavender-100 text-lavender-900 border border-lavender-300 px-2.5 py-0.5 rounded-lg">{course.code}</span>
                  <span className="text-xs font-bold text-slate-500">{course.credits} Credits</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2.5 leading-snug">{course.subject}</h3>
                <p className="text-xs text-slate-500 mt-1">{course.description}</p>
                <div className="mt-4 pt-3 border-t border-lavender-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1"><User className="h-3.5 w-3.5 text-lavender-700" /><strong>{course.faculty}</strong></span>
                  <span className="font-mono text-lavender-700 font-bold">Progress: {course.progress}%</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-6 lg:col-span-7">
          <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 sm:p-7 shadow-sm">
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-lavender-100">
              <div>
                <span className="font-mono font-bold text-xs bg-lavender-700 text-white px-2.5 py-0.5 rounded-md">{selectedCourse.code}</span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-2">{selectedCourse.subject}</h2>
                <p className="text-xs text-slate-500 mt-1">{selectedCourse.description}</p>
              </div>
              <span className="badge-emerald text-xs">{selectedCourse.status}</span>
            </div>

            <div className="grid grid-cols-3 gap-3 my-5 text-center text-xs">
              <div className="p-3 rounded-xl bg-lavender-50 border border-lavender-200">
                <p className="text-slate-500 uppercase text-[10px] font-bold">Credits</p>
                <p className="text-lg font-bold text-slate-900 mt-0.5">{selectedCourse.credits}</p>
              </div>
              <div className="p-3 rounded-xl bg-lavender-50 border border-lavender-200">
                <p className="text-slate-500 uppercase text-[10px] font-bold">Progress</p>
                <p className="text-lg font-bold text-emerald-700 font-mono mt-0.5">{selectedCourse.progress}%</p>
              </div>
              <div className="p-3 rounded-xl bg-lavender-50 border border-lavender-200">
                <p className="text-slate-500 uppercase text-[10px] font-bold">Current Grade</p>
                <p className="text-lg font-bold text-lavender-800 font-mono mt-0.5">{selectedCourse.grade}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <BookOpen className="h-4 w-4 text-lavender-700" />
                <span>Course Overview</span>
              </div>
              <div className="rounded-xl border border-lavender-200 bg-lavender-50/40 p-4 text-sm text-slate-700">
                <p><strong>Faculty:</strong> {selectedCourse.faculty}</p>
                <p className="mt-1"><strong>Current status:</strong> {selectedCourse.status}</p>
              </div>

              <div className="pt-2">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2"><Layers className="h-4 w-4 text-lavender-700" /> Units / Modules</h3>
                <div className="space-y-3">
                  {selectedCourse.units.map((unit, index) => (
                    <div key={index} className="p-4 rounded-xl border border-lavender-200 bg-lavender-50/40 flex items-start gap-3">
                      <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-lavender-700 text-[10px] font-bold text-white">{index + 1}</div>
                      <div className="text-sm text-slate-700">{unit}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
