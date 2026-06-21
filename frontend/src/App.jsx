import React, { useState, useEffect } from 'react';
import { appAuth, appDb } from './firebase';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import CarbonTwin from './pages/CarbonTwin';
import AICoach from './pages/AICoach';
import ReceiptAnalyzer from './pages/ReceiptAnalyzer';
import Leaderboard from './pages/Leaderboard';
import Analytics from './pages/Analytics';
import SettingsPage from './pages/Settings';
import EcoMaps from './pages/EcoMaps';
import { Leaf, Sparkles, Loader2, Lock, Mail, User } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Login/Registration Form State
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Monitor Authentication state
  useEffect(() => {
    const unsubscribe = appAuth.onStateChanged(async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        const profile = await appDb.getUserProfile(firebaseUser.uid);
        setUserProfile(profile);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      if (isLogin) {
        await appAuth.login(email, password);
      } else {
        if (!displayName.trim()) {
          setAuthError('Please enter a display name.');
          setAuthLoading(false);
          return;
        }
        await appAuth.register(email, password, displayName);
      }
    } catch (err) {
      console.error(err);
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await appAuth.logout();
    setCurrentPage('dashboard');
  };

  const handleProfileUpdate = async (data) => {
    if (!user) return;
    const updated = await appDb.updateUserProfile(user.uid, data);
    setUserProfile(updated);
  };

  // Render Page Router Content
  const renderPageContent = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard userProfile={userProfile} setCurrentPage={setCurrentPage} />;
      case 'calculator':
        return <Calculator userProfile={userProfile} onProfileUpdate={handleProfileUpdate} />;
      case 'twin':
        return <CarbonTwin userProfile={userProfile} onProfileUpdate={handleProfileUpdate} />;
      case 'coach':
        return <AICoach userProfile={userProfile} onProfileUpdate={handleProfileUpdate} />;
      case 'ocr':
        return <ReceiptAnalyzer userProfile={userProfile} onProfileUpdate={handleProfileUpdate} />;
      case 'leaderboard':
        return <Leaderboard userProfile={userProfile} onProfileUpdate={handleProfileUpdate} />;
      case 'analytics':
        return <Analytics userProfile={userProfile} />;
      case 'maps':
        return <EcoMaps />;
      case 'settings':
        return <SettingsPage userProfile={userProfile} onProfileUpdate={handleProfileUpdate} />;
      default:
        return <Dashboard userProfile={userProfile} setCurrentPage={setCurrentPage} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-eco-bg flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 text-eco-accent animate-spin" />
        <span className="text-sm font-semibold text-eco-text-muted">Loading EcoWise Sphere...</span>
      </div>
    );
  }

  // RENDER LOGIN / REGISTER VIEW
  if (!user) {
    return (
      <main className="min-h-screen bg-eco-bg bg-grid-pattern flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative background gradients */}
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-eco-accent/10 blur-3xl animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-emerald-900/10 blur-3xl animate-pulse-slow pointer-events-none" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          
          {/* Logo & Headline */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-eco-accent-glow border border-eco-accent/30 text-eco-accent rounded-2xl animate-float">
              <Leaf className="h-8 w-8 animate-sway" />
            </div>
            <h1 className="text-3xl font-bold font-display text-white tracking-tight">EcoWise AI</h1>
            <p className="text-xs text-eco-text-muted max-w-xs mx-auto">
              Track carbon footprint, unlock green points, and build your digital environment twin with advanced AI insights.
            </p>
          </div>

          {/* Form Container */}
          <div className="glass-card p-8 rounded-3xl border border-eco-border/40 shadow-2xl space-y-6">
            <h2 className="text-lg font-bold font-display text-white text-center">
              {isLogin ? 'Welcome Back!' : 'Start Your Eco Journey'}
            </h2>

            {authError && (
              <div role="alert" className="p-3 bg-red-950/40 border border-red-900/40 rounded-xl text-red-400 text-xs text-center font-medium">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1">
                  <label htmlFor="authName" className="text-[10px] font-bold text-eco-text-muted uppercase">Display Name</label>
                  <div className="relative">
                    <input
                      id="authName"
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Eco Champion"
                      className="w-full bg-eco-bg-dark border border-eco-border rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-eco-accent transition-all"
                    />
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-eco-text-muted" />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="authEmail" className="text-[10px] font-bold text-eco-text-muted uppercase">Email Address</label>
                <div className="relative">
                  <input
                    id="authEmail"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-eco-bg-dark border border-eco-border rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-eco-accent transition-all"
                  />
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-eco-text-muted" />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="authPass" className="text-[10px] font-bold text-eco-text-muted uppercase">Password</label>
                <div className="relative">
                  <input
                    id="authPass"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-eco-bg-dark border border-eco-border rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-eco-accent transition-all"
                  />
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-eco-text-muted" />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-eco-accent hover:bg-eco-accent/80 disabled:bg-eco-accent/40 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-6 focus:outline-none focus:ring-2 focus:ring-eco-accent"
              >
                {authLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                )}
              </button>
            </form>

            {/* Form Mode Toggle */}
            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setAuthError('');
                }}
                className="text-[11px] text-eco-text-muted hover:text-eco-accent transition-all"
              >
                {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
              </button>
            </div>
            
            {/* Quick Demo Access Details */}
            {isLogin && (
              <div className="p-3 bg-emerald-950/20 border border-eco-border/40 rounded-xl">
                <span className="text-[9px] text-eco-accent uppercase font-bold tracking-wider block mb-1">Sandbox Access</span>
                <p className="text-[9px] text-eco-text-muted leading-relaxed">
                  Type **demo@ecowise.ai** and password **password** to log in instantly using the Local Storage Sandbox.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  // RENDER MAIN APPLICATION DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-eco-bg flex flex-col lg:flex-row bg-grid-pattern relative">
      {/* Primary Sidebar Menu */}
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        userProfile={userProfile}
        onLogout={handleLogout} 
      />

      {/* Primary Content Panel */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-24 lg:pb-6 relative z-10" aria-label="Main Application Panel">
        {renderPageContent()}
      </main>
    </div>
  );
}
