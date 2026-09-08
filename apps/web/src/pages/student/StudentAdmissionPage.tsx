import React from 'react';
import { BadgeCheck, BookOpen, FileText, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getStudentRecord } from '../../data/studentData';

export const StudentAdmissionPage: React.FC = () => {
  const { user } = useAuth();
  const student = getStudentRecord(user?.email);
  const admission = {
    studentName: student.name,
    registerNumber: student.registerNumber,
    programme: student.programme,
    department: student.department,
    admissionYear: student.admissionYear,
    admissionType: student.admissionType,
    dateOfAdmission: student.dateOfAdmission,
    academicYear: student.academicYear,
    parentGuardian: student.guardian,
    contact: student.guardianPhone,
    documentStatus: 'Verification Complete',
  };

  return (
    <div className="space-y-6 font-serif">
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-lavender mb-2 inline-block">Admissions Record</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Admission Details</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Academic intake and official documentation records</p>
          </div>
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider">Document Status</p>
            <p className="text-sm font-bold">{admission.documentStatus}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-5 pb-3 border-b border-lavender-100 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-lavender-700" /> Admission Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
          <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Student Name</p><p className="font-bold text-slate-900">{admission.studentName}</p></div>
          <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Register Number</p><p className="font-bold text-slate-900">{admission.registerNumber}</p></div>
          <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Programme</p><p className="font-bold text-slate-900">{admission.programme}</p></div>
          <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Department</p><p className="font-bold text-slate-900">{admission.department}</p></div>
          <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Admission Year</p><p className="font-bold text-slate-900">{admission.admissionYear}</p></div>
          <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Admission Type</p><p className="font-bold text-slate-900">{admission.admissionType}</p></div>
          <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Date of Admission</p><p className="font-bold text-slate-900">{admission.dateOfAdmission}</p></div>
          <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Academic Year</p><p className="font-bold text-slate-900">{admission.academicYear}</p></div>
          <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Parent / Guardian</p><p className="font-bold text-slate-900">{admission.parentGuardian}</p></div>
          <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Contact</p><p className="font-bold text-slate-900">{admission.contact}</p></div>
          <div className="md:col-span-2 p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Document Status</p><p className="font-bold text-emerald-700">{admission.documentStatus}</p></div>
        </div>
      </div>
    </div>
  );
};
