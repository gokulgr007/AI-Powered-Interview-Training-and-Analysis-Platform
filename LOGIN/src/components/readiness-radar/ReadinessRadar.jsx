import React, { useState } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart
} from 'recharts';
import { 
  RefreshCw, Target, TrendingUp, AlertCircle, 
  CheckCircle2, ArrowRight, Brain, Briefcase, 
  Award, Layers, ChevronDown, Check, Lock, Download
} from 'lucide-react';

// --- MOCK DATA ---

const ROLE_METRICS = {
  "Software Engineer": { skill: 92, fit: 55 },
  "Product Manager": { skill: 74, fit: 88 },
  "Data Scientist": { skill: 85, fit: 60 },
  "UX Designer": { skill: 89, fit: 70 }
};

const INITIAL_RADAR_DATA = [
  { subject: 'Aptitude', A: 85, fullMark: 100 },
  { subject: 'Technical', A: 92, fullMark: 100 },
  { subject: 'Communication', A: 65, fullMark: 100 },
  { subject: 'Confidence', A: 70, fullMark: 100 },
  { subject: 'Group Discussion', A: 0, fullMark: 100 },
];

// Zeroed fallback used when there is no stored/user/backend data
const ZERO_RADAR_DATA = INITIAL_RADAR_DATA.map(d => ({ ...d, A: 0 }));

const TREND_DATA = [
  { session: 'S1', score: 45 },
  { session: 'S2', score: 52 },
  { session: 'S3', score: 58 },
  { session: 'S4', score: 62 },
  { session: 'S5', score: 74 },
  { session: 'S6', score: 73 },
  { session: 'S7', score: 78 },
];

const GAPS = [
  { id: 1, area: "Stress Tolerance", impact: "High", desc: "Performance drops 20% in timed scenarios." },
  { id: 2, area: "Tech Communication", impact: "Med", desc: "Code logic is good, but explanation is vague." }
];

const SOURCES = [
  { label: "Practice Modules", weight: "40%", updated: "2h ago" },
  { label: "Company Sims", weight: "35%", updated: "1d ago" },
  { label: "Stress Simulator", weight: "25%", updated: "3d ago" },
];

// --- COMPONENTS ---

