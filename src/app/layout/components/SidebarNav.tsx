import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface NavItem {
  id: string
  label: string
  icon: React.ElementType
}

interface SidebarNavProps {
  navItems: NavItem[]
  currentView: string
  isCollapsed: boolean
  onViewChange: (view: string) => void
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  navItems,
  currentView,
  isCollapsed,
  onViewChange,
}) => {
  return (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {navItems.map((item) => {
        const isActive = currentView === item.id
        const Icon = item.icon

        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            title={item.label}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl relative group transition-colors ${
              !isActive
                ? 'hover:bg-workspace-border/50 text-workspace-text-secondary hover:text-workspace-text'
                : 'text-white'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-workspace-primary rounded-xl"
                initial={false}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            <div
              className={`relative z-10 flex items-center ${
                isCollapsed ? 'justify-center w-full' : ''
              }`}
            >
              <Icon
                size={18}
                className={`flex-shrink-0 ${
                  isActive
                    ? 'text-white'
                    : 'text-workspace-text-secondary group-hover:text-workspace-text'
                }`}
              />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="ml-3 text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </button>
        )
      })}
    </nav>
  )
}
