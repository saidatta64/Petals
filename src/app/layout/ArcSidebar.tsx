import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Calendar as CalendarIcon,
  CheckCircle2,
  BarChart3,
  Settings,
  ListTodo,
  FileText,
  Palette,
} from 'lucide-react';
import { SidebarBrand } from './components/SidebarBrand';
import { SidebarNav, NavItem } from './components/SidebarNav';

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'all', label: 'All Tasks', icon: ListTodo },
  { id: 'upcoming', label: 'Upcoming', icon: CalendarIcon },
  { id: 'notepad', label: 'Notepad', icon: FileText },
  { id: 'visuals', label: 'Visuals', icon: Palette },
  { id: 'statistics', label: 'Statistics', icon: BarChart3 },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
];

interface ArcSidebarProps {
  currentView: string;
  onViewChange: (view: any) => void;
}

export const ArcSidebar: React.FC<ArcSidebarProps> = ({ currentView, onViewChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={{ type: 'spring', stiffness: 350, damping: 32 }}
      className="h-full bg-workspace-sidebar/80 backdrop-blur-2xl border-r border-workspace-border flex flex-col relative z-30 select-none group/sidebar"
    >
      <SidebarBrand
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      <SidebarNav
        navItems={navItems}
        currentView={currentView}
        isCollapsed={isCollapsed}
        onViewChange={onViewChange}
      />

      {/* Bottom Actions */}
      <div className="p-3 border-t border-workspace-border/40 mt-auto flex flex-col gap-1">
        <button
          onClick={() => onViewChange('settings')}
          title="Settings"
          className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-colors ${
            currentView === 'settings'
              ? 'bg-workspace-primary text-white'
              : 'text-workspace-text-secondary hover:text-workspace-text hover:bg-workspace-border/50'
          }`}
        >
          <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : ''}`}>
            <Settings
              size={18}
              className={`flex-shrink-0 ${
                currentView === 'settings'
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
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </button>
      </div>
    </motion.aside>
  );
};
