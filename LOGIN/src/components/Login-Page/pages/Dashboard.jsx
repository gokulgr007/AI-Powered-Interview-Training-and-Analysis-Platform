import { useUser, useLogout } from "../hooks/use-auth";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { LogOut, 
  LayoutDashboard, 
  Calendar, 
  Settings, 
  Bell,
  Search,
  BookOpen,
  Code2 } from "lucide-react";

export default function Dashboard() {
  const { data: user, isLoading } = useUser();
  const logout = useLogout();
  const [, setLocation] = useLocation();

  const [mockSessions, setMockSessions] = useState(() => Number(localStorage.getItem('mockSessions') || '0'));

  // Navigate to auth if not authenticated (do in effect to avoid setState during render)
  useEffect(() => {
    if (!isLoading && !user) setLocation("/auth");
  }, [isLoading, user, setLocation]);

  useEffect(() => {
    const handler = (e) => {
      try { setMockSessions(Number(localStorage.getItem('mockSessions') || '0')); } catch (err) {}
    };
    window.addEventListener('mockSessionsUpdated', handler);
    return () => window.removeEventListener('mockSessionsUpdated', handler);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold font-display text-indigo-600 flex items-center gap-2">
            <Code2 className="w-8 h-8" /> PrepAI
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <Button variant="ghost" className="w-full justify-start text-indigo-600 bg-indigo-50 font-medium">
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-indigo-600 hover:bg-indigo-50">
            <BookOpen className="mr-3 h-5 w-5" />
            Study Plans
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-indigo-600 hover:bg-indigo-50">
            <Calendar className="mr-3 h-5 w-5" />
            Mock Interviews
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-indigo-600 hover:bg-indigo-50">
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {(user?.fullName || user?.name || user?.email || "?").charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName || user?.name || user?.email}</p>
              <p className="text-xs text-gray-500 truncate">{user?.role}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
            onClick={() => logout.mutate()}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <button className="relative p-2 text-gray-400 hover:text-gray-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 text-white shadow-xl shadow-indigo-500/20">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.fullName || user?.name || user?.email}!</h1>
            <p className="text-indigo-100 text-lg max-w-xl">
              You're on track! Your next mock interview is scheduled for tomorrow at 10:00 AM.
            </p>
            <div className="mt-6 flex gap-3">
              <Button className="bg-white text-indigo-600 hover:bg-indigo-50 border-none shadow-none">
                Start Practice
              </Button>
              <Button variant="outline" className="text-white border-white/30 hover:bg-white/10 hover:text-white">
                View Schedule
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Questions Solved", value: "124", sub: "+12 this week" },
              { label: "Mock Interviews", value: String(mockSessions), sub: "sessions" },
              { label: "Skill Score", value: "850", sub: "Top 15%" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <div className="flex items-end justify-between mt-2">
                  <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{stat.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State / Content Placeholder */}
          <div className="bg-white rounded-2xl border border-gray-200 border-dashed p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No active sessions</h3>
            <p className="text-gray-500 max-w-sm mx-auto mt-2 mb-6">
              You haven't started any practice sessions today. Choose a topic to begin your preparation.
            </p>
            <Button>Browse Topics</Button>
          </div>
        </div>
      </main>
    </div>
  );
}



