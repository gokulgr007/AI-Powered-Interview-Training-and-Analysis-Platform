import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Quiz from "../Quiz/Quiz";
import GD from "../gd--final/App";
import ResumeAnalyzer from "../Resume-Analyzer/ResumeAnalyzer";
import ProblemPage from "../technical-iterview/ProblemPage";
import HRI from "../hr_interview/HRI";

export default function MockInterview() {
  const navigate = useNavigate();
  const steps = [
    { key: "quiz", title: "Aptitude Test", comp: <Quiz /> },
    { key: "gd", title: "Group Discussion", comp: <GD /> },
    { key: "resume", title: "Resume Analysis", comp: <ResumeAnalyzer /> },
    { key: "two-sum", title: "Technical Problem", comp: <ProblemPage /> },
  ];

  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      try {
        const step = e?.detail?.step;
        if (!step) return;
        if (steps[index].key === step) {
          setCompleted(true);
        }
      } catch (err) {}
    };
    window.addEventListener('mockStepComplete', handler);
    return () => window.removeEventListener('mockStepComplete', handler);
  }, [index, steps]);

  // While the mock interview is active, prevent the page from scrolling
  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBody || '';
      document.documentElement.style.overflow = prevHtml || '';
    };
  }, []);

  const next = () => {
    if (!completed) return;
    if (index < steps.length - 1) {
      setIndex(i => i + 1);
      setCompleted(false);
      window.scrollTo(0, 0);
    } else {
      // finish interview: notify layout and go home
      try { window.dispatchEvent(new Event('mockFinish')); } catch (e) {}
      navigate('/home');
    }
  };

  return (
      <div className="fixed inset-0 bg-white z-50 overflow-auto">
        <div className="w-full h-full p-6">
        <h2 className="text-2xl font-bold mb-4">Mock Interview — {steps[index].title}</h2>
        <div className="mb-4 text-sm text-gray-600">Step {index + 1} of {steps.length}</div>

        <div className="rounded-lg overflow-hidden mb-6 bg-white shadow-sm">
          <div className="p-3 bg-white">
            {/* Render components in mockMode so they suppress scores/reports */}
            {React.cloneElement(steps[index].comp, { mockMode: true })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={next}
            disabled={!completed}
            className={`px-4 py-2 rounded ${completed ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          >
            {index < steps.length - 1 ? 'Next Section' : 'Finish Interview'}
          </button>

          <button
            onClick={() => { try { window.dispatchEvent(new Event('mockFinish')); } catch(e){}; navigate('/home'); }}
            className="px-3 py-2 rounded bg-red-50 text-red-600"
          >
            Exit Interview
          </button>

          {!completed && (
            <div className="ml-2 text-sm text-gray-500">Complete the current section to enable Next</div>
          )}
        </div>
      </div>
    </div>
  );
}
