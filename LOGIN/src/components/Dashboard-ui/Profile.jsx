import React, { useState, useEffect, useRef } from 'react';
import { 
  User, User2, Settings, Shield, Bell, CreditCard, 
  LogOut, ChevronRight, Check, AlertTriangle, 
  Download, Moon, Globe, Lock, Eye, EyeOff,
  CheckCircle2, X, Edit2, Save, Mail, Phone,
  Briefcase, Award, Clock, Target, Zap, TrendingUp,
  FileText, Layout, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Login-Page/hooks/use-auth';
import PhoneEditor from './PhoneInput';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';

// --- MOCK DATA: PROFILE ---
const USER_DATA = {
  name: "Alex Mercer",
  email: "alex.mercer@example.com",
  phone: "+1 (555) 012-3456",
  role: "Senior Frontend Engineer",
  bio: "add bio here",
  avatar: "AM"
};

const PROGRESS_STATS = [
  { label: "Readiness Score", value: "72/100", icon: Target },
  { label: "Sessions Done", value: "24", icon: Clock },
  { label: "Practice Hours", value: "32.5", icon: Zap },
  { label: "Current Streak", value: "5 Days", icon: TrendingUp },
];

const MODULE_PERFORMANCE = [
  { id: 1, name: "Technical Interview", score: 92, status: "Ready", next: "Maintain streak" },
  { id: 2, name: "Aptitude Logic", score: 85, status: "Good", next: "Try Advanced mode" },
  { id: 3, name: "HR & Behavioral", score: 55, status: "Needs Focus", next: "Start Simulation" },
  { id: 4, name: "Group Discussion", score: 60, status: "Average", next: "Watch tutorials" },
];

const ACHIEVEMENTS = [
  { id: 1, title: "Tech Wizard", desc: "Scored 90+ in Coding", unlocked: true },
  { id: 2, title: "Consistency King", desc: "7 Day Streak", unlocked: true },
  { id: 3, title: "HR Master", desc: "Complete 5 HR Sims", unlocked: false },
];

const RADAR_DATA = [
  { subject: 'Aptitude', A: 85, fullMark: 100 },
  { subject: 'Tech', A: 92, fullMark: 100 },
  { subject: 'HR', A: 55, fullMark: 100 },
  { subject: 'Confidence', A: 70, fullMark: 100 },
  { subject: 'Stress', A: 60, fullMark: 100 },
];

// --- MOCK DATA: SETTINGS ---
const INVOICES = [
  { id: '#INV-004', date: 'Oct 01, 2025', amount: '$19.00', status: 'Paid' },
  { id: '#INV-003', date: 'Sep 01, 2025', amount: '$19.00', status: 'Paid' },
];

const PLANS = [
  { name: 'Free', price: '$0', features: ['3 Practice Sessions/mo', 'Basic Analytics', 'Community Access'], current: false },
  { name: 'Pro', price: '$19', features: ['Unlimited Simulations', 'AI Mentor Chat', 'Deep Failure Analysis'], current: true },
];

// --- HELPER COMPONENTS ---

const Toggle = ({ enabled, onToggle }) => (
  <button 
    onClick={onToggle}
    className={`w-11 h-6 flex items-center rounded-full transition-colors ${enabled ? 'bg-indigo-600' : 'bg-gray-200'}`}
  >
    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}></div>
  </button>
);

const InputGroup = ({ label, type = "text", placeholder, value }) => (
  <div className="mb-4">
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
    <input 
      type={type} 
      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
      placeholder={placeholder}
      defaultValue={value}
    />
  </div>
);

