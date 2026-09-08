import React from 'react';
import { useFaculty } from '../../../contexts/FacultyContext';
import {
  Building2, Users, FileSpreadsheet, CheckCircle2, AlertTriangle,
  Moon, ShieldCheck, Clock, ArrowRight, BedDouble, Bell, Megaphone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

export const WardenDashboard: React.FC = () => {
  const { hostelResidents, wardenLeaveRequests, updateWardenLeaveStatus } = useFaculty();

  const totalResidents = hostelResidents.length;
  const presentCount = hostelResidents.filter(r => r.curfewStatus === 'PRESENT').length;
  const onLeaveCount = hostelResidents.filter(r => r.curfewStatus === 'ON_LEAVE').length;
  const pendingLeaves = wardenLeaveRequests.filter(l => l.wardenStatus === 'Pending');

  const blocks = [
    { name: 'Block 4 - Aryabhata', type: 'Boys Hostel', capacity: 250, occupied: 238, supervisor: 'Mr. Ramanujam' },
    { name: 'Block 2 - Veda', type: 'Girls Hostel', capacity: 200, occupied: 192, supervisor: 'Mrs. Jayalakshmi' },
    { name: 'Block 5 - Bhaskara', type: 'Boys Hostel (Senior)', capacity: 180, occupied: 174, supervisor: 'Mr. Murugan' },
  ];

  return (
    <div className="space-y-6 font-serif">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Campus Residential Life & Hostel Administration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome, Mr. K. Narayanan 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Chief Hostel Warden • <strong className="text-slate-800">Campus Hostels (Blocks 2, 4, 5)</strong> • Academic Year 2025–2026
            </p>
          </div>

          <div className="flex items-center gap-2">
            {pendingLeaves.length > 0 && (
              <span className="badge-amber">{pendingLeaves.length} Outing Requests Pending</span>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Hostellers', value: 604, sub: 'Across 3 Blocks', icon: Users, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
          { label: 'Present In Hostel', value: 582, sub: '96.3% Night Presence', icon: Moon, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
          { label: 'Pending Outings/Leaves', value: pendingLeaves.length, sub: 'Requires Sign-off', icon: FileSpreadsheet, color: 'bg-amber-50 text-amber-700 border-amber-200' },
          { label: 'Hostel Blocks', value: '3 Active', sub: 'Blocks 2, 4, 5', icon: Building2, color: 'bg-violet-50 text-violet-700 border-violet-200' },
        ].map((m, i) => {
          const Icon = m.icon;
          const [bg, text, border] = m.color.split(' ');
          return (
            <div key={i} className={`bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-3.5 ${border}`}>
              <div className={`h-11 w-11 rounded-xl ${bg} ${text} flex items-center justify-center flex-shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 leading-tight">{m.value}</p>
                <p className="text-xs font-bold text-slate-700">{m.label}</p>
                <p className="text-[10px] text-slate-400">{m.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Residential Students + Outing Approvals */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left 8 Cols */}
        <div className="lg:col-span-8 space-y-6">
          {/* Residential Students Roster */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Residential Students Snapshot</h2>
                <p className="text-xs text-slate-500">Hostel room allocations and night presence status</p>
              </div>
              <Link to="/faculty/warden/students" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                View All Residents <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="edusphere-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Reg No</th>
                    <th>Dept</th>
                    <th>Hostel Block</th>
                    <th>Room & Bed</th>
                    <th>Night Status</th>
                  </tr>
                </thead>
                <tbody>
                  {hostelResidents.map(res => (
                    <tr key={res.id}>
                      <td className="font-bold text-xs text-slate-900">{res.name}</td>
                      <td className="font-mono text-xs font-bold text-indigo-700">{res.regNo}</td>
                      <td>
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {res.departmentCode}
                        </span>
                      </td>
                      <td className="text-xs text-slate-700">{res.blockName}</td>
                      <td className="text-xs text-slate-600 font-mono">
                        Room {res.roomNumber} ({res.bedNumber})
                      </td>
                      <td>
                        <span className={clsx(
                          'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border',
                          res.curfewStatus === 'PRESENT' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          res.curfewStatus === 'ON_LEAVE' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          'bg-rose-50 text-rose-800 border-rose-200'
                        )}>
                          {res.curfewStatus === 'PRESENT' ? 'In Hostel' : res.curfewStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Hostel Outings & Leaves */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Hostel Outing & Leave Approvals</h2>
                <p className="text-xs text-slate-500">Student night pass and outstation leave verification</p>
              </div>
              <Link to="/faculty/warden/leave" className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1">
                Manage All Outings <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="p-6 divide-y divide-slate-100">
              {wardenLeaveRequests.map(lr => (
                <div key={lr.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{lr.studentName}</span>
                      <span className="font-mono text-xs font-bold text-indigo-700">{lr.regNo}</span>
                      <span className="badge-lavender text-[10px]">{lr.hostelBlock} • {lr.hostelRoom}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{lr.reason}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Period: <strong className="text-slate-700">{lr.fromDate} to {lr.toDate}</strong> ({lr.numberOfDays} days) • Mentor: {lr.mentorName} ({lr.status})
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {lr.wardenStatus === 'Pending' ? (
                      <>
                        <button
                          onClick={() => updateWardenLeaveStatus(lr.id, 'Approved')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                        >
                          Approve Outing
                        </button>
                        <button
                          onClick={() => updateWardenLeaveStatus(lr.id, 'Rejected')}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className={clsx(
                        'px-2.5 py-1 rounded-lg text-xs font-bold border',
                        lr.wardenStatus === 'Approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                      )}>
                        Warden: {lr.wardenStatus}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols */}
        <div className="lg:col-span-4 space-y-6">
          {/* Hostel Blocks Capacity */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Hostel Blocks Occupancy
            </h3>

            <div className="space-y-3">
              {blocks.map(b => (
                <div key={b.name} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{b.name}</span>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {b.type}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Occupancy:</span>
                    <span className="font-bold text-slate-800">{b.occupied} / {b.capacity} beds</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-indigo-600" style={{ width: `${(b.occupied / b.capacity) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Curfew Rules Notice */}
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 space-y-2 text-amber-900">
            <div className="flex items-center gap-2 font-bold text-xs">
              <Clock className="h-4 w-4 text-amber-700" />
              <span>Hostel Curfew & Attendance Rules</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Night attendance roll call is strictly conducted at <strong>9:00 PM</strong> daily. All late entry passes must be submitted before 6:00 PM through this portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
