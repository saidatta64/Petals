import { useState, useMemo } from 'react'
import { useTaskStore } from '@shared/stores/taskStore'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import TaskDialog from '@features/tasks/components/TaskDialog'
import { Button } from '@heroui/react'
import { FocusTaskCard } from '@features/tasks/components/FocusTaskCard'

export default function CalendarView() {
  const tasks = useTaskStore((state) => state.tasks)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState<any>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [year, month])
  const firstDayIndex = useMemo(() => new Date(year, month, 1).getDay(), [year, month])

  const calendarDays = useMemo(() => {
    const days: (Date | null)[] = []
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }, [year, month, daysInMonth, firstDayIndex])

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))

  const getDayStats = (date: Date) => {
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    const end = new Date(date)
    end.setHours(23, 59, 59, 999)

    const dayTasks = tasks.filter((t) => {
      const matchDue = t.dueDate && t.dueDate >= start.getTime() && t.dueDate <= end.getTime()
      const matchCreated = t.createdAt >= start.getTime() && t.createdAt <= end.getTime()
      const matchCompleted = t.completedAt && t.completedAt >= start.getTime() && t.completedAt <= end.getTime()
      return matchDue || matchCreated || matchCompleted
    })

    const completed = dayTasks.filter((t) => t.status === 'COMPLETED').length
    const pending = dayTasks.filter((t) => t.status === 'PENDING').length
    return { completed, pending, total: dayTasks.length, tasks: dayTasks }
  }

  const selectedDateStats = useMemo(() => {
    if (!selectedDate) return null
    return getDayStats(selectedDate)
  }, [selectedDate, tasks])

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  // Generate year options (5 years back, 2 years forward)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 8 }, (_, i) => currentYear - 5 + i)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-workspace-text">Upcoming</h1>
        <p className="text-workspace-text-secondary mt-1">
          Browse tasks by date. Click a day to see its tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-workspace-card/60 backdrop-blur-md rounded-[24px] p-6 border border-workspace-border">
          {/* Navigation Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-workspace-border/50 text-workspace-text rounded-xl border border-workspace-border transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-workspace-border/50 text-workspace-text rounded-xl border border-workspace-border transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Month & Year dropdowns */}
            <div className="flex items-center gap-2">
              <select
                value={month}
                onChange={(e) => setCurrentDate(new Date(year, Number(e.target.value), 1))}
                className="bg-workspace-bg border border-workspace-border text-workspace-text rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-workspace-primary/50 cursor-pointer"
              >
                {monthNames.map((name, i) => (
                  <option key={i} value={i}>{name}</option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => setCurrentDate(new Date(Number(e.target.value), month, 1))}
                className="bg-workspace-bg border border-workspace-border text-workspace-text rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-workspace-primary/50 cursor-pointer"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-workspace-text-secondary">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              if (!day) return <div key={`empty-${index}`} className="h-16" />

              const stats = getDayStats(day)
              const isSelected = selectedDate && selectedDate.toDateString() === day.toDateString()
              const todayHighlight = isToday(day)

              // Color intensity based on task count
              let bgColor = 'bg-workspace-bg/50'
              if (stats.total > 0) {
                if (stats.completed === stats.total) {
                  bgColor = 'bg-[#0e4429]/40' // all done — green
                } else {
                  bgColor = 'bg-workspace-primary/10' // has pending
                }
              }

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`h-16 rounded-xl flex flex-col justify-between p-2 border transition-all duration-150 relative ${
                    isSelected
                      ? 'border-workspace-primary ring-2 ring-workspace-primary/20 shadow-md'
                      : 'border-workspace-border hover:border-workspace-text-secondary/30'
                  } ${bgColor}`}
                >
                  <span className={`text-xs font-semibold ${
                    todayHighlight
                      ? 'bg-workspace-primary text-white w-5 h-5 rounded-full flex items-center justify-center'
                      : 'text-workspace-text'
                  }`}>
                    {day.getDate()}
                  </span>
                  {stats.total > 0 && (
                    <div className="flex gap-1 items-center justify-end w-full">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        stats.completed === stats.total ? 'bg-[#39d353]' : 'bg-workspace-primary'
                      }`} />
                      <span className="text-[9px] text-workspace-text-secondary">
                        {stats.completed}/{stats.total}
                      </span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected Day Panel */}
        <div className="bg-workspace-card/60 backdrop-blur-md rounded-[24px] p-6 border border-workspace-border flex flex-col h-fit lg:sticky lg:top-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-workspace-text">
              {selectedDate?.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </h2>
            <Button
              onPress={() => {
                setTaskToEdit(null)
                setIsTaskDialogOpen(true)
              }}
              isIconOnly
              size="sm"
              className="bg-workspace-primary/20 text-workspace-primary hover:bg-workspace-primary hover:text-white transition-colors rounded-xl"
            >
              <Plus size={16} />
            </Button>
          </div>

          {selectedDateStats && selectedDateStats.total > 0 ? (
            <div className="space-y-3">
              {/* Stats bar */}
              <div className="flex items-center justify-between text-xs text-workspace-text-secondary">
                <span>{selectedDateStats.completed}/{selectedDateStats.total} completed</span>
                <span>{Math.round((selectedDateStats.completed / selectedDateStats.total) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-workspace-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#39d353] rounded-full transition-all duration-300"
                  style={{ width: `${(selectedDateStats.completed / selectedDateStats.total) * 100}%` }}
                />
              </div>

              {/* Task list */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 mt-3">
                {selectedDateStats.tasks.map((task) => (
                  <FocusTaskCard
                    key={task.id}
                    task={task}
                    onComplete={(id) => useTaskStore.getState().toggleComplete(id)}
                    onEdit={() => {
                      setTaskToEdit(task)
                      setIsTaskDialogOpen(true)
                    }}
                    onDelete={(id) => useTaskStore.getState().removeTask(id)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-workspace-text-secondary text-sm text-center py-12">
              No tasks on this day.
            </p>
          )}
        </div>
      </div>

      {selectedDate && (
        <TaskDialog
          isOpen={isTaskDialogOpen}
          onClose={() => {
            setIsTaskDialogOpen(false)
            setTaskToEdit(null)
          }}
          initialDueDate={selectedDate}
          initialTask={taskToEdit}
        />
      )}
    </div>
  )
}
