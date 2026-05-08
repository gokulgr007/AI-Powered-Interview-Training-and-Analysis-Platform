import React, { useState } from 'react';
import { 
  Map, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Lock, 
  ArrowRight, 
  Zap, 
  Brain, 
  MessageSquare, 
  Layout, 
  TrendingUp,
  AlertCircle,
  Play
} from 'lucide-react';

// --- MOCK DATA ---

const CLUSTERS = [
  { id: 1, name: "Aptitude Logic", current: "Intermediate", target: "Advanced", priority: "Med", progress: 65 },
  { id: 2, name: "Tech Problem Solving", current: "Advanced", target: "Expert", priority: "Low", progress: 88 },
  { id: 3, name: "HR Communication", current: "Beginner", target: "Intermediate", priority: "High", progress: 30 },
];

// DATA: We structure this so keys match the button names
const ROADMAP_DATA = {
  '7-Day': {
    mentorTip: "This is an aggressive 'Sprint' plan. I've prioritized your weakest areas (HR) immediately to clear blockers before the final stress test.",
    steps: [
      {
        id: 1,
        day: "Day 1",
        title: "Foundation: Behavioral Structuring",
        type: "Communication",
        duration: "45 mins",
        status: "completed",
        action: "Review STAR Method Guide",
        module: "Knowledge Base",
        dependency: null
      },
      {
        id: 2,
        day: "Day 2",
        title: "Practice: Common HR Questions",
        type: "Communication",
        duration: "1 hr",
        status: "active",
        action: "Complete 2 Mock HR Sessions",
        module: "Simulation: HR Round",
        dependency: "Requires STAR Method knowledge"
      },
      {
        id: 3,
        day: "Day 3-4",
        title: "Stress Calibration",
        type: "Resilience",
        duration: "1.5 hrs",
        status: "locked",
        action: "High-Pressure Speed Drill",
        module: "Stress Simulator",
        dependency: "Unlock after HR Proficiency > 50%"
      },
      {
        id: 4,
        day: "Day 5-7",
        title: "Technical Consolidation",
        type: "Technical",
        duration: "2 hrs",
        status: "locked",
        action: "System Design: Scalability",
        module: "Technical Lab",
        dependency: null
      }
    ]
  },
  '14-Day': {
    mentorTip: "A balanced approach. We have time to alternate between technical deep-dives and behavioral nuances without burning out.",
    steps: [
      {
        id: 101,
        day: "Days 1-3",
        title: "Deep Dive: System Design",
        type: "Technical",
        duration: "3 hrs",
        status: "completed",
        action: "Read Distributed Systems Primer",
        module: "Knowledge Base",
        dependency: null
      },
      {
        id: 102,
        day: "Day 4-6",
        title: "Behavioral Workshops",
        type: "Communication",
        duration: "1.5 hrs",
        status: "active",
        action: "STAR Method Drills",
        module: "Simulation: HR Round",
        dependency: "Requires Tech Foundation"
      },
      {
        id: 103,
        day: "Day 7-10",
        title: "Advanced Algorithms",
        type: "Technical",
        duration: "2 hrs",
        status: "locked",
        action: "Graph Theory Problems",
        module: "Code Sandbox",
        dependency: null
      },
      {
        id: 104,
        day: "Day 11-14",
        title: "Full Mock Rehearsal",
        type: "Simulation",
        duration: "1 hr",
        status: "locked",
        action: "Complete Interview Loop",
        module: "Final Exam",
        dependency: "Unlock after passing Algo"
      }
    ]
  },
  '30-Day': {
    mentorTip: "This is a comprehensive mastery path. We will focus on one pillar per week, allowing for rest days and deep cognitive retention.",
    steps: [
      {
        id: 201,
        day: "Week 1",
        title: "Fundamentals & Logic",
        type: "Aptitude",
        duration: "5 hrs",
        status: "completed",
        action: "Logic Puzzle Marathon",
        module: "Brain Gym",
        dependency: null
      },
      {
        id: 202,
        day: "Week 2",
        title: "Core Technical Stack",
        type: "Technical",
        duration: "8 hrs",
        status: "active",
        action: "Build & Explain Project",
        module: "Project Lab",
        dependency: "Requires Week 1 Pass"
      },
      {
        id: 203,
        day: "Week 3",
        title: "Culture & Soft Skills",
        type: "Communication",
        duration: "4 hrs",
        status: "locked",
        action: "Leadership Principles",
        module: "Culture Fit Sim",
        dependency: null
      },
      {
        id: 204,
        day: "Week 4",
        title: "The Gauntlet",
        type: "Resilience",
        duration: "3 hrs",
        status: "locked",
        action: "Back-to-back Mock Interviews",
        module: "Stress Simulator",
        dependency: "Unlock after Week 3"
      }
    ]
  }
};

