import React from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

export default function MetricCard({ title, value, unit, icon: Icon, description, trend, trendType }) {
  const renderTrend = () => {
    if (!trend) return null;
    
    if (trendType === 'positive') { // Green is positive (usually down for carbon, up for points)
      return (
        <span className="inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-900/50">
          <ArrowDownRight className="h-3 w-3 shrink-0" />
          <span>{trend}</span>
        </span>
      );
    } else if (trendType === 'negative') { // Red/Orange is negative (up for carbon, down for points)
      return (
        <span className="inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-900/50">
          <ArrowUpRight className="h-3 w-3 shrink-0" />
          <span>{trend}</span>
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
          <Minus className="h-3 w-3 shrink-0" />
          <span>{trend}</span>
        </span>
      );
    }
  };

  return (
    <div className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between min-h-[140px]">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs font-medium text-eco-text-muted uppercase tracking-wider">{title}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-display text-white tracking-tight">{value}</span>
            {unit && <span className="text-sm font-medium text-eco-text-muted">{unit}</span>}
          </div>
        </div>
        <div className="p-3 bg-eco-card-light rounded-xl border border-eco-border/40 text-eco-accent">
          <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-eco-border/20">
        <span className="text-xs text-eco-text-muted truncate mr-2">{description}</span>
        {renderTrend()}
      </div>
    </div>
  );
}
