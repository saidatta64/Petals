import { Task } from '@shared/stores/taskStore'
import TaskCard from '@features/tasks/components/TaskCard'

interface TaskListProps {
  tasks: Task[]
  onComplete?: (id: number) => void
  onDelete?: (id: number) => void
  emptyMessage?: string
  showCheckbox?: boolean
}

export default function TaskList({
  tasks,
  onComplete,
  onDelete,
  emptyMessage = 'No tasks found',
  showCheckbox = true,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-light-text-secondary dark:text-dark-text-secondary">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onComplete={onComplete}
          onDelete={onDelete}
          showCheckbox={showCheckbox}
        />
      ))}
    </div>
  )
}
