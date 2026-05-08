import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { ChevronRightIcon, Code2Icon, ChevronLeft } from "lucide-react"; // Added ChevronLeft
import { PROBLEMS } from "./data/problems";
import { getDifficultyBadgeClass } from "./lib/utils";

function ProblemsPage() {
  const problems = Object.values(PROBLEMS);
  const navigate = useNavigate(); // Hook for navigation

  const easyProblemsCount = problems.filter(p => p.difficulty === "Easy").length;
  const mediumProblemsCount = problems.filter(p => p.difficulty === "Medium").length;
  const hardProblemsCount = problems.filter(p => p.difficulty === "Hard").length;

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER NAV - Matches the ProblemPage style */}
      <nav className="h-14 border-b bg-slate-50 flex items-center px-4 sticky top-0 z-10">
        <button
          onClick={() => navigate("/technical-interview-main")}
          className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 font-medium transition-colors p-1"
        >
          <ChevronLeft size={20} />
          <span className="text-sm">Back to Dashboard</span>
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">

        {/* HEADER */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-4xl font-bold text-black mb-2">
            Practice Problems
          </h1>
          <p className="text-sm sm:text-base text-gray-700">
            Sharpen your coding skills with these curated problems
          </p>
        </div>

        {/* PROBLEMS LIST */}
        <div className="space-y-4">
          {problems.map(problem => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className="block rounded-xl bg-white p-4 sm:p-6 shadow-md 
                         hover:shadow-lg border border-transparent hover:border-indigo-100 transition active:scale-[0.99]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                {/* LEFT */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">

                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-indigo-50 
                                    flex items-center justify-center shrink-0">
                      <Code2Icon className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base sm:text-xl font-semibold text-black truncate">
                          {problem.title}
                        </h2>

                        <span
                          className={`px-2 py-0.5 text-[10px] sm:text-xs font-bold uppercase rounded-full
                          ${getDifficultyBadgeClass(problem.difficulty)}`}
                        >
                          {problem.difficulty}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-500">
                        {problem.category}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-gray-800 line-clamp-2 sm:line-clamp-none">
                    {problem.description.text}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-1 sm:gap-2 text-indigo-600 font-bold
                                self-end sm:self-auto group">
                  <span className="hidden sm:inline">Solve</span>
                  <ChevronRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* FOOTER STATS */}
        <div className="mt-10 sm:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Stat label="Total" value={problems.length} color="text-indigo-600" />
          <Stat label="Easy" value={easyProblemsCount} color="text-emerald-600" />
          <Stat label="Medium" value={mediumProblemsCount} color="text-amber-600" />
          <Stat label="Hard" value={hardProblemsCount} color="text-rose-600" />
        </div>

      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="rounded-xl bg-white p-4 sm:p-6 shadow-sm border border-slate-100 text-center">
      <p className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-slate-500 mb-1">{label}</p>
      <p className={`text-2xl sm:text-3xl font-black ${color}`}>
        {value}
      </p>
    </div>
  );
}

export default ProblemsPage;