import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import './gd-eval.css';
import { useNavigate } from 'react-router-dom';

function GD({ mockMode = false }) {
  const [activeStage, setActiveStage] = useState({ name: "Active Speaker", avatar: "graphic_eq" });
  const [participants, setParticipants] = useState({
    "Alex": false, "Lisa": false, "YOU": false, "John": false, "Emma": false
  });
  const [micStatus, setMicStatus] = useState("mic_off"); 
  const [topic, setTopic] = useState("Waiting to start...");
  const [transcript, setTranscript] = useState([{ speaker: "System", text: "Welcome. Click Play to start.", type: "ai" }]);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [showConclude, setShowConclude] = useState(false);
  
  // --- NEW STATE FOR SIDEBAR TOGGLE ---
  // Initialize: Open on Desktop (>768px), Closed on Mobile
  const navigate = useNavigate();

const [showTranscript, setShowTranscript] = useState(mockMode ? false : (window.innerWidth > 768));

  const chatEndRef = useRef(null);
  const lastGdScoreRef = useRef(null);

  // ON LOAD: Force backend to stop any lingering sessions
  useEffect(() => {
    const resetBackend = async () => {
      try {
        await fetch('http://127.0.0.1:5010/stop', { method: 'POST' });
      } catch (e) {
        console.log("Backend not ready yet");
      }
    };
    resetBackend();
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const end = new Date(now.getTime() + 30 * 60000);
      const opts = { hour: 'numeric', minute: '2-digit', hour12: true };
      setCurrentTime(`${now.toLocaleTimeString([], opts)} - ${end.toLocaleTimeString([], opts)}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  useEffect(() => {
    let intervalId;
    if (isSessionActive) {
      intervalId = setInterval(async () => {
        try {
          const res = await fetch('http://127.0.0.1:5010/get_updates');
          const events = await res.json();
          events.forEach(handleEvent);
        } catch (e) {
          console.error("Connection error", e);
        }
      }, 500);
    }
    return () => clearInterval(intervalId);
  }, [isSessionActive]);

  const handleEvent = async (ev) => {
    switch (ev.type) {
      case "init":
        setTopic(ev.extra.topic);
        addTranscript("System", `Topic: ${ev.extra.topic}`, "ai");
        setShowConclude(false);
        break;
      case "enable_conclude":
        setShowConclude(true);
        addTranscript("System", "First round complete. You can now conclude.", "ai");
        break;
      case "speak_start":
        highlightSpeaker(ev.speaker, true);
        updateStage(ev.speaker, true);
        addTranscript(ev.speaker, ev.text, "ai");
        break;
      case "speak_end":
        highlightSpeaker(ev.speaker, false);
        updateStage("System", false);
        break;
      case "mic_start":
        highlightSpeaker("YOU", true);
        updateStage("YOU", true);
        setMicStatus("active");
        break;
      case "mic_processing":
        setMicStatus("processing");
        break;
      case "mic_end":
        highlightSpeaker("YOU", false);
        updateStage("System", false);
        setMicStatus("mic_off");
        break;
      case "human_speech":
        addTranscript(ev.speaker, ev.text, "human");
        break;
      case "evaluation":
        {
          let html = ev.extra.html_content || "";
          // If running in browser, decode entities first so we can strip wrappers reliably
          if (typeof window !== 'undefined') {
            try {
              const ta = document.createElement('textarea');
              ta.innerHTML = html;
              html = ta.value;
            } catch (e) {
              // ignore
            }
          }

          // Remove common code-fence patterns and any surrounding <pre><code> tags
          // 1) Remove any occurrences of ```lang or ```
          html = html.replace(/```[a-zA-Z0-9_-]*\s*/g, '');
          // 2) Remove <pre><code> wrappers that may surround the content
          html = html.replace(/^\s*<pre[^>]*>\s*<code[^>]*>/i, '').replace(/<\/code>\s*<\/pre>\s*$/i, '');
          // 3) Trim leftover leading/trailing whitespace/newlines
          html = html.trim();

          setEvaluation(html);
          // Try to extract a numeric overall score (e.g. "45/100" or "45 / 100")
          try {
            const m = html.match(/(\d{1,3})\s*\/\s*100/);
            if (m && m[1]) {
              const score = Number(m[1]);
                if (!Number.isNaN(score)) {
                // persist to backend (same pattern as other modules)
                try {
                  const token = localStorage.getItem('token');
                  const body = { gdScore: score };
                  const headers = { 'Content-Type': 'application/json' };
                  if (token) headers['Authorization'] = `Bearer ${token}`;
                  try {
                    const resp = await fetch('http://localhost:5000/api/user/scores', {
                      method: 'PUT',
                      headers,
                      body: JSON.stringify(body)
                    });
                    if (!resp.ok) {
                      const txt = await resp.text().catch(() => '');
                      console.error('Failed to save gdScore', resp.status, txt);
                    } else {
                      // notify current tab components about new gdScore
                      try { window.dispatchEvent(new CustomEvent('gdScoreUpdated', { detail: { gdScore: score } })); } catch (e) {}
                    }
                  } catch (e) {
                    console.error('gdScore save error', e);
                  }
                } catch (e) {}
                  // store locally so embedding pages can read the score
                  try {
                    lastGdScoreRef.current = score;
                    try {
                      if (mockMode) {
                        const pct = Math.round(score) + '%';
                        try { localStorage.setItem('gdCompanySim', pct); } catch (e) {}
                        try { window.dispatchEvent(new CustomEvent('gdCompanySimUpdated', { detail: { gdCompanySim: pct } })); } catch (e) {}
                      } else {
                        try { localStorage.setItem('gdScore', String(score)); } catch (e) {}
                        try { window.dispatchEvent(new CustomEvent('gdScoreUpdated', { detail: { gdScore: score } })); } catch (e) {}
                      }
                    } catch (e) {}
                  } catch (e) {}
              }
            }
          } catch (e) {}

          setIsSessionActive(false);
        }
        break;
      case "finished":
        setIsSessionActive(false);
        try { if (mockMode) window.dispatchEvent(new CustomEvent('mockStepComplete', { detail: { step: 'gd', score: lastGdScoreRef.current } })); } catch (e) {}
        break;
      default: break;
    }
  };

  const startSession = async () => {
    setEvaluation(null);
    setTranscript([]);
    setShowConclude(false);
    setIsSessionActive(true);
    // On mobile, automatically open transcript when starting so user sees the topic
    if (window.innerWidth <= 768) setShowTranscript(true); 
    await fetch('http://127.0.0.1:5010/start', { method: 'POST' });
  };

  const handleConclude = async () => {
    await fetch('http://127.0.0.1:5010/conclude', { method: 'POST' });
    setShowConclude(false);
    try {
      if (mockMode) {
        try { window.dispatchEvent(new CustomEvent('mockStepComplete', { detail: { step: 'gd', score: lastGdScoreRef.current } })); } catch (e) {}
      }
    } catch (e) {}
  };

  const endSession = async () => {
    setIsSessionActive(false);
    await fetch('http://127.0.0.1:5010/stop', { method: 'POST' });
    setTopic("Session Ended");
    updateStage("System", false);
    setMicStatus("mic_off");
    setParticipants({ "Alex": false, "Lisa": false, "YOU": false, "John": false, "Emma": false });
    addTranscript("System", "Session ended by user.", "ai");
    try {
      if (mockMode) {
        try { window.dispatchEvent(new CustomEvent('mockStepComplete', { detail: { step: 'gd', score: lastGdScoreRef.current } })); } catch (e) {}
      }
    } catch (e) {}
  };

  const addTranscript = (speaker, text, type) => {
    setTranscript(prev => [...prev, { speaker, text, type }]);
  };

  const highlightSpeaker = (name, isActive) => {
    setParticipants(prev => ({ ...prev, [name]: isActive }));
  };

  const updateStage = (name, isActive) => {
    if (!isActive || name === "System") {
      setActiveStage({ name: "Active Speaker", avatar: "graphic_eq" });
    } else {
      const avatars = {
        "Alex": { letter: "A", color: "#4338ca", bg: "#e0e7ff" },
        "Lisa": { letter: "L", color: "#b91c1c", bg: "#fee2e2" },
        "John": { letter: "J", color: "#7e22ce", bg: "#f3e8ff" },
        "Emma": { letter: "E", color: "#c2410c", bg: "#ffedd5" },
        "YOU": { letter: "Y", color: "#15803d", bg: "#dcfce7" }
      };
      setActiveStage({ name: name, ...avatars[name] });
    }
  };

  return (
<div className="gd-app app-container">

  {/* ✅ PAGE-LEVEL HEADER */}
  <div className="gd-header">
    {!isSessionActive && !mockMode && (
      <button
        className="gd-back-btn"
        onClick={async () => {
          try {
            await fetch('http://127.0.0.1:5010/stop', { method: 'POST' });
          } catch (e) {}
          navigate(-1);
        }}
      >
        <span className="material-symbols-outlined">arrow_back</span>
        <span>Back</span>
      </button>
    )}
  </div>

  {/* ✅ MAIN CONTENT */}
  <div className="main-stage">
    <div className="spotlight-area">
          <div className={`tile spotlight-tile ${activeStage.name !== "Active Speaker" ? "speaking" : ""}`}>
            <div className="avatar-large" style={{ 
              backgroundColor: activeStage.bg || "#ddd", 
              color: activeStage.color || "#666" 
            }}>
              {activeStage.avatar === "graphic_eq" ? (
                <span className="material-symbols-outlined" style={{ fontSize: "40px" }}>graphic_eq</span>
              ) : activeStage.letter}
            </div>
            <div className="participant-name">{activeStage.name}</div>
            <div className="audio-visualizer" style={{ opacity: activeStage.name !== "Active Speaker" ? 1 : 0 }}>
              <span className="bar"></span><span className="bar"></span><span className="bar"></span>
            </div>
          </div>
        </div>

        <div className="participants-grid">
          <BotTile name="Alex" letter="A" color="#4338ca" bg="#e0e7ff" speaking={participants["Alex"]} />
          <BotTile name="Lisa" letter="L" color="#b91c1c" bg="#fee2e2" speaking={participants["Lisa"]} />
          
          <div className={`tile human-tile ${participants["YOU"] ? "speaking" : ""}`}>
            <div className="avatar" style={{ background: "#dcfce7", color: "#15803d" }}>Y</div>
            <div className="participant-name">YOU</div>
            <div className="mic-status material-symbols-outlined" 
                 style={{ color: micStatus === "active" ? "#ef4444" : "#666" }}>
                 {micStatus === "processing" ? "hourglass_empty" : (micStatus === "active" ? "mic" : "mic_off")}
            </div>
          </div>

          <BotTile name="John" letter="J" color="#7e22ce" bg="#f3e8ff" speaking={participants["John"]} />
          <BotTile name="Emma" letter="E" color="#c2410c" bg="#ffedd5" speaking={participants["Emma"]} />
        </div>

        <div className="control-bar">
          <div className="meeting-info">
            <h4>GROUP DISCUSSION</h4>
            <span>{currentTime}</span>
            <div className="topic-sub">{topic}</div>
          </div>
          <div className="controls-center">
            <button className={`icon-btn ${isSessionActive ? "active" : ""}`} onClick={startSession} disabled={isSessionActive}>
              <span className="material-symbols-outlined">play_arrow</span>
            </button>
            
            {showConclude && (
               <button className="icon-btn conclude-btn" onClick={handleConclude} title="Conclude Discussion">
                  <span className="material-symbols-outlined">gavel</span>
               </button>
            )}

            <button className="icon-btn end-call" onClick={endSession}>
              <span className="material-symbols-outlined">call_end</span>
            </button>

            {/* --- MOVED CHAT BUTTON HERE FOR MOBILE VISIBILITY --- */}
            <button 
              className={`icon-btn chat-btn ${showTranscript ? "active" : ""}`} 
              onClick={() => setShowTranscript(!showTranscript)}
            >
              <span className="material-symbols-outlined">chat_bubble</span>
            </button>
          </div>
        </div>
        {evaluation && (
          <div className="eval-overlay" role="dialog" aria-modal="true">
            <div className="eval-card">
              <h2>Performance Report</h2>
              <div className="eval-content" dangerouslySetInnerHTML={{ __html: evaluation }} />
              <div className="eval-actions">
                <button className="close-btn" onClick={() => setEvaluation(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SIDE (Sidebar) - Toggle Class based on State */}
      <div className={`sidebar ${showTranscript ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <span className="material-symbols-outlined" style={{ color: "#6366f1" }}>auto_awesome</span>
          <h3>Live Transcript</h3>
          {/* Close button for Mobile */}
          <button className="mobile-close-btn" onClick={() => setShowTranscript(false)}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="chat-log">
          {transcript.map((msg, i) => (
            <div key={i} className={`chat-msg ${msg.type === "human" ? "human-msg" : "ai-msg"}`}>
              <div className="msg-header">
                <span className="sender">{msg.speaker}</span>
              </div>
              <div className="msg-content">{msg.text}</div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        
        {evaluation && (
          <div className="eval-overlay">
            <div className="eval-card">
              <h2>Performance Report</h2>
              <div dangerouslySetInnerHTML={{ __html: evaluation }} />
              <button className="close-btn" onClick={() => setEvaluation(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const BotTile = ({ name, letter, color, bg, speaking }) => (
  <div className={`tile ${speaking ? "speaking" : ""}`}>
    <div className="avatar" style={{ background: bg, color: color }}>{letter}</div>
    <div className="participant-name">{name}</div>
  </div>
);

export default GD;