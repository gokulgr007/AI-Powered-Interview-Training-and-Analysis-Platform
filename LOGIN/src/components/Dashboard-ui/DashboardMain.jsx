import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { 
  LayoutDashboard, Bell, User, Settings, LogOut, 
  Play, FileText, Users, Code2, Mic, 
  ChevronRight, Brain, Zap, Target, Clock, 
  Award, TrendingUp, AlertCircle, Search, 
  Briefcase, ArrowUpRight, BarChart3, CheckCircle2, X, Mail, Check
} from 'lucide-react';
import { 
  RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis,
  AreaChart, Area, Tooltip
} from 'recharts';

// --- MOCK DATA ---


const USER_SUMMARY = {
  name: "Alex Mercer",
  readiness: 78,
  readinessLabel: "Interview Ready",
  completed_modules: 0,
  total_modules: 20,
  strongest: "Technical Coding",
  focus: "HR Confidence"
};

// will be replaced by live data from server
let initialAptitudeScore = 0;

const INSIGHTS = [
  { id: 1, type: "urgent", text: "Your HR Confidence dropped to 55% in the last simulation. Recommended: Practice Conflict Scenarios.", link: "Start HR Sim" },
  { id: 2, type: "info", text: "Resume Analysis complete. You are missing 2 key keywords for 'Senior Engineer'.", link: "View Report" }
];

const PRACTICE_MODULES = [
  { id: 'apt', title: "Aptitude Test", progress: 85, level: "Advanced", last: "2 days ago", icon: Brain },
  { id: 'tech', title: "Technical Coding", progress: 92, level: "Expert", last: "Yesterday", icon: Code2 },
  { id: 'hr', title: "HR Interview", progress: 0, level: "Intermediate", last: "4 hours ago", icon: Mic },
  { id: 'gd', title: "Group Discussion", progress: 40, level: "Beginner", last: "1 week ago", icon: Users },
  { id: 'res', title: "Resume Analyzer", progress: 0, level: "Not started", last: "Just now", icon: FileText },
];

const INTELLIGENCE_SCORES = [
  { label: "Interview Intel", score: 78, trend: "+5%", icon: BarChart3 },
  { label: "Comm. Clarity", score: 62, trend: "-2%", icon: Mic },
  { label: "Code Efficiency", score: 94, trend: "+1%", icon: Code2 },
];

const RECENT_ACTIVITY = [
  { id: 1, title: "Completed Mock HR Round", time: "2h ago", score: "65/100" },
  { id: 2, title: "Solved System Design Prob", time: "1d ago", score: "92/100" },
  { id: 3, title: "Resume Scan", time: "2d ago", score: "Score: 68" },
];

// removed top-level CompanySimHandle (use `navigate` from within components)

// --- COMPONENTS ---

const DashboardHeader = () => {
  const navigate = useNavigate();

  

  const [userName, setUserName] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        return u?.name || u?.fullName || u?.email || 'User';
      }
    } catch (e) {}
    return 'User';
  });

  useEffect(() => {
    const onProfileUpdated = (ev) => {
      try {
        const detail = ev?.detail;
        if (detail && (detail.name || detail.fullName || detail.email)) {
          setUserName(detail.name || detail.fullName || detail.email || 'User');
          // only update avatar if a new avatar value is present
          try {
            const newAvatar = detail.avatar || detail.photoURL || detail.avatarUrl || detail.picture || null;
            if (newAvatar) setAvatarUrl(newAvatar);
          } catch (e) {}
          return;
        }
      } catch (e) {}
      // fallback to localStorage if event has no detail
      try {
        const raw = localStorage.getItem('user');
        if (raw) {
          const u = JSON.parse(raw);
          setUserName(u?.name || u?.fullName || u?.email || 'User');
          try {
            const newAvatar = u?.avatar || u?.photoURL || u?.avatarUrl || u?.picture || null;
            if (newAvatar) setAvatarUrl(newAvatar);
          } catch (e) {}
        }
      } catch (e) {}
    };

    const onStorage = (ev) => {
      if (ev.key === 'user') {
        try {
          const u = JSON.parse(ev.newValue || '{}');
          setUserName(u?.name || u?.fullName || u?.email || 'User');
          try {
            const newAvatar = u?.avatar || u?.photoURL || u?.avatarUrl || u?.picture || null;
            if (newAvatar) setAvatarUrl(newAvatar);
          } catch (e) {}
        } catch (e) {}
      }
    };

    window.addEventListener('userProfileUpdated', onProfileUpdated);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('userProfileUpdated', onProfileUpdated);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const [avatarUrl, setAvatarUrl] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        return u?.avatar || u?.photoURL || u?.avatarUrl || u?.picture || null;
      }
    } catch (e) {}
    return null;
  });

  const initials = (userName || 'U').split(' ').map(s => s[0] || '').slice(0,2).join('').toUpperCase();

  return (
    <header className="flex justify-between items-center py-5 border-b border-gray-100 mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <LayoutDashboard size={20} />
        </div>
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-xs text-gray-500 font-medium">Welcome back, {userName}.</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button aria-label="Notifications" className="p-2 text-gray-400 rounded-full">
          <Bell size={20} />
        </button>
        <div className="h-8 w-px bg-gray-200"></div>
        <button onClick={() => navigate('/profile')} className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-3 rounded-full transition-colors">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Profile" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/default-avatar.png'; }} className="w-8 h-8 rounded-full object-cover border border-white shadow-sm" />
          ) : (
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 border border-white shadow-sm">{initials}</div>
          )}
          <span className="text-sm font-bold text-gray-700 hidden sm:block cursor-pointer">Profile</span>
        </button>
      </div>
    </header>
  );
};

