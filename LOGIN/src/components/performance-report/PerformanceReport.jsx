import React, { useState, useEffect } from 'react';
import { 
  Download, Share2, CheckCircle2, AlertCircle, 
  Brain, Code2, MessageSquare, TrendingUp, 
  Clock, Award, FileText, Loader2, X, Target, Zap
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Tooltip 
} from 'recharts';

// --- MOCK DATA ---
const RADAR_DATA = [
  { subject: 'Aptitude', A: 80, fullMark: 100 },
  { subject: 'Technical', A: 95, fullMark: 100 },
  { subject: 'Communication', A: 65, fullMark: 100 },
  { subject: 'Confidence', A: 70, fullMark: 100 },
  { subject: 'Group Discussion', A: 60, fullMark: 100 },
];

const ROUNDS_DATA = [
  { 
    name: "Resume Screening", 
    score: 92, 
    status: "Passed", 
    strength: "Project Diversity", 
    weakness: "None",
    details: "Your resume parsed perfectly. The AI highlighted your 3+ years of React experience and your contribution to open-source projects as top-tier signals."
  },
  { 
    name: "Aptitude Test", 
    score: 88, 
    status: "Passed", 
    strength: "Logical Reasoning", 
    weakness: "Speed",
    details: "You scored in the 90th percentile for logic. However, you spent 40% of your time on the last 3 questions. Practice time-boxing easier questions."
  },
  { 
    name: "Technical Interview", 
    score: 95, 
    status: "Passed", 
    strength: "System Design", 
    weakness: "None",
    details: "Excellent architectural choices. You correctly identified the need for Redis caching and horizontal scaling. The interviewer noted your deep understanding of Event Loops."
  },
  { 
    name: "HR Interview", 
    score: 62, 
    status: "Flagged", 
    strength: "Honesty", 
    weakness: "Salary Negotiation",
    details: "While you were honest, your responses were rigid. You missed opportunities to tie your value to company goals during the compensation discussion."
  },
];

