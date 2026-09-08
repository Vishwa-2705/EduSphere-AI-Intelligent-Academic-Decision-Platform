import React from 'react';
import { useFaculty } from '../../../contexts/FacultyContext';
import { Bell, FileText, CheckCircle2, XCircle, Clock, BookOpen } from 'lucide-react';
import clsx from 'clsx';

const iconMap: Record<string, React.ReactNode> = {
  file: <FileText className="h-4 w-4" />,
  check: <CheckCircle2 className="h-4 w-4" />,
  reject: <XCircle className="h-4 w-4" />,
  clock: <Clock className="h-4 w-4" />,
  leave: <BookOpen className="h-4 w-4" />,
  exam: <Bell className="h-4 w-4" />,
};

const categoryColors: Record<string, string> = {
  Material: 'bg-blue-50 text-blue-600',
  Leave: 'bg-indigo-50 text-indigo-600',
  Exam: 'bg-violet-50 text-violet-600',
  System: 'bg-slate-50 text-slate-600',
  HOD: 'bg-purple-50 text-purple-600',
};

export const HODNotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllRead } = useFaculty();
  const hodNotifs = notifications.filter(n => n.recipientRole === 'HOD' || (n.recipientRole as string) === 'ALL');
  const unread = hodNotifs.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6 font-serif">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500 mt-1">HOD – Department Alerts & Updates</p>
        </div>
        <div className="flex items-center gap-3">
          {unread > 0 && (
            <span className="badge-rose">{unread} Unread</span>
          )}
          <button
            onClick={() => markAllRead()}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition"
          >
            Mark All Read
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {hodNotifs.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Bell className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No notifications yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {hodNotifs.map(n => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={clsx(
                  'flex items-start gap-4 p-5 cursor-pointer hover:bg-lavender-50/60 transition',
                  !n.isRead && 'bg-violet-50/40'
                )}
              >
                <div className={clsx('h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0', categoryColors[n.category] || 'bg-slate-50 text-slate-600')}>
                  <Bell className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={clsx('text-xs font-bold', n.isRead ? 'text-slate-600' : 'text-slate-900')}>{n.title}</p>
                    {!n.isRead && <span className="h-2 w-2 rounded-full bg-violet-600 flex-shrink-0 mt-1" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <span className={clsx('px-2 py-0.5 rounded-lg text-[10px] font-bold border flex-shrink-0', {
                  'bg-blue-50 text-blue-700 border-blue-200': n.category === 'Material',
                  'bg-indigo-50 text-indigo-700 border-indigo-200': n.category === 'Leave',
                  'bg-violet-50 text-violet-700 border-violet-200': n.category === 'Exam',
                  'bg-slate-50 text-slate-600 border-slate-200': n.category !== 'Material' && n.category !== 'Leave' && n.category !== 'Exam',
                })}>
                  {n.category}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
