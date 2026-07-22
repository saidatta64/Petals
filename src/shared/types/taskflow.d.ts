export interface TaskflowAPI {
  app: {
    version: () => Promise<string>
    name: () => Promise<string>
    relaunch: () => Promise<void>
    checkForUpdates: () => Promise<{
      updateAvailable: boolean
      currentVersion: string
      latestVersion?: string
      releaseName?: string
      releaseNotes?: string
      downloadUrl?: string
      error?: string
    }>
    downloadUpdate: () => Promise<{ success: boolean; isDev?: boolean; error?: string }>
    quitAndInstall: () => Promise<void>
    openExternal: (url: string) => Promise<void>
    onUpdateProgress?: (
      callback: (progress: { percent: number; bytesPerSecond: number; transferred: number; total: number }) => void,
    ) => () => void
    onUpdateDownloaded?: (callback: (info: any) => void) => () => void
    onUpdateError?: (callback: (error: string) => void) => () => void
  }
  tasks: {
    create: (input: unknown) => Promise<unknown>
    getAll: () => Promise<unknown[]>
    getById: (id: number) => Promise<unknown>
    update: (id: number, input: unknown) => Promise<unknown>
    complete: (id: number) => Promise<unknown>
    delete: (id: number) => Promise<{ success: boolean }>
  }
  categories: {
    getAll: () => Promise<unknown[]>
    create: (input: unknown) => Promise<unknown>
    remove: (id: number) => Promise<{ success: boolean }>
  }
  reminders: {
    create: (input: unknown) => Promise<unknown>
    getByTaskId: (taskId: number) => Promise<unknown>
  }
  settings: {
    get: (key: string) => Promise<unknown>
    set: (key: string, value: unknown) => Promise<unknown>
  }
  stats: {
    getOverall: () => Promise<unknown>
    getDaily: (days: number) => Promise<unknown[]>
    getCategory: () => Promise<unknown[]>
    getPriority: () => Promise<unknown[]>
    getWeekly: () => Promise<unknown[]>
    getMonthly: () => Promise<unknown[]>
    getTrend: (days: number) => Promise<unknown[]>
  }
  heatmap: {
    get: (days: number) => Promise<unknown[]>
    getStats: (days: number) => Promise<unknown>
  }
  notifications: {
    show: (title: string, options?: Record<string, unknown>) => Promise<{ success: boolean }>
  }
  db: {
    selectPath: () => Promise<string | null>
    getPath: () => Promise<string>
  }
  notes: {
    list: () => Promise<{ filename: string; path: string; updatedAt: number }[]>
    read: (filename: string) => Promise<string>
    write: (filename: string, content: string) => Promise<{ success: boolean; path: string }>
    delete: (filename: string) => Promise<{ success: boolean }>
    openExternalDialog: () => Promise<{
      path: string
      filename: string
      content: string
      updatedAt: number
    } | null>
    readExternal: (filePath: string) => Promise<string>
    writeExternal: (filePath: string, content: string) => Promise<{ success: boolean }>
    openInExplorer: (filePath?: string) => Promise<{ success: boolean }>
  }
}

declare global {
  interface Window {
    taskflow: TaskflowAPI
  }
}

export {}
