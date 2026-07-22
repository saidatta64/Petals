import React from 'react';
import { Button } from '@heroui/react';

interface OnboardingModalProps {
  showOnboarding: boolean;
  nameInput: string;
  dbPath: string;
  onNameChange: (name: string) => void;
  onSaveName: () => void;
  onSelectDbPath: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  showOnboarding,
  nameInput,
  dbPath,
  onNameChange,
  onSaveName,
  onSelectDbPath,
}) => {
  if (!showOnboarding) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-workspace-card border border-workspace-border rounded-[24px] p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-workspace-text">Welcome to Petals 🌸</h2>
          <p className="text-sm text-workspace-text-secondary">
            Let's customize your workspace. What should we call you?
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-workspace-text-secondary">Your Name</label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Your name..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSaveName();
              }}
              className="w-full bg-workspace-bg text-workspace-text border border-workspace-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-workspace-primary/50 transition-shadow"
              autoFocus
            />
          </div>

          <div className="space-y-1.5 p-4 border border-workspace-border bg-workspace-bg/40 rounded-2xl">
            <span className="text-xs font-semibold text-workspace-text">
              Database Storage Location
            </span>
            <p className="text-[10px] text-workspace-text-secondary leading-relaxed">
              By default, data is stored on C: drive. If you prefer, select a folder on another drive
              (e.g., D: drive) to avoid C: drive space issues.
            </p>
            <div className="flex flex-col gap-2 mt-2">
              <span
                className="text-[10px] font-mono text-workspace-text bg-workspace-bg border border-workspace-border/55 p-1.5 rounded-lg truncate"
                title={dbPath}
              >
                {dbPath || 'Loading...'}
              </span>
              <button
                type="button"
                onClick={onSelectDbPath}
                className="text-xs font-semibold py-2 px-3 border border-workspace-border hover:bg-workspace-border hover:text-workspace-text text-workspace-text rounded-xl transition-all"
              >
                Choose Custom Folder...
              </button>
            </div>
          </div>

          <Button
            onPress={onSaveName}
            isDisabled={!nameInput.trim()}
            className="w-full h-12 bg-workspace-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};
