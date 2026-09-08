import React, { useState, useEffect } from 'react';
import { Bell, BookOpen, CreditCard, ShieldCheck, Clock3, Megaphone, CheckCircle2, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getDefaultStudentNotifications, getStudentStorageKey, normalizeStudentNotifications } from '../../data/studentData';

const initialNotifications = getDefaultStudentNotifications();
const iconMap = {
  Bell,
  BookOpen,
  CreditCard,
  ShieldCheck,
  Clock3,
  Megaphone,
} as const;

export const StudentNotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<typeof initialNotifications>(() => {
    const storageKey = getStudentStorageKey(user?.email, 'notifications');
    const saved = localStorage.getItem(storageKey);
    if (!saved) return getDefaultStudentNotifications(user?.email);
    try {
      return normalizeStudentNotifications(JSON.parse(saved), user?.email);
    } catch {
      return getDefaultStudentNotifications(user?.email);
    }
  });

  useEffect(() => {
    const storageKey = getStudentStorageKey(user?.email, 'notifications');
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setNotifications(normalizeStudentNotifications(JSON.parse(saved), user?.email));
      } catch {
        setNotifications(getDefaultStudentNotifications(user?.email));
      }
    } else {
      setNotifications(getDefaultStudentNotifications(user?.email));
    }
  }, [user?.email]);

  const openNotification = (index: number) => {
    const nextNotifications = notifications.map((note, i) => (i === index ? { ...note, unread: false, expanded: !note.expanded } : note));
    setNotifications(nextNotifications);
    localStorage.setItem(getStudentStorageKey(user?.email, 'notifications'), JSON.stringify(nextNotifications));
  };

  return (
    <div className="space-y-6 font-serif">
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-lavender mb-2 inline-block">Updates</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Academic, examination, fee, attendance, hostel, and general alerts</p>
          </div>
          <div className="rounded-xl bg-lavender-100 border border-lavender-200 text-lavender-800 px-4 py-2 text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider">Unread</p>
            <p className="text-sm font-bold">{notifications.filter((n) => n.unread).length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-lavender-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-lavender-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">All Notifications</h3>
          <span className="badge-slate">{notifications.length} Items</span>
        </div>

        <div className="divide-y divide-lavender-100">
          {notifications.map((note, idx) => {
            const Icon = iconMap[note.icon as keyof typeof iconMap] || Bell;
            return (
              <button key={idx} type="button" onClick={() => openNotification(idx)} className={note.unread ? 'w-full bg-lavender-50/40 text-left' : 'w-full bg-white text-left'}>
                <div className="flex items-start gap-4 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lavender-100 text-lavender-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="badge-lavender text-[10px]">{note.category}</span>
                        <p className="mt-2 text-sm font-bold text-slate-900">{note.title}</p>
                      </div>
                      <span className="flex items-center gap-2">
                        {!note.unread && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${note.expanded ? 'rotate-180' : ''}`} />
                        {note.unread && <span className="rounded-full bg-lavender-700 text-white px-2 py-0.5 text-[10px] font-bold">Unread</span>}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{note.time}</p>
                    {note.expanded && <div className="mt-3 rounded-lg border border-lavender-100 bg-white p-3 text-xs leading-relaxed text-slate-700"><p>{note.message}</p>{note.details && <div className="mt-3 grid grid-cols-2 gap-2">{note.details.map((detail) => <div key={detail.label} className="rounded-md bg-lavender-50 p-2"><p className="text-[10px] font-bold uppercase text-slate-500">{detail.label}</p><p className="font-bold text-slate-900">{detail.value}</p></div>)}</div>}</div>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
