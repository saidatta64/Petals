import React from 'react';

export interface PriorityStats {
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  completed: number;
  pending: number;
  total: number;
}

interface PriorityDistributionProps {
  priorities: PriorityStats[];
}

export const PriorityDistribution: React.FC<PriorityDistributionProps> = ({ priorities }) => {
  return (
    <div className="bg-workspace-card/50 backdrop-blur-md rounded-[24px] p-6 border border-workspace-border">
      <h2 className="text-lg font-semibold text-workspace-text mb-6">
        Task Priorities Distribution
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {priorities.map((p) => {
          const pct = p.total > 0 ? (p.completed / p.total) * 100 : 0;
          const colorClass =
            p.priority === 'HIGH'
              ? 'bg-workspace-red'
              : p.priority === 'MEDIUM'
              ? 'bg-workspace-yellow'
              : 'bg-workspace-primary';
          return (
            <div
              key={p.priority}
              className="p-4 rounded-2xl bg-workspace-bg/30 border border-workspace-border/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${colorClass}`} />
                  <span className="font-semibold text-workspace-text">{p.priority}</span>
                </div>
                <div className="text-2xl font-bold mt-4 text-workspace-text">{p.total} Total</div>
                <p className="text-xs text-workspace-text-secondary mt-1">
                  {p.completed} Completed, {p.pending} Pending
                </p>
              </div>
              <div className="mt-4">
                <div className="w-full bg-workspace-bg/40 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colorClass}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
