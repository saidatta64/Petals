import { TaskRepository } from '../repositories/TaskRepository'

export interface HeatmapData {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export class HeatmapService {
  static generateHeatmapData(days: number = 365): HeatmapData[] {
    const completedTasks = TaskRepository.getByStatus('COMPLETED')
    const heatmapMap = new Map<string, number>()

    // Initialize all dates with 0
    const today = new Date()
    for (let i = 0; i < days; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      heatmapMap.set(dateStr, 0)
    }

    // Count completed tasks per day
    for (const task of completedTasks) {
      if (task.completedAt) {
        const date = new Date(task.completedAt)
        const dateStr = date.toISOString().split('T')[0]
        if (heatmapMap.has(dateStr)) {
          heatmapMap.set(dateStr, (heatmapMap.get(dateStr) || 0) + 1)
        }
      }
    }

    // Convert to array and sort
    const result: HeatmapData[] = Array.from(heatmapMap.entries())
      .map(([date, count]) => ({
        date,
        count,
        level: this.getLevel(count),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return result
  }

  static getLevel(count: number): 0 | 1 | 2 | 3 | 4 {
    if (count === 0) return 0
    if (count <= 2) return 1
    if (count <= 5) return 2
    if (count <= 10) return 3
    return 4
  }

  static getHeatmapStats(days: number = 365) {
    const data = this.generateHeatmapData(days)
    const totalDays = data.length
    const activeDays = data.filter((d) => d.count > 0).length
    const totalTasks = data.reduce((sum, d) => sum + d.count, 0)
    const maxDay = Math.max(...data.map((d) => d.count), 0)

    return {
      totalDays,
      activeDays,
      totalTasks,
      maxDay,
      averagePerDay: totalDays > 0 ? totalTasks / totalDays : 0,
      activityRate: totalDays > 0 ? (activeDays / totalDays) * 100 : 0,
    }
  }

  static getLast30Days(): HeatmapData[] {
    return this.generateHeatmapData(30)
  }

  static getLast90Days(): HeatmapData[] {
    return this.generateHeatmapData(90)
  }

  static getLastYear(): HeatmapData[] {
    return this.generateHeatmapData(365)
  }
}
