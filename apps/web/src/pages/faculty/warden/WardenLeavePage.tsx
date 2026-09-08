import React, { useState } from 'react';
import { useFaculty } from '../../../contexts/FacultyContext';
import { FileSpreadsheet, CheckCircle2, XCircle, Search, CheckCheck } from 'lucide-react';
import clsx from 'clsx';

export const WardenLeavePage: React.FC = () => {
  const { wardenLeaveRequests, updateWardenLeaveStatus } = useFaculty();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [banner, setBanner] = useState('');

  const filtered = wardenLeaveRequests.filter(l => {
    const matchSearch = l.studentName.toLowerCase().includes(search.toLowerCase()) ||
      l.regNo.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || l.wardenStatus === filter;
    return matchSearch && matchFilter;
  });

  const handleAction = (id: string, name: string, status: 'Approved' | 'Rejected') => {
    updateWardenLeaveStatus(id, status);
    setBanner(`Hostel leave/outing pass for ${name} marked as ${status.toUpperCase()}.`);
    setTimeout(() => setBanner(''), 4000);
  };

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800 mb-2">
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Outing & Night Pass Clearance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hostel Outings & Night Passes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Verify hostel leave applications, parent contact permissions, and gate passes.
          </p>
        </div>

        <span className="badge-amber">
          {wardenLeaveRequests.filter(l => l.wardenStatus === 'Pending').length} Pending Outing Passes
        </span>
      </div>

      {banner && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCheck className="h-4 w-4 text-emerald-600" />
          <span>{banner}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="edusphere-table">
            <thead>
              <tr>
                <th>Resident Name</th>
                <th>Roll No</th>
                <th>Hostel Block & Room</th>
                <th>Outing Dates</th>
                <th>Reason</th>
                <th>Mentor Approval</th>
                <th>Warden Status</th>
                <th>Gate Clearance Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(lr => (
                <tr key={lr.id}>
                  <td className="font-bold text-xs text-slate-900">{lr.studentName}</td>
                  <td className="font-mono text-xs font-bold text-indigo-700">{lr.regNo}</td>
                  <td className="text-xs text-slate-700 font-medium">{lr.hostelBlock} • {lr.hostelRoom}</td>
                  <td className="text-xs font-mono text-slate-600">{lr.fromDate} to {lr.toDate} ({lr.numberOfDays}d)</td>
                  <td className="text-xs text-slate-600 max-w-[180px]">{lr.reason}</td>
                  <td>
                    <span className={clsx(
                      'px-2 py-0.5 rounded text-[10px] font-bold border',
                      lr.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                    )}>
                      Mentor: {lr.status}
                    </span>
                  </td>
                  <td>
                    <span className={clsx(
                      'px-2 py-0.5 rounded text-[10px] font-bold border',
                      lr.wardenStatus === 'Approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                      lr.wardenStatus === 'Pending' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                    )}>
                      {lr.wardenStatus || 'Pending'}
                    </span>
                  </td>
                  <td>
                    {lr.wardenStatus === 'Pending' ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleAction(lr.id, lr.studentName, 'Approved')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(lr.id, lr.studentName, 'Rejected')}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs hover:bg-rose-100"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Clearance Signed</span>
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
