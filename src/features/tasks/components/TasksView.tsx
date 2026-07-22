import TaskList from '@features/tasks/components/TaskList'
import { useTaskStore, Task } from '@shared/stores/taskStore'

interface TasksViewProps {
  title: string
  subtitle: string
  tasks: Task[]
  emptyMessage: string
  showCheckbox?: boolean
}

export default function TasksView({
  title,
  subtitle,
  tasks,
  emptyMessage,
  showCheckbox = true,
}: TasksViewProps) {
  const toggleComplete = useTaskStore((state) => state.toggleComplete)
  const isLoading = useTaskStore((state) => state.isLoading)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-workspace-text">{title}</h1>
        <p className="text-workspace-text-secondary mt-1">{subtitle}</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-workspace-text-secondary">Loading tasks...</p>
        </div>
      ) : (
        <TaskList
          tasks={tasks}
          onComplete={toggleComplete}
          emptyMessage={emptyMessage}
          showCheckbox={showCheckbox}
        />
      )}
    </div>
  )
}
