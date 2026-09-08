import React from 'react';
import { Building2, BedDouble, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const WardenRoomsPage: React.FC = () => {
  const blocks = [
    {
      name: 'Block 4 - Aryabhata',
      type: 'Boys Hostel (Junior & Senior)',
      floors: 4,
      totalRooms: 120,
      totalBeds: 240,
      occupiedBeds: 232,
      facilities: ['Wi-Fi 6', 'Study Hall', 'Solar Water', 'Recreation Room', 'Gym'],
      supervisor: 'Mr. Ramanujam (+91 98400 33221)',
    },
    {
      name: 'Block 2 - Veda',
      type: 'Girls Hostel',
      floors: 4,
      totalRooms: 100,
      totalBeds: 200,
      occupiedBeds: 192,
      facilities: ['Wi-Fi 6', 'Reading Lounge', '24x7 Security', 'Solar Water', 'Medical Room'],
      supervisor: 'Mrs. Jayalakshmi (+91 98400 33222)',
    },
    {
      name: 'Block 5 - Bhaskara',
      type: 'Boys Hostel (Final Year & PG)',
      floors: 3,
      totalRooms: 90,
      totalBeds: 180,
      occupiedBeds: 174,
      facilities: ['Wi-Fi 6', 'Individual Study Cubicles', 'Solar Water', 'Badminton Court'],
      supervisor: 'Mr. Murugan (+91 98400 33223)',
    },
  ];

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-800 mb-2">
            <Building2 className="h-3.5 w-3.5" />
            <span>Hostel Infrastructure & Occupancy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hostel Blocks & Room Allocations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Bed allotment status, block supervisor assignments, and residential facilities.
          </p>
        </div>

        <span className="badge-indigo">598 Total Occupied Beds</span>
      </div>

      {/* Block Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blocks.map(b => (
          <div key={b.name} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">{b.name}</h3>
                <p className="text-xs text-indigo-700 font-semibold mt-0.5">{b.type}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <BedDouble className="h-5 w-5" />
              </div>
            </div>

            <div className="space-y-2 py-3 border-y border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Floors & Rooms:</span>
                <span className="font-bold text-slate-800">{b.floors} Floors • {b.totalRooms} Rooms</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Bed Capacity:</span>
                <span className="font-bold text-slate-800">{b.occupiedBeds} / {b.totalBeds} ({Math.round((b.occupiedBeds / b.totalBeds) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-1">
                <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${(b.occupiedBeds / b.totalBeds) * 100}%` }} />
              </div>
              <div className="flex justify-between text-slate-600 pt-1">
                <span>Supervisor:</span>
                <span className="font-medium text-slate-700">{b.supervisor}</span>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">Amenities & Facilities</p>
              <div className="flex flex-wrap gap-1.5">
                {b.facilities.map(f => (
                  <span key={f} className="badge-lavender text-[10px]">{f}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