// --- COMPONENTS ---

const RoadmapStep = ({ step, isLast }) => {
  const isLocked = step.status === 'locked';
  const isActive = step.status === 'active';
  const isCompleted = step.status === 'completed';

  return (
    <div className="flex gap-6 relative">
      {/* Vertical Line */}
      {!isLast && (
        <div className={`absolute left-[19px] top-10 bottom-[-24px] w-0.5 ${isCompleted ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
      )}

      {/* Status Icon */}
      <div className={`
        relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 flex-shrink-0 bg-white
        ${isCompleted ? 'border-indigo-600 text-indigo-600' : isActive ? 'border-indigo-600 text-indigo-600 ring-4 ring-indigo-50' : 'border-gray-200 text-gray-300'}
      `}>
        {isCompleted ? <CheckCircle2 size={20} /> : isLocked ? <Lock size={18} /> : <Circle size={18} fill="currentColor" className="text-indigo-600" />}
      </div>

      {/* Content Card */}
      <div className={`flex-1 mb-6 p-6 rounded-xl border transition-all ${isActive ? 'border-indigo-600 shadow-lg shadow-indigo-50 bg-white' : 'border-gray-200 bg-white'}`}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{step.day} • {step.type}</div>
            <h3 className={`text-lg font-bold ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>{step.title}</h3>
          </div>
          <div className="text-xs font-bold bg-gray-50 px-2 py-1 rounded text-gray-500 flex items-center gap-1">
            <TrendingUp size={12} /> {step.duration}
          </div>
        </div>

        {!isLocked && (
          <>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
              {step.action}
            </div>

            {/* Dependency Logic Display */}
            {step.dependency && (
               <div className="mb-4 text-xs text-gray-400 flex items-center gap-1.5 bg-gray-50 p-2 rounded border border-gray-100 italic">
                 <Layout size={12} />
                 Logic: {step.dependency}
               </div>
            )}

            <button className="w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors">
              <Play size={16} fill="currentColor" /> Go to {step.module}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const SkillRoadmap = () => {
  const [planDuration, setPlanDuration] = useState('7-Day');

  // Derive the current data based on the state
  const currentPlan = ROADMAP_DATA[planDuration];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans p-8 flex justify-center">
      <div className="w-full max-w-6xl space-y-12">

        {/* --- HEADER --- */}
        <header className="flex justify-between items-end border-b border-gray-100 pb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">Skill Roadmap</h1>
            <p className="text-gray-500 font-medium">Your personalized path to interview readiness.</p>
          </div>
          <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <Map size={18} /> Generate New Roadmap
          </button>
        </header>

        {/* --- SECTION 1: SNAPSHOT --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-indigo-600 text-white rounded-2xl p-8 shadow-xl shadow-indigo-100 flex flex-col justify-between">
            <div>
               <h3 className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Current Status</h3>
               <div className="text-4xl font-black">Near Ready</div>
               <div className="text-indigo-200 text-sm mt-1">Overall Score: 72/100</div>
            </div>
            <div className="mt-6 text-xs text-indigo-100 leading-relaxed border-t border-indigo-500 pt-4">
              "This roadmap is generated based on your intelligence data. It prioritizes HR Communication to clear your current bottlenecks."
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {CLUSTERS.map((cluster) => (
              <div key={cluster.id} className="border border-gray-200 rounded-xl p-5 hover:border-indigo-300 transition-colors">
                <div className="flex justify-between items-start mb-3">
                   <div className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${cluster.priority === 'High' ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
                     {cluster.priority} Priority
                   </div>
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">{cluster.name}</h4>
                <div className="text-xs text-gray-500 mb-3">{cluster.current} <span className="text-gray-300">→</span> {cluster.target}</div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600" style={{ width: `${cluster.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- SECTION 7: TIME SELECTOR --- */}
        <div className="flex justify-center">
          <div className="inline-flex bg-gray-100 p-1 rounded-lg">
            {['7-Day', '14-Day', '30-Day'].map(plan => (
              <button 
                key={plan}
                onClick={() => setPlanDuration(plan)}
                className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${planDuration === plan ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {plan} Plan
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* --- SECTION 3: THE ROADMAP (Timeline) --- */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <Calendar size={20} className="text-indigo-600" />
              <h2 className="text-lg font-bold text-gray-900">Execution Timeline ({planDuration})</h2>
            </div>
            
            <div className="pl-2">
              {currentPlan.steps.map((step, index) => (
                <RoadmapStep 
                  key={step.id} 
                  step={step} 
                  isLast={index === currentPlan.steps.length - 1} 
                />
              ))}
            </div>
          </div>

          {/* --- RIGHT COLUMN: INTELLIGENCE & FORECAST --- */}
          <div className="space-y-8">
            
            {/* SECTION 8: AI MENTOR --- */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
               <div className="flex items-center gap-2 mb-4">
                 <Brain size={20} className="text-indigo-600" />
                 <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Mentor Guidance</h2>
               </div>
               <div className="flex gap-4">
                 <div className="w-1 bg-indigo-600 rounded-full flex-shrink-0"></div>
                 <p className="text-sm text-gray-700 leading-relaxed font-medium">
                   "{currentPlan.mentorTip}"
                 </p>
               </div>
            </div>

            {/* SECTION 9: MILESTONES --- */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
               <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                 <Layout size={18} className="text-indigo-600" /> Readiness Milestones
               </h2>
               <div className="space-y-4">
                 <div className="flex items-center justify-between opacity-50">
                   <span className="text-sm font-bold text-gray-500 line-through">Technical Ready</span>
                   <CheckCircle2 size={16} className="text-gray-400" />
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-sm font-bold text-gray-900">HR & Behavioral</span>
                   <div className="text-[10px] font-bold text-indigo-600 border border-indigo-200 px-2 py-0.5 rounded">In Progress</div>
                 </div>
                 <div className="flex items-center justify-between text-gray-400">
                   <span className="text-sm font-bold">Stress Resilience</span>
                   <Lock size={14} />
                 </div>
               </div>
            </div>

            {/* SECTION 10: FORECAST --- */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
              <h2 className="text-sm font-bold text-indigo-900 uppercase tracking-widest mb-4">Completion Forecast</h2>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-indigo-700">Projected Readiness</span>
                <span className="text-2xl font-black text-indigo-600">92/100</span>
              </div>
              <div className="h-2 bg-white rounded-full overflow-hidden border border-indigo-100">
                <div className="h-full bg-indigo-600 w-[92%]"></div>
              </div>
              <p className="text-xs text-indigo-500 mt-3">
                <span className="font-bold">Probability:</span> High chance of selection if Stress drills are passed.
              </p>
            </div>

          </div>
        </div>

        {/* --- FOOTER --- */}
        <footer className="border-t border-gray-100 pt-8 text-center text-xs text-gray-400">
          <p>Roadmap adapts automatically after every simulation session.</p>
          <p className="mt-2">Disclaimer: Timelines are AI-generated estimates.</p>
        </footer>

      </div>
    </div>
  );
};

export default SkillRoadmap;