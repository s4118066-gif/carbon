import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  User, 
  Key, 
  Globe, 
  Database, 
  Trash2, 
  Check, 
  Eye, 
  EyeOff, 
  Sparkles,
  Info 
} from 'lucide-react';

export default function SettingsPage({ userProfile, onProfileUpdate }) {
  const [displayName, setDisplayName] = useState(userProfile?.displayName || 'Eco Warrior');
  const [email, setEmail] = useState(userProfile?.email || 'demo@ecowise.ai');
  const [geminiKey, setGeminiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem("ecowise_gemini_key") || '';
    setGeminiKey(storedKey);
  }, []);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    
    // Save profile updates
    onProfileUpdate({
      displayName,
      email
    });

    // Save Gemini Key
    localStorage.setItem("ecowise_gemini_key", geminiKey);
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleResetCache = () => {
    if (window.confirm("Are you sure you want to clear your local carbon footprint stats and reset your Green Points?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in p-1 lg:p-4">
      {/* Page Header */}
      <div className="glass-card p-6 rounded-2xl">
        <h1 className="text-xl font-bold font-display text-white mb-1">Configuration & Settings</h1>
        <p className="text-xs text-eco-text-muted">Manage your profile, API tokens, multi-language displays, and system modes.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Profile Management Section */}
        <section aria-labelledby="profile-heading" className="glass-card p-6 rounded-2xl space-y-4">
          <h2 id="profile-heading" className="text-sm font-semibold text-white font-display uppercase tracking-wider border-b border-eco-border/20 pb-2 flex items-center gap-2">
            <User className="h-4 w-4 text-eco-accent" />
            <span>Profile Information</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="dispName" className="text-xs font-semibold text-eco-text-muted">Display Name</label>
              <input 
                id="dispName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-eco-bg-dark border border-eco-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-eco-accent transition-all"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="emailAddr" className="text-xs font-semibold text-eco-text-muted">Email Address</label>
              <input 
                id="emailAddr"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-eco-bg-dark border border-eco-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-eco-accent transition-all"
              />
            </div>
          </div>
        </section>

        {/* AI API Keys Setup */}
        <section aria-labelledby="api-heading" className="glass-card p-6 rounded-2xl space-y-4">
          <h2 id="api-heading" className="text-sm font-semibold text-white font-display uppercase tracking-wider border-b border-eco-border/20 pb-2 flex items-center gap-2">
            <Key className="h-4 w-4 text-eco-accent" />
            <span>OpenAI / Gemini API Access</span>
          </h2>
          <p className="text-xs text-eco-text-muted leading-relaxed">
            By default, EcoWise AI chatbot runs on a pre-defined carbon intelligence model. 
            Paste your **Google Gemini API Key** below to connect to live Gemini Flash models. Keys are stored safely on your client browser.
          </p>
          
          <div className="space-y-2">
            <label htmlFor="apiToken" className="text-xs font-semibold text-eco-text-muted">Google Gemini API Key</label>
            <div className="relative">
              <input 
                id="apiToken"
                type={showKey ? "text" : "password"}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-eco-bg-dark border border-eco-border rounded-xl pl-4 pr-12 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-eco-accent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-3.5 text-eco-text-muted hover:text-white"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </section>

        {/* Advanced / System Configurations */}
        <section aria-labelledby="advanced-heading" className="glass-card p-6 rounded-2xl space-y-4">
          <h2 id="advanced-heading" className="text-sm font-semibold text-white font-display uppercase tracking-wider border-b border-eco-border/20 pb-2 flex items-center gap-2">
            <Database className="h-4 w-4 text-eco-accent" />
            <span>System Preferences</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="lang" className="text-xs font-semibold text-eco-text-muted">Language Support</label>
              <select 
                id="lang"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-eco-bg-dark border border-eco-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-eco-accent transition-all"
              >
                <option value="en">English (US)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="es">Español (Spanish)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="sync" className="text-xs font-semibold text-eco-text-muted">Database Mode</label>
              <select 
                id="sync"
                value={isDemoMode ? 'demo' : 'production'}
                onChange={(e) => setIsDemoMode(e.target.value === 'demo')}
                className="w-full bg-eco-bg-dark border border-eco-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-eco-accent transition-all"
              >
                <option value="demo">Local Storage Sandbox (Offline Mode)</option>
                <option value="production">Firebase Live Synchronization</option>
              </select>
            </div>
          </div>
        </section>

        {/* Buttons Controls */}
        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={handleResetCache}
            className="px-5 py-2.5 rounded-xl bg-red-950/40 border border-red-900/30 text-red-400 hover:text-white font-semibold text-xs transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <Trash2 className="h-4 w-4" />
            <span>Reset Cache & Data</span>
          </button>
          
          <button
            type="submit"
            className={`px-6 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 ${
              isSaved 
                ? 'bg-emerald-600 text-white shadow-lg glow-green' 
                : 'bg-eco-accent hover:bg-eco-accent/80 text-white shadow-md'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="h-4 w-4" />
                <span>Settings Saved!</span>
              </>
            ) : (
              <>
                <Settings className="h-4 w-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
