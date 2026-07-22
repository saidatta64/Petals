import { Trash2, Clock, AlertCircle } from 'lucide-react'
import { Task } from '@shared/stores/taskStore'
import { useCategoryStore } from '@shared/stores/categoryStore'

interface TaskCardProps {
  task: Task
  onComplete?: (id: number) => void
  onDelete?: (id: number) => void
  showCheckbox?: boolean
}

export default function TaskCard({
  task,
  onComplete,
  onDelete,
  showCheckbox = true,
}: TaskCardProps) {
  const categories = useCategoryStore((state) => state.categories)
  const category = categories.find((c) => c.id === task.categoryId)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'text-workspace-red font-bold'
      case 'MEDIUM':
        return 'text-workspace-amber font-semibold'
      case 'LOW':
        return 'text-workspace-primary font-medium'
      default:
        return 'text-workspace-text-secondary'
    }
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div
      className={`bg-workspace-card/90 backdrop-blur-xl border border-workspace-border/60 rounded-xl p-4 flex items-center gap-4 hover:shadow-sm hover:border-workspace-border transition-all ${
        task.status === 'COMPLETED' ? 'opacity-50' : ''
      }`}
    >
      {/* Checkbox */}
      {showCheckbox && (
        <input
          type="checkbox"
          checked={task.status === 'COMPLETED'}
          onChange={(e) => {
            e.stopPropagation()
            onComplete?.(task.id)
          }}
          className="w-5 h-5 rounded cursor-pointer accent-workspace-primary"
        />
      )}

      {/* Content */}
      <div className="flex-1">
        <h3
          className={`font-medium ${
            task.status === 'COMPLETED'
              ? 'line-through text-workspace-text-secondary'
              : 'text-workspace-text'
          }`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="text-xs text-workspace-text-secondary mt-1 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Badges and Info */}
      <div className="flex items-center gap-3">
        {/* Category Badge */}
        {category && (
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-white shadow-xs"
            style={{ backgroundColor: category.color }}
          >
            {category.name}
          </span>
        )}

        {/* Priority Icon */}
        {task.priority !== 'LOW' && (
          <AlertCircle size={16} className={getPriorityColor(task.priority)} />
        )}

        {/* Due Date */}
        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-workspace-text-secondary">
            <Clock size={14} />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}

        {/* Delete Button (Only rendered if onDelete handler is explicitly provided) */}
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(task.id)
            }}
            className="p-1.5 hover:bg-workspace-red/10 rounded-lg transition-colors text-workspace-text-secondary hover:text-workspace-red focus:outline-none"
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
