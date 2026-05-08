import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResumeAnalyzer from '../Resume-Analyzer/ResumeAnalyzer';
import { 
  Building2, 
  Code2, 
  Users, 
  Clock, 
  Settings, 
  ChevronRight, 
  Play, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  ShieldCheck,
  StopCircle,
  BarChart3,
  Loader2
} from 'lucide-react';
import GD from '../gd--final/App';
import AptitudeModule from '../Quiz/Quiz';
import HRInterviewModuleInner from '../hr_interview/HRI';

// --- MOCK CONFIGURATION DATA ---
const ROUNDS = [
  { id: 1, name: "Resume Screening", type: "AI Analysis", duration: "Instant" },
  { id: 2, name: "Aptitude Round", type: "Timed Assessment", duration: "15 min" },
  { id: 3, name: "Group Discussion", type: "Group Activity", duration: "30 min" },
  { id: 4, name: "HR Interview", type: "Behavioral", duration: "20 min" },
];

// --- COMPONENTS ---

// 1. MAIN SIMULATION CONTAINER
const CompanySimulation = ({ navigate: navProp }) => {
  const navigate = useNavigate();
  // States: 'briefing', 'active', 'cooldown', 'result'
  const [step, setStep] = useState('briefing');
  const [activeRound, setActiveRound] = useState(0); // 0-based index: start at Resume Screening (index 0)
  const [timer, setTimer] = useState(45 * 60); // 45 mins
  const [completedRounds, setCompletedRounds] = useState(new Set());
  const [resumeDone, setResumeDone] = useState(false);

  const mark = (i) => setCompletedRounds(prev => {
    const s = new Set(prev);
    s.add(i);
    return s;
  });

  // --- TIMER LOGIC ---
  useEffect(() => {
    let interval;
    if (step === 'active') {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0; // Stop at 0
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step]);

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  // -------------------

  // Ensure we exit full-screen state when this component unmounts
  useEffect(() => {
    const onAts = () => { mark(0); setResumeDone(true); };
    const onHr = (e) => {
      try {
        let score = undefined;
        try { score = e?.detail?.score; } catch (err) { score = undefined; }
        if (typeof score === 'undefined' || score === null) {
          try { score = localStorage.getItem('hrScore'); } catch (err) { score = undefined; }
        }
        if (typeof score === 'undefined' || score === null) {
          try { const raw = localStorage.getItem('user'); if (raw) { const u = JSON.parse(raw||'{}'); if (typeof u.hrScore !== 'undefined') score = u.hrScore; } } catch (err) { /* ignore */ }
        }
        if (typeof score === 'undefined' || score === null) {
          try { score = localStorage.getItem('hrConfidence'); } catch (err) { score = undefined; }
        }
        if (typeof score === 'undefined' || score === null) {
          try { score = localStorage.getItem('hrCommunication'); } catch (err) { score = undefined; }
        }

        const active = (() => { try { return localStorage.getItem('QuizCompanySimActive'); } catch (err) { return null; } })();
        if (active && typeof score !== 'undefined' && score !== null) {
          try {
            let n = Number(score);
            if (!Number.isNaN(n)) {
              if (n > 0 && n <= 1) n = n * 100;
              n = Math.max(0, Math.min(100, n));
              const pct = Math.round(n) + '%';
              try { localStorage.setItem('HRCompanySIm', pct); } catch (err) {}
            }
          } catch (err) {}
        }
      } catch (err) {}
      mark(3);
    };
    const onResume = (e) => {
      try {
        let score = undefined;
        try { score = e?.detail?.score; } catch (err) { score = undefined; }
        if (typeof score === 'undefined' || score === null) {
          try { score = localStorage.getItem('atsScore'); } catch (err) { score = undefined; }
        }
        if (typeof score === 'undefined' || score === null) {
          try { const raw = localStorage.getItem('user'); if (raw) { const u = JSON.parse(raw||'{}'); if (typeof u.atsScore !== 'undefined' && u.atsScore !== null) score = u.atsScore; } } catch (err) { /* ignore */ }
        }

        const active = (() => { try { return localStorage.getItem('QuizCompanySimActive'); } catch (err) { return null; } })();
        if (active && typeof score !== 'undefined' && score !== null) {
          try {
            let n = Number(score);
            if (!Number.isNaN(n)) {
              if (n > 0 && n <= 1) n = n * 100;
              n = Math.max(0, Math.min(100, n));
              const pct = Math.round(n) + '%';
              try { localStorage.setItem('resumeCompanySIm', pct); } catch (err) {}
            }
          } catch (err) {}
        }
      } catch (err) {}
      mark(0);
      setResumeDone(true);
    };
    const onMock = (e) => {
      try {
        const step = e?.detail?.step;
        if (step === 'resume') { mark(0); setResumeDone(true); }
        if (step === 'two-sum' || step === 'technical' || step === 'gd' || step === 'hr') {
          // two-sum/technical/gd -> technical round index 2
          // hr -> HR round index 3
          if (step === 'hr') mark(3); else mark(2);

          // Persist GD score when available
          try {
            if (step === 'gd') {
              const score = e?.detail?.score;
              const active = (() => { try { return localStorage.getItem('QuizCompanySimActive'); } catch (err) { return null; } })();
              if (active && typeof score !== 'undefined' && score !== null) {
                let n = Number(score);
                if (!Number.isNaN(n)) {
                  if (n > 0 && n <= 1) n = n * 100;
                  n = Math.max(0, Math.min(100, n));
                  const pct = Math.round(n) + '%';
                  try { localStorage.setItem('gdCompanySim', pct); } catch (err) {}
                }
              }
            }
          } catch (err) {}

          // Persist HR score when available
          try {
            if (step === 'hr') {
              let score = e?.detail?.score;
              if (typeof score === 'undefined' || score === null) {
                try { score = localStorage.getItem('hrScore'); } catch (err) { score = undefined; }
              }
              if (typeof score === 'undefined' || score === null) {
                try { score = localStorage.getItem('hrConfidence'); } catch (err) { score = undefined; }
              }
              if (typeof score === 'undefined' || score === null) {
                try { score = localStorage.getItem('hrCommunication'); } catch (err) { score = undefined; }
              }

              const active = (() => { try { return localStorage.getItem('QuizCompanySimActive'); } catch (err) { return null; } })();
              if (active && typeof score !== 'undefined' && score !== null) {
                let n = Number(score);
                if (!Number.isNaN(n)) {
                  if (n > 0 && n <= 1) n = n * 100;
                  n = Math.max(0, Math.min(100, n));
                  const pct = Math.round(n) + '%';
                  try { localStorage.setItem('HRCompanySIm', pct); } catch (err) {}
                }
              }
            }
          } catch (err) {}
        }
      } catch (e) {}
    };
    
    // When a mock resume step completes, ensure any cached per-user atsScore
    // is mirrored to the top-level key and events are emitted so the
    // dashboard updates in the same window (storage event doesn't fire locally).
    const onMockResumeSync = (e) => {
      try {
        const step = e?.detail?.step;
        if (step !== 'resume') return;
        // prefer existing top-level atsScore
        const cached = localStorage.getItem('atsScore');
        if (cached !== null && cached !== 'null') {
          try { window.dispatchEvent(new CustomEvent('atsScoreUpdated', { detail: { atsScore: Number(cached), score: Number(cached) } })); } catch (err) {}
          return;
        }
        // otherwise, if a cached user object has atsScore, mirror it
        try {
          const rawUser = localStorage.getItem('user');
          if (rawUser) {
            const u = JSON.parse(rawUser || '{}');
            if (typeof u.atsScore !== 'undefined' && u.atsScore !== null) {
              const v = Number(u.atsScore);
              if (!Number.isNaN(v)) {
                try { localStorage.setItem('atsScore', String(v)); } catch (err) {}
                try { window.dispatchEvent(new CustomEvent('atsScoreUpdated', { detail: { atsScore: v, score: v } })); } catch (err) {}
                try { window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: { atsScore: v } })); } catch (err) {}
              }
            }
          }
        } catch (err) {}
      } catch (err) {}
    };
    const onApt = (e) => {
      try {
        // Prefer event-provided score, fall back to common localStorage keys
        let score = undefined;
        try { score = e?.detail?.score; } catch (err) { score = undefined; }
        if (typeof score === 'undefined' || score === null) {
          try { score = localStorage.getItem('aptitudeScore'); } catch (err) { score = undefined; }
        }
        if (typeof score === 'undefined' || score === null) {
          try { score = localStorage.getItem('aptituudeCS'); } catch (err) { score = undefined; }
        }

        const active = (() => { try { return localStorage.getItem('QuizCompanySimActive'); } catch (err) { return null; } })();
        if (active && typeof score !== 'undefined' && score !== null) {
          try {
            let n = Number(score);
            if (!Number.isNaN(n)) {
              // If incoming score looks like 0-1 float, convert to percent
              if (n > 0 && n <= 1) n = n * 100;
              // If score already looks like 0-100, clamp
              n = Math.max(0, Math.min(100, n));
              const pct = Math.round(n) + '%';
              localStorage.setItem('QuizCompanySim', pct);
            }
          } catch (err) {}
        }
      } catch (err) {}
      mark(1);
    };
    const onGd = (e) => {
      try {
        let score = undefined;
        try { score = e?.detail?.score; } catch (err) { score = undefined; }
        if (typeof score === 'undefined' || score === null) {
          try { score = localStorage.getItem('gdScore'); } catch (err) { score = undefined; }
        }

        const active = (() => { try { return localStorage.getItem('QuizCompanySimActive'); } catch (err) { return null; } })();
        if (active && typeof score !== 'undefined' && score !== null) {
              try {
            let n = Number(score);
            if (!Number.isNaN(n)) {
              if (n > 0 && n <= 1) n = n * 100;
              n = Math.max(0, Math.min(100, n));
              const pct = Math.round(n) + '%';
              localStorage.setItem('gdCompanySim', pct);
            }
          } catch (err) {}
        }
      } catch (err) {}
      // mark GD as completed
      try { mark(2); } catch (err) {}
    };
    const onTech = () => mark(2);

    window.addEventListener('atsScoreUpdated', onAts);
    window.addEventListener('mockStepComplete', onMock);
    window.addEventListener('resumeAnalyzed', onResume);
    window.addEventListener('aptitudeComplete', onApt);
    window.addEventListener('technicalComplete', onTech);
    window.addEventListener('hrComplete', onHr);

    return () => {
      try { window.dispatchEvent(new CustomEvent('exitFullScreen')); } catch (e) {}
      try { localStorage.removeItem('QuizCompanySimActive'); } catch (e) {}
      window.removeEventListener('atsScoreUpdated', onAts);
      window.removeEventListener('mockStepComplete', onMock);
      window.removeEventListener('resumeAnalyzed', onResume);
      window.removeEventListener('aptitudeComplete', onApt);
      window.removeEventListener('technicalComplete', onTech);
      window.removeEventListener('hrComplete', onHr);
    };
  }, []);

  // Persist ATS score to backend when resume analyzer completes while in simulation
  useEffect(() => {
    const persistAts = async () => {
      try {
        const raw = localStorage.getItem('atsScore');
        if (!raw) return;
        const v = Number(raw);
        if (Number.isNaN(v)) return;
        const token = localStorage.getItem('token');
        const apiBase = (process.env.REACT_APP_API_BASE || 'http://localhost:5000');

        if (token) {
          // Authenticated user: update their profile scores
          await fetch(apiBase + '/api/user/scores', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ atsScore: v })
          });
        } else {
          // Guest/mock flow: persist to quick scores so it's saved server-side
          try {
            await fetch(apiBase + '/api/score/quick', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: null, module: 'resume-simulation', score: v })
            });
          } catch (e) {}
        }
      } catch (e) {}
    };

    const onAtsPersist = () => { persistAts(); };
    const onResumePersist = () => { persistAts(); };

    window.addEventListener('atsScoreUpdated', onAtsPersist);
    window.addEventListener('resumeAnalyzed', onResumePersist);

    return () => {
      window.removeEventListener('atsScoreUpdated', onAtsPersist);
      window.removeEventListener('resumeAnalyzed', onResumePersist);
    };
  }, []);

  // showResume controls whether ResumeAnalyzer is embedded in the center pane.
  const [showResume, setShowResume] = useState(window.location.pathname === '/resume-analyzer');

  useEffect(() => {
    const onPop = () => {
      setShowResume(window.location.pathname === '/resume-analyzer');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Helper to render stage content without nested ternaries
  const StageContent = () => {
    if (activeRound === 1) return <div className="w-full h-full"><AptitudeModule /></div>;
    if (activeRound === 2) return <div className="w-full h-full"><GD mockMode={true} /></div>;
    if (activeRound === 3) return <div className="w-full h-full"><HRInterviewModuleInner embedded={true} /></div>;
    if (showResume) return (
      <div className="w-full h-full p-6">
        <div className="h-full pb-24">
          <ResumeAnalyzer mockMode={true} onAnalyzed={() => { mark(0); setResumeDone(true); }} />
          <div className="h-16" aria-hidden />
        </div>
      </div>
    );
    return (
      <>
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-indigo-500/50">
            <Users className="text-gray-500" size={40} />
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-1 h-4 bg-indigo-500 animate-pulse"></span>
            <span className="w-1 h-8 bg-indigo-500 animate-pulse" style={{animationDelay: '0.1s'}}></span>
            <span className="w-1 h-6 bg-indigo-500 animate-pulse" style={{animationDelay: '0.2s'}}></span>
            <span className="w-1 h-4 bg-indigo-500 animate-pulse" style={{animationDelay: '0.3s'}}></span>
          </div>
          <p className="text-gray-400 text-sm mt-4 font-medium">Sarah is speaking...</p>
        </div>

        <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl text-white">
          <h3 className="text-xs font-bold text-indigo-300 uppercase mb-2">Current Question</h3>
          <p className="text-lg font-medium">"Design a rate limiter for a distributed API. How would you handle race conditions in a Redis cluster environment?"</p>
        </div>
      </>
    );
  };

  // --- VIEW: BRIEFING ---
  if (step === 'briefing') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="bg-gray-900 p-8 text-white">
            <div className="flex items-center gap-2 mb-2 text-indigo-400">
              <ShieldCheck size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">Confidential Interview Environment</span>
            </div>
            <h1 className="text-3xl font-black">Pre-Interview Briefing</h1>
            <p className="text-gray-400 mt-2">Please review the parameters before proceeding.</p>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="p-4 bg-indigo-50 border-l-4 border-indigo-600 rounded-r text-sm text-gray-700 leading-relaxed">
              <strong className="block text-indigo-900 mb-1">Objective:</strong>
              This simulation assesses your problem-solving ability, code efficiency, and communication clarity under time constraints. The AI evaluator will mimic a Senior Engineering Manager.
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div>
                 <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Interview Structure</h4>
                 <ul className="space-y-3 text-sm font-medium text-gray-800">
                   {ROUNDS.map((r, i) => (
                     <li key={i} className="flex items-center gap-3">
                       <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs border border-gray-200">{r.id}</span>
                       {r.name} <span className="text-gray-400 font-normal ml-auto">{r.duration}</span>
                     </li>
                   ))}
                 </ul>
               </div>
               <div>
                 <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Evaluation Criteria</h4>
                 <ul className="space-y-2 text-sm text-gray-600">
                   <li className="flex gap-2"><CheckCircle2 size={16} className="text-indigo-600"/> Logical Consistency</li>
                   <li className="flex gap-2"><CheckCircle2 size={16} className="text-indigo-600"/> Optimal Data Structures</li>
                   <li className="flex gap-2"><CheckCircle2 size={16} className="text-indigo-600"/> Communication Clarity</li>
                   <li className="flex gap-2"><CheckCircle2 size={16} className="text-indigo-600"/> Edge Case Handling</li>
                 </ul>
               </div>
            </div>
            
            <button 
              onClick={() => {
                setActiveRound(0);
                setStep('active');
                setShowResume(true);
                try { localStorage.setItem('QuizCompanySimActive', '1'); } catch (e) {}
                try { window.dispatchEvent(new CustomEvent('enterFullScreen')); } catch (e) {}
              }}
              className="w-full py-4 mt-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
            >
              <Play size={18} /> Enter Virtual Lobby
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: ACTIVE SIMULATION ---
  if (step === 'active') {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-100 animate-pulse">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              <span className="text-xs font-bold uppercase">Live Recording</span>
            </div>
            <div className="h-6 w-px bg-gray-200"></div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">{
                ROUNDS[activeRound] ? `Round ${ROUNDS[activeRound].id}: ${ROUNDS[activeRound].name}` : 'Round'
              }</h2>
              <p className="text-xs text-gray-500">Interviewer: Sarah (AI) • Sr. Eng Manager</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className={`font-mono text-xl font-bold tabular-nums ${timer <= 300 ? 'text-red-600 animate-pulse' : 'text-indigo-600'}`}>
               {formatTime(timer)}
             </div>
             {/* Button switches to 'Next Round' until the last round is reached */}
              {activeRound < ROUNDS.length - 1 ? (
               (() => {
                 const canProceed = completedRounds.has(activeRound) && (activeRound !== 0 || resumeDone);
                 return (
                   <button
                     disabled={!canProceed}
                     onClick={() => canProceed && setActiveRound(prev => Math.min(prev + 1, ROUNDS.length - 1))}
                     className={`px-4 py-2 border text-xs font-bold rounded-lg ${canProceed ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'}`}
                   >
                     Next Round
                   </button>
                 );
               })()
             ) : (
               (() => {
                 const canEnd = completedRounds.has(activeRound);
                 return (
                  <button
                    disabled={!canEnd}
                     onClick={() => {
                          if (!canEnd) return;
                          setStep('result');
                          try { localStorage.removeItem('QuizCompanySimActive'); } catch (e) {}
                          try { window.dispatchEvent(new CustomEvent('exitFullScreen')); } catch (e) {}
                          // increment persisted completed modules count and broadcast update
                          try {
                            const cur = Number(localStorage.getItem('completedModules') || 0);
                            const next = (Number.isFinite(cur) ? cur : 0) + 1;
                            localStorage.setItem('completedModules', String(next));
                            try { window.dispatchEvent(new CustomEvent('companySimulationEnded', { detail: { completedModules: next } })); } catch (e) {}
                          } catch (e) {}
                        }}
                    className={`px-4 py-2 border border-gray-300 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 ${!canEnd ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    End Simulation
                  </button>
                 );
               })()
             )}
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left: Workflow Timeline */}
          <div className="w-64 bg-white border-r border-gray-200 p-6 hidden md:block">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Round Progress</h3>
            <div className="space-y-6 relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100 z-0"></div>
              {ROUNDS.map((r, i) => {
                const isActive = i === activeRound;
                const isPast = i < activeRound;
                return (
                  <div key={i} className="relative z-10 flex gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 text-xs font-bold ${isActive ? 'bg-indigo-600 border-indigo-600 text-white' : isPast ? 'bg-green-100 border-green-600 text-green-700' : 'bg-white border-gray-300 text-gray-400'}`}>
                      {isPast ? <CheckCircle2 size={14}/> : i + 1}
                    </div>
                    <div className={isActive ? 'opacity-100' : 'opacity-50'}>
                      <div className="text-sm font-bold text-gray-900">{r.name}</div>
                      <div className="text-xs text-gray-500">{r.type}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Center: Interaction Area */}
          <div className="flex-1 p-6 flex gap-6">
            
            {/* Main Stage (Mock Video/Canvas) */}
            <div className="flex-1 flex flex-col gap-4 items-center">
              <div className={`w-full ${showResume ? 'max-w-[950px]' : 'max-w-[1000px]'} ${activeRound === 3 ? 'h-[120vh]' : 'h-[120vh]'}`}>
                <div className="h-full rounded-xl relative overflow-hidden border border-gray-200 bg-white">
                  {StageContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: RESULT SUMMARY ---
  if (step === 'result') {
    return (
      <div className="min-h-screen bg-white text-gray-900 font-sans p-8 flex justify-center items-center">
        <div className="max-w-2xl w-full text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="inline-flex p-4 bg-indigo-50 rounded-full text-indigo-600 mb-6 shadow-sm">
            <BarChart3 size={40} />
          </div>
          
          <h1 className="text-4xl font-black tracking-tight mb-2">Simulation Complete</h1>
          <p className="text-gray-500 mb-10">Your performance data has been captured and analyzed.</p>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 mb-8">
             <div className="grid grid-cols-3 gap-8 divide-x divide-gray-200">
               <div>
                 <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Verdict</div>
                 <div className="text-xl font-black text-indigo-600">Likely Selected</div>
               </div>
               <div>
                 <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Round Score</div>
                 <div className="text-xl font-black text-gray-900">88/100</div>
               </div>
               <div>
                 <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Stress Level</div>
                 <div className="text-xl font-black text-gray-900">Moderate</div>
               </div>
             </div>
          </div>

            <div className="flex flex-col gap-4">
            <button
              onClick={async () => {
                try {
                  const payload = {
                    user: (() => { try { const raw = localStorage.getItem('user'); return raw ? JSON.parse(raw) : null; } catch (e) { return null; } })(),
                    rounds: ROUNDS,
                    completedRounds: Array.from(completedRounds),
                    activeRound,
                    timer,
                    notes: ''
                  };
                  const res = await fetch('http://127.0.0.1:8000/evaluate-report', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                  });
                  if (!res.ok) {
                    const txt = await res.text().catch(() => null);
                    alert('Failed to generate report: ' + (txt || res.statusText));
                    return;
                  }
                  const j = await res.json().catch(() => null);
                  // store evaluation and navigate to the detailed report route
                  try {
                    localStorage.setItem('detailedReport', JSON.stringify(j || {}));
                  } catch (e) { console.error('failed to save report', e); }
                  // prefer react-router navigation when available
                  try { (navProp || navigate) && (navProp || navigate)('/detailed-report'); } catch (e) { window.location.href = '/detailed-report'; }
                } catch (err) {
                  console.error(err);
                  alert('Error generating report — see console.');
                }
              }}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <FileText size={20} /> Generate Detailed Report
            </button>
            <button 
              onClick={() => { window.location.assign('/company-sim'); }}
              className="w-full py-4 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Return to Lobby
            </button>
          </div>

          <p className="mt-8 text-xs text-gray-400">
            Performance data is automatically synced with Interview Intelligence Module.
          </p>

        </div>
      </div>
    );
  }

  return null;
};

export default CompanySimulation;