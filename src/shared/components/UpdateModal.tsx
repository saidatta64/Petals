import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import { Sparkles, Download, RefreshCw, XCircle } from 'lucide-react'

interface UpdateModalProps {
  forceOpen?: boolean
  onClose?: () => void
}

export const UpdateModal: React.FC<UpdateModalProps> = ({ forceOpen = false, onClose }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [updateInfo, setUpdateInfo] = useState<{
    latestVersion?: string
    releaseName?: string
    releaseNotes?: string
    downloadUrl?: string
  } | null>(null)

  const [downloading, setDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [updateDownloaded, setUpdateDownloaded] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)

  // Respond to external forceOpen (e.g. from toast button)
  useEffect(() => {
    if (forceOpen && !isOpen) {
      setIsOpen(true)
    }
  }, [forceOpen])

  useEffect(() => {
    async function checkOnLaunch() {
      if (window.taskflow?.app?.checkForUpdates) {
        try {
          const res = await window.taskflow.app.checkForUpdates()
          if (res?.updateAvailable) {
            setUpdateInfo(res)
            setIsOpen(true)
          }
        } catch (err) {
          console.error('Failed to check for updates on launch:', err)
        }
      }
    }

    checkOnLaunch()

    const handleOpenTrigger = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail) {
        setUpdateInfo(customEvent.detail)
      }
      setIsOpen(true)
    }

    window.addEventListener('petals:open-update-modal', handleOpenTrigger)
    return () => {
      window.removeEventListener('petals:open-update-modal', handleOpenTrigger)
    }
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

  const handleClose = () => {
    setIsOpen(false)
    onClose?.()
  }

  const handleDownload = async () => {
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

  const handleRestart = async () => {
    if (window.taskflow?.app?.quitAndInstall) {
      await window.taskflow.app.quitAndInstall()
    } else if (window.taskflow?.app?.relaunch) {
      await window.taskflow.app.relaunch()
    } else {
      window.location.reload()
    }
  }

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="🚀 New Update Available"
      maxWidth="md"
    >
      <div className="space-y-4 pt-1">
        {updateInfo && (
          <div className="p-4 bg-workspace-primary/10 border border-workspace-primary/20 rounded-2xl flex items-start gap-3">
            <div className="p-2.5 bg-workspace-primary/20 text-workspace-primary rounded-xl mt-0.5 flex-shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-workspace-text">
                Petals v{updateInfo.latestVersion || 'New Version'} is available!
              </h4>
              <p className="text-xs text-workspace-text-secondary mt-1 leading-relaxed">
                {updateInfo.releaseName || 'A new update with performance improvements and feature updates.'}
              </p>
            </div>
          </div>
        )}

        {updateInfo?.releaseNotes && (
          <div className="p-3 bg-workspace-bg border border-workspace-border rounded-xl text-xs text-workspace-text-secondary max-h-36 overflow-y-auto whitespace-pre-wrap">
            <p className="font-semibold text-workspace-text mb-1">Release Notes:</p>
            {updateInfo.releaseNotes}
          </div>
        )}

        {/* Progress & Error Status */}
        {updateDownloaded ? (
          <div className="p-3 bg-workspace-green/10 border border-workspace-green/30 rounded-xl text-xs text-workspace-green font-medium">
            🎉 Download complete! Ready to install.
          </div>
        ) : downloading ? (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-workspace-primary font-semibold">
              <span>Downloading update package...</span>
              <span>{downloadProgress}%</span>
            </div>
            <div className="w-full bg-workspace-border h-2 rounded-full overflow-hidden">
              <div
                className="bg-workspace-primary h-full transition-all duration-300 rounded-full"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
          </div>
        ) : updateError ? (
          <div className="p-3 bg-workspace-red/10 border border-workspace-red/30 rounded-xl text-xs text-workspace-red flex items-center gap-2">
            <XCircle size={16} />
            <span>{updateError}</span>
          </div>
        ) : null}

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-workspace-border">
          {!downloading && !updateDownloaded && (
            <button
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold text-workspace-text-secondary hover:text-workspace-text hover:bg-workspace-bg rounded-xl transition-colors"
            >
              Later
            </button>
          )}

          {updateDownloaded ? (
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 bg-workspace-green text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
            >
              <RefreshCw size={14} />
              Restart & Install
            </button>
          ) : (
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 bg-workspace-primary text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
            >
              <Download size={14} />
              {downloading ? 'Downloading...' : 'Download & Install'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
