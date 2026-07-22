import { useEffect, useState, useMemo, useCallback } from 'react'
import { useTaskStore } from '@shared/stores/taskStore'

interface HeatmapData {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

interface HeatmapProps {
  days?: number
}

const CELL_SIZE = 11
const GAP = 3
const COL_WIDTH = CELL_SIZE + GAP

export default function Heatmap({ days = 365 }: HeatmapProps) {
  const [data, setData] = useState<HeatmapData[]>([])
  const [range, setRange] = useState<number>(days)
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)
  const tasks = useTaskStore((state) => state.tasks)

  useEffect(() => {
    async function fetchHeatmap() {
      if (window.taskflow) {
        const heatmapData = await window.taskflow.heatmap.get(range)
        setData(heatmapData as HeatmapData[])
      }
    }
    fetchHeatmap()
  }, [range, tasks])

  const stats = useMemo(() => {
    if (data.length === 0) return { activeDays: 0, maxStreak: 0, currentStreak: 0 }

    let activeDays = 0
    let maxStreak = 0
    let streak = 0

    for (const day of data) {
      if (day.count > 0) {
        activeDays++
        streak++
        if (streak > maxStreak) maxStreak = streak
      } else {
        streak = 0
      }
    }

    let currentStreak = 0
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].count > 0) {
        currentStreak++
      } else {
        break
      }
    }

    return { activeDays, maxStreak, currentStreak }
  }, [data])

  const { columns, monthLabels } = useMemo(() => {
    if (data.length === 0) return { columns: [], monthLabels: [] }

    const firstDate = new Date(data[0].date)
    const startDow = firstDate.getDay()

    type Cell = { date: string; count: number; level: number; empty: boolean }
    const flat: Cell[] = []

    for (let i = 0; i < startDow; i++) {
      flat.push({ date: '', count: 0, level: 0, empty: true })
    }
    for (const d of data) {
      flat.push({ ...d, empty: false })
    }

    const cols: Cell[][] = []
    for (let i = 0; i < flat.length; i += 7) {
      const week = flat.slice(i, i + 7)
      while (week.length < 7) {
        week.push({ date: '', count: 0, level: 0, empty: true })
      }
      cols.push(week)
    }

    const labels: { text: string; colIndex: number }[] = []
    let lastMonth = -1
    let lastColIndex = -10

    for (let c = 0; c < cols.length; c++) {
      const firstReal = cols[c].find(cell => !cell.empty)
      if (firstReal) {
        const d = new Date(firstReal.date)
        const m = d.getMonth()
        if (m !== lastMonth) {
          if (c - lastColIndex >= 2 || c === 0) {
            labels.push({
              text: d.toLocaleDateString('en-US', { month: 'short' }),
              colIndex: c,
            })
            lastMonth = m
            lastColIndex = c
          }
        }
      }
    }

    return { columns: cols, monthLabels: labels }
  }, [data])

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-emerald-200 dark:bg-[#0e4429] hover:opacity-90'
      case 2:
        return 'bg-emerald-400 dark:bg-[#006d32] hover:opacity-90'
      case 3:
        return 'bg-emerald-600 dark:bg-[#26a641] hover:opacity-90'
      case 4:
        return 'bg-emerald-700 dark:bg-[#39d353] hover:opacity-90 shadow-[0_0_6px_rgba(57,211,83,0.35)]'
      default:
        return 'bg-zinc-200/90 dark:bg-[#161b22] border border-black/5 dark:border-white/[0.03] hover:bg-zinc-300 dark:hover:bg-[#262c36]'
    }
  }

  const handleCellHover = useCallback((e: React.MouseEvent, cell: { date: string; count: number }) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const container = (e.currentTarget as HTMLElement).closest('[data-heatmap-root]')
    if (!container) return
    const containerRect = container.getBoundingClientRect()

    const formattedDate = new Date(cell.date).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

    setTooltip({
      text: `${cell.count} task${cell.count !== 1 ? 's' : ''} on ${formattedDate}`,
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top - 8,
    })
  }, [])

  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', '']

  return (
    <div className="relative" data-heatmap-root>
      {/* Floating tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none z-50 -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="bg-[#1b1f23] text-[#e6edf3] text-[11px] font-medium px-3 py-1.5 rounded-md shadow-xl border border-[#30363d] whitespace-nowrap">
            {tooltip.text}
          </div>
          {/* Tooltip arrow */}
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-[#1b1f23] border-r border-b border-[#30363d] transform rotate-45 -mt-1" />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-brand text-base font-bold text-workspace-text">Consistency Graph</h2>
          <div className="flex items-center gap-2">
            <span className="bg-workspace-bg/80 border border-workspace-border/60 text-workspace-text-secondary text-xs px-3 py-1 rounded-full font-medium shadow-xs">
              Active days: <strong className="text-workspace-text font-bold ml-1">{stats.activeDays}</strong>
            </span>
            <span className="bg-workspace-bg/80 border border-workspace-border/60 text-workspace-text-secondary text-xs px-3 py-1 rounded-full font-medium shadow-xs">
              Max streak: <strong className="text-workspace-text font-bold ml-1">{stats.maxStreak} 🔥</strong>
            </span>
          </div>
        </div>

        <select
          value={range}
          onChange={(e) => setRange(Number(e.target.value))}
          className="bg-workspace-bg border border-workspace-border text-workspace-text rounded-xl px-3.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-workspace-primary/40 cursor-pointer self-start sm:self-auto shadow-xs transition-shadow"
        >
          <option value={90}>90 Days</option>
          <option value={180}>6 Months</option>
          <option value={365}>1 Year</option>
        </select>
      </div>

      {/* Grid - Centered Container */}
      <div className="overflow-x-auto pb-2 flex justify-start xl:justify-center w-full">
        <div className="inline-flex gap-0">
          {/* Day-of-week labels */}
          <div className="flex flex-col mr-2 pt-[18px]" style={{ gap: `${GAP}px` }}>
            {dayLabels.map((label, i) => (
              <div
                key={i}
                className="text-[10px] text-workspace-text-secondary leading-none flex items-center justify-end pr-1 font-medium select-none"
                style={{ height: `${CELL_SIZE}px`, width: '28px' }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Weeks */}
          <div className="flex flex-col">
            {/* Month labels row */}
            <div className="relative h-[16px] mb-1">
              {monthLabels.map((label, idx) => (
                <span
                  key={`${label.text}-${idx}`}
                  className="absolute text-[10px] font-medium text-workspace-text-secondary leading-none select-none"
                  style={{ left: `${label.colIndex * COL_WIDTH}px` }}
                >
                  {label.text}
                </span>
              ))}
            </div>

            {/* The grid */}
            <div className="flex" style={{ gap: `${GAP}px` }}>
              {columns.map((week, colIdx) => (
                <div key={colIdx} className="flex flex-col" style={{ gap: `${GAP}px` }}>
                  {week.map((cell, rowIdx) => {
                    if (cell.empty) {
                      return (
                        <div
                          key={`empty-${colIdx}-${rowIdx}`}
                          style={{ width: CELL_SIZE, height: CELL_SIZE }}
                        />
                      )
                    }

                    return (
                      <div
                        key={cell.date}
                        className={`rounded-[2px] cursor-pointer transition-transform duration-100 hover:scale-125 hover:z-10 ${getLevelColor(cell.level)}`}
                        style={{ width: CELL_SIZE, height: CELL_SIZE }}
                        onMouseEnter={(e) => handleCellHover(e, cell)}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 text-[10px] font-medium text-workspace-text-secondary mt-3 select-none">
        <span>Less</span>
        <div className="w-[10px] h-[10px] rounded-[2px] bg-zinc-200/90 dark:bg-[#161b22] border border-black/5 dark:border-white/[0.03]" />
        <div className="w-[10px] h-[10px] rounded-[2px] bg-emerald-200 dark:bg-[#0e4429]" />
        <div className="w-[10px] h-[10px] rounded-[2px] bg-emerald-400 dark:bg-[#006d32]" />
        <div className="w-[10px] h-[10px] rounded-[2px] bg-emerald-600 dark:bg-[#26a641]" />
        <div className="w-[10px] h-[10px] rounded-[2px] bg-emerald-700 dark:bg-[#39d353]" />
        <span>More</span>
      </div>
    </div>
  )
}
