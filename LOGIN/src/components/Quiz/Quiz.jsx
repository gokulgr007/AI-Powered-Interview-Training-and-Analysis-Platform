import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft, 
  Flag, 
  Brain, 
  Target, 
  BarChart3, 
  RotateCcw, 
  Play, 
  Calculator, 
  BookOpen, 
  PieChart as PieIcon, 
  X,
  ArrowLeft,
  Calendar,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  FileText,
  Check
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { normalizedData } from '../../assets/data';
import toast from 'react-hot-toast';

// --- MOCK DATA ---

const TOPICS = [
  { id: 'quant', label: 'Quantitative Aptitude', icon: Calculator, desc: 'Algebra, Arithmetic, Geometry' },
  { id: 'logic', label: 'Logical Reasoning', icon: Brain, desc: 'Puzzles, Series, Deductions' },
  { id: 'verbal', label: 'Verbal Ability', icon: BookOpen, desc: 'Grammar, Comprehension, Vocab' },
  { id: 'mixed', label: 'Full Mock Test', icon: PieIcon, desc: 'Mixed topics, standard pattern' },
];

const PAST_ATTEMPTS = [
  { id: 101, date: "Jan 16, 2026", time: "10:30 AM", topic: "Logical Reasoning", score: 90, total: 100, accuracy: 92, duration: "12m 30s", trend: "up", passed: 18, failed: 2 },
  { id: 102, date: "Jan 14, 2026", time: "2:15 PM", topic: "Quantitative", score: 65, total: 100, accuracy: 70, duration: "18m 00s", trend: "down", passed: 13, failed: 7 },
  { id: 103, date: "Jan 10, 2026", time: "9:00 AM", topic: "Mixed Mock", score: 78, total: 100, accuracy: 81, duration: "25m 10s", trend: "up", passed: 16, failed: 4 },
  { id: 104, date: "Jan 05, 2026", time: "4:45 PM", topic: "Verbal Ability", score: 85, total: 100, accuracy: 88, duration: "10m 45s", trend: "neutral", passed: 17, failed: 3 },
];

// Questions will be generated from `normalizedData` at test start.

// --- SUB-COMPONENTS ---

// 1. DASHBOARD
const Dashboard = ({ onStart, onViewHistory, testsTaken = 0, avgAccuracy = 0, strongestTopic = 'Logic' }) => (
  <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <header className="flex justify-between items-end border-b border-gray-100 pb-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">Aptitude Test</h1>
        <p className="text-gray-500 font-medium">Assess and improve your logical and quantitative skills.</p>
      </div>
      <button 
        onClick={onViewHistory}
        className="px-6 py-2 border border-indigo-100 text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2"
      >
        <Clock size={18} /> View Past Attempts
      </button>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tests Taken</div>
        <div className="text-4xl font-black text-gray-900">{testsTaken}</div>
      </div>
      <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Avg. Accuracy</div>
        <div className="text-4xl font-black text-indigo-600">{avgAccuracy}%</div>
      </div>
      <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Strongest Topic</div>
        <div className="text-4xl font-black text-gray-900">{strongestTopic}</div>
      </div>
    </div>

    <div className="bg-indigo-600 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between shadow-xl shadow-indigo-100">
      <div>
        <h2 className="text-2xl font-bold mb-2">Ready to practice?</h2>
        <p className="text-indigo-200 text-sm max-w-md">
          Regular aptitude practice improves problem-solving speed by up to 40%.
        </p>
      </div>
      <button 
        onClick={onStart}
        className="mt-6 md:mt-0 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-sm"
      >
        <Play size={20} fill="currentColor" /> Start New Test
      </button>
    </div>
  </div>
);

