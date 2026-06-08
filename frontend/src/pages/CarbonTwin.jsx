import React, { useState } from 'react';
import { 
  TreePine, 
  Wind, 
  Sun, 
  CloudRain, 
  Flame, 
  Sparkles, 
  Trash2, 
  Info,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CarbonTwin({ userProfile, onProfileUpdate }) {
  const footprint = userProfile?.footprint || 4.2;
  const points = userProfile?.points || 280;
  
  // Virtual trees planted count
  const [plantedTrees, setPlantedTrees] = useState(userProfile?.plantedTrees || 3);
  const [isPlanting, setIsPlanting] = useState(false);

  // Determine environmental state: 'green', 'neutral', 'polluted'
  let state = 'neutral';
  if (footprint < 3.0) state = 'green';
  else if (footprint >= 5.5) state = 'polluted';

  const handlePlantTree = () => {
    if (points < 50) {
      alert("You need at least 50 Green Points to plant a virtual tree!");
      return;
    }
    
    setIsPlanting(true);
    setTimeout(() => {
      const updatedTrees = plantedTrees + 1;
      setPlantedTrees(updatedTrees);
      onProfileUpdate({
        points: points - 50, // spend 50 GP
        plantedTrees: updatedTrees
      });
      setIsPlanting(false);
      
      // Celebrate!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#059669', '#34d399']
      });
    }, 1500);
  };

  // Color variables depending on footprint
  const skyColor = state === 'green' ? '#14b8a6' : state === 'neutral' ? '#0d9488' : '#78350f';
  const groundColor = state === 'green' ? '#065f46' : state === 'neutral' ? '#115e59' : '#451a03';
  const riverColor = state === 'green' ? '#38bdf8' : state === 'neutral' ? '#0284c7' : '#292524';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in p-1 lg:p-4">
      {/* Large SVG Avatar Panel */}
      <div className="lg:col-span-2 glass-card p-6 rounded-2xl flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-display text-white">Digital Carbon Twin</h1>
            <p className="text-xs text-eco-text-muted">A real-time reflection of your environmental decisions.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              state === 'green' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' :
              state === 'neutral' ? 'bg-teal-950 text-teal-400 border border-teal-900' :
              'bg-red-950 text-red-400 border border-red-900'
            }`}>
              {state === 'green' ? 'Pristine Haven' : state === 'neutral' ? 'Developing Lawn' : 'Toxic Fallout'}
            </span>
          </div>
        </div>

        {/* The SVG Canvas Container */}
        <div className="w-full h-80 rounded-2xl overflow-hidden relative border border-eco-border/50 bg-[#05140e]">
          
          {/* Dynamic Sky */}
          <div className="absolute inset-0 transition-colors duration-1000" style={{
            background: state === 'green' 
              ? 'linear-gradient(to bottom, #075985, #0ea5e9)' 
              : state === 'neutral' 
              ? 'linear-gradient(to bottom, #0f766e, #0d9488)' 
              : 'linear-gradient(to bottom, #451a03, #b45309)'
          }}>
            
            {/* Sun or Smog clouds */}
            {state !== 'polluted' ? (
              <svg className="absolute top-6 left-12 h-16 w-16 text-yellow-300 animate-pulse-slow" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="6" />
                <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <div className="absolute top-8 left-1/3 bg-zinc-800/80 blur-lg rounded-full h-20 w-44 animate-pulse-slow" />
            )}

            {/* Clouds / Birds */}
            {state === 'green' && (
              <div className="absolute top-12 right-20 text-white/40 animate-float">
                <svg className="h-8 w-16" fill="currentColor" viewBox="0 0 24 16">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
                </svg>
              </div>
            )}

            {/* Wind Turbines (Green Mode Only) */}
            {state === 'green' && (
              <div className="absolute bottom-24 right-1/4 flex gap-6 text-emerald-200/60">
                {[1, 2].map((i) => (
                  <div key={i} className="flex flex-col items-center origin-bottom scale-75">
                    {/* Rotating blades */}
                    <div className="h-10 w-10 border-2 border-dashed border-emerald-300/40 rounded-full animate-[spin_4s_linear_infinite]" />
                    <div className="h-12 w-1 bg-emerald-400/40" />
                  </div>
                ))}
              </div>
            )}

            {/* Factory Smokestacks (Polluted Mode Only) */}
            {state === 'polluted' && (
              <div className="absolute bottom-20 right-10 flex items-end">
                <div className="bg-zinc-700 w-12 h-24 border-r border-zinc-600 relative">
                  {/* Smoke particle representation */}
                  <div className="absolute -top-6 left-1 bg-zinc-500/80 rounded-full h-8 w-8 blur-sm animate-[float_3s_infinite]" />
                  <div className="absolute -top-10 left-3 bg-zinc-600/70 rounded-full h-10 w-10 blur-sm animate-[float_4s_infinite]" />
                </div>
                <div className="bg-zinc-800 w-8 h-16 border-r border-zinc-700" />
              </div>
            )}
            
            {/* Solar Panel House (Neutral & Green) */}
            {state !== 'polluted' && (
              <div className="absolute bottom-20 left-12 bg-amber-900/40 border border-amber-950/40 p-4 rounded-lg flex flex-col justify-end w-20 h-16">
                <div className="absolute -top-3 left-0 right-0 h-4 bg-red-950 rounded-t-lg border-b border-eco-border" />
                {state === 'green' && (
                  <div className="absolute -top-4 right-1 bg-sky-950 border border-sky-400/50 p-0.5 rounded flex gap-0.5 scale-90">
                    <div className="h-2 w-3 bg-sky-900" />
                    <div className="h-2 w-3 bg-sky-900" />
                  </div>
                )}
                <div className="h-6 w-4 bg-yellow-500/40 rounded" />
              </div>
            )}
          </div>

          {/* Dynamic Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-24 transition-colors duration-1000" style={{
            backgroundColor: groundColor,
            borderTop: `4px solid ${state === 'green' ? '#10b981' : state === 'neutral' ? '#14b8a6' : '#92400e'}`
          }}>
            
            {/* Dynamic Water River */}
            <div className="absolute bottom-0 right-0 w-32 h-16 origin-bottom-right rotate-12 transition-colors duration-1000" style={{
              backgroundColor: riverColor,
              borderLeft: `2px solid ${state === 'green' ? '#60a5fa' : '#4b5563'}`
            }}>
              {state === 'polluted' && (
                <div className="absolute top-2 left-6 text-zinc-500">
                  <Trash2 className="h-4 w-4 rotate-12 animate-float" />
                </div>
              )}
            </div>

            {/* Planted Trees rendering dynamically */}
            <div className="absolute -top-10 left-36 flex gap-2 flex-wrap max-w-[200px]">
              {Array.from({ length: plantedTrees }).map((_, i) => (
                <div key={i} className="text-emerald-400 animate-[sway_6s_ease-in-out_infinite] origin-bottom scale-90">
                  <svg className="h-12 w-8" viewBox="0 0 20 28" fill="currentColor">
                    <path d="M10 2L3 14H7V22H13V14H17L10 2Z" />
                    <rect x="9" y="22" width="2" height="6" fill="#78350f" />
                  </svg>
                </div>
              ))}
            </div>

            {/* Bare Dead Wood (Polluted Mode) */}
            {state === 'polluted' && (
              <div className="absolute -top-12 left-1/3 text-orange-950 scale-110">
                <svg className="h-16 w-8" viewBox="0 0 10 20" fill="currentColor">
                  <rect x="4.5" y="0" width="1" height="20" />
                  <path d="M5 6 L8 3" stroke="currentColor" strokeWidth="1" />
                  <path d="M5 10 L2 7" stroke="currentColor" strokeWidth="1" />
                  <path d="M5 14 L8 12" stroke="currentColor" strokeWidth="1" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Info panel */}
        <div className="p-4 bg-eco-bg-dark/40 border border-eco-border/40 rounded-xl flex gap-3 items-start">
          <Info className="text-eco-accent h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-xs text-eco-text-muted leading-relaxed">
            Your Carbon Twin depicts a virtual biosphere reflecting your footprint. 
            By choosing green methods (biking, vegan diet, clean utilities), you clear the smog, shut down the factories, and invite clean wind and solar energy into your twin's biome!
          </p>
        </div>
      </div>

      {/* Gamification Actions Panel */}
      <div className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Award className="text-eco-accent h-5 w-5" />
            <h2 className="text-sm font-semibold text-white font-display tracking-wide uppercase">Actions & Upgrades</h2>
          </div>
          
          <p className="text-xs text-eco-text-muted leading-relaxed">
            Grow your biosphere directly by spending accumulated Green Points (GP). Each action spawns a visible improvement!
          </p>

          <div className="space-y-4 pt-2">
            {/* Plant a Tree Action */}
            <div className="p-4 bg-eco-bg-dark/40 border border-eco-border/30 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-950 text-emerald-400 rounded-lg border border-emerald-900">
                  <TreePine className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block">Plant a Virtual Tree</span>
                  <span className="text-[10px] text-eco-text-muted">Cost: 50 Green Points</span>
                </div>
              </div>
              
              <button
                onClick={handlePlantTree}
                disabled={points < 50 || isPlanting}
                className="px-3 py-1.5 rounded-lg bg-eco-accent hover:bg-eco-accent/80 text-white font-semibold text-[10px] disabled:opacity-40 disabled:hover:bg-eco-accent transition-all flex items-center gap-1"
              >
                {isPlanting ? 'Spawning...' : 'Plant +1'}
              </button>
            </div>

            {/* Tree counts */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-eco-bg-dark/40 border border-eco-border/30 rounded-xl text-center">
                <span className="text-[10px] text-eco-text-muted block uppercase">Trees Planted</span>
                <span className="text-xl font-bold text-white font-display mt-0.5 block">{plantedTrees}</span>
              </div>
              <div className="p-3 bg-eco-bg-dark/40 border border-eco-border/30 rounded-xl text-center">
                <span className="text-[10px] text-eco-text-muted block uppercase">Green Balance</span>
                <span className="text-xl font-bold text-eco-accent font-display mt-0.5 block">{points} GP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Environmental impact indicator */}
        <div className="p-4 bg-emerald-950/20 border border-eco-border/40 rounded-xl space-y-2">
          <span className="text-[10px] text-eco-accent uppercase font-bold tracking-wider block">Bio Feedback</span>
          <div className="space-y-1 text-xs text-eco-text-muted">
            <div className="flex justify-between border-b border-eco-border/20 py-1">
              <span>Sky Quality:</span>
              <span className={state === 'green' ? 'text-emerald-400 font-semibold' : state === 'neutral' ? 'text-teal-400' : 'text-red-400'}>
                {state === 'green' ? '98% Clean' : state === 'neutral' ? '74% Fair' : '22% Toxic'}
              </span>
            </div>
            <div className="flex justify-between border-b border-eco-border/20 py-1">
              <span>Clean Energy:</span>
              <span className={state === 'green' ? 'text-emerald-400 font-semibold' : 'text-eco-text-muted'}>
                {state === 'green' ? 'Active Solar/Wind' : 'None Grid'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span>Bio Density:</span>
              <span className="text-white font-medium">{plantedTrees} Trees</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
