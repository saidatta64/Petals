import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Bell } from 'lucide-react'
import { useTaskStore, Task } from '../../../shared/stores/taskStore'

export const HeaderNotifications: React.FC = () => {
  const tasks = useTaskStore((state) => state.tasks)
  const [showNotifications, setShowNotifications] = useState(false)
  const [updateInfo, setUpdateInfo] = useState<{
    updateAvailable: boolean
    latestVersion?: string
    downloadUrl?: string
  } | null>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    async function checkUpdate() {
      if (window.taskflow?.app?.checkForUpdates) {
        const res = await window.taskflow.app.checkForUpdates()
        if (res?.updateAvailable) {
          setUpdateInfo(res)
        }
      }
    }
    checkUpdate()
  }, [])

  const todayTasks = useMemo(() => {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const end = new Date()
    end.setHours(23, 59, 59, 999)
    return tasks.filter(
      (t: Task) => t.dueDate && t.dueDate >= start.getTime() && t.dueDate <= end.getTime(),
    )
  }, [tasks])

  const completedToday = useMemo(() => {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const end = new Date()
    end.setHours(23, 59, 59, 999)
    return tasks.filter(
      (t: Task) =>
        t.status === 'COMPLETED' &&
        t.completedAt &&
        t.completedAt >= start.getTime() &&
        t.completedAt <= end.getTime(),
    )
  }, [tasks])

  const notificationsList = useMemo(() => {
    const list: {
      id: string
      title: string
      description: string
      time: string
      isUpdate?: boolean
      downloadUrl?: string
    }[] = []

    if (updateInfo?.updateAvailable) {
      list.push({
        id: 'app-update',
        title: `🚀 Update v${updateInfo.latestVersion} Available!`,
        description: 'A new version of Petals is ready to download.',
        time: 'New',
        isUpdate: true,
        downloadUrl: updateInfo.downloadUrl,
      })
    }

    const pendingDueToday = todayTasks.filter((t: Task) => t.status === 'PENDING')
    if (pendingDueToday.length > 0) {
      list.push({
        id: 'due-today',
        title: 'Tasks Due Today',
        description: `You have ${pendingDueToday.length} task${
          pendingDueToday.length > 1 ? 's' : ''
        } to complete today.`,
        time: 'Today',
      })
    }

    completedToday.forEach((task: Task) => {
      list.push({
        id: `completed-${task.id}`,
        title: 'Task Completed!',
        description: `"${task.title}" has been marked as done.`,
        time: task.completedAt
          ? new Date(task.completedAt).toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'Today',
      })
    })

    if (list.length === 0) {
      list.push({
        id: 'empty',
        title: 'All caught up!',
        description: 'No new notifications.',
        time: 'Now',
      })
    }

    return list
  }, [todayTasks, completedToday])

  const hasActiveNotifications = useMemo(() => {
    return notificationsList.length > 0 && notificationsList[0].id !== 'empty'
  }, [notificationsList])

  return (
    <div className="relative" ref={notificationsRef}>
      <button
        aria-label="Notifications"
        onClick={() => setShowNotifications(!showNotifications)}
        className="w-9 h-9 flex items-center justify-center rounded-xl text-workspace-text-secondary hover:text-workspace-text hover:bg-workspace-border/60 transition-all relative"
      >
        <Bell size={18} />
        {hasActiveNotifications && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-workspace-primary rounded-full border-2 border-workspace-bg"></span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-workspace-card/95 backdrop-blur-xl border border-workspace-border rounded-2xl shadow-glass-card overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-workspace-border flex justify-between items-center">
            <span className="font-semibold text-sm text-workspace-text">Notifications</span>
            {hasActiveNotifications && (
              <span className="text-[10px] bg-workspace-primary/10 text-workspace-primary px-2 py-0.5 rounded-full font-semibold">
                {notificationsList.length} Active
              </span>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-workspace-border">
            {notificationsList.map(
              (item: {
                id: string
                title: string
                description: string
                time: string
                isUpdate?: boolean
                downloadUrl?: string
              }) =>
                item.isUpdate ? (
                  <div
                    key={item.id}
                    className="p-4 bg-workspace-primary/10 border-b border-workspace-border flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-workspace-primary">{item.title}</span>
                      <span className="text-[9px] bg-workspace-primary text-white font-bold px-1.5 py-0.5 rounded">
                        UPDATE
                      </span>
                    </div>
                    <p className="text-xs text-workspace-text-secondary leading-relaxed">
                      {item.description}
                    </p>
                    <button
                      onClick={() =>
                        window.taskflow?.app?.openExternal
                          ? window.taskflow.app.openExternal(item.downloadUrl!)
                          : window.open(item.downloadUrl, '_blank')
                      }
                      className="mt-1 w-full text-xs font-semibold py-1.5 rounded-xl bg-workspace-primary text-white hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-1.5"
                    >
                      Download Update
                    </button>
                  </div>
                ) : (
                  <div
                    key={item.id}
                    className="p-4 hover:bg-workspace-border/30 transition-colors flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-workspace-text">
                        {item.title}
                      </span>
                      <span className="text-[9px] text-workspace-text-secondary font-medium">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs text-workspace-text-secondary leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ),
            )}
          </div>
        </div>
      )}
    </div>
  )
}
