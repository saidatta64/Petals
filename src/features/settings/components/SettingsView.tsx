import { useEffect, useState } from 'react'
import { useCategoryStore } from '@shared/stores/categoryStore'
import { useThemeStore, ThemeMode } from '@shared/stores/themeStore'
import { Trash2 } from 'lucide-react'
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

export default function SettingsView() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [defaultView, setDefaultView] = useState('dashboard')
  const [username, setUsername] = useState('')
  const [dbPath, setDbPath] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  const [currentVersion, setCurrentVersion] = useState('')
  const [checkingUpdate, setCheckingUpdate] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [updateDownloaded, setUpdateDownloaded] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [updateResult, setUpdateResult] = useState<{
    updateAvailable: boolean
    latestVersion?: string
    releaseName?: string
    releaseNotes?: string
    downloadUrl?: string
    error?: string
  } | null>(null)

  const categories = useCategoryStore((state) => state.categories)
  const createCategory = useCategoryStore((state) => state.createCategory)
  const deleteCategory = useCategoryStore((state) => state.deleteCategory)

  const themeMode = useThemeStore((state) => state.themeMode)
  const setThemeMode = useThemeStore((state) => state.setThemeMode)

  useEffect(() => {
    async function loadSettings() {
      if (window.taskflow) {
        const notif = await window.taskflow.settings.get('notification_enabled')
        const view = await window.taskflow.settings.get('default_view')
        const name = await window.taskflow.settings.get('username')
        const path = await window.taskflow.db.getPath()
        if (window.taskflow.app?.version) {
          const ver = await window.taskflow.app.version()
          setCurrentVersion(ver)
        }

        if (notif !== undefined) {
          setNotificationsEnabled(notif === 'true' || notif === true)
        }
        if (view) {
          setDefaultView(view as string)
        }
        if (name) {
          setUsername(name as string)
        }
        if (path) {
          setDbPath(path)
        }
      }
    }
    loadSettings()
  }, [])

  useEffect(() => {
    if (!window.taskflow?.app) return

    const cleanProgress = window.taskflow.app.onUpdateProgress?.((progress) => {
      setDownloading(true)
      setDownloadProgress(progress.percent)
    })

    const cleanDownloaded = window.taskflow.app.onUpdateDownloaded?.(() => {
      setDownloading(false)
      setUpdateDownloaded(true)
    })

    const cleanError = window.taskflow.app.onUpdateError?.((err) => {
      setDownloading(false)
      setUpdateError(err)
    })

    return () => {
      cleanProgress?.()
      cleanDownloaded?.()
      cleanError?.()
    }
  }, [])

  const handleCheckForUpdates = async () => {
    setCheckingUpdate(true)
    setUpdateResult(null)
    setUpdateError(null)
    if (window.taskflow?.app?.checkForUpdates) {
      const res = await window.taskflow.app.checkForUpdates()
      setUpdateResult(res)
    } else {
      try {
        const response = await fetch(
          'https://api.github.com/repos/saidatta64/Petals/releases/latest',
        )
        if (response.ok) {
          const release = (await response.json()) as any
          const latestTag = release.tag_name ? release.tag_name.replace(/^v/, '') : ''
          const isNewer = isVersionNewer(latestTag, currentVersion || '0.2.1')
          setUpdateResult({
            updateAvailable: isNewer,
            latestVersion: latestTag,
            releaseName: release.name || `v${latestTag}`,
            downloadUrl: release.html_url || 'https://github.com/saidatta64/Petals/releases/latest',
          })
        } else {
          setUpdateResult({
            updateAvailable: false,
            error: 'Running in Web Preview mode. In-app updates work inside the Petals Desktop App.',
          })
        }
      } catch {
        setUpdateResult({
          updateAvailable: false,
          error: 'Running in Web Preview mode. In-app updates work inside the Petals Desktop App.',
        })
      }
    }
    setCheckingUpdate(false)
  }

  const handleDownloadUpdate = async () => {
    setDownloading(true)
    setUpdateError(null)
    setDownloadProgress(0)

    if (window.taskflow?.app?.downloadUpdate) {
      const res = await window.taskflow.app.downloadUpdate()
      if (!res.success) {
        setDownloading(false)
        setUpdateError(res.error || 'Failed to start download')
      }
    } else {
      // In web preview fallback, simulate in-app download progress
      let p = 0
      const interval = setInterval(() => {
        p += 20
        setDownloadProgress(p)
        if (p >= 100) {
          clearInterval(interval)
          setDownloading(false)
          setUpdateDownloaded(true)
        }
      }, 300)
    }
  }

  const handleRestartAndInstall = async () => {
    if (window.taskflow?.app?.quitAndInstall) {
      await window.taskflow.app.quitAndInstall()
    } else if (window.taskflow?.app?.relaunch) {
      await window.taskflow.app.relaunch()
    } else {
      window.location.reload()
    }
  }

  const handleSelectDbPath = async () => {
    if (window.taskflow) {
      const selected = await window.taskflow.db.selectPath()
      if (selected) {
        setDbPath(selected)
        alert(
          'Database storage folder updated! The app will now restart to switch to the new folder.',
        )
        window.taskflow.app.relaunch()
      }
    }
  }

  const handleSave = async () => {
    if (window.taskflow) {
      await window.taskflow.settings.set('notification_enabled', String(notificationsEnabled))
      await window.taskflow.settings.set('default_view', defaultView)
      await window.taskflow.settings.set('username', username.trim())
      await window.taskflow.settings.set('default_theme', themeMode)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return
    const colors = [
      '#E57373',
      '#F06292',
      '#BA68C8',
      '#9575CD',
      '#7986CB',
      '#64B5F6',
      '#4FC3F7',
      '#4DD0E1',
      '#4DB6AC',
      '#81C784',
      '#AED581',
      '#FF8A65',
    ]
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    await createCategory({ name: newCategoryName.trim(), color: randomColor })
    setNewCategoryName('')
  }

  return (
    <div className="p-8 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-workspace-text">Settings</h1>
        <p className="text-workspace-text-secondary mt-1">
          Configure preferences and local database parameters.
        </p>
      </div>

      <div className="bg-workspace-card backdrop-blur-md border border-workspace-border rounded-[24px] p-6 space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-workspace-text text-lg">Native Notifications</h3>
            <p className="text-sm text-workspace-text-secondary">
              Enable task reminder banners in Windows.
            </p>
          </div>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-11 h-6 rounded-full p-1 flex items-center transition-colors duration-200 focus:outline-none ${
              notificationsEnabled ? 'bg-workspace-primary' : 'bg-workspace-border'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="border-t border-workspace-border pt-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-workspace-text text-lg">Default Theme</h3>
            <p className="text-sm text-workspace-text-secondary">
              Choose your preferred visual theme appearance.
            </p>
          </div>
          <select
            value={themeMode}
            onChange={(e) => setThemeMode(e.target.value as ThemeMode)}
            className="bg-workspace-bg text-workspace-text border border-workspace-border rounded-xl px-4 py-2 text-sm outline-none cursor-pointer focus:ring-2 focus:ring-workspace-primary/50 transition-shadow"
          >
            <option value="system">System Default</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className="border-t border-workspace-border pt-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-workspace-text text-lg">Default Startup Page</h3>
            <p className="text-sm text-workspace-text-secondary">
              Select which view is displayed first.
            </p>
          </div>
          <select
            value={defaultView}
            onChange={(e) => setDefaultView(e.target.value)}
            className="bg-workspace-bg text-workspace-text border border-workspace-border rounded-xl px-4 py-2 text-sm outline-none cursor-pointer focus:ring-2 focus:ring-workspace-primary/50 transition-shadow"
          >
            <option value="dashboard">Dashboard</option>
            <option value="all">All Tasks</option>
            <option value="upcoming">Upcoming Tasks</option>
          </select>
        </div>

        <div className="border-t border-workspace-border pt-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-workspace-text text-lg">User Profile Name</h3>
            <p className="text-sm text-workspace-text-secondary">
              Change the greeting name displayed on the dashboard.
            </p>
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your name"
            className="bg-workspace-bg text-workspace-text border border-workspace-border rounded-xl px-4 py-2 text-sm w-48 outline-none focus:ring-2 focus:ring-workspace-primary/50 transition-shadow"
          />
        </div>

        <div className="border-t border-workspace-border pt-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-workspace-text text-lg">
                Database Storage Location
              </h3>
              <p className="text-sm text-workspace-text-secondary">
                The folder where your local SQLite database is stored.
              </p>
            </div>
            <button
              onClick={handleSelectDbPath}
              className="bg-workspace-border hover:bg-workspace-border/80 border border-workspace-border text-workspace-text font-semibold rounded-xl px-4 py-2 text-xs transition-colors"
            >
              Move/Select Folder...
            </button>
          </div>
          <span
            className="text-xs font-mono text-workspace-text bg-workspace-bg border border-workspace-border/60 p-2 rounded-xl truncate"
            title={dbPath}
          >
            {dbPath || 'Loading...'}
          </span>
        </div>

        <div className="border-t border-workspace-border pt-6 flex items-center">
          <button
            onClick={handleSave}
            className="bg-workspace-primary text-white font-semibold rounded-xl px-6 py-2.5 hover:opacity-90 transition-opacity text-sm shadow-md"
          >
            Save Settings
          </button>
          {isSaved && (
            <span className="ml-4 text-sm text-workspace-green font-medium">
              Settings saved successfully!
            </span>
          )}
        </div>
      </div>

      {/* Category Management Section */}
      <div className="bg-workspace-card backdrop-blur-md border border-workspace-border rounded-[24px] p-6 space-y-6 shadow-sm">
        <div>
          <h3 className="font-semibold text-workspace-text text-lg">Categories</h3>
          <p className="text-sm text-workspace-text-secondary">
            Manage your custom task categories.
          </p>
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between bg-workspace-bg border border-workspace-border rounded-xl p-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full shadow-sm"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="font-medium text-workspace-text">{cat.name}</span>
              </div>
              <button
                onClick={async () => {
                  if (categories.length > 1) {
                    try {
                      await deleteCategory(cat.id)
                    } catch (err: any) {
                      alert(`Failed to delete category: ${err.message}`)
                    }
                  }
                }}
                disabled={categories.length <= 1}
                className="p-2 text-workspace-text-secondary hover:text-workspace-red hover:bg-workspace-red/10 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-workspace-text-secondary"
                title={
                  categories.length <= 1 ? 'Cannot delete the last category' : 'Delete category'
                }
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleAddCategory}
          className="flex items-center gap-3 border-t border-workspace-border pt-6"
        >
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New Category Name..."
            className="flex-1 bg-workspace-bg text-workspace-text border border-workspace-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-workspace-primary/50 transition-shadow"
          />
          <button
            type="submit"
            disabled={!newCategoryName.trim()}
            className="bg-workspace-primary text-white font-semibold rounded-xl px-5 py-2.5 hover:opacity-90 transition-opacity text-sm shadow-md disabled:opacity-50"
          >
            Add
          </button>
        </form>
      </div>

      {/* App Updates Section */}
      <div className="bg-workspace-card backdrop-blur-md border border-workspace-border rounded-[24px] p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-workspace-text text-lg">App Updates & Version</h3>
            <p className="text-sm text-workspace-text-secondary mt-0.5">
              Current Version:{' '}
              <span className="font-mono font-bold text-workspace-text">
                v{currentVersion || '0.2.1'}
              </span>
            </p>
          </div>
          <button
            onClick={handleCheckForUpdates}
            disabled={checkingUpdate}
            className="bg-workspace-primary text-white font-semibold rounded-xl px-5 py-2.5 hover:opacity-90 transition-opacity text-sm shadow-md disabled:opacity-50"
          >
            {checkingUpdate ? 'Checking...' : 'Check for Updates'}
          </button>
        </div>

        {(updateResult || downloading || updateDownloaded || updateError) && (
          <div className="pt-3 border-t border-workspace-border">
            {updateDownloaded ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-workspace-green/10 border border-workspace-green/30 rounded-2xl">
                <div>
                  <span className="font-bold text-sm text-workspace-green">
                    🎉 Update Downloaded & Ready to Install!
                  </span>
                  <p className="text-xs text-workspace-text-secondary mt-0.5">
                    Click restart to apply the update automatically.
                  </p>
                </div>
                <button
                  onClick={handleRestartAndInstall}
                  className="bg-workspace-green text-white text-xs font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap"
                >
                  Restart & Install
                </button>
              </div>
            ) : downloading ? (
              <div className="p-4 bg-workspace-primary/10 border border-workspace-primary/30 rounded-2xl">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-sm text-workspace-primary">
                    Downloading Update...
                  </span>
                  <span className="text-xs font-semibold text-workspace-primary">
                    {downloadProgress}%
                  </span>
                </div>
                <div className="w-full bg-workspace-border h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-workspace-primary h-full transition-all duration-300 rounded-full"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
              </div>
            ) : updateResult?.updateAvailable ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-workspace-primary/10 border border-workspace-primary/30 rounded-2xl">
                <div>
                  <span className="font-bold text-sm text-workspace-primary">
                    🚀 New Update v{updateResult.latestVersion} Available!
                  </span>
                  <p className="text-xs text-workspace-text-secondary mt-0.5">
                    Click below to download and install directly inside Petals.
                  </p>
                </div>
                <button
                  onClick={handleDownloadUpdate}
                  className="bg-workspace-primary text-white text-xs font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap"
                >
                  Download Update
                </button>
              </div>
            ) : updateError || updateResult?.error ? (
              <p className="text-xs text-workspace-red font-medium">
                {updateError || updateResult?.error}
              </p>
            ) : (
              <p className="text-xs text-workspace-green font-medium">
                ✨ Petals is up to date (v{currentVersion || '0.2.1'})!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
