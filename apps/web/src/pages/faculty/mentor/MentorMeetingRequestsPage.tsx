import React from 'react';
import { CalendarClock, CheckCheck, CircleAlert } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useFaculty } from '../../../contexts/FacultyContext';
import clsx from 'clsx';

export const MentorMeetingRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const { notifications, markNotificationRead, markAllRead } = useFaculty();

  const meetingRequests = notifications
    .filter(
      n =>
        n.recipientRole === 'MENTOR' &&
        n.title === 'Mentor Meeting Request' &&
        (n.recipientEmail === user?.email || n.recipientEmail === 'all' || !n.recipientEmail)
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadCount = meetingRequests.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6 font-serif">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-xs font-bold text-violet-700 mb-2">
            <CalendarClock className="h-3.5 w-3.5" />
            <span>Student Meeting Requests</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Meeting Requests</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Mentees requesting a mentoring session or academic counseling slot.</p>
        </div>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && <span className="badge-rose">{unreadCount} Unread</span>}
          <button
            type="button"
            onClick={() => markAllRead()}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-2"
          >
            <CheckCheck className="h-4 w-4" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100">
        {meetingRequests.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <CalendarClock className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-semibold">No meeting requests from your mentees yet.</p>
          </div>
        ) : (
          meetingRequests.map(request => (
            <div
              key={request.id}
              onClick={() => markNotificationRead(request.id)}
              className={clsx(
                'p-5 flex items-start gap-4 transition cursor-pointer hover:bg-violet-50/40',
                !request.isRead ? 'bg-violet-50/30' : 'bg-white'
              )}
            >
              <div className="h-10 w-10 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center flex-shrink-0 mt-0.5 text-violet-600">
                <CircleAlert className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <h3 className={clsx('text-sm font-bold', !request.isRead ? 'text-slate-900' : 'text-slate-700')}>
                    {request.title}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">
                    {new Date(request.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{request.message}</p>

                <div className="mt-2.5 flex items-center gap-3">
                  <span className="badge-violet text-[10px]">Academic</span>
                  {!request.isRead && (
                    <span className="text-[10px] font-bold text-violet-600 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-600 inline-block" /> Unread
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
