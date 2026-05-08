import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { 
  User, 
  Bell, 
  Shield, 
  Monitor, 
  Sliders, 
  Smartphone, 
  HelpCircle, 
  LogOut, 
  Save, 
  ChevronRight, 
  Check, 
  Globe, 
  Moon, 
  Sun, 
  CreditCard,
  Type, 
  Layout, 
  Trash2, 
  Download, 
  Lock, 
  Mail,
  AlertTriangle
} from 'lucide-react';

// (useState and useEffect already imported above)

// --- MOCK DATA ---

const SESSIONS = [
  { id: 1, device: "MacBook Pro (Chrome)", location: "New York, USA", active: true, ip: "192.168.1.1" },
  { id: 2, device: "iPhone 14 (App)", location: "New York, USA", active: false, lastActive: "2 hours ago", ip: "10.0.0.4" },
];

const MODULE_PREFS = [
  { id: 'tech', label: "Technical Coding", enabled: true },
  { id: 'hr', label: "HR & Behavioral", enabled: true },
  { id: 'gd', label: "Group Discussion", enabled: false },
  { id: 'apt', label: "Aptitude Tests", enabled: true },
];

// Pricing plans used by SubscriptionSettingsView
const PLANS = [
  { name: 'Free', price: '$0', features: ['3 Practice Sessions/mo', 'Basic Analytics', 'Community Access'], current: true },
  { name: 'Pro', price: '$19', features: ['Unlimited Simulations', 'AI Mentor Chat', 'Deep Failure Analysis'], current: false },
];

const INVOICES = [
  { id: '#INV-004', date: 'Oct 01, 2025', amount: '$19.00', status: 'Paid' },
  { id: '#INV-003', date: 'Sep 01, 2025', amount: '$19.00', status: 'Paid' },
];

// --- REUSABLE UI COMPONENTS ---

function formatElapsedTime(iso) {
  if (!iso) return 'Never changed';
  const t = Date.parse(iso);
  if (isNaN(t)) return 'Unknown';
  const diff = Date.now() - t;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return `${hours} hour${hours === 1 ? '' : 's'} ${rem} minute${rem === 1 ? '' : 's'} ago`;
}

const Toggle = ({ enabled, onToggle }) => (
  <button 
    onClick={onToggle}
    className={`
      relative w-11 h-6 flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
      ${enabled ? 'bg-indigo-600' : 'bg-gray-200'}
    `}
  >
    <span 
      className={`
        inline-block w-4 h-4 transform bg-white rounded-full shadow-md transition-transform
        ${enabled ? 'translate-x-6' : 'translate-x-1'}
      `} 
    />
  </button>
);

const SectionHeader = ({ title, desc }) => (
  <div className="mb-6 border-b border-gray-100 pb-4">
    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
    <p className="text-sm text-gray-500">{desc}</p>
  </div>
);

const SettingRow = ({ label, desc, action }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors px-2 -mx-2 rounded-lg">
    <div>
      <div className="text-sm font-bold text-gray-900">{label}</div>
      {desc && <div className="text-xs text-gray-500 mt-0.5">{desc}</div>}
    </div>
    <div>{action}</div>
  </div>
);

// --- SUB-SECTIONS ---

// 1. ACCOUNT
const AccountSettings = ({ fullName, setFullName, email, onDeleteOpen }) => (
  <div className="animate-in fade-in slide-in-from-right-2 duration-300">
    <SectionHeader title="Profile Information" desc="Update your identity details and contact info." />
    
    <div className="space-y-4 max-w-lg mb-8">
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
        <input id="settings-fullname" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:border-indigo-600 outline-none transition-colors" />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
        <div className="flex gap-2">
          <input type="email" value={email || ''} disabled className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500" />
          {email ? (
            <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-3 rounded-lg border border-green-100"><Check size={12}/> Verified</span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-medium text-gray-500 px-3 rounded-lg">No email set</span>
          )}
        </div>
      </div>
    </div>

    <SectionHeader title="Danger Zone" desc="Irreversible account actions." />
      <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-between">
      <div>
        <h4 className="text-sm font-bold text-red-700">Delete Account</h4>
        <p className="text-xs text-red-600/70">Permanently remove your data and access.</p>
      </div>
      <button onClick={() => onDeleteOpen && onDeleteOpen()} className="px-4 py-2 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-600 hover:text-white transition-colors">
        Delete
      </button>
    </div>
  </div>
);

