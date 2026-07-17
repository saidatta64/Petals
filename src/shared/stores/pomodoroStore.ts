import { create } from 'zustand'

interface PomodoroStore {
  timeLeft: number
  isActive: boolean
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  setTimeLeft: (time: number) => void
  setIsActive: (active: boolean) => void
}

export const usePomodoroStore = create<PomodoroStore>((set) => ({
  timeLeft: 25 * 60,
  isActive: false,

  startTimer: () => set({ isActive: true }),
  
  pauseTimer: () => set({ isActive: false }),
  
  resetTimer: () => set({ isActive: false, timeLeft: 25 * 60 }),

  setTimeLeft: (time: number) => set({ timeLeft: time }),
  
  setIsActive: (active: boolean) => set({ isActive: active }),
}))
