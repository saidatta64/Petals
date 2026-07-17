import { useEffect, useState } from 'react'
import { WorkspaceLayout } from './layout/WorkspaceLayout'
import { ArcSidebar } from './layout/ArcSidebar'
import { MinimalHeader } from './layout/MinimalHeader'
import Dashboard from '@features/dashboard/components/Dashboard'
import TasksView from '@features/tasks/components/TasksView'
import TaskDialog from '@features/tasks/components/TaskDialog'
import { useTaskStore } from '@shared/stores/taskStore'
import { useCategoryStore } from '@shared/stores/categoryStore'
import CalendarView from '@features/calendar/components/CalendarView'
import StatisticsView from '@features/statistics/components/StatisticsView'
import SettingsView from '@features/settings/components/SettingsView'
import NotepadView from '@features/notepad/components/NotepadView'
import VisualsView from '@features/visuals/components/VisualsView'

type ViewType =
  | 'dashboard'
  | 'today'
  | 'upcoming'
  | 'completed'
  | 'statistics'
  | 'settings'
  | 'notepad'
  | 'visuals'

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)

  const loadTasks = useTaskStore((state) => state.loadTasks)
  const loadCategories = useCategoryStore((state) => state.loadCategories)
  const getTodayTasks = useTaskStore((state) => state.getTodayTasks)
  const getTasksByStatus = useTaskStore((state) => state.getTasksByStatus)

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDarkMode(prefersDark)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  useEffect(() => {
    loadTasks()
    loadCategories()
    
    // Load default view setting
    async function loadStartupView() {
      if (window.taskflow) {
        const view = await window.taskflow.settings.get('default_view')
        if (view) {
          setCurrentView(view as ViewType)
        }
      }
    }
    loadStartupView()
  }, [loadTasks, loadCategories])

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />
      case 'notepad':
        return <NotepadView />
      case 'visuals':
        return <VisualsView />
      case 'today':
        return (
          <TasksView
            title="Today's Tasks"
            subtitle="Focus on what matters today."
            tasks={getTodayTasks()}
            emptyMessage="No tasks for today. Add one to get started!"
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
        header={
          <MinimalHeader isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} />
        }
      >
        {renderView()}
      </WorkspaceLayout>
      <TaskDialog isOpen={isTaskDialogOpen} onClose={() => setIsTaskDialogOpen(false)} />
    </div>
  )
}

export default App
