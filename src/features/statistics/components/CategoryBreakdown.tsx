import React from 'react';

export interface CategoryStats {
  categoryId: number;
  categoryName: string;
  completed: number;
  pending: number;
  total: number;
}

interface CategoryBreakdownProps {
  categories: CategoryStats[];
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ categories }) => {
  return (
    <div className="bg-workspace-card/50 backdrop-blur-md rounded-[24px] p-6 border border-workspace-border flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold text-workspace-text mb-6">
          Category Completion Breakdown
        </h2>
        <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
          {categories.map((c) => {
            const completionPct = c.total > 0 ? (c.completed / c.total) * 100 : 0;
            return (
              <div key={c.categoryId} className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-workspace-text">{c.categoryName}</span>
                  <span className="text-workspace-text-secondary">
                    {c.completed} / {c.total} completed ({completionPct.toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full bg-workspace-bg/40 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-workspace-green h-full rounded-full transition-all duration-300"
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
              </div>
            );
          })}
          {categories.length === 0 && (
            <p className="text-workspace-text-secondary text-sm text-center py-8">
              No task categories tracked yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
