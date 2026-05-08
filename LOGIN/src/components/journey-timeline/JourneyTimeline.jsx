import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, 
  Flag, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Download, 
  Share2, 
  Filter, 
  Brain, 
  ChevronDown, 
  ChevronUp,
  Video,
  Code2,
  Mic,
  Zap,
  ArrowRight // Added for consistency
} from 'lucide-react';

// --- MOCK DATA ---
const TIMELINE_DATA = [
  {
    id: 6,
    date: "Today, 10:30 AM",
    type: "milestone",
    module: "HR Round Simulation",
    title: "Achieved 'Interview Ready' Status",
    insight: "Confidence scores stabilized above 85% across all domains.",
    impact: "positive",
    metrics: { label: "Readiness", before: "Near Ready", after: "Ready" },
    icon: Flag
  },
  {
    id: 5,
    date: "Oct 22, 2:00 PM",
    type: "improvement",
    module: "Technical Simulation (Retry)",
    title: "Successful Recovery: System Design",
    insight: "Applied 'Sharding' concepts correctly. Logic gap closed.",
    impact: "positive",
    metrics: { label: "Tech Score", before: 45, after: 78 },
    icon: Video
  },
  {
    id: 4,
    date: "Oct 20, 11:00 AM",
    type: "practice",
    module: "Stress Simulator",
    title: "Recovery Action: Pressure Drills",
    insight: "Targeted practice to address panic response detected on Oct 18.",
    impact: "neutral",
    icon: Zap
  },
  {
    id: 3,
    date: "Oct 18, 4:15 PM",
    type: "failure",
    module: "Technical Simulation",
    title: "Failure Detected: System Design",
    insight: "Critical hesitation during database scaling questions.",
    impact: "setback",
    metrics: { label: "Stress Level", val: "High (85%)" },
    icon: AlertCircle
  },
  {
    id: 2,
    date: "Oct 15, 9:00 AM",
    type: "practice",
    module: "Communication Drills",
    title: "Fluency Practice",
    insight: "Reduced filler words frequency by 15%.",
    impact: "positive",
    icon: Mic
  },
  {
    id: 1,
    date: "Oct 10, 10:00 AM",
    type: "milestone",
    module: "Platform Onboarding",
    title: "Initial Diagnostic Assessment",
    insight: "Baseline established. Strong Aptitude, Weak Technical.",
    impact: "neutral",
    metrics: { label: "Starting Score", val: 42 },
    icon: Flag
  }
];

const STATS = [
  { label: "Active Days", value: "14" },
  { label: "Total Sessions", value: "28" },
  { label: "Readiness Score", value: "85/100" },
  { label: "Current Level", value: "Interview Ready" },
];

// --- COMPONENTS ---

const OverviewCard = ({ label, value }) => (
  <div className="bg-white border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-24 hover:border-indigo-100 transition-colors shadow-sm">
    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</span>
    <span className="text-2xl font-black text-gray-900">{value}</span>
    <div className="h-1 w-8 bg-indigo-600 rounded-full mt-2"></div>
  </div>
);

