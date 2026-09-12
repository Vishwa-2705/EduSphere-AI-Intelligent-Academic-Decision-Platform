import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import api, { isDemoSession } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { getStudentRecord } from '../../data/studentData';
import { MetricCard } from '../../components/common/MetricCard';
import {
  CalendarCheck,
  Award,
  BookOpen,
  UserCheck,
  AlertCircle,
  Sparkles,
  Clock,
  MapPin,
  CheckCircle2,
  Phone,
  Mail,
  CreditCard,
  FileText,
  Download,
  Calendar,
  Layers,
} from 'lucide-react';


export const StudentDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const student = getStudentRecord(user?.email);
  const [data, setData] = useState<any>(null);
  const [feeInvoice, setFeeInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const feeSummary = feeInvoice?.invoice || {
    totalAmount: student.totalFee,
    paidAmount: student.paidFee,
    balanceAmount: student.balanceFee,
    tuitionFee: student.tuitionFee,
    laboratoryFee: student.laboratoryFee,
    hostelFee: student.hostelFee,
    libraryFee: student.libraryFee,
    status: student.balanceFee === 0 ? 'PAID' : 'PENDING',
    transactions: [{ transactionId: student.transactionId, amount: student.paidFee, paymentMethod: student.paymentMethod, receiptNumber: `REC-${new Date().getFullYear()}-${student.registerNumber}-${Math.floor(1000 + Math.random() * 9000)}` }],
  };

  const downloadOfficialFeeReceipt = () => {
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
    doc.text(`Receipt No: ${feeSummary.transactions?.[0]?.receiptNumber || `REC-2026-${student.registerNumber}-${Math.floor(1000 + Math.random() * 9000)}`}`, margin, 110);
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
      [`${student.semester} Tuition & Academic Instruction Fee`, Number(feeSummary.tuitionFee || student.tuitionFee)],
      ['Laboratory, Hardware & Computing Center Fee', Number(feeSummary.laboratoryFee || student.laboratoryFee)],
      ['Hostel Accommodation & Utility Maintenance', Number(feeSummary.hostelFee || student.hostelFee)],
      ['University Digital Library & Online Journal Access', Number(feeSummary.libraryFee || student.libraryFee)],
    ];

    doc.setFont('helvetica', 'normal');
    rows.forEach(([label, value]) => {
      const text = formatMoney(Number(value));
      doc.text(label.toString(), margin, y);
      doc.text(text.replace(/'/g, ''), pageWidth - margin - 80, y, { align: 'right' });
      y += 18;
    });

    y += 12;
    doc.setDrawColor(202, 202, 202);
    doc.line(margin, y, pageWidth - margin, y);
    y += 18;
    doc.setFont('helvetica', 'bold');
    doc.text('Total Amount', margin, y);
    doc.text(formatMoney(Number(feeSummary.totalAmount || student.totalFee)).replace(/'/g, ''), pageWidth - margin - 80, y, { align: 'right' });
    y += 18;
    doc.text('Paid Amount', margin, y);
    doc.text(formatMoney(Number(feeSummary.paidAmount || student.paidFee)).replace(/'/g, ''), pageWidth - margin - 80, y, { align: 'right' });
    y += 18;
    doc.text('Outstanding Balance', margin, y);
    doc.text(formatMoney(Number(feeSummary.balanceAmount || student.balanceFee)).replace(/'/g, ''), pageWidth - margin - 80, y, { align: 'right' });

    y += 30;
    doc.text('Payment Status', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(feeSummary.status === 'PAID' ? 'PAID AND CLEARED' : 'PENDING', pageWidth - margin - 120, y, { align: 'right' });

    y += 24;
    doc.text(`Transaction ID: ${feeSummary.transactions?.[0]?.transactionId || student.transactionId}`, margin, y);
    y += 16;
    doc.text(`Payment Method: ${feeSummary.transactions?.[0]?.paymentMethod || student.paymentMethod}`, margin, y);

    doc.setFont('helvetica', 'italic');
    doc.setTextColor(90, 90, 90);
    doc.text('This is a computer-generated receipt valid for official academic records.', margin, 760);

    doc.save('official-fee-receipt.pdf');
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [dashboardRes, feesRes] = await Promise.all([
          api.get('/dashboard/student'),
          api.get('/fees/my-invoice'),
        ]);

        if (dashboardRes.data.success) {
          setData(dashboardRes.data.data);
        }

        if (feesRes.data.success) {
          setFeeInvoice(feesRes.data.data);
        }
      } catch (err: any) {
        if (!isDemoSession()) {
          setError(err.response?.data?.message || 'Failed to load student academic records.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center font-serif">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm font-bold text-slate-700">Loading Student Academic Hub...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-serif">
        <div className="flex items-center gap-2 font-bold text-base">
          <AlertCircle className="h-5 w-5" />
          <span>System Notice</span>
        </div>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );
  }

  const metrics = data?.metrics || {
    cgpa: 8.42,
    currentSemesterSgpa: 8.65,
    overallAttendance: 88,
    totalCoursesEnrolled: 3,
    creditsCompleted: 98,
    totalCreditsRequired: 160,
    pendingFeeDue: 0,
  };

  const riskScore = data?.riskScore;
  const mentor = data?.mentor;
  const isFeePaid = Number(feeSummary.balanceAmount || student.balanceFee) === 0 || feeSummary.status === 'PAID';

  return (
    <div className="space-y-6 font-serif">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-bold text-indigo-700 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{student.academicYear} • Semester {student.semester}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {student.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Programme: <strong className="text-slate-800">{student.programme}</strong> • Semester: <strong className="text-slate-800">{student.semester} (Sec {profile?.section || 'A'})</strong> • Department: <strong className="text-slate-800">{student.department}</strong> • Register No: <strong className="text-indigo-600 font-mono">{student.registerNumber}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-right">
              <p className="text-[11px] font-bold uppercase text-slate-400">Academic Standing</p>
              <p className="text-sm font-bold text-emerald-600">Dean's Honor Roll Track</p>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Summary Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Cumulative CGPA"
          value={metrics.cgpa.toFixed(2)}
          subtext={`Current SGPA: ${metrics.currentSemesterSgpa.toFixed(2)} / 10.0`}
          icon={Award}
          variant="indigo"
          trend={{ value: 'Top 5% Cohort', isPositive: true }}
        />

        <MetricCard
          title="Semester SGPA"
          value={metrics.currentSemesterSgpa.toFixed(2)}
          subtext="Mid-Term Target: 8.50+"
          icon={Sparkles}
          variant="purple"
          trend={{ value: '+0.23 vs Sem 5', isPositive: true }}
        />

        <MetricCard
          title="Overall Attendance"
          value={`${metrics.overallAttendance}%`}
          subtext="Statutory Minimum: 75%"
          icon={CalendarCheck}
          variant={metrics.overallAttendance >= 85 ? 'emerald' : metrics.overallAttendance >= 75 ? 'amber' : 'rose'}
          trend={{
            value: metrics.overallAttendance >= 75 ? 'Exam Clearance OK' : 'Attendance Alert',
            isPositive: metrics.overallAttendance >= 75,
          }}
        />

        <MetricCard
          title="Credits Earned"
          value={`${metrics.creditsCompleted} / ${metrics.totalCreditsRequired}`}
          subtext="Degree Progress: 61.2%"
          icon={BookOpen}
          variant="slate"
        />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-900">Academic Snapshot</h3>
            <p className="mt-2 text-sm text-slate-500">Departmental progress, attendance, and mentoring updates appear here.</p>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-4">
          {/* AI Academic Health Insight Card */}
          <div className="bg-white rounded-2xl border border-indigo-200/80 shadow-sm p-6 relative overflow-hidden">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-100">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">AI Academic Decision Engine</h3>
                <p className="text-[11px] text-slate-500">Explainable Early-Warning Diagnostics</p>
              </div>
            </div>

            <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
              <div className="flex items-center justify-between font-bold">
                <span>Predicted Risk Tier:</span>
                <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-md text-[10px] font-mono">
                  LOW RISK (14/100)
                </span>
              </div>
              <p className="mt-1 text-[11px] text-emerald-700 leading-snug">
                92% probability of clearing Semester VI with First Class Distinction (Projected SGPA: 8.6+).
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Primary Positive Factors</p>
              {riskScore?.primaryFactors?.map((f: any, i: number) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700 p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>{f.factor}:</strong> {f.description}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">AI Recommended Study Paths</p>
              <div className="space-y-1.5 text-xs text-indigo-950">
                {riskScore?.recommendedActions?.map((act: string, i: number) => (
                  <div key={i} className="p-2 rounded-lg bg-indigo-50/60 border border-indigo-100 text-indigo-900 text-xs">
                    • {act}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assigned Faculty Mentor Section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Assigned Faculty Mentor</h3>
                <p className="text-xs text-slate-500">{student.mentorDepartment}</p>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs font-serif">
              <div>
                <h4 className="text-base font-bold text-slate-900">{student.mentorName}</h4>
                <p className="text-slate-500">{student.mentorDesignation}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-indigo-600" />
                  <span>{student.mentorEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-indigo-600" />
                  <span>{student.mentorContact}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                  <span>{student.mentorHours}</span>
                </div>
              </div>

              <div className="pt-2">
                <button className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs tracking-wider uppercase transition shadow-sm">
                  Request Counseling Meeting
                </button>
              </div>
            </div>
          </div>

          {/* Fee & Financial Status Section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Fee Status & Accounts</h3>
                <p className="text-xs text-slate-500">Semester VI Tuition & Hostel Invoicing</p>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Total Assessed Fee:</span>
                <span className="font-bold text-slate-900">₹{Number(feeSummary.totalAmount || student.totalFee).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Total Paid:</span>
                <span className="font-bold text-emerald-600">₹{Number(feeSummary.paidAmount || student.paidFee).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 font-bold">
                <span className="text-slate-700">Pending Dues:</span>
                <span className={isFeePaid ? 'text-emerald-600 font-mono' : 'text-amber-600 font-mono'}>
                  ₹{Number(feeSummary.balanceAmount || student.balanceFee).toLocaleString('en-IN')} {isFeePaid ? '(Fully Cleared)' : '(Outstanding)'}
                </span>
              </div>

              <div className="pt-2">
                <button onClick={downloadOfficialFeeReceipt} className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition border border-slate-200 flex items-center justify-center gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Official Fee Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
