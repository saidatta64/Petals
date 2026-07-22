import { useEffect, useState, useMemo, useCallback } from 'react'
import { useTaskStore } from '@shared/stores/taskStore'
import { HeatmapData, calculateHeatmapStats, buildHeatmapColumns } from '../utils/heatmapUtils'
import { HeatmapHeader } from './HeatmapHeader'
import { HeatmapTooltip } from './HeatmapTooltip'
import { HeatmapGrid } from './HeatmapGrid'

interface HeatmapProps {
  days?: number
}

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

  const stats = useMemo(() => calculateHeatmapStats(data), [data])
  const { columns, monthLabels } = useMemo(() => buildHeatmapColumns(data), [data])

  const handleCellHover = useCallback(
    (e: React.MouseEvent, cell: { date: string; count: number }) => {
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
    },
    [],
  )

  return (
    <div className="relative" data-heatmap-root>
      <HeatmapTooltip tooltip={tooltip} />

      <HeatmapHeader stats={stats} range={range} onRangeChange={setRange} />

      <HeatmapGrid
        columns={columns}
        monthLabels={monthLabels}
        onCellHover={handleCellHover}
        onCellLeave={() => setTooltip(null)}
      />
    </div>
  )
}
