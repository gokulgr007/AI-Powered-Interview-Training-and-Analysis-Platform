import { ArrowRight, Terminal } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-center items-center relative overflow-hidden p-6 font-sans">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#4f46e5_1px,_transparent_1px)] bg-[length:40px_40px]" />
      </div>

      <div className="max-w-3xl w-full text-center z-10 space-y-12">
        <header className="space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
            <Terminal size={32} strokeWidth={1.5} />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Ready to <span className="text-indigo-600">Code</span> the Future?
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Show us your problem-solving skills, architectural thinking, and clean code practices.
          </p>
        </header>

        <div className="pt-4">
          <button 
            data-testid="button-start-interview"
            onClick={() => navigate("/problem/two-sum")}
            className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 active:scale-95"
          >
            <span className="mr-2">Start the Interview</span>
            <ArrowRight size={24} strokeWidth={2.5} />
          </button>
          
          <p className="mt-6 text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase">
            ESTIMATED TIME: 45 MINUTES
          </p>
        </div>
      </div>
    </div>
  );
}
