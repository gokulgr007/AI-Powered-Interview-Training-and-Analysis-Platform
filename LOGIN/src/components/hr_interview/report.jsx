import React, { useState, useEffect } from 'react';

const API_URL = "http://127.0.0.1:5006";
const SCORE_API = "http://localhost:5000/api/score";

const Metric = ({label, value}) => (
  <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
    <div className="text-xs font-bold text-gray-500">{label}</div>
    <div className="text-2xl font-extrabold text-gray-900">{value}</div>
  </div>
);

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
  </svg>
);

const SmallSpinner = ({className = 'h-5 w-5'}) => (
  <svg className={`animate-spin text-indigo-600 inline-block align-middle ml-2 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
  </svg>
);

const Report = ({ quick, onBack, onRestart }) => {
  const [metrics, setMetrics] = useState(null);
  const [fetchedOverall, setFetchedOverall] = useState(null);
  const [savedQuick, setSavedQuick] = useState(null);
  
  const [loading, setLoading] = useState(false);

  const overall = (typeof quick?.overall === 'number' ? quick.overall : (typeof fetchedOverall === 'number' ? fetchedOverall : '--'));
  const transcript = quick?.transcript ?? 'No transcript available.';

  function computeDominant(expressions) {
    if (!expressions) return '—';

    // If parent already supplied a dominant as [label, prob]
    if (Array.isArray(expressions) && expressions.length >= 2 && typeof expressions[0] === 'string' && typeof expressions[1] === 'number') {
      const [label, prob] = expressions;
      return `${label} (${Math.round((prob || 0) * 100)}%)`;
    }

    // If expressions is an array of per-frame expression objects (face-api outputs per detection)
    if (Array.isArray(expressions)) {
      // e.g. [{ happy:0.5, neutral:0.2 }, { happy:0.6, neutral:0.1 }]
      const first = expressions[0];
      if (first && typeof first === 'object' && !Array.isArray(first)) {
        const totals = {};
        let frames = 0;
        expressions.forEach(obj => {
          if (!obj || typeof obj !== 'object') return;
          frames += 1;
          Object.entries(obj).forEach(([k, v]) => {
            if (typeof v === 'number') totals[k] = (totals[k] || 0) + v;
          });
        });
        if (frames === 0) return '—';
        const entries = Object.entries(totals);
        if (entries.length === 0) return '—';
        const [bestLabel, bestSum] = entries.reduce((a, b) => (a[1] >= b[1] ? a : b));
        const avg = bestSum / frames;
        return `${bestLabel} (${Math.round((avg || 0) * 100)}%)`;
      }
    }

    // If expressions is an object from face-api (e.g. { happy: 0.7, neutral: 0.2 })
    if (typeof expressions === 'object') {
      const entries = Object.entries(expressions);
      if (entries.length === 0) return '—';
      const [bestLabel, bestVal] = entries.reduce((a, b) => (a[1] >= b[1] ? a : b));
      return `${bestLabel} (${Math.round((bestVal || 0) * 100)}%)`;
    }

    return '—';
  }

  const dominant = computeDominant(quick?.dominant ?? quick?.expressions);

  // AI feedback generation removed — manual generation disabled.

  function metricValue(name) {
    if (quick && typeof quick[name] === 'number') return Math.round(quick[name]);
    if (metrics && typeof metrics[name] === 'number') {
      const val = metrics[name];
      // If metric looks like a 0-1 value, scale to 0-10; otherwise treat as already 0-10
      if (val <= 1) return Math.round(val * 10);
      return Math.round(val);
    }
    return null;
  }

  function metricDisplay(name) {
    const v = metricValue(name);
    if (v !== null) return `${v}/10`;
    if (loading) return <SmallSpinner className="h-4 w-4" />;
    return '-/10';
  }

  // AI feedback is now run on-demand. Use the button below to request it.
  const fetchAiFeedback = async () => {
    // don't run if quick already contains an authoritative overall
    if (quick && typeof quick.overall === 'number') return;
    setLoading(true);
    try {
      const payload = { expressions: quick?.expressions ?? {}, transcript: quick?.transcript ?? '' };
      const res = await fetch(`${API_URL}/ai_feedback`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data?.overall_score !== undefined) setFetchedOverall(data.overall_score);
      if (data?.metrics) setMetrics(data.metrics);
    } catch (e) {
      console.debug('report: fetch ai_feedback failed', e);
    } finally {
      setLoading(false);
    }
  };

  // Persist quick live evaluation (if present) to server so dashboard can show it
  useEffect(() => {
    let mounted = true;
    const q = quick?.overall;
    if (typeof q !== 'number') return;
    if (savedQuick === q) return;
    (async () => {
      try {
        await fetch(`${SCORE_API}/quick`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ module: 'hr', score: q })
        });
        if (!mounted) return;
        setSavedQuick(q);
        // Persist the quick live evaluation as hrNormalScore and mark attempt
        try { localStorage.setItem('hrNormalScore', String(q)); } catch (e) {}
        try {
          const rawU = localStorage.getItem('user');
          if (rawU) {
            const uu = JSON.parse(rawU || '{}');
            uu.hrNormalScore = q;
            localStorage.setItem('user', JSON.stringify(uu));
          }
        } catch (e) {}
        try { window.dispatchEvent(new CustomEvent('hrNormalScoreUpdated', { detail: { hrNormalScore: q } })); } catch (e) {}
        // Mark that the user has attempted an HR session so dashboard shows real score
        try {
          localStorage.setItem('hrAttempts', '1');
          const raw = localStorage.getItem('user');
          if (raw) {
            const u = JSON.parse(raw || '{}');
            u.hrAttempts = (u.hrAttempts ? Number(u.hrAttempts) + 1 : 1);
            localStorage.setItem('user', JSON.stringify(u));
          }
          try { window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: { hrAttempts: 1 } })); } catch (e) {}
        } catch (e) {}
      } catch (e) {
        console.debug('report: save quick score failed', e);
      }
    })();

    return () => { mounted = false; };
  }, [quick?.overall, savedQuick]);

  // Persist and broadcast the HR 'confidence' metric so other components (ReadinessRadar)
  // can pick it up immediately. Normalize to 0..100 (quick confidence is 0..10 or 0..1).
  useEffect(() => {
    const conf = quick?.confidence;
    if (typeof conf !== 'number') return;
    try {
      let val = Number(conf);
      if (Number.isNaN(val)) return;
      // Interpret inputs: treat fractional values strictly less than 1 as 0..1
      // normalized scores (e.g. 0.8 -> 80). Treat integer-like values in the
      // 0..10 range (including 1) as 1..10 scale and map to 10..100.
      if (val > 0 && val < 1) val = Math.round(val * 100);
      else if (val <= 10) val = Math.round(val * 10);
      val = Math.max(0, Math.min(100, val));
      try { localStorage.setItem('hrConfidence', String(val)); } catch (e) {}
      try {
        const userRaw = localStorage.getItem('user');
        if (userRaw) {
          const u = JSON.parse(userRaw || '{}');
          u.hrConfidence = val;
          localStorage.setItem('user', JSON.stringify(u));
        }
      } catch (e) {}
      try { window.dispatchEvent(new CustomEvent('hrConfidenceUpdated', { detail: { confidence: val } })); } catch (e) {}
      // Also persist quick confidence to the server quick scores so it can be retrieved by other sessions
      try {
        const userRaw = localStorage.getItem('user');
        const userId = userRaw ? (JSON.parse(userRaw)._id || JSON.parse(userRaw).id) : null;
        fetch(`${SCORE_API}/quick`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ module: 'hr_confidence', score: val, userId })
        }).catch(() => {});
      } catch (e) {}
    } catch (e) {}
  }, [quick?.confidence]);

  // Persist and broadcast the HR 'communication' metric so ReadinessRadar can pick it up.
  useEffect(() => {
    const comm = quick?.communication;
    if (typeof comm !== 'number') return;
    try {
      let val = Number(comm);
      if (Number.isNaN(val)) return;
      if (val > 0 && val < 1) val = Math.round(val * 100);
      else if (val <= 10) val = Math.round(val * 10);
      val = Math.max(0, Math.min(100, val));
      try { localStorage.setItem('hrCommunication', String(val)); } catch (e) {}
      try {
        const userRaw = localStorage.getItem('user');
        if (userRaw) {
          const u = JSON.parse(userRaw || '{}');
          u.hrCommunication = val;
          localStorage.setItem('user', JSON.stringify(u));
        }
      } catch (e) {}
      try { window.dispatchEvent(new CustomEvent('hrCommunicationUpdated', { detail: { communication: val } })); } catch (e) {}
      // Persist to backend quick scores
      try {
        const userRaw = localStorage.getItem('user');
        const userId = userRaw ? (JSON.parse(userRaw)._id || JSON.parse(userRaw).id) : null;
        fetch(`${SCORE_API}/quick`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ module: 'hr_communication', score: val, userId })
        }).catch(() => {});
      } catch (e) {}
    } catch (e) {}
  }, [quick?.communication]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Interview Report</h1>
          <p className="text-sm text-gray-500">Summary of communication, behavior and facial analysis.</p>
        </div>
        <div className="flex gap-3">
          {onBack && (
            <button onClick={onBack} className="px-3 py-2 rounded-md bg-white border text-gray-700">Back</button>
          )}
          {onRestart && (
            <button onClick={onRestart} className="px-4 py-2 rounded-md bg-indigo-600 text-white font-bold">New Session</button>
          )}
        </div>
      </div>

      {/* Persistent overall score display (visible whether serverHtml exists or not) */}
      <div className="mb-6 flex items-center justify-end">
        <div className="text-xs text-gray-400 mr-3">Overall Match</div>
        <div className="text-3xl font-black text-indigo-600">{typeof overall === 'number' ? `${overall}/100` : (loading ? <Spinner /> : '--/100')}</div>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">Executive Summary</div>
                <h3 className="text-xl font-bold text-gray-900 mt-2">Quick Live Evaluation</h3>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Overall Match</div>
                <div className="text-3xl font-black text-indigo-600">{typeof overall === 'number' ? `${overall}/100` : (loading ? <Spinner /> : '--/100')}</div>
                <div className="mt-2">
                  <button onClick={fetchAiFeedback} className="text-xs font-bold text-indigo-600 hover:underline inline-flex items-center">
                    {loading ? <SmallSpinner className="h-4 w-4" /> : 'Generate Feedback'}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">{quick?.summary ?? 'Live quick assessment based on facial cues and recent transcript.'}</p>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="text-xs font-bold text-gray-400 uppercase">Behavioral & Facial Analysis</div>
                <ul className="mt-2 text-gray-700 list-disc list-inside">
                  <li><strong>Dominant Expression:</strong> {dominant}</li>
                  <li><strong>Body language cues:</strong> {quick?.body || 'Not enough visual cues captured.'}</li>
                  {(metrics || quick) && (
                    <li>
                      <strong>Derived metrics:</strong>{' '}
                      <>
                        Confidence {metricDisplay('confidence')}, {' '}
                        Communication {metricDisplay('communication')}, {' '}
                        Technical {metricDisplay('technical')}
                      </>
                    </li>
                  )}
                </ul>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <div className="grid grid-cols-3 gap-4">
                  <Metric label="Confidence" value={metricDisplay('confidence')} />
                  <Metric label="Communication" value={metricDisplay('communication')} />
                  <Metric label="Technical/Content" value={metricDisplay('technical')} />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <h4 className="text-sm font-bold text-gray-700 mb-2">Key Improvements</h4>
                <ul className="list-disc list-inside text-gray-700">
                  <li>Increase expressiveness to convey enthusiasm.</li>
                  <li>Use concise examples to strengthen answers.</li>
                  <li>Pause briefly to structure responses (STAR method).</li>
                </ul>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <div className="text-xs font-bold text-gray-500 uppercase">Quick Verdict</div>
              <div className="text-lg font-extrabold text-gray-900 mt-2">{typeof overall === 'number' ? (overall >= 70 ? 'Hire' : overall >= 50 ? 'Weak Hire' : 'Reject') : '—'}</div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <div className="text-xs font-bold text-gray-500 uppercase">Transcript (recent)</div>
              <div className="text-sm text-gray-700 mt-2">{transcript}</div>
            </div>

          </aside>
        </div>
    </div>
  );
};

export default Report;

