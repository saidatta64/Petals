import React from 'react'

export interface WeeklyStat {
  day: string
  count: number
}

interface WeeklyActivityChartProps {
  weekly: WeeklyStat[]
}

export const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({ weekly }) => {
  const maxWeeklyCount = Math.max(...weekly.map((w) => w.count), 1)
  const weekDaysOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const currentDayIdx = new Date().getDay()

  return (
    <div className="bg-workspace-card/90 backdrop-blur-xl rounded-2xl p-6 border border-workspace-border/60 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-brand text-base font-bold text-workspace-text">
          Weekly Completion Activity (Current Week)
        </h2>
        <span className="text-xs font-medium text-workspace-text-secondary">Sun – Sat</span>
      </div>
      <div className="h-64 flex items-end justify-between px-2 pt-6">
        {weekly.map((w) => {
          const dayIdx = weekDaysOrder.indexOf(w.day)
          const isToday = dayIdx === currentDayIdx
          const isFuture = dayIdx > currentDayIdx

          const pct = isFuture ? 4 : (w.count / maxWeeklyCount) * 80 + 5 // height percentage

          return (
            <div
              key={w.day}
              className="flex flex-col items-center justify-end flex-1 h-full group relative pb-1"
            >
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
              <span
                className={`text-xs mt-3 font-medium transition-colors ${
                  isToday
                    ? 'text-workspace-primary font-bold'
                    : isFuture
                      ? 'text-workspace-text-secondary/40'
                      : 'text-workspace-text-secondary'
                }`}
              >
                {w.day}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
