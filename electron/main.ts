import { app, BrowserWindow, ipcMain, Notification, dialog, shell } from 'electron'
import path from 'path'
import fs from 'fs'

app.disableHardwareAcceleration()

import { initializeDatabase } from '../src/database/db'
import { TaskRepository } from '../src/database/repositories/TaskRepository'
import { CategoryRepository } from '../src/database/repositories/CategoryRepository'
import { ReminderRepository } from '../src/database/repositories/ReminderRepository'
import { SettingsRepository } from '../src/database/repositories/SettingsRepository'
import { HeatmapService } from '../src/database/services/HeatmapService'
import { StatisticsService } from '../src/database/services/StatisticsService'

let mainWindow: BrowserWindow | null = null

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    icon: app.isPackaged
      ? path.join(__dirname, '../renderer/icon.png')
      : path.join(__dirname, '../../public/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  const startUrl = app.isPackaged
    ? `file://${path.join(__dirname, '../renderer/index.html')}`
    : 'http://localhost:5173'

  mainWindow.loadURL(startUrl)

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  if (process.platform === 'win32') {
    app.setAppUserModelId('com.petals.app')
  }

  try {
    const customDir = getDatabaseDirectorySetting()
    initializeDatabase(customDir)
    console.log('Database initialized successfully')
    startReminderScheduler()
  } catch (error) {
    console.error('Failed to initialize database:', error)
  }
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

function isVersionNewer(latestStr: string, currentStr: string): boolean {
  if (!latestStr) return false
  const latestParts = latestStr.replace(/^v/, '').split('.').map(Number)
  const currentParts = currentStr.replace(/^v/, '').split('.').map(Number)
  for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
    const l = latestParts[i] || 0
    const c = currentParts[i] || 0
    if (l > c) return true
    if (l < c) return false
  }
  return false
}

ipcMain.handle('app:version', () => app.getVersion())
ipcMain.handle('app:name', () => app.getName())
ipcMain.handle('app:relaunch', () => {
  app.relaunch()
  app.exit()
})

ipcMain.handle('app:checkForUpdates', async () => {
  try {
    const response = await fetch(
      'https://api.github.com/repos/saidatta64/Petals/releases/latest',
      {
        headers: {
          'User-Agent': 'Petals-App',
          Accept: 'application/vnd.github.v3+json',
        },
      },
    )
    if (!response.ok) {
      return {
        updateAvailable: false,
        currentVersion: app.getVersion(),
        error: 'Could not connect to GitHub release server',
      }
    }
    const release = (await response.json()) as any
    const latestTag = release.tag_name ? release.tag_name.replace(/^v/, '') : ''
    const currentVersion = app.getVersion()
    const isNewer = isVersionNewer(latestTag, currentVersion)

    return {
      updateAvailable: isNewer,
      currentVersion,
      latestVersion: latestTag,
      releaseName: release.name || `v${latestTag}`,
      releaseNotes: release.body || '',
      downloadUrl: release.html_url || 'https://github.com/saidatta64/Petals/releases/latest',
    }
  } catch (err: any) {
    console.error('Failed to check for updates:', err)
    return {
      updateAvailable: false,
      currentVersion: app.getVersion(),
      error: err.message || 'Network error',
    }
  }
})

ipcMain.handle('app:openExternal', (_event, url: string) => {
  if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
    shell.openExternal(url)
  }
})

ipcMain.handle('task:create', (_event, input) => TaskRepository.create(input))
ipcMain.handle('task:getAll', () => TaskRepository.getAll())
ipcMain.handle('task:getById', (_event, id) => TaskRepository.getById(id))
ipcMain.handle('task:update', (_event, id, input) => TaskRepository.update(id, input))
ipcMain.handle('task:complete', (_event, id) => TaskRepository.complete(id))
ipcMain.handle('task:delete', (_event, id) => {
  TaskRepository.delete(id)
  return { success: true }
})

ipcMain.handle('category:getAll', () => CategoryRepository.getAll())
ipcMain.handle('category:create', (_event, input) => CategoryRepository.create(input))
ipcMain.handle('category:delete', (_event, id) => {
  CategoryRepository.delete(id)
  return { success: true }
})

ipcMain.handle('reminder:create', (_event, input) => ReminderRepository.create(input))
ipcMain.handle('reminder:getByTaskId', (_event, taskId) => ReminderRepository.getByTaskId(taskId))

