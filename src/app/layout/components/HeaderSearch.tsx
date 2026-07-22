import React, { useState, useEffect, useRef } from 'react'
import { Search, CheckCircle2, Circle } from 'lucide-react'
import { useTaskStore } from '../../../shared/stores/taskStore'

export const HeaderSearch: React.FC = () => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const tasks = useTaskStore((state) => state.tasks)
  const toggleComplete = useTaskStore((state) => state.toggleComplete)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const results = query
    ? tasks
        .filter(
          (t) =>
            t.title.toLowerCase().includes(query.toLowerCase()) ||
            t.description?.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 5)
    : []

  return (
    <div className="flex-1 max-w-xl">
      {/* Command Palette Entry */}
      <div className="relative group z-50">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search
            size={16}
            className="text-workspace-text-secondary group-focus-within:text-workspace-primary transition-colors"
          />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder="Search tasks or jump to... "
          className="w-full bg-workspace-bg border border-workspace-border text-workspace-text rounded-xl pl-10 pr-12 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-workspace-primary/50 transition-shadow shadow-sm placeholder:text-workspace-text-secondary/50"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <kbd className="hidden sm:inline-block border border-workspace-border rounded-md px-2 py-0.5 text-[10px] font-bold text-workspace-text-secondary bg-workspace-card/50">
            Ctrl+K
          </kbd>
        </div>

        {/* Search Dropdown */}
        {isOpen && query && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-workspace-card backdrop-blur-xl border border-workspace-border rounded-xl shadow-glass-card overflow-hidden">
            {results.length > 0 ? (
              <div className="py-2">
                <div className="px-3 pb-2 text-xs font-semibold text-workspace-text-secondary uppercase tracking-wider">
                  Tasks
                </div>
                {results.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-workspace-border/50 cursor-pointer transition-colors"
                    onClick={() => {
                      toggleComplete(task.id)
                      setQuery('')
                      setIsOpen(false)
                    }}
                  >
                    {task.status === 'COMPLETED' ? (
                      <CheckCircle2 size={16} className="text-workspace-green flex-shrink-0" />
                    ) : (
                      <Circle size={16} className="text-workspace-text-secondary flex-shrink-0" />
                    )}
                    <div className="flex-1 truncate">
                      <p
                        className={`text-sm font-medium truncate ${
                          task.status === 'COMPLETED'
                            ? 'text-workspace-text-secondary line-through'
                            : 'text-workspace-text'
                        }`}
                      >
                        {task.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-sm text-workspace-text-secondary">
                No tasks found for "{query}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
