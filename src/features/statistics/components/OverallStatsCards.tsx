import React from 'react';

export interface OverallStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
}

interface OverallStatsCardsProps {
  overall: OverallStats;
}

export const OverallStatsCards: React.FC<OverallStatsCardsProps> = ({ overall }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-workspace-card/50 backdrop-blur-md rounded-[24px] p-6 border border-workspace-border">
        <span className="text-xs font-semibold text-workspace-text-secondary uppercase">
          Total Tasks
        </span>
        <div className="text-3xl font-bold mt-2 text-workspace-text">{overall.totalTasks}</div>
      </div>
      <div className="bg-workspace-card/50 backdrop-blur-md rounded-[24px] p-6 border border-workspace-border">
        <span className="text-xs font-semibold text-workspace-text-secondary uppercase">
          Completed
        </span>
        <div className="text-3xl font-bold mt-2 text-workspace-green">{overall.completedTasks}</div>
      </div>
      <div className="bg-workspace-card/50 backdrop-blur-md rounded-[24px] p-6 border border-workspace-border">
        <span className="text-xs font-semibold text-workspace-text-secondary uppercase">
          Pending
        </span>
        <div className="text-3xl font-bold mt-2 text-workspace-primary">{overall.pendingTasks}</div>
      </div>
      <div className="bg-workspace-card/50 backdrop-blur-md rounded-[24px] p-6 border border-workspace-border">
        <span className="text-xs font-semibold text-workspace-text-secondary uppercase">
          Completion Rate
        </span>
        <div className="text-3xl font-bold mt-2 text-workspace-yellow">
          {overall.completionRate.toFixed(1)}%
        </div>
      </div>
    </div>
  );
};