const ProfileField = ({ icon: Icon, label, value, isEditing, name, onChange, readOnly = false }) => (
  <div className="mb-4">
    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-2.5 text-gray-400">
        <Icon size={16} />
      </div>
      {isEditing && !readOnly ? (
        <input 
          type="text" 
          name={name}
          value={value} 
          onChange={onChange}
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
        />
      ) : (
        <div className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm font-bold text-gray-900 ${readOnly ? 'bg-gray-50 text-gray-500' : 'bg-white border border-transparent'}`}>
          {value}
        </div>
      )}
    </div>
  </div>
);

// --- MAIN CONTENT VIEWS ---

// 1. USER PROFILE VIEW (Integrated)
const UserProfileView = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(USER_DATA);
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const { data: user } = useUser();
  const fileInputRef = useRef(null);
  const [showEditAction, setShowEditAction] = useState(false);
  const [avatarOptionsOpen, setAvatarOptionsOpen] = useState(false);
  const [scores, setScores] = useState({ atsScore: null, aptitudeScore: null, gdScore: null, averageScore: null });
  const [readiness, setReadiness] = useState(() => {
    try {
      const v = localStorage.getItem('readinessScore');
      if (v !== null) return Number(v);
    } catch (e) {}
    return null;
  });

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/user/scores', {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        if (!res.ok) return;
        const data = await res.json();
        setScores({
          atsScore: typeof data.atsScore !== 'undefined' ? data.atsScore : null,
          aptitudeScore: typeof data.aptitudeScore !== 'undefined' ? data.aptitudeScore : null,
          gdScore: typeof data.gdScore !== 'undefined' ? data.gdScore : null,
          averageScore: typeof data.averageScore !== 'undefined' ? data.averageScore : null,
        });
      } catch (e) {
        console.error('Failed to fetch scores', e);
      }
    };

    fetchScores();
  }, [user]);

  // Listen for readinessScore updates dispatched by the ReadinessRadar component
  useEffect(() => {
    const handler = (e) => {
      try {
        if (e?.detail?.readinessScore !== undefined) {
          const n = Number(e.detail.readinessScore);
          if (!Number.isNaN(n)) setReadiness(Math.round(n));
        } else {
          // fallback to reading localStorage
          const v = localStorage.getItem('readinessScore');
          if (v !== null) setReadiness(Number(v));
        }
      } catch (err) {}
    };
    window.addEventListener('readinessScoreUpdated', handler);
    return () => window.removeEventListener('readinessScoreUpdated', handler);
  }, []);

  const statusFor = (score) => {
    if (score === null || typeof score === 'undefined') return 'No Data';
    if (score >= 80) return 'Ready';
    if (score >= 60) return 'Good';
    return 'Needs Focus';
  };

  const progressStats = [
    { label: 'Readiness Score', value: (readiness !== null && readiness !== undefined) ? `${readiness}/100` : (scores.averageScore !== null && typeof scores.averageScore !== 'undefined' ? `${scores.averageScore}/100` : '—'), icon: Target },
    { label: 'Sessions Done', value: user?.sessionsDone ?? user?.sessions ?? '0', icon: Clock },
    { label: 'Practice Hours', value: user?.practiceHours ?? '0', icon: Zap },
    { label: 'Current Streak', value: user?.streakDays ? `${user.streakDays} Days` : '0 Days', icon: TrendingUp },
  ];

  const modulePerformance = [
    { id: 1, name: 'Technical Interview', score: scores.atsScore ?? 0, status: statusFor(scores.atsScore), next: 'Maintain streak' },
    { id: 2, name: 'Aptitude Logic', score: scores.aptitudeScore ?? 0, status: statusFor(scores.aptitudeScore), next: 'Try Advanced mode' },
    { id: 3, name: 'HR & Behavioral', score: scores.gdScore ?? 0, status: statusFor(scores.gdScore), next: 'Start Simulation' },
    { id: 4, name: 'Group Discussion', score: 0, status: 'No Data', next: 'Watch tutorials' },
  ];
  // Load profile from user data or per-user localStorage (prefers saved local profile)
  useEffect(() => {
    const storageKey = `profile_${user?.email || user?.id || 'guest'}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile((p) => ({ ...p, ...parsed }));
      } else if (user) {
        setProfile((p) => ({
          ...p,
          name: user.name || user.fullName || p.name,
          email: user.email || p.email,
          phone: user.phone || p.phone,
          role: user.role || p.role,
          bio: user.bio || p.bio,
        }));
      }
    } catch (err) {
      if (user) {
        setProfile((p) => ({
          ...p,
          name: user.name || user.fullName || p.name,
          email: user.email || p.email,
          phone: user.phone || p.phone,
          role: user.role || p.role,
          bio: user.bio || p.bio,
        }));
      }
    }

    const possibleAvatar = user?.avatar || user?.avatarUrl || user?.photoURL || user?.picture || null;
    setAvatarUrl(possibleAvatar);
  }, [user]);

  const handleAvatarFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const dataUrl = e.target.result;
        setAvatarUrl(dataUrl);
        // persist locally
        try {
          const userRaw = localStorage.getItem('user');
          const u = userRaw ? JSON.parse(userRaw) : {};
          u.avatar = dataUrl;
          localStorage.setItem('user', JSON.stringify(u));
          try { window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: { user: u } })); } catch (e) {}
        } catch (err) {}
        // attempt to persist to backend (best-effort)
        try {
          const token = localStorage.getItem('token');
          await fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ avatar: dataUrl })
          });
          // refresh server-side user if returned
          try {
            const token2 = localStorage.getItem('token');
            const meRes = await fetch('/api/auth/me', { headers: token2 ? { Authorization: `Bearer ${token2}` } : {} });
            if (meRes.ok) {
              const serverUser = await meRes.json();
              try { localStorage.setItem('user', JSON.stringify(serverUser)); } catch (e) {}
              try { window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: { user: serverUser } })); } catch (e) {}
            }
          } catch (e) {}
        } catch (err) {}
      } catch (err) {}
    };
    reader.readAsDataURL(file);
  };

  const onChooseAvatar = () => {
    try { fileInputRef.current && fileInputRef.current.click(); } catch (e) {}
  };

  const onRemoveAvatar = async () => {
    setAvatarUrl(null);
    try {
      const userRaw = localStorage.getItem('user');
      const u = userRaw ? JSON.parse(userRaw) : {};
      delete u.avatar;
      localStorage.setItem('user', JSON.stringify(u));
      try { window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: { user: u } })); } catch (e) {}
    } catch (e) {}
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
      });
      try {
        const token2 = localStorage.getItem('token');
        const meRes = await fetch('/api/auth/me', { headers: token2 ? { Authorization: `Bearer ${token2}` } : {} });
        if (meRes.ok) {
          const serverUser = await meRes.json();
          try { localStorage.setItem('user', JSON.stringify(serverUser)); } catch (e) {}
          try { window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: { user: serverUser } })); } catch (e) {}
        }
      } catch (e) {}
    } catch (e) {}
  };

  // Clicking the small pencil toggles the transient action; if the action is visible
  // and avatar exists (or was set previously), open the modal of avatar options.
  const onPencilClick = (e) => {
    e.stopPropagation();
    if (!showEditAction) {
      setShowEditAction(true);
      // auto-hide after 6s
      setTimeout(() => setShowEditAction(false), 6000);
      return;
    }
    // if action already visible, open the options modal
    setAvatarOptionsOpen(true);
  };

  const applyGoogleAvatar = async () => {
    const googleUrl = user?.photoURL || user?.avatar || user?.picture || user?.avatarUrl || null;
    if (!googleUrl) return;
    setAvatarUrl(googleUrl);
    try {
      const uRaw = localStorage.getItem('user');
      const u = uRaw ? JSON.parse(uRaw) : {};
      u.avatar = googleUrl;
      localStorage.setItem('user', JSON.stringify(u));
      try { window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: { user: u } })); } catch (e) {}
    } catch (e) {}
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/user/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ avatar: googleUrl }) });
    } catch (e) {}
    setAvatarOptionsOpen(false);
  };

  const applyDefaultAvatar = async () => {
    setAvatarUrl(null);
    try {
      const uRaw = localStorage.getItem('user');
      const u = uRaw ? JSON.parse(uRaw) : {};
      delete u.avatar;
      localStorage.setItem('user', JSON.stringify(u));
      try { window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: { user: u } })); } catch (e) {}
    } catch (e) {}
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/user/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ avatar: null }) });
    } catch (e) {}
    setAvatarOptionsOpen(false);
  };

  const storageKeyForUser = () => `profile_${user?.email || user?.id || 'guest'}`;

  const saveProfileToLocal = (profileToSave) => {
    try {
      localStorage.setItem(storageKeyForUser(), JSON.stringify(profileToSave));
    } catch (e) {
      // ignore storage errors
    }
  };

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-100 pb-6 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 mb-1">My Profile</h2>
          <p className="text-sm text-gray-500">Manage your identity and track your growth.</p>
        </div>
          <div className="flex gap-3">
           <button onClick={() => navigate('/home')} className="px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm">
             <ArrowLeft size={16} /> Back
           </button>
           <button className="px-4 py-2 border border-indigo-100 text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2 text-sm">
             <Download size={16} /> Report
           </button>
          <button
            onClick={() => {
              if (isEditing) {
                saveProfileToLocal(profile);
              }
              setIsEditing(!isEditing);
            }}
            className={`px-4 py-2 font-bold rounded-lg transition-colors flex items-center gap-2 text-sm shadow-md ${isEditing ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            {isEditing ? <><Save size={16} /> Save</> : <><Edit2 size={16} /> Edit</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COL: Identity */}
        <div className="space-y-8">
          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-gray-50 to-gray-100 z-0"></div>
             <div onClick={() => navigate('/profile')} className="cursor-pointer relative z-10 flex items-center gap-4 mt-4 mb-6">
               <div className="relative inline-block">
                 {avatarUrl ? (
                   <img
                     src={avatarUrl}
                     alt="Profile"
                     referrerPolicy="no-referrer"
                     className="w-20 h-20 rounded-full border object-cover"
                     onError={(e) => {
                       e.currentTarget.onerror = null;
                       e.currentTarget.src = '/default-avatar.png';
                     }}
                   />
                 ) : (
                   <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-black border-4 border-white shadow-md">
                     <User2 size={28} />
                   </div>
                 )}

                 <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleAvatarFile(e.target.files && e.target.files[0])} />

                 <div className="absolute -bottom-1 -right-1 flex gap-1 items-center">
                   <button type="button" onClick={(e) => { e.stopPropagation(); onPencilClick(e); }} className="bg-white p-1 rounded-full border shadow-sm hover:bg-gray-50">
                     <Edit2 size={14} />
                   </button>

                   {/* transient small action shown after first click */}
                   {showEditAction && (
                     <button onClick={(e) => { e.stopPropagation(); if (avatarUrl) { setAvatarOptionsOpen(true); } else { onChooseAvatar(); } }} className="bg-white px-2 py-1 text-xs rounded-lg border shadow-sm hover:bg-gray-50">
                       {avatarUrl ? 'Edit Image' : 'Upload Image'}
                     </button>
                   )}
                 </div>
               </div>

               <div className="overflow-hidden">
                 <h2 className="text-xl font-bold text-gray-900 truncate">{profile.name}</h2>
                 <p className="text-sm text-gray-500 truncate">{profile.email}</p>
                 <p className="text-sm text-indigo-600 font-medium truncate">{profile.role}</p>
               </div>
             </div>

             <div className="space-y-1">
               <ProfileField icon={User} label="Full Name" name="name" value={profile.name} isEditing={isEditing} onChange={handleInputChange} />
               <ProfileField icon={Briefcase} label="Target Role" name="role" value={profile.role} isEditing={isEditing} onChange={handleInputChange} />
               <ProfileField icon={Mail} label="Email Address" name="email" value={profile.email} isEditing={isEditing} readOnly={true} />
               <div className="mb-4">
                 <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone</label>
                 <div>
                   {isEditing ? (
                     <PhoneEditor
                       value={profile.phone}
                       onChange={(val) => setProfile({ ...profile, phone: val })}
                       defaultCountry="IN"
                       placeholder="+91 98765 43210"
                     />
                   ) : (
                     <div className="w-full pl-0 pr-4 py-2 rounded-lg text-sm font-bold text-gray-900 bg-white border border-transparent">
                       {profile.phone}
                     </div>
                   )}
                 </div>
               </div>
               
               <div className="mt-4">
                 <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Bio</label>
                 {isEditing ? (
                   <textarea
                     name="bio"
                     value={profile.bio}
                     onChange={handleInputChange}
                     rows="3"
                     placeholder="add bio here"
                     className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-indigo-600 resize-none"
                   />
                 ) : (
                   <p
                     onClick={() => setIsEditing(true)}
                     className={`text-sm leading-relaxed p-2 ${profile.bio && profile.bio.trim() !== '' ? 'text-gray-600 italic' : 'text-gray-400 italic cursor-text'}`}
                   >
                     {profile.bio && profile.bio.trim() !== '' ? profile.bio : 'add bio here'}
                   </p>
                 )}
               </div>
             </div>
          </section>

          {/* Avatar options modal */}
          {avatarOptionsOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="w-full max-w-sm bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold mb-2">Change Profile Photo</h3>
                <p className="text-sm text-gray-500 mb-4">Choose how you'd like to update your profile photo.</p>
                <div className="space-y-3">
                  <button onClick={() => { onChooseAvatar(); setAvatarOptionsOpen(false); }} className="w-full py-2 px-3 rounded-lg border text-sm font-bold hover:bg-gray-50">Choose Your Own</button>
                  <button onClick={() => applyGoogleAvatar()} disabled={!(user?.photoURL || user?.avatar || user?.picture || user?.avatarUrl)} className={`w-full py-2 px-3 rounded-lg border text-sm font-bold ${(user?.photoURL || user?.avatar || user?.picture || user?.avatarUrl) ? 'hover:bg-gray-50' : 'opacity-50 cursor-not-allowed'}`}>Use Google Image</button>
                  <button onClick={() => applyDefaultAvatar()} className="w-full py-2 px-3 rounded-lg border text-sm font-bold hover:bg-gray-50">Reset to Default</button>
                </div>
                <div className="mt-4 flex justify-end">
                  <button onClick={() => setAvatarOptionsOpen(false)} className="px-4 py-2 text-sm">Cancel</button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COL: Data & Stats */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Progress Stats */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {progressStats.map((stat, i) => (
              <div key={i} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:border-indigo-200 transition-colors">
                <stat.icon size={20} className="text-indigo-600 mb-2" />
                <div className="text-2xl font-black text-gray-900">{stat.value}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </section>

          {/* Module Performance */}
          <section>
             <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Module Performance</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {modulePerformance.map((mod) => (
                 <div key={mod.id} className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:border-indigo-300 transition-colors">
                   <div className="flex justify-between items-center mb-3">
                     <h4 className="font-bold text-gray-900 text-sm">{mod.name}</h4>
                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${mod.score >= 80 ? 'bg-green-50 text-green-700' : mod.score >= 60 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
                       {mod.status}
                     </span>
                   </div>
                   <div className="flex items-end justify-between mb-2">
                     <span className="text-2xl font-black text-gray-900">{mod.score}</span>
                     <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">/ 100</span>
                   </div>
                   <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-3">
                     <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${mod.score}%` }}></div>
                   </div>
                   <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                     <span className="text-gray-500 font-medium">Next: <span className="text-indigo-600">{mod.next}</span></span>
                     <ChevronRight size={14} className="text-gray-400" />
                   </div>
                 </div>
               ))}
             </div>
          </section>

          {/* Achievements */}
          <section>
             <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
               <Award size={18} className="text-indigo-600" /> Achievements
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               {ACHIEVEMENTS.map((ach) => (
                 <div key={ach.id} className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${ach.unlocked ? 'bg-white border-indigo-100 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${ach.unlocked ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                     <Award size={14} />
                   </div>
                   <div>
                     <div className="text-sm font-bold text-gray-900">{ach.title}</div>
                     <div className="text-[10px] text-gray-500">{ach.desc}</div>
                   </div>
                 </div>
               ))}
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// 2. GENERAL SETTINGS VIEW
const GeneralSettingsView = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
    <div className="border-b border-gray-100 pb-6">
      <h2 className="text-2xl font-black text-gray-900 mb-1">General Settings</h2>
      <p className="text-sm text-gray-500">Manage display preferences and account basics.</p>
    </div>

    {/* Preferences */}
    <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
       <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
         <Globe size={18} className="text-indigo-600" /> Localization
       </h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div>
           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Language</label>
           <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:outline-none focus:border-indigo-600">
             <option>English (US)</option>
             <option>Spanish</option>
             <option>French</option>
           </select>
         </div>
         <div>
           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Timezone</label>
           <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:outline-none focus:border-indigo-600">
             <option>(GMT-08:00) Pacific Time</option>
             <option>(GMT+00:00) UTC</option>
             <option>(GMT+05:30) India Standard Time</option>
           </select>
         </div>
       </div>
    </section>

    {/* Appearance */}
    <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
       <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
         <Moon size={18} className="text-indigo-600" /> Appearance
       </h3>
       <div className="flex items-center justify-between">
         <div>
           <div className="text-sm font-bold text-gray-900">Dark Mode</div>
           <div className="text-xs text-gray-500">Switch between light and dark themes.</div>
         </div>
         <Toggle enabled={false} onToggle={() => {}} />
       </div>
    </section>

    {/* Danger Zone */}
    <section className="bg-red-50 border border-red-100 rounded-xl p-6">
       <h3 className="text-sm font-bold text-red-700 uppercase tracking-widest mb-2 flex items-center gap-2">
         <AlertTriangle size={18} /> Danger Zone
       </h3>
       <p className="text-xs text-red-600/80 mb-4">
         Once you delete your account, there is no going back. Please be certain.
       </p>
       <button className="px-4 py-2 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-600 hover:text-white transition-colors">
         Delete Account
       </button>
    </section>
  </div>
);

