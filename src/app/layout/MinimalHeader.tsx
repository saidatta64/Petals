import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { HeaderSearch } from './components/HeaderSearch';
import { HeaderNotifications } from './components/HeaderNotifications';

interface MinimalHeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const MinimalHeader: React.FC<MinimalHeaderProps> = ({ isDarkMode, onToggleTheme }) => {
  return (
    <header className="flex items-center justify-between w-full h-14">
      <HeaderSearch />

      <div className="flex items-center gap-2 ml-6">
        {/* Theme Toggle */}
        <button
          aria-label="Toggle Theme"
          onClick={onToggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-workspace-text-secondary hover:text-workspace-text hover:bg-workspace-border/60 transition-all"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <HeaderNotifications />
      </div>
    </header>
  );
};
