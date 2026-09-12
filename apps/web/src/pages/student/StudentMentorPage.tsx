import React, { useState } from 'react';
import { CalendarClock, Mail, Phone, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useFaculty } from '../../contexts/FacultyContext';
import { getStudentRecord } from '../../data/studentData';

const preferredSlots = [
  'Thursday, 05 Sep 2026 • 09:00 AM',
  'Thursday, 05 Sep 2026 • 10:30 AM',
  'Friday, 06 Sep 2026 • 02:00 PM',
  'Monday, 09 Sep 2026 • 11:00 AM',
  'Tuesday, 10 Sep 2026 • 03:30 PM',
];

export const StudentMentorPage: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useFaculty();
  const student = getStudentRecord(user?.email);
  const mentor = {
    name: student.mentorName,
    department: student.mentorDepartment,
    designation: student.mentorDesignation,
    email: student.mentorEmail,
    contact: student.mentorContact,
    mentoringHours: student.mentorHours,
    nextMeeting: student.mentorNextMeeting,
    recentInfo: student.mentorRecentInfo,
  };
  const [requestMessage, setRequestMessage] = useState('');
  const [preferredSlot, setPreferredSlot] = useState(preferredSlots[0]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!requestMessage.trim()) return;

    addNotification({
      recipientEmail: student.mentorEmail,
      recipientRole: 'MENTOR',
      departmentCode: student.department,
      title: 'Mentor Meeting Request',
      message: `${student.name} requested a mentoring meeting for ${preferredSlot}. Reason: ${requestMessage.trim()}`,
      category: 'Academic',
      isRead: false,
    });

    setSubmitted(true);
    setRequestMessage('');
  };

  return (
    <div className="space-y-6 font-serif">
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-lavender mb-2 inline-block">Mentoring Support</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Mentor</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Academic guidance, meeting slots, and mentorship history</p>
          </div>
          <div className="rounded-xl bg-lavender-100 border border-lavender-200 text-lavender-800 px-4 py-2 text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider">Next Meeting</p>
            <p className="text-sm font-bold">{mentor.nextMeeting}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7">
          <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-lavender-100">Mentor Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
              <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Mentor Name</p><p className="font-bold text-slate-900">{mentor.name}</p></div>
              <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Department</p><p className="font-bold text-slate-900">{mentor.department}</p></div>
              <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Designation</p><p className="font-bold text-slate-900">{mentor.designation}</p></div>
              <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Mentoring Hours</p><p className="font-bold text-slate-900">{mentor.mentoringHours}</p></div>
              <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Email</p><p className="font-bold text-slate-900 flex items-center gap-2"><Mail className="h-4 w-4 text-lavender-700" />{mentor.email}</p></div>
              <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Contact</p><p className="font-bold text-slate-900 flex items-center gap-2"><Phone className="h-4 w-4 text-lavender-700" />{mentor.contact}</p></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-lavender-100 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-lavender-700" /> Recent Mentoring Information
            </h3>
            <div className="rounded-xl border border-lavender-200 bg-lavender-50/60 p-4 text-sm text-slate-700 leading-relaxed">
              {mentor.recentInfo}
            </div>
          </div>
        </div>

        <div className="xl:col-span-5">
          <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-lavender-100 flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-lavender-700" /> Request Meeting
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Slot</label>
                <select value={preferredSlot} onChange={(e) => setPreferredSlot(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif">
                  {preferredSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Meeting</label>
                <textarea rows={5} value={requestMessage} onChange={(e) => setRequestMessage(e.target.value)} placeholder="Tell your mentor why you want to meet..." className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif" />
              </div>
              {submitted && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-2">
                  Meeting request drafted for review for {preferredSlot}. No backend request was sent.
                </div>
              )}
              <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-lavender-700 hover:bg-lavender-800 text-white font-bold text-xs shadow-sm transition">
                <Send className="h-4 w-4" />
                Send Meeting Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