// 3. PRIVACY SETTINGS VIEW
const PrivacySettingsView = () => {
  const [showPass, setShowPass] = useState(false);
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="border-b border-gray-100 pb-6">
        <h2 className="text-2xl font-black text-gray-900 mb-1">Privacy & Security</h2>
        <p className="text-sm text-gray-500">Manage your password and security protocols.</p>
      </div>

      <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
         <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
           <Lock size={18} className="text-indigo-600" /> Change Password
         </h3>
         <div className="space-y-4 max-w-md">
           <InputGroup label="Current Password" type="password" placeholder="••••••••" />
           <div className="relative">
              <InputGroup label="New Password" type={showPass ? "text" : "password"} placeholder="••••••••" />
              <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-8 text-gray-400 hover:text-indigo-600">
                {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
           </div>
           <button className="px-6 py-2 bg-indigo-600 text-white font-bold text-sm rounded-lg shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors">
             Update Password
           </button>
         </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
         <div className="flex justify-between items-start">
           <div>
             <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2 flex items-center gap-2">
               <Shield size={18} className="text-indigo-600" /> Two-Factor Authentication
             </h3>
             <p className="text-sm text-gray-500 max-w-lg">
               Add an extra layer of security to your account by requiring a code from your mobile device.
             </p>
           </div>
           <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100">
             <CheckCircle2 size={12} /> Enabled
           </div>
         </div>
      </section>
    </div>
  );
};

