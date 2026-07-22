import { useMemo, useState, useEffect } from 'react'
import { useTaskStore } from '@shared/stores/taskStore'
import Heatmap from '@features/heatmap/components/Heatmap'
import { DailyHabitsWidget } from '@features/widgets/components/DailyHabitsWidget'
import { FocusTaskCard } from '@features/tasks/components/FocusTaskCard'
import TaskDialog from '@features/tasks/components/TaskDialog'
import { getEmptyFocusTasksMessage } from '@shared/utils/greetingUtils'
import { DashboardHero } from './DashboardHero'
import { OnboardingModal } from './OnboardingModal'

export default function Dashboard() {
  const tasks = useTaskStore((state) => state.tasks)
  const getTodayTasks = useTaskStore((state) => state.getTodayTasks)
  const getTasksByStatus = useTaskStore((state) => state.getTasksByStatus)

  const todayTasks = useMemo(() => getTodayTasks(), [tasks])
  const completed = useMemo(() => getTasksByStatus('COMPLETED'), [tasks])

  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState<any>(null)
  const [username, setUsername] = useState<string | null>('Friend')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [dbPath, setDbPath] = useState('')

  useEffect(() => {
    async function loadInitialData() {
      if (window.taskflow) {
        // Load both in parallel so neither blocks the other
        const [savedName, currentDbPath] = await Promise.all([
          window.taskflow.settings.get('username'),
          window.taskflow.db.getPath(),
        ])

        // Set the db path first so the onboarding modal has it ready
        if (currentDbPath) setDbPath(currentDbPath)

        if (savedName && typeof savedName === 'string') {
          setUsername(savedName)
        } else {
          setShowOnboarding(true)
        }
      }
    }
    loadInitialData()
  }, [])

  const handleSelectDbPath = async () => {
    if (window.taskflow) {
      const selected = await window.taskflow.db.selectPath()
      if (selected) {
        setDbPath(selected)
        alert(
          'Database location selected! The app will now restart to initialize data in the new location.',
        )
        window.taskflow.app.relaunch()
      }
    }
  }

  const handleSaveName = async () => {
    const name = nameInput.trim()
    if (!name) return
    setUsername(name)
    setShowOnboarding(false)
    if (window.taskflow) {
      await window.taskflow.settings.set('username', name)
    }
  }

  const pendingTasks = useMemo(() => todayTasks.filter((t) => t.status === 'PENDING'), [todayTasks])
  const completedTodayTasks = useMemo(
    () => todayTasks.filter((t) => t.status === 'COMPLETED'),
    [todayTasks],
  )

  const pendingCount = pendingTasks.length
  const todayCompleted = completedTodayTasks.length

  const currentStreak = useMemo(() => {
    const uniqueDays = new Set(
      completed
        .filter((t) => t.completedAt)
        .map((t) => {
          const d = new Date(t.completedAt!)
          d.setHours(0, 0, 0, 0)
          return d.getTime()
        }),
    )

    let streak = 0
    const checkDate = new Date()
    checkDate.setHours(0, 0, 0, 0)

    if (!uniqueDays.has(checkDate.getTime())) {
      checkDate.setDate(checkDate.getDate() - 1)
    }

    while (uniqueDays.has(checkDate.getTime())) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    }
    return streak
  }, [completed])

  return (
    <div className="space-y-12">
      <DashboardHero
        username={username}
        currentStreak={currentStreak}
        onNewTaskClick={() => {
          setTaskToEdit(null)
          setIsTaskDialogOpen(true)
        }}
      />

      {/* Full Width Heatmap */}
      <section className="bg-workspace-card/60 backdrop-blur-md border border-workspace-border rounded-[24px] p-6 mb-8 overflow-visible">
        <Heatmap days={365} />
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Tasks */}
        <div className="xl:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6 border-b border-workspace-border pb-4">
              <h2 className="text-xl font-semibold">Today's Focus</h2>
              <span className="text-workspace-text-secondary text-sm">
                {todayCompleted}/{todayTasks.length} Done
              </span>
            </div>
            <div className="space-y-3">
              {todayTasks.length === 0 ? (
                <div className="bg-workspace-card/50 border border-workspace-border rounded-[16px] p-8 text-center text-workspace-text-secondary">
                  {getEmptyFocusTasksMessage(false)}
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingCount === 0 && (
                    <div className="bg-workspace-card/50 border border-workspace-border rounded-[16px] p-6 text-center text-workspace-text-secondary mb-3">
                      {getEmptyFocusTasksMessage(true)}
                    </div>
                  )}
                  {todayTasks.map((task) => (
                    <FocusTaskCard
                      key={task.id}
                      task={task}
                      onComplete={(id) => {
                        useTaskStore.getState().toggleComplete(id)
                      }}
                      onEdit={() => {
                        setTaskToEdit(task)
                        setIsTaskDialogOpen(true)
                      }}
                      onDelete={(id) => useTaskStore.getState().removeTask(id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Widgets */}
        <div className="space-y-6">
          <DailyHabitsWidget />
        </div>
      </div>

      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => {
          setIsTaskDialogOpen(false)
          setTaskToEdit(null)
        }}
        initialTask={taskToEdit}
      />

      <OnboardingModal
        showOnboarding={showOnboarding}
        nameInput={nameInput}
        dbPath={dbPath}
        onNameChange={setNameInput}
        onSaveName={handleSaveName}
        onSelectDbPath={handleSelectDbPath}
      />
    </div>
  )
}
