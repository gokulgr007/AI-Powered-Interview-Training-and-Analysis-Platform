import React, { useState, useEffect, useMemo } from 'react';
import { 
  Code2, Bug, Clock, Terminal, GitCommit, CheckCircle2, 
  AlertCircle, ArrowRight, Braces, Search, Layers, 
  Activity, ShieldCheck, Zap, Loader2, X, Info
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

// --- MOCK DATA ---
const TIME_DISTRIBUTION = [
  { phase: 'Understanding', time: 15, fill: '#e0e7ff' },
  { phase: 'Logic Planning', time: 25, fill: '#a5b4fc' },
  { phase: 'Coding', time: 40, fill: '#6366f1' },
  { phase: 'Debugging', time: 20, fill: '#312e81' },
];

const TREND_DATA = [
  { session: 'Sim 1', edgeCases: 40, optimization: 30 },
  { session: 'Sim 2', edgeCases: 55, optimization: 45 },
  { session: 'Sim 3', edgeCases: 70, optimization: 60 },
  { session: 'Current', edgeCases: 85, optimization: 75 },
];

const CODE_QUALITY_METRICS = [
  { label: "Readability", score: 92, comment: "Clean variable naming conventions." },
  { label: "Modularity", score: 85, comment: "Functions well separated." },
  { label: "Error Handling", score: 60, comment: "Missed null check on Input B." },
];

const APPROACH_STEPS = [
  { id: 1, label: "Problem Decomposition", status: "pass", text: "Correctly identified sub-problems." },
  { id: 2, label: "Algorithm Selection", status: "pass", text: "Chose Hash Map for O(1) lookup." },
  { id: 3, label: "Edge Case Analysis", status: "warn", text: "Missed empty array scenario initially." },
];

// --- COMPONENTS ---
const SectionHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
    {Icon && <Icon size={18} className="text-indigo-600" />}
    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">{title}</h2>
  </div>
);

const MetricCard = ({ label, value, subtext }) => (
  <div className="bg-white border border-gray-200 p-4 rounded-xl hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group active:scale-[0.98]">
    <div className="text-xs font-bold text-gray-400 group-hover:text-indigo-500 uppercase tracking-wider mb-2 transition-colors">{label}</div>
    <div className="text-2xl font-black text-gray-900 mb-1">{value}</div>
    {subtext && <div className="text-xs text-gray-500 font-mono">{subtext}</div>}
  </div>
);

