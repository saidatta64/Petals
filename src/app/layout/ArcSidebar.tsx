import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  BarChart3, 
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
  FileText,
  Palette
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'today', label: 'Today', icon: Zap },
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
      {/* Floating Edge Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3.5 top-6 w-7 h-7 rounded-full bg-workspace-card/90 backdrop-blur-xl border border-workspace-border text-workspace-text-secondary hover:text-workspace-text hover:bg-workspace-border/80 shadow-md flex items-center justify-center transition-all duration-200 z-50 opacity-0 group-hover/sidebar:opacity-100 hover:scale-110 active:scale-95 group/btn"
      >
        {isCollapsed ? (
          <ChevronRight size={14} className="group-hover/btn:text-workspace-primary transition-colors" />
        ) : (
          <ChevronLeft size={14} className="group-hover/btn:text-workspace-primary transition-colors" />
        )}
      </button>

      {/* Header / Logo & Tagline */}
      <div className={`px-4 pt-5 pb-4 flex items-center justify-between border-b border-workspace-border/40 ${isCollapsed ? 'px-3 justify-center' : ''}`}>
        <div 
          onClick={() => isCollapsed && setIsCollapsed(false)}
          className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
          title={isCollapsed ? "Click to expand sidebar" : undefined}
        >
          <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center">
            <img src="./logo.png" alt="Petals" className="w-9 h-9 object-contain drop-shadow-sm" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex flex-col whitespace-nowrap overflow-hidden"
              >
                <span className="font-brand font-bold text-xl tracking-tight text-workspace-text leading-none">
                  Petals
                </span>
                <span className="font-brand text-[10px] font-semibold tracking-wide text-workspace-text-secondary/80 mt-1">
                  Focus. Plan. <span className="text-purple-500 dark:text-purple-400 font-bold">Bloom.</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              title={item.label}
              className={`w-full flex items-center px-3 py-2.5 rounded-xl relative group transition-colors ${
                !isActive ? 'hover:bg-workspace-border/50 text-workspace-text-secondary hover:text-workspace-text' : 'text-white'
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
              <div className={`relative z-10 flex items-center ${isCollapsed ? 'justify-center w-full' : ''}`}>
                <Icon size={18} className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-workspace-text-secondary group-hover:text-workspace-text'}`} />
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
          );
        })}
      </nav>

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
            <Settings size={18} className={`flex-shrink-0 ${currentView === 'settings' ? 'text-white' : 'text-workspace-text-secondary group-hover:text-workspace-text'}`} />
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
