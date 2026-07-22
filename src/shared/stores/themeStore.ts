import { create } from 'zustand'

export type ThemeMode = 'system' | 'light' | 'dark'

interface ThemeStore {
  themeMode: ThemeMode
  isDarkMode: boolean
  setThemeMode: (mode: ThemeMode) => Promise<void>
  toggleTheme: () => Promise<void>
  loadTheme: () => Promise<void>
}

const getSystemPrefersDark = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches

const resolveIsDark = (mode: ThemeMode): boolean => {
  if (mode === 'light') return false
  if (mode === 'dark') return true
  return getSystemPrefersDark()
}

const applyDarkModeClass = (isDark: boolean) => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', isDark)
  }
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  themeMode: 'system',
  isDarkMode: getSystemPrefersDark(),

  setThemeMode: async (mode: ThemeMode) => {
    const isDark = resolveIsDark(mode)
    set({ themeMode: mode, isDarkMode: isDark })
    applyDarkModeClass(isDark)
    if (window.taskflow) {
      await window.taskflow.settings.set('default_theme', mode)
    }
  },

  toggleTheme: async () => {
    const currentIsDark = get().isDarkMode
    const nextMode: ThemeMode = currentIsDark ? 'light' : 'dark'
    await get().setThemeMode(nextMode)
  },

  loadTheme: async () => {
    let mode: ThemeMode = 'system'
    if (window.taskflow) {
      const saved = await window.taskflow.settings.get('default_theme')
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        mode = saved as ThemeMode
      }
    }
    const isDark = resolveIsDark(mode)
    set({ themeMode: mode, isDarkMode: isDark })
    applyDarkModeClass(isDark)

    // Listen for OS system theme changes if set to system
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        if (get().themeMode === 'system') {
          const sysIsDark = getSystemPrefersDark()
          set({ isDarkMode: sysIsDark })
          applyDarkModeClass(sysIsDark)
        }
      }
      mediaQuery.removeEventListener('change', handleChange)
      mediaQuery.addEventListener('change', handleChange)
    }
  },
}))
