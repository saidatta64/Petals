export interface HeatmapData {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export interface HeatmapStats {
  activeDays: number
  maxStreak: number
  currentStreak: number
}

export interface HeatmapCell {
  date: string
  count: number
  level: number
  empty: boolean
}

export interface MonthLabel {
  text: string
  colIndex: number
}

export function calculateHeatmapStats(data: HeatmapData[]): HeatmapStats {
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
}

export function buildHeatmapColumns(data: HeatmapData[]): {
  columns: HeatmapCell[][]
  monthLabels: MonthLabel[]
} {
  if (data.length === 0) return { columns: [], monthLabels: [] }

  const firstDate = new Date(data[0].date)
  const startDow = firstDate.getDay()

  const flat: HeatmapCell[] = []

  for (let i = 0; i < startDow; i++) {
    flat.push({ date: '', count: 0, level: 0, empty: true })
  }
  for (const d of data) {
    flat.push({ ...d, empty: false })
  }

  const cols: HeatmapCell[][] = []
  for (let i = 0; i < flat.length; i += 7) {
    const week = flat.slice(i, i + 7)
    while (week.length < 7) {
      week.push({ date: '', count: 0, level: 0, empty: true })
    }
    cols.push(week)
  }

  const labels: MonthLabel[] = []
  let lastMonth = -1
  let lastColIndex = -10

  for (let c = 0; c < cols.length; c++) {
    const firstReal = cols[c].find((cell) => !cell.empty)
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
}

export function getLevelColor(level: number): string {
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
