import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, User, Brain, TrendingUp, 
  AlertCircle, ChevronRight, MoreHorizontal, 
  RotateCcw, ThumbsUp, ThumbsDown, Zap, 
  MessageSquare, Layout, BarChart3, CheckCircle2
} from 'lucide-react';
import { useUser } from '../Login-Page/hooks/use-auth';

// --- MOCK CONTEXT DATA (Simulating the AI reading the DB) ---
// Base context; readiness_score will be synced from localStorage/events at runtime
const USER_CONTEXT_BASE = {
  name: "Alex",
  readiness_score: 72,
  strongest_module: "Technical Coding (92%)",
  weakest_module: "HR Interview (55%)",
  last_activity: "Failed HR Simulation: 'Conflict Resolution' scenario.",
  recent_trend: "improving",
  next_step: "Practice Behavioral Answers",
};

const QUICK_PROMPTS = [
  "Start mock behavioral interview",
  "Start mock technical interview",
  "Analyze my readiness",
  "Why is my HR score low?",
  "Create a 3-day plan",
  "Review my last error"
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'ai',
    text: "Hello Alex — I'm your interview coach. I can run a mock interview (behavioral or technical), ask follow-up questions, and give feedback + scoring. Would you like to start a mock interview now, or ask a specific question?",
    timestamp: '10:00 AM'
  }
];

// --- COMPONENTS ---

