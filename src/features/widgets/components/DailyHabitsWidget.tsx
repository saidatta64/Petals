import { useMemo } from 'react'
import { Card } from '@heroui/react'
import { useTaskStore } from '@shared/stores/taskStore'
import { CheckCircle2, Circle, Trash2 } from 'lucide-react'

export const DailyHabitsWidget = () => {
  const tasks = useTaskStore((state) => state.tasks)
  const removeTask = useTaskStore((state) => state.removeTask)

  const dailyTasks = useMemo(() => {
    const daily = tasks.filter((t) => t.recurringType === 'DAILY')
    return daily.sort((a, b) => {
      if (a.status === 'COMPLETED' && b.status !== 'COMPLETED') return 1
      if (a.status !== 'COMPLETED' && b.status === 'COMPLETED') return -1
      return 0
    })
  }, [tasks])

  const toggleHabit = async (id: number) => {
    await useTaskStore.getState().toggleComplete(id)
  }

  if (dailyTasks.length === 0) {
    return null
  }

  return (
    <Card className="w-full bg-workspace-card/90 backdrop-blur-xl border border-workspace-border/60 rounded-2xl p-5 shadow-sm transition-all duration-200">
      <h2 className="font-brand text-base font-bold text-workspace-text mb-3 tracking-tight">
        Daily Habits
      </h2>

      <div className="space-y-1">
        {dailyTasks.map((task) => {
          const isCompleted = task.status === 'COMPLETED'
          return (
            <div
              key={task.id}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-workspace-border/30 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => toggleHabit(task.id)}
                  className="focus:outline-none flex-shrink-0 transition-transform active:scale-90"
                >
                  {isCompleted ? (
                    <CheckCircle2 size={19} className="text-workspace-green" />
                  ) : (
                    <Circle
                      size={19}
                      className="text-workspace-text-secondary/70 hover:text-workspace-primary transition-colors"
                    />
                  )}
                </button>
                <div className="flex flex-col min-w-0">
                  <span
                    className={`text-sm font-medium truncate ${isCompleted ? 'text-workspace-text-secondary line-through' : 'text-workspace-text'}`}
                  >
                    {task.title}
                  </span>
                  <span className="text-[10px] font-medium text-workspace-text-secondary/70">
                    Resets at{' '}
                    {String(Math.floor((task.recurringInterval || 0) / 60)).padStart(2, '0')}:
                    {String((task.recurringInterval || 0) % 60).padStart(2, '0')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => removeTask(task.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-workspace-text-secondary hover:text-workspace-red hover:bg-workspace-red/10 focus:outline-none flex-shrink-0 ml-2"
                title="Delete habit"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )
        })}
        {dailyTasks.length === 0 && (
          <p className="text-sm text-workspace-text-secondary italic p-2">No daily habits yet.</p>
        )}
      </div>
    </Card>
  )
}
