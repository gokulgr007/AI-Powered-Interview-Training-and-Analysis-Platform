import React, { useRef, useEffect, useState } from 'react';
import { FileText, ArrowLeft, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Report() {
  const reportRef = useRef(null);
  const navigate = useNavigate();
  const [report, setReport] = useState(null);

  // per-round scores kept in state so we can react to updates
  const [scores, setScores] = useState({
    resume: null,
    aptitude: null,
    technical: null,
    gd: null,
    hrConf: null,
    hrComm: null
  });
  const [readinessOverall, setReadinessOverall] = useState(null);

  const normalizeLocalScore = (v) => {
    if (v === null || typeof v === 'undefined') return null;
    const n = Number(v);
    if (Number.isNaN(n)) return null;
    if (n > 0 && n <= 1) return Math.round(n * 100);
    return Math.round(Math.max(0, Math.min(100, n)));
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem('detailedReport');
      if (raw) setReport(JSON.parse(raw));
    } catch (e) { setReport(null); }

    // helper to parse various score formats into 0-100 integers
    const parseScore = (v) => {
      if (v === null || typeof v === 'undefined') return null;
      // accept strings like '45%' as well
      const cleaned = String(v).trim().replace('%', '');
      const n = Number(cleaned);
      if (Number.isNaN(n)) return null;
      if (n > 0 && n <= 1) return Math.round(n * 100);
      return Math.round(Math.max(0, Math.min(100, n)));
    };

      const readAll = () => {
        // Prefer QuizCompanySim for aptitude if available
        const quizRaw = localStorage.getItem('QuizCompanySim') ?? localStorage.getItem('quizCompanySim') ?? localStorage.getItem('quizcompanysim');
        const gdRaw = localStorage.getItem('gdCompanySim') ?? localStorage.getItem('gdcompanysim');
        const hrRaw = localStorage.getItem('hrCompanySim') ?? localStorage.getItem('HRCompanySIm') ?? localStorage.getItem('hrcompanysim');
        const resumeRaw = localStorage.getItem('resumeCompanySIm') ?? localStorage.getItem('resumeCompanySim') ?? localStorage.getItem('atsScore');
        setScores({
          resume: parseScore(resumeRaw),
          aptitude: parseScore(quizRaw) ?? parseScore(localStorage.getItem('aptitudeScore')),
          technical: parseScore(localStorage.getItem('gdScore')) || parseScore(localStorage.getItem('averageScore')),
          gd: parseScore(gdRaw) ?? parseScore(localStorage.getItem('gdScore')),
          hrConf: parseScore(hrRaw) ?? parseScore(localStorage.getItem('hrConfidence')),
          hrComm: parseScore(localStorage.getItem('hrCommunication'))
        });
      };

    readAll();

    // If user is authenticated, fetch authoritative scores from backend
    const fetchUserScores = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const apiBase = (process.env.REACT_APP_API_BASE || 'http://localhost:5000');
        const res = await fetch(apiBase + '/api/user/scores', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();

        const srcUser = data.user || {};
        const serverVals = {
          ats: (typeof data.atsScore !== 'undefined' ? data.atsScore : srcUser.atsScore),
          aptitude: (typeof data.aptitudeScore !== 'undefined' ? data.aptitudeScore : srcUser.aptitudeScore),
          average: (typeof data.averageScore !== 'undefined' ? data.averageScore : srcUser.averageScore),
          gd: (typeof data.gdScore !== 'undefined' ? data.gdScore : srcUser.gdScore),
          hrConf: (typeof data.hrConfidence !== 'undefined' ? data.hrConfidence : srcUser.hrConfidence),
          hrComm: (typeof data.hrCommunication !== 'undefined' ? data.hrCommunication : srcUser.hrCommunication),
          hrScore: (typeof data.hrScore !== 'undefined' ? data.hrScore : srcUser.hrScore)
        };

        const updates = {};
        if (typeof serverVals.ats !== 'undefined' && serverVals.ats !== null) {
          const v = parseScore(String(serverVals.ats));
          updates.resume = v; try { localStorage.setItem('atsScore', String(v)); } catch (e) {}
          try { window.dispatchEvent(new CustomEvent('atsScoreUpdated', { detail: { atsScore: v, score: v } })); } catch (e) {}
        }
        if (typeof serverVals.aptitude !== 'undefined' && serverVals.aptitude !== null) {
          const v = parseScore(String(serverVals.aptitude));
          updates.aptitude = v; try { localStorage.setItem('aptitudeScore', String(v)); } catch (e) {}
          try { window.dispatchEvent(new CustomEvent('aptitudeScoreUpdated', { detail: { aptitudeScore: v } })); } catch (e) {}
        }
        if (typeof serverVals.average !== 'undefined' && serverVals.average !== null) {
          const v = parseScore(String(serverVals.average));
          updates.technical = v; try { localStorage.setItem('averageScore', String(v)); } catch (e) {}
          try { window.dispatchEvent(new CustomEvent('averageScoreUpdated', { detail: { averageScore: v, score: v } })); } catch (e) {}
        }
        if (typeof serverVals.gd !== 'undefined' && serverVals.gd !== null) {
          const v = parseScore(String(serverVals.gd));
          updates.gd = v; try { localStorage.setItem('gdScore', String(v)); } catch (e) {}
        }
        // If backend provides a consolidated HR score, prefer it and persist to both HR fields
        if (typeof serverVals.hrScore !== 'undefined' && serverVals.hrScore !== null) {
          const v = parseScore(String(serverVals.hrScore));
          updates.hrConf = v; try { localStorage.setItem('hrConfidence', String(v)); } catch (e) {}
          updates.hrComm = v; try { localStorage.setItem('hrCommunication', String(v)); } catch (e) {}
          try { window.dispatchEvent(new CustomEvent('hrConfidenceUpdated', { detail: { hrConfidence: v } })); } catch (e) {}
          try { window.dispatchEvent(new CustomEvent('hrCommunicationUpdated', { detail: { hrCommunication: v } })); } catch (e) {}
        }
        if (typeof serverVals.hrConf !== 'undefined' && serverVals.hrConf !== null) {
          const v = parseScore(String(serverVals.hrConf));
          updates.hrConf = v; try { localStorage.setItem('hrConfidence', String(v)); } catch (e) {}
          try { window.dispatchEvent(new CustomEvent('hrConfidenceUpdated', { detail: { hrConfidence: v } })); } catch (e) {}
        }
        if (typeof serverVals.hrComm !== 'undefined' && serverVals.hrComm !== null) {
          const v = parseScore(String(serverVals.hrComm));
          updates.hrComm = v; try { localStorage.setItem('hrCommunication', String(v)); } catch (e) {}
          try { window.dispatchEvent(new CustomEvent('hrCommunicationUpdated', { detail: { hrCommunication: v } })); } catch (e) {}
        }

        if (Object.keys(updates).length) setScores(s => ({ ...s, ...updates }));
      } catch (e) {}
    };
    fetchUserScores();

    // If unauthenticated or backend user endpoint didn't return GD, try quick latest score endpoint
    const fetchLatestQuickGd = async () => {
      try {
        const qres = await fetch('/api/score/latest?module=group-discussion');
        if (!qres.ok) return;
        const q = await qres.json().catch(() => null);
        if (q && q.found && typeof q.score === 'number') {
          const v = parseScore(q.score);
          if (v !== null) {
            setScores(s => ({ ...s, gd: v }));
            try { localStorage.setItem('gdScore', String(v)); } catch (e) {}
            try { window.dispatchEvent(new CustomEvent('gdScoreUpdated', { detail: { gdScore: v } })); } catch (e) {}
          }
        }
      } catch (e) {}
    };
    fetchLatestQuickGd();

    const onAts = () => { 
      const resumeRaw = localStorage.getItem('resumeCompanySIm') ?? localStorage.getItem('resumeCompanySim') ?? localStorage.getItem('atsScore');
      setScores(s => ({ ...s, resume: parseScore(resumeRaw) }));
    };
    const onApt = () => {
      const quizRaw = localStorage.getItem('QuizCompanySim') ?? localStorage.getItem('quizCompanySim') ?? localStorage.getItem('quizcompanysim');
      setScores(s => ({ ...s, aptitude: parseScore(quizRaw) ?? parseScore(localStorage.getItem('aptitudeScore')) }));
    };
    const onTech = () => { setScores(s => ({ ...s, technical: parseScore(localStorage.getItem('gdScore')) || parseScore(localStorage.getItem('averageScore')) })); };
    const onGd = () => {
      const gdRaw = localStorage.getItem('gdCompanySim') ?? localStorage.getItem('gdcompanysim');
      setScores(s => ({ ...s, gd: parseScore(gdRaw) ?? parseScore(localStorage.getItem('gdScore')) }));
    };
    const onHrCompanySim = () => {
      const hrRaw = localStorage.getItem('hrCompanySim') ?? localStorage.getItem('HRCompanySIm') ?? localStorage.getItem('hrcompanysim');
      setScores(s => ({ ...s, hrConf: parseScore(hrRaw) ?? parseScore(localStorage.getItem('hrConfidence')) }));
    };
    const onHrConf = () => { setScores(s => ({ ...s, hrConf: parseScore(localStorage.getItem('hrConfidence')) })); };
    const onHrComm = () => { setScores(s => ({ ...s, hrComm: parseScore(localStorage.getItem('hrCommunication')) })); };

    window.addEventListener('atsScoreUpdated', onAts);
    window.addEventListener('aptitudeScoreUpdated', onApt);
    window.addEventListener('technicalScoreUpdated', onTech);
    window.addEventListener('gdCompanySimUpdated', onGd);
    window.addEventListener('hrCompanySimUpdated', onHrCompanySim);
    window.addEventListener('averageScoreUpdated', onTech);
    window.addEventListener('gdScoreUpdated', onTech);
    window.addEventListener('hrConfidenceUpdated', onHrConf);
    window.addEventListener('hrCommunicationUpdated', onHrComm);

    const onStorage = (e) => {
      if (!e.key) return readAll();
      if (['atsScore','resumeCompanySIm','resumeCompanySim','aptitudeScore','QuizCompanySim','quizCompanySim','quizcompanysim','gdCompanySim','gdcompanysim','hrCompanySim','HRCompanySIm','hrcompanysim','technicalScore','averageScore','gdScore','hrConfidence','hrCommunication'].includes(e.key)) readAll();
    };
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('atsScoreUpdated', onAts);
      window.removeEventListener('aptitudeScoreUpdated', onApt);
      window.removeEventListener('technicalScoreUpdated', onTech);
      window.removeEventListener('gdCompanySimUpdated', onGd);
      window.removeEventListener('hrCompanySimUpdated', onHrCompanySim);
      window.removeEventListener('averageScoreUpdated', onTech);
      window.removeEventListener('hrConfidenceUpdated', onHrConf);
      window.removeEventListener('hrCommunicationUpdated', onHrComm);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // Keep track of readiness radar's overall score (preferred source for report overall)
  useEffect(() => {
    const read = () => setReadinessOverall(normalizeLocalScore(localStorage.getItem('readinessScore')));
    read();
    const onEvent = (e) => {
      if (e?.detail?.readinessScore !== undefined) setReadinessOverall(normalizeLocalScore(e.detail.readinessScore));
    };
    const onStorage = (e) => {
      if (e?.key === 'readinessScore') read();
    };
    window.addEventListener('readinessScoreUpdated', onEvent);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('readinessScoreUpdated', onEvent);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // compute derived values from scores state
  // Prefer `hrConfidence` (scores.hrConf) as authoritative HR score; fallback to hrComm if absent
  const hrScore = (scores.hrConf != null) ? Number(scores.hrConf) : (scores.hrComm ?? null);
  const perRound = [
    { key: 'Resume Screening', score: scores.resume },
    { key: 'Aptitude Round', score: scores.aptitude },
    { key: 'Group Discussion', score: scores.gd },
    { key: 'HR Interview', score: hrScore }
  ];

  const availableScores = perRound.map(r => r.score).filter(s => s !== null && typeof s !== 'undefined').map(s => Number(s));
  const computedOverall = availableScores.length ? Math.round(availableScores.reduce((a, b) => a + b, 0) / availableScores.length) : null;

  // Prefer computed overall from the per-round scores first, then readiness radar, then any stored report overall
  const overall = (computedOverall != null)
    ? computedOverall
    : (readinessOverall != null ? readinessOverall : (report?.overall != null ? Math.round(report.overall * 100) : 'N/A'));
  const confidence = report?.confidence ?? 'N/A';
  const verdict = report?.verdict || '—';
  const strengths_html = report?.strengths_html || '<em>No strengths provided</em>';
  const improvements_html = report?.improvements_html || '<em>No improvements provided</em>';

  // Persist computed overall to backend and localStorage so ReadinessRadar can consume it
  useEffect(() => {
    const saveOverall = async () => {
      if (overall === 'N/A' || overall === null) return;
      try {
        // Ensure radar and other components immediately see the report overall
        try { localStorage.setItem('readinessScore', String(overall)); } catch (e) {}
        try { window.dispatchEvent(new CustomEvent('readinessScoreUpdated', { detail: { readinessScore: Number(overall) } })); } catch (e) {}
        const rawUser = localStorage.getItem('user');
        const user = rawUser ? JSON.parse(rawUser) : null;
        const token = localStorage.getItem('token');
        const body = { userId: user?.id || user?._id || null, module: 'company-sim', score: Number(overall) };
        try {
          const apiBase = (process.env.REACT_APP_API_BASE || 'http://localhost:5000');
          const res = await fetch(apiBase + '/api/score/quick', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(body)
          });
          if (res.ok) {
            try { localStorage.setItem('readinessScore', String(overall)); } catch (e) {}
            try { window.dispatchEvent(new CustomEvent('readinessScoreUpdated', { detail: { readinessScore: overall } })); } catch (e) {}
          }
        } catch (e) {
          try { localStorage.setItem('readinessScore', String(overall)); } catch (e) {}
          try { window.dispatchEvent(new CustomEvent('readinessScoreUpdated', { detail: { readinessScore: overall } })); } catch (e) {}
        }
      } catch (e) {}
    };
    saveOverall();
  }, [overall]);

  // Also persist the full company-simulation overall score under `FullCompanySimScore`
  useEffect(() => {
    try {
      if (computedOverall !== null && typeof computedOverall !== 'undefined') {
        // store as percent string for consistency with other CompanySim keys
        const pct = String(Math.round(computedOverall)) + '%';
        try { localStorage.setItem('FullCompanySimScore', pct); } catch (e) {}
        try { window.dispatchEvent(new CustomEvent('FullCompanySimScoreUpdated', { detail: { FullCompanySimScore: pct, score: Number(computedOverall) } })); } catch (e) {}
      }
    } catch (e) {}
  }, [computedOverall]);

  // Persist Group Discussion (gd) score to backend or localStorage fallback
  const saveGdScore = async (score) => {
    if (score == null) return false;
    try {
      const rawUser = localStorage.getItem('user');
      const user = rawUser ? JSON.parse(rawUser) : null;
      const token = localStorage.getItem('token');
      const body = { userId: user?.id || user?._id || null, module: 'group-discussion', score: Number(score) };
      const apiBase = (process.env.REACT_APP_API_BASE || 'http://localhost:5000');
      if (token) {
        const res = await fetch(apiBase + '/api/score/quick', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(body)
        });
        if (res.ok) {
          try { localStorage.setItem('gdScore', String(score)); } catch (e) {}
          try { window.dispatchEvent(new CustomEvent('gdScoreUpdated', { detail: { gdScore: Number(score) } })); } catch (e) {}
          return true;
        }
      }
      // fallback: persist locally
      try { localStorage.setItem('gdScore', String(score)); } catch (e) {}
      try { window.dispatchEvent(new CustomEvent('gdScoreUpdated', { detail: { gdScore: Number(score) } })); } catch (e) {}
      return true;
    } catch (e) {
      try { localStorage.setItem('gdScore', String(score)); } catch (err) {}
      try { window.dispatchEvent(new CustomEvent('gdScoreUpdated', { detail: { gdScore: Number(score) } })); } catch (err) {}
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans p-8">
      <div className="max-w-4xl w-full mx-auto" ref={reportRef}>
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="px-3 py-2 rounded-md border border-gray-200 bg-white">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="inline-flex p-3 bg-indigo-50 rounded-full text-indigo-600">
            <BarChart3 size={28} />
          </div>
          <h1 className="text-2xl font-black">Detailed Simulation Report</h1>
        </div>

        <div>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6">
            <h2 className="text-sm font-bold text-gray-500 uppercase mb-2">Summary</h2>
            <p className="text-gray-700">This detailed report compiles metrics captured during the simulation: per-round scores, timings, stress indicators, and AI evaluation notes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Overall Score</h3>
              <div className="text-4xl font-black text-indigo-600">{overall} / 100</div>
              <p className="text-xs text-gray-400 mt-2">Aggregated from all rounds and AI assessments.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Confidence</h3>
              <div className="text-lg font-bold text-gray-900">{confidence}</div>
              <p className="text-xs text-gray-400 mt-2">AI evaluator confidence in this assessment.</p>
            </div>
          </div>

          <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">AI Evaluation</h3>
            <div className="mb-4">
              <strong>Verdict:</strong> {verdict}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-2">Strengths</h4>
                <div dangerouslySetInnerHTML={{ __html: strengths_html }} />
              </div>
              <div>
                <h4 className="font-bold mb-2">Improvements & Failures</h4>
                <div dangerouslySetInnerHTML={{ __html: improvements_html }} />
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Attempted Scores</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              {perRound.map((r) => (
                <li key={r.key} className="flex justify-between">
                  <div>
                    <div className="font-bold">{r.key}</div>
                    <div className="text-xs text-gray-400">{r.key === 'Resume Screening' ? 'Auto-evaluation of resume fit' : r.key === 'Aptitude Round' ? 'Timed assessment performance' : r.key === 'Group Discussion' ? 'Group discussion performance' : 'Behavioral fit'}</div>
                  </div>
                  <div className="font-black text-indigo-600 flex items-center gap-3">
                    <span>{r.score != null ? `${r.score}` : 'N/A'}</span>
                    
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-sm font-bold">
              Overall (computed): <span className="text-indigo-600">{overall === 'N/A' ? 'N/A' : `${overall}/100`}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button onClick={() => window.print()} className="px-4 py-3 bg-indigo-600 text-white rounded-lg flex items-center gap-2">
            <FileText size={16} /> Save as PDF
          </button>
          <button onClick={() => navigate('/company-sim')} className="px-4 py-3 border border-gray-200 rounded-lg">Return</button>
        </div>
      </div>
    </div>
  );
}
