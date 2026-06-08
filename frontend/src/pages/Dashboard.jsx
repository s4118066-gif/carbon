import React from 'react';
import { 
  Leaf, 
  Flame, 
  Trophy, 
  Sparkles, 
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard({ userProfile, setCurrentPage }) {
  // Stats
  const carbonFootprint = userProfile?.footprint || 4.2;
  const points = userProfile?.points || 280;
  
  // Custom mock data for charts
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        fill: true,
        label: 'Emissions (t CO₂e)',
        data: [5.2, 4.9, 4.7, 4.5, 4.3, carbonFootprint],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: '#10b981',
      },
    ],
  };

  const categoryData = {
    labels: ['Transport', 'Home Energy', 'Diet & Food', 'Shopping'],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: [
          '#10b981', // Emerald
          '#0d9488', // Teal
          '#059669', // Dark Emerald
          '#0f766e'  // Deep Teal
        ],
        borderWidth: 1,
        borderColor: '#05140e',
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0c231c',
        titleColor: '#fff',
        bodyColor: '#f3f4f6',
        borderColor: '#184435',
        borderWidth: 1,
      }
    },
    scales: {
      x: { grid: { color: 'rgba(24, 68, 53, 0.1)' }, ticks: { color: '#8ca39a' } },
      y: { grid: { color: 'rgba(24, 68, 53, 0.1)' }, ticks: { color: '#8ca39a' } },
    },
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#f3f4f6',
          font: { family: 'Outfit', size: 12 },
          boxWidth: 12,
        }
      },
      tooltip: {
        backgroundColor: '#0c231c',
        borderColor: '#184435',
        borderWidth: 1,
      }
    },
    cutout: '70%',
  };

  const recommendations = [
    { text: "Switching to public transit or cycling can reduce your footprint by 15% this month.", type: "transport" },
    { text: "Going meatless for 3 days a week cuts down food-based emissions significantly.", type: "food" },
    { text: "Unplugging standby electronics cuts down phantom electricity consumption.", type: "energy" }
  ];

  return (
    <div className="space-y-6 animate-fade-in p-1 lg:p-4">
      {/* Welcome Banner */}
      <section 
        className="relative overflow-hidden rounded-3xl p-6 lg:p-8 bg-gradient-to-r from-eco-card to-emerald-950/40 border border-eco-border/40"
        aria-labelledby="banner-heading"
      >
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-eco-accent-glow border border-eco-accent/30 text-eco-accent text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Eco Challenge Active</span>
          </div>
          <h1 id="banner-heading" className="text-2xl lg:text-3xl font-display font-bold text-white tracking-tight leading-tight">
            Hello, {userProfile?.displayName || 'Eco Warrior'}! 👋
          </h1>
          <p className="text-sm text-eco-text-muted leading-relaxed max-w-lg">
            Your carbon footprint is **{carbonFootprint} tonnes CO₂e/year**, which is **25% lower** than your region's average. Keep up the green choices to grow your Carbon Twin!
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button 
              onClick={() => setCurrentPage('calculator')}
              className="px-5 py-2.5 rounded-xl bg-eco-accent text-white font-semibold text-xs transition-all hover:bg-eco-accent/80 focus:outline-none focus:ring-2 focus:ring-eco-accent hover:shadow-lg hover:shadow-emerald-950/50 flex items-center gap-1.5"
            >
              <span>Recalculate Footprint</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button 
              onClick={() => setCurrentPage('leaderboard')}
              className="px-5 py-2.5 rounded-xl bg-eco-card-light text-white border border-eco-border/60 hover:bg-eco-border/40 font-semibold text-xs transition-all focus:outline-none focus:ring-2 focus:ring-eco-accent"
            >
              View Active Challenges
            </button>
          </div>
        </div>
        
        {/* Abstract background blobs */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial from-eco-accent/10 to-transparent blur-3xl pointer-events-none" />
      </section>

      {/* Metrics Row */}
      <section aria-label="Key Sustainability Metrics" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          title="Carbon Footprint" 
          value={carbonFootprint}
          unit="t CO₂e/yr"
          icon={Leaf}
          description="Annual emissions rate"
          trend="8.5% down"
          trendType="positive"
        />
        <MetricCard 
          title="Green Points" 
          value={points}
          unit="GP"
          icon={Trophy}
          description="Total points earned"
          trend="+40 GP"
          trendType="positive"
        />
        <MetricCard 
          title="Carbon Twin Status" 
          value={carbonFootprint < 3.0 ? "Thriving" : carbonFootprint < 5.0 ? "Verdant" : "Struggling"}
          icon={Flame}
          description="Avatar health status"
          trend={carbonFootprint < 5.0 ? "Stable" : "Decline"}
          trendType={carbonFootprint < 5.0 ? "neutral" : "negative"}
        />
      </section>

      {/* Charts & Carbon Twin Preview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Chart */}
        <section aria-label="Monthly Emission Trends" className="glass-card p-6 rounded-2xl lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white font-display tracking-wide uppercase">Monthly Emission Trends</h2>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/40">
              <TrendingDown className="h-3 w-3" />
              <span>Target Achieved</span>
            </span>
          </div>
          <div className="h-64 relative">
            <Line data={monthlyData} options={lineOptions} />
          </div>
        </section>

        {/* Category breakdown (Doughnut) */}
        <section aria-label="Emissions Category Breakdown" className="glass-card p-6 rounded-2xl space-y-4">
          <h2 className="text-sm font-semibold text-white font-display tracking-wide uppercase">Emission Categories</h2>
          <div className="h-56 relative flex items-center justify-center">
            <Doughnut data={categoryData} options={donutOptions} />
          </div>
          <div className="text-center">
            <span className="text-[11px] text-eco-text-muted">Transport remains your largest source of carbon.</span>
          </div>
        </section>
      </div>

      {/* Recommendations & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Recommendations */}
        <section aria-labelledby="rec-heading" className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-eco-accent h-5 w-5" />
            <h2 id="rec-heading" className="text-sm font-semibold text-white font-display tracking-wide uppercase">AI Recommendations</h2>
          </div>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex gap-3 p-3 bg-eco-bg-dark/40 border border-eco-border/30 rounded-xl items-start">
                <Info className="h-4 w-4 shrink-0 text-eco-accent mt-0.5" />
                <p className="text-xs text-eco-text-muted leading-normal">{rec.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Carbon Twin Preview Section */}
        <section aria-labelledby="twin-preview-heading" className="glass-card p-6 rounded-2xl space-y-4 relative overflow-hidden flex flex-col justify-between">
          <div>
            <h2 id="twin-preview-heading" className="text-sm font-semibold text-white font-display tracking-wide uppercase mb-2">Digital Carbon Twin</h2>
            <p className="text-xs text-eco-text-muted leading-relaxed">
              Your digital twin is currently **{carbonFootprint < 3.0 ? "highly sustainable" : carbonFootprint < 5.0 ? "moderately clean" : "under stress"}**. Reduce emissions to upgrade your twin's ecosystem!
            </p>
          </div>
          
          <div className="flex justify-center my-2 p-3 bg-eco-bg-dark/30 rounded-xl border border-eco-border/20">
            {/* Visual avatar summary */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className={`h-16 w-16 rounded-full flex items-center justify-center border-2 ${
                  carbonFootprint < 3.0 ? 'border-emerald-500 bg-emerald-950/40 text-emerald-400' : 
                  carbonFootprint < 5.0 ? 'border-yellow-500 bg-yellow-950/20 text-yellow-500' : 'border-red-500 bg-red-950/30 text-red-500'
                }`}>
                  <User className="h-8 w-8" />
                </div>
                <span className="absolute -bottom-1 -right-1 bg-eco-accent rounded-full p-1 text-white border border-eco-card">
                  <Leaf className="h-3 w-3" />
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-white block">Environment: {carbonFootprint < 3.0 ? "Pristine Park" : carbonFootprint < 5.0 ? "Lawn & Garden" : "Industrial Smog"}</span>
                <span className="text-[10px] text-eco-text-muted block">Trees Planted: {carbonFootprint < 3.0 ? "12 (Virtual)" : carbonFootprint < 5.0 ? "4 (Virtual)" : "0 (Virtual)"}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setCurrentPage('twin')}
            className="w-full py-2.5 rounded-xl bg-eco-card-light hover:bg-eco-border/30 text-white font-semibold text-xs border border-eco-border/40 transition-all focus:outline-none focus:ring-2 focus:ring-eco-accent flex items-center justify-center gap-1"
          >
            <span>Open Carbon Twin Interface</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </section>
      </div>
    </div>
  );
}
