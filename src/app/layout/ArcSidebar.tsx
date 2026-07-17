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
    <motion.div 
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-full bg-workspace-sidebar/60 backdrop-blur-3xl rounded-[24px] border border-workspace-border shadow-glass-card flex flex-col relative"
    >
      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute right-[-12px] top-6 bg-workspace-card border border-workspace-border rounded-full p-1 shadow-sm z-50 hover:bg-workspace-bg transition-colors"
      >
        {isCollapsed ? <ChevronRight size={14} className="text-workspace-text" /> : <ChevronLeft size={14} className="text-workspace-text" />}
      </button>

      {/* Header / Logo */}
      <div className={`px-6 pt-8 pb-4 flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="w-14 h-14 flex-shrink-0">
          <img src="./logo.png" alt="Petals" className="w-14 h-14 object-contain" />
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="font-bold text-2xl whitespace-nowrap overflow-hidden tracking-tight"
            >
              Petals
            </motion.span>
          )}
        </AnimatePresence>
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
              className={`w-full flex items-center p-3 rounded-[12px] relative group transition-colors ${
                !isActive ? 'hover:bg-workspace-border/50 text-workspace-text-secondary' : 'text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-workspace-primary rounded-[12px]"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <div className={`relative z-10 flex items-center ${isCollapsed ? 'justify-center w-full' : ''}`}>
                <Icon size={20} className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-workspace-text-secondary group-hover:text-workspace-text'}`} />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="ml-3 font-medium whitespace-nowrap overflow-hidden"
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
      <div className="p-4 border-t border-workspace-border mt-auto flex flex-col gap-2">
        <button 
          onClick={() => onViewChange('settings')}
          className="flex items-center p-2 rounded-xl hover:bg-workspace-border/50 transition-colors text-workspace-text-secondary group w-full"
        >
           <Settings size={20} className="flex-shrink-0 group-hover:text-workspace-text" />
           <AnimatePresence>
             {!isCollapsed && (
               <motion.span 
                 initial={{ opacity: 0, width: 0 }}
                 animate={{ opacity: 1, width: 'auto' }}
                 exit={{ opacity: 0, width: 0 }}
                 className="ml-3 font-medium whitespace-nowrap overflow-hidden"
               >
                 Settings
               </motion.span>
             )}
           </AnimatePresence>
        </button>


      </div>
    </motion.div>
  );
};
