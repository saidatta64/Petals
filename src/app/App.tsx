import { useEffect, useState } from 'react'
import { WorkspaceLayout, ArcSidebar, MinimalHeader } from './layout'
import Dashboard from '@features/dashboard/components/Dashboard'
import TasksView from '@features/tasks/components/TasksView'
import TaskDialog from '@features/tasks/components/TaskDialog'
import { useTaskStore } from '@shared/stores/taskStore'
import { useCategoryStore } from '@shared/stores/categoryStore'
import { useThemeStore } from '@shared/stores/themeStore'
import CalendarView from '@features/calendar/components/CalendarView'
import StatisticsView from '@features/statistics/components/StatisticsView'
import SettingsView from '@features/settings/components/SettingsView'
import NotepadView from '@features/notepad/components/NotepadView'
import VisualsView from '@features/visuals/components/VisualsView'

type ViewType =
  | 'dashboard'
  | 'all'
  | 'upcoming'
  | 'completed'
  | 'statistics'
  | 'settings'
  | 'notepad'
  | 'visuals'

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)

  const isDarkMode = useThemeStore((state) => state.isDarkMode)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const loadTheme = useThemeStore((state) => state.loadTheme)

  const loadTasks = useTaskStore((state) => state.loadTasks)
  const loadCategories = useCategoryStore((state) => state.loadCategories)
  const getTasksByStatus = useTaskStore((state) => state.getTasksByStatus)

  useEffect(() => {
    loadTheme()
    loadTasks()
    loadCategories()

    // Load default view setting
    async function loadStartupView() {
      if (window.taskflow) {
        const view = await window.taskflow.settings.get('default_view')
        if (view) {
          if (view === 'today') {
            setCurrentView('all')
          } else {
            setCurrentView(view as ViewType)
          }
        }
      }
    }
    loadStartupView()
  }, [loadTheme, loadTasks, loadCategories])

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />
      case 'notepad':
        return <NotepadView />
      case 'visuals':
        return <VisualsView />
      case 'all':
        return (
          <TasksView
            title="All Tasks"
            subtitle="Overview of all your active pending tasks."
            tasks={getTasksByStatus('PENDING')}
            emptyMessage="No pending tasks found. Click + New Task to get started!"
            showCheckbox={false}
          />
        )
      case 'upcoming':
        return <CalendarView />
      case 'completed':
        return (
          <TasksView
            title="Completed Tasks"
            subtitle="Your accomplishments so far."
            tasks={getTasksByStatus('COMPLETED')}
            emptyMessage="No completed tasks yet."
          />
        )
      case 'statistics':
        return <StatisticsView />
      case 'settings':
        return <SettingsView />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className={`${isDarkMode ? 'dark' : ''} text-workspace-text`}>
      <WorkspaceLayout
        fullBleed={currentView === 'notepad' || currentView === 'visuals'}
        sidebar={<ArcSidebar currentView={currentView} onViewChange={setCurrentView} />}
        header={<MinimalHeader isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />}
      >
        {renderView()}
      </WorkspaceLayout>
      <TaskDialog isOpen={isTaskDialogOpen} onClose={() => setIsTaskDialogOpen(false)} />
    </div>
  )
}

export default App
