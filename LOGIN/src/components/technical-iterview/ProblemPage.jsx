import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom"; // Added Link
import { PROBLEMS } from "./data/problems";
import { ChevronLeft, MessageCircle, X } from "lucide-react"; // Added for the back icon + chat icons

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "./components/ProblemDescription";
import OutputPanel from "./components/OutputPanel";
import CodeEditorPanel from "./components/CodeEditorPanel";
import { executeCode } from "./lib/piston";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";

const COMPLETION_KEY = "technical_interview";

function ProblemPage({ mockMode = false, embedded = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const problemIds = Object.keys(PROBLEMS);

  const [isMobile, setIsMobile] = useState(false);
  const [mobileTab, setMobileTab] = useState("description");

  const [currentProblemId, setCurrentProblemId] = useState("two-sum");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(PROBLEMS["two-sum"].starterCode.javascript);
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [solvedProblems, setSolvedProblems] = useState(new Set());
  const [showCongrats, setShowCongrats] = useState(false);
  const [attempts, setAttempts] = useState({});
  const [performanceResults, setPerformanceResults] = useState(null);

  const currentProblem = PROBLEMS[currentProblemId];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (id && PROBLEMS[id]) {
      setCurrentProblemId(id);
      setCode(PROBLEMS[id].starterCode[selectedLanguage]);
      setOutput(null);
      setIsSolved(false);
    }
  }, [id, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(currentProblem.starterCode[newLang]);
    setOutput(null);
  };

  const handleProblemChange = (newProblemId) => {
    if (embedded) {
      setCurrentProblemId(newProblemId);
      setCode(PROBLEMS[newProblemId].starterCode[selectedLanguage]);
      setOutput(null);
      setIsSolved(false);
      if (isMobile) setMobileTab("description");
    } else {
      navigate(`/problem/${newProblemId}`);
      if (isMobile) setMobileTab("description");
    }
  };

  const getNextProblemId = () => {
    const index = problemIds.indexOf(currentProblemId);
    return problemIds[index + 1] || null;
  };

  const normalizeOutput = (output) =>
    output.trim().split("\n").map(line => line.trim()).filter(Boolean).join("\n");

  const checkIfTestsPassed = (actual, expected) =>
    normalizeOutput(actual) === normalizeOutput(expected);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    if (isMobile) setMobileTab("editor");

    // increment attempt counter for this problem
    setAttempts(prev => ({ ...prev, [currentProblemId]: (prev[currentProblemId] || 0) + 1 }));

    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);

    if (result.success) {
      const expected = currentProblem.expectedOutput[selectedLanguage];
      if (checkIfTestsPassed(result.output, expected)) {
        confetti({ particleCount: 120, spread: 180 });
        setIsSolved(true);
        setSolvedProblems(prev => new Set([...prev, currentProblemId]));
        toast.success("All tests passed!");
      } else {
        toast.error("Tests failed!");
      }
    } else {
      toast.error("Execution failed!");
    }
  };

  // score mapping per request:
  // 1 -> 100, 2 -> 80, 3 -> 60, 4 -> 50, 5 -> 40, 6 -> 30, 7 -> 20, 8 -> 10, >8 -> 0
  const scoreForAttempts = (n) => {
    if (!n || n <= 0) return 0;
    const mapping = {
      1: 100,
      2: 80,
      3: 60,
      4: 50,
      5: 40,
      6: 30,
      7: 20,
      8: 10,
    };
    return mapping[n] ?? 0;
  };

  const computePerformance = () => {
    const allIds = problemIds;
    const breakdown = allIds.map(pid => {
      const att = attempts[pid] || 0;
      const sc = scoreForAttempts(att);
      const solved = solvedProblems.has(pid);
      return { id: pid, title: PROBLEMS[pid].title, attempts: att, score: solved ? sc : 0, solved };
    });
    const totalScore = breakdown.reduce((s, p) => s + p.score, 0);
    const avg = breakdown.length ? Math.round(totalScore / breakdown.length) : 0;
    return { avg, totalScore, breakdown };
  };

  const finishInterview = async () => {
    const perf = computePerformance();
    if (mockMode) {
      // In mock mode: do not show scores or persist; notify the mock flow
      try { window.dispatchEvent(new CustomEvent('mockStepComplete', { detail: { step: 'two-sum' } })); } catch (e) {}
      return;
    }

    setPerformanceResults(perf);
    setShowCongrats(true);
    confetti({ particleCount: 200, spread: 220 });

    try { window.dispatchEvent(new CustomEvent('technicalComplete')); } catch (e) {}

    // Persist technical performance locally so other UI (report) can read it even when unauthenticated
    try {
      try { localStorage.setItem('technicalScore', String(perf.avg)); } catch (e) {}
      try { localStorage.setItem('technicalPerformance', JSON.stringify(perf.breakdown)); } catch (e) {}
      try { window.dispatchEvent(new CustomEvent('technicalScoreUpdated', { detail: { score: perf.avg, breakdown: perf.breakdown } })); } catch (e) {}
    } catch (e) {}

    // Only persist and broadcast averageScore when user is authenticated
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Persist to server and only update client state after server confirms
        const res = await fetch('http://localhost:5000/api/user/scores', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ averageScore: perf.avg })
        });

        if (res.ok) {
          try {
            const json = await res.json();
            const saved = typeof json.averageScore !== 'undefined' ? Number(json.averageScore) : perf.avg;
            try { localStorage.setItem('averageScore', String(saved)); } catch (e) {}
            try { window.dispatchEvent(new CustomEvent('averageScoreUpdated', { detail: { score: saved } })); } catch (e) {}
            toast.success('Score saved');
          } catch (e) {
            // parsing failed but server returned ok — use local perf.avg
            try { localStorage.setItem('averageScore', String(perf.avg)); } catch (err) {}
            try { window.dispatchEvent(new CustomEvent('averageScoreUpdated', { detail: { score: perf.avg } })); } catch (err) {}
            toast.success('Score saved');
          }
        } else {
          toast.error('Could not save score to server.');
        }
      } else {
        // Not authenticated: do not persist or broadcast to protect privacy
        toast('Sign in to save your score');
      }
    } catch (e) {
      // network / server errors
      toast.error('Network error while saving score.');
    }
  };

  useEffect(() => {
    if (solvedProblems.size === problemIds.length && problemIds.length > 0) {
      // compute full performance when all solved
      finishInterview();
    }
  }, [solvedProblems, problemIds.length]);

  /* ----------------------------------
      COMMON HEADER (With Back Button)
  ---------------------------------- */
  const Header = () => (
    <header className="h-14 border-b bg-slate-50 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/technical-interview-main")}
          className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 font-medium transition-colors p-1 -ml-2"
        >
          <ChevronLeft size={20} />
          <span className="hidden sm:inline">Back</span>
        </button>
        <div className="h-4 w-[1px] bg-slate-300 mx-2 hidden sm:block" />
        <h1 className="text-sm font-bold text-slate-800 truncate">
          {currentProblem.title}
        </h1>
      </div>
      
      {isMobile && (
         <div className="flex bg-slate-200 p-1 rounded-lg">
            <button 
                onClick={() => setMobileTab("description")}
                className={`px-3 py-1 text-xs font-bold rounded-md transition ${mobileTab === "description" ? "bg-white shadow text-indigo-600" : "text-slate-500"}`}
            >
                Info
            </button>
            <button 
                onClick={() => setMobileTab("editor")}
                className={`px-3 py-1 text-xs font-bold rounded-md transition ${mobileTab === "editor" ? "bg-white shadow text-indigo-600" : "text-slate-500"}`}
            >
                Code
            </button>
         </div>
      )}
    </header>
  );

  /* ----------------------------------
      DESKTOP RENDER
  ---------------------------------- */
  const renderDesktop = () => (
    <PanelGroup direction="horizontal" className="flex-1">
      <Panel defaultSize={35} minSize={25} className="bg-white border-r border-slate-200 overflow-auto flex flex-col">
        <ProblemDescription
          problem={currentProblem}
          currentProblemId={currentProblemId}
        />
          <div className="p-4 border-t border-slate-200 mt-auto bg-white">
          {(() => {
            const nextId = getNextProblemId();
            const disabled = !isSolved;
            if (nextId) {
              return (
                <button
                  disabled={disabled}
                  onClick={() => handleProblemChange(nextId)}
                  className={`w-full py-2 rounded-lg font-semibold transition ${!disabled ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
                >
                  Next Question →
                </button>
              );
            }
            return (
              <button
                disabled={disabled}
                onClick={() => finishInterview()}
                className={`w-full py-2 rounded-lg font-semibold transition ${!disabled ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
              >
                Finish Interview
              </button>
            );
          })()}
        </div>
      </Panel>

      <PanelResizeHandle className="w-1 bg-slate-100 hover:bg-indigo-600 transition" />

      <Panel defaultSize={65} minSize={30}>
        <PanelGroup direction="vertical" className="h-full">
          <Panel defaultSize={70} minSize={30}>
            <CodeEditorPanel
              selectedLanguage={selectedLanguage}
              code={code}
              isRunning={isRunning}
              onLanguageChange={handleLanguageChange}
              onCodeChange={setCode}
              onRunCode={handleRunCode}
            />
          </Panel>
          <PanelResizeHandle className="h-1 bg-slate-100 hover:bg-indigo-600 transition" />
          <Panel defaultSize={30}>
            <OutputPanel output={output} />
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );

  /* ----------------------------------
      MOBILE RENDER
  ---------------------------------- */
  const renderMobile = () => (
    <div className="flex-1 overflow-hidden bg-white">
      {mobileTab === "description" ? (
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-auto">
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={Object.values(PROBLEMS)}
            />
          </div>
          <div className="p-4 border-t sticky bottom-0 bg-white">
            {(() => {
              const nextId = getNextProblemId();
              const disabled = !isSolved;
              if (nextId) {
                return (
                  <button
                    disabled={disabled}
                    onClick={() => handleProblemChange(nextId)}
                    className={`w-full py-3 rounded-lg font-semibold shadow-md ${!disabled ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-400"}`}
                  >
                    Next Question →
                  </button>
                );
              }
              return (
                <button
                  disabled={disabled}
                  onClick={() => finishInterview()}
                  className={`w-full py-3 rounded-lg font-semibold shadow-md ${!disabled ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-400"}`}
                >
                  Finish Interview
                </button>
              );
            })()}
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <div className="flex-[0.6] border-b overflow-hidden">
            <CodeEditorPanel
              selectedLanguage={selectedLanguage}
              code={code}
              isRunning={isRunning}
              onLanguageChange={handleLanguageChange}
              onCodeChange={setCode}
              onRunCode={handleRunCode}
            />
          </div>
          <div className="flex-[0.4] bg-slate-50 overflow-auto">
            <OutputPanel output={output} />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`${embedded ? 'relative h-full' : 'fixed inset-0'} bg-white text-slate-900 flex flex-col overflow-hidden`}>
      <Header />
      {isMobile ? renderMobile() : renderDesktop()}

      {/* Congrats Modal */}
      {showCongrats && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-6 text-center shadow-2xl max-w-2xl w-full animate-in zoom-in duration-300">
            <div className="flex items-center justify-center gap-4">
              <div className="text-6xl">🏆</div>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-slate-900">Interview Complete</h2>
                <p className="text-sm text-slate-500">Great job — here’s how you performed</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500">Average Score</div>
                <div className="text-3xl font-bold text-indigo-600">{performanceResults?.avg ?? 0}%</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500">Solved</div>
                <div className="text-3xl font-bold text-emerald-600">{[...solvedProblems].length}/{problemIds.length}</div>
              </div>
            </div>

            <div className="mt-6 text-left max-h-64 overflow-auto">
              <h3 className="font-bold text-sm mb-3">Per-question breakdown</h3>
              <ul className="space-y-2">
                {(performanceResults?.breakdown || []).map(item => (
                  <li key={item.id} className="flex items-center justify-between bg-white p-3 border border-slate-100 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-800">{item.title}</div>
                      <div className="text-xs text-slate-500">Attempts: {item.attempts}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${item.solved ? 'text-indigo-600' : 'text-amber-600'}`}>{item.score}%</div>
                      <div className="text-xs text-slate-400">{item.solved ? 'Solved' : 'Unsolved'}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => { setShowCongrats(false); navigate('/technical-interview-main'); }}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition"
              >
                Return to Hub
              </button>
              <button
                onClick={() => setShowCongrats(false)}
                className="w-full py-2 border border-slate-200 rounded-lg font-semibold hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Chat widget (floating) */}
      <ChatWidget currentProblem={currentProblem} code={code} />
    </div>
  );
}

function ChatWidget({ currentProblem, code }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'assistant', text: `Hello — I can guide you with hints for each question. Ask me to expand any hint for step-by-step guidance.

1) twoSum
Hint: Think of complements. Can you find a way to look up a needed value in O(1) while iterating once?

2) reverseString
Hint: Use two indices at the ends and swap inward. Do it in-place on the array.

3) isPalindrome
Hint: Use two pointers; skip non-alphanumeric characters and compare characters case-insensitively.

4) maxSubArray
Hint: Maintain a running best ending at current index and update a global best; reset when the running sum becomes worse than starting at the current element.

5) maxArea
Hint: Start with pointers at both ends. Area uses the shorter height times width; move the shorter pointer inward to try increasing height.

Ask me to "Explain question N" for a walkthrough.`, time: new Date().toLocaleTimeString() }
  ]);
  const messagesRef = useRef(null);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (open && ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  // Auto-scroll to bottom when messages change or chat opens (smooth)
  useEffect(() => {
    if (messagesRef.current) {
      try { messagesRef.current.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' }); } catch (e) {}
    }
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    const time = new Date().toLocaleTimeString();
    setMessages(prev => [...prev, { from: 'user', text, time }]);
    setInput('');
    setSending(true);
    try {
      const res = await fetch('http://localhost:8002/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      if (!res.ok) throw new Error('Chat service error');
      const json = await res.json();
      const reply = json.reply || 'No reply from chat service';
      setMessages(prev => [...prev, { from: 'assistant', text: reply, time: new Date().toLocaleTimeString() }]);
    } catch (err) {
      // fallback to local mock reply if backend unavailable
      const reply = `About "${currentProblem.title}": consider edge cases, input validation, and optimizing time/space complexity. Paste code if you'd like a review.`;
      setMessages(prev => [...prev, { from: 'assistant', text: reply, time: new Date().toLocaleTimeString() }]);
    } finally {
      setSending(false);
      setOpen(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Parse message text and convert *bold* markers into <strong> nodes, preserving line breaks and spacing
  const renderMessageText = (rawText, keyBase) => {
    if (rawText === null || typeof rawText === 'undefined') return null;
    const text = String(rawText);
    const lines = text.split('\n');
    const nodes = [];
    lines.forEach((line, li) => {
      // parse bold markers in the line
      const re = /\*(.*?)\*/g;
      let lastIndex = 0;
      let match;
      let partIndex = 0;
      while ((match = re.exec(line)) !== null) {
        if (match.index > lastIndex) {
          const plain = line.slice(lastIndex, match.index);
          nodes.push(<span key={`${keyBase}-t-${li}-${partIndex}`}>{plain}</span>);
          partIndex += 1;
        }
        nodes.push(<strong key={`${keyBase}-b-${li}-${partIndex}`}>{match[1]}</strong>);
        partIndex += 1;
        lastIndex = re.lastIndex;
      }
      if (lastIndex < line.length) {
        nodes.push(<span key={`${keyBase}-t-${li}-${partIndex}`}>{line.slice(lastIndex)}</span>);
      }
      // add a line break node except after the last line
      if (li < lines.length - 1) nodes.push(<br key={`${keyBase}-br-${li}`} />);
      // if there is an intentional blank line (consecutive newlines), the split above produces an empty string line,
      // which will render nothing; keep the <br/> which provides the spacing.
    });

    return nodes;
  };

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {open && (
        <div className="w-80 sm:w-[420px] h-[520px] bg-white border border-slate-200 rounded-xl shadow-2xl mb-3 overflow-hidden flex flex-col ring-1 ring-slate-200">
          <div className="flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="bg-indigo-50 text-indigo-700 rounded-full p-2">
                <MessageCircle size={18} />
              </div>
              <div className="leading-tight">
                <div className="font-semibold text-sm text-slate-900">Code Assistant</div>
                <div className="text-xs text-slate-500">Context-aware help for this problem</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-slate-400 mr-2">{currentProblem.title}</div>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-slate-100">
                <X size={16} />
              </button>
            </div>
          </div>
          <div ref={messagesRef} className="p-4 flex-1 overflow-auto space-y-3">
            {/** Render message text with *bold* markers converted to <strong> */}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[82%] text-sm px-4 py-3 rounded-2xl leading-relaxed ${m.from === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                  <div>{renderMessageText(m.text, `msg-${i}`)}</div>
                  <div className="text-[11px] opacity-60 mt-1 text-right">{m.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t bg-white">
            <div className="px-1 pb-2">
              <div className="flex items-center gap-2">
                <button onClick={async () => {
                  if (!code || !code.trim()) { try { toast('No code available to review'); } catch (e) {} return; }
                  const time = new Date().toLocaleTimeString();
                  setMessages(prev => [...prev, { from: 'user', text: 'Please review my code', time }]);
                  setSending(true);
                  try {
                    const res = await fetch('http://localhost:8002/review', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ code, problemTitle: currentProblem.title })
                    });
                    if (!res.ok) throw new Error('Review service error');
                    const json = await res.json();
                    const reply = json.reply || 'No reply from review service';
                    setMessages(prev => [...prev, { from: 'assistant', text: reply, time: new Date().toLocaleTimeString() }]);
                  } catch (e) {
                    setMessages(prev => [...prev, { from: 'assistant', text: 'Error contacting review service.', time: new Date().toLocaleTimeString() }]);
                  } finally {
                    setSending(false);
                    setOpen(true);
                  }
                }} className="text-xs px-3 py-1 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100">Review Code</button>
              </div>
            </div>

            <div className="flex gap-2 items-end">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                className="flex-1 resize-none max-h-28 p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Ask about the problem, paste code, or request a review..."
              />
              <button onClick={sendMessage} disabled={sending} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50">
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <button onClick={() => setOpen(v => !v)} className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg flex items-center gap-2">
        <MessageCircle size={18} />
      </button>
    </div>
  );
}

export default ProblemPage;