const PerformanceReport = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [selectedRound, setSelectedRound] = useState(null); // State for the Modal
  const [readinessScore, setReadinessScore] = useState(() => {
    try {
      const raw = localStorage.getItem('readinessScore');
      return raw !== null ? Number(raw) : 78;
    } catch (e) { return 78; }
  });

  const [aptitudeScore, setAptitudeScore] = useState(() => {
    try {
      // Prefer explicit `aptitudeScore` from localStorage first
      const raw = localStorage.getItem('aptitudeScore');
      if (raw !== null) {
        const n = Number(String(raw).trim().replace('%', ''));
        if (!Number.isNaN(n)) return n;
      }
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        const u = JSON.parse(userRaw);
        if (u && typeof u.aptitudeScore !== 'undefined' && u.aptitudeScore !== null) {
          const m = Number(u.aptitudeScore);
          if (!Number.isNaN(m)) return m;
        }
      }
    } catch (e) {}
    return 88;
  });

  // keep a separate state for QuizCompanySim so it always takes precedence for aptitude displays
  const [quizCompanySim, setQuizCompanySim] = useState(() => {
    try {
      const raw = localStorage.getItem('QuizCompanySim') ?? localStorage.getItem('quizCompanySim') ?? localStorage.getItem('quizcompanysim');
      if (raw !== null && typeof raw !== 'undefined') {
        const cleaned = String(raw).trim().replace('%', '');
        const n = Number(cleaned);
        if (!Number.isNaN(n)) return n;
      }
    } catch (e) {}
    return null;
  });

  const [resumeCompanySim, setResumeCompanySim] = useState(() => {
    try {
      // accept either capitalization variant stored elsewhere
      const raw = localStorage.getItem('resumeCompanySIm') ?? localStorage.getItem('resumeCompanySim');
      if (raw !== null && typeof raw !== 'undefined') {
        // raw might be like '85%' or '85'
        const cleaned = String(raw).trim().replace('%', '');
        const n = Number(cleaned);
        if (!Number.isNaN(n)) return n;
      }
      // fallback to atsScore or user. Keep numeric value.
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        const u = JSON.parse(userRaw);
        if (u && typeof u.atsScore !== 'undefined' && u.atsScore !== null) {
          const m = Number(u.atsScore);
          if (!Number.isNaN(m)) return m;
        }
      }
    } catch (e) {}
    return null;
  });

  const [atsScore, setAtsScore] = useState(() => {
    try {
      const raw = localStorage.getItem('atsScore');
      if (raw !== null) {
        const n = Number(raw);
        if (!Number.isNaN(n)) return n;
      }
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        const u = JSON.parse(userRaw);
        if (u && typeof u.atsScore !== 'undefined' && u.atsScore !== null) {
          const m = Number(u.atsScore);
          if (!Number.isNaN(m)) return m;
        }
      }
    } catch (e) {}
    return 92;
  });

  // Persist atsScore to localStorage and broadcast updates so other components
  // (including Dashboard) pick up the authoritative ATS value immediately.
  useEffect(() => {
    try {
      if (typeof atsScore === 'number') {
        localStorage.setItem('atsScore', String(atsScore));
        const userRaw = localStorage.getItem('user');
        if (userRaw) {
          try {
            const u = JSON.parse(userRaw || '{}');
            u.atsScore = atsScore;
            localStorage.setItem('user', JSON.stringify(u));
          } catch (e) { /* ignore */ }
        }
        const ev = new CustomEvent('atsScoreUpdated', { detail: { atsScore, score: atsScore } });
        window.dispatchEvent(ev);
      }
    } catch (e) { /* ignore */ }
  }, [atsScore]);

  const [hrScore, setHrScore] = useState(() => {
    try {
      // Prefer explicit `hrConfidence` from localStorage first
      const raw = localStorage.getItem('hrConfidence') ?? localStorage.getItem('HRConfidence');
      if (raw !== null && typeof raw !== 'undefined') {
        const cleaned = String(raw).trim().replace('%', '');
        const n = Number(cleaned);
        if (!Number.isNaN(n)) return n;
      }
      // fallback to hrCompanySim variants for compatibility
      const rawSim = localStorage.getItem('hrCompanySim') ?? localStorage.getItem('HRCompanySIm') ?? localStorage.getItem('hrcompanysim');
      if (rawSim !== null && typeof rawSim !== 'undefined') {
        const cleaned = String(rawSim).trim().replace('%', '');
        const n = Number(cleaned);
        if (!Number.isNaN(n)) return n;
      }
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        const u = JSON.parse(userRaw);
        if (u && typeof u.hrConfidence !== 'undefined' && u.hrConfidence !== null) {
          const m = Number(u.hrConfidence);
          if (!Number.isNaN(m)) return m;
        }
      }
    } catch (e) {}
    return 62;
  });

  const [commScore, setCommScore] = useState(() => {
    try {
      const raw = localStorage.getItem('hrCommunication');
      if (raw !== null) {
        const n = Number(raw);
        if (!Number.isNaN(n)) return n;
      }
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        const u = JSON.parse(userRaw);
        if (u && typeof u.hrCommunication !== 'undefined' && u.hrCommunication !== null) {
          const m = Number(u.hrCommunication);
          if (!Number.isNaN(m)) return m;
        }
      }
    } catch (e) {}
    // If hrCommunication is not present, default to 0 per multianalysis requirement
    return 0;
  });

  const [technicalScore, setTechnicalScore] = useState(() => {
    try {
      // Prefer explicit `technicalScore` if present, otherwise fall back to `averageScore`
      const rawTech = localStorage.getItem('technicalScore');
      if (rawTech !== null) {
        const n = Number(rawTech);
        if (!Number.isNaN(n)) return n;
      }
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
    return 95;
  });

  const [gdScore, setGdScore] = useState(() => {
    try {
      const raw = localStorage.getItem('gdScore');
      if (raw !== null) {
        const n = Number(raw);
        if (!Number.isNaN(n)) return n;
      }
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        const u = JSON.parse(userRaw);
        if (u && typeof u.gdScore !== 'undefined' && u.gdScore !== null) {
          const m = Number(u.gdScore);
          if (!Number.isNaN(m)) return m;
        }
      }
    } catch (e) {}
    return 60;
  });

  // prefer gdCompanySim (string like '15%') when available
  const [gdCompanySim, setGdCompanySim] = useState(() => {
    try {
      const raw = localStorage.getItem('gdCompanySim') ?? localStorage.getItem('gdcompanysim');
      if (raw !== null && typeof raw !== 'undefined') {
        const cleaned = String(raw).trim().replace('%', '');
        const n = Number(cleaned);
        if (!Number.isNaN(n)) return n;
      }
    } catch (e) {}
    return null;
  });

  // Persist technicalScore to localStorage and broadcast updates so other components
  // (including ReadinessRadar) pick up the authoritative technical value immediately.
  React.useEffect(() => {
    try {
      if (typeof technicalScore === 'number') {
        localStorage.setItem('technicalScore', String(technicalScore));
        const userRaw = localStorage.getItem('user');
        if (userRaw) {
          try {
            const u = JSON.parse(userRaw || '{}');
            u.technicalScore = technicalScore;
            localStorage.setItem('user', JSON.stringify(u));
          } catch (e) { /* ignore */ }
        }
        const ev = new CustomEvent('technicalScoreUpdated', { detail: { technicalScore, averageScore: technicalScore, score: technicalScore } });
        window.dispatchEvent(ev);
      }
    } catch (e) { /* ignore */ }
  }, [technicalScore]);

  React.useEffect(() => {
    const handler = (e) => {
      try {
        // readiness updates
        if (e?.detail && typeof e.detail.readinessScore === 'number') {
          setReadinessScore(Number(e.detail.readinessScore));
          return;
        }
        if (e?.key === 'readinessScore' && e?.newValue !== undefined) {
          const n = Number(e.newValue);
          if (!Number.isNaN(n)) setReadinessScore(n);
        }

        // Quiz company sim updates -> kept for backward compatibility but not used as primary
        if (e?.detail && (typeof e.detail.QuizCompanySim === 'number' || typeof e.detail.QuizCompanySim === 'string' || typeof e.detail.quizCompanySim === 'number' || typeof e.detail.quizCompanySim === 'string')) {
          const v = e.detail.QuizCompanySim ?? e.detail.quizCompanySim;
          const cleaned = String(v).trim().replace('%', '');
          const n = Number(cleaned);
          if (!Number.isNaN(n)) { setQuizCompanySim(n); return; }
        }
        if ((e?.key === 'QuizCompanySim' || e?.key === 'quizCompanySim' || e?.key === 'quizcompanysim') && e?.newValue !== undefined) {
          const cleaned = String(e.newValue).trim().replace('%', '');
          const r = Number(cleaned);
          if (!Number.isNaN(r)) { setQuizCompanySim(r); return; }
        }

        // aptitudeScore updates (always apply — use aptitudeScore as authoritative source)
        if (e?.detail && typeof e.detail.aptitudeScore === 'number') {
          setAptitudeScore(Number(e.detail.aptitudeScore));
          return;
        }
        if (e?.key === 'aptitudeScore' && e?.newValue !== undefined) {
          const a = Number(e.newValue);
          if (!Number.isNaN(a)) setAptitudeScore(a);
        }

        // atsScore updates
        if (e?.detail && typeof e.detail.atsScore === 'number') {
          setAtsScore(Number(e.detail.atsScore));
          return;
        }
        if (e?.key === 'atsScore' && e?.newValue !== undefined) {
          const a = Number(e.newValue);
          if (!Number.isNaN(a)) setAtsScore(a);
        }

        // resumeCompanySim / resumeCompanySIm updates (string like '85%' or numeric)
        if (e?.detail && (
          typeof e.detail.resumeCompanySim === 'number' || typeof e.detail.resumeCompanySim === 'string' ||
          typeof e.detail.resumeCompanySIm === 'number' || typeof e.detail.resumeCompanySIm === 'string')) {
          const v = e.detail.resumeCompanySim ?? e.detail.resumeCompanySIm;
          const cleaned = String(v).trim().replace('%', '');
          const n = Number(cleaned);
          if (!Number.isNaN(n)) {
            setResumeCompanySim(n);
            return;
          }
        }
        if ((e?.key === 'resumeCompanySIm' || e?.key === 'resumeCompanySim') && e?.newValue !== undefined) {
          const cleaned = String(e.newValue).trim().replace('%', '');
          const r = Number(cleaned);
          if (!Number.isNaN(r)) setResumeCompanySim(r);
        }

        // gdScore updates (prefer this as authoritative) and gdCompanySim fallback
        if (e?.detail && (typeof e.detail.gdScore === 'number' || typeof e.detail.gdScore === 'string')) {
          const v = e.detail.gdScore;
          const cleaned = String(v).trim().replace('%', '');
          const n = Number(cleaned);
          if (!Number.isNaN(n)) { setGdScore(n); return; }
        }
        if (e?.key === 'gdScore' && e?.newValue !== undefined) {
          const cleaned = String(e.newValue).trim().replace('%', '');
          const r = Number(cleaned);
          if (!Number.isNaN(r)) { setGdScore(r); }
        }
        // gdCompanySim updates (legacy source)
        if (e?.detail && (typeof e.detail.gdCompanySim === 'number' || typeof e.detail.gdCompanySim === 'string' || typeof e.detail.gdcompanysim === 'number' || typeof e.detail.gdcompanysim === 'string')) {
          const v = e.detail.gdCompanySim ?? e.detail.gdcompanysim;
          const cleaned = String(v).trim().replace('%', '');
          const n = Number(cleaned);
          if (!Number.isNaN(n)) { setGdCompanySim(n); return; }
        }
        if ((e?.key === 'gdCompanySim' || e?.key === 'gdcompanysim') && e?.newValue !== undefined) {
          const cleaned = String(e.newValue).trim().replace('%', '');
          const r = Number(cleaned);
          if (!Number.isNaN(r)) setGdCompanySim(r);
        }

        // hrConfidence updates (support detail.confidence alias) — prefer this as authoritative
        if (e?.detail && (typeof e.detail.hrConfidence === 'number' || typeof e.detail.confidence === 'number' || typeof e.detail.hrCompanySim === 'number' || typeof e.detail.hrCompanySim === 'string')) {
          const v = typeof e.detail.hrConfidence === 'number' ? e.detail.hrConfidence : e.detail.confidence;
          if (typeof v === 'number') { setHrScore(Number(v)); return; }
          if (typeof e.detail.hrCompanySim !== 'undefined') {
            const raw = e.detail.hrCompanySim;
            const cleaned = String(raw).trim().replace('%', '');
            const n = Number(cleaned);
            if (!Number.isNaN(n)) { setHrScore(n); return; }
          }
        }
        if (e?.key === 'hrConfidence' && e?.newValue !== undefined) {
          const h = Number(String(e.newValue).trim().replace('%', ''));
          if (!Number.isNaN(h)) setHrScore(h);
        }
        if ((e?.key === 'hrCompanySim' || e?.key === 'HRCompanySIm' || e?.key === 'hrcompanysim') && e?.newValue !== undefined) {
          const cleaned = String(e.newValue).trim().replace('%', '');
          const h = Number(cleaned);
          if (!Number.isNaN(h)) setHrScore(h);
        }

        // hrCommunication updates (support detail.communication alias)
        if (e?.detail && (typeof e.detail.hrCommunication === 'number' || typeof e.detail.communication === 'number')) {
          const v = typeof e.detail.hrCommunication === 'number' ? e.detail.hrCommunication : e.detail.communication;
          setCommScore(Number(v));
          return;
        }
        if (e?.key === 'hrCommunication' && e?.newValue !== undefined) {
          const c = Number(e.newValue);
          if (!Number.isNaN(c)) setCommScore(c);
        }

        // technical averageScore updates (support detail.averageScore or detail.score)
        // technical score updates: support explicit `technicalScore`, `averageScore`, or `score`
        if (e?.detail && (typeof e.detail.technicalScore === 'number' || typeof e.detail.averageScore === 'number' || typeof e.detail.score === 'number')) {
          if (typeof e.detail.technicalScore === 'number') setTechnicalScore(Number(e.detail.technicalScore));
          else if (typeof e.detail.averageScore === 'number') setTechnicalScore(Number(e.detail.averageScore));
          else setTechnicalScore(Number(e.detail.score));
          return;
        }
        if (e?.key === 'technicalScore' && e?.newValue !== undefined) {
          const t = Number(e.newValue);
          if (!Number.isNaN(t)) setTechnicalScore(t);
        }
        if (e?.key === 'averageScore' && e?.newValue !== undefined) {
          const t = Number(e.newValue);
          if (!Number.isNaN(t)) setTechnicalScore(t);
        }
      } catch (err) {}
    };
    window.addEventListener('readinessScoreUpdated', handler);
    window.addEventListener('technicalScoreUpdated', handler);
    window.addEventListener('hrConfidenceUpdated', handler);
    window.addEventListener('hrCommunicationUpdated', handler);
    window.addEventListener('gdScoreUpdated', handler);
    window.addEventListener('gdCompanySimUpdated', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('readinessScoreUpdated', handler);
      window.removeEventListener('technicalScoreUpdated', handler);
      window.removeEventListener('hrConfidenceUpdated', handler);
      window.removeEventListener('hrCommunicationUpdated', handler);
      window.removeEventListener('gdScoreUpdated', handler);
      window.removeEventListener('gdCompanySimUpdated', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  // derive radar chart data from live scores (keep other slices as defaults)
  const radarData = React.useMemo(() => {
    try {
      return RADAR_DATA.map(d => {
        if (d.subject === 'Aptitude') return { ...d, A: (typeof aptitudeScore === 'number' ? Number(aptitudeScore) : 0) };
        if (d.subject === 'Technical') return { ...d, A: (typeof technicalScore === 'number' ? Number(technicalScore) : d.A) };
        if (d.subject === 'Communication') return { ...d, A: (typeof commScore === 'number' ? Number(commScore) : d.A) };
        if (d.subject === 'Confidence') return { ...d, A: (typeof hrScore === 'number' ? Number(hrScore) : d.A) };
        if (d.subject === 'Group Discussion') return { ...d, A: (typeof gdScore === 'number' ? Number(gdScore) : (typeof gdCompanySim === 'number' ? Number(gdCompanySim) : d.A)) };
        return d;
      });
    } catch (e) { return RADAR_DATA; }
  }, [aptitudeScore, technicalScore, hrScore, gdScore, gdCompanySim, commScore]);

  // Poll localStorage for QuizCompanySim changes (DevTools/local updates in same tab
  // don't emit storage events to the same window). This keeps aptitude display in sync.
  useEffect(() => {
    let last = null;
    try { last = localStorage.getItem('QuizCompanySim') ?? localStorage.getItem('quizCompanySim') ?? localStorage.getItem('quizcompanysim'); } catch (e) { last = null; }
    const tick = () => {
      try {
        const raw = localStorage.getItem('QuizCompanySim') ?? localStorage.getItem('quizCompanySim') ?? localStorage.getItem('quizcompanysim');
        if (raw !== last) {
          last = raw;
          if (raw !== null && typeof raw !== 'undefined') {
            const cleaned = String(raw).trim().replace('%', '');
            const n = Number(cleaned);
            if (!Number.isNaN(n)) setQuizCompanySim(n);
            else setQuizCompanySim(null);
          } else {
            setQuizCompanySim(null);
          }
        }
      } catch (e) {}
    };
    const id = setInterval(tick, 700);
    // run immediately once
    tick();
    return () => clearInterval(id);
  }, []);

  // Poll localStorage for gdCompanySim changes to keep Group Discussion in sync
  useEffect(() => {
    let last = null;
    try { last = localStorage.getItem('gdCompanySim') ?? localStorage.getItem('gdcompanysim'); } catch (e) { last = null; }
    const tick = () => {
      try {
        const raw = localStorage.getItem('gdCompanySim') ?? localStorage.getItem('gdcompanysim');
        if (raw !== last) {
          last = raw;
          if (raw !== null && typeof raw !== 'undefined') {
            const cleaned = String(raw).trim().replace('%', '');
            const n = Number(cleaned);
            if (!Number.isNaN(n)) setGdCompanySim(n);
            else setGdCompanySim(null);
          } else {
            setGdCompanySim(null);
          }
        }
      } catch (e) {}
    };
    const id = setInterval(tick, 700);
    tick();
    return () => clearInterval(id);
  }, []);

  // --- HANDLERS ---
  const handleDownloadPDF = () => window.print();

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Interview Report', url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied!');
      }
    } catch (err) { console.error(err); }
    finally { setTimeout(() => setIsSharing(false), 1000); }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans py-8 flex justify-center print:bg-white print:py-0">
      
      {/* --- MODAL OVERLAY --- */}
      {selectedRound && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm print:hidden">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                  <Target size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{selectedRound.name} Details</h3>
              </div>
              <button 
                onClick={() => setSelectedRound(null)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl font-black text-indigo-600">
                    {selectedRound.name === 'Resume Screening' ? `${atsScore}%` :
                     selectedRound.name === 'Aptitude Test' ? `${typeof quizCompanySim === 'number' ? quizCompanySim : aptitudeScore}%` :
                     selectedRound.name === 'Technical Interview' ? `${technicalScore}%` :
                     selectedRound.name === 'HR Interview' ? `${hrScore}%` :
                     selectedRound.name === 'Group Discussion' ? `${gdScore}%` :
                     `${selectedRound.score}%`}
                  </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${selectedRound.status === 'Passed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {selectedRound.status}
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                {selectedRound.details}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Strength</span>
                  <span className="text-sm font-bold text-gray-900">{selectedRound.strength}</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Weakness</span>
                  <span className="text-sm font-bold text-gray-900">{selectedRound.weakness}</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-right">
              <button 
                onClick={() => setSelectedRound(null)}
                className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 cursor-pointer transition-all active:scale-95"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN REPORT CONTAINER --- */}
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-none md:rounded-xl overflow-hidden border border-gray-200 print:shadow-none print:border-none">
        
        <header className="px-8 py-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Performance Report</h1>
            <p className="text-sm text-gray-500">Comprehensive analysis of your interview performance</p>
          </div>
          <div className="flex gap-3 print:hidden">
            <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 cursor-pointer transition-all active:scale-95">
              <Download size={16} /> Download PDF
            </button>
            <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer transition-all active:scale-95 shadow-sm">
              {isSharing ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />}
              {isSharing ? 'Sharing...' : 'Share Report'}
            </button>
          </div>
        </header>

        <div className="p-8 space-y-10">
          {/* Executive Summary Section (Same as before) */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-indigo-600 text-white p-6 rounded-xl shadow-lg shadow-indigo-200">
              <h3 className="text-indigo-100 font-medium text-sm uppercase tracking-wider">Overall Score</h3>
              <div className="text-6xl font-black mt-2">{readinessScore}<span className="text-2xl font-medium text-indigo-300">/100</span></div>
              <div className="mt-4 inline-block px-3 py-1 bg-white/20 rounded text-sm font-bold backdrop-blur-sm">Intermediate Readiness</div>
            </div>
            <div className="md:col-span-2 flex flex-col justify-center border border-gray-100 rounded-xl p-6 bg-white">
              <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Final Verdict</h3>
              <span className="w-fit text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-sm font-bold border border-indigo-100 mb-3">On Hold / Review Needed</span>
              <p className="text-gray-700 leading-relaxed text-sm">"The candidate demonstrates exceptional technical proficiency, but behavioral responses indicated high stress levels during the HR round."</p>
            </div>
          </section>

          {/* --- UPDATED ROUND BREAKDOWN --- */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-6 flex items-center gap-2">
              <Award size={18} className="text-indigo-600" /> Round Breakdown
            </h2>
            <div className="overflow-hidden border border-gray-200 rounded-xl">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3">Round Name</th>
                    <th className="px-6 py-3">Score</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Deep Dive</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ROUNDS_DATA.map((round, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-gray-900">{round.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                                  <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-600" style={{ width: `${round.name === 'Resume Screening' ? atsScore : round.name === 'Aptitude Test' ? aptitudeScore : round.name === 'Technical Interview' ? technicalScore : round.name === 'HR Interview' ? hrScore : round.name === 'Group Discussion' ? gdScore : round.score}%` }}></div>
                                  </div>
                                  <span className="font-mono font-bold text-gray-700">{round.name === 'Resume Screening' ? atsScore : round.name === 'Aptitude Test' ? aptitudeScore : round.name === 'Technical Interview' ? technicalScore : round.name === 'HR Interview' ? hrScore : round.name === 'Group Discussion' ? gdScore : round.score}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${round.status === 'Passed' ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'}`}>
                          {round.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedRound(round)}
                          className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-600 hover:text-white transition-all cursor-pointer active:scale-90 flex items-center gap-1 ml-auto"
                        >
                          <Zap size={12} /> View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Rest of the sections remain the same... */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Skill Competency Map</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Candidate" dataKey="A" stroke="#4f46e5" strokeWidth={2} fill="#4f46e5" fillOpacity={0.2} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-gray-900 text-white rounded-xl p-8 flex flex-col justify-center">
              <Brain size={32} className="text-indigo-400 mb-4" />
              <h3 className="font-bold text-lg mb-2">AI Mentor Verdict</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">"You are technically ready for Senior Engineering roles. Focus on soft skills to unlock 'Job-Ready' status."</p>
              <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-bold rounded-lg cursor-pointer transition-all active:scale-95">Upgrade Roadmap</button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PerformanceReport;