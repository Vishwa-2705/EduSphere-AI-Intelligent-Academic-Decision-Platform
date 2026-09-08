import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { AIAdvisorChat } from '../../components/common/AIAdvisorChat';
import { Brain, TrendingUp, BookOpen, Calendar, MessageSquare, Shield, Award, Sparkles } from 'lucide-react';

export const StudentAIAdvisorPage: React.FC = () => {
  const [riskLoaded, setRiskLoaded] = useState(false);

  useEffect(() => {
    setRiskLoaded(true);
  }, []);

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 badge-lavender mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              Phase 5 — Generative AI + XGBoost Risk Engine
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              EduSphere AI Academic Decision Advisor
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Powered by Google Gemini API, XGBoost early-warning risk prediction, and MongoDB Atlas RAG
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold border border-purple-200">
              <Brain className="h-3 w-3" />
              Gemini Flash 2.0
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
              <TrendingUp className="h-3 w-3" />
              XGBoost + SHAP
            </span>
          </div>
        </div>
      </div>

      {/* Two-column: Chat + Capabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl border border-lavender-200/80 shadow-sm overflow-hidden flex flex-col h-[680px]">
            <div className="px-5 py-4 border-b border-lavender-100 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-lavender-600 to-purple-700 flex items-center justify-center text-white flex-shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">EduSphere AI Advisor</h3>
                <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                  Online — Ready for Academic Consultation
                </p>
              </div>
            </div>
            <AIAdvisorChat showRisk={true} />
          </div>
        </div>

        {/* Right Capabilities Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-lavender-200/80 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-lavender-100">AI Capabilities</h3>
            <div className="space-y-3">
              {[
                { icon: TrendingUp, color: 'text-lavender-700 bg-lavender-100', label: 'Risk Prediction', desc: 'XGBoost model analyzes attendance, marks, and submission history to compute dropout risk score' },
                { icon: Brain, color: 'text-purple-700 bg-purple-100', label: 'Gemini Academic Advisor', desc: 'Context-aware LLM counseling with full access to your academic dossier via RAG' },
                { icon: BookOpen, color: 'text-blue-700 bg-blue-100', label: 'Study Planner', desc: 'Generates personalized exam preparation timelines based on syllabus weightage' },
                { icon: Shield, color: 'text-emerald-700 bg-emerald-100', label: 'Explainable AI (SHAP)', desc: 'Every risk prediction includes SHAP factor attribution for full transparency' },
              ].map(({ icon: Icon, color, label, desc }) => (
                <div key={label} className="flex gap-3 p-3 rounded-xl bg-lavender-50/50 border border-lavender-100">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{label}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-lavender-600 to-purple-700 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-5 w-5" />
              <h3 className="text-sm font-bold">Academic Standing</h3>
            </div>
            <p className="text-xs opacity-90 leading-relaxed">
              Based on XGBoost analysis of your 2025-2026 academic performance, you are in the <strong>Dean's Honor Roll</strong> trajectory with a low academic risk score.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="bg-white/20 rounded-xl p-2.5 text-center">
                <p className="text-base font-extrabold font-mono">8.42</p>
                <p className="text-[10px] opacity-80">Current CGPA</p>
              </div>
              <div className="bg-white/20 rounded-xl p-2.5 text-center">
                <p className="text-base font-extrabold font-mono">88%</p>
                <p className="text-[10px] opacity-80">Attendance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
