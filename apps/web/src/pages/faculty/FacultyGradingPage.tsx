import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Award, CheckCircle2, Send, AlertCircle, FileCheck } from 'lucide-react';

export const FacultyGradingPage: React.FC = () => {
  const [exams, setExams] = useState<any[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [examData, setExamData] = useState<any>(null);
  const [marksInput, setMarksInput] = useState<Record<string, number>>({});
  const [feedbackInput, setFeedbackInput] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const res = await api.get('/exams/schedule');
        if (res.data.success && res.data.data.length > 0) {
          setExams(res.data.data);
          setSelectedExamId(res.data.data[0].id);
        }
      } catch (err) {
        console.error('Failed to load exams:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  useEffect(() => {
    if (!selectedExamId) return;
    const fetchExamGrades = async () => {
      try {
        const res = await api.get(`/exams/${selectedExamId}/grades`);
        if (res.data.success) {
          setExamData(res.data.data);
          const initialMarks: Record<string, number> = {};
          const initialFeedback: Record<string, string> = {};
          res.data.data.studentRoster?.forEach((s: any) => {
            if (s.marksObtained !== null) initialMarks[s.studentId] = s.marksObtained;
            if (s.feedback) initialFeedback[s.studentId] = s.feedback;
          });
          setMarksInput(initialMarks);
          setFeedbackInput(initialFeedback);
        }
      } catch (err) {
        console.error('Failed to load exam grades:', err);
      }
    };
    fetchExamGrades();
  }, [selectedExamId]);

  const handleMarkChange = (studentId: string, val: string) => {
    const num = Number(val);
    setMarksInput((prev) => ({ ...prev, [studentId]: num }));
  };

  const handleFeedbackChange = (studentId: string, val: string) => {
    setFeedbackInput((prev) => ({ ...prev, [studentId]: val }));
  };

  const handleSubmitGrades = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamId) return;

    try {
      setIsSubmitting(true);
      const grades = Object.keys(marksInput).map((studentId) => ({
        studentId,
        marksObtained: marksInput[studentId],
        feedback: feedbackInput[studentId] || '',
      }));

      const res = await api.post(`/exams/${selectedExamId}/grades`, { grades });
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        setTimeout(() => setSuccessMsg(null), 4000);
        // Refresh
        const refreshRes = await api.get(`/exams/${selectedExamId}/grades`);
        if (refreshRes.data.success) setExamData(refreshRes.data.data);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit marks');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center font-serif">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-lavender-700 border-t-transparent" />
          <p className="text-sm font-bold text-slate-700">Loading Examination Evaluation Console...</p>
        </div>
      </div>
    );
  }

  const roster = examData?.studentRoster || [];
  const maxMarks = examData?.exam?.maxMarks || 50;

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-lavender mb-2 inline-block">Evaluation & Grade Recording</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Marks Entry & Grade Rubrics
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Submit internal assessment and mid-term marks for official academic transcript computation
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-lavender-50 border border-lavender-300 text-xs font-bold text-slate-900 font-serif focus:outline-none focus:ring-2 focus:ring-lavender-500/20"
            >
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.courseCode} – {ex.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-serif flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grade Entry Table */}
      <div className="bg-white rounded-2xl border border-lavender-200/80 shadow-sm p-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-lavender-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Student Evaluation Roster</h3>
            <p className="text-xs text-slate-500">Max Score: {maxMarks} Marks • Weightage: {examData?.exam?.weightagePercent || 30}%</p>
          </div>
          <span className="badge-emerald">{examData?.gradedCount || 0} of {roster.length} Graded</span>
        </div>

        <form onSubmit={handleSubmitGrades} className="space-y-4">
          <div className="overflow-x-auto">
            <table className="edusphere-table">
              <thead>
                <tr>
                  <th>Student Name & Reg No</th>
                  <th>Section</th>
                  <th>Marks (Max {maxMarks})</th>
                  <th>Percentage</th>
                  <th>Letter Grade</th>
                  <th>Feedback Remarks</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((s: any) => {
                  const currentMark = marksInput[s.studentId] !== undefined ? marksInput[s.studentId] : (s.marksObtained || 0);
                  const pct = Math.round((currentMark / maxMarks) * 100);
                  const letter = pct >= 90 ? 'O' : pct >= 80 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'B+' : pct >= 50 ? 'B' : pct >= 40 ? 'P' : 'F';

                  return (
                    <tr key={s.studentId}>
                      <td>
                        <p className="font-bold text-slate-900">{s.fullName}</p>
                        <p className="text-xs font-mono text-slate-400">{s.registrationNo}</p>
                      </td>
                      <td className="font-mono text-slate-600">Sec {s.section}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max={maxMarks}
                          value={marksInput[s.studentId] !== undefined ? marksInput[s.studentId] : (s.marksObtained ?? '')}
                          onChange={(e) => handleMarkChange(s.studentId, e.target.value)}
                          placeholder="Score"
                          className="w-24 px-3 py-1.5 rounded-lg bg-lavender-50 border border-slate-200 text-xs font-mono font-bold focus:bg-white focus:border-lavender-500 focus:outline-none"
                        />
                      </td>
                      <td className="font-mono font-bold text-xs">{pct}%</td>
                      <td>
                        <span className="badge-lavender font-mono font-extrabold">{letter}</span>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={feedbackInput[s.studentId] || ''}
                          onChange={(e) => handleFeedbackChange(s.studentId, e.target.value)}
                          placeholder="Feedback comments..."
                          className="w-full px-3 py-1.5 rounded-lg bg-lavender-50/50 border border-slate-200 text-xs font-serif focus:bg-white focus:border-lavender-500 focus:outline-none"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-lavender-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || roster.length === 0}
              className="px-6 py-3 rounded-xl bg-lavender-700 hover:bg-lavender-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-lavender-700/20 flex items-center gap-2 transition disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? 'Saving Grades...' : 'Save & Publish Examination Grades'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