// 2. NOTIFICATIONS
const NotificationSettings = () => (
  <div className="animate-in fade-in slide-in-from-right-2 duration-300">
    <SectionHeader title="Alert Preferences" desc="Manage how we communicate with you." />
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-2">
      <SettingRow 
        label="Weekly Progress Report" 
        desc="Summary of readiness score and activity." 
        action={<Toggle enabled={true} onToggle={()=>{}} />} 
      />
      <SettingRow 
        label="Mentor Nudges" 
        desc="Reminders when you break a practice streak." 
        action={<Toggle enabled={true} onToggle={()=>{}} />} 
      />
      <SettingRow 
        label="New Simulation Alerts" 
        desc="When new company profiles are added." 
        action={<Toggle enabled={false} onToggle={()=>{}} />} 
      />
      <SettingRow 
        label="Marketing & Offers" 
        desc="Product updates and pro discounts." 
        action={<Toggle enabled={false} onToggle={()=>{}} />} 
      />
    </div>
  </div>
);

// 3. PRIVACY
const PrivacySettings = () => (
  <div className="animate-in fade-in slide-in-from-right-2 duration-300">
    <SectionHeader title="Privacy & Data" desc="Control your visibility and data ownership." />
    
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
      <SettingRow 
        label="Public Profile" 
        desc="Allow recruiters to search for your profile." 
        action={<Toggle enabled={true} onToggle={()=>{}} />} 
      />
      <SettingRow 
        label="Share Certifications" 
        desc="Automatically sync earned badges to LinkedIn." 
        action={<Toggle enabled={false} onToggle={()=>{}} />} 
      />
    </div>

    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <SettingRow 
        label="Download Personal Data" 
        desc="Get a copy of your performance history (JSON/PDF)." 
        action={<button className="text-indigo-600 font-bold text-xs hover:underline flex items-center gap-1"><Download size={14}/> Request Export</button>} 
      />
      <SettingRow 
        label="Data Usage Consent" 
        desc="Allow anonymized data for AI model training." 
        action={<Toggle enabled={true} onToggle={()=>{}} />} 
      />
    </div>
  </div>
);

