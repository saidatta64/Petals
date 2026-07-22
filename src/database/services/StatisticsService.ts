import { TaskRepository } from '../repositories/TaskRepository'
import { CategoryRepository } from '../repositories/CategoryRepository'
import { getLocalDateString } from './HeatmapService'

export interface DailyStats {
  date: string
  completed: number
  pending: number
}

export interface CategoryStats {
  categoryId: number
  categoryName: string
  completed: number
  pending: number
  total: number
}

export interface PriorityStats {
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  completed: number
  pending: number
  total: number
}

export class StatisticsService {
  static getOverallStats() {
    const allTasks = TaskRepository.getAll()
    const completed = allTasks.filter((t) => t.status === 'COMPLETED')
    const pending = allTasks.filter((t) => t.status === 'PENDING')

    return {
      totalTasks: allTasks.length,
      completedTasks: completed.length,
      pendingTasks: pending.length,
      completionRate: allTasks.length > 0 ? (completed.length / allTasks.length) * 100 : 0,
    }
  }

  static getDailyStats(days: number = 30): DailyStats[] {
    const allTasks = TaskRepository.getAll()
    const statsMap = new Map<string, { completed: number; pending: number }>()

    // Initialize all dates using local YYYY-MM-DD
    const today = new Date()
    for (let i = 0; i < days; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = getLocalDateString(date)
      statsMap.set(dateStr, { completed: 0, pending: 0 })
    }

    // Count tasks using local YYYY-MM-DD
    for (const task of allTasks) {
      const createdDate = getLocalDateString(task.createdAt)
      if (statsMap.has(createdDate)) {
        const stats = statsMap.get(createdDate)!
        if (task.status === 'COMPLETED') {
          stats.completed++
        } else {
          stats.pending++
        }
      }
    }

    return Array.from(statsMap.entries())
      .map(([date, stats]) => ({
        date,
        ...stats,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  static getCategoryStats(): CategoryStats[] {
    const categories = CategoryRepository.getAll()
    const allTasks = TaskRepository.getAll()

    return categories.map((category) => {
      const categoryTasks = allTasks.filter((t) => t.categoryId === category.id)
      const completed = categoryTasks.filter((t) => t.status === 'COMPLETED').length
      const pending = categoryTasks.filter((t) => t.status === 'PENDING').length

      return {
        categoryId: category.id,
        categoryName: category.name,
        completed,
        pending,
        total: categoryTasks.length,
      }
    })
  }

  static getPriorityStats(): PriorityStats[] {
    const allTasks = TaskRepository.getAll()
    const priorities: ('HIGH' | 'MEDIUM' | 'LOW')[] = ['HIGH', 'MEDIUM', 'LOW']

    return priorities.map((priority) => {
      const priorityTasks = allTasks.filter((t) => t.priority === priority)
      const completed = priorityTasks.filter((t) => t.status === 'COMPLETED').length
      const pending = priorityTasks.filter((t) => t.status === 'PENDING').length

      return {
        priority,
        completed,
        pending,
        total: priorityTasks.length,
      }
    })
  }

  static getWeeklyStats() {
    const allTasks = TaskRepository.getAll()
    const now = new Date()
    
    // Start of current week (Sunday 00:00:00.000)
    const startOfWeek = new Date(now)
    startOfWeek.setHours(0, 0, 0, 0)
    startOfWeek.setDate(now.getDate() - now.getDay())

    // End of current week (Next Sunday 00:00:00.000)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 7)

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const stats = new Map<string, number>()
    weekDays.forEach((day) => stats.set(day, 0))

    for (const task of allTasks) {
      if (task.status === 'COMPLETED' && task.completedAt) {
        const compTime = typeof task.completedAt === 'number' ? task.completedAt : new Date(task.completedAt).getTime()
        if (compTime >= startOfWeek.getTime() && compTime < endOfWeek.getTime()) {
          const date = new Date(compTime)
          const dayName = weekDays[date.getDay()]
          stats.set(dayName, (stats.get(dayName) || 0) + 1)
        }
      }
    }

    return Array.from(stats.entries()).map(([day, count]) => ({
      day,
      count,
    }))
  }

  static getMonthlyStats() {
    const allTasks = TaskRepository.getAll()
    const now = new Date()
    const currentYear = now.getFullYear()

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ]
    const stats = new Map<string, number>()
    months.forEach((month) => stats.set(month, 0))

    for (const task of allTasks) {
      if (task.status === 'COMPLETED' && task.completedAt) {
        const compDate = new Date(task.completedAt)
        if (compDate.getFullYear() === currentYear) {
          const monthName = months[compDate.getMonth()]
          stats.set(monthName, (stats.get(monthName) || 0) + 1)
        }
      }
    }

    return Array.from(stats.entries()).map(([month, count]) => ({
      month,
      count,
    }))
  }

  static getProductivityTrend(days: number = 30) {
    const dailyStats = this.getDailyStats(days)
    return dailyStats.map((stat) => ({
      date: stat.date,
      tasks: stat.completed + stat.pending,
      completed: stat.completed,
    }))
  }
}
