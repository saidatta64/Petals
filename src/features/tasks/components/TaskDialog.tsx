import { useState, useEffect } from 'react'
import Modal from '@shared/components/Modal'
import { useTaskStore, Task } from '@shared/stores/taskStore'
import { useCategoryStore } from '@shared/stores/categoryStore'

interface TaskDialogProps {
  isOpen: boolean
  onClose: () => void
  initialDueDate?: Date
  initialTask?: Task | null
}

export default function TaskDialog({
  isOpen,
  onClose,
  initialDueDate,
  initialTask,
}: TaskDialogProps) {
  const createTask = useTaskStore((state) => state.createTask)
  const editTask = useTaskStore((state) => state.editTask)
  const categories = useCategoryStore((state) => state.categories)
  const loadCategories = useCategoryStore((state) => state.loadCategories)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState<number>(1)
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM')
  const [dueDate, setDueDate] = useState('')
  const [isDaily, setIsDaily] = useState(false)
  const [resetTime, setResetTime] = useState('00:00')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  useEffect(() => {
    if (categories.length > 0 && !initialTask) {
      const exists = categories.some((cat) => cat.id === categoryId)
      if (!exists) {
        setCategoryId(categories[0].id)
      }
    }
  }, [categories, initialTask, categoryId])

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title)
      setDescription(initialTask.description || '')
      setCategoryId(initialTask.categoryId || (categories.length > 0 ? categories[0].id : 1))
      setPriority(initialTask.priority || 'MEDIUM')

      if (initialTask.dueDate) {
        const dateStr = new Date(initialTask.dueDate - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .split('T')[0]
        setDueDate(dateStr)
      } else {
        setDueDate('')
      }

      const daily = initialTask.recurringType === 'DAILY'
      setIsDaily(daily)
      if (daily && initialTask.recurringInterval) {
        const h = Math.floor(initialTask.recurringInterval / 60)
        const m = initialTask.recurringInterval % 60
        setResetTime(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
      } else {
        setResetTime('00:00')
      }
    } else if (initialDueDate) {
      resetForm()
      const dateStr = new Date(
        initialDueDate.getTime() - initialDueDate.getTimezoneOffset() * 60000,
      )
        .toISOString()
        .split('T')[0]
      setDueDate(dateStr)
    } else {
      resetForm()
    }
  }, [initialTask, initialDueDate, isOpen])

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setCategoryId(categories.length > 0 ? categories[0].id : 1)
    setPriority('MEDIUM')
    setDueDate('')
    setIsDaily(false)
    setResetTime('00:00')
    setError('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setIsSubmitting(true)
    setError('')

    let parsedDueDate: number | undefined = undefined
    if (dueDate) {
      const dateObj = new Date(dueDate)
      dateObj.setHours(23, 59, 59, 999)
      parsedDueDate = dateObj.getTime()
    }

    let recurringInterval: number | undefined = undefined
    if (isDaily) {
      const [hours, minutes] = resetTime.split(':').map(Number)
      recurringInterval = hours * 60 + minutes
    }

    try {
      if (initialTask) {
        await editTask(initialTask.id, {
          title: title.trim(),
          description: description.trim() || undefined,
          categoryId: categoryId,
          priority: priority,
          dueDate: parsedDueDate,
          recurringType: isDaily ? 'DAILY' : 'NONE',
          recurringInterval: recurringInterval,
        })
      } else {
        await createTask({
          title: title.trim(),
          description: description.trim() || undefined,
          categoryId: categoryId,
          priority: priority,
          dueDate: parsedDueDate,
          recurringType: isDaily ? 'DAILY' : 'NONE',
          recurringInterval: recurringInterval,
        })
      }
      handleClose()
    } catch {
      setError('Failed to save task')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={initialTask ? 'Edit Task' : 'New Task'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-workspace-text-secondary mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-workspace-bg border border-workspace-border text-workspace-text rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-workspace-primary/50 transition-shadow placeholder:text-workspace-text-secondary/50"
            placeholder="What needs to be done?"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-workspace-text-secondary mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-workspace-bg border border-workspace-border text-workspace-text rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-workspace-primary/50 transition-shadow placeholder:text-workspace-text-secondary/50 h-20 resize-none"
            placeholder="Optional details..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-workspace-text-secondary mb-1">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full bg-workspace-bg border border-workspace-border text-workspace-text rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-workspace-primary/50 transition-shadow"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-workspace-text-secondary mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full bg-workspace-bg border border-workspace-border text-workspace-text rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-workspace-primary/50 transition-shadow"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-workspace-text-secondary mb-1">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full bg-workspace-bg border border-workspace-border text-workspace-text rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-workspace-primary/50 transition-shadow"
          />
        </div>

        <div className="pt-2 border-t border-workspace-border">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={isDaily}
              onChange={(e) => setIsDaily(e.target.checked)}
              className="w-4 h-4 rounded text-workspace-primary bg-workspace-bg border-workspace-border focus:ring-workspace-primary focus:ring-offset-0 transition-all cursor-pointer"
            />
            <span className="text-sm font-medium text-workspace-text group-hover:text-workspace-primary transition-colors">
              Make this a Daily Habit
            </span>
          </label>

          {isDaily && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-workspace-text-secondary mb-1">
                Reset Time
              </label>
              <input
                type="time"
                value={resetTime}
                onChange={(e) => setResetTime(e.target.value)}
                className="w-full bg-workspace-bg border border-workspace-border text-workspace-text rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-workspace-primary/50 transition-shadow"
                title="When should this daily habit reset?"
              />
              <p className="text-xs text-workspace-text-secondary mt-1 ml-1">
                The habit will uncheck itself automatically when this time of day passes.
              </p>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-workspace-red">{error}</p>}

        <div className="flex items-center justify-end pt-4">
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              type="button"
              className="px-4 py-2 rounded-xl text-sm font-medium text-workspace-text-secondary hover:bg-workspace-border/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl text-sm font-semibold bg-workspace-primary text-white shadow-lg shadow-workspace-primary/20 hover:bg-workspace-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
