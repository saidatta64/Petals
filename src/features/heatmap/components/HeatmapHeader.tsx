import React from 'react'
import { HeatmapStats } from '../utils/heatmapUtils'

interface HeatmapHeaderProps {
  stats: HeatmapStats
  range: number
  onRangeChange: (range: number) => void
}

export const HeatmapHeader: React.FC<HeatmapHeaderProps> = ({ stats, range, onRangeChange }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-brand text-base font-bold text-workspace-text">Consistency Graph</h2>
        <div className="flex items-center gap-2">
          <span className="bg-workspace-bg/80 border border-workspace-border/60 text-workspace-text-secondary text-xs px-3 py-1 rounded-full font-medium shadow-xs">
            Active days:{' '}
            <strong className="text-workspace-text font-bold ml-1">{stats.activeDays}</strong>
          </span>
          <span className="bg-workspace-bg/80 border border-workspace-border/60 text-workspace-text-secondary text-xs px-3 py-1 rounded-full font-medium shadow-xs">
            Max streak:{' '}
            <strong className="text-workspace-text font-bold ml-1">{stats.maxStreak} 🔥</strong>
          </span>
        </div>
      </div>

      <select
        value={range}
        onChange={(e) => onRangeChange(Number(e.target.value))}
        className="bg-workspace-bg border border-workspace-border text-workspace-text rounded-xl px-3.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-workspace-primary/40 cursor-pointer self-start sm:self-auto shadow-xs transition-shadow"
      >
        <option value={90}>90 Days</option>
        <option value={180}>6 Months</option>
        <option value={365}>1 Year</option>
      </select>
    </div>
  )
}
