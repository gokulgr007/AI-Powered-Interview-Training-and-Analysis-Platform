import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { FileText, CloudUpload, Sparkles, Upload, Briefcase, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

function ResumeAnalyzer({ mockMode = false, onAnalyzed }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        setError("");
      } else {
        setError("Please upload a PDF file only");
        setSelectedFile(null);
      }
    }
  };
  const navigation=useNavigate();
  const ResumeBuild=()=>{
    navigation("/resume-builder/app");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !jobDescription) return;

    setIsAnalyzing(true);
    setError("");
    setResult("");

    try {
      const formData = new FormData();
      formData.append("resume", selectedFile);
      formData.append("job_description", jobDescription);
      const response = await fetch("http://127.0.0.1:5001/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Server response:", text);
        throw new Error("Backend error");
      }

      const data = await response.json();
      setResult(data.analysis);
      if (mockMode) {
        try { window.dispatchEvent(new CustomEvent('mockStepComplete', { detail: { step: 'resume' } })); } catch (e) {}
      }

      // Try to extract ATS score from response and persist it
      let ats = null;
      if (data.atsScore != null) ats = data.atsScore;
      else if (data.ats_score != null) ats = data.ats_score;
      else if (data.score != null) ats = data.score;
      else if (typeof data.analysis === 'string') {
        const text = data.analysis || '';
        let v = null;

        // Try strict, ATS-specific patterns first
        const patterns = [
          /ATS\s*(?:Match(?:\s*Score)?|Score)?\s*[:\-]?\s*(\d{1,3})\s*\/\s*100/i,
          /ATS\s*(?:Match(?:\s*Score)?|Score)?\s*[:\-]?\s*(\d{1,3})\s*%/i,
          /ATS\s*(?:Match(?:\s*Score)?|Score)?\s*[:\-]?\s*(\d{1,3})\b/i,
          /Match\s*(?:Score)?\s*[:\-]?\s*(\d{1,3})\s*%/i,
          /Match\s*(?:Score)?\s*[:\-]?\s*(\d{1,3})\s*\/\s*100/i
        ];
        for (const p of patterns) {
          const m = text.match(p);
          if (m) { v = parseInt(m[1], 10); break; }
        }

        // If not found, inspect line-by-line for lines that mention ATS or Match
        if (v === null) {
          const lines = text.split(/\r?\n/);
          for (const line of lines) {
            if (/ATS/i.test(line) || /\bMatch\b/i.test(line)) {
              const m = line.match(/(\d{1,3})/);
              if (m) { v = parseInt(m[1], 10); break; }
            }
          }
        }

        // Last resort: any percent value in the text
        if (v === null) {
          const m = text.match(/(\d{1,3})\s*%/);
          if (m) v = parseInt(m[1], 10);
        }

        if (v !== null && !Number.isNaN(v)) {
          // clamp to 0-100
          ats = Math.max(0, Math.min(100, v));
        }
      }

      if (ats != null && !Number.isNaN(parseInt(ats, 10))) {
        const v = parseInt(ats, 10);
        try {
          // Always cache locally and notify UI listeners so simulation/mock flows work
          try { localStorage.setItem('atsScore', String(v)); } catch (e) {}
          try { window.dispatchEvent(new CustomEvent('atsScoreUpdated', { detail: { score: v, atsScore: v } })); } catch (e) {}

          // In non-mock mode and if authenticated, persist to backend as well
          if (!mockMode) {
            const token = localStorage.getItem('token');
if (token) {
  fetch('http://localhost:5000/api/user/scores', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ atsScore: v })
  }).then(res => {
    if (res.ok) {
      try { toast.success('ATS score saved'); } catch (e) {}
    }
  }).catch(() => {});
}

          }
        } catch (e) {}
      }

        // (no immediate dispatch here) — notify when the result is rendered below

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsAnalyzing(false);
    }
  };

    // Dispatch resumeAnalyzed only after the analysis result is set and rendered
    useEffect(() => {
      if (!result) return;
      try { window.dispatchEvent(new CustomEvent('resumeAnalyzed', { detail: { ats: null } })); } catch (e) {}
      try { localStorage.setItem('resumeAnalyzed', '1'); } catch (e) {}
      try { if (typeof onAnalyzed === 'function') onAnalyzed(); } catch (e) {}
    }, [result]);

  return (
    <div className="bg-white px-4 py-1">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-6">
        
        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="border border-gray-200 rounded-xl p-5 shadow-md space-y-4"
        >
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="text-indigo-600" />
            Resume Analyzer AI
          </h1>

          {/* Upload */}
          <div>
  <label className="flex items-center gap-2 font-semibold mb-3">
    <FileText className="text-indigo-600" />
    Upload Resume
  </label>

  <input
    type="file"
    accept=".pdf"
    id="resume-upload"
    onChange={handleFileChange}
    className="hidden"
  />

  <label
    htmlFor="resume-upload"
    className="flex flex-col items-center justify-center h-28 border border-dashed border-dashed border-indigo-300 rounded-xl cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition"
  >
    <CloudUpload className="w-12 h-12 text-indigo-600 mb-2" />
    <span className="text-sm font-medium text-indigo-700">
      {selectedFile ? selectedFile.name : "Click to choose PDF file"}
    </span>
    <span className="text-xs text-indigo-500 mt-1">
      PDF only (max 10MB)
    </span>
  </label>

  {selectedFile && (
    <div className="mt-3 flex items-center gap-2 text-green-600">
      <CheckCircle size={16} />
      File selected successfully
    </div>
  )}
</div>


          {/* Job Description */}
          <div>
            <label className="flex items-center gap-2 font-semibold mb-2">
              <Briefcase className="text-indigo-600" />
              Job Description
            </label>
            <textarea
              className="w-full h-40 border rounded-xl p-3"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description here..."
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
          </button>

          <h2 className="text-sm font-medium text-black">Don't Have A Resume? <button onClick={ResumeBuild} className="text-indigo-700 cursor-pointer">Click here</button></h2>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-600">
              <XCircle size={18} />
              {error}
            </div>
          )}
        </form>

        {/* RESULT */}
        <div className="border border-gray-200 rounded-xl p-5 shadow-md">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-600" />
            Analysis Result
          </h2>

          {result ? (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(result) }}
            />
          ) : (
            <p className="text-gray-500">Upload a resume to see the analysis.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* SIMPLE MARKDOWN PARSER */
function parseMarkdown(md) {
  return md
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br />");
}

export default ResumeAnalyzer;
