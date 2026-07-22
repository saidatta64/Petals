import React from 'react'

interface TooltipState {
  text: string
  x: number
  y: number
}

interface HeatmapTooltipProps {
  tooltip: TooltipState | null
}

export const HeatmapTooltip: React.FC<HeatmapTooltipProps> = ({ tooltip }) => {
  if (!tooltip) return null

  return (
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
  )
}
