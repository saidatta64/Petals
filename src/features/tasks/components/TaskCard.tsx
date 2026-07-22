import { Trash2, Clock, AlertCircle } from 'lucide-react'
import { Task } from '@shared/stores/taskStore'
import { useCategoryStore } from '@shared/stores/categoryStore'

interface TaskCardProps {
  task: Task
  onComplete?: (id: number) => void
  onDelete?: (id: number) => void
  showCheckbox?: boolean
}

export default function TaskCard({ task, onComplete, onDelete, showCheckbox = true }: TaskCardProps) {
  const categories = useCategoryStore((state) => state.getCategories())
  const category = categories.find((c) => c.id === task.categoryId)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'text-light-danger dark:text-dark-danger'
      case 'MEDIUM':
        return 'text-light-warning dark:text-dark-warning'
      case 'LOW':
        return 'text-light-primary dark:text-dark-primary'
      default:
        return 'text-light-text-secondary dark:text-dark-text-secondary'
    }
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div
      className={`bg-light-surface dark:bg-dark-surface rounded-card p-4 border border-light-border dark:border-dark-border flex items-center gap-4 hover:shadow-md transition-shadow ${
        task.status === 'COMPLETED' ? 'opacity-50' : ''
      }`}
    >
      {/* Checkbox / Checkpoint */}
      {showCheckbox && (
        <input
          type="checkbox"
          checked={task.status === 'COMPLETED'}
          onChange={() => onComplete?.(task.id)}
          className="w-5 h-5 rounded cursor-pointer"
        />
      )}

      {/* Content */}
      <div className="flex-1">
        <h3
          className={`font-medium ${
            task.status === 'COMPLETED'
              ? 'line-through text-light-text-secondary dark:text-dark-text-secondary'
              : 'text-light-text dark:text-dark-text'
          }`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
            {task.description}
          </p>
        )}
      </div>

      {/* Badges and Info */}
      <div className="flex items-center gap-2">
        {/* Category Badge */}
        {category && (
          <span
            className="px-2 py-1 rounded-full text-xs font-medium text-white"
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
          <div className="flex items-center gap-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
            <Clock size={14} />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}

        {/* Delete Button */}
        <button
          onClick={() => onDelete?.(task.id)}
          className="p-1 hover:bg-light-bg dark:hover:bg-dark-bg rounded transition-colors text-light-text-secondary dark:text-dark-text-secondary hover:text-light-danger dark:hover:text-dark-danger"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}