ipcMain.handle('settings:get', (_event, key) => SettingsRepository.get(key))
ipcMain.handle('settings:set', (_event, key, value) => SettingsRepository.set(key, value))

ipcMain.handle('stats:getOverall', () => {
  const res = StatisticsService.getOverallStats()
  console.log('stats:getOverall:', res)
  return res
})
ipcMain.handle('stats:getDaily', (_event, days) => {
  const res = StatisticsService.getDailyStats(days)
  console.log('stats:getDaily:', res)
  return res
})
ipcMain.handle('stats:getCategory', () => {
  const res = StatisticsService.getCategoryStats()
  console.log('stats:getCategory:', res)
  return res
})
ipcMain.handle('stats:getPriority', () => {
  const res = StatisticsService.getPriorityStats()
  console.log('stats:getPriority:', res)
  return res
})
ipcMain.handle('stats:getWeekly', () => {
  const res = StatisticsService.getWeeklyStats()
  console.log('stats:getWeekly:', res)
  return res
})
ipcMain.handle('stats:getMonthly', () => {
  const res = StatisticsService.getMonthlyStats()
  console.log('stats:getMonthly:', res)
  return res
})
ipcMain.handle('stats:getTrend', (_event, days) => {
  const res = StatisticsService.getProductivityTrend(days)
  console.log('stats:getTrend:', res)
  return res
})

ipcMain.handle('heatmap:get', (_event, days) => HeatmapService.generateHeatmapData(days))
ipcMain.handle('heatmap:getStats', (_event, days) => HeatmapService.getHeatmapStats(days))

ipcMain.handle('notification:show', (_event, title, options) => {
  const notification = new Notification({ title, ...options })
  notification.show()
  return { success: true }
})

// Config File Helpers
function getConfigFile() {
  return path.join(app.getPath('userData'), 'config.json')
}

function getDatabaseDirectorySetting(): string | undefined {
  try {
    const configPath = getConfigFile()
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
      return config.databaseDir
    }
  } catch (err) {
    console.error('Failed to read database directory config:', err)
  }
  return undefined
}

function saveDatabaseDirectorySetting(dirPath: string) {
  try {
    const configPath = getConfigFile()
    let config: Record<string, any> = {}
    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    }
    config.databaseDir = dirPath
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
  } catch (err) {
    console.error('Failed to save database directory config:', err)
  }
}

// Notes Folder Helper
function getNotesDirectory(): string {
  let userDataPath = app.getPath('userData')
  const baseName = path.basename(userDataPath)
  if (baseName !== 'TaskFlow') {
    userDataPath = path.join(path.dirname(userDataPath), 'TaskFlow')
  }
  const notesDir = path.join(userDataPath, 'notes')
  if (!fs.existsSync(notesDir)) {
    fs.mkdirSync(notesDir, { recursive: true })
  }
  return notesDir
}

// Native Reminders Scheduler
function startReminderScheduler() {
  setInterval(() => {
    try {
      const notifEnabledSetting = SettingsRepository.get('notification_enabled')
      if (notifEnabledSetting === 'false') {
        return // notifications disabled
      }

      const now = Date.now()
      const enabledReminders = ReminderRepository.getEnabled()

      for (const reminder of enabledReminders) {
        if (reminder.reminderTime <= now) {
          const task = TaskRepository.getById(reminder.taskId)

          if (task && task.status === 'PENDING') {
            const notification = new Notification({
              title: 'Task Reminder ⏰',
              body: `Don't forget: ${task.title}`,
            })
            notification.show()
          }

          if (reminder.repeatType === 'NONE') {
            ReminderRepository.update(reminder.id, { enabled: false })
          } else {
            let nextTime = reminder.reminderTime
            const oneDay = 24 * 60 * 60 * 1000
            if (reminder.repeatType === 'DAILY') {
              nextTime += oneDay
            } else if (reminder.repeatType === 'WEEKLY') {
              nextTime += oneDay * 7
            } else if (reminder.repeatType === 'MONTHLY') {
              const d = new Date(reminder.reminderTime)
              d.setMonth(d.getMonth() + 1)
              nextTime = d.getTime()
            } else if (reminder.repeatType === 'CUSTOM' && reminder.customInterval) {
              nextTime += oneDay * reminder.customInterval
            } else {
              nextTime += oneDay
            }

            while (nextTime <= now) {
              if (reminder.repeatType === 'DAILY') nextTime += oneDay
              else if (reminder.repeatType === 'WEEKLY') nextTime += oneDay * 7
              else break
            }

            ReminderRepository.update(reminder.id, { reminderTime: nextTime })
          }
        }
      }
    } catch (err) {
      console.error('Error in reminder scheduler loop:', err)
    }
  }, 30000)
}