const CodingIntelligence = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeStep, setActiveStep] = useState(null);
  const [displayScore, setDisplayScore] = useState(() => {
    try {
      const raw = localStorage.getItem('readinessScore');
      if (raw !== null) {
        const n = Number(raw);
        if (!Number.isNaN(n)) return n;
      }
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        const u = JSON.parse(userRaw);
        if (u && typeof u.readinessScore !== 'undefined' && u.readinessScore !== null) {
          const m = Number(u.readinessScore);
          if (!Number.isNaN(m)) return m;
        }
      }
    } catch (e) {}
    return 84;
  });
  const [showDetails, setShowDetails] = useState(false);

  const [technicalScore, setTechnicalScore] = useState(() => {
    try {
      const raw = localStorage.getItem('averageScore');
      if (raw !== null) {
        const n = Number(raw);
        if (!Number.isNaN(n)) return n;
      }
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        const u = JSON.parse(userRaw);
        if (u && typeof u.averageScore !== 'undefined' && u.averageScore !== null) {
          const m = Number(u.averageScore);
          if (!Number.isNaN(m)) return m;
        }
      }
    } catch (e) {}
    return 92;
  });

  const maintainabilityIndex = (typeof technicalScore === 'number' && !Number.isNaN(technicalScore))
    ? Math.round(technicalScore)
    : 88;

  // animate initial reveal and listen for live updates to readinessScore
  useEffect(() => {
    let mounted = true;
    const apply = (v) => {
      if (!mounted) return;
      const n = Number(v);
      if (!Number.isNaN(n)) setDisplayScore(n);
    };
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem('readinessScore');
        if (raw !== null) apply(raw);
      } catch (e) {}
    }, 500);

    const handler = (e) => {
      try {
        if (e?.detail && typeof e.detail.readinessScore === 'number') {
          apply(e.detail.readinessScore);
          return;
        }
        if (e?.key === 'readinessScore' && e?.newValue !== undefined) {
          apply(e.newValue);
        }
      } catch (err) {}
    };
    window.addEventListener('readinessScoreUpdated', handler);
    window.addEventListener('storage', handler);
    return () => {
      mounted = false;
      clearTimeout(timer);
      window.removeEventListener('readinessScoreUpdated', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  // listen for technical/averageScore updates so the Logical Accuracy metric reflects live data
  useEffect(() => {
    const h = (e) => {
      try {
        if (e?.detail && typeof e.detail.averageScore === 'number') {
          setTechnicalScore(Number(e.detail.averageScore));
          return;
        }
        if (e?.detail && typeof e.detail.score === 'number') {
          setTechnicalScore(Number(e.detail.score));
          return;
        }
        if (e?.key === 'averageScore' && e?.newValue !== undefined) {
          const v = Number(e.newValue);
          if (!Number.isNaN(v)) setTechnicalScore(v);
        }
      } catch (err) {}
    };
    window.addEventListener('averageScoreUpdated', h);
    window.addEventListener('storage', h);
    return () => {
      window.removeEventListener('averageScoreUpdated', h);
      window.removeEventListener('storage', h);
    };
  }, []);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans p-8 flex justify-center relative overflow-hidden">
      
      {/* --- SIDE DETAILS DRAWER --- */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-100 ${showDetails ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-gray-900">Technical Debt Audit</h3>
            <button onClick={() => setShowDetails(false)} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-6 overflow-y-auto">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <h4 className="text-emerald-700 font-bold text-sm mb-2 flex items-center gap-2">
                <ShieldCheck size={16} /> Code Health: Excellent
              </h4>
              <p className="text-xs text-emerald-600">Detailed session health assessment complete.</p>
            </div>

            <div className="space-y-4">
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Findings</h5>
              {[
                { label: "Magic Numbers", impact: "Low", detail: "Hardcoded timeout in Line 42." },
                { label: "Cyclomatic Complexity", impact: "Medium", detail: "Main loop has 4 nested conditions." },
                { label: "Variable Shadowing", impact: "Low", detail: "Variable 'data' shadowed in scope." }
              ].map((item, i) => (
                <div key={i} className="p-4 border border-gray-100 rounded-lg">
                   <div className="flex justify-between mb-1">
                     <span className="text-sm font-bold">{item.label}</span>
                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.impact === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{item.impact}</span>
                   </div>
                   <p className="text-xs text-gray-500">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity cursor-pointer" onClick={() => setShowDetails(false)} />
      )}

      <div className="w-full max-w-6xl space-y-12">
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-100 pb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Terminal size={20} className="text-indigo-600" />
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Technical Assessment Engine</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">Coding Intelligence</h1>
            <p className="text-gray-500 mt-1">Deep analysis of algorithmic efficiency and code quality.</p>
          </div>
          
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2 disabled:bg-indigo-400 cursor-pointer disabled:cursor-not-allowed"
          >
            {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Code2 size={18} />}
            {isAnalyzing ? 'Processing...' : 'Analyze New Session'}
          </button>
        </header>

        {/* --- HERO SECTION --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-900 text-white rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute inset-0 opacity-5 font-mono text-[10px] break-words pointer-events-none p-4 group-hover:opacity-10 transition-opacity">
              01010101 10101010 00110011 11001100 10101010 01010101
            </div>
            <div>
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Overall Score</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-black tracking-tighter transition-all duration-1000">
                    {displayScore}
                </span>
                <span className="text-xl text-gray-500">/100</span>
              </div>
            </div>
            <div className="mt-8 z-10">
              <div className="inline-block px-3 py-1 bg-indigo-600 rounded text-xs font-bold uppercase mb-2">Interview Ready</div>
              <p className="text-xs text-gray-400 leading-relaxed italic">"Strong logical foundation. Clean and modular."</p>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
             <MetricCard label="Logical Accuracy" value={technicalScore != null ? `${technicalScore}%` : '92%'} subtext="11/12 Test Cases Passed" />
             <MetricCard label="Time Efficiency" value="Top 15%" subtext="Solved in 18 mins" />
             <MetricCard label="Code Cleanliness" value="High" subtext="Linter Score: A-" />
             
             {/* MAINTAINABILITY CARD */}
             <div className="sm:col-span-3 bg-emerald-50 border border-emerald-100 p-6 rounded-xl flex items-center justify-between hover:border-emerald-300 transition-all cursor-pointer group shadow-sm active:scale-[0.99]" onClick={() => setShowDetails(true)}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-600 text-white rounded-lg shadow-inner group-hover:rotate-6 transition-transform"><ShieldCheck size={24} /></div>
                  <div>
                    <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Maintainability Index</div>
                    <div className="text-3xl font-black text-gray-900">{maintainabilityIndex}<span className="text-lg text-gray-400">/100</span></div>
                    <div className="text-xs text-gray-500 mt-1">Status: <span className="font-bold text-emerald-600">Low Technical Debt</span></div>
                  </div>
                </div>
                <div className="flex items-center gap-2 font-bold text-emerald-700 text-sm group-hover:translate-x-1 transition-transform">
                    View Details <ArrowRight size={16} />
                </div>
             </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <SectionHeader title="Problem Solving Logic" icon={Layers} />
              <div className="space-y-4">
                {APPROACH_STEPS.map((step) => (
                  <div 
                    key={step.id} 
                    onClick={() => setActiveStep(step.id)}
                    className={`flex gap-4 cursor-pointer p-3 rounded-xl transition-all active:scale-[0.99] ${activeStep === step.id ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-gray-50 border border-transparent'}`}
                  >
                     <div className="flex flex-col items-center">
                       <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${step.status === 'pass' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-amber-500 bg-amber-50 text-amber-600'}`}>
                         {step.status === 'pass' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                       </div>
                       {step.id !== 3 && <div className="w-0.5 h-full bg-gray-100 my-1"></div>}
                     </div>
                     <div>
                       <h4 className="text-sm font-bold text-gray-900">{step.label}</h4>
                       <p className={`text-sm transition-all ${activeStep === step.id ? 'text-gray-900' : 'text-gray-500'}`}>{step.text}</p>
                     </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
               <SectionHeader title="Skill Evolution" icon={Activity} />
               <div className="h-64 w-full cursor-crosshair">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={TREND_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="session" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip cursor={{stroke: '#6366f1', strokeWidth: 2}} contentStyle={{backgroundColor: '#1f2937', color: '#fff', borderRadius: '8px', border: 'none'}} />
                    <Line type="monotone" dataKey="edgeCases" stroke="#4f46e5" strokeWidth={3} dot={{r:6, fill:'#4f46e5'}} activeDot={{r:8}} />
                    <Line type="monotone" dataKey="optimization" stroke="#9ca3af" strokeWidth={2} dot={{r:4}} />
                  </LineChart>
                </ResponsiveContainer>
               </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <SectionHeader title="Code Quality Audit" icon={Braces} />
              <div className="space-y-6">
                {CODE_QUALITY_METRICS.map((metric, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                        {metric.label} <Info size={12} className="text-gray-300" />
                      </span>
                      <span className="font-mono font-bold text-indigo-600">{metric.score}/100</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${metric.score}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-indigo-600 text-white rounded-2xl p-6 shadow-lg shadow-indigo-200 group transition-all active:scale-[0.98]">
               <h3 className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2">Readiness Impact</h3>
               <p className="text-sm leading-relaxed mb-4">
                 Clean code practices boost your <span className="font-bold text-white">Technical Selection Probability</span> by 18%.
               </p>
               <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer">
                 View Global Readiness <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </section>
          </div>
        </div>

        <footer className="border-t border-gray-100 pt-8 text-center text-xs text-gray-400">
          <p>© 2026 Technical Assessment Engine • All systems operational</p>
        </footer>
      </div>
    </div>
  );
};

export default CodingIntelligence;