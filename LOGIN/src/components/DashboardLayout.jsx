import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  Code2,
  User2,
  LogOut,
  Menu,
  X,
  BotMessageSquare,
  Settings,
  FileUser,
  MapPinHouse,
  ClipboardList,
  SquareCode,
} from "lucide-react";

export default function DashboardLayout({ children, activeNav }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mockActive, setMockActive] = useState(false);
  const [hideSidebar, setHideSidebar] = useState(false);
  const [mockStep, setMockStep] = useState(0);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Resolve avatar URL from common OAuth / provider fields.
  const resolveAvatar = (u) => {
    if (!u) return null;
    const candidates = [u.avatar, u.photoURL, u.picture, u.profilePic, u.image, u.imageUrl, u.photoUrl];
    for (const c of candidates) {
      if (typeof c === "string" && c.trim()) return c;
    }
    if (u.providerData && Array.isArray(u.providerData)) {
      for (const p of u.providerData) {
        if (p && (p.photoURL || p.photoUrl)) return p.photoURL || p.photoUrl;
      }
    }
    if (u.data && (u.data.photoURL || u.data.photoUrl)) return u.data.photoURL || u.data.photoUrl;
    return null;
  };

  const avatarUrl = resolveAvatar(user);
  // If no provider avatar is present, fall back to an initials avatar service
  const initialsFallback = (u) => {
    const name = (u && (u.name || u.fullName || u.displayName)) || u?.email || "User";
    const parts = name.split(" ").filter(Boolean).slice(0,2);
    const label = parts.length ? parts.join("+") : name;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(label)}&background=4f46e5&color=ffffff&size=128`;
  };

  const finalAvatar = avatarUrl || initialsFallback(user || {});


  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    // Ensure body can scroll while dashboard is mounted
    try {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    } catch (e) {}
    return () => {
      try {
        document.body.style.overflow = prevBody || "";
        document.documentElement.style.overflow = prevHtml || "";
      } catch (e) {}
    };
  }, []);

  // Listen for external finish events (dispatched by MockInterview)
  useEffect(() => {
    const handler = (e) => {
      finishMockInterview();
    };
    window.addEventListener("mockFinish", handler);
    return () => window.removeEventListener("mockFinish", handler);
  }, []);

  // Listen for requests to hide/show the sidebar (full-screen pages)
  useEffect(() => {
    const onEnter = () => setHideSidebar(true);
    const onExit = () => setHideSidebar(false);
    window.addEventListener("enterFullScreen", onEnter);
    window.addEventListener("exitFullScreen", onExit);
    return () => {
      window.removeEventListener("enterFullScreen", onEnter);
      window.removeEventListener("exitFullScreen", onExit);
    };
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const startMockInterview = () => {
    setMockActive(true);
    setMockStep(0);
    navigate("/mock-interview");
    setIsOpen(false);
  };

  const finishMockInterview = () => {
    setMockActive(false);
    setMockStep(0);
    try {
      const prev = Number(localStorage.getItem("mockSessions") || "0");
      const next = prev + 1;
      localStorage.setItem("mockSessions", String(next));
      window.dispatchEvent(new CustomEvent("mockSessionsUpdated", { detail: { sessions: next } }));
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col md:flex-row">
      {/* MOBILE TOP BAR - Only visible on small screens */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-[100]">
        <h1 className="text-xl font-semibold text-indigo-600">Prep Zone</h1>
        <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* OVERLAY - Darkens background when sidebar is open on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[80] md:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* SIDEBAR - hidden while mock interview active or when a full-screen view requests it */}
      {!mockActive && !hideSidebar && (
        <aside 
          className={`fixed left-0 top-0 h-screen max-h-screen w-72 bg-white border-r border-black/10 overflow-hidden flex flex-col justify-between z-[90] transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
          <div className="flex-1 overflow-y-auto">
            {/* Updated Header Section */}
    <div className="px-6 py-6 flex items-start justify-between">
      <div>
        <h1 className="text-xl font-semibold text-indigo-600 leading-tight">Prep Zone</h1>
        <p className="text-sm text-gray-600 opacity-100 block">Interview Platform</p>
      </div>
      
      {/* Mobile Close Button - Only visible on small screens */}
      <button 
        onClick={toggleSidebar} 
        className="md:hidden p-1 -mr-2 text-gray-500 hover:text-black cursor-pointer"
      >
        <X size={24} />
      </button>
    </div>

    <nav className="px-4 space-y-2 mt-2">
      <NavItem
        icon={<LayoutDashboard size={18} />}
        label="Dashboard"
        active={activeNav === "dashboard"}
        disabled={mockActive}
        onClick={() => { navigate("/home"); setIsOpen(false); }}
      />
      {/* <NavItem
        icon={<LayoutDashboard size={18} />}
        label="Mock Interview"
        active={activeNav === "Mock Interview"}
        onClick={() => { startMockInterview(); }}
      /> */}
      {/* ... rest of your NavItems ... */}
      <NavItem
        icon={<FileText size={18} />}
        label="Aptitude Test"
        active={activeNav === "quiz"}
        disabled={mockActive}
        onClick={() => { navigate("/quiz"); setIsOpen(false); }}
      />
      <NavItem
        icon={<Users size={18} />}
        label="Group Discussion"
        active={activeNav === "Group Discussion"} 
        disabled={mockActive}
        onClick={() => { navigate("/group-discussion-lobby"); setIsOpen(false); }}
      />
      <NavItem
        icon={<FileUser size={18} />}
        label="Resume Analysis"
        active={activeNav === "resume"}
        disabled={mockActive}
        onClick={() => { navigate("/resume-analyzer"); setIsOpen(false); }}
      />
      <NavItem
        icon={<Code2 size={18} />}
        label="Technical Interview"
        active={activeNav === "technical"}
        disabled={mockActive}
        onClick={() => { navigate("/technical-interview-main"); setIsOpen(false); }}
      />
      <NavItem
        icon={<User2 size={18} />}
        label="HR Interview"
        active={activeNav === "F-D Interview"}
        disabled={mockActive}
        onClick={() => { navigate("/hr-interview"); setIsOpen(false); }}
      />

      <NavItem
        icon={<BotMessageSquare size={18} />}
        label="Interview Mentor"
        active={activeNav === "Interview Mentor"}
        disabled={mockActive}
        onClick={() => { navigate("/interview-mentor"); setIsOpen(false); }}
      />

      <NavItem
        icon={<BotMessageSquare size={18} />}
        label="Company Simulation"
        active={activeNav === "Company Simulation"}
        disabled={mockActive}
        onClick={() => { navigate("/company-sim"); setIsOpen(false); }}
      />

      {/* <NavItem
        icon={<BotMessageSquare size={18} />}
        label="skill Roadmap"
        active={activeNav === "Skill Roadmap"}
        disabled={mockActive}
        onClick={() => { navigate("/skill-roadmap"); setIsOpen(false); }}
      /> */}

      <NavItem
        icon={<User2 size={18} />}
        label="Readiness Radar"
        active={activeNav === "Readiness Radar"}
        disabled={mockActive}
        onClick={() => { navigate("/readiness-radar"); setIsOpen(false); }}
      />

      {/* <NavItem
        icon={<MapPinHouse size={18} />}
        label="Journey Timeline"
        active={activeNav === "Journey Timeline"}
        disabled={mockActive}
        onClick={() => { navigate("/journey-timeline"); setIsOpen(false); }}
      /> */}

      <NavItem
        icon={<ClipboardList size={18} />}
        label="Performance Report"
        active={activeNav === "Performance Report"}
        disabled={mockActive}
        onClick={() => { navigate("/performance-report"); setIsOpen(false); }}
      />

      {/* <NavItem
        icon={<SquareCode size={18} />}
        label="Coding Intelligence"
        active={activeNav === "Coding Intelligence"}
        disabled={mockActive}
        onClick={() => { navigate("/coding-intelligence"); setIsOpen(false); }}
      /> */}

      <NavItem
        icon={<Settings size={18} />}
        label="Settings"
        active={activeNav === "settings"}
        disabled={mockActive}
        onClick={() => { navigate("/settings"); setIsOpen(false); }}
      />
    </nav>
  </div>

  {/* USER PROFILE SECTION - Remains the same */}
  <div onClick={()=>navigate('/profile')} className="cursor-pointer px-6 py-6 border-t border-black/10">
    <div className="flex items-center gap-3">
      {finalAvatar ? (
        <img
          src={finalAvatar}
          alt="Profile"
          className="w-10 h-10 rounded-full border object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/default-avatar.png";
          }}
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
          <User2 size={20} />
        </div>
      )}

      <div className="overflow-hidden">
        <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
        <p className="text-xs text-gray-500 truncate">{user?.email || "Account"}</p>
      </div>
    </div>
      {/* MAIN CONTENT AREA */}
  </div>
</aside>
      )}

      {/* MAIN CONTENT AREA */}
      {/* md:ml-72 ensures the main content starts AFTER the sidebar on desktop.
          w-full ensures it takes up the remaining space.
      */}
      <main className={"flex-1 " + (mockActive || hideSidebar ? "" : "md:ml-72") + " min-h-screen bg-gray-50/30 p-4 md:p-10"}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, disabled }) {
  const base = `flex items-center gap-3 px-4 py-3 rounded-xl transition`;
  const activeCls = active ? "bg-indigo-100 text-indigo-600" : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600";
  const disabledCls = disabled ? "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-gray-700" : "cursor-pointer";

  return (
    <div
      className={`${base} ${activeCls} ${disabledCls}`}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        if (onClick) onClick(e);
      }}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}