import React from 'react';
import { Flame } from 'lucide-react';

interface StreakWidgetProps {
  currentStreak: number;
}

export const StreakWidget: React.FC<StreakWidgetProps> = ({ currentStreak }) => {
  return (
    <div className="bg-workspace-card/60 backdrop-blur-md border border-workspace-border rounded-[24px] p-6 flex items-center justify-between hover:bg-workspace-card transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-[14px] bg-workspace-warning/10 flex items-center justify-center border border-workspace-warning/20">
          <Flame className="text-workspace-warning drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" size={24} />
        </div>
        <div>
          <p className="text-workspace-text-secondary text-sm font-medium">Current Streak</p>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-bold text-workspace-text tracking-tight">{currentStreak}</p>
            <p className="text-sm font-medium text-workspace-text-secondary">Days</p>
          </div>
        </div>
      </div>
      
      {/* Mini Activity Chart placeholder (Optional depending on design) */}
      <div className="flex items-end gap-1 h-8">
        {[4, 7, 5, 8, 3, 9, 6].map((val, i) => (
          <div 
            key={i} 
            className="w-1.5 bg-workspace-warning/50 rounded-t-sm transition-all"
            style={{ height: `${(val / 10) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
};
