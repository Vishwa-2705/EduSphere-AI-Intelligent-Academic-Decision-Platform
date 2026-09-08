import React, { useState } from 'react';
import { subjects } from '../../../data/facultyData';
import { useFaculty } from '../../../contexts/FacultyContext';
import { BookOpen, Users, FileText, CheckCircle2, Clock, Upload, ChevronRight, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DeptFacultySubjectsPage: React.FC = () => {
  const { materials, facultyDepartmentCode, facultyDepartmentName } = useFaculty();
  const [selectedSemester, setSelectedSemester] = useState<number | 'ALL'>('ALL');

  // Subjects assigned to the faculty's department
  const mySubjects = subjects.filter(s => s.departmentCode === facultyDepartmentCode);

  const filteredSubjects = selectedSemester === 'ALL'
    ? mySubjects
    : mySubjects.filter(s => s.semester === selectedSemester);

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-2">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{facultyDepartmentName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Assigned Subjects
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Active course allocations, enrolled student cohorts, and syllabus material repository status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/faculty/dept/submit"
              className="px-4 py-2.5 rounded-xl bg-violet-700 hover:bg-violet-800 text-white font-bold text-xs shadow-sm transition flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              <span>Submit Study Material</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSubjects.map(subj => {
          const subjMaterials = materials.filter(m => m.subjectCode === subj.code);
          const approvedCount = subjMaterials.filter(m => m.status === 'Approved').length;
          const pendingCount = subjMaterials.filter(m => ['Submitted', 'Under Verification', 'Resubmitted'].includes(m.status)).length;

          return (
            <div key={subj.code} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-violet-50 text-violet-700 border border-violet-200">
                      {subj.code}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Semester {subj.semester} • {subj.credits} Credits
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 leading-snug">
                    {subj.name}
                  </h2>
                </div>
                <div className="h-10 w-10 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center flex-shrink-0">
                  <Layers className="h-5 w-5" />
                </div>
              </div>

              {/* Stats Badges */}
              <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="font-bold text-slate-800">{subj.totalStudents}</p>
                    <p className="text-[10px] text-slate-400">Students</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <div>
                    <p className="font-bold text-emerald-700">{approvedCount}</p>
                    <p className="text-[10px] text-slate-400">Approved Docs</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <div>
                    <p className="font-bold text-amber-700">{pendingCount}</p>
                    <p className="text-[10px] text-slate-400">In Verification</p>
                  </div>
                </div>
              </div>

              {/* Units Breakdown */}
              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Curriculum Units Coverage ({subj.units} Units)
                </p>
                <div className="flex gap-2">
                  {Array.from({ length: subj.units }).map((_, idx) => {
                    const unitNum = idx + 1;
                    const unitMaterials = subjMaterials.filter(m => m.unit === unitNum && m.status === 'Approved');
                    const hasApproved = unitMaterials.length > 0;

                    return (
                      <div
                        key={unitNum}
                        className={`flex-1 py-2 rounded-xl text-center border text-xs font-bold ${
                          hasApproved
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                        title={`Unit ${unitNum}: ${hasApproved ? `${unitMaterials.length} approved materials` : 'No approved materials yet'}`}
                      >
                        U{unitNum}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  Sections: <strong className="text-slate-700">{subj.sections?.join(', ') || 'A'}</strong>
                </span>
                <Link
                  to="/faculty/dept/submit"
                  className="text-xs font-bold text-violet-700 hover:text-violet-900 flex items-center gap-1"
                >
                  Upload Unit Material <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
