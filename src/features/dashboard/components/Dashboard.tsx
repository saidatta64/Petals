import { useMemo, useState, useEffect } from 'react'
import { useTaskStore } from '@shared/stores/taskStore'
import { Button } from '@heroui/react'
import Heatmap from '@features/heatmap/components/Heatmap'
import { DailyHabitsWidget } from '@features/widgets/components/DailyHabitsWidget'
import { StreakWidget } from '@features/widgets/components/StreakWidget'
import { FocusTaskCard } from '@features/tasks/components/FocusTaskCard'
import TaskDialog from '@features/tasks/components/TaskDialog'

export default function Dashboard() {
  useTaskStore((state) => state.tasks)
  const getTodayTasks = useTaskStore((state) => state.getTodayTasks)
  const getTasksByStatus = useTaskStore((state) => state.getTasksByStatus)
  const todayTasks = getTodayTasks()
  const completed = getTasksByStatus('COMPLETED')
  
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState<any>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [dbPath, setDbPath] = useState('')

  useEffect(() => {
    async function loadUsername() {
      if (window.taskflow) {
        const savedName = await window.taskflow.settings.get('username')
        if (savedName && typeof savedName === 'string') {
          setUsername(savedName)
        } else {
          setShowOnboarding(true)
        }
        const currentDbPath = await window.taskflow.db.getPath()
        setDbPath(currentDbPath)
      }
    }
    loadUsername()
  }, [])

  const handleSelectDbPath = async () => {
    if (window.taskflow) {
      const selected = await window.taskflow.db.selectPath()
      if (selected) {
        setDbPath(selected)
        alert('Database location selected! The app will now restart to initialize data in the new location.')
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
  
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const todayCompleted = completed.filter(
    (t) => t.completedAt && t.completedAt >= todayStart.getTime(),
  ).length
  
  const pendingCount = todayTasks.length - todayCompleted;

  const currentStreak = useMemo(() => {
    const uniqueDays = new Set(
      completed
        .filter((t) => t.completedAt)
        .map((t) => {
          const d = new Date(t.completedAt!);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        })
    );

    let streak = 0;
    const checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);

    if (!uniqueDays.has(checkDate.getTime())) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (uniqueDays.has(checkDate.getTime())) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    return streak;
  }, [completed]);

  return (
    <div className="space-y-12">
      {/* Hero Section with Streak Widget on the Right */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <h1 className="text-4xl font-bold tracking-tight text-workspace-text font-brand">
            Oyee, {username || 'friend'} 👋
          </h1>
          <p className="text-workspace-text-secondary text-base max-w-xl leading-relaxed">
            You have {pendingCount > 0 ? pendingCount : 'no'} pending tasks today. 
            {pendingCount > 0 ? ` Complete ${pendingCount} more to keep your ${currentStreak > 0 ? currentStreak + '-day ' : ''}streak alive.` : " Enjoy your evening."}
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Button 
              onPress={() => {
                setTaskToEdit(null)
                setIsTaskDialogOpen(true)
              }}
              className="h-11 px-5 font-bold text-sm rounded-xl bg-workspace-card border border-workspace-border text-workspace-text hover:bg-workspace-border/60 hover:text-workspace-text transition-all flex items-center justify-center gap-2.5 shadow-sm"
            >
              <div className="w-4 h-4 rounded-full bg-workspace-primary/20 flex items-center justify-center text-workspace-primary font-bold text-xs">
                 +
              </div>
              New Task
            </Button>
          </div>
        </div>

        {/* Streak Widget placed on the right side of Hero */}
        <div className="w-full md:w-80 flex-shrink-0">
          <StreakWidget currentStreak={currentStreak} />
        </div>
      </section>

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
              <span className="text-workspace-text-secondary text-sm">{todayCompleted}/{todayTasks.length} Done</span>
            </div>
            <div className="space-y-3">
              {todayTasks.length === 0 ? (
                <div className="bg-workspace-card/50 border border-workspace-border rounded-[16px] p-8 text-center text-workspace-text-secondary">
                  🎉 No tasks today. Enjoy your evening.
                </div>
              ) : (
                <div className="space-y-3">
                  {todayTasks.map(task => (
                    <FocusTaskCard 
                      key={task.id} 
                      task={task}
                      onComplete={(id) => {
                         useTaskStore.getState().toggleComplete(id);
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

      {showOnboarding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-workspace-card border border-workspace-border rounded-[24px] p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold text-workspace-text">Welcome to Petals 🌸</h2>
              <p className="text-sm text-workspace-text-secondary">
                Let's customize your workspace. What should we call you?
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-workspace-text-secondary">Your Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Your name..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName()
                  }}
                  className="w-full bg-workspace-bg text-workspace-text border border-workspace-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-workspace-primary/50 transition-shadow"
                  autoFocus
                />
              </div>

              <div className="space-y-1.5 p-4 border border-workspace-border bg-workspace-bg/40 rounded-2xl">
                <span className="text-xs font-semibold text-workspace-text">Database Storage Location</span>
                <p className="text-[10px] text-workspace-text-secondary leading-relaxed">
                  By default, data is stored on C: drive. If you prefer, select a folder on another drive (e.g., D: drive) to avoid C: drive space issues.
                </p>
                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-[10px] font-mono text-workspace-text bg-workspace-bg border border-workspace-border/55 p-1.5 rounded-lg truncate" title={dbPath}>
                    {dbPath || 'Loading...'}
                  </span>
                  <button
                    type="button"
                    onClick={handleSelectDbPath}
                    className="text-xs font-semibold py-2 px-3 border border-workspace-border hover:bg-workspace-border hover:text-workspace-text text-workspace-text rounded-xl transition-all"
                  >
                    Choose Custom Folder...
                  </button>
                </div>
              </div>

              <Button
                onPress={handleSaveName}
                isDisabled={!nameInput.trim()}
                className="w-full h-12 bg-workspace-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
