import React, { useState } from 'react';
import { useFaculty } from '../../../contexts/FacultyContext';
import { Search, Building2, Users, BedDouble, Phone, CheckCircle2, Moon } from 'lucide-react';
import clsx from 'clsx';

export const WardenStudentsPage: React.FC = () => {
  const { hostelResidents } = useFaculty();
  const [search, setSearch] = useState('');
  const [blockFilter, setBlockFilter] = useState('All');

  const filtered = hostelResidents.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.regNo.toLowerCase().includes(search.toLowerCase()) ||
      r.roomNumber.includes(search);
    const matchBlock = blockFilter === 'All' || r.blockName.includes(blockFilter);
    return matchSearch && matchBlock;
  });

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-2">
              <Users className="h-3.5 w-3.5" />
              <span>Campus Hostel Residents</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hostel Student Roster
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Active residential students across Block 4 (Aryabhata), Block 2 (Veda), and Block 5 (Bhaskara).
            </p>
          </div>

          <span className="badge-emerald">{hostelResidents.length} Hostellers Registered</span>
        </div>
      </div>

      {/* Filter / Search */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, roll number, or room number..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <select
          value={blockFilter}
          onChange={e => setBlockFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none"
        >
          <option value="All">All Hostel Blocks</option>
          <option value="Block 4">Block 4 - Aryabhata</option>
          <option value="Block 2">Block 2 - Veda</option>
          <option value="Block 5">Block 5 - Bhaskara</option>
        </select>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(res => (
          <div key={res.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center text-sm">
                  {res.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{res.name}</h3>
                  <p className="font-mono text-xs font-bold text-indigo-700">{res.regNo}</p>
                </div>
              </div>

              <span className={clsx(
                'px-2 py-0.5 rounded-md text-[10px] font-bold border',
                res.curfewStatus === 'PRESENT' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
              )}>
                {res.curfewStatus}
              </span>
            </div>

            <div className="space-y-1.5 py-2 border-y border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Department:</span>
                <span className="font-bold text-slate-800">{res.departmentCode} • {res.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hostel Block:</span>
                <span className="font-semibold text-slate-800">{res.blockName}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">Room & Bed:</span>
                <span className="font-bold text-emerald-800">Room {res.roomNumber} ({res.bedNumber})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Emergency:</span>
                <span className="font-medium text-slate-700 truncate max-w-[160px]">{res.emergencyContact}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
