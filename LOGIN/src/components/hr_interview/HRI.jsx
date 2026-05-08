import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, 
  User, Activity, ChevronRight, AlertCircle,
  Brain, Heart, Eye, Smile, Zap, MessageCircle, Volume2, ArrowLeft
} from 'lucide-react';
// Recharts removed since report/analytics views removed
import Report from './report.jsx';

// --- CONFIG ---
const API_URL = "http://127.0.0.1:5006";

// --- MOCK DATA ---
const MOCK_CONFIDENCE = [
  { time: '0m', val: 85 }, { time: '1m', val: 82 }, 
  { time: '2m', val: 70 }, { time: '3m', val: 75 }, 
  { time: '4m', val: 88 },
];

const DETAILED_STATS = [
  { label: "Eye Contact", value: "82%", status: "Good", icon: Eye },
  { label: "Smile Frequency", value: "12%", status: "Low", icon: Smile },
  { label: "Filler Words", value: "Detected", status: "Neutral", icon: MessageCircle },
  { label: "Voice Volume", value: "Optimal", status: "Good", icon: Volume2 },
];

const EMOTION_DISTRIBUTION = [
  { name: 'Confidence', value: 65, color: '#4f46e5' },
  { name: 'Nervousness', value: 25, color: '#ef4444' },
  { name: 'Neutral', value: 10, color: '#e5e7eb' },
];

// --- COMPONENTS ---

