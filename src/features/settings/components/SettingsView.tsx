import { useEffect, useState } from 'react'
import { useCategoryStore } from '@shared/stores/categoryStore'
import { Trash2 } from 'lucide-react'

export default function SettingsView() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [defaultView, setDefaultView] = useState('dashboard')
  const [username, setUsername] = useState('')
  const [dbPath, setDbPath] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  
  const categories = useCategoryStore((state) => state.categories)
  const createCategory = useCategoryStore((state) => state.createCategory)
  const deleteCategory = useCategoryStore((state) => state.deleteCategory)

  useEffect(() => {
    async function loadSettings() {
      if (window.taskflow) {
        const notif = await window.taskflow.settings.get('notification_enabled')
        const view = await window.taskflow.settings.get('default_view')
        const name = await window.taskflow.settings.get('username')
        const path = await window.taskflow.db.getPath()

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

  const handleSelectDbPath = async () => {
    if (window.taskflow) {
      const selected = await window.taskflow.db.selectPath()
      if (selected) {
        setDbPath(selected)
        alert('Database storage folder updated! The app will now restart to switch to the new folder.')
        window.taskflow.app.relaunch()
      }
    }
  }

  const handleSave = async () => {
    if (window.taskflow) {
      await window.taskflow.settings.set('notification_enabled', String(notificationsEnabled))
      await window.taskflow.settings.set('default_view', defaultView)
      await window.taskflow.settings.set('username', username.trim())
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return
    const colors = ['#E57373', '#F06292', '#BA68C8', '#9575CD', '#7986CB', '#64B5F6', '#4FC3F7', '#4DD0E1', '#4DB6AC', '#81C784', '#AED581', '#FF8A65']
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
            <option value="today">Today&apos;s Tasks</option>
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
              <h3 className="font-semibold text-workspace-text text-lg">Database Storage Location</h3>
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
          <span className="text-xs font-mono text-workspace-text bg-workspace-bg border border-workspace-border/60 p-2 rounded-xl truncate" title={dbPath}>
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
            <div key={cat.id} className="flex items-center justify-between bg-workspace-bg border border-workspace-border rounded-xl p-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
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
                title={categories.length <= 1 ? "Cannot delete the last category" : "Delete category"}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddCategory} className="flex items-center gap-3 border-t border-workspace-border pt-6">
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

    </div>
  )
}
