import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Home, Users, CheckCircle2, Bed, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export const AdminHostelPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const res = await api.get('/hostel/rooms');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load hostel rooms:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  if (loading && !data) {
    return (
      <div className="flex h-96 items-center justify-center font-serif">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-lavender-700 border-t-transparent" />
          <p className="text-sm font-bold text-slate-700">Loading Hostel Residential Management...</p>
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || { totalBeds: 900, occupiedBeds: 840, occupancyRate: '93.3%', operationalBlocks: 5 };
  const rooms = data?.rooms || [];

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-lavender mb-2 inline-block">Residential Operations Master</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hostel Infrastructure & Bed Occupancy Matrix
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Residential blocks 1 to 5 capacity monitoring, room allocations, and warden oversight
            </p>
          </div>
          <span className="badge-emerald text-sm px-3.5 py-1.5 self-start sm:self-auto">
            {metrics.occupancyRate} Campus Bed Occupancy
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Bed Capacity</p>
          <h3 className="text-3xl font-extrabold text-slate-900 font-mono mt-1.5">{metrics.totalBeds}</h3>
          <p className="text-xs text-slate-500 mt-2">Across 5 Residential Blocks</p>
        </div>

        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Occupied Beds</p>
          <h3 className="text-3xl font-extrabold text-lavender-900 font-mono mt-1.5">{metrics.occupiedBeds}</h3>
          <p className="text-xs text-emerald-700 font-bold mt-2">Active Student Residents</p>
        </div>

        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Available Vacancies</p>
          <h3 className="text-3xl font-extrabold text-emerald-700 font-mono mt-1.5">
            {metrics.totalBeds - metrics.occupiedBeds}
          </h3>
          <p className="text-xs text-slate-500 mt-2">Ready for Immediate Allotment</p>
        </div>

        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Occupancy Rate</p>
          <h3 className="text-3xl font-extrabold text-emerald-700 font-mono mt-1.5">{metrics.occupancyRate}</h3>
          <p className="text-xs text-slate-500 mt-2">High Utilization</p>
        </div>
      </div>

      {/* Room Directory */}
      <div className="bg-white rounded-2xl border border-lavender-200/80 shadow-sm overflow-hidden p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-lavender-100 flex items-center justify-between">
          <span>Hostel Room & Block Directory</span>
          <span className="badge-lavender">{rooms.length} Configured Rooms</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="edusphere-table">
            <thead>
              <tr>
                <th>Block Name</th>
                <th>Room No</th>
                <th>Floor</th>
                <th>Capacity</th>
                <th>Occupancy</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r: any) => (
                <tr key={r._id}>
                  <td className="font-bold text-slate-900">{r.blockName}</td>
                  <td className="font-mono font-bold text-lavender-800">Room #{r.roomNumber}</td>
                  <td className="font-mono text-slate-700">Floor {r.floor}</td>
                  <td className="font-mono">{r.capacity} Beds</td>
                  <td className="font-mono font-bold text-slate-900">{r.currentOccupancy} / {r.capacity}</td>
                  <td>
                    <span className="badge-lavender font-mono">{r.type}</span>
                  </td>
                  <td>
                    <span className={r.status === 'AVAILABLE' ? 'badge-emerald' : 'badge-slate'}>
                      {r.status}
                    </span>
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