// IPC Handlers for Database Selection and Filesystem Notes
ipcMain.handle('db:selectPath', async () => {
  if (!mainWindow) return null
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Choose Database Directory',
    properties: ['openDirectory', 'createDirectory'],
  })

  if (result.canceled || result.filePaths.length === 0) {
    return null
  }

  const selectedDir = result.filePaths[0]
  saveDatabaseDirectorySetting(selectedDir)
  return selectedDir
})

ipcMain.handle('db:getPath', () => {
  const customDir = getDatabaseDirectorySetting()
  if (customDir) return customDir

  let userDataPath = app.getPath('userData')
  const baseName = path.basename(userDataPath)
  if (baseName !== 'TaskFlow') {
    userDataPath = path.join(path.dirname(userDataPath), 'TaskFlow')
  }
  return userDataPath
})

ipcMain.handle('notes:list', () => {
  try {
    const notesDir = getNotesDirectory()
    const files = fs.readdirSync(notesDir)
    return files
      .filter((file) => file.endsWith('.txt'))
      .map((file) => {
        const filePath = path.join(notesDir, file)
        const stats = fs.statSync(filePath)
        let content = ''
        try {
          content = fs.readFileSync(filePath, 'utf-8')
        } catch (readErr) {
          console.error(`Failed to read content for note ${file}:`, readErr)
        }
        return {
          filename: file,
          path: filePath,
          updatedAt: stats.mtimeMs,
          content,
        }
      })
  } catch (err) {
    console.error('Failed to list notes:', err)
    return []
  }
})

ipcMain.handle('notes:read', (_event, filename: string) => {
  try {
    const notesDir = getNotesDirectory()
    const filePath = path.join(notesDir, filename)
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8')
    }
    return ''
  } catch (err) {
    console.error('Failed to read note:', err)
    return ''
  }
})

ipcMain.handle('notes:write', (_event, filename: string, content: string) => {
  try {
    const notesDir = getNotesDirectory()
    const filePath = path.join(notesDir, filename)
    fs.writeFileSync(filePath, content, 'utf-8')
    return { success: true, path: filePath }
  } catch (err) {
    console.error('Failed to write note:', err)
    return { success: false, error: String(err) }
  }
})

ipcMain.handle('notes:delete', (_event, filename: string) => {
  try {
    const notesDir = getNotesDirectory()
    const filePath = path.join(notesDir, filename)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
    return { success: true }
  } catch (err) {
    console.error('Failed to delete note:', err)
    return { success: false, error: String(err) }
  }
})

ipcMain.handle('notes:openExternalDialog', async () => {
  if (!mainWindow) return null
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Open Text File',
    properties: ['openFile'],
    filters: [{ name: 'Text Files', extensions: ['txt', 'md', 'json', 'css', 'js', 'ts', 'tsx'] }],
  })

  if (result.canceled || result.filePaths.length === 0) {
    return null
  }

  const filePath = result.filePaths[0]
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const stats = fs.statSync(filePath)
    return {
      path: filePath,
      filename: path.basename(filePath),
      content,
      updatedAt: stats.mtimeMs,
    }
  } catch (err) {
    console.error('Failed to read external file:', err)
    return null
  }
})

ipcMain.handle('notes:readExternal', (_event, filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8')
    }
    return ''
  } catch (err) {
    console.error('Failed to read external file:', err)
    return ''
  }
})

ipcMain.handle('notes:writeExternal', (_event, filePath: string, content: string) => {
  try {
    fs.writeFileSync(filePath, content, 'utf-8')
    return { success: true }
  } catch (err) {
    console.error('Failed to write external file:', err)
    return { success: false, error: String(err) }
  }
})

ipcMain.handle('notes:openInExplorer', (_event, filePath?: string) => {
  try {
    const targetPath = filePath || getNotesDirectory()
    if (fs.existsSync(targetPath)) {
      shell.openPath(targetPath)
      return { success: true }
    }
    return { success: false }
  } catch (err) {
    console.error('Failed to open path:', err)
    return { success: false }
  }
})