const TimelineNode = ({ item, align }) => {
  const isLeft = align === 'left';
  const isMilestone = item.type === 'milestone';
  const isFailure = item.type === 'failure';
  
  const borderClass = isFailure ? 'border-gray-300 bg-gray-50' : 
                      isMilestone ? 'border-indigo-600 bg-white ring-1 ring-indigo-50' : 
                      'border-gray-200 bg-white';
                      
  return (
    <div className={`flex justify-between items-center w-full mb-8 ${isLeft ? 'flex-row-reverse' : ''}`}>
      <div className="w-5/12"></div>
      <div className="w-2/12 flex justify-center relative">
        <div className={`w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${isFailure ? 'bg-gray-200 text-gray-500' : 'bg-indigo-600 text-white'}`}>
          <item.icon size={14} />
        </div>
      </div>
      <div className="w-5/12">
        <div className={`p-5 rounded-xl border shadow-sm transition-all hover:shadow-md relative ${borderClass}`}>
          <div className={`absolute top-4 w-4 h-0.5 bg-indigo-100 ${isLeft ? '-right-4' : '-left-4'}`}></div>
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
              {item.date} • {item.module}
            </span>
            {item.impact === 'setback' && <span className="text-[10px] font-bold bg-gray-200 text-gray-600 px-2 py-0.5 rounded">Setback</span>}
            {item.impact === 'positive' && <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">Improved</span>}
          </div>
          <h3 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-3">{item.insight}</p>
          {item.metrics && (
            <div className="mt-3 pt-3 border-t border-gray-100/50 flex items-center gap-2 text-xs">
              <span className="font-bold text-gray-400 uppercase">{item.metrics.label}:</span>
              {item.metrics.before ? (
                 <div className="flex items-center gap-1 font-mono font-medium text-gray-700">
                   <span className="line-through text-gray-400">{item.metrics.before}</span>
                   <ArrowRight size={10} className="text-indigo-400" />
                   <span className="font-bold text-indigo-600">{item.metrics.after}</span>
                 </div>
              ) : (
                <span className="font-mono font-bold text-gray-700">{item.metrics.val}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---

const JourneyTimeline = () => {
  const [showSummary, setShowSummary] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All Events');
  const [timelineData, setTimelineData] = useState(TIMELINE_DATA);

  const filters = [
    { label: 'All Events', key: 'all' },
    { label: 'Milestones', key: 'milestone' },
    { label: 'Attempts', key: 'attempt' },
    { label: 'Failures & Recovery', key: 'fail-rec' },
    { label: 'Practice', key: 'practice' },
  ];

  // Try to load past attempts from localStorage or window globals and merge
  useEffect(() => {
    function tryLoadAttempts() {
      try {
        const keys = ['pastAttempts', 'past_attempts', 'PAST_ATTEMPTS', 'attempts', 'aptitude_attempts'];
        for (const k of keys) {
          const raw = localStorage.getItem(k) || window[k];
          if (!raw) continue;
          if (typeof raw === 'string') {
            try {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed) && parsed.length) return parsed;
            } catch (e) {
              // not JSON, skip
            }
          } else if (Array.isArray(raw) && raw.length) {
            return raw;
          }
        }
      } catch (e) {
        // ignore
      }
      return null;
    }

    const attempts = tryLoadAttempts();
    if (attempts && attempts.length) {
      const mapped = attempts.map((a, i) => {
        const score = a.score !== undefined ? a.score : (a.passed !== undefined ? a.passed : null);
        const impact = score === null ? 'neutral' : (score >= 80 ? 'positive' : score >= 60 ? 'neutral' : 'setback');
        const icon = score === null ? Mic : (score >= 80 ? CheckCircle2 : (score >= 60 ? TrendingUp : AlertCircle));
        const dateStr = a.date ? `${a.date}${a.time ? ', ' + a.time : ''}` : (a.createdAt || 'Unknown');
        return {
          id: `attempt-${a.id || i}`,
          date: dateStr,
          type: 'attempt',
          module: a.topic || a.module || 'Practice',
          title: `Attempt: ${a.topic || a.module || 'Practice'}`,
          insight: `${score !== null ? `Score: ${score}${a.total ? `/${a.total}` : ''}` : ''} ${a.accuracy ? `• Accuracy: ${a.accuracy}%` : ''}`.trim(),
          impact,
          metrics: score !== null ? { label: 'Score', val: `${score}${a.total ? `/${a.total}` : ''}` } : undefined,
          icon
        };
      });

      // Merge attempts at the top and keep existing mock events after; remove duplicates by id
      const merged = [...mapped, ...TIMELINE_DATA];
      const unique = [];
      const seen = new Set();
      for (const it of merged) {
        if (!seen.has(it.id)) {
          unique.push(it);
          seen.add(it.id);
        }
      }
      setTimelineData(unique);
    }
  }, []);

  // Logic for the functional filter (uses timelineData)
  const filteredTimeline = useMemo(() => {
    if (activeFilter === 'All Events') return timelineData;
    if (activeFilter === 'Milestones') return timelineData.filter(i => i.type === 'milestone');
    if (activeFilter === 'Attempts') return timelineData.filter(i => i.type === 'attempt');
    if (activeFilter === 'Failures & Recovery') return timelineData.filter(i => i.type === 'failure' || i.type === 'improvement');
    if (activeFilter === 'Practice') return timelineData.filter(i => i.type === 'practice');
    return timelineData;
  }, [activeFilter, timelineData]);

  const handleExport = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Profile link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans p-8 flex justify-center selection:bg-indigo-100">
      {/* Global CSS for Button Pointers */}
      <style dangerouslySetInnerHTML={{ __html: `button { cursor: pointer; }` }} />
      
      <div className="w-full max-w-5xl space-y-10">

        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-100 pb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">Journey Timeline</h1>
            <p className="text-gray-500 font-medium">Your interview preparation journey, visualizing growth over time.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setActiveFilter('All Events')}
              className="px-4 py-2 border border-indigo-100 text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2 text-sm"
            >
              <Filter size={16} /> Reset
            </button>
            <button 
              onClick={() => setShowSummary(!showSummary)}
              className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm shadow-lg shadow-indigo-100"
            >
              <Brain size={16} /> {showSummary ? 'Hide' : 'View'} AI Summary
            </button>
          </div>
        </header>

        {/* --- SECTION 1: SNAPSHOT --- */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => <OverviewCard key={i} {...stat} />)}
        </section>

        {/* --- SECTION 8: AI SUMMARY --- */}
        {showSummary && (
          <section className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 transition-all animate-in fade-in slide-in-from-top-4">
            <div className="flex items-start gap-4">
               <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600">
                 <Brain size={20} />
               </div>
               <div>
                 <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-widest mb-2">Narrative Intelligence</h3>
                 <p className="text-sm text-gray-700 leading-relaxed font-medium">
                   "You started with strong Aptitude but faced a critical setback in System Design on Oct 18. However, your focused recovery through Stress Simulations directly led to closing the logic gap, resulting in a successful retry on Oct 22. You are now classified as <span className="text-indigo-700 font-bold">Interview Ready</span>."
                 </p>
               </div>
            </div>
          </section>
        )}

        {/* --- SECTION 7: FILTERS (Functional) --- */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter, i) => (
            <button 
              key={i} 
              onClick={() => setActiveFilter(filter.label)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${activeFilter === filter.label ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300'}`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* --- SECTION 2: VERTICAL TIMELINE --- */}
        <section className="relative py-8 min-h-[400px]">
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-indigo-100"></div>

          <div className="flex flex-col items-center w-full">
            {filteredTimeline.length > 0 ? (
              filteredTimeline.map((item, index) => (
                <TimelineNode 
                  key={item.id} 
                  item={item} 
                  align={index % 2 === 0 ? 'left' : 'right'} 
                />
              ))
            ) : (
              <div className="z-10 bg-white p-8 text-center text-gray-400 text-sm italic">
                No events found for this filter.
              </div>
            )}
          </div>

          <div className="flex justify-center pt-8">
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest relative z-10">
              Journey Started • Oct 01
            </div>
          </div>
        </section>

        {/* --- SECTION 9: FOOTER ACTIONS --- */}
        <footer className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">Journey data reflects AI-analyzed interview preparation activity.</p>
          <div className="flex gap-4">
            <button 
              onClick={handleExport}
              className="text-xs font-bold text-gray-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
            >
              <Download size={14} /> Export Timeline
            </button>
            <button 
              onClick={handleShare}
              className="text-xs font-bold text-gray-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
            >
              <Share2 size={14} /> Share Profile
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default JourneyTimeline;