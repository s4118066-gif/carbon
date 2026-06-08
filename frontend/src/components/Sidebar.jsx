import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calculator, 
  MessageSquare, 
  FileText, 
  User, 
  Trophy, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Leaf, 
  Award 
} from 'lucide-react';

export default function Sidebar({ currentPage, setCurrentPage, userProfile, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calculator', label: 'CO₂ Calculator', icon: Calculator },
    { id: 'twin', label: 'Carbon Twin', icon: User },
    { id: 'coach', label: 'AI Eco Coach', icon: MessageSquare },
    { id: 'ocr', label: 'Bill Analyzer', icon: FileText },
    { id: 'leaderboard', label: 'Eco Challenges', icon: Trophy },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Calculate Level based on points: 100 points per level
  const points = userProfile?.points || 0;
  const level = Math.floor(points / 100) + 1;
  const pointsInCurrentLevel = points % 100;
  const progressToNextLevel = pointsInCurrentLevel; // e.g. 70/100 points = 70%

  const levels = [
    "Seedling",
    "Sprout",
    "Sapling",
    "Oak Tree",
    "Redwood Giant",
    "Forest Guardian"
  ];
  const levelName = levels[Math.min(level - 1, levels.length - 1)];

  const handleNavClick = (id) => {
    setCurrentPage(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Bar */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-eco-card border-b border-eco-border sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Leaf className="text-eco-accent animate-sway h-6 w-6" aria-hidden="true" />
          <span className="font-display font-bold text-lg text-white tracking-wide">EcoWise AI</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 text-eco-text-muted hover:text-white focus:outline-none focus:ring-2 focus:ring-eco-accent rounded-md"
          aria-expanded={isOpen}
          aria-controls="mobile-sidebar"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Main Sidebar Wrapper */}
      <nav 
        id="mobile-sidebar"
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-eco-card border-r border-eco-border flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Primary Navigation"
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo Section */}
          <div className="hidden lg:flex items-center gap-3 p-6 border-b border-eco-border">
            <div className="p-2 bg-eco-accent-glow rounded-xl border border-eco-accent/30">
              <Leaf className="text-eco-accent animate-sway h-6 w-6" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl text-white tracking-wide leading-tight">EcoWise AI</span>
              <span className="text-[10px] text-eco-accent font-semibold tracking-widest uppercase">Carbon Guardian</span>
            </div>
          </div>

          {/* Gamification Profile Widget */}
          {userProfile && (
            <div className="p-5 border-b border-eco-border bg-eco-bg-dark/40">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-emerald-950 border border-eco-accent flex items-center justify-center text-eco-accent font-bold text-shadow-glow">
                  {userProfile.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex flex-col min-w-0">
                  <h2 className="text-sm font-semibold text-white truncate leading-none mb-1">{userProfile.displayName || "Eco Hero"}</h2>
                  <div className="flex items-center gap-1 text-[11px] text-eco-accent font-medium">
                    <Award className="h-3.5 w-3.5" />
                    <span>Lvl {level} | {levelName}</span>
                  </div>
                </div>
              </div>

              {/* Progress to next level */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-eco-text-muted">
                  <span>Green Points: <strong>{points}</strong></span>
                  <span>{progressToNextLevel}/100 GP</span>
                </div>
                <div className="w-full bg-emerald-950/60 rounded-full h-1.5 overflow-hidden border border-eco-border/40">
                  <div 
                    className="bg-eco-accent h-full rounded-full transition-all duration-500" 
                    style={{ width: `${progressToNextLevel}%` }}
                    role="progressbar"
                    aria-valuenow={progressToNextLevel}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-label="Progress to next green level"
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <ul className="flex-1 px-3 py-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-eco-accent ${
                      isActive 
                        ? 'bg-eco-accent text-white font-semibold shadow-lg glow-green' 
                        : 'text-eco-text-muted hover:text-white hover:bg-eco-card-light'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-eco-text-muted group-hover:text-white'}`} aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Sidebar Footer / Logout */}
        <div className="p-4 border-t border-eco-border bg-eco-bg-dark/20">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-white hover:bg-red-950/40 border border-transparent hover:border-red-900/30 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Log out of application"
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Backdrop overlay for mobile menu */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          aria-hidden="true"
        />
      )}
    </>
  );
}
