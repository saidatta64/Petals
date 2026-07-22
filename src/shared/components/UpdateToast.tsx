import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Download, Sparkles } from 'lucide-react'

interface UpdateToastProps {
  onOpenModal: () => void
}

export function UpdateToast({ onOpenModal }: UpdateToastProps) {
  const [visible, setVisible] = useState(false)
  const [latestVersion, setLatestVersion] = useState('')
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    let dismissed = false

    async function checkUpdate() {
      try {
        if (window.taskflow?.app?.checkForUpdates) {
          const res = await window.taskflow.app.checkForUpdates()
          if (res?.updateAvailable && !dismissed) {
            setLatestVersion(res.latestVersion || '')
            setVisible(true)
            // trigger slide-in animation on next paint
            setTimeout(() => setAnimateIn(true), 10)
          }
        }
      } catch (err) {
        console.error('UpdateToast check failed:', err)
      }
    }

    // Delay so the app has time to fully load before popping the toast
    const timer = setTimeout(checkUpdate, 3000)
    return () => {
      dismissed = true
      clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setAnimateIn(false)
    setTimeout(() => setVisible(false), 300)
  }

  const handleInstall = () => {
    onOpenModal()
    handleClose()
  }

  if (!visible) return null

  return createPortal(
    <div
      className={`fixed bottom-6 right-6 z-[200] transition-all duration-300 ease-out ${
        animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <div className="flex items-start gap-3 bg-workspace-card border border-workspace-primary/30 rounded-2xl p-4 shadow-glass-card max-w-xs w-full">
        {/* Icon */}
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-workspace-primary/15 flex items-center justify-center text-workspace-primary">
          <Sparkles size={18} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-workspace-text leading-tight">
            Update Available {latestVersion ? `v${latestVersion}` : ''}
          </p>
          <p className="text-xs text-workspace-text-secondary mt-0.5 leading-relaxed">
            A new version of Petals is ready to install.
          </p>

          {/* Action */}
          <button
            onClick={handleInstall}
            className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-workspace-primary hover:opacity-80 transition-opacity"
          >
            <Download size={13} />
            Download & Install
          </button>
        </div>

        {/* Close */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 text-workspace-text-secondary hover:text-workspace-text hover:bg-workspace-border/50 rounded-lg transition-colors"
          aria-label="Dismiss update notification"
        >
          <X size={15} />
        </button>
      </div>
    </div>,
    document.body,
  )
}
