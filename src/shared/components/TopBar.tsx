import { Search, Plus, Moon, Sun } from 'lucide-react'

interface TopBarProps {
  isDarkMode: boolean
  onThemeToggle: () => void
  onAddTask: () => void
}

export default function TopBar({ isDarkMode, onThemeToggle, onAddTask }: TopBarProps) {
  return (
    <header className="h-16 bg-light-surface dark:bg-dark-surface border-b border-light-border dark:border-dark-border flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary" size={18} />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 rounded-input bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text dark:text-dark-text placeholder-light-text-secondary dark:placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-6">
        <button
          onClick={onAddTask}
          className="flex items-center gap-2 px-4 py-2 bg-light-primary dark:bg-dark-primary text-white rounded-button hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          <span className="text-sm font-medium">Add Task</span>
        </button>

        <button
          onClick={onThemeToggle}
          className="p-2 rounded-button hover:bg-light-bg dark:hover:bg-dark-bg transition-colors text-light-text dark:text-dark-text"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  )
}