// 2. ATTEMPT HISTORY
const AttemptHistory = ({ onBack, onViewReport, attempts = [] }) => {
  const items = attempts || [];
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-gray-900">Attempt History</h2>
            <p className="text-sm text-gray-500">Review your past performance and track improvement.</p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="p-5">Date & Time</th>
              <th className="p-5">Topic</th>
              <th className="p-5">Score</th>
              <th className="p-5">Accuracy</th>
              <th className="p-5">Time Spent</th>
              <th className="p-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/80 transition-colors group">
                <td className="p-5">
                  <div className="font-bold text-gray-900">{item.date}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{item.time}</div>
                </td>
                <td className="p-5">
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold border border-gray-200">
                    {item.topic}
                  </span>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-black ${item.passed >= 80 ? 'text-indigo-600' : item.passed >= 60 ? 'text-gray-900' : 'text-red-500'}`}>
                      {item.passed}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">/ {item.attempted}</span>
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    {item.accuracy}%
                    {item.trend === 'up' && <TrendingUp size={14} className="text-green-500" />}
                    {item.trend === 'down' && <TrendingDown size={14} className="text-red-500" />}
                  </div>
                </td>
                <td className="p-5 text-sm text-gray-500 font-mono">
                  {item.duration}
                </td>
                <td className="p-5 text-right">
                  <button 
                    onClick={() => onViewReport(item)}
                    className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-1 ml-auto"
                  >
                    View Report <ChevronRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 3. HISTORICAL REPORT VIEW
const HistoricalReport = ({ report, onBack }) => {
  if (!report) return null;
  const reportRef = useRef(null);

  function exportReportAsPDF() {
    try {
      const node = reportRef.current;
      if (!node) return;
      const headHtml = document.head.innerHTML;
      const html = `<!doctype html><html><head>${headHtml}</head><body>${node.innerHTML}</body></html>`;
      // Try opening a new window/tab. If blocked (popup blocker), fall back
      // to printing via a hidden iframe which is less likely to be blocked.
      // Print via a hidden iframe so we don't navigate away or open blob URLs.
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0px';
      iframe.style.height = '0px';
      iframe.style.border = '0';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);
      const idoc = iframe.contentWindow || iframe.contentDocument;
      const doc = idoc.document || idoc;
      doc.open();
      doc.write(html);
      doc.close();
      // Give the iframe a moment to render styles
      setTimeout(() => {
        try {
          (iframe.contentWindow || iframe).focus();
          (iframe.contentWindow || iframe).print();
        } catch (e) {
          console.error('Iframe print failed', e);
        }
        // cleanup
        setTimeout(() => { try { document.body.removeChild(iframe); } catch (e) {} }, 500);
      }, 700);
      return;
    } catch (e) {
      console.error('Export failed', e);
    }
  }

  const totalForReport = report.total || 20;
  const correct = report.passed || 0;
  const wrong = report.failed || 0;
  const skipped = Math.max(0, totalForReport - (correct + wrong));
  const data = [
    { name: 'Correct', value: correct, color: '#4f46e5' },
    { name: 'Wrong', value: wrong, color: '#ef4444' },
    { name: 'Skipped', value: skipped, color: '#e5e7eb' },
  ];

  return (
    <div ref={reportRef} className="w-full max-w-5xl mx-auto space-y-8 animate-in slide-in-from-right-8 duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-gray-900">Performance Report</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={14} /> {report.date} • {report.time}
              <span className="text-gray-300">|</span>
              <span className="font-bold text-indigo-600">{report.topic}</span>
            </div>
          </div>
        </div>
          <button onClick={exportReportAsPDF} className="px-4 py-2 bg-white border border-gray-200 text-gray-600 font-bold text-sm rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download size={16} /> PDF
          </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center shadow-sm">
          <div className="relative w-32 h-32 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} innerRadius={35} outerRadius={50} dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center font-black text-xl text-gray-900">
              {report.accuracy}%
            </div>
          </div>
          <div className="text-sm font-bold text-gray-900">Accuracy Score</div>
        </div>

        <div className="md:col-span-2 bg-indigo-50 border border-indigo-100 rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-4">
            <Brain size={20} className="text-indigo-600" />
            <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-widest">Historical Analysis</h3>
          </div>
          <p className="text-lg text-gray-800 font-medium leading-relaxed mb-4">
            {report.score > 80 
              ? "This was an excellent session. You demonstrated high speed and accuracy, particularly in pattern recognition questions."
              : "This session highlighted some struggles with time management. Accuracy dropped significantly in the second half of the test."}
          </p>
          <div className="flex gap-6 text-sm">
             <div>
               <span className="block text-xs font-bold text-gray-400 uppercase">Duration</span>
               <span className="font-bold text-gray-900">{report.duration}</span>
             </div>
             <div>
               <span className="block text-xs font-bold text-gray-400 uppercase">Total Score</span>
               <span className="font-bold text-gray-900">{report.score}/100</span>
             </div>
          </div>
        </div>
      </div>

      {/* Historical Question Review (Read Only) */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-900">Question Log</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {(report.questions && report.questions.length) ? (
            report.questions.map((q, i) => (
              <div key={i} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase">Q{i+1} • {q.topic}</span>
                  <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                    {q.userAnswer === q.correct ? <><CheckCircle2 size={14}/> Correct</> : <span className="text-xs font-bold text-red-500">Incorrect</span>}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900 mb-2">{q.question}</p>
                <div className="text-xs text-gray-500">Correct Answer: <span className="font-bold">{q.options[q.correct]}</span></div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-gray-400 italic">Question log not available for this attempt.</div>
          )}
        </div>
      </div>
    </div>
  );
};

// 4. SETUP
const TestSetup = ({ onConfigComplete, onBack }) => {
  const [config, setConfig] = useState({ topic: 'mixed', difficulty: 'medium', count: 20 });

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors mb-4">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <h2 className="text-2xl font-black text-gray-900 text-center">Configure Your Test</h2>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-8">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Select Topic</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TOPICS.map((t) => (
              <div 
                key={t.id}
                onClick={() => setConfig({...config, topic: t.id})}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-4 ${config.topic === t.id ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-200' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className={`p-2 rounded-lg ${config.topic === t.id ? 'bg-indigo-200 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
                  <t.icon size={20} />
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${config.topic === t.id ? 'text-indigo-900' : 'text-gray-900'}`}>{t.label}</h3>
                  <p className="text-xs text-gray-500 mt-1">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Difficulty</label>
            <div className="flex flex-col gap-2">
              {['Easy', 'Medium', 'Hard', 'Adaptive'].map(diff => (
                <label
                  key={diff}
                  onClick={() => setConfig({...config, difficulty: diff.toLowerCase()})}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${config.difficulty === diff.toLowerCase() ? 'border-indigo-600' : 'border-gray-300'}`}>
                    {config.difficulty === diff.toLowerCase() && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
                  </div>
                  <span className={`text-sm font-bold ${config.difficulty === diff.toLowerCase() ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'}`}>{diff}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Question Count</label>
            <div className="flex gap-2">
              {[10, 20, 30].map(num => (
                <button
                  key={num}
                  onClick={() => setConfig({...config, count: num})}
                  className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${config.count === num ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={() => onConfigComplete(config)}
          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex justify-center items-center gap-2"
        >
          Start Test <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

// 5. LIVE TEST
const LiveTest = ({ config, questions, onFinish }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({}); 
  const [flagged, setFlagged] = useState({});
  const qCount = (config && config.count) || (questions && questions.length) || (questions ? questions.length : 20);
  const [timeLeft, setTimeLeft] = useState(qCount * 60);

  const question = questions && questions.length ? questions[currentQ % questions.length] : null;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish(answers, questions);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [answers, onFinish, questions]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleOptionSelect = (optIndex) => {
    setAnswers({ ...answers, [currentQ]: optIndex });
  };

  const toggleFlag = () => {
    setFlagged({ ...flagged, [currentQ]: !flagged[currentQ] });
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-[480px] flex flex-col">
      <div className="flex justify-between items-center py-4 border-b border-gray-100 mb-6">
        <div>
          <h2 className="text-lg font-black text-gray-900">{config.topic === 'mixed' ? 'Mixed Aptitude' : config.topic.toUpperCase()}</h2>
          <div className="text-xs text-gray-500 font-medium">Question {currentQ + 1} of {qCount}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-mono font-bold text-gray-900 flex items-center gap-2">
            <Clock size={16} className={timeLeft < 60 ? "text-red-500 animate-pulse" : "text-gray-400"} />
            {formatTime(timeLeft)}
          </div>
          <button 
            onClick={() => onFinish(answers, questions)}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Submit
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm mb-6 flex-1 overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <span className="text-xs font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-full uppercase tracking-wider">
              {question?.topic}
            </span>
            <button 
              onClick={toggleFlag} 
              className={`p-2 rounded-full transition-colors ${flagged[currentQ] ? 'bg-orange-50 text-orange-500' : 'text-gray-300 hover:bg-gray-50'}`}
            >
              <Flag size={20} fill={flagged[currentQ] ? "currentColor" : "none"} />
            </button>
          </div>
          
          <h3 className="text-xl font-medium text-gray-900 leading-relaxed mb-8">
            {question?.question}
          </h3>

          <div className="space-y-3">
            {question?.options?.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group
                  ${answers[currentQ] === idx 
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900' 
                    : 'border-gray-100 hover:border-indigo-200 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <span className="font-medium">{opt}</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${answers[currentQ] === idx ? 'border-indigo-600' : 'border-gray-300'}`}>
                  {answers[currentQ] === idx && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center py-4">
          <button 
            disabled={currentQ === 0}
            onClick={() => setCurrentQ(prev => prev - 1)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronLeft size={20} /> Previous
          </button>
          <button 
            disabled={currentQ >= qCount - 1}
            onClick={() => setCurrentQ(prev => Math.min(prev + 1, Math.max(0, qCount - 1)))}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-gray-900 text-white hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Question <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// 6. IMMEDIATE RESULTS (Restored Detailed Review)
const TestResults = ({ answers = {}, questions = [], onRetry, onDashboard }) => {
  const total = questions.length;
  const correctCount = questions.reduce((acc, q, i) => acc + ((answers[i] === q.correct) ? 1 : 0), 0);
  const answeredCount = questions.reduce((acc, q, i) => acc + ((answers[i] === undefined) ? 0 : 1), 0);
  const wrongCount = answeredCount - correctCount;
  const skippedCount = total - answeredCount;

  const perCorrect = total > 0 ? (100 / total) : 0; // will be 10,5,3.333...
  const rawScore = correctCount * perCorrect;
  const score = Math.min(100, Number(rawScore.toFixed(2)));

  const data = [
    { name: 'Correct', value: correctCount, color: '#4f46e5' },
    { name: 'Wrong', value: wrongCount, color: '#ef4444' },
    { name: 'Skipped', value: skippedCount, color: '#e5e7eb' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-700">
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-gray-900 mb-2">Assessment Complete</h2>
        <p className="text-gray-500">Here is how you performed on this aptitude session.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center shadow-sm">
          <div className="relative w-32 h-32 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} innerRadius={35} outerRadius={50} dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center font-black text-xl text-gray-900">
              {score}%
            </div>
          </div>
          <div className="text-sm font-bold text-gray-900">Accuracy Score</div>
        </div>

        <div className="md:col-span-2 bg-indigo-50 border border-indigo-100 rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-4">
            <Brain size={20} className="text-indigo-600" />
            <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-widest">AI Intelligence Insight</h3>
          </div>
          <p className="text-lg text-gray-800 font-medium leading-relaxed mb-4">
            "You showed excellent grasp of <span className="text-indigo-600 font-bold">Logical Reasoning</span>, identifying patterns quickly. However, your time-per-question spiked on <span className="text-red-500 font-bold">Quantitative</span> algebra problems."
          </p>
          <div className="flex gap-4">
            <div className="bg-white px-3 py-1 rounded text-xs font-bold text-gray-600 border border-indigo-100">Strong: Series Completion</div>
            <div className="bg-white px-3 py-1 rounded text-xs font-bold text-gray-600 border border-indigo-100">Weak: Quadratic Eq</div>
          </div>
        </div>
      </div>

      {/* --- DETAILED REVIEW SECTION (Restored) --- */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-900">Detailed Question Review</h3>
          <div className="flex gap-4 text-xs font-bold text-gray-500">
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-indigo-600 rounded-full"></div> Correct</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Incorrect</span>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {questions && questions.map((q, i) => {
            const userAnsIndex = answers[i];
            const isCorrect = userAnsIndex === q.correct;
            const isSkipped = userAnsIndex === undefined;
            
            return (
              <div key={i} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase">Q{i+1} • {q.topic}</span>
                  {isSkipped ? (
                     <span className="text-xs font-bold text-gray-400">Skipped</span>
                  ) : isCorrect ? (
                    <span className="text-xs font-bold text-indigo-600 flex items-center gap-1"><CheckCircle2 size={14}/> Correct</span>
                  ) : (
                    <span className="text-xs font-bold text-red-500 flex items-center gap-1"><X size={14}/> Incorrect</span>
                  )}
                </div>
                
                <p className="text-sm font-medium text-gray-900 mb-3">{q.question}</p>
                
                {/* Options Display for Review */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {q.options.map((opt, idx) => (
                    <div key={idx} className={`text-xs p-2 rounded border ${
                      idx === q.correct 
                        ? 'bg-green-50 border-green-200 text-green-700 font-bold' 
                        : idx === userAnsIndex 
                          ? 'bg-red-50 border-red-200 text-red-700' 
                          : 'bg-white border-gray-100 text-gray-500'
                    }`}>
                      {opt} {idx === q.correct && <Check size={12} className="inline ml-1"/>}
                    </div>
                  ))}
                </div>

                {/* Explanation Box */}
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs text-gray-600 leading-relaxed">
                  <span className="font-bold text-gray-900">Explanation:</span> {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* --- END DETAILED REVIEW --- */}

      <div className="flex justify-center gap-4 py-8">
        <button 
          onClick={onDashboard}
          className="px-6 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
        >
          Return to Dashboard
        </button>
        <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <Target size={18} /> Practice Weak Topics
        </button>
      </div>
    </div>
  );
};

// --- MAIN CONTROLLER ---

const AptitudeModule = () => {
  const [view, setView] = useState('dashboard'); // dashboard, setup, test, results, history, report
  const [config, setConfig] = useState(null);
  const [results, setResults] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [pastAttempts, setPastAttempts] = useState([]);

  // compute average accuracy from past attempts (rounded integer percent)
  const avgAccuracy = (pastAttempts && pastAttempts.length)
    ? Math.round(pastAttempts.reduce((acc, a) => acc + (a.accuracy || 0), 0) / pastAttempts.length)
    : 0;

  // determine strongest topic by highest average accuracy per topic
  const strongestTopic = (() => {
    if (!pastAttempts || !pastAttempts.length) return 'Logic';
    const map = {};
    pastAttempts.forEach(a => {
      const raw = (a.topic || 'Unknown').toString();
      const key = raw.toLowerCase();
      if (!map[key]) map[key] = { label: raw, sum: 0, count: 0 };
      map[key].sum += (typeof a.accuracy === 'number' ? a.accuracy : (typeof a.score === 'number' ? a.score : 0));
      map[key].count += 1;
    });
    let best = null;
    Object.keys(map).forEach(k => {
      const avg = map[k].sum / map[k].count;
      if (!best || avg > best.avg) best = { key: k, avg, label: map[k].label };
    });
    return best ? best.label : 'Logic';
  })();

  const getUserKey = () => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) return 'anonymous';
      const u = JSON.parse(raw);
      return u && (u._id || u.id || u.email) ? (u._id || u.id || u.email) : 'anonymous';
    } catch (e) { return 'anonymous'; }
  };

  const loadAttempts = () => {
    try {
      const key = getUserKey();
      const raw = localStorage.getItem('quizAttempts') || '{}';
      const map = JSON.parse(raw);
      const list = map[key] || [];
      setPastAttempts(list);
    } catch (e) { setPastAttempts([]); }
  };

  useEffect(() => {
    loadAttempts();
    // also refresh when storage changes in other tabs
    const handler = (e) => { if (e?.key === 'quizAttempts' || e?.key === 'user') loadAttempts(); };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setView('report');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans p-8">
      {view === 'dashboard' && (
        <Dashboard 
          onStart={() => setView('setup')} 
          onViewHistory={() => { loadAttempts(); setView('history'); }} 
          testsTaken={pastAttempts.length}
            avgAccuracy={avgAccuracy}
            strongestTopic={strongestTopic}
        />
      )}
      
      {view === 'history' && (
        <AttemptHistory 
          onBack={() => setView('dashboard')} 
          onViewReport={handleViewReport}
          attempts={pastAttempts}
        />
      )}

      {view === 'report' && (
        <HistoricalReport 
          report={selectedReport} 
          onBack={() => setView('history')}
        />
      )}

      {view === 'setup' && (
        <TestSetup 
          onConfigComplete={(cfg) => {
            // generate questions based on cfg
            const qset = generateQuestions(cfg);
            setConfig(cfg);
            setQuestions(qset);
            setView('test');
          }} 
          onBack={() => setView('dashboard')}
        />
      )}

      {view === 'test' && (
        <LiveTest 
          config={config} 
          questions={questions}
          onFinish={async (answers, qlist) => {
            const qlistFinal = qlist || questions || [];
            setResults(answers);
            setQuestions(qlistFinal);
            // compute score same as TestResults
            const total = qlistFinal.length;
            const correctCount = qlistFinal.reduce((acc, q, i) => acc + ((answers[i] === q.correct) ? 1 : 0), 0);
            const answeredCount = Object.values(answers || {}).filter(v => v !== undefined && v !== null).length;
            const perCorrect = total > 0 ? (100 / total) : 0;
            const rawScore = correctCount * perCorrect;
            const aptitudeScore = Math.min(100, Number(rawScore.toFixed(2)));

            // try to send to backend if token present; regardless, persist locally and notify UI
            try {
              const token = localStorage.getItem('token');
              if (token) {
                try {
                  await fetch('http://localhost:5000/api/user/scores', {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ aptitudeScore })
                  });
                } catch (err) {
                  console.warn('Failed to persist score to server', err);
                }
              }
            } catch (e) {
              console.warn('Error checking token or persisting score', e);
            }

            // notify UI listeners and persist locally so timeline and other components update even when offline
            try { window.dispatchEvent(new CustomEvent('aptitudeScoreUpdated', { detail: { aptitudeScore } })); } catch(e){}
            try { console.log('Quiz: dispatched aptitudeScore', aptitudeScore); } catch(e) {}
            toast.success('Score saved');
            // update local user cache
            try {
              const user = JSON.parse(localStorage.getItem('user') || '{}');
              user.aptitudeScore = aptitudeScore;
              localStorage.setItem('user', JSON.stringify(user));
            } catch (e) {}
            try { localStorage.setItem('aptitudeScore', String(aptitudeScore)); } catch (e) {}

            // Persist attempt per-user (local fallback)
            try {
              const token = localStorage.getItem('token');
              const userKey = getUserKey();
              const now = new Date();
              const attempt = {
                id: Date.now(),
                date: now.toLocaleDateString(),
                time: now.toLocaleTimeString(),
                topic: (config && config.topic) || 'mixed',
                score: aptitudeScore,
                total: total,
                attempted: answeredCount,
                accuracy: Math.round(aptitudeScore),
                duration: 'N/A',
                passed: correctCount,
                failed: Math.max(0, answeredCount - correctCount),
              };

              // store by userKey in quizAttempts map
              const raw = localStorage.getItem('quizAttempts') || '{}';
              const map = JSON.parse(raw);
              // include question log and user answers for review
              try {
                const questionsForReport = (qlistFinal || []).map((q, idx) => ({
                  question: q.question,
                  options: q.options,
                  correct: q.correct,
                  userAnswer: typeof answers[idx] !== 'undefined' ? answers[idx] : null,
                  topic: q.topic || null,
                }));
                attempt.questions = questionsForReport;
              } catch (e) {
                attempt.questions = [];
              }

              map[userKey] = map[userKey] || [];
              map[userKey].unshift(attempt);
              localStorage.setItem('quizAttempts', JSON.stringify(map));
              // update local state so history view is current
              setPastAttempts(map[userKey]);

              // optionally notify other windows
              try { window.dispatchEvent(new CustomEvent('quizAttemptsUpdated', { detail: { userKey, attempt } })); } catch (e) {}
            } catch (e) { console.warn('Failed to persist attempt', e); }

            setView('results');
              try { window.dispatchEvent(new CustomEvent('aptitudeComplete')); } catch (e) {}
          }}
        />
      )}

      {view === 'results' && (
        <TestResults 
          answers={results} 
          questions={questions}
          onRetry={() => setView('setup')} 
          onDashboard={() => setView('dashboard')} 
        />
      )}
    </div>
  );
};

// Helper: generate question set from normalizedData
function generateQuestions(cfg) {
  const topicMap = {
    quant: 'Quantitative Aptitude',
    logic: 'Logical Reasoning',
    verbal: 'Verbal Ability',
    mixed: 'mixed'
  };

  const desiredTopic = topicMap[cfg.topic] || 'mixed';
  const desiredDifficulty = (cfg.difficulty || 'medium').toLowerCase();

  let pool = normalizedData.slice();

  if (desiredTopic !== 'mixed') {
    pool = pool.filter(q => q.topic && q.topic.toLowerCase().includes(desiredTopic.split(' ')[0].toLowerCase()));
  }

  if (desiredDifficulty !== 'adaptive') {
    pool = pool.filter(q => (q.difficulty || 'medium').toLowerCase() === desiredDifficulty);
  }

  // shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, cfg.count || 20);
}

export default AptitudeModule;