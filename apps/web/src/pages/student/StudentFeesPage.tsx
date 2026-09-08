import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { getStudentRecord } from '../../data/studentData';
import { CheckCircle2, Download } from 'lucide-react';

export const StudentFeesPage: React.FC = () => {
  const { user } = useAuth();
  const student = getStudentRecord(user?.email);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const res = await api.get('/fees/my-invoice');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load fee invoice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, []);

  const handleDownloadReceipt = () => {
    const invoiceData = data?.invoice || {
      totalAmount: student.totalFee,
      paidAmount: student.paidFee,
      balanceAmount: student.balanceFee,
      tuitionFee: student.tuitionFee,
      laboratoryFee: student.laboratoryFee,
      hostelFee: student.hostelFee,
      libraryFee: student.libraryFee,
      status: 'PAID',
      transactions: [{ transactionId: student.transactionId, amount: student.paidFee, paymentMethod: student.paymentMethod, paidAt: new Date(), receiptNumber: `REC-${new Date().getFullYear()}-${student.registerNumber}-${Math.floor(1000 + Math.random() * 9000)}` }],
    };

    const formatMoney = (value: number) => value.toLocaleString('en-IN');
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 42;

    doc.setFillColor(109, 93, 230);
    doc.rect(0, 0, pageWidth, 84, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('EduSphere AI', margin, 34);
    doc.setFontSize(12);
    doc.text('Official Fee Receipt', margin, 58);

    doc.setTextColor(28, 38, 54);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Receipt No: ${invoiceData.transactions?.[0]?.receiptNumber || 'REC-2026-084-7812'}`, margin, 110);
    doc.text(`Issue Date: ${new Date().toLocaleDateString()}`, margin, 126);
    doc.text(`Student: ${student.name}`, margin, 150);
    doc.text(`Register No: ${student.registerNumber}`, margin, 166);
    doc.text(`Programme: ${student.programme}`, margin, 182);
    doc.text(`Semester: ${student.semester}`, margin, 198);

    let y = 228;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Fee Breakdown', margin, y);
    y += 18;

    const rows = [
      [`${student.semester} Tuition & Academic Instruction Fee`, Number(invoiceData.tuitionFee || student.tuitionFee)],
      ['Laboratory, Hardware & Computing Center Fee', Number(invoiceData.laboratoryFee || student.laboratoryFee)],
      ...(student.studentType === 'DAY_SCHOLAR' ? [['Campus Bus Transportation Fee', Number(invoiceData.busFee || student.busFee)]] : [['Hostel Accommodation & Utility Maintenance', Number(invoiceData.hostelFee || student.hostelFee)]]),
      ['University Digital Library & Online Journal Access', Number(invoiceData.libraryFee || student.libraryFee)],
    ];

    doc.setFont('helvetica', 'normal');
    rows.forEach(([label, value]) => {
      const text = formatMoney(Number(value)).replace(/'/g, '');
      doc.text(label.toString(), margin, y);
      doc.text(text, pageWidth - margin - 80, y, { align: 'right' });
      y += 18;
    });

    y += 12;
    doc.setDrawColor(202, 202, 202);
    doc.line(margin, y, pageWidth - margin, y);
    y += 18;
    doc.setFont('helvetica', 'bold');
    doc.text('Total Amount', margin, y);
    doc.text(formatMoney(Number(invoiceData.totalAmount || student.totalFee)).replace(/'/g, ''), pageWidth - margin - 80, y, { align: 'right' });
    y += 18;
    doc.text('Paid Amount', margin, y);
    doc.text(formatMoney(Number(invoiceData.paidAmount || student.paidFee)).replace(/'/g, ''), pageWidth - margin - 80, y, { align: 'right' });
    y += 18;
    doc.text('Outstanding Balance', margin, y);
    doc.text(formatMoney(Number(invoiceData.balanceAmount || student.balanceFee)).replace(/'/g, ''), pageWidth - margin - 80, y, { align: 'right' });

    y += 30;
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Status', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(invoiceData.status === 'PAID' ? 'PAID AND CLEARED' : 'PENDING', pageWidth - margin - 120, y, { align: 'right' });

    y += 24;
    doc.text(`Payment Method: ${(invoiceData.transactions?.[0]?.paymentMethod || 'ONLINE_UPI')}`, margin, y);
    y += 16;
    doc.text(`Transaction ID: ${(invoiceData.transactions?.[0]?.transactionId || student.transactionId)}`, margin, y);

    doc.setFont('helvetica', 'italic');
    doc.setTextColor(90, 90, 90);
    doc.text('This is a computer-generated receipt valid for official academic records.', margin, 760);

    doc.save('official-fee-receipt.pdf');
    setDownloadMessage('Official fee receipt downloaded as PDF.');
    setTimeout(() => setDownloadMessage(null), 4000);
  };

  if (loading && !data) {
    return (
      <div className="flex h-96 items-center justify-center font-serif">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-lavender-700 border-t-transparent" />
          <p className="text-sm font-bold text-slate-700">Loading Student Fee Ledger & Invoices...</p>
        </div>
      </div>
    );
  }

  const invoice = data?.invoice || {
    totalAmount: student.totalFee,
    paidAmount: student.paidFee,
    balanceAmount: student.balanceFee,
    tuitionFee: student.tuitionFee,
    laboratoryFee: student.laboratoryFee,
    hostelFee: student.hostelFee,
    libraryFee: student.libraryFee,
    status: 'PAID',
    transactions: [{ transactionId: student.transactionId, amount: student.paidFee, paymentMethod: student.paymentMethod, paidAt: new Date(), receiptNumber: `REC-${new Date().getFullYear()}-${student.registerNumber}-${Math.floor(1000 + Math.random() * 9000)}` }],
  };

  const isPaid = invoice.status === 'PAID' || invoice.balanceAmount === 0;

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-lavender mb-2 inline-block">Finance & Student Accounts</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Semester Fee Invoicing & Payment Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Institutional tuition ledger, digital fee receipts, and automated payment reconciliation
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={isPaid ? 'badge-emerald text-sm px-4 py-1.5' : 'badge-amber text-sm px-4 py-1.5'}>
              {isPaid ? 'All Dues Cleared ✓' : `Balance Due: ₹${invoice.balanceAmount?.toLocaleString()}`}
            </span>
          </div>
        </div>
      </div>

      {downloadMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-serif flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <span className="font-bold">{downloadMessage}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Semester Dues</p>
          <h3 className="text-3xl font-extrabold text-slate-900 font-mono mt-2">
            ₹{invoice.totalAmount?.toLocaleString()}
          </h3>
          <p className="text-xs text-slate-500 mt-2">Academic Year 2025–2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Paid Amount</p>
          <h3 className="text-3xl font-extrabold text-emerald-700 font-mono mt-2">
            ₹{invoice.paidAmount?.toLocaleString()}
          </h3>
          <p className="text-xs text-emerald-700 font-bold mt-2 flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            Reconciled with Finance Desk
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Outstanding Balance</p>
          <h3 className={`text-3xl font-extrabold font-mono mt-2 ${isPaid ? 'text-slate-400' : 'text-amber-600'}`}>
            ₹{invoice.balanceAmount?.toLocaleString()}
          </h3>
          <p className="text-xs text-slate-500 mt-2">
            {isPaid ? 'Zero Pending Balance' : 'Due by March 31, 2026'}
          </p>
        </div>
      </div>

      {/* Main Grid: Fee Breakdown + Payment Action */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Itemized Fee Breakdown Table */}
        <div className="space-y-6 lg:col-span-8">
          <div className="bg-white rounded-2xl border border-lavender-200/80 shadow-sm overflow-hidden p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-lavender-100">
              Itemized Fee Component Breakdown
            </h3>

            <div className="space-y-3">
              {[
                { name: `${student.semester} Tuition & Academic Instruction Fee`, amount: invoice.tuitionFee || student.tuitionFee, desc: 'Covers core lecture credits and faculty instruction' },
                { name: 'Laboratory, Hardware & Computing Center Fee', amount: invoice.laboratoryFee || student.laboratoryFee, desc: 'Computing lab, PyTorch GPU cluster & AI lab access' },
                student.studentType === 'DAY_SCHOLAR' ? { name: 'Campus Bus Transportation Fee', amount: invoice.busFee || student.busFee, desc: 'Academic year campus bus route and transportation pass' } : { name: `Hostel Accommodation & Utility Maintenance (${student.hostelBlock})`, amount: invoice.hostelFee || student.hostelFee, desc: `${student.hostelBlock}, Room ${student.hostelRoom} charges` },
                { name: 'University Digital Library & Online Journal Access', amount: invoice.libraryFee || student.libraryFee, desc: 'IEEE, ACM Digital Library & text repository access' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl border border-lavender-200 bg-lavender-50/40 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  <span className="font-mono font-extrabold text-sm sm:text-base text-slate-900 flex-shrink-0">
                    ₹{item.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-lavender-100 flex items-center justify-between font-bold text-base">
              <span>Total Semester Invoiced Amount</span>
              <span className="font-mono text-xl text-lavender-900 font-extrabold">
                ₹{invoice.totalAmount?.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-2xl border border-lavender-200/80 shadow-sm overflow-hidden p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-lavender-100 flex items-center justify-between">
              <span>Payment Receipt & Transaction Ledger</span>
              <span className="badge-emerald">{invoice.transactions?.length || 1} Receipts</span>
            </h3>

            <div className="space-y-3">
              {(invoice.transactions?.length > 0 ? invoice.transactions : [
                { transactionId: student.transactionId, amount: student.paidFee, paymentMethod: student.paymentMethod, paidAt: new Date(), receiptNumber: `REC-${new Date().getFullYear()}-${student.registerNumber}-${Math.floor(1000 + Math.random() * 9000)}` },
              ]).map((t: any, i: number) => (
                <div key={i} className="p-4 rounded-xl border border-lavender-200 bg-lavender-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-lavender-800 bg-lavender-100 px-2 py-0.5 rounded">
                        {t.receiptNumber}
                      </span>
                      <span className="font-bold text-slate-900">₹{t.amount.toLocaleString()}</span>
                      <span className="badge-emerald font-mono">{t.paymentMethod}</span>
                    </div>
                    <p className="text-slate-400 font-mono mt-1">Txn ID: {t.transactionId} • {new Date(t.paidAt).toLocaleDateString()}</p>
                  </div>

                  <button onClick={handleDownloadReceipt} className="px-3.5 py-1.5 rounded-lg bg-white border border-lavender-300 hover:bg-lavender-50 font-bold text-slate-700 flex items-center gap-1.5 transition">
                    <Download className="h-3.5 w-3.5 text-lavender-700" />
                    <span>Download Receipt</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <div className="bg-white rounded-2xl border border-lavender-200/80 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-900 mb-2">Fee Payment Status</h3>
            <p className="text-xs text-slate-500 mb-5">All semester dues have been reconciled with accounts.</p>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-emerald-800 font-bold">
                Status: {isPaid ? 'Paid and cleared' : 'Outstanding'}
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-slate-700">
                Total due: ₹{invoice.totalAmount?.toLocaleString()}
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-slate-700">
                Paid: ₹{invoice.paidAmount?.toLocaleString()}
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-slate-700">
                Balance: ₹{invoice.balanceAmount?.toLocaleString()}
              </div>
            </div>

            <button onClick={handleDownloadReceipt} className="mt-5 w-full py-3.5 rounded-xl bg-lavender-700 hover:bg-lavender-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-lavender-700/20 flex items-center justify-center gap-2 transition">
              <Download className="h-4 w-4" />
              <span>Download Official Fee Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
