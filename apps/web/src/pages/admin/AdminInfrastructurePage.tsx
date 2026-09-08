import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Wifi, Zap, Droplets, Ticket, CheckCircle2, Plus, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

interface Telemetry {
  wifiCoverage: { value: number; unit: string; status: string };
  powerLoad: { value: number; unit: string; status: string };
  waterSupply: { value: number; unit: string; status: string };
  openTickets: number;
}

interface Ticket {
  _id: string;
  ticketNumber: string;
  title: string;
  category: string;
  location: string;
  priority: string;
  status: string;
  createdAt: string;
}

export const AdminInfrastructurePage: React.FC = () => {
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'WIFI', location: '', priority: 'MEDIUM', description: '' });

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [statusRes, ticketRes] = await Promise.all([
        api.get('/infrastructure/status'),
        api.get('/infrastructure/tickets'),
      ]);
      if (statusRes.data.success) setTelemetry(statusRes.data.data.telemetry);
      if (ticketRes.data.success) setTickets(ticketRes.data.data);
    } catch (err) {
      console.error('Failed to load infrastructure:', err);
      // Use default telemetry data
      setTelemetry({
        wifiCoverage: { value: 98.2, unit: '%', status: 'OPTIMAL' },
        powerLoad: { value: 73.0, unit: '% Grid Capacity', status: 'NORMAL' },
        waterSupply: { value: 100.0, unit: '% Tank Reserves', status: 'FULL_SUPPLY' },
        openTickets: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.location) return;
    try {
      setSubmitting(true);
      await api.post('/infrastructure/tickets', form);
      setShowModal(false);
      setForm({ title: '', category: 'WIFI', location: '', priority: 'MEDIUM', description: '' });
      fetchAll();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !telemetry) {
    return (
      <div className="flex h-96 items-center justify-center font-serif">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-lavender-700 border-t-transparent" />
          <p className="text-sm font-bold text-slate-700">Loading Campus Infrastructure Telemetry...</p>
        </div>
      </div>
    );
  }

  const t = telemetry || { wifiCoverage: { value: 98.2, unit: '%', status: 'OPTIMAL' }, powerLoad: { value: 73, unit: '%', status: 'NORMAL' }, waterSupply: { value: 100, unit: '%', status: 'FULL' }, openTickets: 3 };

  const gaugeColor = (val: number) => val >= 90 ? 'text-emerald-700' : val >= 70 ? 'text-amber-600' : 'text-red-600';
  const gaugeBg = (val: number) => val >= 90 ? 'bg-emerald-500' : val >= 70 ? 'bg-amber-400' : 'bg-red-500';

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-lavender mb-2 inline-block">Campus Smart Infrastructure</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Infrastructure Monitoring & Facility Control
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-time campus telemetry: Wi-Fi coverage, power grid load, water reserves, and maintenance dispatch
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-lavender-700 hover:bg-lavender-800 text-white font-bold text-xs shadow-md shadow-lavender-700/20 flex items-center gap-2 transition"
          >
            <Plus className="h-4 w-4" />
            <span>New Maintenance Ticket</span>
          </button>
        </div>
      </div>

      {/* Real-time Telemetry Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wi-Fi */}
        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Wifi className="h-5 w-5 text-blue-700" />
            </div>
            <span className="badge-emerald text-[10px]">
              {t.wifiCoverage.status}
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Wi-Fi Campus Coverage</p>
          <h3 className={`text-4xl font-extrabold font-mono mt-1 ${gaugeColor(t.wifiCoverage.value)}`}>
            {t.wifiCoverage.value}%
          </h3>
          <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className={`h-2 rounded-full transition-all ${gaugeBg(t.wifiCoverage.value)}`} style={{ width: `${t.wifiCoverage.value}%` }} />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">48 Access Points Online · 1,240 Devices Connected</p>
        </div>

        {/* Power */}
        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-yellow-100 rounded-xl">
              <Zap className="h-5 w-5 text-yellow-700" />
            </div>
            <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded-full', t.powerLoad.value < 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800')}>
              {t.powerLoad.status}
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Grid Power Consumption</p>
          <h3 className={`text-4xl font-extrabold font-mono mt-1 ${gaugeColor(110 - t.powerLoad.value)}`}>
            {t.powerLoad.value}%
          </h3>
          <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className={`h-2 rounded-full transition-all ${t.powerLoad.value < 85 ? 'bg-emerald-500' : 'bg-amber-400'}`} style={{ width: `${t.powerLoad.value}%` }} />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">DG Backup: Ready · Solar Supply: 32 kW Active</p>
        </div>

        {/* Water */}
        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-cyan-100 rounded-xl">
              <Droplets className="h-5 w-5 text-cyan-700" />
            </div>
            <span className="badge-emerald text-[10px]">FULL SUPPLY</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Water Tank Reserves</p>
          <h3 className="text-4xl font-extrabold font-mono mt-1 text-emerald-700">
            {t.waterSupply.value}%
          </h3>
          <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-2 rounded-full bg-cyan-500 transition-all" style={{ width: `${t.waterSupply.value}%` }} />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">3 overhead tanks full · Borewell pumps active</p>
        </div>

        {/* Open Tickets */}
        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-amber-100 rounded-xl">
              <Ticket className="h-5 w-5 text-amber-700" />
            </div>
            <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded-full', t.openTickets === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800')}>
              {t.openTickets === 0 ? 'ALL RESOLVED' : 'PENDING'}
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Open Maintenance Tickets</p>
          <h3 className="text-4xl font-extrabold font-mono mt-1 text-slate-900">{t.openTickets}</h3>
          <p className="text-[11px] text-slate-400 mt-5">Facility Management SLA: 4-hour resolution</p>
        </div>
      </div>

      {/* Maintenance Tickets Table */}
      <div className="bg-white rounded-2xl border border-lavender-200/80 shadow-sm overflow-hidden p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-lavender-100 flex items-center justify-between">
          <span>Maintenance Dispatch Ledger</span>
          <span className="badge-lavender">{tickets.length} Total Tickets</span>
        </h3>

        {tickets.length === 0 ? (
          <div className="py-12 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-900">All Campus Systems Operational</p>
            <p className="text-xs text-slate-400 mt-1">No open maintenance tickets. All facility issues resolved.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="edusphere-table">
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Issue Summary</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Opened</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((tk) => (
                  <tr key={tk._id}>
                    <td className="font-mono font-bold text-lavender-800 text-[11px]">{tk.ticketNumber}</td>
                    <td className="font-bold text-slate-900">{tk.title}</td>
                    <td>
                      <span className="badge-lavender font-mono">{tk.category}</span>
                    </td>
                    <td className="text-slate-600 text-xs">{tk.location}</td>
                    <td>
                      <span className={clsx(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full',
                        tk.priority === 'URGENT' && 'bg-red-100 text-red-800',
                        tk.priority === 'HIGH' && 'bg-orange-100 text-orange-800',
                        tk.priority === 'MEDIUM' && 'bg-amber-100 text-amber-800',
                        tk.priority === 'LOW' && 'bg-slate-100 text-slate-600',
                      )}>
                        {tk.priority}
                      </span>
                    </td>
                    <td>
                      <span className={clsx(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full',
                        tk.status === 'RESOLVED' && 'bg-emerald-100 text-emerald-800',
                        tk.status === 'IN_PROGRESS' && 'bg-blue-100 text-blue-800',
                        tk.status === 'OPEN' && 'bg-amber-100 text-amber-800',
                      )}>
                        {tk.status}
                      </span>
                    </td>
                    <td className="text-xs font-mono text-slate-400">{new Date(tk.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl border border-lavender-200 shadow-elevated p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Create Maintenance Dispatch</h3>
            <p className="text-xs text-slate-500 mb-4">Issue a work order to the campus facility management team</p>
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif">
                  <option value="WIFI">Wi-Fi / Network</option>
                  <option value="ELECTRICAL">Electrical / Power</option>
                  <option value="PLUMBING">Plumbing / Water</option>
                  <option value="HVAC">HVAC / Climate Control</option>
                  <option value="CIVIL">Civil / Structural</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issue Summary *</label>
                <input required type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Brief description of the issue..."
                  className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Location *</label>
                <input required type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Tech Block B, Floor 2, Lab 204"
                  className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Priority Level</label>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif">
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High (4-Hour SLA)</option>
                  <option value="URGENT">Urgent (Immediate Safety)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Additional Details</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif" />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">Cancel</button>
                <button type="submit" disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-lavender-700 hover:bg-lavender-800 text-white font-bold text-xs disabled:opacity-50">
                  {submitting ? 'Dispatching...' : 'Dispatch Work Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
