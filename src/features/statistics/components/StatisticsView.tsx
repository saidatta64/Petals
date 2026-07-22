import { useEffect, useState } from 'react'

interface OverallStats {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  completionRate: number
}

interface CategoryStats {
  categoryId: number
  categoryName: string
  completed: number
  pending: number
  total: number
}

interface PriorityStats {
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  completed: number;
  pending: number;
  total: number;
}

interface WeeklyStat {
  day: string
  count: number
}

export default function StatisticsView() {
  const [overall, setOverall] = useState<OverallStats | null>(null)
  const [categories, setCategories] = useState<CategoryStats[]>([])
  const [priorities, setPriorities] = useState<PriorityStats[]>([])
  const [weekly, setWeekly] = useState<WeeklyStat[]>([])

  useEffect(() => {
    async function fetchStats() {
      if (window.taskflow) {
        const [overallStats, catStats, prioStats, weekStats] = await Promise.all([
          window.taskflow.stats.getOverall(),
          window.taskflow.stats.getCategory(),
          window.taskflow.stats.getPriority(),
          window.taskflow.stats.getWeekly(),
        ])
        setOverall(overallStats as OverallStats)
        setCategories(catStats as CategoryStats[])
        setPriorities(prioStats as PriorityStats[])
        setWeekly(weekStats as WeeklyStat[])
      }
    }
    fetchStats()
  }, [])

  const maxWeeklyCount = Math.max(...weekly.map((w) => w.count), 1)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-workspace-text">Productivity Statistics</h1>
        <p className="text-workspace-text-secondary mt-1">
          Detailed metrics of your productivity trends and categories.
        </p>
      </div>

      {overall && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-workspace-card/50 backdrop-blur-md rounded-[24px] p-6 border border-workspace-border">
            <span className="text-xs font-semibold text-workspace-text-secondary uppercase">Total Tasks</span>
            <div className="text-3xl font-bold mt-2 text-workspace-text">{overall.totalTasks}</div>
          </div>
          <div className="bg-workspace-card/50 backdrop-blur-md rounded-[24px] p-6 border border-workspace-border">
            <span className="text-xs font-semibold text-workspace-text-secondary uppercase">Completed</span>
            <div className="text-3xl font-bold mt-2 text-workspace-green">{overall.completedTasks}</div>
          </div>
          <div className="bg-workspace-card/50 backdrop-blur-md rounded-[24px] p-6 border border-workspace-border">
            <span className="text-xs font-semibold text-workspace-text-secondary uppercase">Pending</span>
            <div className="text-3xl font-bold mt-2 text-workspace-primary">{overall.pendingTasks}</div>
          </div>
          <div className="bg-workspace-card/50 backdrop-blur-md rounded-[24px] p-6 border border-workspace-border">
            <span className="text-xs font-semibold text-workspace-text-secondary uppercase">Completion Rate</span>
            <div className="text-3xl font-bold mt-2 text-workspace-yellow">
              {overall.completionRate.toFixed(1)}%
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Productivity SVG Chart */}
        <div className="bg-workspace-card/90 backdrop-blur-xl rounded-2xl p-6 border border-workspace-border/60 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-brand text-base font-bold text-workspace-text">Weekly Completion Activity (Current Week)</h2>
            <span className="text-xs font-medium text-workspace-text-secondary">Sun – Sat</span>
          </div>
          <div className="h-64 flex items-end justify-between px-2 pt-6">
            {weekly.map((w) => {
              const weekDaysOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
              const currentDayIdx = new Date().getDay()
              const dayIdx = weekDaysOrder.indexOf(w.day)
              const isToday = dayIdx === currentDayIdx
              const isFuture = dayIdx > currentDayIdx

              const pct = isFuture ? 4 : (w.count / maxWeeklyCount) * 80 + 5 // height percentage

              return (
                <div key={w.day} className="flex flex-col items-center justify-end flex-1 h-full group relative pb-1">
                  {/* Bar */}
                  <div
                    className={`w-8 rounded-t-md transition-all duration-200 relative group/bar ${
                      isToday
                        ? 'bg-workspace-primary shadow-sm shadow-workspace-primary/40'
                        : isFuture
                        ? 'bg-workspace-border/40 border border-dashed border-workspace-border'
                        : 'bg-workspace-primary/70 hover:bg-workspace-primary'
                    }`}
                    style={{ height: `${pct}%`, minHeight: '6px' }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-workspace-card border border-workspace-border/60 text-workspace-text text-[10px] py-1 px-2.5 rounded-xl shadow-sm opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                      {isFuture ? 'Upcoming day' : `${w.count} completed`}
                    </div>
                  </div>
                  <span className={`text-xs mt-3 font-medium transition-colors ${
                    isToday 
                      ? 'text-workspace-primary font-bold' 
                      : isFuture 
                      ? 'text-workspace-text-secondary/40' 
                      : 'text-workspace-text-secondary'
                  }`}>
                    {w.day}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Category breakdown progress list */}
        <div className="bg-workspace-card/50 backdrop-blur-md rounded-[24px] p-6 border border-workspace-border flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-workspace-text mb-6">Category Completion Breakdown</h2>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
              {categories.map((c) => {
                const completionPct = c.total > 0 ? (c.completed / c.total) * 100 : 0
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
                )
              })}
              {categories.length === 0 && (
                <p className="text-workspace-text-secondary text-sm text-center py-8">
                  No task categories tracked yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-workspace-card/50 backdrop-blur-md rounded-[24px] p-6 border border-workspace-border">
        <h2 className="text-lg font-semibold text-workspace-text mb-6">Task Priorities Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {priorities.map((p) => {
            const pct = p.total > 0 ? (p.completed / p.total) * 100 : 0
            const colorClass =
              p.priority === 'HIGH'
                ? 'bg-workspace-red'
                : p.priority === 'MEDIUM'
                ? 'bg-workspace-yellow'
                : 'bg-workspace-primary'
            return (
              <div key={p.priority} className="p-4 rounded-2xl bg-workspace-bg/30 border border-workspace-border/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${colorClass}`} />
                    <span className="font-semibold text-workspace-text">{p.priority}</span>
                  </div>
                  <div className="text-2xl font-bold mt-4 text-workspace-text">
                    {p.total} Total
                  </div>
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
            )
          })}
        </div>
      </div>
    </div>
  )
}
