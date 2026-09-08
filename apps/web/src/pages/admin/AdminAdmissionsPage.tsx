import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { UserCheck, CheckCircle2, UserPlus, Filter, Search, Award } from 'lucide-react';
import clsx from 'clsx';

export const AdminAdmissionsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [provisioningId, setProvisioningId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admissions/applications');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load admissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const handleProvisionStudent = async (appId: string) => {
    try {
      setProvisioningId(appId);
      const res = await api.post(`/admissions/applications/${appId}/provision`);
      if (res.data.success) {
        setFeedback(res.data.message);
        setTimeout(() => setFeedback(null), 5000);
        fetchAdmissions();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Provisioning error');
    } finally {
      setProvisioningId(null);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex h-96 items-center justify-center font-serif">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-lavender-700 border-t-transparent" />
          <p className="text-sm font-bold text-slate-700">Loading Admissions Onboarding Registry...</p>
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || { totalApplications: 340, verifiedCount: 312, admittedCount: 280, seatsFilledPercentage: 92.5 };
  const applications = data?.applications || [];

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-lavender mb-2 inline-block">Admissions & Enrollment Gateway</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Candidate Applications & Student Onboarding
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Merit scores, quota allocations, document verification, and 1-click student account creation
            </p>
          </div>
          <span className="badge-emerald text-xs px-3 py-1.5 self-start sm:self-auto">
            {metrics.seatsFilledPercentage}% Capacity Filled (Class of 2026)
          </span>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-serif flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <span className="font-bold">{feedback}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Applications</p>
          <h3 className="text-3xl font-extrabold text-slate-900 font-mono mt-1.5">{metrics.totalApplications}</h3>
          <p className="text-xs text-slate-500 mt-2">B.Tech 2026–2030 Cycle</p>
        </div>

        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Verified Candidates</p>
          <h3 className="text-3xl font-extrabold text-emerald-700 font-mono mt-1.5">{metrics.verifiedCount}</h3>
          <p className="text-xs text-emerald-700 font-bold mt-2">Certificates Cleared</p>
        </div>

        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Admitted Students</p>
          <h3 className="text-3xl font-extrabold text-lavender-900 font-mono mt-1.5">{metrics.admittedCount}</h3>
          <p className="text-xs text-slate-500 mt-2">Accounts Provisioned</p>
        </div>

        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Seat Utilization</p>
          <h3 className="text-3xl font-extrabold text-emerald-700 font-mono mt-1.5">{metrics.seatsFilledPercentage}%</h3>
          <p className="text-xs text-slate-500 mt-2">Across All 4 Branches</p>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-lavender-200/80 shadow-sm overflow-hidden p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-lavender-100 flex items-center justify-between">
          <span>Candidate Intake Applications</span>
          <span className="badge-lavender">{applications.length} Candidates</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="edusphere-table">
            <thead>
              <tr>
                <th>App Number & Candidate</th>
                <th>Entrance Score</th>
                <th>12th %</th>
                <th>Quota</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app: any) => (
                <tr key={app._id}>
                  <td>
                    <p className="font-bold text-slate-900">{app.candidateName}</p>
                    <p className="text-xs font-mono text-slate-400">App: {app.applicationNumber} • {app.email}</p>
                  </td>
                  <td className="font-mono font-bold text-slate-900">{app.entranceScore}</td>
                  <td className="font-mono text-slate-700">{app.qualifyingMarksPercentage}%</td>
                  <td>
                    <span className="badge-lavender font-mono">{app.allocatedQuota}</span>
                  </td>
                  <td>
                    <span className={clsx(
                      'badge-slate',
                      app.status === 'ADMITTED' && 'badge-emerald',
                      app.status === 'VERIFIED' && 'badge-lavender',
                      app.status === 'UNDER_REVIEW' && 'badge-amber'
                    )}>
                      {app.status}
                    </span>
                  </td>
                  <td className="text-right">
                    {app.status !== 'ADMITTED' ? (
                      <button
                        onClick={() => handleProvisionStudent(app._id)}
                        disabled={provisioningId === app._id}
                        className="px-3 py-1.5 rounded-xl bg-lavender-700 hover:bg-lavender-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 ml-auto transition disabled:opacity-50"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        <span>{provisioningId === app._id ? 'Provisioning...' : '1-Click Admit'}</span>
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 justify-end">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Enrolled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
