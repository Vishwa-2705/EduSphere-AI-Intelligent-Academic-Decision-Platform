import React from 'react';
import { AIAdvisorChat } from '../../components/common/AIAdvisorChat';
import { Brain, Sparkles, TrendingUp, Users } from 'lucide-react';

export const MentorAIRiskPage: React.FC = () => {
  // Demo student risk cards for mentor oversight view
  const riskStudents = [
    { name: 'Rahul Sharma (22CS001)', risk: 78, level: 'CRITICAL', attendance: 58, cgpa: 6.2, reason: 'Attendance below 60%, internal < 15/30' },
    { name: 'Priya Nair (22CS023)', risk: 45, level: 'MODERATE', attendance: 71, cgpa: 7.1, reason: 'Borderline attendance, 2 assignment delays' },
    { name: 'Arjun Mehta (22CS044)', risk: 62, level: 'MODERATE', attendance: 68, cgpa: 6.8, reason: 'Declining GPA trend (-0.6 delta)' },
    { name: 'Sneha Kapoor (22CS084)', risk: 14, level: 'LOW', attendance: 92, cgpa: 8.9, reason: 'Strong performance across all metrics' },
  ];

  const levelColors: Record<string, string> = {
    CRITICAL: 'bg-red-100 text-red-800 border-red-200',
    MODERATE: 'bg-amber-100 text-amber-800 border-amber-200',
    LOW: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  };

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 badge-lavender mb-2">
              <Brain className="h-3.5 w-3.5" />
              AI Early Warning Risk Analytics
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Mentee Risk Dashboard & AI Counseling Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              XGBoost-powered dropout risk scoring for all assigned mentees, plus AI counseling support
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-[10px] font-bold border border-red-200">
              <TrendingUp className="h-3 w-3" />
              2 CRITICAL · 2 MODERATE
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Mentee Risk Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-lavender-200/80 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-lavender-100 flex items-center gap-2">
              <Users className="h-4 w-4 text-lavender-700" />
              <span>Assigned Mentees — Risk Matrix</span>
            </h3>
            <div className="space-y-3">
              {riskStudents.map((s) => (
                <div key={s.name} className={`p-4 rounded-xl border ${levelColors[s.level]}`}>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-xs font-bold">{s.name}</h4>
                    <span className="text-xs font-bold font-mono">{s.risk}/100</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/50 overflow-hidden mb-2">
                    <div
                      className={`h-1.5 rounded-full ${s.level === 'CRITICAL' ? 'bg-red-600' : s.level === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${s.risk}%` }}
                    />
                  </div>
                  <p className="text-[11px] opacity-80">{s.reason}</p>
                  <div className="flex gap-3 mt-2 text-[10px] font-mono font-bold">
                    <span>Attendance: {s.attendance}%</span>
                    <span>CGPA: {s.cgpa}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: AI Chat for Mentor Counseling */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-lavender-200/80 shadow-sm overflow-hidden flex flex-col h-[640px]">
            <div className="px-5 py-4 border-b border-lavender-100 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-lavender-600 to-purple-700 flex items-center justify-center text-white flex-shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">AI Counseling Advisor</h3>
                <p className="text-[11px] text-emerald-700 font-bold">
                  Ask about intervention strategies for high-risk mentees
                </p>
              </div>
            </div>
            <AIAdvisorChat showRisk={false} />
          </div>
        </div>
      </div>
    </div>
  );
};
