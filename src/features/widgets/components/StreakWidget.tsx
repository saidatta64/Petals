import React from 'react';
import { Flame } from 'lucide-react';

interface StreakWidgetProps {
  currentStreak: number;
}

export const StreakWidget: React.FC<StreakWidgetProps> = ({ currentStreak }) => {
  return (
    <div className="bg-workspace-card/90 backdrop-blur-xl border border-workspace-border/60 rounded-2xl p-5 flex items-center justify-between hover:border-workspace-border transition-all duration-200 shadow-sm">
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-workspace-warning/10 flex items-center justify-center border border-workspace-warning/20">
          <Flame className="text-workspace-warning" size={22} />
        </div>
        <div>
          <p className="text-workspace-text-secondary text-xs font-semibold uppercase tracking-wider">Current Streak</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <p className="font-brand text-2xl font-bold text-workspace-text tracking-tight">{currentStreak}</p>
            <p className="text-xs font-medium text-workspace-text-secondary">Days</p>
          </div>
        </div>
      </div>
      
      {/* Mini Activity Chart */}
      <div className="flex items-end gap-1.5 h-8">
        {[4, 7, 5, 8, 3, 9, 6].map((val, i) => (
          <div 
            key={i} 
            className="w-1.5 bg-workspace-warning/40 rounded-full transition-all"
            style={{ height: `${(val / 10) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
};