// 1. LOBBY
const InterviewLobby = ({ onStart, onDurationSelect }) => {
  const [config, setConfig] = useState({ type: 'Experienced', difficulty: 'Neutral', duration: 10 }); // Default 10 mins
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const startPreview = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Lobby Camera Error:", err);
      }
    };
    startPreview();
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleStart = async () => {
    try {
      // Pass the selected duration up to the main controller
      onDurationSelect(config.duration);

      await fetch(`${API_URL}/start`, { method: 'POST' });
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      onStart();
    } catch (error) {
      console.error("Failed to connect to backend:", error);
      alert("Please ensure the Python backend is running on port 5006");
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="text-center mb-10">
        <div className="inline-flex p-3 bg-indigo-50 rounded-full text-indigo-600 mb-4">
          <User size={32} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">HR Interview Simulation</h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Practice behavioral questions with an AI interviewer. We analyze your speech, tone, and facial expressions.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Configuration</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Interview Persona</label>
              <div className="flex gap-2">
                {['Fresher', 'Experienced', 'Leadership'].map(type => (
                  <button
                    key={type}
                    onClick={() => setConfig({...config, type})}
                    className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${config.type === type ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Duration (Minutes)</label>
              <div className="flex gap-2">
                {[5, 10, 15].map(min => (
                  <button
                    key={min}
                    onClick={() => setConfig({...config, duration: min})}
                    className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${config.duration === min ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                  >
                    {min} Mins
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-1 overflow-hidden relative flex flex-col">
          <div className="flex-1 bg-black rounded-xl m-1 flex items-center justify-center relative overflow-hidden">
              <video 
               ref={videoRef}
               autoPlay 
               playsInline 
               muted 
               className="w-full h-full object-cover" 
               style={{ transform: 'scaleX(-1)' }}
             />
             <div className="absolute bottom-4 left-4 flex items-center gap-2">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               <span className="text-xs font-bold text-white uppercase tracking-wider">System Ready</span>
             </div>
          </div>
          <div className="p-6">
            <h3 className="text-white font-bold text-lg mb-1">System Check</h3>
            <p className="text-gray-400 text-xs mb-4">Checking backend connection...</p>
            <button 
              onClick={handleStart}
              className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2"
            >
              Start Interview <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. LIVE INTERVIEW (With Countdown Timer)
const LiveInterface = ({ onEnd, duration, setQuickReport }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert minutes to seconds
  const [timerDisplay, setTimerDisplay] = useState("00:00");
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [statusText, setStatusText] = useState("Connecting...");
  const [lastTranscript, setLastTranscript] = useState("");
  const [mirrorPreview, setMirrorPreview] = useState(true);
  
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const canvasRef = useRef(null);
  const quickThrottleRef = useRef(0);

  const [expressions, setExpressions] = useState(null);
  const [faceApiLoaded, setFaceApiLoaded] = useState(false);
  const canFinishRef = useRef(false);
  const finishedHandledRef = useRef(false);

  // --- COUNTDOWN TIMER LOGIC ---
  useEffect(() => {
    // Initial display
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    setTimerDisplay(`${m}:${s}`);

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
          clearInterval(interval);
          // Auto-end when timer hits 0: stop backend then navigate to report
          (async () => {
            try {
              await handleStop();
            } catch (e) {
              console.error('Error during auto stop:', e);
            }
            try {
              onEnd && onEnd();
            } catch (e) {
              console.error('onEnd handler failed:', e);
            }
          })();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  
  const topEmotion = expressions ? Object.entries(expressions).sort((a,b) => b[1] - a[1])[0] : null;

  // Update Display whenever timeLeft changes
  useEffect(() => {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    setTimerDisplay(`${m}:${s}`);
  }, [timeLeft]);

  // --- POLLING ---
  useEffect(() => {
    // track when the live interface was mounted/started to avoid reacting
    // to stale or immediate 'finished' events emitted by the backend right
    // after a start request. We ignore 'finished' events that arrive
    // within `MIN_FINISH_AGE_MS` of mount and prevent duplicate handling.
    const MIN_FINISH_AGE_MS = 2000;
    const startedAt = Date.now();
    canFinishRef.current = false;
    finishedHandledRef.current = false;
    const allowTimer = setTimeout(() => { canFinishRef.current = true; }, MIN_FINISH_AGE_MS);
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/get_updates`);
        const events = await res.json();

        events.forEach(event => {
          if (event.type === 'init') {
            setStatusText("Interview Initialized");
          }
          else if (event.type === 'speak_start') {
            setIsSpeaking(true);
            setUserSpeaking(false);
            setStatusText("Sarah is speaking...");
            if(event.text) setLastTranscript(event.text);
          }
          else if (event.type === 'speak_end') {
            setIsSpeaking(false);
          }
          else if (event.type === 'mic_start') {
            setUserSpeaking(true);
            setIsSpeaking(false);
            setStatusText("Listening to you...");
          }
          else if (event.type === 'mic_processing') {
            setStatusText("Processing speech...");
          }
          else if (event.type === 'human_speech') {
            setLastTranscript(`You: ${event.text}`);
          }
          else if (event.type === 'error') {
            const msg = (event && event.extra && event.extra.msg) ? event.extra.msg : 'AI service unavailable. Using offline questions.';
            setStatusText(msg);
            setLastTranscript(msg);
          }
          else if (event.type === 'finished') {
            const age = Date.now() - startedAt;
            if (!canFinishRef.current || age < MIN_FINISH_AGE_MS) {
              // ignore likely-stale finished event
              console.warn('Ignoring finished event arrived too soon (age', age, 'ms)');
            } else if (finishedHandledRef.current) {
              // already handled
              console.warn('Finished event ignored because already handled');
            } else {
              finishedHandledRef.current = true;
              onEnd();
            }
          }
        });
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(allowTimer);
    };
  }, [onEnd]);

  // --- CAMERA ---
  useEffect(() => {
    const setupCam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        mediaStreamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (e) { console.error(e); }
    };
    setupCam();
    return () => {
      if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  // --- FACE-API INTEGRATION ---

  useEffect(() => {
    let detectInterval = null;
    let stopped = false;

    const loadScript = (src) => new Promise((resolve, reject) => {
      // If faceapi already present, resolve immediately
      if (window.faceapi) return resolve(src);

      // If a script tag for this src already exists, wait for it to load instead of adding another
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        if (existing.getAttribute('data-loaded') === 'true' && window.faceapi) return resolve(src);
        existing.addEventListener('load', () => {
          if (window.faceapi) return resolve(src);
          // resolve anyway so caller can handle missing global
          return resolve(src);
        });
        existing.addEventListener('error', (e) => reject(e));
        return;
      }

      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => {
        try { s.setAttribute('data-loaded', 'true'); } catch (e) {}
        // give the script a moment to initialize globals
        setTimeout(() => {
          if (window.faceapi) return resolve(src);
          // resolve anyway; caller will check window.faceapi and fallback
          resolve(src);
        }, 50);
      };
      s.onerror = (e) => reject(e);
      document.head.appendChild(s);
    });

    const initFaceApi = async () => {
      try {
        // Attempt to load face-api script from several locations, then fallback to CDN
        const scriptCandidates = [
          `${window.location.origin}/face-api.min.js`,
          '/face-api.min.js',
          '/Face-Detection-JavaScript/face-api.min.js'
        ];

        // CDN fallback (version pinned)
        const CDN = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';

        let scriptLoaded = false;
        for (const src of scriptCandidates) {
          try {
            await loadScript(src);
            if (window.faceapi) {
              console.debug('face-api available from', src);
              scriptLoaded = true;
              break;
            }
            console.warn('face-api script loaded but window.faceapi not found for', src);
          } catch (e) {
            console.warn('Failed loading face-api script from', src, e);
          }
        }

        if (!scriptLoaded) {
          try {
            await loadScript(CDN);
            if (window.faceapi) {
              console.debug('Loaded face-api from CDN');
              scriptLoaded = true;
            } else {
              console.error('CDN script loaded but window.faceapi missing');
            }
          } catch (e) {
            console.error('Failed loading face-api from CDN', e);
          }
        }

        if (!scriptLoaded) {
          throw new Error('face-api script could not be loaded from local paths or CDN');
        }

        // Try multiple possible model base paths (origin absolute then common fallbacks)
        const modelBases = [
          `${window.location.origin}/models`,
          '/models',
          '/Face-Detection-JavaScript/models'
        ];

        let loadedModels = false;
        let lastErr = null;
        for (const base of modelBases) {
          try {
            await window.faceapi.nets.tinyFaceDetector.loadFromUri(base);
            await window.faceapi.nets.faceExpressionNet.loadFromUri(base);
            await window.faceapi.nets.faceLandmark68Net.loadFromUri(base);
            console.debug('Loaded face-api models from', base);
            loadedModels = true;
            break;
          } catch (e) {
            lastErr = e;
            console.warn('Failed loading face-api models from', base, e);
          }
        }
        if (!loadedModels) {
          console.error('Could not load face-api models from any known location');
          throw lastErr;
        }

        setFaceApiLoaded(true);

        detectInterval = setInterval(async () => {
          try {
            if (stopped) return;
            if (!videoRef.current || videoRef.current.readyState < 2) return;

            const detections = await window.faceapi.detectSingleFace(videoRef.current, new window.faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
            if (detections) {
              console.debug('face-api detections:', detections);
              if (detections.expressions) setExpressions(detections.expressions);

              // Throttled quick-report object: update parent via `setQuickReport` if provided
              try {
                const now = Date.now();
                if (typeof setQuickReport === 'function' && now - quickThrottleRef.current > 600) {
                  const exprs = detections.expressions || {};
                  const entries = Object.entries(exprs).sort((a,b) => b[1] - a[1]);
                  const dominant = entries[0] || ['neutral', 0];
                  const words = (lastTranscript || '').trim().split(/\s+/).filter(Boolean).length;

                  // Compute confidence from facial expressions (range 0..10)
                  const happy = exprs.happy || 0;
                  const neutral = exprs.neutral || 0;
                  const surprised = exprs.surprised || 0;
                  const sad = exprs.sad || 0;
                  const angry = exprs.angry || 0;
                  const fearful = exprs.fearful || 0;
                  const disgusted = exprs.disgusted || 0;

                  let positive = happy + neutral + surprised * 0.5;
                  let negative = angry + fearful + disgusted + sad * 0.5;
                  let conf_raw = positive - negative; // approx -1..1
                  conf_raw = Math.max(-1, Math.min(1, conf_raw));
                  const confidenceScore = Math.round(((conf_raw + 1) / 2) * 10); // map to 0..10
                  const confidence = Math.min(10, Math.max(1, confidenceScore));

                  // Communication: heuristic based on words captured in transcript
                  const communication = Math.min(10, Math.max(1, Math.round(words / 4)));

                  // Technical: boost if technical keywords appear in transcript
                  const techKeywords = ['project','algorithm','design','architecture','database','api','scale','performance','optimize','cloud','react','node','python','java','c++','sql'];
                  const lc = (lastTranscript || '').toLowerCase();
                  const matches = techKeywords.reduce((acc, k) => acc + (lc.includes(k) ? 1 : 0), 0);
                  const technical = Math.min(10, Math.max(1, 5 + matches));

                  // Overall: average of three metrics, scaled to 0..100
                  const overall = Math.round(((confidence + communication + technical) / 3) * 10);

                  setQuickReport({ overall, confidence, communication, technical, dominant, transcript: lastTranscript || '', expressions: exprs });
                  quickThrottleRef.current = now;
                }
              } catch (e) {
                // non-fatal
              }

              // ensure video dimensions are available
              const vidW = videoRef.current.videoWidth || videoRef.current.clientWidth;
              const vidH = videoRef.current.videoHeight || videoRef.current.clientHeight;
              if (!vidW || !vidH) return;

              // ensure canvas exists and is sized to video (account for devicePixelRatio)
              let canvas = canvasRef.current;
              if (!canvas) {
                if (window.faceapi && window.faceapi.createCanvasFromMedia) {
                  canvas = window.faceapi.createCanvasFromMedia(videoRef.current);
                } else {
                  canvas = document.createElement('canvas');
                }
                canvasRef.current = canvas;
                const parent = videoRef.current.parentNode;
                parent.appendChild(canvas);
                canvas.style.position = 'absolute';
                canvas.style.top = '0';
                canvas.style.left = '0';
                canvas.style.pointerEvents = 'none';
                canvas.style.zIndex = '25';
                console.debug('face-api canvas created', canvas);
              }

              // size canvas to match the video's displayed size (bounding rect)
              const rect = videoRef.current.getBoundingClientRect();
              const displaySize = { width: rect.width, height: rect.height };
              const ratio = window.devicePixelRatio || 1;
              canvas.width = Math.round(displaySize.width * ratio);
              canvas.height = Math.round(displaySize.height * ratio);
              canvas.style.width = `${displaySize.width}px`;
              canvas.style.height = `${displaySize.height}px`;

              // apply mirror transform to canvas based on the preview toggle so overlays match the video
              try {
                // Do not flip the canvas with CSS. We'll mirror drawing coordinates
                // when `mirrorPreview` is true so text stays readable.
                canvas.style.transform = '';
                canvas.style.transformOrigin = 'center center';
              } catch (e) {
                canvas.style.transform = '';
                canvas.style.transformOrigin = 'center center';
              }

              const ctx = canvas.getContext('2d');
              ctx.setTransform(1, 0, 0, 1, 0, 0);
              ctx.scale(ratio, ratio);
              ctx.clearRect(0, 0, canvas.width, canvas.height);

              window.faceapi.matchDimensions(canvas, displaySize);
              const resized = window.faceapi.resizeResults(detections, displaySize);

              // Custom drawing: extract numeric box and landmark coords (handles
              // different internal property names like _x/_y) and draw them. If
              // preview is mirrored, flip the X coordinates before drawing so
              // overlays align with the mirrored video while keeping text readable.
              const getVal = (o, ...keys) => {
                for (const k of keys) {
                  if (o == null) continue;
                  if (o[k] !== undefined) return o[k];
                }
                return undefined;
              };

              const getBox = (r) => {
                const candidate = getVal(r, 'alignedRect') || getVal(r, 'detection') || r;
                const boxObj = getVal(candidate, 'box', '_box') || getVal(getVal(r, 'detection'), '_box');
                if (!boxObj) return null;
                const x = getVal(boxObj, 'x', '_x', 'left');
                const y = getVal(boxObj, 'y', '_y', 'top');
                const width = getVal(boxObj, 'width', '_width');
                const height = getVal(boxObj, 'height', '_height');
                if ([x, y, width, height].some(v => v === undefined)) return null;
                return { x: Number(x), y: Number(y), width: Number(width), height: Number(height) };
              };

              const getLandmarks = (r) => {
                const lm = getVal(r, 'landmarks') || getVal(r, 'unshiftedLandmarks') || getVal(r, 'alignedRect');
                const positions = getVal(lm, 'positions') || getVal(lm, '_positions') || getVal(lm, '_shiftedPositions') || [];
                return positions.map(p => ({ x: Number(getVal(p, 'x', '_x')), y: Number(getVal(p, 'y', '_y')) }));
              };

              const drawExpressionLabel = (ctx2, text, x, y) => {
                ctx2.font = '12px sans-serif';
                const padding = 6;
                const metrics = ctx2.measureText(text);
                const w = metrics.width + padding;
                const h = 18;
                ctx2.fillStyle = 'rgba(0,0,0,0.6)';
                ctx2.fillRect(x, y - h, w, h);
                ctx2.fillStyle = '#fff';
                ctx2.fillText(text, x + padding/2, y - 5);
              };

              // support both single detection or array
              const results = Array.isArray(resized) ? resized : [resized];
              results.forEach(r => {
                const box = getBox(r);
                const landmarks = getLandmarks(r);

                if (box) {
                  let bx = box.x, by = box.y, bw = box.width, bh = box.height;
                  if (mirrorPreview) bx = Math.round(displaySize.width - (bx + bw));
                  ctx.strokeStyle = '#2563eb';
                  ctx.lineWidth = 2;
                  ctx.strokeRect(bx, by, bw, bh);
                }

                // Landmark dots removed per user request.

                // Draw top expression if available
                const exprs = getVal(r, 'expressions') || getVal(r, 'expressions') || {};
                if (exprs && Object.keys(exprs).length) {
                  const entries = Object.entries(exprs).sort((a,b) => b[1] - a[1]);
                  const top = entries[0];
                  if (top && box) {
                    const label = `${top[0]} ${Math.round(top[1]*100)}%`;
                    let lx = box.x, ly = box.y;
                    if (mirrorPreview) lx = Math.round(displaySize.width - (lx + box.width));
                    drawExpressionLabel(ctx, label, lx, ly);
                  }
                }
              });
            } else {
              setExpressions(null);
              if (canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
              }
            }
          } catch (e) {
            // non-fatal
            // console.debug('face-api detect error', e);
          }
        }, 400);
      } catch (e) {
        console.error('Face API init failed:', e);
      }
    };

    initFaceApi();

    return () => {
      stopped = true;
      if (detectInterval) clearInterval(detectInterval);
    };
  }, []);

  const handleStop = async () => {
    try {
      // Stop the interview backend
      await fetch(`${API_URL}/stop`, { method: 'POST' });
      // Do not request the report here; simply signal end of live session.
      try { window.dispatchEvent(new CustomEvent('hrComplete')); } catch (e) {}
      // mark finished handled so we don't double-navigate
      try { finishedHandledRef.current = true; } catch (e) {}
      onEnd && onEnd();
    } catch (e) {
      console.error('Stop error:', e);
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      <div className="flex justify-between items-center py-4 border-b border-gray-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">Live Session</span>
        </div>
        <div className="flex items-center gap-4">
          <div className={`font-mono text-xl font-bold ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-indigo-600'}`}>
            {timerDisplay}
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className={`rounded-2xl border transition-colors duration-500 relative overflow-hidden shadow-inner ${isSpeaking ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-200'}`}>
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pb-20">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${isSpeaking ? 'bg-indigo-100 ring-8 ring-indigo-50 scale-110' : 'bg-gray-200'}`}>
              <User size={64} className="text-gray-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Sarah (HR Manager)</h3>
            <p className="text-sm font-bold mt-2 text-indigo-600 min-h-[24px]">{statusText}</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex justify-center">
            <div className="p-4 bg-white/60 rounded-xl text-sm text-gray-700 italic border border-gray-100 max-w-md w-full text-center shadow-sm backdrop-blur-sm min-h-[60px] flex items-center justify-center">
               "{lastTranscript || "..."}"
            </div>
          </div>
          {isSpeaking && (
            <div className="absolute bottom-0 left-0 right-0 h-32 flex justify-center items-end gap-1 pb-8 opacity-20 z-0">
              {[...Array(20)].map((_,i) => (
                <div key={i} className="w-2 bg-indigo-600 animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 0.5 + 0.2}s` }}></div>
              ))}
            </div>
          )}
        </div>

        <div className={`rounded-2xl overflow-hidden relative flex items-center justify-center border-4 transition-colors ${userSpeaking ? 'border-green-400' : 'border-transparent'}`}>
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
             <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" style={{ transform: mirrorPreview ? 'scaleX(-1)' : 'scaleX(1)' }} />
             {topEmotion && (
               <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-lg flex items-center gap-2 z-30">
                 <span className="text-[10px] font-bold uppercase">{topEmotion[0]}</span>
                 <span className="text-xs font-black">{Math.round(topEmotion[1]*100)}%</span>
               </div>
             )}
          </div>
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 flex items-center gap-2">
            <Activity size={14} className="text-green-400" />
            <span className="text-[10px] font-bold text-white uppercase">Backend Active</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center gap-6">
        <button 
          onClick={handleStop}
          className="px-8 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 shadow-lg shadow-red-100 transition-all flex items-center gap-2"
        >
          <PhoneOff size={20} /> End Interview
        </button>
      </div>
    </div>
  );
};

// Report and analytics views removed per user request.

// --- MAIN CONTROLLER (Router-based) ---

const HRInterviewModuleInner = ({ embedded = false }) => {
  const navigate = useNavigate();
  const [selectedDuration, setSelectedDuration] = useState(5); // Default 5 mins
  const [quickReport, setQuickReport] = useState(null);
  // Local view when embedded: 'lobby' | 'live' | 'report'
  const [localView, setLocalView] = useState('lobby');

  useEffect(() => {
    // keep minimal for non-embedded routing
  }, []);

  const handleStart = () => {
    // clear any previous quick report and enter live view
    setQuickReport(null);
    if (embedded) {
      setLocalView('live');
    } else {
      // navigate to the live route (single 'live' segment)
      navigate('/hr-interview/live');
    }
  };

  const handleLiveEnd = () => {
    if (embedded) {
      // When embedded in CompanySimulation, show the report view inside
      // the embedded container and persist a summary score to localStorage
      try {
        const score = (quickReport && typeof quickReport.overall !== 'undefined') ? Number(quickReport.overall) : null;
        if (score !== null && !Number.isNaN(score)) {
          try { localStorage.setItem('hrScore', String(score)); } catch (e) {}
          try { localStorage.setItem('hrCompanySim', Math.round(score) + '%'); } catch (e) {}
          try { window.dispatchEvent(new CustomEvent('hrCompanySimUpdated', { detail: { hrCompanySim: Math.round(score) + '%' } })); } catch (e) {}
        }
        try { window.dispatchEvent(new CustomEvent('hrComplete', { detail: { score } })); } catch (e) {}
      } catch (e) {}
      setLocalView('report');
    } else {
      navigate('/hr-interview/report');
    }
  };

  const handleRestart = () => {
    setQuickReport(null);
    setSelectedDuration(5);
    if (embedded) {
      setLocalView('lobby');
    } else {
      navigate('/');
    }
  };

  // When embedded, render a simple local view switch to avoid changing app URL
  if (embedded) {
    return (
      <div className={`relative h-full bg-white text-gray-900 font-sans p-6`}>
        {localView === 'lobby' && (
          <InterviewLobby onStart={handleStart} onDurationSelect={(dur) => setSelectedDuration(dur)} />
        )}
        {localView === 'live' && (
          <LiveInterface onEnd={handleLiveEnd} duration={selectedDuration} setQuickReport={setQuickReport} />
        )}
        {localView === 'report' && (
          <div className="h-full">
            <Report quick={quickReport} onRestart={handleRestart} onBack={() => setLocalView('lobby')} />
          </div>
        )}
      </div>
    );
  }

  // Non-embedded: keep original router behaviour
  return (
    <div className={`min-h-screen bg-white text-gray-900 font-sans p-8`}>
      
      <Routes>
        <Route path="/" element={<InterviewLobby onStart={handleStart} onDurationSelect={(dur) => setSelectedDuration(dur)} />} />
        <Route path="live" element={<LiveInterface onEnd={handleLiveEnd} duration={selectedDuration} setQuickReport={setQuickReport} />} />
        <Route path="report" element={<Report quick={quickReport} onRestart={handleRestart} onBack={() => navigate('/hr-interview')} />} />
      </Routes>
    </div>
  );
};

export default HRInterviewModuleInner;