const ReadinessCard = ({ className = '', readiness }) => {
  const readinessDisplay = typeof readiness === 'number' ? readiness : USER_SUMMARY.readiness;

  const getReadinessLabel = (v) => {
    if (typeof v !== 'number' || Number.isNaN(v)) return USER_SUMMARY.readinessLabel;
    if (v >= 85) return USER_SUMMARY.readinessLabel; // e.g. "Interview Ready"
    if (v >= 60) return 'Near Ready';
    if (v >= 30) return 'Needs Improvement';
    return 'Poor';
  };

  const getLabelClasses = (v) => {
    if (v >= 85) return 'bg-green-50 text-green-700 border-green-100';
    if (v >= 60) return 'bg-indigo-50 text-indigo-700 border-indigo-100';
    if (v >= 30) return 'bg-orange-50 text-orange-600 border-orange-100';
    return 'bg-red-50 text-red-600 border-red-100';
  };

  const readinessLabel = getReadinessLabel(readinessDisplay);
  const labelClass = getLabelClasses(readinessDisplay);

  return (
    <div className={`bg-white border border-gray-200 rounded-2xl p-5 lg:p-6 shadow-sm flex items-center justify-between relative overflow-hidden group hover:border-indigo-200 transition-colors ${className}`}>
      <div className="relative z-10">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Overall Readiness</div>
        <div className="text-4xl font-black text-gray-900 mb-2">{readinessDisplay}%</div>
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${labelClass}`}>
          <TrendingUp size={12} /> {readinessLabel}
        </div>
      </div>

      <div className="h-24 w-24 relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            innerRadius="70%" 
            outerRadius="100%" 
            barSize={8} 
            data={[{ fill: '#4f46e5', value: readinessDisplay }]} 
            startAngle={90} 
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar background={{ fill: '#f3f4f6' }} dataKey="value" cornerRadius={10} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
          <Target size={24} />
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, sub, icon: Icon, color, className = '' }) => (
  <div className={`bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-indigo-200 transition-colors flex flex-col justify-between ${className}`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
        <Icon size={20} />
      </div>
    </div>
      <div>
        <div className="text-2xl font-black text-gray-900">{typeof value === 'function' ? value() : value}</div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{label}</div>
        <div className="text-xs text-gray-500 mt-2 truncate">{sub}</div>
      </div>
  </div>
);

const QuickActionBtn = ({ icon: Icon, label, primary, className = '', onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-xl border transition-all
      ${primary 
        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700' 
        : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-gray-50'}
      ${className}
    `}
  >
    <Icon size={20} />
    <span className="text-xs font-bold">{label}</span>
  </button>
);

const ModuleCard = ({ module }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group">
    <div className="flex justify-between items-start mb-3">
      <div className="p-2 bg-gray-50 rounded-lg text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
        <module.icon size={18} />
      </div>
      <div className="text-[10px] font-bold text-gray-400">{module.last}</div>
    </div>
    <h3 className="font-bold text-gray-900 text-sm mb-1">{module.title}</h3>
      <div className="flex justify-between items-end">
      <span className="text-xs text-gray-500">{module.level}</span>
      {
        (() => {
          try {
            // For Resume Analyzer module prefer authoritative localStorage atsScore when available
            if (module.id === 'res') {
              const raw = localStorage.getItem('atsScore');
              if (raw !== null) {
                const n = Number(raw);
                if (!Number.isNaN(n)) return <span className="text-xs font-bold text-indigo-600">{`${n}%`}</span>;
              }
            }
          } catch (e) {}
          return <span className="text-xs font-bold text-indigo-600">{module.quickScore != null ? `${module.quickScore}%` : `${module.progress}%`}</span>;
        })()
      }
    </div>
    <div className="w-full bg-gray-100 h-1 rounded-full mt-3 overflow-hidden">
      {
        (() => {
          try {
            if (module.id === 'res') {
              const raw = localStorage.getItem('atsScore');
              if (raw !== null) {
                const n = Number(raw);
                if (!Number.isNaN(n)) return <div className="h-full bg-indigo-600" style={{ width: `${n}%` }}></div>;
              }
            }
          } catch (e) {}
          const pct = module.quickScore != null ? module.quickScore : module.progress;
          return <div className="h-full bg-indigo-600" style={{ width: `${pct}%` }}></div>;
        })()
      }
    </div>
  </div>
);

