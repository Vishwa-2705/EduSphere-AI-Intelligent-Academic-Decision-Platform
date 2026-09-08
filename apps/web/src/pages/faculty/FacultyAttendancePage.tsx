import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { CalendarCheck, CheckCircle2, AlertTriangle, Users, Clock, MapPin, Send } from 'lucide-react';
import clsx from 'clsx';

export const FacultyAttendancePage: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [courseAttendance, setCourseAttendance] = useState<any>(null);
  const [rosterStatus, setRosterStatus] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'>>({});
  const [topicCovered, setTopicCovered] = useState('Dynamic Programming - Knapsack & Matrix Chain');
  const [slotTime, setSlotTime] = useState('09:00 AM - 10:00 AM');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await api.get('/academics/my-courses');
        if (res.data.success && res.data.data.length > 0) {
          setCourses(res.data.data);
          setSelectedCourseId(res.data.data[0].courseId);
        }
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;
    const fetchAttendance = async () => {
      try {
        const res = await api.get(`/attendance/course/${selectedCourseId}`);
        if (res.data.success) {
          setCourseAttendance(res.data.data);
          // Initialize roster status map default to PRESENT
          const initial: Record<string, 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'> = {};
          res.data.data.studentRoster?.forEach((s: any) => {
            initial[s.studentId] = 'PRESENT';
          });
          setRosterStatus(initial);
        }
      } catch (err) {
        console.error('Failed to load course attendance:', err);
      }
    };
    fetchAttendance();
  }, [selectedCourseId]);

  const handleStatusChange = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED') => {
    setRosterStatus((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status: 'PRESENT' | 'ABSENT') => {
    const updated: Record<string, 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'> = {};
    courseAttendance?.studentRoster?.forEach((s: any) => {
      updated[s.studentId] = status;
    });
    setRosterStatus(updated);
  };

  const handleSubmitRollCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) return;

    try {
      setIsSubmitting(true);
      const records = Object.keys(rosterStatus).map((studentId) => ({
        studentId,
        status: rosterStatus[studentId],
      }));

      const res = await api.post('/attendance/sessions', {
        courseId: selectedCourseId,
        date: new Date(),
        slotTime,
        topicCovered,
        records,
      });

      if (res.data.success) {
        setFeedbackMsg(res.data.message);
        setTimeout(() => setFeedbackMsg(null), 4000);
        // Refresh roster
        const refreshRes = await api.get(`/attendance/course/${selectedCourseId}`);
        if (refreshRes.data.success) {
          setCourseAttendance(refreshRes.data.data);
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center font-serif">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-lavender-700 border-t-transparent" />
          <p className="text-sm font-bold text-slate-700">Loading Attendance Registry Console...</p>
        </div>
      </div>
    );
  }

  const roster = courseAttendance?.studentRoster || [];
  const shortageList = roster.filter((s: any) => s.isShortage);

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-lavender mb-2 inline-block">Faculty Instruction Console</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Class Attendance & Roll-Call Registry
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Mark live session attendance, monitor student shortages, and update official records
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-lavender-50 border border-lavender-300 text-xs font-bold text-slate-900 font-serif focus:outline-none focus:ring-2 focus:ring-lavender-500/20"
            >
              {courses.map((c) => (
                <option key={c.courseId} value={c.courseId}>
                  {c.code} – {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-serif flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left 8 Cols: Roll Call Form */}
        <div className="space-y-6 lg:col-span-8">
          <div className="bg-white rounded-2xl border border-lavender-200/80 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-lavender-100 gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Record Live Session Roll-Call</h3>
                <p className="text-xs text-slate-500">Select attendance status for each enrolled student</p>
              </div>

              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleMarkAll('PRESENT')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-bold transition"
                >
                  Mark All Present
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkAll('ABSENT')}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 font-bold transition"
                >
                  Mark All Absent
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitRollCall} className="space-y-4">
              {/* Session Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={slotTime}
                    onChange={(e) => setSlotTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-lavender-50/50 border border-slate-200 text-xs font-serif"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Topic Covered</label>
                  <input
                    type="text"
                    value={topicCovered}
                    onChange={(e) => setTopicCovered(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-lavender-50/50 border border-slate-200 text-xs font-serif"
                  />
                </div>
              </div>

              {/* Student Roster List */}
              <div className="divide-y divide-lavender-100 border border-lavender-200 rounded-xl overflow-hidden">
                {roster.map((s: any) => {
                  const currentStatus = rosterStatus[s.studentId] || 'PRESENT';
                  return (
                    <div key={s.studentId} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-lavender-50/40 transition">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">{s.fullName}</span>
                          <span className="font-mono text-xs text-slate-400">({s.registrationNo})</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Current: <strong className="font-mono">{s.attendancePercentage}%</strong> ({s.attendedClasses}/{s.totalClasses} classes)
                        </p>
                      </div>

                      {/* Status Toggle Buttons */}
                      <div className="flex gap-1.5 text-xs font-bold font-serif">
                        {(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(s.studentId, st)}
                            className={clsx(
                              'px-2.5 py-1 rounded-lg border text-[11px] transition',
                              currentStatus === st
                                ? st === 'PRESENT' ? 'bg-emerald-600 text-white border-emerald-600' :
                                  st === 'ABSENT' ? 'bg-rose-600 text-white border-rose-600' :
                                  st === 'LATE' ? 'bg-amber-500 text-white border-amber-500' :
                                  'bg-slate-700 text-white border-slate-700'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            )}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting || roster.length === 0}
                  className="w-full py-3 rounded-xl bg-lavender-700 hover:bg-lavender-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-lavender-700/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubmitting ? 'Recording Attendance...' : 'Submit Session Roll-Call'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right 4 Cols: Shortage Warnings */}
        <div className="space-y-6 lg:col-span-4">
          <div className="bg-white rounded-2xl border border-rose-200 shadow-sm p-5">
            <div className="flex items-center gap-2 pb-3 border-b border-rose-100">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              <div>
                <h3 className="text-sm font-bold text-rose-900">Attendance Shortages (&lt;75%)</h3>
                <p className="text-[11px] text-rose-600">{shortageList.length} students currently ineligible</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {shortageList.map((s: any) => (
                <div key={s.studentId} className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-900">{s.fullName}</span>
                    <span className="font-mono font-bold text-rose-700">{s.attendancePercentage}%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{s.registrationNo}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
