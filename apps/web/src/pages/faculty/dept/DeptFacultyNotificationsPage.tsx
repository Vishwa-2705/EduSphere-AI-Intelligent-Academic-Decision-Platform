import React from 'react';
import { useFaculty } from '../../../contexts/FacultyContext';
import { Bell, FileText, CheckCircle2, XCircle, Clock, CheckCheck } from 'lucide-react';
import clsx from 'clsx';

export const DeptFacultyNotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllRead } = useFaculty();

  const deptNotifs = notifications.filter(
    n => n.recipientRole === 'FACULTY' || (n.recipientRole as string) === 'ALL'
  );

  const unreadCount = deptNotifs.filter(n => !n.isRead).length;

  const getNotificationIcon = (category: string, title: string) => {
    if (title.toLowerCase().includes('approved')) {
      return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
    }
    if (title.toLowerCase().includes('rejected')) {
      return <XCircle className="h-5 w-5 text-rose-600" />;
    }
    if (title.toLowerCase().includes('verification')) {
      return <Clock className="h-5 w-5 text-amber-600" />;
    }
    return <FileText className="h-5 w-5 text-violet-600" />;
  };

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-xs font-bold text-violet-700 mb-2">
            <Bell className="h-3.5 w-3.5" />
            <span>Material Verification & Academic Alerts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Faculty Notifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time status updates on submitted study materials from HOD and academic alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <span className="badge-rose">{unreadCount} Unread</span>
          )}
          <button
            onClick={() => markAllRead()}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-2"
          >
            <CheckCheck className="h-4 w-4" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100">
        {deptNotifs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-semibold">No notifications for department faculty.</p>
          </div>
        ) : (
          deptNotifs.map(n => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={clsx(
                'p-5 flex items-start gap-4 transition cursor-pointer hover:bg-lavender-50/50',
                !n.isRead ? 'bg-violet-50/30' : 'bg-white'
              )}
            >
              <div className="h-10 w-10 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {getNotificationIcon(n.category, n.title)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className={clsx('text-sm font-bold', !n.isRead ? 'text-slate-900' : 'text-slate-700')}>
                    {n.title}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">
                    {new Date(n.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {n.message}
                </p>
                <div className="mt-2.5 flex items-center gap-3">
                  <span className="badge-lavender text-[10px]">
                    {n.category}
                  </span>
                  {!n.isRead && (
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
