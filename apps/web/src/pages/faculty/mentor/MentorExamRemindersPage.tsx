import React, { useState } from 'react';
import { useFaculty } from '../../../contexts/FacultyContext';
import { ExamSchedule, ExamType } from '../../../data/facultyData';
import {
  Award, Clock, MapPin, Send, CheckCircle2, Bell, Sparkles,
  Calendar, Megaphone, AlertCircle, CheckCheck
} from 'lucide-react';
import clsx from 'clsx';

export const MentorExamRemindersPage: React.FC = () => {
  const { examSchedule: exams, sendExamReminder } = useFaculty();
  const [selectedType, setSelectedType] = useState<string>('All');
  const [broadcastNotice, setBroadcastNotice] = useState('');
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementSubject, setAnnouncementSubject] = useState('');
  const [announcementSuccess, setAnnouncementSuccess] = useState('');

  const examTypes: string[] = [
    'All',
    'Internal Exam',
    'Model Exam',
    'Semester Exam',
    'Lab Exam',
    'Practical Exam',
    'Project Review',
    'Viva',
  ];

  const filteredExams = selectedType === 'All'
    ? exams
    : exams.filter(e => e.examType === selectedType);

  const handleSendReminder = (exam: ExamSchedule) => {
    sendExamReminder(exam.id);
    setBroadcastNotice(
      `Official reminder dispatched to all assigned mentees for ${exam.subject} (${exam.examType}) scheduled on ${exam.date} at ${exam.startTime}.`
    );
    setTimeout(() => setBroadcastNotice(''), 5000);
  };

  const handleBroadcastAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    setAnnouncementSuccess(
      `Custom advisory announcement broadcast to all assigned mentees: "${announcementText.trim()}"`
    );
    setAnnouncementText('');
    setAnnouncementSubject('');
    setTimeout(() => setAnnouncementSuccess(''), 5000);
  };

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-xs font-bold text-violet-700 mb-2">
            <Award className="h-3.5 w-3.5" />
            <span>Academic Evaluation System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Exam Reminder & Advisory System
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Broadcast scheduled exam alerts, hall plans, and study advice directly to your assigned student cohort.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge-purple">{exams.length} Upcoming Exams</span>
        </div>
      </div>

      {/* Broadcast Alerts */}
      {broadcastNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-3">
          <CheckCheck className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <span>{broadcastNotice}</span>
        </div>
      )}

      {announcementSuccess && (
        <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold flex items-center gap-3">
          <Megaphone className="h-5 w-5 text-indigo-600 flex-shrink-0" />
          <span>{announcementSuccess}</span>
        </div>
      )}

      {/* Automated Exam Cadence Infobox */}
      <div className="bg-white rounded-2xl border border-lavender-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-violet-600" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
            EduSphere AI Automated Student Exam Notification Cadence
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-violet-50/60 border border-violet-100">
            <p className="font-bold text-violet-900">7 Days Before</p>
            <p className="text-slate-600 mt-0.5 leading-relaxed">
              "DBMS Internal Examination is scheduled on 15 September. Syllabus units 1–3."
            </p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
            <p className="font-bold text-indigo-900">3 Days Before</p>
            <p className="text-slate-600 mt-0.5 leading-relaxed">
              "Reminder: DBMS Internal Examination is in 3 days. High priority topics released."
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
            <p className="font-bold text-amber-900">1 Day Before</p>
            <p className="text-slate-600 mt-0.5 leading-relaxed">
              "Tomorrow: DBMS Internal Examination at 10:00 AM. Venue: Examination Hall 1."
            </p>
          </div>
        </div>
      </div>

      {/* Type Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {examTypes.map(t => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={clsx(
              'px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border',
              selectedType === t
                ? 'bg-violet-700 text-white border-violet-700 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Grid of Exams & Custom Announcement */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Examination Cards */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Scheduled Examination Timetable</h2>

          <div className="space-y-3">
            {filteredExams.map(exam => (
              <div
                key={exam.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-200">
                      {exam.subjectCode}
                    </span>
                    <span className="badge-purple text-[10px]">{exam.examType}</span>
                    <span className="text-xs text-slate-400">Semester {exam.semester}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {exam.subject}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1.5 font-mono text-slate-700 font-bold">
                      <Calendar className="h-3.5 w-3.5 text-violet-600" />
                      {exam.date}
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-slate-600">
                      <Clock className="h-3.5 w-3.5 text-violet-600" />
                      {exam.startTime} – {exam.endTime}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <MapPin className="h-3.5 w-3.5 text-violet-600" />
                      {exam.venue}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0 text-left sm:text-right">
                  {exam.reminderSent ? (
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Reminder Sent</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSendReminder(exam)}
                      className="px-4 py-2.5 rounded-xl bg-violet-700 hover:bg-violet-800 text-white text-xs font-bold shadow-sm transition flex items-center gap-2"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Send Reminder</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 4 Cols: Broadcast Manual Announcement */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Megaphone className="h-5 w-5 text-indigo-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Broadcast Mentor Announcement</h3>
                <p className="text-[11px] text-slate-400">Push instant notification to all assigned mentees</p>
              </div>
            </div>

            <form onSubmit={handleBroadcastAnnouncement} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Announcement Topic
                </label>
                <input
                  type="text"
                  value={announcementSubject}
                  onChange={e => setAnnouncementSubject(e.target.value)}
                  placeholder="e.g., Special Remedial Class / Hall Ticket Collection"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message Content *
                </label>
                <textarea
                  rows={4}
                  required
                  value={announcementText}
                  onChange={e => setAnnouncementText(e.target.value)}
                  placeholder="Enter notice to be delivered directly to all mentees' notification center..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={!announcementText.trim()}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" /> Broadcast to Mentees
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
