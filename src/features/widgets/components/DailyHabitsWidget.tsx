import { useMemo } from 'react'
import { Card } from '@heroui/react'
import { useTaskStore } from '@shared/stores/taskStore'
import { CheckCircle2, Circle, Trash2 } from 'lucide-react'

export const DailyHabitsWidget = () => {
  const tasks = useTaskStore((state) => state.tasks)
  const removeTask = useTaskStore((state) => state.removeTask)

  const dailyTasks = useMemo(() => {
    const daily = tasks.filter(t => t.recurringType === 'DAILY')
    return daily.sort((a, b) => {
      if (a.status === 'COMPLETED' && b.status !== 'COMPLETED') return 1;
      if (a.status !== 'COMPLETED' && b.status === 'COMPLETED') return -1;
      return 0;
    })
  }, [tasks])

  const toggleHabit = async (id: number) => {
    await useTaskStore.getState().toggleComplete(id)
  }

  if (dailyTasks.length === 0) {
    return null
  }

  return (
    <Card className="w-full bg-workspace-card/60 backdrop-blur-md border border-workspace-border rounded-[24px] p-6 shadow-glass-card">
      <h2 className="text-lg font-semibold mb-4 text-workspace-text-secondary">Daily Habits</h2>
      
      <div className="space-y-3 mb-4">
        {dailyTasks.map(task => {
          const isCompleted = task.status === 'COMPLETED'
          return (
            <div key={task.id} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toggleHabit(task.id)}
                  className="focus:outline-none"
                >
                  {isCompleted ? (
                    <CheckCircle2 size={20} className="text-workspace-green" />
                  ) : (
                    <Circle size={20} className="text-workspace-text-secondary hover:text-workspace-primary transition-colors" />
                  )}
                </button>
                <div className="flex flex-col">
                  <span className={`text-sm ${isCompleted ? 'text-workspace-text-secondary line-through' : 'text-workspace-text'}`}>
                    {task.title}
                  </span>
                  <span className="text-[10px] text-workspace-text-secondary">
                    Resets at {String(Math.floor((task.recurringInterval || 0) / 60)).padStart(2, '0')}:{String((task.recurringInterval || 0) % 60).padStart(2, '0')}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => removeTask(task.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-workspace-text-secondary hover:text-workspace-red focus:outline-none"
                title="Delete habit"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )
        })}
        {dailyTasks.length === 0 && (
          <p className="text-sm text-workspace-text-secondary italic">No daily habits yet.</p>
        )}
      </div>
    </Card>
  )
}
