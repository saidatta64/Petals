import { TaskRepository, CreateTaskInput, UpdateTaskInput } from '../repositories/TaskRepository'
import { z } from 'zod'

// Validation schemas
const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  categoryId: z.number().positive(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).default('MEDIUM'),
  dueDate: z.number().optional(),
  recurringType: z.enum(['NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM']).optional(),
  recurringInterval: z.number().positive().optional(),
})

export class TaskService {
  static create(input: unknown) {
    const validated = createTaskSchema.parse(input)
    return TaskRepository.create(validated as CreateTaskInput)
  }

  static getAll() {
    return TaskRepository.getAll()
  }

  static getById(id: number) {
    return TaskRepository.getById(id)
  }

  static update(id: number, input: UpdateTaskInput) {
    return TaskRepository.update(id, input)
  }

  static complete(id: number) {
    return TaskRepository.complete(id)
  }

  static delete(id: number) {
    return TaskRepository.delete(id)
  }

  static getByStatus(status: 'PENDING' | 'COMPLETED') {
    return TaskRepository.getByStatus(status)
  }

  static getByCategoryId(categoryId: number) {
    return TaskRepository.getByCategoryId(categoryId)
  }

  static getTodayTasks() {
    return TaskRepository.getToday()
  }

  static search(query: string) {
    if (!query || query.length < 1) {
      return []
    }
    return TaskRepository.search(query)
  }

  static getStatistics() {
    const allTasks = this.getAll()
    const completedTasks = this.getByStatus('COMPLETED')
    const pendingTasks = this.getByStatus('PENDING')

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayTimestamp = today.getTime()

    const todayCompleted = completedTasks.filter(
      (task) => task.completedAt && task.completedAt >= todayTimestamp,
    )

    return {
      totalTasks: allTasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      completionRate: allTasks.length > 0 ? (completedTasks.length / allTasks.length) * 100 : 0,
      todayCompleted: todayCompleted.length,
    }
  }

  static getCurrentStreak(): number {
    const completedTasks = TaskRepository.getByStatus('COMPLETED')
    if (completedTasks.length === 0) return 0

    // Sort by completion date descending
    const sortedByDate = completedTasks
      .filter((task) => task.completedAt)
      .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0))

    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    for (const task of sortedByDate) {
      const taskDate = new Date(task.completedAt || 0)
      taskDate.setHours(0, 0, 0, 0)

      const daysDifference = Math.floor(
        (currentDate.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24),
      )

      if (daysDifference === 0 || daysDifference === 1) {
        streak++
        currentDate = taskDate
      } else {
        break
      }
    }

    return streak
  }

  static getLongestStreak(): number {
    const completedTasks = TaskRepository.getByStatus('COMPLETED')
    if (completedTasks.length === 0) return 0

    const sortedByDate = completedTasks
      .filter((task) => task.completedAt)
      .sort((a, b) => (a.completedAt || 0) - (b.completedAt || 0))

    let longestStreak = 0
    let currentStreak = 1
    let lastDate = new Date(sortedByDate[0].completedAt || 0)
    lastDate.setHours(0, 0, 0, 0)

    for (let i = 1; i < sortedByDate.length; i++) {
      const currentDate = new Date(sortedByDate[i].completedAt || 0)
      currentDate.setHours(0, 0, 0, 0)

      const daysDifference = Math.floor(
        (currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
      )

      if (daysDifference === 1) {
        currentStreak++
      } else if (daysDifference > 1) {
        longestStreak = Math.max(longestStreak, currentStreak)
        currentStreak = 1
      }

      lastDate = currentDate
    }

    return Math.max(longestStreak, currentStreak)
  }
}
