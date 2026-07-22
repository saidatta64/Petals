import React from 'react'
import { motion } from 'framer-motion'

interface WorkspaceLayoutProps {
  sidebar: React.ReactNode
  header: React.ReactNode
  children: React.ReactNode
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps & { fullBleed?: boolean }> = ({
  sidebar,
  header,
  children,
  fullBleed,
}) => {
  return (
    <div className="min-h-screen bg-transparent flex overflow-hidden">
      {/* Sidebar Container */}
      <div className="h-screen flex-shrink-0 z-40">{sidebar}</div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 flex flex-col w-full relative h-full">
          {/* Header */}
          <div
            className={`relative z-50 ${fullBleed ? 'px-6 py-3 border-b border-workspace-border/40 bg-workspace-card/10' : 'px-8 py-6'}`}
          >
            {header}
          </div>

          {/* Scrollable Content */}
          <main
            className={`relative z-10 flex-1 ${fullBleed ? 'overflow-hidden p-0' : 'overflow-y-auto px-8 pb-8'}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="h-full"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}
