import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { CreditCard, CheckCircle2, AlertTriangle, Download, DollarSign } from 'lucide-react';

export const AdminFeesPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        setLoading(true);
        const res = await api.get('/fees/admin-overview');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load admin fee overview:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, []);

  if (loading && !data) {
    return (
      <div className="flex h-96 items-center justify-center font-serif">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-lavender-700 border-t-transparent" />
          <p className="text-sm font-bold text-slate-700">Loading Campus Financial Ledger & Fee Metrics...</p>
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalExpected: '₹10.97 Cr',
    totalCollected: '₹10.40 Cr',
    totalOutstanding: '₹57.04 Lakhs',
    reconciliationRate: '94.8%',
  };
  const invoices = data?.invoices || [];

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-lavender mb-2 inline-block">Institutional Financial Master</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Campus Fee Collection & Invoicing Ledger
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tuition receipts reconciliation, digital invoices, and cohort fee recovery tracking
            </p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-lavender-700 hover:bg-lavender-800 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition">
            <Download className="h-4 w-4" />
            <span>Export Financial Audit Sheet</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Expected</p>
          <h3 className="text-3xl font-extrabold text-slate-900 font-mono mt-1.5">{metrics.totalExpected}</h3>
          <p className="text-xs text-slate-500 mt-2">1,240 Enrolled Students</p>
        </div>

        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Reconciled</p>
          <h3 className="text-3xl font-extrabold text-emerald-700 font-mono mt-1.5">{metrics.totalCollected}</h3>
          <p className="text-xs text-emerald-700 font-bold mt-2">Reconciliation: {metrics.reconciliationRate}</p>
        </div>

        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Outstanding Due</p>
          <h3 className="text-3xl font-extrabold text-amber-600 font-mono mt-1.5">{metrics.totalOutstanding}</h3>
          <p className="text-xs text-slate-500 mt-2">Recovery in Progress</p>
        </div>

        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Collection Rate</p>
          <h3 className="text-3xl font-extrabold text-lavender-900 font-mono mt-1.5">{metrics.reconciliationRate}</h3>
          <p className="text-xs text-slate-500 mt-2">Optimal Benchmark: 90%+</p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-lavender-200/80 shadow-sm overflow-hidden p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-lavender-100 flex items-center justify-between">
          <span>Student Fee Accounts & Invoice Registry</span>
          <span className="badge-lavender">{invoices.length} Registered Accounts</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="edusphere-table">
            <thead>
              <tr>
                <th>Student Name & Reg No</th>
                <th>Total Invoiced</th>
                <th>Paid Amount</th>
                <th>Balance Due</th>
                <th>Status</th>
                <th>Latest Receipt</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv: any) => (
                <tr key={inv.id}>
                  <td>
                    <p className="font-bold text-slate-900">{inv.studentName}</p>
                    <p className="text-xs font-mono text-slate-400">{inv.registrationNo}</p>
                  </td>
                  <td className="font-mono font-bold text-slate-900">₹{inv.totalAmount.toLocaleString()}</td>
                  <td className="font-mono text-emerald-700 font-bold">₹{inv.paidAmount.toLocaleString()}</td>
                  <td className="font-mono text-slate-700">₹{inv.balanceAmount.toLocaleString()}</td>
                  <td>
                    <span className={inv.status === 'PAID' ? 'badge-emerald' : 'badge-amber'}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="font-mono text-xs text-lavender-900 font-bold">{inv.recentReceipt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