const ChatMessage = ({ msg }) => {
  const isUser = msg.sender === 'user';
  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] md:max-w-[70%] gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center border ${isUser ? 'bg-gray-100 border-gray-200' : 'bg-indigo-600 border-indigo-600 text-white'}`}>
          {isUser ? <User size={20} className="text-gray-600" /> : <Sparkles size={20} />}
        </div>

        {/* Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isUser 
              ? 'bg-indigo-600 text-white rounded-tr-none' 
              : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
          }`}>
            {msg.text}
          </div>
          
          {/* AI Metadata (Feedback/Actions) */}
          {!isUser && (
            <div className="flex items-center gap-3 mt-2 pl-1">
              <span className="text-[10px] text-gray-400 font-medium">{msg.timestamp}</span>
              <div className="flex gap-2">
                <button className="text-gray-300 hover:text-indigo-600 transition-colors"><ThumbsUp size={12} /></button>
                <button className="text-gray-300 hover:text-gray-500 transition-colors"><ThumbsDown size={12} /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InsightCard = ({ label, value, subtext, icon: Icon, color }) => (
  <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
    <div className="flex justify-between items-start mb-2">
      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</div>
      <Icon size={16} className={`${color} opacity-80`} />
    </div>
    <div className="text-lg font-black text-gray-900">{value}</div>
    {subtext && <div className="text-xs text-gray-500 mt-1">{subtext}</div>}
  </div>
);

const MentorModule = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  // runtime user context that keeps readiness in sync with ReadinessRadar
  const [userContext, setUserContext] = useState(() => {
    try {
      const stored = localStorage.getItem('readinessScore');
      const n = stored !== null && stored !== '' ? Number(stored) : null;
      return { ...USER_CONTEXT_BASE, readiness_score: (typeof n === 'number' && !Number.isNaN(n)) ? n : USER_CONTEXT_BASE.readiness_score };
    } catch (e) {
      return { ...USER_CONTEXT_BASE };
    }
  });
  const chatEndRef = useRef(null);
  const { data: user } = useUser();
    const backendUrl = import.meta.env.VITE_GEMINI_URL || import.meta.env.VITE_BACKEND_URL || 'https://interview-mentor-backend.onrender.com';
  // Clamp readiness score to [0,100] and format for width style
  const progressWidth = `${Math.max(0, Math.min(100, Number(userContext.readiness_score) || 0))}%`;

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Replace placeholder name in the initial message with real user's name when available
  useEffect(() => {
    if (user && user.name) {
      setMessages(prev => {
        if (!prev || prev.length === 0) return prev;
        const updated = [...prev];
        const first = updated[0];
        if (!first || !first.text) return prev;
        // Replace the mock name from USER_CONTEXT with the real name
        const newText = String(first.text).replace(USER_CONTEXT_BASE.name, user.name);
        updated[0] = { ...first, text: newText };
        return updated;
      });
    }
  }, [user]);

  // Sync readiness score from ReadinessRadar via localStorage or custom event
  useEffect(() => {
    const handler = (e) => {
      try {
        const newScore = e?.detail?.readinessScore;
        if (typeof newScore === 'number' && !Number.isNaN(newScore)) {
          setUserContext(prev => ({ ...prev, readiness_score: newScore }));
        }
      } catch (err) {}
    };

    const storageHandler = (e) => {
      try {
        if (e?.key === 'readinessScore') {
          const v = e?.newValue ? Number(e.newValue) : null;
          if (typeof v === 'number' && !Number.isNaN(v)) setUserContext(prev => ({ ...prev, readiness_score: v }));
        }
      } catch (err) {}
    };

    window.addEventListener('readinessScoreUpdated', handler);
    window.addEventListener('storage', storageHandler);
    return () => {
      window.removeEventListener('readinessScoreUpdated', handler);
      window.removeEventListener('storage', storageHandler);
    };
  }, []);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      sender: 'user',
      text: text,
      timestamp: 'Now'
    };

    // add the user message locally first
    const currentMessages = [...messages, newMsg];
    setMessages(currentMessages);
    setInput("");
    setIsTyping(true);

    try {
      // Build a trimmed message history to reduce token usage
      const buildTrimmedChat = (msgs, maxMessages = 12, maxChars = 8000, maxPerMsg = 3000) => {
        const mapped = msgs.map(m => ({ role: m.sender === 'ai' ? 'assistant' : 'user', content: m.text ?? m.content ?? '' }));
        let last = mapped.slice(-maxMessages);
        while (last.reduce((acc, m) => acc + (m.content?.length || 0), 0) > maxChars && last.length > 1) {
          last.shift();
        }
        return last.map(m => ({ role: m.role, content: (m.content || '').length > maxPerMsg ? (m.content || '').slice(-maxPerMsg) : (m.content || '') }));
      };

      // Server will add a concise system prompt — send only trimmed history
      const trimmedHistory = buildTrimmedChat(currentMessages);
      const chatMessages = [...trimmedHistory];

      const res = await fetch(`${backendUrl}/api/gemini/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ messages: chatMessages })
      });

      // Safely inspect response content-type
      const contentType = res.headers.get('content-type') || '';

      if (!res.ok) {
        if (contentType.includes('application/json')) {
          const errBody = await res.json().catch(() => null);
          const serverMsg = errBody?.detail ?? errBody?.message ?? errBody?.error ?? JSON.stringify(errBody);
          throw new Error(`Server ${res.status}: ${serverMsg}`);
        } else {
          const errText = await res.text().catch(() => null);
          throw new Error(`Server ${res.status}: ${errText}`);
        }
      }

      // Parse response body robustly and accept multiple possible keys
      let data = null;
      let aiText = 'Sorry, I could not get a response from the AI.';

      if (contentType.includes('application/json')) {
        data = await res.json().catch(() => null);
        aiText = data?.reply ?? data?.message ?? data?.response ?? (typeof data === 'string' ? data : JSON.stringify(data)) ?? aiText;
      } else {
        const text = await res.text().catch(() => null);
        aiText = text || aiText;
      }

      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'ai',
        text: aiText,
        timestamp: 'Now'
      }]);
    } catch (err) {
      // Log full error for debugging but avoid exposing provider JSON to users
      console.error('AI backend error (full):', err);

      let friendly = 'Sorry, something went wrong while contacting the AI.';
      const raw = err?.message ? String(err.message) : '';

      // Map known provider/server errors to concise user-friendly messages
      if (raw.match(/quota|exceed|insufficient_quota|429/i)) {
        friendly = 'AI temporarily unavailable — please try again later.';
      } else if (raw.match(/server\s?\d{3}|500|502|503|504/i)) {
        friendly = 'AI service currently unavailable. Please try again later.';
      } else if (raw) {
        // Keep the message short (avoid dumping large JSON)
        const short = raw.length > 180 ? raw.slice(0, 180) + '...' : raw;
        friendly = `Sorry — ${short}`;
      }

      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'ai',
        text: friendly,
        timestamp: 'Now'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-[490px] bg-white text-gray-900 font-sans p-0 flex justify-center items-center">
      
      {/* Main Container */}
      <div className="w-full max-w-4xl h-[85vh] bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* --- LEFT COL: CHAT INTERFACE (70%) --- */}
        <div className="w-full md:w-[calc(100%-320px)] flex flex-col relative bg-gray-50/50">
          
          {/* Header */}
          <div className="px-6 py-4 bg-white border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-md shadow-indigo-200">
                  <Sparkles size={20} />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 leading-none">Mentor AI</h2>
                <span className="text-xs text-gray-500 font-medium">Personalized Career Coach</span>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {messages.map((msg) => <ChatMessage key={msg.id} msg={msg} />)}
            
            {isTyping && (
              <div className="flex gap-4 mb-6 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  <Sparkles size={20} />
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-2xl rounded-tl-none text-xs text-gray-400 font-medium">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-gray-100">
            {/* Quick Prompts */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
              {QUICK_PROMPTS.map((prompt, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-all whitespace-nowrap"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your performance, strategy, or next steps..."
                className="w-full pl-5 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600 transition-all shadow-inner"
              />
              <button 
                onClick={() => handleSend()}
                className={`absolute right-2 p-2.5 rounded-xl transition-all ${input.trim() ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-400'}`}
                disabled={!input.trim()}
              >
                <Send size={18} />
              </button>
            </div>
            <div className="text-center mt-3 text-[10px] text-gray-400">
              Mentor advice is based on your platform activity and AI analysis.
            </div>
          </div>
        </div>

        {/* --- RIGHT COL: INSIGHTS PANEL (30%) --- */}
        <div className="w-full md:w-[320px] bg-white border-l border-gray-100 flex flex-col overflow-y-auto">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <BarChart3 size={16} className="text-indigo-600" /> Live Context
            </h3>
            
            <div className="space-y-4">
              {/* Readiness Score */}
              <div className="bg-indigo-600 text-white p-5 rounded-2xl shadow-lg shadow-indigo-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-indigo-200 text-xs font-bold uppercase">Readiness</span>
                  <TrendingUp size={16} className="text-white" />
                </div>
                <div className="text-4xl font-black mb-1">{userContext.readiness_score}%</div>
                <div className="w-full bg-indigo-900/30 h-1.5 rounded-full overflow-hidden" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Number(userContext.readiness_score) || 0}>
                  <div className="h-full bg-white" style={{ width: progressWidth }}></div>
                </div>
                
              </div>

              <InsightCard 
                label="Weakest Link" 
                value="HR Round" 
                subtext="Score: 55% (Needs Focus)" 
                icon={AlertCircle} 
                color="text-red-500" 
              />
              
              <InsightCard 
                label="Superpower" 
                value="Coding" 
                subtext="Score: 92% (Top 10%)" 
                icon={Zap} 
                color="text-yellow-500" 
              />
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Brain size={16} className="text-indigo-600" /> Recommended
            </h3>
            
            <div className="space-y-3">
              <div className="p-4 border border-indigo-100 bg-indigo-50 rounded-xl hover:shadow-md transition-all cursor-pointer group">
                <div className="text-xs font-bold text-indigo-600 uppercase mb-1">Next Best Action</div>
                <div className="font-bold text-gray-900 mb-2">Behavioral Drills</div>
                <div className="flex items-center gap-1 text-xs text-gray-600 group-hover:text-indigo-700 transition-colors">
                  Start Session <ChevronRight size={14} />
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-xl hover:border-indigo-300 transition-all cursor-pointer group">
                <div className="text-xs font-bold text-gray-400 uppercase mb-1">Review</div>
                <div className="font-bold text-gray-900 mb-2">Transcript Analysis</div>
                <div className="flex items-center gap-1 text-xs text-gray-600 group-hover:text-indigo-700 transition-colors">
                  View Report <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto p-6 border-t border-gray-100">
            <button className="flex items-center justify-center gap-2 w-full py-3 text-xs font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
              <RotateCcw size={14} /> Reset Context
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MentorModule;