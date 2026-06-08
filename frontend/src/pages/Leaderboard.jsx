import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  MapPin, 
  GraduationCap, 
  Globe, 
  Check, 
  Download, 
  Sparkles,
  Info
} from 'lucide-react';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';

export default function Leaderboard({ userProfile, onProfileUpdate }) {
  const [activeTab, setActiveTab] = useState('challenges'); // challenges, leaderboards, achievements
  const [boardScope, setBoardScope] = useState('global'); // global, city, college
  
  const points = userProfile?.points || 280;
  const username = userProfile?.displayName || "Eco Hero";
  const completedChallenges = userProfile?.completedChallenges || [];

  // Active challenges list
  const challenges = {
    daily: [
      { id: 'ch_d1', text: "Carpool, cycle, or walk to work/school today", gp: 20 },
      { id: 'ch_d2', text: "Go entirely meat-free for all meals today", gp: 15 },
      { id: 'ch_d3', text: "Take a shorter shower (under 5 minutes)", gp: 10 }
    ],
    weekly: [
      { id: 'ch_w1', text: "Unplug all standby electronics when not in use", gp: 35 },
      { id: 'ch_w2', text: "Do not buy any single-use plastic items", gp: 30 },
      { id: 'ch_w3', text: "Line-dry your laundry instead of using a dryer", gp: 25 }
    ],
    monthly: [
      { id: 'ch_m1', text: "Reduce your monthly electricity bill by 10%", gp: 100 },
      { id: 'ch_m2', text: "Participate in a local tree planting or clean-up", gp: 120 }
    ]
  };

  // Mock Leaderboard users
  const leaderboardData = {
    global: [
      { rank: 1, name: "Greta T.", location: "Sweden", points: 850 },
      { rank: 2, name: "David A.", location: "United Kingdom", points: 720 },
      { rank: 3, name: "Leon S.", location: "Germany", points: 640 },
      { rank: 4, name: "Sophia K.", location: "United States", points: 590 },
      { rank: 5, name: "Yuki T.", location: "Japan", points: 510 },
      { rank: 12, name: `${username} (You)`, location: "India", points: points, isUser: true }
    ],
    city: [
      { rank: 1, name: "Rohan Das", location: "Bangalore", points: 490 },
      { rank: 2, name: "Amrita Sen", location: "Bangalore", points: 450 },
      { rank: 3, name: "Kabir M.", location: "Bangalore", points: 390 },
      { rank: 4, name: `${username} (You)`, location: "Bangalore", points: points, isUser: true },
      { rank: 5, name: "Prisha K.", location: "Bangalore", points: 260 }
    ],
    college: [
      { rank: 1, name: "Priya Rao", location: "IISc Bangalore", points: 520 },
      { rank: 2, name: `${username} (You)`, location: "IISc Bangalore", points: points, isUser: true },
      { rank: 3, name: "Aditya P.", location: "IISc Bangalore", points: 270 },
      { rank: 4, name: "Nikita V.", location: "IISc Bangalore", points: 210 }
    ]
  };

  // Badge list and unlock logic
  const badges = [
    { id: 'b_reg', name: "Seedling", desc: "Registered on the EcoWise platform", icon: Globe, unlocked: true },
    { id: 'b_calc', name: "Calculator", desc: "Completed your first carbon estimate", icon: Trophy, unlocked: points >= 300 },
    { id: 'b_green', name: "Green Commuter", desc: "Earned 50 GP in transportation challenges", icon: Award, unlocked: points >= 400 },
    { id: 'b_twin', name: "Forest Guardian", desc: "Planted 5+ virtual trees in Carbon Twin", icon: Award, unlocked: (userProfile?.plantedTrees || 0) >= 5 },
    { id: 'b_pro', name: "Eco Expert", desc: "Surpassed 600 Green Points", icon: Sparkles, unlocked: points >= 600 }
  ];

  const handleCompleteChallenge = (id, gpValue) => {
    if (completedChallenges.includes(id)) return;
    
    const updatedCompleted = [...completedChallenges, id];
    onProfileUpdate({
      points: points + gpValue,
      completedChallenges: updatedCompleted
    });

    confetti({
      particleCount: 50,
      spread: 40,
      origin: { y: 0.8 },
      colors: ['#10b981', '#34d399', '#f59e0b']
    });
  };

  const handleDownloadCertificate = (badgeName) => {
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a5'
      });

      // Border Design
      doc.setDrawColor(16, 185, 129); // Eco green
      doc.setLineWidth(1.5);
      doc.rect(5, 5, 200, 138);
      doc.setDrawColor(12, 35, 28);
      doc.setLineWidth(0.5);
      doc.rect(8, 8, 194, 132);

      // Certificate Background Colors (Light Emerald Tint)
      doc.setFillColor(240, 253, 250);
      doc.rect(9, 9, 192, 130, 'F');

      // Typography
      doc.setTextColor(12, 35, 28);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.text("ECOWISE AI PLATFORM", 105, 30, { align: 'center' });

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(11);
      doc.text("CERTIFICATE OF SUSTAINABLE ACHIEVEMENT", 105, 38, { align: 'center' });

      doc.setFontSize(10);
      doc.text("This is proudly presented to", 105, 54, { align: 'center' });

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(16, 185, 129);
      doc.text(username.toUpperCase(), 105, 68, { align: 'center' });

      doc.setTextColor(12, 35, 28);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`for earning the "${badgeName}" sustainability milestone badge,`, 105, 80, { align: 'center' });
      doc.text("demonstrating dedicated carbon footprint tracking and active environmental stewardship.", 105, 86, { align: 'center' });

      // Footer
      doc.setFontSize(8);
      doc.text(`Certificate Verification ID: EW-${Math.floor(Math.random() * 90000) + 10000}`, 20, 125);
      doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, 145, 125);

      doc.save(`ecowise_certificate_${badgeName.toLowerCase()}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF Certificate:", error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-1 lg:p-4">
      {/* Sub-Header Tabs */}
      <div className="flex border-b border-eco-border/40 pb-px">
        {['challenges', 'leaderboards', 'achievements'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 font-semibold text-xs capitalize tracking-wide transition-all border-b-2 -mb-px focus:outline-none focus:ring-1 focus:ring-eco-accent ${
              activeTab === tab 
                ? 'border-eco-accent text-white font-bold text-shadow-glow' 
                : 'border-transparent text-eco-text-muted hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* VIEW 1: Challenges & Missions */}
      {activeTab === 'challenges' && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl">
            <h1 className="text-xl font-bold font-display text-white mb-2">Sustainability Missions</h1>
            <p className="text-xs text-eco-text-muted">Complete daily and weekly environmental tasks to accumulate Green Points (GP).</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Daily Challenges */}
            <section aria-labelledby="daily-heading" className="glass-card p-5 rounded-2xl space-y-4">
              <h2 id="daily-heading" className="text-sm font-bold text-white font-display uppercase tracking-wider border-b border-eco-border/20 pb-2 flex justify-between items-center">
                <span>Daily Tasks</span>
                <span className="text-[10px] text-eco-accent">Resets daily</span>
              </h2>
              <div className="space-y-3">
                {challenges.daily.map(c => {
                  const completed = completedChallenges.includes(c.id);
                  return (
                    <div key={c.id} className={`p-3 border rounded-xl flex flex-col justify-between h-28 transition-all ${
                      completed ? 'bg-emerald-950/20 border-emerald-900/60 text-emerald-300' : 'bg-eco-bg-dark/40 border-eco-border/30 text-eco-text-muted'
                    }`}>
                      <span className="text-xs leading-normal">{c.text}</span>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-eco-border/10">
                        <span className="text-[10px] font-semibold text-eco-accent">+{c.gp} GP</span>
                        <button
                          onClick={() => handleCompleteChallenge(c.id, c.gp)}
                          disabled={completed}
                          className={`px-3 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                            completed 
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 cursor-default flex items-center gap-0.5' 
                              : 'bg-eco-accent hover:bg-eco-accent/80 text-white focus:outline-none focus:ring-1 focus:ring-eco-accent'
                          }`}
                        >
                          {completed ? (
                            <>
                              <Check className="h-3 w-3" />
                              <span>Completed</span>
                            </>
                          ) : 'Claim GP'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Weekly Challenges */}
            <section aria-labelledby="weekly-heading" className="glass-card p-5 rounded-2xl space-y-4">
              <h2 id="weekly-heading" className="text-sm font-bold text-white font-display uppercase tracking-wider border-b border-eco-border/20 pb-2 flex justify-between items-center">
                <span>Weekly Quests</span>
                <span className="text-[10px] text-eco-accent">7 days left</span>
              </h2>
              <div className="space-y-3">
                {challenges.weekly.map(c => {
                  const completed = completedChallenges.includes(c.id);
                  return (
                    <div key={c.id} className={`p-3 border rounded-xl flex flex-col justify-between h-28 transition-all ${
                      completed ? 'bg-emerald-950/20 border-emerald-900/60 text-emerald-300' : 'bg-eco-bg-dark/40 border-eco-border/30 text-eco-text-muted'
                    }`}>
                      <span className="text-xs leading-normal">{c.text}</span>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-eco-border/10">
                        <span className="text-[10px] font-semibold text-eco-accent">+{c.gp} GP</span>
                        <button
                          onClick={() => handleCompleteChallenge(c.id, c.gp)}
                          disabled={completed}
                          className={`px-3 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                            completed 
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 cursor-default flex items-center gap-0.5' 
                              : 'bg-eco-accent hover:bg-eco-accent/80 text-white focus:outline-none focus:ring-1 focus:ring-eco-accent'
                          }`}
                        >
                          {completed ? (
                            <>
                              <Check className="h-3 w-3" />
                              <span>Completed</span>
                            </>
                          ) : 'Claim GP'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Monthly Missions */}
            <section aria-labelledby="monthly-heading" className="glass-card p-5 rounded-2xl space-y-4">
              <h2 id="monthly-heading" className="text-sm font-bold text-white font-display uppercase tracking-wider border-b border-eco-border/20 pb-2 flex justify-between items-center">
                <span>Monthly Epics</span>
                <span className="text-[10px] text-eco-accent">June Event</span>
              </h2>
              <div className="space-y-3">
                {challenges.monthly.map(c => {
                  const completed = completedChallenges.includes(c.id);
                  return (
                    <div key={c.id} className={`p-3 border rounded-xl flex flex-col justify-between h-28 transition-all ${
                      completed ? 'bg-emerald-950/20 border-emerald-900/60 text-emerald-300' : 'bg-eco-bg-dark/40 border-eco-border/30 text-eco-text-muted'
                    }`}>
                      <span className="text-xs leading-normal">{c.text}</span>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-eco-border/10">
                        <span className="text-[10px] font-semibold text-eco-accent">+{c.gp} GP</span>
                        <button
                          onClick={() => handleCompleteChallenge(c.id, c.gp)}
                          disabled={completed}
                          className={`px-3 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                            completed 
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 cursor-default flex items-center gap-0.5' 
                              : 'bg-eco-accent hover:bg-eco-accent/80 text-white focus:outline-none focus:ring-1 focus:ring-eco-accent'
                          }`}
                        >
                          {completed ? (
                            <>
                              <Check className="h-3 w-3" />
                              <span>Completed</span>
                            </>
                          ) : 'Claim GP'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

          </div>
        </div>
      )}

      {/* VIEW 2: Community Leaderboards */}
      {activeTab === 'leaderboards' && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-xl font-bold font-display text-white">Community Standings</h1>
              <p className="text-xs text-eco-text-muted">Compare Green Point ratings across global ranks, cities, and campus scopes.</p>
            </div>

            {/* Scope selectors */}
            <div className="flex bg-eco-bg-dark border border-eco-border/40 p-1 rounded-xl">
              <button 
                onClick={() => setBoardScope('global')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 focus:outline-none ${boardScope === 'global' ? 'bg-eco-accent text-white shadow' : 'text-eco-text-muted hover:text-white'}`}
              >
                <Globe className="h-3.5 w-3.5" />
                <span>Global</span>
              </button>
              <button 
                onClick={() => setBoardScope('city')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 focus:outline-none ${boardScope === 'city' ? 'bg-eco-accent text-white shadow' : 'text-eco-text-muted hover:text-white'}`}
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>City</span>
              </button>
              <button 
                onClick={() => setBoardScope('college')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 focus:outline-none ${boardScope === 'college' ? 'bg-eco-accent text-white shadow' : 'text-eco-text-muted hover:text-white'}`}
              >
                <GraduationCap className="h-3.5 w-3.5" />
                <span>College</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="glass-card rounded-2xl overflow-hidden border border-eco-border/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" role="table">
                <thead>
                  <tr className="bg-eco-bg-dark/60 border-b border-eco-border/40 text-[10px] font-bold text-eco-text-muted uppercase tracking-wider">
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-6 py-4">UserName</th>
                    <th className="px-6 py-4">Region/Institution</th>
                    <th className="px-6 py-4 text-right">Green Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-eco-border/20 text-xs">
                  {leaderboardData[boardScope].map((row, idx) => (
                    <tr 
                      key={idx} 
                      className={`transition-colors ${row.isUser ? 'bg-eco-accent-glow font-bold border-l-4 border-l-eco-accent text-white' : 'text-eco-text-muted hover:bg-eco-card-light/20 hover:text-white'}`}
                    >
                      <td className="px-6 py-4 flex items-center gap-2">
                        {row.rank === 1 && <Trophy className="h-4 w-4 text-yellow-500" />}
                        {row.rank === 2 && <Trophy className="h-4 w-4 text-zinc-400" />}
                        {row.rank === 3 && <Trophy className="h-4 w-4 text-amber-600" />}
                        <span>#{row.rank}</span>
                      </td>
                      <td className="px-6 py-4">{row.name}</td>
                      <td className="px-6 py-4">{row.location}</td>
                      <td className="px-6 py-4 text-right text-eco-accent font-semibold">{row.points} GP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Badges & Certificates */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl">
            <h1 className="text-xl font-bold font-display text-white mb-2">Green Milestones</h1>
            <p className="text-xs text-eco-text-muted">Unlock badge levels by taking eco actions. Unlocked achievements qualify for official PDF certificates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((b) => {
              const Icon = b.icon;
              return (
                <div 
                  key={b.id} 
                  className={`glass-card p-5 rounded-2xl flex flex-col justify-between min-h-[160px] border transition-all ${
                    b.unlocked 
                      ? 'border-eco-border/80' 
                      : 'opacity-40 border-dashed border-eco-border/40'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 max-w-[80%]">
                      <span className="text-xs font-bold text-white font-display block">{b.name}</span>
                      <p className="text-[10px] text-eco-text-muted leading-relaxed">{b.desc}</p>
                    </div>
                    
                    <div className={`p-2 rounded-xl border ${
                      b.unlocked 
                        ? 'bg-eco-accent-glow border-eco-accent text-eco-accent glow-green' 
                        : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-eco-border/10">
                    <span className={`text-[9px] uppercase font-bold tracking-wider ${b.unlocked ? 'text-eco-accent' : 'text-zinc-600'}`}>
                      {b.unlocked ? 'Unlocked' : 'Locked'}
                    </span>
                    
                    {b.unlocked && (
                      <button
                        onClick={() => handleDownloadCertificate(b.name)}
                        className="px-2.5 py-1 rounded bg-eco-card-light hover:bg-eco-border/40 border border-eco-border/60 text-white text-[9px] font-semibold transition-all flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-eco-accent"
                        aria-label={`Download certificate for badge ${b.name}`}
                      >
                        <Download className="h-3 w-3" />
                        <span>Certificate PDF</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
