import { contextBridge, ipcRenderer } from 'electron'

// Define the API object that will be exposed to the renderer process
const api = {
  app: {
    version: () => ipcRenderer.invoke('app:version'),
    name: () => ipcRenderer.invoke('app:name'),
    relaunch: () => ipcRenderer.invoke('app:relaunch'),
    checkForUpdates: () => ipcRenderer.invoke('app:checkForUpdates'),
    openExternal: (url: string) => ipcRenderer.invoke('app:openExternal', url),
  },
  tasks: {
    create: (input: unknown) => ipcRenderer.invoke('task:create', input),
    getAll: () => ipcRenderer.invoke('task:getAll'),
    getById: (id: number) => ipcRenderer.invoke('task:getById', id),
    update: (id: number, input: unknown) => ipcRenderer.invoke('task:update', id, input),
    complete: (id: number) => ipcRenderer.invoke('task:complete', id),
    delete: (id: number) => ipcRenderer.invoke('task:delete', id),
  },
  categories: {
    getAll: () => ipcRenderer.invoke('category:getAll'),
    create: (input: unknown) => ipcRenderer.invoke('category:create', input),
    remove: (id: number) => ipcRenderer.invoke('category:delete', id),
  },
  reminders: {
    create: (input: unknown) => ipcRenderer.invoke('reminder:create', input),
    getByTaskId: (taskId: number) => ipcRenderer.invoke('reminder:getByTaskId', taskId),
  },
  settings: {
    get: (key: string) => ipcRenderer.invoke('settings:get', key),
    set: (key: string, value: unknown) => ipcRenderer.invoke('settings:set', key, value),
  },
  stats: {
    getOverall: () => ipcRenderer.invoke('stats:getOverall'),
    getDaily: (days: number) => ipcRenderer.invoke('stats:getDaily', days),
    getCategory: () => ipcRenderer.invoke('stats:getCategory'),
    getPriority: () => ipcRenderer.invoke('stats:getPriority'),
    getWeekly: () => ipcRenderer.invoke('stats:getWeekly'),
    getMonthly: () => ipcRenderer.invoke('stats:getMonthly'),
    getTrend: (days: number) => ipcRenderer.invoke('stats:getTrend', days),
  },
  heatmap: {
    get: (days: number) => ipcRenderer.invoke('heatmap:get', days),
    getStats: (days: number) => ipcRenderer.invoke('heatmap:getStats', days),
  },
  notifications: {
    show: (title: string, options?: Record<string, unknown>) =>
      ipcRenderer.invoke('notification:show', title, options),
  },
  db: {
    selectPath: () => ipcRenderer.invoke('db:selectPath'),
    getPath: () => ipcRenderer.invoke('db:getPath'),
  },
  notes: {
    list: () => ipcRenderer.invoke('notes:list'),
    read: (filename: string) => ipcRenderer.invoke('notes:read', filename),
    write: (filename: string, content: string) =>
      ipcRenderer.invoke('notes:write', filename, content),
    delete: (filename: string) => ipcRenderer.invoke('notes:delete', filename),
    openExternalDialog: () => ipcRenderer.invoke('notes:openExternalDialog'),
    readExternal: (filePath: string) => ipcRenderer.invoke('notes:readExternal', filePath),
    writeExternal: (filePath: string, content: string) =>
      ipcRenderer.invoke('notes:writeExternal', filePath, content),
    openInExplorer: (filePath?: string) => ipcRenderer.invoke('notes:openInExplorer', filePath),
  },
}

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('taskflow', api)

// Type declaration for the exposed API
declare global {
  interface Window {
    taskflow: typeof api
  }
}
