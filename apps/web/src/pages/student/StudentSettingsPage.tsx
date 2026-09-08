import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getStudentRecord } from '../../data/studentData';
import { ShieldCheck, BellRing, LockKeyhole, UserCog } from 'lucide-react';

export const StudentSettingsPage: React.FC = () => {
  const { user, changePassword } = useAuth();
  const student = getStudentRecord(user?.email);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [securityEmail] = useState(user?.email || 'aarav.patel@edusphere.ai');

  const handlePasswordChange = async () => {
    const result = await changePassword(currentPassword, newPassword, confirmPassword);
    setPasswordMessage(result.message || '');
    if (result.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="space-y-6 font-serif">
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-lavender mb-2 inline-block">Preferences</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage account preferences, alerts, security, and appearance</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-lavender-100 flex items-center gap-2">
            <UserCog className="h-4 w-4 text-lavender-700" /> Account settings
          </h3>
          <div className="space-y-4 text-sm text-slate-700">
            <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Full Name</p><p className="font-bold text-slate-900">{student.name}</p></div>
            <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Institutional Email</p><p className="font-bold text-slate-900">{securityEmail}</p></div>
            <div className="p-4 rounded-xl bg-lavender-50 border border-lavender-100"><p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Register Number</p><p className="font-bold text-slate-900">{student.registerNumber}</p></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-lavender-100 flex items-center gap-2">
            <BellRing className="h-4 w-4 text-lavender-700" /> Notification preferences
          </h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between rounded-xl border border-lavender-200 bg-lavender-50/60 p-3 text-sm text-slate-700">
              <span>Email notifications</span>
              <input type="checkbox" checked={notificationsEnabled} onChange={() => setNotificationsEnabled((val) => !val)} className="h-4 w-4 accent-lavender-700" />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-lavender-200 bg-lavender-50/60 p-3 text-sm text-slate-700">
              <span>SMS reminders</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-lavender-700" />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-lavender-200 bg-lavender-50/60 p-3 text-sm text-slate-700">
              <span>Exam alerts</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-lavender-700" />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-lavender-100 flex items-center gap-2">
            <LockKeyhole className="h-4 w-4 text-lavender-700" /> Security & password
          </h3>
          <div className="space-y-4 text-sm text-slate-700">
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password" className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif" />
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif" />
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif" />
            {passwordMessage && <p className={`text-xs ${passwordMessage.includes('successfully') ? 'text-emerald-600' : 'text-rose-600'}`}>{passwordMessage}</p>}
            <button type="button" onClick={handlePasswordChange} className="w-full px-4 py-2.5 rounded-xl bg-lavender-700 hover:bg-lavender-800 text-white font-bold text-xs shadow-sm transition">Change Password</button>
          </div>
        </div>

      </div>
    </div>
  );
};
