import { create } from 'zustand'

export interface Task {
  id: number
  title: string
  description?: string | null
  categoryId: number
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'PENDING' | 'COMPLETED'
  dueDate?: number | null
  recurringType?: string | null
  recurringInterval?: number | null
  createdAt: number
  updatedAt: number
  completedAt?: number | null
}

interface TaskStore {
  tasks: Task[]
  isLoading: boolean
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: number, task: Partial<Task>) => void
  deleteTask: (id: number) => void
  completeTask: (id: number) => void
  getTasks: () => Task[]
  getTasksByStatus: (status: 'PENDING' | 'COMPLETED') => Task[]
  getTodayTasks: () => Task[]
  getUpcomingTasks: () => Task[]
  loadTasks: () => Promise<void>
  createTask: (input: {
    title: string
    description?: string
    categoryId: number
    priority: 'HIGH' | 'MEDIUM' | 'LOW'
    dueDate?: number
    recurringType?: string
    recurringInterval?: number
  }) => Promise<void>
  editTask: (id: number, updates: Partial<Task>) => Promise<void>
  removeTask: (id: number) => Promise<void>
  toggleComplete: (id: number) => Promise<void>
}

const startOfDay = (date: Date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

const endOfDay = (date: Date) => {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d.getTime()
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,

  setTasks: (tasks: Task[]) => set({ tasks }),

  addTask: (task: Task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

  updateTask: (id: number, updates: Partial<Task>) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: Date.now() } : task,
      ),
    })),

  deleteTask: (id: number) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),

  completeTask: (id: number) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: 'COMPLETED',
              completedAt: Date.now(),
              updatedAt: Date.now(),
            }
          : task,
      ),
    })),

  getTasks: () => get().tasks,

  getTasksByStatus: (status: 'PENDING' | 'COMPLETED') =>
    get().tasks.filter((task) => task.status === status),

  getTodayTasks: () => {
    const now = new Date()
    const start = startOfDay(now)
    const end = endOfDay(now)

    const todayTasks = get().tasks.filter((task) => {
      // 1. If completed, it must have been completed TODAY
      //    AND it must NOT have been originally due on a past day
      if (task.status === 'COMPLETED') {
        const completedToday = Boolean(
          task.completedAt && task.completedAt >= start && task.completedAt <= end,
        )
        if (!completedToday) return false

        // Exclude tasks that were due on a previous day (e.g. Jul 18, 19, 20)
        if (task.dueDate && task.dueDate < start) return false

        return true
      }

      // 2. If task has a due date, it MUST be due TODAY (not overdue from past)
      if (task.dueDate) {
        return task.dueDate >= start && task.dueDate <= end
      }

      // 3. If task has NO due date, it must have been created TODAY
      return task.createdAt >= start && task.createdAt <= end
    })

    return todayTasks.sort((a, b) => {
      if (a.status === 'COMPLETED' && b.status !== 'COMPLETED') return 1
      if (a.status !== 'COMPLETED' && b.status === 'COMPLETED') return -1
      return (b.createdAt || 0) - (a.createdAt || 0)
    })
  },

  getUpcomingTasks: () => {
    const tomorrowStart = (() => {
      const d = new Date()
      d.setDate(d.getDate() + 1)
      d.setHours(0, 0, 0, 0)
      return d.getTime()
    })()

    return get()
      .tasks.filter(
        (task) => task.status === 'PENDING' && task.dueDate && task.dueDate >= tomorrowStart,
      )
      .sort((a, b) => (a.dueDate || 0) - (b.dueDate || 0))
  },

  loadTasks: async () => {
    if (!window.taskflow) return
    set({ isLoading: true })
    try {
      const tasks = (await window.taskflow.tasks.getAll()) as Task[]

      // Auto-reset daily tasks based on exact time of day
      const now = Date.now()

      const tasksToReset = tasks.filter((t) => {
        if (t.recurringType === 'DAILY' && t.status === 'COMPLETED' && t.completedAt) {
          const resetTimeMinutes = t.recurringInterval || 0
          const completedDate = new Date(t.completedAt)
          const resetDate = new Date(completedDate)
          resetDate.setHours(Math.floor(resetTimeMinutes / 60), resetTimeMinutes % 60, 0, 0)

          if (resetDate.getTime() <= completedDate.getTime()) {
            resetDate.setDate(resetDate.getDate() + 1)
          }

          return now >= resetDate.getTime()
        }
        return false
      })

      for (const t of tasksToReset) {
        await window.taskflow.tasks.update(t.id, {
          status: 'PENDING',
          completedAt: undefined,
        })
      }

      const finalTasks =
        tasksToReset.length > 0 ? ((await window.taskflow.tasks.getAll()) as Task[]) : tasks

      set({ tasks: finalTasks })
    } finally {
      set({ isLoading: false })
    }
  },

  createTask: async (input) => {
    if (!window.taskflow) {
      const mockTask: Task = {
        id: Date.now(),
        ...input,
        status: 'PENDING',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      get().addTask(mockTask)
      return
    }
    try {
      const task = (await window.taskflow.tasks.create(input)) as Task
      if (task) {
        get().addTask(task)
      }
    } catch (err) {
      console.error('Failed to create task in DB:', err)
    }
  },

  editTask: async (id, updates) => {
    get().updateTask(id, updates)
    if (window.taskflow) {
      try {
        const updated = (await window.taskflow.tasks.update(id, updates)) as Task
        if (updated) {
          get().updateTask(id, updated)
        }
      } catch (err) {
        console.error('Failed to edit task in DB:', err)
      }
    }
  },

  removeTask: async (id) => {
    get().deleteTask(id)
    if (window.taskflow) {
      try {
        await window.taskflow.tasks.delete(id)
      } catch (err) {
        console.error('Failed to delete task from DB:', err)
      }
    }
  },

  toggleComplete: async (id) => {
    const task = get().tasks.find((t) => t.id === id)
    if (!task) return

    if (task.status === 'COMPLETED') {
      get().updateTask(id, { status: 'PENDING', completedAt: null })
      if (window.taskflow) {
        try {
          await window.taskflow.tasks.update(id, {
            status: 'PENDING',
            completedAt: undefined,
          })
        } catch (err) {
          console.error('Failed to update task status in DB:', err)
        }
      }
    } else {
      const now = Date.now()
      get().updateTask(id, { status: 'COMPLETED', completedAt: now })
      if (window.taskflow) {
        try {
          const updated = (await window.taskflow.tasks.complete(id)) as Task
          if (updated) {
            window.taskflow.notifications.show('Task Completed! 🎉', {
              body: `"${updated.title || task.title}" has been marked as done.`,
            })
          }
        } catch (err) {
          console.error('Failed to complete task in DB:', err)
        }
      }
    }
  },
}))
