import React from 'react';
import { BadgeCheck, BookOpen, CalendarDays, Contact, MapPin, ShieldCheck, UserRound } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getStudentRecord } from '../../data/studentData';

export const StudentProfilePage: React.FC = () => {
  const { user } = useAuth();
  const student = getStudentRecord(user?.email);
  return (
    <div className="space-y-6 font-serif">
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-lavender mb-2 inline-block">Student Identity</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">My Profile</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Academic and personal details for the active student record</p>
          </div>
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider">Academic Status</p>
            <p className="text-sm font-bold">{student.academicStatus}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4">
          <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lavender-700 text-2xl font-bold text-white">
                AP
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">{student.name}</h2>
                <p className="text-xs text-lavender-700 font-bold">Register No: {student.registerNumber}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm text-slate-700">
              <div className="flex items-center gap-3 rounded-xl bg-lavender-50 border border-lavender-100 p-3">
                <BookOpen className="h-4 w-4 text-lavender-700" />
                <span><strong>Programme:</strong> {student.programme}</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-lavender-50 border border-lavender-100 p-3">
                <BadgeCheck className="h-4 w-4 text-lavender-700" />
                <span><strong>Department:</strong> {student.department}</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-lavender-50 border border-lavender-100 p-3">
                <CalendarDays className="h-4 w-4 text-lavender-700" />
                <span><strong>Semester:</strong> {student.semester} • {student.academicYear}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-lavender-100 flex items-center gap-2">
              <UserRound className="h-4 w-4 text-lavender-700" />
              Personal & Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
              <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Email</p><p className="font-bold text-slate-900">{student.email}</p></div>
              <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Phone</p><p className="font-bold text-slate-900">{student.phone}</p></div>
              <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Date of Birth</p><p className="font-bold text-slate-900">{student.dob}</p></div>
              <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Academic Year</p><p className="font-bold text-slate-900">{student.academicYear}</p></div>
              <div className="md:col-span-2 p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Address</p><p className="font-bold text-slate-900">{student.address}</p></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-lavender-100 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-lavender-700" />
              Guardian & Emergency Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
              <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Guardian</p><p className="font-bold text-slate-900">{student.guardian}</p></div>
              <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Guardian Phone</p><p className="font-bold text-slate-900">{student.guardianPhone}</p></div>
              <div className="md:col-span-2 p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Emergency Contact</p><p className="font-bold text-slate-900">{student.emergencyContact}</p></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-lavender-100 flex items-center gap-2">
              <Contact className="h-4 w-4 text-lavender-700" />
              Academic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
              <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Programme</p><p className="font-bold text-slate-900">{student.programme}</p></div>
              <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Admission Type</p><p className="font-bold text-slate-900">{student.admissionType}</p></div>
              <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Department</p><p className="font-bold text-slate-900">{student.department}</p></div>
              <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Current Semester</p><p className="font-bold text-slate-900">{student.semester}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
