import { useState, useEffect } from 'react'
import { Palette, RefreshCw } from 'lucide-react'

type CanvasType = 'excalidraw' | 'tldraw'

export default function VisualsView() {
  const [canvasType, setCanvasType] = useState<CanvasType>('excalidraw')
  const [refreshKey, setRefreshKey] = useState(0)

  // Load user preference for drawing tool
  useEffect(() => {
    const savedType = localStorage.getItem('petals_canvas_preference')
    if (savedType === 'excalidraw' || savedType === 'tldraw') {
      setCanvasType(savedType)
    }
  }, [])

  const handleCanvasChange = (type: CanvasType) => {
    setCanvasType(type)
    localStorage.setItem('petals_canvas_preference', type)
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  };

  const iframeSrc = canvasType === 'excalidraw' 
    ? 'https://excalidraw.com' 
    : 'https://tldraw.com'

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-workspace-card/5">
      {/* Header controls */}
      <div className="px-6 py-3 border-b border-workspace-border flex items-center justify-between bg-workspace-card/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-workspace-primary/10 rounded-xl text-workspace-primary">
            <Palette size={20} />
          </div>
          <div>
            <h2 className="font-bold text-workspace-text text-base flex items-center gap-2">
              Visual Canvas
            </h2>
            <p className="text-[11px] text-workspace-text-secondary">
              Sketch diagrams, mindmaps, and illustrations. Automatically saved.
            </p>
          </div>
        </div>

        {/* Toolbar selectors */}
        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="p-2 text-workspace-text-secondary hover:text-workspace-text hover:bg-workspace-border/50 rounded-xl transition-all"
            title="Reload canvas"
          >
            <RefreshCw size={16} />
          </button>

          {/* Toggle Canvas Button */}
          <div className="bg-workspace-bg/85 border border-workspace-border p-1 rounded-xl flex gap-1">
            <button
              onClick={() => handleCanvasChange('excalidraw')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                canvasType === 'excalidraw'
                  ? 'bg-workspace-primary text-white shadow-sm'
                  : 'text-workspace-text-secondary hover:text-workspace-text'
              }`}
            >
              Excalidraw
            </button>
            <button
              onClick={() => handleCanvasChange('tldraw')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                canvasType === 'tldraw'
                  ? 'bg-workspace-primary text-white shadow-sm'
                  : 'text-workspace-text-secondary hover:text-workspace-text'
              }`}
            >
              tldraw
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Drawing Canvas Area */}
      <div className="flex-1 bg-white relative">
        <iframe
          key={`${canvasType}-${refreshKey}`}
          src={iframeSrc}
          className="w-full h-full border-0 absolute inset-0"
          title={canvasType === 'excalidraw' ? 'Excalidraw' : 'tldraw'}
          allow="clipboard-read; clipboard-write; focus-without-user-activation"
          sandbox="allow-same-origin allow-scripts allow-downloads allow-forms allow-popups allow-modals allow-popups-to-escape-sandbox"
        />
      </div>
    </div>
  )
}