// 4. APPEARANCE (Personalization)
const AppearanceSettings = ({ theme, setTheme }) => (
  <div className="animate-in fade-in slide-in-from-right-2 duration-300">
    <SectionHeader title="Interface Customization" desc="Make the platform feel like yours." />
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div onClick={() => setTheme('light')} className={`p-4 rounded-xl cursor-pointer transition-all ${theme === 'light' ? 'bg-white border border-indigo-300 ring-2 ring-indigo-600 ring-offset-2' : 'bg-white border border-gray-200 hover:border-indigo-300'}`}>
        <div className={`flex items-center gap-3 mb-2 font-bold text-sm ${theme === 'light' ? 'text-indigo-600' : 'text-gray-600'}`}>
          <Sun size={18} /> Light Mode
        </div>
        <div className="h-16 bg-gray-50 rounded-lg border border-gray-100"></div>
      </div>
      <div onClick={() => setTheme('dark')} className={`p-4 rounded-xl cursor-pointer transition-all ${theme === 'dark' ? 'bg-gray-800 border border-indigo-600 ring-2 ring-indigo-600 ring-offset-2' : 'bg-gray-50 border border-gray-200 hover:border-gray-400'}`}>
        <div className={`flex items-center gap-3 mb-2 font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>
          <Moon size={18} /> Dark Mode
        </div>
        <div className="h-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-800'} rounded-lg border border-gray-700"></div>
      </div>
    </div>

    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <SettingRow
        label="Theme"
        desc="Toggle between Light and Dark mode"
        action={<Toggle enabled={theme === 'dark'} onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />}
      />
    </div>

    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <SettingRow 
        label="Layout Density" 
        desc="Adjust spacing in dashboards." 
        action={
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button className="px-3 py-1 bg-white text-xs font-bold shadow-sm rounded-md text-gray-900">Comfortable</button>
            <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-900">Compact</button>
          </div>
        } 
      />
      <SettingRow 
        label="Font Size" 
        desc="Scale text for better readability." 
        action={
          <div className="flex items-center gap-2">
            <Type size={14} className="text-gray-400" />
            <input type="range" className="accent-indigo-600" />
            <Type size={18} className="text-gray-900" />
          </div>
        } 
      />
    </div>
  </div>
);

// 5. PRACTICE SETTINGS
const PracticeSettings = () => (
  <div className="animate-in fade-in slide-in-from-right-2 duration-300">
    <SectionHeader title="Module Configuration" desc="Customize your learning path visibility." />
    
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {MODULE_PREFS.map((mod) => (
        <div key={mod.id} className="p-4 border-b border-gray-100 last:border-0 flex items-center justify-between hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${mod.enabled ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
              <Sliders size={16} />
            </div>
            <span className={`text-sm font-bold ${mod.enabled ? 'text-gray-900' : 'text-gray-400'}`}>{mod.label}</span>
          </div>
          <Toggle enabled={mod.enabled} onToggle={()=>{}} />
        </div>
      ))}
    </div>
    <p className="mt-4 text-xs text-gray-500">Disabled modules will be hidden from your main dashboard but can be re-enabled anytime.</p>
  </div>
);

// 6. SECURITY
const SecuritySettings = ({ lastPwdChanged, onPasswordChanged }) => {
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [loadingPwd, setLoadingPwd] = useState(false);
  const [pwdMessage, setPwdMessage] = useState(null);
  const [showChangeForm, setShowChangeForm] = useState(false);

  const changePassword = async (e) => {
    e && e.preventDefault();
    setPwdMessage(null);
    if (!currentPwd || !newPwd) { setPwdMessage({ type: 'error', text: 'Please fill all fields' }); return; }
    if (newPwd !== confirmPwd) { setPwdMessage({ type: 'error', text: 'New passwords do not match' }); return; }
    if (newPwd.length < 6) { setPwdMessage({ type: 'error', text: 'Password must be at least 6 characters' }); return; }

    setLoadingPwd(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd })
      });
      const text = await res.text().catch(() => null);
      let json = null;
      try { json = JSON.parse(text); } catch (e) { json = null; }
      if (!res.ok) {
        const err = (json && json.message) || text || res.statusText;
        setPwdMessage({ type: 'error', text: err });
      } else {
        const successText = (json && json.message) || 'Password changed';
        setPwdMessage({ type: 'success', text: successText });
        // show toast and hide the form
        try { toast.success('Password reset successfully'); } catch (e) {}
        setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
        setShowChangeForm(false);
        try { if (typeof onPasswordChanged === 'function') onPasswordChanged(); } catch (e) {}
      }
    } catch (err) {
      console.error(err);
      setPwdMessage({ type: 'error', text: 'Network error' });
    } finally {
      setLoadingPwd(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-2 duration-300">
      <SectionHeader title="Login & Sessions" desc="Manage access and device history." />

      {/* Password */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Lock size={16} className="text-indigo-600"/> Password
          </h4>
          {!showChangeForm && (
            <button onClick={() => setShowChangeForm(true)} className="text-xs font-bold text-indigo-600 hover:underline">Change</button>
          )}
        </div>
        {!showChangeForm ? (
          <div className="text-xs text-gray-500">Last changed {formatElapsedTime(lastPwdChanged)}</div>
        ) : (
          <>
            <div className="text-xs text-gray-500 mb-4">Change your password. You will stay logged in after a successful update.</div>
            <form onSubmit={changePassword} className="space-y-3 max-w-md">
              <input type="password" placeholder="Current password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm" />
              <input type="password" placeholder="New password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm" />
              <input type="password" placeholder="Confirm new password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm" />
              {pwdMessage && (
                <div className={`p-2 text-sm rounded ${pwdMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{pwdMessage.text}</div>
              )}
              <div className="flex gap-3">
                <button type="submit" disabled={loadingPwd} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-md">{loadingPwd ? 'Saving...' : 'Change Password'}</button>
                <button type="button" onClick={() => { setShowChangeForm(false); setPwdMessage(null); }} className="px-4 py-2 border rounded-md">Cancel</button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Sessions */}
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Active Sessions</h4>
      <div className="space-y-3">
        {SESSIONS.map((session) => (
          <div key={session.id} className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${session.active ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                <Monitor size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  {session.device}
                  {session.active && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Current</span>}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{session.location} • {session.ip}</div>
                {!session.active && <div className="text-[10px] text-gray-400 mt-1">Last active: {session.lastActive}</div>}
              </div>
            </div>
            {!session.active && (
              <button className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">
                Revoke
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// 7. SUPPORT
const SupportSettings = ({ onOpenBugReport }) => (
  <div className="animate-in fade-in slide-in-from-right-2 duration-300">
    <SectionHeader title="Help & Support" desc="We are here to help you succeed." />
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <button className="p-6 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all text-left group">
        <div className="bg-indigo-50 w-10 h-10 rounded-lg flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
          <Mail size={20} />
        </div>
        <h4 className="font-bold text-gray-900">Contact Support</h4>
        <p className="text-xs text-gray-500 mt-1">Get a response within 24 hours.</p>
      </button>
      <button className="p-6 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all text-left group">
        <div className="bg-indigo-50 w-10 h-10 rounded-lg flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
          <HelpCircle size={20} />
        </div>
        <h4 className="font-bold text-gray-900">Knowledge Base</h4>
        <p className="text-xs text-gray-500 mt-1">Tutorials and Interview Guides.</p>
      </button>
    </div>

    <div className="bg-indigo-600 text-white rounded-xl p-6">
      <div className="flex items-center gap-3 mb-2">
        <AlertTriangle size={18} className="text-indigo-200" />
        <h4 className="font-bold">Report a Bug</h4>
      </div>
      <p className="text-indigo-100 text-xs mb-4">Found an issue with a simulation? Let us know.</p>
      <button onClick={() => onOpenBugReport && onOpenBugReport()} className="w-full bg-white text-indigo-600 font-bold text-xs py-2 rounded-lg hover:bg-indigo-50 transition-colors">
        Open Bug Report
      </button>
    </div>
  </div>
);

// Bug Report Modal Component
const BugReportModal = ({ visible, onClose }) => {
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  if (!visible) return null;

  const submitBug = async (e) => {
    e && e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem('token');
      const form = new FormData();
      form.append('summary', summary);
      form.append('description', description);
      try { const raw = localStorage.getItem('user'); if (raw) { const u = JSON.parse(raw); form.append('userEmail', u.email || ''); form.append('userName', u.name || ''); } } catch (e) {}
      if (file) form.append('screenshot', file);

      const res = await fetch('/api/support/bug', {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: form
      });

      // clone response to attempt JSON parse without consuming original stream
      let json = null;
      try { json = await res.clone().json(); } catch (e) { json = null; }

      // read original body as text for fallback/error messages
      const bodyText = await res.text().catch(() => null);

      if (!res.ok) {
        const errText = (json && json.message) || bodyText || res.statusText;
        setMessage({ type: 'error', text: 'Submission failed: ' + errText });
      } else {
        // ensure json is populated if server returned JSON but clone failed earlier
        if (!json && bodyText) {
          try { json = JSON.parse(bodyText); } catch (e) { json = null; }
        }
        let successText = 'Thanks — your bug report was submitted.';
        if (json && json.previewUrl) successText += ' Preview: ' + json.previewUrl;
        setMessage({ type: 'success', text: successText });
        setSummary(''); setDescription(''); setFile(null);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Network error. Check console.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form onSubmit={submitBug} className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Report a Bug</h3>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-900">Close</button>
        </div>
        <div className="space-y-3">
          <input value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Brief summary" className="w-full p-3 border rounded-md" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe steps to reproduce, expected vs actual, environment..." className="w-full p-3 border rounded-md h-40" />
          <div className="flex items-center gap-3">
            <input id="bug-screenshot" type="file" accept="image/*" onChange={(e) => setFile(e.target.files && e.target.files[0])} />
            <span className="text-xs text-gray-500">Optional: attach screenshot</span>
          </div>
          {message && (
            <div className={`p-2 text-sm rounded ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message.text}</div>
          )}
          <div className="flex justify-end gap-3 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-md bg-indigo-600 text-white font-bold">{loading ? 'Sending...' : 'Submit Report'}</button>
          </div>
        </div>
      </form>
    </div>
  );
};
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
          <button onClick={async () => {
            try {
              const rawUser = localStorage.getItem('user');
              const u = rawUser ? JSON.parse(rawUser) : null;
              if (plan.current) {
                // open billing portal
                const res = await fetch('/api/payment/create-portal-session', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}) },
                  body: JSON.stringify({ email: u?.email })
                });
                if (!res.ok) {
                  const txt = await res.text();
                  alert('Failed to open billing portal: ' + (txt || res.statusText));
                  return;
                }
                const j = await res.json();
                if (j.url) window.open(j.url, '_blank');
              } else {
                // create checkout session
                const res = await fetch('/api/payment/create-checkout-session', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}) },
                  body: JSON.stringify({ plan: plan.name, email: u?.email })
                });
                if (!res.ok) {
                  const txt = await res.text();
                  alert('Failed to create checkout session: ' + (txt || res.statusText));
                  return;
                }
                const j = await res.json();
                if (j.url) window.open(j.url, '_blank');
              }
            } catch (err) { console.error(err); alert('Payment error, check console for details'); }
          }} className={`w-full py-2 rounded-lg text-sm font-bold ${plan.current ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-900 text-white hover:bg-black'}`}>
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

// Delete account confirmation modal
const DeleteAccountModal = ({ visible, onClose, onConfirm, confirming, value, setValue }) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold mb-2">Confirm Account Deletion</h3>
        <p className="text-sm text-gray-600 mb-4">This action is irreversible. To confirm, type <em>delete my account</em> below.</p>
        <input value={value} onChange={(e) => setValue(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg mb-4" placeholder="Type 'delete my account' to confirm" />
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg text-sm">Cancel</button>
          <button onClick={onConfirm} disabled={confirming} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold">{confirming ? 'Deleting...' : 'Delete Account'}</button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN LAYOUT ---

const SettingsModule = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(() => {
    try { const raw = localStorage.getItem('user'); const u = raw ? JSON.parse(raw) : null; return (u && u.email) ? u.email : ''; } catch (e) { return ''; }
  });
  const [lastPwdChanged, setLastPwdChanged] = useState(() => {
    try { const raw = localStorage.getItem('user'); const u = raw ? JSON.parse(raw) : null; return (u && (u.updatedAt || u.updated_at || u.updated)) ? (u.updatedAt || u.updated_at || u.updated) : null; } catch (e) { return null; }
  });
  const [bugModalOpen, setBugModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('theme') || 'light'; } catch (e) { return 'light'; }
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      // clear client-side auth and cached user data
      const keys = ['token', 'user', 'atsScore', 'averageScore', 'aptitudeScore', 'gdScore', 'hrConfidence', 'hrCommunication', 'mockSessions'];
      keys.forEach(k => { try { localStorage.removeItem(k); } catch (e) {} });
    } catch (e) {}
    try { window.dispatchEvent(new CustomEvent('userLoggedOut')); } catch (e) {}
    // navigate to login page and reload to ensure a clean state
    try { navigate('/'); } catch (e) { /* fallback */ }
    try { window.location.reload(); } catch (e) {}
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        if (u && u.name) setFullName(u.name);
        if (u && u.email) setEmail(u.email);
        if (u && (u.updatedAt || u.updated_at || u.updated)) setLastPwdChanged(u.updatedAt || u.updated_at || u.updated);
        // also seed the input if already rendered
        const el = document.getElementById('settings-fullname');
        if (el) el.value = u.name || '';
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      // also set body background/text colors as a fallback when Tailwind 'dark' class isn't active
      if (theme === 'dark') {
        try { document.body.style.backgroundColor = '#0f172a'; document.body.style.color = '#ffffff'; } catch (e) {}
      } else {
        try { document.body.style.backgroundColor = ''; document.body.style.color = ''; } catch (e) {}
      }
      localStorage.setItem('theme', theme);
    } catch (e) {}
  }, [theme]);

  const saveProfile = async () => {
    try {
      // prefer controlled state; fall back to DOM element
      const nameToSend = fullName || (document.getElementById('settings-fullname') || {}).value || '';
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ name: nameToSend })
      });
      if (!res.ok) {
        console.error('Failed updating profile');
        return;
      }
      const data = await res.json();
      const updated = data.user || data;
      try { localStorage.setItem('user', JSON.stringify(updated)); } catch (e) {}
      // inform other components
      try { window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: updated })); } catch (e) {}
      // update local state and input
      setFullName(updated.name || '');
      setEmail(updated.email || '');
      const el = document.getElementById('settings-fullname');
      if (el) el.value = updated.name || '';
      // reload the page so the new name is reflected across the app
      try { window.location.reload(); } catch (e) { /* ignore */ }
    } catch (err) {
      console.error(err);
    }
  };

  const TABS = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Monitor },
    { id: 'practice', label: 'Practice Setup', icon: Sliders },
    { id: 'security', label: 'Security', icon: Smartphone },
    { id: 'support', label: 'Help', icon: HelpCircle },
    { id: 'subscription', label: 'subscription', icon: HelpCircle },
  ];

  

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex justify-center p-0">
      <div className="w-full max-w-6xl">
        
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-1">Settings</h1>
            <p className="text-gray-500 font-medium">Manage your preferences and platform experience.</p>
          </div>
          <button onClick={saveProfile} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <Save size={18} /> Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navigation */}
          <nav className="space-y-1 lg:col-span-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <tab.icon size={18} />
                  {tab.label}
                </div>
                {activeTab === tab.id && <ChevronRight size={16} />}
              </button>
            ))}
            
            <div className="pt-8 mt-8 border-t border-gray-100">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold transition-colors">
                <LogOut size={18} /> Log Out
              </button>
            </div>
          </nav>

          {/* Content Area */}
          <main className="lg:col-span-3 bg-white min-h-[500px] border-l border-gray-100 lg:pl-10">
            {activeTab === 'account' && <AccountSettings fullName={fullName} setFullName={setFullName} email={email} onDeleteOpen={() => setDeleteModalOpen(true)} />}
            {activeTab === 'privacy' && <PrivacySettings />}
            {activeTab === 'appearance' && <AppearanceSettings theme={theme} setTheme={setTheme} />}
            {activeTab === 'practice' && <PracticeSettings />}
            {activeTab === 'security' && <SecuritySettings lastPwdChanged={lastPwdChanged} onPasswordChanged={() => {
              const iso = new Date().toISOString();
              setLastPwdChanged(iso);
              try {
                const raw = localStorage.getItem('user');
                if (raw) {
                  const u = JSON.parse(raw);
                  u.updatedAt = iso; try { localStorage.setItem('user', JSON.stringify(u)); } catch (e) {}
                }
              } catch (e) {}
            }} />}
            {activeTab === 'support' && <SupportSettings onOpenBugReport={() => setBugModalOpen(true)} />}
            {activeTab === 'subscription' && <SubscriptionSettingsView />}
          </main>

        </div>
        <Toaster />
        <BugReportModal visible={bugModalOpen} onClose={() => setBugModalOpen(false)} />
        <DeleteAccountModal
          visible={deleteModalOpen}
          onClose={() => { if (!deleting) { setDeleteModalOpen(false); setDeleteConfirmText(''); } }}
          confirming={deleting}
          value={deleteConfirmText}
          setValue={setDeleteConfirmText}
          onConfirm={async () => {
            try {
              if ((deleteConfirmText || '').trim().toLowerCase() !== 'delete my account') {
                toast.error("Type 'delete my account' to confirm");
                return;
              }
              setDeleting(true);
              const token = localStorage.getItem('token');
              const res = await fetch('/api/user/delete', {
                method: 'DELETE',
                headers: {
                  ...(token ? { Authorization: `Bearer ${token}` } : {})
                }
              });
              if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                toast.error(err.message || 'Failed to delete account');
                setDeleting(false);
                return;
              }
              toast.success('Account deleted');
              try { localStorage.clear(); } catch (e) {}
              try { window.dispatchEvent(new CustomEvent('userDeleted')); } catch (e) {}
              // navigate to landing/login
              try { navigate('/'); } catch (e) {}
              try { window.location.reload(); } catch (e) {}
            } catch (e) {
              console.error(e);
              toast.error('Failed to delete account');
            } finally {
              setDeleting(false);
              setDeleteModalOpen(false);
              setDeleteConfirmText('');
            }
          }}
        />
      </div>
    </div>
  );
};

export default SettingsModule;