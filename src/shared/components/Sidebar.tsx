import {
  LayoutGrid,
  CheckSquare,
  Calendar,
  BarChart3,
  Settings,
  Folder,
  Clock,
  CheckCircle2,
} from 'lucide-react'

type ViewType =
  | 'dashboard'
  | 'today'
  | 'upcoming'
  | 'completed'
  | 'categories'
  | 'calendar'
  | 'statistics'
  | 'settings'

interface SidebarProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'today', label: "Today's Tasks", icon: CheckSquare },
    { id: 'upcoming', label: 'Upcoming', icon: Clock },
    { id: 'completed', label: 'Completed', icon: CheckCircle2 },
    { id: 'categories', label: 'Categories', icon: Folder },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside className="w-60 bg-light-surface dark:bg-dark-surface border-r border-light-border dark:border-dark-border flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-light-border dark:border-dark-border">
        <h1 className="font-brand text-2xl font-bold text-light-text dark:text-dark-text tracking-tight leading-none">
          Petals
        </h1>
        <p className="font-brand text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary mt-1">
          Focus. Plan.{' '}
          <span className="text-purple-500 dark:text-purple-400 font-bold">Bloom.</span>
        </p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id as ViewType)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-button text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-light-primary text-white dark:bg-dark-primary'
                      : 'text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-light-border dark:border-dark-border">
        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">v0.1.0</p>
      </div>
    </aside>
  )
}
