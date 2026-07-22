import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarBrandProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const SidebarBrand: React.FC<SidebarBrandProps> = ({ isCollapsed, onToggleCollapse }) => {
  return (
    <>
      {/* Floating Edge Toggle Button */}
      <button
        onClick={onToggleCollapse}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3.5 top-6 w-7 h-7 rounded-full bg-workspace-card/90 backdrop-blur-xl border border-workspace-border text-workspace-text-secondary hover:text-workspace-text hover:bg-workspace-border/80 shadow-md flex items-center justify-center transition-all duration-200 z-50 opacity-0 group-hover/sidebar:opacity-100 hover:scale-110 active:scale-95 group/btn"
      >
        {isCollapsed ? (
          <ChevronRight size={14} className="group-hover/btn:text-workspace-primary transition-colors" />
        ) : (
          <ChevronLeft size={14} className="group-hover/btn:text-workspace-primary transition-colors" />
        )}
      </button>

      {/* Header / Logo & Tagline */}
      <div
        className={`px-4 pt-5 pb-4 flex items-center justify-between border-b border-workspace-border/40 ${
          isCollapsed ? 'px-3 justify-center' : ''
        }`}
      >
        <div
          onClick={() => isCollapsed && onToggleCollapse()}
          className={`flex items-center gap-3 overflow-hidden ${
            isCollapsed ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
          }`}
          title={isCollapsed ? 'Click to expand sidebar' : undefined}
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
    </>
  );
};