// 4. NOTIFICATIONS VIEW
const NotificationSettingsView = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
    <div className="border-b border-gray-100 pb-6">
      <h2 className="text-2xl font-black text-gray-900 mb-1">Notifications</h2>
      <p className="text-sm text-gray-500">Control what you hear from us.</p>
    </div>

    <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
       <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
         <Bell size={18} className="text-indigo-600" /> Email Preferences
       </h3>
       <div className="space-y-6">
         {[
           { label: "Weekly Progress Report", desc: "Summary of your interview readiness score.", state: true },
           { label: "New Module Alerts", desc: "When new simulations are added.", state: true },
           { label: "Mentor Nudges", desc: "Reminders to practice if inactive for 3 days.", state: false },
         ].map((item, i) => (
           <div key={i} className="flex items-center justify-between">
             <div>
               <div className="text-sm font-bold text-gray-900">{item.label}</div>
               <div className="text-xs text-gray-500">{item.desc}</div>
             </div>
             <Toggle enabled={item.state} onToggle={() => {}} />
           </div>
         ))}
       </div>
    </section>
  </div>
);

// 5. SUBSCRIPTION VIEW
const SubscriptionSettingsView = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
    <div className="border-b border-gray-100 pb-6">
      <h2 className="text-2xl font-black text-gray-900 mb-1">Subscription Plan</h2>
      <p className="text-sm text-gray-500">Manage billing and plan upgrades.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {PLANS.map((plan) => (
        <div key={plan.name} className={`p-6 rounded-xl border relative ${plan.current ? 'border-indigo-600 bg-white shadow-lg shadow-indigo-50 ring-1 ring-indigo-50' : 'border-gray-200 bg-gray-50 opacity-80'}`}>
          {plan.current && (
            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
              Current Plan
            </div>
          )}
          <h3 className="text-lg font-black text-gray-900 mb-2">{plan.name}</h3>
          <div className="text-3xl font-black text-gray-900 mb-6">{plan.price}<span className="text-sm font-medium text-gray-400">/mo</span></div>
          <ul className="space-y-3 mb-8">
            {plan.features.map((feat, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <Check size={14} className="text-indigo-600" /> {feat}
              </li>
            ))}
          </ul>
          <button className={`w-full py-2 rounded-lg text-sm font-bold ${plan.current ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-900 text-white hover:bg-black'}`}>
            {plan.current ? 'Manage Plan' : 'Upgrade'}
          </button>
        </div>
      ))}
    </div>

    <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
       <div className="flex items-center gap-4">
         <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
           <CreditCard size={24} />
         </div>
         <div>
           <div className="text-sm font-bold text-gray-900">Visa ending in 4242</div>
           <div className="text-xs text-gray-500">Expires 12/28</div>
         </div>
       </div>
       <button className="text-xs font-bold text-indigo-600 hover:underline">Update</button>
    </section>

    <section>
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Invoice History</h3>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="p-4">Invoice ID</th>
              <th className="p-4">Date</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {INVOICES.map((inv) => (
              <tr key={inv.id}>
                <td className="p-4 font-bold text-gray-900">{inv.id}</td>
                <td className="p-4 text-gray-500">{inv.date}</td>
                <td className="p-4 text-gray-900">{inv.amount}</td>
                <td className="p-4"><span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">{inv.status}</span></td>
                <td className="p-4 text-right"><Download size={16} className="text-gray-400 hover:text-indigo-600 cursor-pointer inline" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  </div>
);

// --- MAIN CONTROLLER COMPONENT ---

const SettingsHub = () => {
  const [activeTab, setActiveTab] = useState('profile');

  // Navigation Items
  const navItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'general', label: 'General Settings', icon: Settings },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'subscription', label: 'Subscription Plan', icon: CreditCard },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'profile': return <UserProfileView />;
      case 'general': return <GeneralSettingsView />;
      case 'privacy': return <PrivacySettingsView />;
      case 'notifications': return <NotificationSettingsView />;
      case 'subscription': return <SubscriptionSettingsView />;
      default: return <UserProfileView />;
    }
  };

  return (
<div className="min-h-screen bg-white text-gray-900 font-sans flex justify-center p-0 pr-6">
  <div className="w-full max-w-[1500px] mx-auto">
        
        {/* --- LEFT SIDEBAR NAVIGATION ---
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <h1 className="text-2xl font-black tracking-tight text-gray-900 mb-6 px-4">Account</h1>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                    activeTab === item.id 
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon size={18} className={activeTab === item.id ? 'text-indigo-600' : 'text-gray-400'} />
                  {item.label}
                </button>
              ))}
            </nav>
            
            <div className="mt-10 px-4">
              <div className="p-4 bg-gray-900 text-white rounded-xl shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Current Plan</div>
                  <div className="text-lg font-bold mb-1">Pro Member</div>
                  <div className="text-xs text-gray-400 mb-3">Renews Oct 24, 2025</div>
                  <button 
                    onClick={() => setActiveTab('subscription')}
                    className="w-full py-2 bg-indigo-600 text-white text-xs font-bold rounded hover:bg-indigo-500 transition-colors"
                  >
                    Manage Billing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* --- RIGHT CONTENT AREA --- */}
        <div className="lg:col-span-3 min-h-[600px] border-l border-gray-100 pl-0 lg:pl-8">
          {renderContent()}
        </div>

      </div>
    </div>
  );
};

export default SettingsHub;