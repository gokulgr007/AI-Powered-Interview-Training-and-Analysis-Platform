import { getDifficultyBadgeClass } from "../lib/utils";

// Removed 'allProblems', 'currentProblemId', and 'onProblemChange' from props
function ProblemDescription({ problem }) {
  
  if (!problem) return <div className="p-6">Loading problem...</div>;

  return (
    <div className="h-full overflow-y-auto bg-white">
      {/* HEADER SECTION */}
      <div className="p-6 bg-white border-b border-slate-200">
        <div className="flex items-start justify-between mb-3">
          <h1 className="text-3xl font-bold text-slate-900">{problem.title}</h1>
          <span
            className={`px-2 py-1 rounded font-semibold text-sm ${getDifficultyBadgeClass(
              problem.difficulty
            )}`}
          >
            {problem.difficulty}
          </span>
        </div>
        <p className="text-slate-600">{problem.category}</p>
        
        {/* DROPDOWN REMOVED */}
      </div>

      <div className="p-6 space-y-6">
        {/* PROBLEM DESCRIPTION */}
        <div className="bg-white rounded-xl shadow border border-slate-200 p-5">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Description</h2>
          <div className="space-y-3 text-slate-700 leading-relaxed">
            {/* Conditional check in case description is a string or an object */}
            <p>{problem.description.text || problem.description}</p>
            
            {problem.description.notes && problem.description.notes.map((note, idx) => (
              <p key={idx}>{note}</p>
            ))}
          </div>
        </div>

        {/* EXAMPLES */}
        <div className="bg-white rounded-xl shadow border border-slate-200 p-5">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Examples</h2>
          <div className="space-y-4">
            {problem.examples.map((example, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded">
                    {idx + 1}
                  </span>
                  <p className="font-semibold text-slate-900">Example {idx + 1}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm space-y-1.5 border border-slate-200">
                  <div className="flex gap-2">
                    <span className="text-indigo-600 font-bold min-w-[70px]">Input:</span>
                    <span>{example.input}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-indigo-600 font-bold min-w-[70px]">Output:</span>
                    <span>{example.output}</span>
                  </div>
                  {example.explanation && (
                    <div className="pt-2 border-t border-slate-200 mt-2">
                      <span className="text-slate-500 text-xs">
                        <span className="font-semibold">Explanation:</span> {example.explanation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONSTRAINTS */}
        <div className="bg-white rounded-xl shadow border border-slate-200 p-5">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Constraints</h2>
          <ul className="space-y-2 text-slate-700">
            {problem.constraints.map((constraint, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <code className="text-sm">{constraint}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProblemDescription;