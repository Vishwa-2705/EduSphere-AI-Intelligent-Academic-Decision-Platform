import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { MetricCard } from '../../components/common/MetricCard';
import {
  BookOpen,
  Users,
  CalendarCheck,
  Award,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  FileCheck,
  ChevronRight,
  BarChart3,
  AlertCircle,
  Download,
} from 'lucide-react';
import clsx from 'clsx';

export const FacultyDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get('/dashboard/faculty');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load faculty console.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center font-serif">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm font-bold text-slate-700">Loading Faculty Instruction Console...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-serif">
        <div className="flex items-center gap-2 font-bold text-base">
          <AlertCircle className="h-5 w-5" />
          <span>System Notice</span>
        </div>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );
  }

  const metrics = data?.metrics || {
    assignedCoursesCount: 3,
    totalStudentsTaught: 142,
    classesConductedThisMonth: 28,
    pendingGradingCount: 2,
    averageClassAttendance: 84.5,
  };

  const assignedCourses = data?.assignedCourses || [];
  const todayLectures = data?.todayLectures || [];
  const actionRequired = data?.actionRequired || [];

  const upcomingExams = [
    { code: 'CS401', subject: 'Design & Analysis of Algorithms', date: 'March 14', type: 'Mid-Term', duty: 'Chief Invigilator' },
    { code: 'CS402', subject: 'Database Management Systems', date: 'March 18', type: 'Mid-Term', duty: 'Paper Setter' },
    { code: 'CS403', subject: 'Artificial Intelligence & ML', date: 'March 22', type: 'Mid-Term', duty: 'Evaluator' },
  ];

  const flaggedStudents = [
    { name: 'Rohit Kumar', rollNo: '22CS105', course: 'CS401 Algorithms', attendance: 58, level: 'critical' },
    { name: 'Priya Sharma', rollNo: '22CS091', course: 'CS401 Algorithms', attendance: 72, level: 'warning' },
    { name: 'Mehul Joshi', rollNo: '22CS078', course: 'CS402 DBMS', attendance: 69, level: 'warning' },
  ];

  return (
    <div className="space-y-6 font-serif">
      {/* Welcome Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-bold text-emerald-700 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Academic Session 2025–2026 • Semester VI Teaching Cycle</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome, {profile?.fullName || 'Dr. Rajesh Sharma'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Designation: <strong className="text-slate-800">{profile?.designation || 'Associate Professor & Algorithm Lab Lead'}</strong> • Dept. of Computer Science & Engineering • Cabin: <strong className="text-slate-800">{profile?.cabinNumber || 'Tech Block B, Room 304'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm shadow-indigo-200/50 transition flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Mark Class Roll Call</span>
            </button>
          </div>
        </div>

        {/* Quick Info Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Users className="h-4 w-4 text-indigo-500" />
            <span><strong>Active Cohorts:</strong> B.Tech CSE Sections A & B (Sem VI)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <CalendarCheck className="h-4 w-4 text-emerald-500" />
            <span><strong>Class Avg Attendance:</strong> <span className="font-mono font-bold text-emerald-600">84.5%</span></span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <FileCheck className="h-4 w-4 text-rose-500" />
            <span><strong>Evaluation Queue:</strong> <span className="font-bold text-rose-600">2 Rubrics Pending</span></span>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Assigned Subjects"
          value={metrics.assignedCoursesCount}
          subtext="Undergraduate Semester VI"
          icon={BookOpen}
          variant="indigo"
        />
        <MetricCard
          title="Enrolled Students"
          value={metrics.totalStudentsTaught}
          subtext="Across 3 assigned batches"
          icon={Users}
          variant="slate"
        />
        <MetricCard
          title="Lectures Conducted"
          value={metrics.classesConductedThisMonth}
          subtext="Current month total"
          icon={CalendarCheck}
          variant="emerald"
          trend={{ value: 'Target: 32', isNeutral: true }}
        />
        <MetricCard
          title="Pending Evaluations"
          value={metrics.pendingGradingCount}
          subtext="Internal assessment rubrics"
          icon={Award}
          variant="rose"
          trend={{ value: 'Action Required', isPositive: false }}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Today's Schedule & Courses */}
        <div className="space-y-6 lg:col-span-8">

          {/* Today's Lectures */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Today's Teaching Schedule</h3>
                <p className="text-xs text-slate-500">Class sessions and roll-call registry for today</p>
              </div>
              <span className="badge-emerald">{todayLectures.length || 2} Sessions</span>
            </div>

            <div className="p-6 divide-y divide-slate-100">
              {todayLectures.length === 0 ? (
                // Static demo data when no API data
                [
                  { courseCode: 'CS401', courseName: 'Design & Analysis of Algorithms', batch: 'B.Tech CSE Section A (22CS-A)', time: '09:00 AM – 10:00 AM', room: 'Lecture Hall 101', attendanceMarked: true, present: 52, total: 58 },
                  { courseCode: 'CS402', courseName: 'Database Management Systems', batch: 'B.Tech CSE Section B (22CS-B)', time: '02:00 PM – 03:00 PM', room: 'Lecture Hall 203', attendanceMarked: false, present: 0, total: 60 },
                ].map((lec, i) => (
                  <div key={i} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        0{i + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 px-1.5 py-0.5 rounded-md">
                            {lec.courseCode}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">{lec.courseName}</h4>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{lec.batch}</p>
                        <div className="mt-1.5 flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="h-3.5 w-3.5 text-indigo-500" />{lec.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-indigo-500" />{lec.room}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right flex-shrink-0">
                      {lec.attendanceMarked ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Marked ({lec.present}/{lec.total})
                        </span>
                      ) : (
                        <button className="px-3.5 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition shadow-sm">
                          Mark Roll Call →
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                todayLectures.map((lec: any, i: number) => (
                  <div key={i} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        0{i + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 px-1.5 py-0.5 rounded-md">
                            {lec.courseCode}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">{lec.courseName}</h4>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{lec.batch}</p>
                        <div className="mt-1.5 flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="h-3.5 w-3.5 text-indigo-500" />{lec.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-indigo-500" />{lec.room}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                      {lec.attendanceMarked ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Marked ({lec.present}/{lec.total})
                        </span>
                      ) : (
                        <button className="px-3.5 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition shadow-sm">
                          Mark Roll Call →
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Assigned Courses */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Course Catalog & Syllabus Progress</h3>
                <p className="text-xs text-slate-500">Subject codes, credit weightages and curriculum units</p>
              </div>
              <span className="badge-indigo">{assignedCourses.length || 3} Courses</span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {(assignedCourses.length > 0 ? assignedCourses : [
                { code: 'CS401', title: 'Design & Analysis of Algorithms', credits: 4, description: 'Covers algorithm design paradigms: dynamic programming, greedy algorithms, graph algorithms, and computational complexity.', syllabusTopics: [1,2,3,4] },
                { code: 'CS402', title: 'Database Management Systems', credits: 4, description: 'Relational models, SQL, normalization, indexing, B+ trees, transaction management, and distributed databases.', syllabusTopics: [1,2,3,4] },
                { code: 'CS403', title: 'Artificial Intelligence & ML', credits: 4, description: 'Supervised and unsupervised learning, neural networks, model evaluation, and explainability techniques.', syllabusTopics: [1,2,3,4] },
              ]).map((c: any, i: number) => (
                <div key={c._id || i} className="p-4 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-sm transition bg-slate-50/40">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-md">
                      {c.code}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{c.credits} Credits</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">{c.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-snug line-clamp-2">{c.description}</p>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-500">{c.syllabusTopics?.length || 4} Curriculum Units</span>
                    <button className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition">
                      View Syllabus <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Examinations */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Examination Duties & Schedule</h3>
                <p className="text-xs text-slate-500">Invigilator assignments and paper evaluation duties</p>
              </div>
              <span className="badge-purple">Semester VI</span>
            </div>
            <div className="overflow-x-auto">
              <table className="edusphere-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Exam Date</th>
                    <th>Type</th>
                    <th>Duty</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingExams.map((ex, i) => (
                    <tr key={i}>
                      <td>
                        <span className="font-mono text-indigo-600 font-bold mr-1.5">{ex.code}</span>
                        <span className="text-xs text-slate-500">{ex.subject}</span>
                      </td>
                      <td className="font-mono text-slate-700">{ex.date}</td>
                      <td><span className="badge-purple">{ex.type}</span></td>
                      <td><span className="badge-emerald">{ex.duty}</span></td>
                      <td>
                        <button className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1">
                          <Download className="h-3.5 w-3.5" /> Download Hall Plan
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Action Items & Flagged Students */}
        <div className="space-y-6 lg:col-span-4">
          {/* Immediate Action Queue */}
          <div className="bg-white rounded-2xl border border-rose-200/80 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-rose-100 flex items-center gap-2 bg-rose-50/60">
              <FileCheck className="h-4 w-4 text-rose-600" />
              <div>
                <h3 className="text-sm font-bold text-rose-900">Immediate Action Queue</h3>
                <p className="text-xs text-rose-600">{actionRequired.length || 2} tasks pending your attention</p>
              </div>
            </div>

            <div className="p-5 space-y-3">
              {(actionRequired.length > 0 ? actionRequired : [
                { title: 'Submit IA-1 Marks: CS401 Algorithms', priority: 'URGENT', deadline: 'March 10, 2026' },
                { title: 'Upload Question Paper: CS402 DBMS', priority: 'HIGH', deadline: 'March 12, 2026' },
              ]).map((act: any, i: number) => (
                <div key={act.id || i} className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/80">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-rose-900 flex-1">{act.title}</p>
                    <span className={clsx(
                      'rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap',
                      act.priority === 'URGENT' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                    )}>
                      {act.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-600 mt-1">Due: {act.deadline}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Shortage Alerts */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Attendance Shortage Alerts</h3>
                <p className="text-xs text-slate-500">Students below 75% statutory minimum</p>
              </div>
            </div>

            <div className="p-5 space-y-3">
              {flaggedStudents.map((s, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{s.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{s.rollNo}</p>
                    </div>
                    <span className={clsx(
                      'rounded-full px-2 py-0.5 text-[10px] font-bold',
                      s.level === 'critical' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    )}>
                      {s.attendance}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{s.course}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={clsx('h-1.5 rounded-full', s.level === 'critical' ? 'bg-rose-500' : 'bg-amber-500')}
                        style={{ width: `${s.attendance}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">75% min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Performance Overview */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Class Performance Summary</h3>
                <p className="text-xs text-slate-500">Semester VI cohort overview</p>
              </div>
            </div>
            <div className="mt-4 space-y-3 text-xs">
              {[
                { label: 'Average Class Score', value: '74.2 / 100', color: 'bg-indigo-500', pct: 74 },
                { label: 'Submission Rate', value: '89%', color: 'bg-emerald-500', pct: 89 },
                { label: 'Students Passed (≥40)', value: '138 / 142', color: 'bg-purple-500', pct: 97 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1 text-slate-700">
                    <span>{item.label}</span>
                    <span className="font-bold">{item.value}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className={clsx('h-2 rounded-full transition-all', item.color)} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
