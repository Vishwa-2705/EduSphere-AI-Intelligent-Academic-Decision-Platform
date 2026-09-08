import React from 'react';
import { useFaculty } from '../../../contexts/FacultyContext';
import { Bell, ShieldCheck, CheckCheck } from 'lucide-react';
import clsx from 'clsx';

export const WardenNotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllRead } = useFaculty();

  const wardenNotifs = notifications.filter(
    n => n.recipientRole === 'WARDEN' || n.category === 'Hostel'
  );

  return (
    <div className="space-y-6 font-serif">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-2">
            <Bell className="h-3.5 w-3.5" />
            <span>Hostel Incident & Outing Notifications</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Warden Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Night curfew updates, emergency parent notices, and student gate pass requests.
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
        >
          <CheckCheck className="h-4 w-4" /> Mark All Read
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm divide-y divide-slate-100">
        {wardenNotifs.map(n => (
          <div
            key={n.id}
            onClick={() => markNotificationRead(n.id)}
            className={clsx('p-5 flex items-start gap-4 hover:bg-slate-50 cursor-pointer transition', !n.isRead && 'bg-emerald-50/30')}
          >
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-sm text-slate-900">{n.title}</h3>
                <span className="text-[11px] font-mono text-slate-400">{n.createdAt.split('T')[0]}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
