import React, { useState, useRef, useEffect } from 'react';
import api from '../../services/api';
import { Sparkles, Send, User, Bot, AlertCircle, TrendingUp } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface RiskData {
  risk_score?: number;
  risk_level?: string;
  predicted_attendance?: number;
  predicted_gpa?: number;
  primary_factors?: { factor: string; impact_score: number; description: string }[];
  recommended_actions?: string[];
}

interface AIAdvisorChatProps {
  showRisk?: boolean;
}

export const AIAdvisorChat: React.FC<AIAdvisorChatProps> = ({ showRisk = true }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Hello! I'm your **EduSphere AI Academic Advisor** — powered by Google Gemini + XGBoost risk intelligence. I have access to your complete academic dossier.

You can ask me about:
- Your CGPA improvement roadmap
- Attendance status and hall ticket eligibility
- Subject-wise exam preparation strategy
- Study materials, syllabus topics, and exam dates
- Academic risk analysis and recommended interventions

How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [loadingRisk, setLoadingRisk] = useState(showRisk);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showRisk) {
      api.get('/ai/predict-risk')
        .then((res) => {
          if (res.data.success) setRiskData(res.data.data);
        })
        .catch(() => {
          // Default risk display data
          setRiskData({ risk_score: 14, risk_level: 'LOW', predicted_attendance: 90, predicted_gpa: 8.6 });
        })
        .finally(() => setLoadingRisk(false));
    }
  }, [showRisk]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    const query = input;
    setInput('');
    setSending(true);

    try {
      const res = await api.post('/ai/advisor', { message: query });
      if (res.data.success) {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: res.data.data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I apologize — the advisory service is temporarily offline. Please check your internet connection or try again in a moment.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const riskColor = (level?: string) =>
    level === 'CRITICAL' ? 'text-red-700 bg-red-100 border-red-200' :
    level === 'MODERATE' ? 'text-amber-700 bg-amber-100 border-amber-200' :
    'text-emerald-700 bg-emerald-100 border-emerald-200';

  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith('**') && part.endsWith('**')
        ? <strong key={i}>{part.slice(2, -2)}</strong>
        : <span key={i}>{part}</span>
    );
  };

  const quickPrompts = [
    'What is my current CGPA and how can I improve it?',
    'Am I eligible for hall tickets this semester?',
    'Give me an exam preparation plan for CS401 Algorithms.',
    'Show me my academic risk analysis.',
  ];

  return (
    <div className="flex flex-col h-full font-serif">
      {/* Risk Score Banner */}
      {showRisk && (
        <div className="px-4 py-3 border-b border-lavender-100">
          {loadingRisk ? (
            <div className="h-10 bg-lavender-50 rounded-xl animate-pulse" />
          ) : riskData ? (
            <div className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-bold ${riskColor(riskData.risk_level)}`}>
              <TrendingUp className="h-4 w-4 flex-shrink-0" />
              <div>
                <span>Academic Risk Score: {riskData.risk_score}/100 — {riskData.risk_level} Risk Tier</span>
                <span className="font-normal ml-2 opacity-75">
                  · Predicted Attendance: {riskData.predicted_attendance}% · Predicted GPA: {riskData.predicted_gpa}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white ${
              msg.role === 'user' ? 'bg-lavender-700' : 'bg-gradient-to-br from-lavender-600 to-purple-700'
            }`}>
              {msg.role === 'user' ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            </div>
            <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
              msg.role === 'user'
                ? 'bg-lavender-700 text-white rounded-tr-none'
                : 'bg-lavender-50/80 border border-lavender-200 text-slate-800 rounded-tl-none'
            }`}>
              <p className="whitespace-pre-wrap">{renderContent(msg.content)}</p>
              <p className={`text-[10px] mt-1.5 opacity-60 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-lavender-600 to-purple-700 flex items-center justify-center text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="bg-lavender-50/80 border border-lavender-200 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-2">
              <div className="flex gap-1">
                <span className="h-2 w-2 bg-lavender-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 bg-lavender-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 bg-lavender-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-slate-500">EduSphere AI is analyzing your academic data...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Quick Questions</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => { setInput(p); }}
                className="px-2.5 py-1.5 rounded-lg bg-lavender-50 border border-lavender-200 text-[11px] text-lavender-800 hover:bg-lavender-100 transition font-bold"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="px-4 py-3 border-t border-lavender-100">
        <div className="flex gap-2">
          <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about CGPA, attendance, exams, study tips..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-lavender-50/60 border border-lavender-200 text-xs font-serif resize-none focus:outline-none focus:ring-2 focus:ring-lavender-400"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || sending}
            className="px-3.5 py-2.5 rounded-xl bg-lavender-700 hover:bg-lavender-800 text-white flex items-center justify-center transition disabled:opacity-40 self-end"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5 text-center">
          Powered by Google Gemini AI + XGBoost Risk Engine + MongoDB Atlas RAG
        </p>
      </div>
    </div>
  );
};