const ReadinessRadar = () => {
  const [roleContext, setRoleContext] = useState("Software Engineer");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [isReloading, setIsReloading] = useState(false);
  const [radarData, setRadarData] = useState(() => {
    try {
      const normalize = (v) => {
        let n = Number(v);
        if (Number.isNaN(n)) return null;
        // support normalized scores (0..1) as well as percentages (0..100)
        if (n > 0 && n <= 1) n = Math.round(n * 100);
        n = Math.max(0, Math.min(100, Math.round(n)));
        return n;
      };
      const rawApt = localStorage.getItem('aptitudeScore');
      const rawAvg = localStorage.getItem('averageScore');
      const rawConf = localStorage.getItem('hrConfidence');
      const rawComm = localStorage.getItem('hrCommunication');
      const rawGd = localStorage.getItem('gdScore');
      // detect whether any authoritative score exists in storage
      const hasStorageValues = (rawApt !== null) || (rawAvg !== null) || (rawConf !== null) || (rawComm !== null) || (rawGd !== null);
      const userRaw = localStorage.getItem('user');
      let hasUserValues = false;
      if (userRaw) {
        try {
          const u = JSON.parse(userRaw);
          if (u) {
            hasUserValues = ['aptitudeScore','averageScore','hrConfidence','hrCommunication','gdScore'].some(k => typeof u[k] !== 'undefined' && u[k] !== null);
          }
        } catch (e) { /* ignore parse errors */ }
      }
      // If no storage or user values exist, start with an explicit zeroed radar
      if (!hasStorageValues && !hasUserValues) return ZERO_RADAR_DATA.slice();
      let out = INITIAL_RADAR_DATA.slice();
      if (rawApt !== null) {
        const n = normalize(rawApt);
        if (n !== null) out = out.map(item => item.subject === 'Aptitude' ? { ...item, A: n } : item);
      }
      if (rawGd !== null) {
        const g = normalize(rawGd);
        if (g !== null) out = out.map(item => item.subject === 'Group Discussion' ? { ...item, A: g } : item);
      }
      if (rawAvg !== null) {
        const a = normalize(rawAvg);
        if (a !== null) out = out.map(item => item.subject === 'Technical' ? { ...item, A: a } : item);
      }
      if (rawConf !== null) {
        const c = normalize(rawConf);
        if (c !== null) out = out.map(item => item.subject === 'Confidence' ? { ...item, A: c } : item);
      }
      if (rawComm !== null) {
        const m = normalize(rawComm);
        if (m !== null) out = out.map(item => (item.subject === 'Communication') ? { ...item, A: m } : item);
      }
      if (userRaw) {
        try {
          const u = JSON.parse(userRaw);
          if (u && typeof u.aptitudeScore !== 'undefined' && u.aptitudeScore !== null) {
            const n = normalize(u.aptitudeScore);
            if (n !== null) out = out.map(item => item.subject === 'Aptitude' ? { ...item, A: n } : item);
          }
          if (u && typeof u.averageScore !== 'undefined' && u.averageScore !== null) {
            const a = normalize(u.averageScore);
            if (a !== null) out = out.map(item => item.subject === 'Technical' ? { ...item, A: a } : item);
          }
          if (u && typeof u.hrCommunication !== 'undefined' && u.hrCommunication !== null) {
            const m = normalize(u.hrCommunication);
            if (m !== null) out = out.map(item => (item.subject === 'Communication') ? { ...item, A: m } : item);
          }
        } catch (e) {}
      }
      return out;
    } catch (e) {}
    return INITIAL_RADAR_DATA;
  });

  // Allow the report's overall (stored as `averageScore`) to override radar-derived overall.
  // Do not pre-load an override from localStorage on mount. Initializing
  // from storage can cause the displayed overall score to stick to an
  // outdated value (e.g. 78) even when radar slices change. The
  // component will still accept explicit `readinessScoreUpdated` events
  // or storage events to update the override while running.
  const [overrideOverall, setOverrideOverall] = useState(null);

  React.useEffect(() => {
    const handler = (e) => {
      try {
        if (e?.detail?.readinessScore !== undefined) {
          setOverrideOverall(normalizeValue(e.detail.readinessScore));
          return;
        }
        if (e?.key === 'readinessScore') {
          setOverrideOverall(normalizeValue(e.newValue));
        }
      } catch (err) {}
    };
    window.addEventListener('readinessScoreUpdated', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('readinessScoreUpdated', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  // overallScore is derived from radar slices unless overridden by report overall
  const overallScore = React.useMemo(() => {
    // If radar has no meaningful data (all slices are zero/empty), treat overall as 0
    const allZero = Array.isArray(radarData) && radarData.length > 0 && radarData.every(it => {
      try { return Number(it.A) === 0; } catch (e) { return true; }
    });
    if (allZero) return 0;
    const computed = computeOverallFromRadar(radarData);
    return overrideOverall != null ? overrideOverall : computed;
  }, [radarData, overrideOverall]);

  const currentMetrics = ROLE_METRICS[roleContext];
  
  // Logic to determine certification status
  // compute overall from radar slices (multidimensional analysis)
  function computeOverallFromRadar(data) {
    // weights (must sum to 100)
    const weights = {
      Aptitude: 15,
      Technical: 30,
      Communication: 20,
      Confidence: 20,
      'Stress Tolerance': 15
    };
    try {
      const map = Object.fromEntries((data || []).map(d => [d.subject, Number(d.A) || 0]));
      let total = 0;
      let weightSum = 0;
      for (const [k, w] of Object.entries(weights)) {
        const v = map[k] ?? 0;
        total += v * w;
        weightSum += w;
      }
      if (weightSum === 0) return 0;
      return Math.round(total / weightSum);
    } catch (e) {
      return 0;
    }
  }

  const isCertified = overallScore >= 85;

  // Helper to normalize values consistently for display
  function normalizeValue(v) {
    let n = Number(v);
    if (Number.isNaN(n)) return null;
    // support normalized scores (0..1), 1..10 scales, and percentages (0..100)
    if (n > 0 && n <= 1) {
      n = Math.round(n * 100);
    } else if (n > 1 && n <= 10) {
      n = Math.round(n * 10);
    }
    n = Math.max(0, Math.min(100, Math.round(n)));
    return n;
  }

  const [hrCommunicationLocal, setHrCommunicationLocal] = useState(() => {
    try {
      const top = localStorage.getItem('hrCommunication');
      if (top !== null) return normalizeValue(top);
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        try {
          const u = JSON.parse(userRaw);
          if (u && typeof u.hrCommunication !== 'undefined' && u.hrCommunication !== null) {
            return normalizeValue(u.hrCommunication);
          }
        } catch (e) {}
      }
    } catch (e) {}
    return null;
  });

  // Keep a lightweight local copy of hrCommunication in sync with storage/events
  React.useEffect(() => {
    const handler = (e) => {
      try {
        if (e?.detail?.communication !== undefined) {
          setHrCommunicationLocal(normalizeValue(e.detail.communication));
          return;
        }
        if (e?.key === 'hrCommunication') {
          setHrCommunicationLocal(normalizeValue(e.newValue));
          return;
        }
        if (e?.key === 'user' && e?.newValue) {
          try {
            const u = JSON.parse(e.newValue || '{}');
            if (u && typeof u.hrCommunication !== 'undefined' && u.hrCommunication !== null) {
              setHrCommunicationLocal(normalizeValue(u.hrCommunication));
            }
          } catch (err) {}
        }
      } catch (err) {}
    };
    window.addEventListener('hrCommunicationUpdated', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('hrCommunicationUpdated', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  // Ensure Technical slice reflects localStorage.averageScore (or user.averageScore)
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('averageScore');
      let val = null;
      if (raw !== null) {
        val = normalizeValue(raw);
      } else {
        const userRaw = localStorage.getItem('user');
        if (userRaw) {
          try {
            const u = JSON.parse(userRaw || '{}');
            if (u && typeof u.averageScore !== 'undefined' && u.averageScore !== null) {
              val = normalizeValue(u.averageScore);
            }
          } catch (e) {}
        }
      }
      if (val !== null) {
        setRadarData(prev => prev.map(item => item.subject === 'Technical' ? { ...item, A: val } : item));
      }
    } catch (e) {}
  }, []);

  // Ensure Group Discussion slice reflects localStorage.gdScore (or user.gdScore)
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('gdScore');
      let val = null;
      if (raw !== null) {
        val = normalizeValue(raw);
      } else {
        const userRaw = localStorage.getItem('user');
        if (userRaw) {
          try {
            const u = JSON.parse(userRaw || '{}');
            if (u && typeof u.gdScore !== 'undefined' && u.gdScore !== null) {
              val = normalizeValue(u.gdScore);
            }
          } catch (e) {}
        }
      }
      if (val !== null) {
        setRadarData(prev => prev.map(item => item.subject === 'Group Discussion' ? { ...item, A: val } : item));
      }
    } catch (e) {}

    const handler = (e) => {
      try {
        if (e?.detail?.gdScore !== undefined) {
          const n = normalizeValue(e.detail.gdScore);
          if (n !== null) setRadarData(prev => prev.map(item => item.subject === 'Group Discussion' ? { ...item, A: n } : item));
          return;
        }
        if (e?.key === 'gdScore' && e?.newValue !== undefined) {
          const n = normalizeValue(e.newValue);
          if (n !== null) setRadarData(prev => prev.map(item => item.subject === 'Group Discussion' ? { ...item, A: n } : item));
        }
        if (e?.key === 'user' && e?.newValue) {
          try {
            const u = JSON.parse(e.newValue || '{}');
            if (u && typeof u.gdScore !== 'undefined' && u.gdScore !== null) {
              const n = normalizeValue(u.gdScore);
              if (n !== null) setRadarData(prev => prev.map(item => item.subject === 'Group Discussion' ? { ...item, A: n } : item));
            }
          } catch (err) {}
        }
      } catch (err) {}
    };

    window.addEventListener('gdScoreUpdated', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('gdScoreUpdated', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  // Ensure the radarData communication slice always reflects the stored hrCommunication value
  React.useEffect(() => {
    try {
      if (hrCommunicationLocal !== null) {
        setRadarData(prev => prev.map(item => (item.subject === 'Communication' || item.subject === 'Confidence') ? { ...item, A: hrCommunicationLocal } : item));
      }
    } catch (e) {}
  }, [hrCommunicationLocal]);

  const getRadarValue = (subject) => {
    try {
      const itm = (radarData || []).find(d => d.subject === subject);
      return itm ? Number(itm.A) : null;
    } catch (e) { return null; }
  };

  // Persist the derived readiness score so other components can consume it
  React.useEffect(() => {
    try {
      localStorage.setItem('readinessScore', String(overallScore));
      const ev = new CustomEvent('readinessScoreUpdated', { detail: { readinessScore: overallScore } });
      window.dispatchEvent(ev);
    } catch (e) {}
  }, [overallScore]);

  const handleRecalculate = () => {
    setIsReloading(true);
    setTimeout(() => {
      // Recompute overall strictly from the current multidimensional slices
      // without mutating or perturbing any radar slice values.
      try {
        // keep score derived from `radarData`; do not overwrite it here
        const newOverall = computeOverallFromRadar(radarData);
        try { console.log('ReadinessRadar: recalculated overall (derived):', newOverall); } catch (e) {}
      } catch (e) {
        // fallback: keep existing overallScore on error
      }
      setIsReloading(false);
      // Reload the page so all components re-read persisted scores and
      // the UI reflects the latest authoritative values.
      try { window.location.reload(); } catch (e) {}
    }, 800);
  };

  const handleRoleSelect = (role) => {
    setRoleContext(role);
    setIsDropdownOpen(false);
  };

  // Sync aptitude value from dashboard if available (stored in localStorage by the dashboard)
  React.useEffect(() => {
    const normalize = (v) => {
      let n = Number(v);
      if (Number.isNaN(n)) return null;
      if (n > 0 && n <= 1) n = Math.round(n * 100);
      n = Math.max(0, Math.min(100, Math.round(n)));
      return n;
    };

    const applyAptitude = (apt) => {
      const val = normalize(apt);
      if (val === null) return;
      try { console.log('ReadinessRadar: applying aptitudeScore', apt, 'normalized->', val); } catch (e) {}
      setRadarData(prev => prev.map(item => item.subject === 'Aptitude' ? { ...item, A: val } : item));
      try {
        localStorage.setItem('aptitudeScore', String(val));
        const userRaw = localStorage.getItem('user');
        if (userRaw) {
          try {
            const u = JSON.parse(userRaw || '{}');
            u.aptitudeScore = val;
            localStorage.setItem('user', JSON.stringify(u));
          } catch (e) { /* ignore */ }
        }
      } catch (e) {}
    };

    const applyConfidence = (conf) => {
      const val = normalize(conf);
      if (val === null) return;
      try { console.log('ReadinessRadar: applying hrConfidence', conf, 'normalized->', val); } catch (e) {}
      setRadarData(prev => prev.map(item => item.subject === 'Confidence' ? { ...item, A: val } : item));
      // Intentionally do NOT persist hrConfidence here to avoid accidental overwrites
    };

    const applyCommunication = (comm) => {
        const val = normalize(comm);
        if (val === null) return;
        try { console.log('ReadinessRadar: applying hrCommunication', comm, 'normalized->', val); } catch (e) {}
        // Only update Communication slice here. Do not overwrite Confidence which should
        // be sourced from explicit hrConfidence in storage.
        setRadarData(prev => prev.map(item => (item.subject === 'Communication') ? { ...item, A: val } : item));
        if (val !== 0) {
          try { localStorage.setItem('hrCommunication', String(val)); } catch (e) {}
          try {
            const userRaw = localStorage.getItem('user');
            if (userRaw) {
              const u = JSON.parse(userRaw || '{}');
              u.hrCommunication = val;
              localStorage.setItem('user', JSON.stringify(u));
            }
          } catch (e) {}
        }
      };

    const applyAverage = (avg) => {
      const val = normalize(avg);
      if (val === null) return;
      try { console.log('ReadinessRadar: applying averageScore', avg, 'normalized->', val); } catch (e) {}
      setRadarData(prev => prev.map(item => item.subject === 'Technical' ? { ...item, A: val } : item));
      try {
        localStorage.setItem('averageScore', String(val));
      } catch (e) {}
    };

    // initial read from localStorage (support top-level key or cached user object)
    try {
      const raw = localStorage.getItem('aptitudeScore');
      if (raw !== null) {
        const n = normalize(raw);
        if (n !== null) applyAptitude(n);
      } else {
        const userRaw = localStorage.getItem('user');
        if (userRaw) {
          try {
            const u = JSON.parse(userRaw || '{}');
            if (u && typeof u.aptitudeScore !== 'undefined' && u.aptitudeScore !== null) {
              const n = normalize(u.aptitudeScore);
              if (n !== null) applyAptitude(n);
            }
            if (u && typeof u.hrCommunication !== 'undefined' && u.hrCommunication !== null) {
              const m = normalize(u.hrCommunication);
              if (m !== null) applyCommunication(m);
            }
            if (u && typeof u.averageScore !== 'undefined' && u.averageScore !== null) {
              const a = normalize(u.averageScore);
              if (a !== null) applyAverage(a);
            }
          } catch (e) {}
        }
      }
    } catch (e) {}

    // listen for cross-window/local updates
    const handler = (e) => {
      try {
        if (e?.detail?.aptitudeScore !== undefined) {
          const n = normalize(e.detail.aptitudeScore);
          if (n !== null) applyAptitude(n);
          return;
        }
        if (e?.detail?.confidence !== undefined) {
          const n = normalize(e.detail.confidence);
          if (n !== null) applyConfidence(n);
          return;
        }
        if (e?.detail?.communication !== undefined) {
          const n = normalize(e.detail.communication);
          if (n !== null) applyCommunication(n);
          return;
        }
        if (e?.detail?.averageScore !== undefined) {
          const n = normalize(e.detail.averageScore);
          if (n !== null) applyAverage(n);
          return;
        }
        if (e?.detail?.score !== undefined && typeof e.detail.score === 'number') {
          const n = normalize(e.detail.score);
          if (n !== null) applyAverage(n);
          return;
        }
      } catch (err) {}
      try {
        if (e?.key === 'aptitudeScore' && e?.newValue !== undefined) {
          const n = normalize(e.newValue);
          if (n !== null) applyAptitude(n);
        }
        if (e?.key === 'hrConfidence' && e?.newValue !== undefined) {
          const n = normalize(e.newValue);
          if (n !== null) applyConfidence(n);
        }
        if (e?.key === 'hrCommunication' && e?.newValue !== undefined) {
          const n = normalize(e.newValue);
          if (n !== null) applyCommunication(n);
        }
        if (e?.key === 'averageScore' && e?.newValue !== undefined) {
          const n = normalize(e.newValue);
          if (n !== null) applyAverage(n);
        }
        if (e?.key === 'user' && e?.newValue) {
          try {
            const u = JSON.parse(e.newValue || '{}');
            if (u && typeof u.aptitudeScore !== 'undefined' && u.aptitudeScore !== null) {
              const n = normalize(u.aptitudeScore);
              if (n !== null) applyAptitude(n);
            }
            if (u && typeof u.hrConfidence !== 'undefined' && u.hrConfidence !== null) {
              const c = normalize(u.hrConfidence);
              if (c !== null) applyConfidence(c);
            }
            if (u && typeof u.hrCommunication !== 'undefined' && u.hrCommunication !== null) {
              const m = normalize(u.hrCommunication);
              if (m !== null) applyCommunication(m);
            }
            if (u && typeof u.averageScore !== 'undefined' && u.averageScore !== null) {
              const a = normalize(u.averageScore);
              if (a !== null) applyAverage(a);
            }
          } catch (err) {}
        }
      } catch (err) {}
    };

    window.addEventListener('aptitudeScoreUpdated', handler);
    window.addEventListener('averageScoreUpdated', handler);
    window.addEventListener('hrConfidenceUpdated', handler);
    window.addEventListener('hrCommunicationUpdated', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('aptitudeScoreUpdated', handler);
      window.removeEventListener('averageScoreUpdated', handler);
      window.removeEventListener('hrConfidenceUpdated', handler);
      window.removeEventListener('hrCommunicationUpdated', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  // Fetch authoritative scores from the backend on mount and apply them to the radar.
  React.useEffect(() => {
    const normalize = (v) => {
      let n = Number(v);
      if (Number.isNaN(n)) return null;
      if (n > 0 && n <= 1) n = Math.round(n * 100);
      n = Math.max(0, Math.min(100, Math.round(n)));
      return n;
    };

    const applyBackendScores = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('/api/user/scores', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const data = await res.json();

        const apt = normalize(data?.aptitudeScore ?? data?.aptitude ?? null);
        const avg = normalize(data?.averageScore ?? data?.average ?? null);
        const conf = normalize(data?.hrConfidence ?? data?.hr_confidence ?? null);
        const comm = normalize(data?.hrCommunication ?? data?.hr_communication ?? null);

        // Prefer any locally stored hrCommunication (top-level or inside `user`).
        let storedComm = null;
        try {
          const top = localStorage.getItem('hrCommunication');
          if (top !== null) storedComm = normalize(top);
          else {
            const userRaw = localStorage.getItem('user');
            if (userRaw) {
              try {
                const u = JSON.parse(userRaw);
                if (u && typeof u.hrCommunication !== 'undefined' && u.hrCommunication !== null) {
                  storedComm = normalize(u.hrCommunication);
                }
              } catch (e) {}
            }
          }
        } catch (e) {}

        // compute whether a local hrConfidence already exists (top-level or inside user)
        let storedConf = null;
        try {
          const topConf = localStorage.getItem('hrConfidence');
          if (topConf !== null) storedConf = normalize(topConf);
          else {
            const userRaw2 = localStorage.getItem('user');
            if (userRaw2) {
              try {
                const u2 = JSON.parse(userRaw2);
                if (u2 && typeof u2.hrConfidence !== 'undefined' && u2.hrConfidence !== null) {
                  storedConf = normalize(u2.hrConfidence);
                }
              } catch (e) {}
            }
          }
        } catch (e) {}

        const preferredComm = storedComm !== null ? storedComm : comm;
        // Derive confidence from communication stored value per product requirement
        // Prefer an explicit local hrConfidence first, then communication, then backend confidence
        const preferredConf = (storedConf !== null) ? storedConf : (preferredComm !== null ? preferredComm : conf);

        setRadarData(prev => prev.map(item => {
          if (item.subject === 'Aptitude' && apt !== null) return { ...item, A: apt };
          if (item.subject === 'Technical' && avg !== null) return { ...item, A: avg };
          if (item.subject === 'Confidence' && preferredConf !== null) return { ...item, A: preferredConf };
          if (item.subject === 'Communication' && preferredComm !== null) return { ...item, A: preferredComm };
          return item;
        }));

        // persist and notify other components, but avoid overwriting existing local values
        if (apt !== null) {
          localStorage.setItem('aptitudeScore', String(apt));
          window.dispatchEvent(new CustomEvent('aptitudeScoreUpdated', { detail: { aptitudeScore: apt } }));
        }
        if (avg !== null) {
          localStorage.setItem('averageScore', String(avg));
          window.dispatchEvent(new CustomEvent('averageScoreUpdated', { detail: { averageScore: avg } }));
        }

        // Do NOT persist backend-provided hrConfidence automatically here.
        // Keep any backend confidence in-memory (radarData) but avoid
        // overwriting the user's stored `hrConfidence` without explicit action.

        // Only write backend communication into storage when there is no local stored value.
        if (storedComm === null && comm !== null) {
          if (comm !== 0) {
            localStorage.setItem('hrCommunication', String(comm));
            window.dispatchEvent(new CustomEvent('hrCommunicationUpdated', { detail: { communication: comm } }));
          }
        }

        // Optionally augment Confidence from latest quick score if present
        try {
          const qres = await fetch('/api/score/latest?module=hr_confidence');
          if (qres.ok) {
            const q = await qres.json();
            if (q && q.found && typeof q.score === 'number') {
              const n = normalize(q.score);
              if (n !== null) {
                // only apply quick score if there's no stored local hrConfidence
                if (storedConf === null) {
                  setRadarData(prev => prev.map(item => item.subject === 'Confidence' ? { ...item, A: n } : item));
                  // do not persist quick-score-derived hrConfidence to storage
                }
              }
            }
          }
        } catch (e) { /* ignore */ }

      } catch (err) {
        console.warn('ReadinessRadar: backend fetch failed', err);
      }
    };

    applyBackendScores();
  }, []);

  // Enforce Stress Tolerance = 0 at all times. Only update when it's non-zero
  // to avoid an unnecessary state update loop.
  React.useEffect(() => {
    try {
      const hasNonZeroStress = (radarData || []).some(item => item.subject === 'Stress Tolerance' && Number(item.A) !== 0);
      if (hasNonZeroStress) {
        setRadarData(prev => prev.map(item => item.subject === 'Stress Tolerance' ? { ...item, A: 0 } : item));
      }
    } catch (e) {
      // ignore
    }
  }, [radarData]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans p-8 flex justify-center">
      <div className="w-full max-w-6xl space-y-10">

        {/* --- HEADER --- */}
        <header className="flex justify-between items-end border-b border-gray-100 pb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">Readiness Radar</h1>
            <p className="text-gray-500 font-medium">Your real-time interview preparedness overview</p>
          </div>
          
          <button 
            onClick={handleRecalculate}
            disabled={isReloading}
            className={`px-6 py-3 font-bold rounded-lg transition-all shadow-lg flex items-center gap-2
              ${isReloading 
                ? 'bg-indigo-400 text-indigo-100 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
              }`}
          >
            <RefreshCw size={18} className={isReloading ? "animate-spin" : ""} /> 
            {isReloading ? "Analyzing..." : "Recalculate Readiness"}
          </button>
        </header>

        {/* --- HERO DASHBOARD --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* OVERALL SCORE */}
          <section className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="relative w-48 h-48 mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                <circle 
                  cx="96" cy="96" r="88" 
                  stroke={isCertified ? "#d97706" : "#4f46e5"} // Turns Amber if certified
                  strokeWidth="12" fill="none" 
                  strokeDasharray={552} 
                  strokeDashoffset={552 - (552 * (overallScore / 100))} 
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className={`text-5xl font-black tracking-tighter transition-all ${isCertified ? 'text-amber-600' : 'text-gray-900'}`}>
                    {overallScore}
                </span>
                <span className="text-xl text-gray-400 font-medium">/100</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2.5 h-2.5 rounded-full ${isReloading ? 'bg-gray-300' : isCertified ? 'bg-amber-500 animate-pulse' : 'bg-indigo-500 animate-pulse'}`}></div>
              <h2 className="text-lg font-bold text-gray-900">
                {overallScore >= 85 ? "Market Ready" : "Near Ready"}
              </h2>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              This score reflects your weighted performance across 5 core dimensions based on recent activity.
            </p>
          </section>

          {/* RADAR CHART */}
          <section className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative">
            <div className="absolute top-6 left-6 z-10">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <Target size={18} className="text-indigo-600" /> Multidimensional Analysis
              </h2>
            </div>

            <div className={`h-[350px] w-full min-h-0 min-w-0 transition-opacity duration-500 ${isReloading ? 'opacity-50' : 'opacity-100'}`} style={{ minWidth: 0, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#111827', fontSize: 12, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Candidate"
                    dataKey="A"
                    stroke={isCertified ? "#d97706" : "#4f46e5"}
                    strokeWidth={3}
                    fill={isCertified ? "#d97706" : "#4f46e5"}
                    fillOpacity={0.1} 
                    isAnimationActive={true}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* --- DATA SOURCES --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SOURCES.map((source, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
               <div>
                 <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Source</div>
                 <div className="font-bold text-gray-900">{source.label}</div>
               </div>
               <div className="text-right">
                 <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded inline-block mb-1">
                   {source.weight} Weight
                 </div>
                 <div className="text-[10px] text-gray-400">Updated {isReloading ? "Syncing..." : source.updated}</div>
               </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COL (2/3) --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* TREND CHART */}
            <section className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp size={18} className="text-indigo-600" /> Readiness Trajectory
                 </h2>
                 <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                   +12% Last 7 Days
                 </span>
              </div>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={TREND_DATA}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isCertified ? "#d97706" : "#4f46e5"} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={isCertified ? "#d97706" : "#4f46e5"} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="session" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#1f2937', color: '#fff', borderRadius: '8px', border: 'none'}}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke={isCertified ? "#d97706" : "#4f46e5"} 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorScore)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* ROLE CONTEXT */}
            <section className="bg-indigo-600 text-white rounded-2xl p-8 shadow-xl shadow-indigo-100 z-20 relative transition-all">
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <h2 className="text-sm font-bold text-indigo-200 uppercase tracking-widest mb-2">Role Alignment Context</h2>
                   
                   <div className="relative">
                     <button 
                       onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                       className="flex items-center gap-3 text-2xl font-bold hover:text-indigo-100 transition-colors focus:outline-none"
                     >
                       {roleContext}
                       <ChevronDown 
                         size={20} 
                         className={`text-indigo-300 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} 
                       />
                     </button>

                     {isDropdownOpen && (
                       <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                         {Object.keys(ROLE_METRICS).map((role) => (
                           <button
                             key={role}
                             onClick={() => handleRoleSelect(role)}
                             className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex justify-between items-center transition-colors"
                           >
                             {role}
                             {roleContext === role && <Check size={16} className="text-indigo-600" />}
                           </button>
                         ))}
                       </div>
                     )}
                   </div>
                 </div>
                 <Briefcase size={24} className="text-indigo-300" />
               </div>

               <div className="space-y-6">
                 <div>
                   <div className="flex justify-between text-xs font-bold mb-2 text-indigo-100">
                     <span>Skill Match</span>
                     <span>{currentMetrics.skill}%</span>
                   </div>
                   <div className="h-2 bg-indigo-900/30 rounded-full overflow-hidden">
                     <div 
                       className="h-full bg-white transition-all duration-1000 ease-out" 
                       style={{ width: `${currentMetrics.skill}%` }}
                     ></div>
                   </div>
                 </div>
                 
                 <div>
                   <div className="flex justify-between text-xs font-bold mb-2 text-indigo-100">
                     <span>Behavioral Fit (Stress)</span>
                     <span className={currentMetrics.fit < 60 ? "text-red-200" : "text-emerald-200"}>
                       {currentMetrics.fit}%
                     </span>
                   </div>
                   <div className="h-2 bg-indigo-900/30 rounded-full overflow-hidden">
                     <div 
                       className={`h-full transition-all duration-1000 ease-out ${currentMetrics.fit < 60 ? "bg-red-400" : "bg-emerald-400"}`}
                       style={{ width: `${currentMetrics.fit}%` }}
                     ></div>
                   </div>
                 </div>
               </div>
            </section>
          </div>

          {/* --- RIGHT COL (1/3) --- */}
          <div className="space-y-8">
            
            {/* GAP ANALYSIS */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
               <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <AlertCircle size={18} className="text-indigo-600" /> Readiness Gaps
               </h2>
               <div className="space-y-4">
                 {GAPS.map(gap => (
                   <div key={gap.id} className="p-4 bg-gray-50 border-l-4 border-indigo-600 rounded-r-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-gray-900 text-sm">{gap.area}</span>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded uppercase">
                          {gap.impact} Impact
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{gap.desc}</p>
                   </div>
                 ))}
               </div>
            </section>

            {/* INSIGHTS */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
               <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Brain size={18} className="text-indigo-600" /> Mentor Insight
               </h2>
               <p className="text-sm text-gray-600 leading-relaxed mb-6">
                 "You are technically strong, but your stress tolerance is currently a blocker. You tend to freeze during timed challenges."
               </p>
               <div className="space-y-3">
                 <button className="w-full py-3 px-4 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-xl text-left transition-all group">
                   <div className="flex justify-between items-center">
                     <div>
                       <div className="text-xs font-bold text-gray-400 uppercase group-hover:text-indigo-500">Rec: Simulation</div>
                       <div className="text-sm font-bold text-gray-900">High-Pressure HR Round</div>
                     </div>
                     <ArrowRight size={16} className="text-gray-300 group-hover:text-indigo-600" />
                   </div>
                 </button>
                 <button className="w-full py-3 px-4 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-xl text-left transition-all group">
                   <div className="flex justify-between items-center">
                     <div>
                       <div className="text-xs font-bold text-gray-400 uppercase group-hover:text-indigo-500">Rec: Practice</div>
                       <div className="text-sm font-bold text-gray-900">Breath Control Drills</div>
                     </div>
                     <ArrowRight size={16} className="text-gray-300 group-hover:text-indigo-600" />
                   </div>
                 </button>
               </div>
            </section>

            {/* CERTIFICATION SECTION - UPDATED */}
            <section 
              className={`border rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 transition-all duration-500 
                ${isCertified 
                  ? 'border-amber-200 bg-amber-50/50 shadow-lg shadow-amber-50' 
                  : 'border-gray-200 bg-gray-50/50'
                }`}
            >
               <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center transition-colors
                 ${isCertified ? 'bg-amber-100 text-amber-600' : 'bg-gray-200 text-gray-400'}`}
               >
                 {isCertified ? <Award size={24} /> : <Lock size={20} />}
               </div>
               
               <div className="flex-1 text-center md:text-left">
                 <h3 className={`text-sm font-bold ${isCertified ? 'text-amber-900' : 'text-gray-900'}`}>
                   {isCertified ? "Certification Unlocked" : "Certification Locked"}
                 </h3>
                 <p className={`text-xs mt-1 ${isCertified ? 'text-amber-700' : 'text-gray-500'}`}>
                   {isCertified 
                     ? "You are ready. Download your credential." 
                     : "Reach 85+ Readiness to unlock."
                   }
                 </p>
               </div>

               {isCertified && (
                 <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                   <Download size={14} /> Claim
                 </button>
               )}
            </section>

          </div>
        </div>

        {/* --- FOOTER --- */}
        <footer className="border-t border-gray-100 pt-8 text-center text-xs text-gray-400">
          <p>Readiness indicators are AI-estimated based on active platform usage. Last recalculated: {isReloading ? "Syncing..." : "Just now"}.</p>
        </footer>

      </div>
    </div>
  );
};

export default ReadinessRadar;