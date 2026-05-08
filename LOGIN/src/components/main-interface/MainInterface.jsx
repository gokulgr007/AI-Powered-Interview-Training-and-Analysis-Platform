import {
  Brain,
  Target,
  Sparkles,
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowRight,
  Zap,
  Award,
  Clock,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthPage from "../Login-Page/pages/Auth";
import "../../index.css"


function MainInterface() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  

  return (
    <div className={`min-h-screen bg-white transition-all`}>
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      <div className="flex items-center gap-0">
        <img
  src="/public/logo.png"
  alt="Brain"
  className="w-25 h-15"
/>
        <span className="text-xl font-bold text-gray-900">PrepZone</span>
      </div>

      {/* Desktop Menu (UNCHANGED) */}
        <div className="hidden md:flex items-center gap-8">
        <a href="#features" className="text-gray-600 hover:text-gray-900">
          Features
        </a>
        <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">
          How It Works
        </a>
        <button
          onClick={() => setShowLogin(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Login/SignUp
        </button>
      </div>

      {/* Hamburger Button */}
      <button
        className="md:hidden text-gray-700"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>
    </div>
  </div>

  {/* Mobile Menu */}
  <div
  className={`md:hidden absolute top-16 left-0 w-full bg-white border-t border-gray-100
  transition-all duration-300 ease-out transform
  ${
    menuOpen
      ? "opacity-100 translate-y-0 pointer-events-auto"
      : "opacity-0 -translate-y-3 pointer-events-none"
  }`}
>
  <div className="flex flex-col gap-4 px-6 py-4">
    <a
      href="#features"
      onClick={() => setMenuOpen(false)}
      className="text-gray-700 font-medium"
    >
      Features
    </a>

    <a
      href="#how-it-works"
      onClick={() => setMenuOpen(false)}
      className="text-gray-700 font-medium"
    >
      How It Works
    </a>

    <button
      onClick={() => {
        setShowLogin(true);
        setMenuOpen(false);
      }}
      className="w-full bg-blue-600 text-white py-2 rounded-lg"
    >
      Login / Sign Up
    </button>
  </div>
</div>

</nav>

      <main className="pt-0">
  <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-32">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT CONTENT */}
        <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mx-auto lg:mx-0">
            <Sparkles className="w-4 h-4" />
            AI-Powered Interview Mastery
          </div>

          {/* ✅ RESPONSIVE HEADLINE */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Ace Your Next Interview with
            <span className="text-blue-600"> AI Coaching</span>
          </h1>

          {/* ✅ RESPONSIVE PARAGRAPH */}
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Practice with our advanced AI interviewer, get instant feedback, and land your dream job.
            Personalized preparation that adapts to your industry and experience level.
          </p>

          <div className="flex justify-center lg:justify-start">
            <button onClick={() => setShowLogin(true)}
              className="group px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 text-lg font-semibold shadow-lg hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* ✅ STACKED ON MOBILE */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8 pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-gray-600 text-sm sm:text-base">
                Practice anytime, anywhere
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-gray-600 text-sm sm:text-base">
                Trusted by 5,000+ professionals
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative bg-gradient-to-br from-blue-600 to-emerald-600 
                rounded-2xl p-5 sm:p-6 md:p-8 shadow-2xl 
                w-full max-w-sm sm:max-w-md
                min-h-[420px] sm:min-h-0
                flex items-center">
            
            <div className="space-y-4 sm:space-y-6 w-full">

              {/* CHAT CARD */}
              <div className="bg-white/95 backdrop-blur rounded-lg p-4 sm:p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded-full w-28 sm:w-32 mb-2"></div>
                    <div className="h-2 bg-gray-100 rounded-full w-40 sm:w-48"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-100 rounded-full"></div>
                  <div className="h-2 bg-gray-100 rounded-full w-5/6"></div>
                </div>
              </div>

              {/* ✅ PERFORMANCE CARD (FIXED) */}
              <div className="bg-white/95 backdrop-blur rounded-lg p-4 sm:p-6 relative z-10">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">
                    Performance Score
                  </span>
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                </div>

                {/* ✅ RESPONSIVE SCORE */}
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  92%
                </div>

                <div className="flex items-center gap-2 text-emerald-600 text-xs sm:text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  <span>+15% from last session</span>
                </div>
              </div>
            </div>
          </div>
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-400 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-400 rounded-full blur-3xl opacity-60"></div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our AI-powered platform provides comprehensive interview preparation tailored to your career goals
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: 'AI Interview Simulator',
                  description: 'Practice with our advanced AI that mimics real interviewers across different industries and roles',
                  color: 'blue'
                },
                {
                  icon: Zap,
                  title: 'Instant Feedback',
                  description: 'Get real-time analysis of your responses, body language, and speaking patterns',
                  color: 'emerald'
                },
                {
                  icon: Target,
                  title: 'Personalized Learning',
                  description: 'Adaptive preparation plans based on your experience level and target role',
                  color: 'blue'
                },
                {
                  icon: TrendingUp,
                  title: 'Progress Tracking',
                  description: 'Monitor your improvement with detailed analytics and performance metrics',
                  color: 'emerald'
                },
                {
                  icon: Users,
                  title: 'Industry Experts',
                  description: 'Questions curated by hiring managers and industry professionals',
                  color: 'blue'
                },
                {
                  icon: Clock,
                  title: '24/7 Availability',
                  description: 'Practice anytime, anywhere, at your own pace with unlimited sessions',
                  color: 'emerald'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group p-8 rounded-2xl border-2 border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all bg-white"
                >
                  <div className={`w-14 h-14 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-7 h-7 text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get started in minutes and see results in days
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-emerald-200 to-blue-200"></div>
              {[
                {
                  step: '01',
                  title: 'Set Your Goal',
                  description: 'Tell us about your target role, industry, and experience level'
                },
                {
                  step: '02',
                  title: 'Practice with AI',
                  description: 'Engage in realistic mock interviews with instant AI feedback'
                },
                {
                  step: '03',
                  title: 'Land the Job',
                  description: 'Track your progress and ace your real interview with confidence'
                }
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center mb-6 text-white text-2xl font-bold">
                      {step.step}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-br from-blue-600 to-emerald-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Ace Your Next Interview?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of professionals who have landed their dream jobs with PrepZone
            </p>
            <button onClick={() => setShowLogin(true)} className="group px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-lg font-semibold shadow-xl mx-auto">
              Start Your Journey Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-blue-100 mt-6">Learn at your own pace • Powered by advanced AI</p>
          </div>
        </section>

        <footer className="bg-gray-900 text-gray-400 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-6 h-6 text-blue-500" />
                  <span className="text-lg font-bold text-white">PrepZone</span>
                </div>
                <p className="text-sm leading-relaxed">
                  Practice | Prepare | Perform
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-sm text-center">
              <p>&copy; PrepZone. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>

      {/* Login now navigates to full /login page instead of modal */}
      {showLogin && (
        <AuthPage closeModal={() => setShowLogin(false)} />
      )}
    </div>
  );
}

export default MainInterface;