const IntelligenceCard = ({ data }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm">
        <data.icon size={16} />
      </div>
      <div>
        <div className="text-xs font-bold text-gray-500 uppercase">{data.label}</div>
        <div className="text-sm font-black text-gray-900">{data.score}%</div>
      </div>
    </div>
    <span className={`text-xs font-bold ${data.trend.includes('+') ? 'text-green-600' : 'text-red-500'}`}>
      {data.trend}
    </span>
  </div>
);

// Notification UI removed — only bell icon remains in header per product request.

// --- MAIN PAGE ---

const MainDashboard = () => {
  const navigate = useNavigate();
  const [companyHover, setCompanyHover] = useState(false);
  // persisted completed modules counter (increments each time a company simulation 'End Simulation' is pressed)
  const [completedModules, setCompletedModules] = useState(() => {
    try { return Number(localStorage.getItem('completedModules') || 0); } catch (e) { return 0; }
  });

  useEffect(() => {
    // ensure key exists
    try { if (localStorage.getItem('completedModules') === null) localStorage.setItem('completedModules', '0'); } catch (e) {}

    const handler = (e) => {
      try {
        if (e?.detail?.completedModules !== undefined) {
          const v = Number(e.detail.completedModules);
          if (!Number.isNaN(v)) { setCompletedModules(v); return; }
        }
        const cur = Number(localStorage.getItem('completedModules') || 0);
        if (!Number.isNaN(cur)) setCompletedModules(cur);
      } catch (err) {}
    };

    const storageHandler = (e) => {
      try {
        if (e?.key === 'completedModules') {
          const v = e.newValue ? Number(e.newValue) : 0;
          if (!Number.isNaN(v)) setCompletedModules(v);
        }
      } catch (err) {}
    };
  }, []);

  const computeOverallFromStorage = () => {
    try {
      // Prefer explicit readinessScore (produced by ReadinessRadar / quick saves)
      const rawReadiness = localStorage.getItem('readinessScore');
      if (rawReadiness !== null) {
        const r = Number(rawReadiness);
        if (!Number.isNaN(r)) return (r > 0 && r <= 1) ? Math.round(r * 100) : Math.round(Math.max(0, Math.min(100, r)));
      }
      // If no readinessScore, fall back to detailedReport.overall
      const rawDetailed = localStorage.getItem('detailedReport');
      if (rawDetailed) {
        const dr = JSON.parse(rawDetailed);
        if (dr && typeof dr.overall !== 'undefined' && dr.overall !== null) {
          const d = Number(dr.overall);
          if (!Number.isNaN(d)) {
            if (d > 0 && d <= 1) return Math.round(d * 100);
            return Math.round(Math.max(0, Math.min(100, d)));
          }
        }
      }
      // pull values from local keys or user object
      let aptitude = null, technical = null, communication = null, confidence = null, stress = null;
      const raw = localStorage.getItem('aptitudeScore');
      if (raw !== null) aptitude = normalize(raw);
      const rawTechnical = localStorage.getItem('averageScore');
      if (rawTechnical !== null) technical = normalize(rawTechnical);
      const rawCommunication = localStorage.getItem('hrCommunication');
      if (rawCommunication !== null) communication = normalize(rawCommunication);
      const rawConfidence = localStorage.getItem('hrConfidence');
      if (rawConfidence !== null) confidence = normalize(rawConfidence);
      const rawStress = localStorage.getItem('stressTolerance');
      if (rawStress !== null) stress = normalize(rawStress);
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        const u = JSON.parse(userRaw);
        if (aptitude === null && typeof u.aptitudeScore !== 'undefined' && u.aptitudeScore !== null) aptitude = normalize(u.aptitudeScore);
        if (technical === null && typeof u.averageScore !== 'undefined' && u.averageScore !== null) technical = normalize(u.averageScore);
        if (communication === null && typeof u.hrCommunication !== 'undefined' && u.hrCommunication !== null) communication = normalize(u.hrCommunication);
        if (confidence === null && typeof u.hrConfidence !== 'undefined' && u.hrConfidence !== null) confidence = normalize(u.hrConfidence);
        if (stress === null && typeof u.stressTolerance !== 'undefined' && u.stressTolerance !== null) stress = normalize(u.stressTolerance);
      }

      // fallbacks to ReadinessRadar defaults
      if (aptitude === null) aptitude = 85;
      if (technical === null) technical = 92;
      if (communication === null) communication = 65;
      // new accounts should start with 0 HR confidence until they attempt HR
      if (confidence === null) confidence = 0;
      if (stress === null) stress = 55;

      const weights = {
        Aptitude: 15,
        Technical: 30,
        Communication: 20,
        Confidence: 20,
        'Stress Tolerance': 15
      };
      const map = {
        Aptitude: aptitude,
        Technical: technical,
        Communication: communication,
        Confidence: confidence,
        'Stress Tolerance': stress
      };
      let total = 0;
      let weightSum = 0;
      for (const [k, w] of Object.entries(weights)) {
        const v = map[k] ?? 0;
        total += v * w;
        weightSum += w;
      }
      if (weightSum === 0) return 0;
      return Math.round(total / weightSum);
    } catch (e) { return USER_SUMMARY.readiness; }
  };

  const [computedReadiness, setComputedReadiness] = useState(() => computeOverallFromStorage());
  const [aptitudeScore, setAptitudeScore] = useState(initialAptitudeScore);
  // Helper to parse stored score values like "78%", "78", or "0.78"
  const parseStoredScore = (raw) => {
    try {
      if (raw === null || typeof raw === 'undefined') return null;
      let s = String(raw).trim();
      if (s === '') return null;
      if (s.endsWith('%')) s = s.slice(0, -1).trim();
      const cleaned = s.replace(/[^0-9.\-\.]/g, '');
      if (cleaned === '') return null;
      let n = Number(cleaned);
      if (Number.isNaN(n)) return null;
      if (n > 0 && n <= 1) n = Math.round(n * 100);
      n = Math.max(0, Math.min(100, Math.round(n)));
      return n;
    } catch (e) { return null; }
  };

  // Use persisted full company sim score when present to drive the dashboard
  const [fullCompanySimScore, setFullCompanySimScore] = useState(() => {
    try { return parseStoredScore(localStorage.getItem('FullCompanySimScore')); } catch (e) { return null; }
  });

  // Keep FullCompanySimScore in sync with storage and custom events
  useEffect(() => {
    const handler = (e) => {
      try {
        if (e?.detail && typeof e.detail.fullCompanySimScore !== 'undefined') {
          const v = parseStoredScore(e.detail.fullCompanySimScore);
          if (v !== null) { setFullCompanySimScore(v); return; }
        }
        if (e?.key === 'FullCompanySimScore') {
          const v = parseStoredScore(e.newValue);
          if (v !== null) setFullCompanySimScore(v);
          else setFullCompanySimScore(null);
        }
      } catch (err) {}
    };
    window.addEventListener('fullCompanySimScoreUpdated', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('fullCompanySimScoreUpdated', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);
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
  const [gdScore, setGdScore] = useState(() => {
    try {
      const cached = localStorage.getItem('gdScore');
      if (cached !== null) {
        const num = Number(cached);
        if (!Number.isNaN(num)) return num;
      }
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        const u = JSON.parse(userRaw);
        if (u && typeof u.gdScore !== 'undefined' && u.gdScore !== null) {
          const gn = Number(u.gdScore);
          if (!Number.isNaN(gn)) return gn;
        }
      }
    } catch (e) {}
    return null;
  });
  const [averageScore, setAverageScore] = useState(() => {
    try {
      const raw = localStorage.getItem('averageScore');
      if (raw !== null) {
        const n = Number(raw);
        if (!Number.isNaN(n)) return n;
      }
    } catch (e) {}
    return 0;
  });
  const [hrScore, setHrScore] = useState(() => {
    try {
      const raw = localStorage.getItem('hrConfidence');
      if (raw !== null) {
        const n = Number(raw);
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
    // default HR score for newly created accounts is 0
    return 0;
  });
  const [practiceModules, setPracticeModules] = useState(PRACTICE_MODULES);

  // Notifications removed — only bell icon remains with no notification logic.

  // (Realtime removed) Socket.IO was removed — server-driven realtime notifications disabled.

  // helper: whether user has any recorded HR attempts (set by Report after successful save)
  const hasHrAttempts = (() => {
    try {
      const raw = localStorage.getItem('hrAttempts');
      if (raw) return Number(raw) > 0;
      const uRaw = localStorage.getItem('user');
      if (uRaw) {
        const u = JSON.parse(uRaw);
        return (u && u.hrAttempts && Number(u.hrAttempts) > 0) || false;
      }
    } catch (e) {}
    return false;
  })();

  // Persist hrScore to localStorage and broadcast updates so other components
  // (including PerformanceReport) pick up the authoritative HR value immediately.
  useEffect(() => {
    try {
      if (typeof hrScore === 'number') {
        localStorage.setItem('hrConfidence', String(hrScore));
        const userRaw = localStorage.getItem('user');
        if (userRaw) {
          try {
            const u = JSON.parse(userRaw || '{}');
            u.hrConfidence = hrScore;
            localStorage.setItem('user', JSON.stringify(u));
          } catch (e) { /* ignore */ }
        }
        const ev = new CustomEvent('hrConfidenceUpdated', { detail: { hrConfidence: hrScore, confidence: hrScore } });
        window.dispatchEvent(ev);
      }
    } catch (e) { /* ignore */ }
  }, [hrScore]);

  useEffect(() => {
    // always pick up any cached gdScore immediately
    try {
      const cachedGd0 = localStorage.getItem('gdScore');
      if (cachedGd0 !== null) {
        const g0 = Number(cachedGd0);
        if (!Number.isNaN(g0)) setGdScore(g0);
      }
    } catch (e) {}
    // fetch user scores if logged in
    // prefer local cached ATS score for immediate UI reflect
    try {
      // Prefer a per-user cached value when available. If a `user` object
      // exists in localStorage use its `atsScore` (normalized to 0 by auth flows),
      // otherwise fall back to the top-level `atsScore` key.
      const rawUser = localStorage.getItem('user');
      if (rawUser) {
        try {
          const u = JSON.parse(rawUser);
          if (u && typeof u.atsScore !== 'undefined' && u.atsScore !== null) {
            const n = Number(u.atsScore);
            if (!Number.isNaN(n)) setAtsScore(n);
          }
            // also prefer per-user gdScore when available
            if (u && typeof u.gdScore !== 'undefined' && u.gdScore !== null) {
              const g = Number(u.gdScore);
              if (!Number.isNaN(g)) setGdScore(g);
            }
        } catch (err) {
          // if parsing fails, fallback to top-level key
          const cached = localStorage.getItem('atsScore');
          if (cached !== null) {
            const num = Number(cached);
            if (!Number.isNaN(num)) setAtsScore(num);
          }
            const cachedGd = localStorage.getItem('gdScore');
            if (cachedGd !== null) {
              const gn = Number(cachedGd);
              if (!Number.isNaN(gn)) setGdScore(gn);
            }
        }
      } else {
        const cached = localStorage.getItem('atsScore');
        if (cached !== null) {
          const num = Number(cached);
          if (!Number.isNaN(num)) setAtsScore(num);
        }
          const cachedGd = localStorage.getItem('gdScore');
          if (cachedGd !== null) {
            const gn = Number(cachedGd);
            if (!Number.isNaN(gn)) setGdScore(gn);
          }
      }
    } catch (e) {}
    // Register event listeners so UI updates when other parts of the app
    // (or other tabs) update the atsScore. Always register these listeners
    // even if the user isn't authenticated, so cached values show up.
    const handler = (e) => {
      // If a whole user object was emitted, prefer that authoritative source
      if (e?.detail?.user) {
        try {
          const u = e.detail.user;
          if (typeof u.aptitudeScore !== 'undefined' && u.aptitudeScore !== null) setAptitudeScore(Number(u.aptitudeScore));
          if (typeof u.atsScore !== 'undefined' && u.atsScore !== null) setAtsScore(Number(u.atsScore));
          if (typeof u.gdScore !== 'undefined' && u.gdScore !== null) setGdScore(Number(u.gdScore));
          if (typeof u.averageScore !== 'undefined' && u.averageScore !== null) setAverageScore(Number(u.averageScore));
          if (typeof u.hrConfidence !== 'undefined' && u.hrConfidence !== null) setHrScore(Number(u.hrConfidence));
        } catch (err) {
          // fall through to other detail shapes
        }
        return;
      }

      if (e?.detail?.aptitudeScore !== undefined) setAptitudeScore(Number(e.detail.aptitudeScore));
      // support multiple possible detail shapes from different emitters
      if (e?.detail?.atsScore !== undefined) {
        const v = Number(e.detail.atsScore);
        if (!Number.isNaN(v)) setAtsScore(v);
      } else if (e.type === 'atsScoreUpdated' && e?.detail?.score !== undefined) {
        // only treat generic `detail.score` as ATS when the event is explicitly for ATS
        const v = Number(e.detail.score);
        if (!Number.isNaN(v)) setAtsScore(v);
      } else if (e.type === 'atsScoreUpdated' && typeof e?.detail === 'string') {
        const v = Number(e.detail);
        if (!Number.isNaN(v)) setAtsScore(v);
      }
      // gdScore updates
      if (e?.detail?.gdScore !== undefined) {
        const g = Number(e.detail.gdScore);
        if (!Number.isNaN(g)) setGdScore(g);
      } else if (e?.detail?.gd !== undefined) {
        const g = Number(e.detail.gd);
        if (!Number.isNaN(g)) setGdScore(g);
      }
      // averageScore (technical interview) updates
      if (e?.detail?.score !== undefined && typeof e.detail.score === 'number') {
        setAverageScore(Number(e.detail.score));
      } else if (e?.detail?.averageScore !== undefined) {
        const v = Number(e.detail.averageScore);
        if (!Number.isNaN(v)) setAverageScore(v);
      }
    };
    const storageHandler = (e) => {
      try {
        if (e.key === 'atsScore') {
          const v = Number(e.newValue);
          if (!Number.isNaN(v)) setAtsScore(v);
        } else if (e.key === 'gdScore') {
          const g = Number(e.newValue);
          if (!Number.isNaN(g)) setGdScore(g);
        } else if (e.key === 'user') {
          // when the cached user object changes (login/register), prefer
          // the user's atsScore (defaulted to 0) over a previous global value.
          try {
            const u = JSON.parse(e.newValue || '{}');
                if (u && typeof u.atsScore !== 'undefined' && u.atsScore !== null) {
                  const n = Number(u.atsScore);
                  if (!Number.isNaN(n)) setAtsScore(n);
                }
                    if (u && typeof u.gdScore !== 'undefined' && u.gdScore !== null) {
                      const gn = Number(u.gdScore);
                      if (!Number.isNaN(gn)) setGdScore(gn);
                    }
                // user may include averageScore
                if (u && typeof u.averageScore !== 'undefined' && u.averageScore !== null) {
                  const a = Number(u.averageScore);
                  if (!Number.isNaN(a)) setAverageScore(a);
                }
          } catch (err) {
            // ignore
          }
        }
      } catch (err) {}
    };
    // listen for averageScoreUpdated events specifically
    window.addEventListener('averageScoreUpdated', handler);
    window.addEventListener('aptitudeScoreUpdated', handler);
    window.addEventListener('atsScoreUpdated', handler);
    window.addEventListener('gdScoreUpdated', handler);
    window.addEventListener('userProfileUpdated', handler);
    window.addEventListener('storage', storageHandler);

    const token = localStorage.getItem('token');
    // if not authenticated we still keep listening for local updates
    if (token) {
      fetch('http://localhost:5000/api/user/scores', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.aptitudeScore !== 'undefined' && data.aptitudeScore !== null) {
          setAptitudeScore(data.aptitudeScore);
        }
        // Only apply server atsScore if there's no top-level cached value
        if (data && typeof data.atsScore !== 'undefined' && data.atsScore !== null) {
          const localCached = (() => { try { return localStorage.getItem('atsScore'); } catch (e) { return null; }})();
          if (localCached === null) {
            const n = Number(data.atsScore);
            if (!Number.isNaN(n)) setAtsScore(n);
          }
        }
          if (data && typeof data.gdScore !== 'undefined' && data.gdScore !== null) {
            const g = Number(data.gdScore);
            if (!Number.isNaN(g)) setGdScore(g);
          }
          if (data && typeof data.averageScore !== 'undefined' && data.averageScore !== null) {
            const a = Number(data.averageScore);
            if (!Number.isNaN(a)) setAverageScore(a);
          }
      })
      .catch(() => {});
    }
    return () => {
      window.removeEventListener('aptitudeScoreUpdated', handler);
      window.removeEventListener('atsScoreUpdated', handler);
      window.removeEventListener('gdScoreUpdated', handler);
      window.removeEventListener('averageScoreUpdated', handler);
      window.removeEventListener('storage', storageHandler);
    };
  }, []);

  // keep computedReadiness in sync with storage and broadcast events
  React.useEffect(() => {
    const recompute = () => setComputedReadiness(computeOverallFromStorage());
    // recompute when our local states change
    recompute();
    window.addEventListener('aptitudeScoreUpdated', recompute);
    window.addEventListener('averageScoreUpdated', recompute);
    window.addEventListener('hrConfidenceUpdated', recompute);
    window.addEventListener('hrCommunicationUpdated', recompute);
    window.addEventListener('readinessScoreUpdated', recompute);
    window.addEventListener('storage', recompute);
    return () => {
      window.removeEventListener('aptitudeScoreUpdated', recompute);
      window.removeEventListener('averageScoreUpdated', recompute);
      window.removeEventListener('hrConfidenceUpdated', recompute);
      window.removeEventListener('hrCommunicationUpdated', recompute);
      window.removeEventListener('readinessScoreUpdated', recompute);
      window.removeEventListener('storage', recompute);
    };
  }, []);

  // Persist aptitudeScore to localStorage and broadcast updates so other components
  // (including ReadinessRadar) pick up the authoritative dashboard value immediately.
  useEffect(() => {
    try {
      if (typeof aptitudeScore === 'number') {
        localStorage.setItem('aptitudeScore', String(aptitudeScore));
        const userRaw = localStorage.getItem('user');
        if (userRaw) {
          try {
            const u = JSON.parse(userRaw || '{}');
            u.aptitudeScore = aptitudeScore;
            localStorage.setItem('user', JSON.stringify(u));
          } catch (e) {
            // ignore JSON errors
          }
        }
        const ev = new CustomEvent('aptitudeScoreUpdated', { detail: { aptitudeScore } });
        window.dispatchEvent(ev);
      }
    } catch (e) {
      // ignore storage errors
    }
  }, [aptitudeScore]);

  // Persist gdScore to localStorage and broadcast updates so other components
  // pick up the authoritative GD value immediately.
  useEffect(() => {
    try {
      if (typeof gdScore === 'number') {
        localStorage.setItem('gdScore', String(gdScore));
        const userRaw = localStorage.getItem('user');
        if (userRaw) {
          try {
            const u = JSON.parse(userRaw || '{}');
            u.gdScore = gdScore;
            localStorage.setItem('user', JSON.stringify(u));
          } catch (e) {
            // ignore JSON errors
          }
        }
        const ev = new CustomEvent('gdScoreUpdated', { detail: { gdScore } });
        window.dispatchEvent(ev);
      }
    } catch (e) { /* ignore storage errors */ }
  }, [gdScore]);

  // keep practiceModules' apt card in sync with aptitudeScore
  useEffect(() => {
    if (typeof aptitudeScore !== 'number') return;
    setPracticeModules(prev => prev.map(pm => pm.id === 'apt' ? { ...pm, progress: aptitudeScore } : pm));
  }, [aptitudeScore]);

  // keep Resume Analyzer module in sync with atsScore
  useEffect(() => {
    if (typeof atsScore !== 'number') return;
    setPracticeModules(prev => prev.map(pm => pm.id === 'res' ? { ...pm, progress: atsScore } : pm));
  }, [atsScore]);

  // keep Group Discussion module in sync with gdScore
  useEffect(() => {
    if (typeof gdScore !== 'number') return;
    setPracticeModules(prev => prev.map(pm => pm.id === 'gd' ? { ...pm, progress: gdScore } : pm));
  }, [gdScore]);

  // keep Technical Interview module in sync with averageScore
  useEffect(() => {
    if (typeof averageScore !== 'number') return;
    setPracticeModules(prev => prev.map(pm => pm.id === 'tech' ? { ...pm, progress: averageScore } : pm));
  }, [averageScore]);

  // Fetch latest quick HR score and show it on the HR module card
  // Only fetch if the user has previously attempted HR (avoid showing server scores for new accounts)
  useEffect(() => {
    if (!hasHrAttempts) return;
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('http://localhost:5000/api/score/latest?module=hr');
        const data = await res.json();
        if (!mounted) return;
        if (data?.found && typeof data.score === 'number') {
          setPracticeModules(prev => prev.map(m => m.id === 'hr' ? { ...m, quickScore: data.score } : m));
          try {
            setHrScore(Number(data.score));
          } catch (e) {}
        }
      } catch (e) {
        console.debug('dashboard: fetch hr quick score failed', e);
      }
    })();
    return () => { mounted = false; };
  }, [hasHrAttempts]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans p-2 md:p-0 flex justify-center">
      <div className="w-full max-w-7xl">
        
        <DashboardHeader />

        {/* --- SECTION 2: HERO SNAPSHOT --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <ReadinessCard className="h-full" readiness={fullCompanySimScore !== null ? fullCompanySimScore : computedReadiness} />
          
          <MetricCard 
            label="Practice Completed" 
            value={`${completedModules}`} 
            sub="Modules Finished"
            icon={CheckCircle2}
            color="indigo"
            className="h-full"
          />
          
          <MetricCard 
            label="Aptitude Score" 
            value={aptitudeScore !== null ? `${aptitudeScore}%` : "-"} 
            sub="Latest test result"
            icon={FileText}
            color="indigo"
            className="h-full"
          />
          
          <MetricCard 
            label="ATS Score" 
            value={() => {
              try {
                const raw = localStorage.getItem('atsScore');
                if (raw !== null) {
                  const n = Number(raw);
                  if (!Number.isNaN(n)) {
                    if (typeof atsScore === 'number' && atsScore !== n) {
                      try { console.debug('Dashboard: atsScore state differs from localStorage', { state: atsScore, storage: n }); } catch (e) {}
                    }
                    return `${n}%`;
                  }
                }
              } catch (e) {}
              return `${atsScore}%`;
            }} 
            sub="Resume ATS match"
            icon={FileText}
            color="indigo"
            className="h-full"
          />

          {/* HR quick live evaluation score */}
          <MetricCard 
            label="HR Quick Score"
            value={(() => {
              const hr = practiceModules.find(p => p.id === 'hr');
              // If user hasn't attempted HR yet, display 0 explicitly
              if (!hasHrAttempts) return `0%`;
              if (hr && typeof hr.quickScore === 'number') return `${hr.quickScore}%`;
              if (typeof hrScore === 'number') return `${hrScore}%`;
              return '-';
            })()}
            sub={hasHrAttempts ? "Latest live eval" : "No HR attempts yet"}
            icon={Mic}
            color="indigo"
            className="h-full"
          />
          
        </div>

        {/* --- SECTION 3: QUICK ACTIONS --- */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <QuickActionBtn icon={Briefcase} label="Company Sim" onClick={() => navigate('/company-sim')} />
          <QuickActionBtn icon={Briefcase} label="Company Sim 1" />
          <QuickActionBtn icon={Users} label="Ask Mentor" onClick={() => navigate('/interview-mentor')} />
          <QuickActionBtn icon={FileText} label="Scan Resume" onClick={() => navigate('/resume-analyzer')} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN (MAIN FEED) --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* AI Insights */}
            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-600" /> AI Recommendations
              </h3>
              <div className="space-y-3">
                {INSIGHTS.map((insight) => (
                  <div key={insight.id} className={`p-4 rounded-xl border flex justify-between items-center ${insight.type === 'urgent' ? 'bg-orange-50 border-orange-100' : 'bg-indigo-50 border-indigo-100'}`}>
                    <div className="flex gap-3">
                      {insight.type === 'urgent' ? <AlertCircle className="text-orange-500 shrink-0" size={20}/> : <Brain className="text-indigo-600 shrink-0" size={20}/>}
                      <p className={`text-sm font-medium leading-tight ${insight.type === 'urgent' ? 'text-orange-900' : 'text-indigo-900'}`}>
                        {insight.text}
                      </p>
                    </div>
                    <button className="text-xs font-bold underline whitespace-nowrap ml-4 hover:opacity-70">
                      {insight.link}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Practice Modules */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Practice Modules</h3>
                <button className="text-xs font-bold text-indigo-600 hover:underline">View All</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {practiceModules.map(mod => <ModuleCard key={mod.id} module={mod} />)}
              </div>
            </section>

            {/* Company Sim Status */}
            <section className="bg-gray-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div
                className="relative z-10 flex justify-between items-center cursor-pointer"
                onMouseEnter={() => setCompanyHover(true)}
                onMouseLeave={() => setCompanyHover(false)}
                onClick={() => navigate('/company-sim')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/company-sim'); }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2 text-indigo-300 font-bold text-xs uppercase tracking-widest">
                    <Briefcase size={14} /> Company Simulation
                  </div>
                  <h3 className="text-xl font-bold mb-1">Target: Google (L4)</h3>
                  <p className="text-sm text-gray-400 mb-6">Last attempt score: 82/100. You are close.</p>
                  <button className="px-5 py-2 bg-white text-gray-900 font-bold text-xs rounded-lg hover:bg-gray-100 transition-colors">
                    Start New Simulation
                  </button>
                </div>
                <div className="hidden sm:block opacity-20">
                  <Briefcase size={80} />
                </div>
              </div>
            </section>

          </div>

          {/* --- RIGHT COLUMN (INTELLIGENCE & HISTORY) --- */}
          <div className="space-y-8">
            
            {/* Intelligence Hub */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Intelligence Hub</h3>
                <ArrowUpRight size={16} className="text-gray-400" />
              </div>
              <div className="space-y-3">
                {INTELLIGENCE_SCORES.map((intel, i) => (
                  <IntelligenceCard key={i} data={intel} />
                ))}
              </div>
              <button className="w-full mt-4 py-2 border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">
                View Full Analytics
              </button>
            </section>

            {/* Journey Timeline Preview */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Recent Journey</h3>
              <div className="space-y-6 relative pl-2">
                {/* Vertical Line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
                
                {RECENT_ACTIVITY.map((act, i) => (
                  <div key={act.id} className="relative flex gap-4">
                    <div className="w-5 h-5 rounded-full bg-white border-2 border-indigo-600 z-10 shrink-0"></div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{act.title}</div>
                      <div className="flex gap-2 text-xs text-gray-500 mt-0.5">
                        <span>{act.time}</span>
                        <span>•</span>
                        <span className="text-indigo-600 font-medium">{act.score}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 text-xs font-bold text-indigo-600 hover:underline">
                View Full Timeline
              </button>
            </section>

            {/* Certifications Preview */}
            <section className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
               <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Award size={16} /> Certifications
               </h3>
               <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                   <Award size={20} />
                 </div>
                 <div>
                   <div className="text-sm font-bold text-indigo-900">System Design L1</div>
                   <div className="text-xs text-indigo-500">Earned Jan 15</div>
                 </div>
               </div>
               <button className="w-full py-2 bg-white text-indigo-600 text-xs font-bold rounded-lg hover:shadow-sm transition-all border border-indigo-100">
                 View All Badges
               </button>
            </section>

          </div>
        </div>

        {/* --- FOOTER --- */}
        <footer className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>© 2026 AI Interview Prep Platform. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0 font-bold">
            <a href="#" className="hover:text-indigo-600">Help & Support</a>
            <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600">Terms</a>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default MainDashboard;