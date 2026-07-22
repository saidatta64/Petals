import React from 'react'
import { HeatmapCell, MonthLabel, getLevelColor } from '../utils/heatmapUtils'

interface HeatmapGridProps {
  columns: HeatmapCell[][]
  monthLabels: MonthLabel[]
  onCellHover: (e: React.MouseEvent, cell: { date: string; count: number }) => void
  onCellLeave: () => void
}

const CELL_SIZE = 11
const GAP = 3
const COL_WIDTH = CELL_SIZE + GAP
const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', '']

export const HeatmapGrid: React.FC<HeatmapGridProps> = ({
  columns,
  monthLabels,
  onCellHover,
  onCellLeave,
}) => {
  return (
    <>
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
                        className={`rounded-[2px] cursor-pointer transition-transform duration-100 hover:scale-125 hover:z-10 ${getLevelColor(
                          cell.level,
                        )}`}
                        style={{ width: CELL_SIZE, height: CELL_SIZE }}
                        onMouseEnter={(e) => onCellHover(e, cell)}
                        onMouseLeave={onCellLeave}
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
    </>
  )
}
