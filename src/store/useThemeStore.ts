import { create } from 'zustand'

type Theme = 'dark' | 'light'

interface ThemeStore {
  theme: Theme
  setTheme: (t: Theme) => void
  toggle: () => void
}

function applyTheme(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('lexsum-theme', theme)
}

function getInitialTheme(): Theme {
  const saved = localStorage.getItem('lexsum-theme') as Theme | null
  if (saved === 'dark' || saved === 'light') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const initial = getInitialTheme()
applyTheme(initial)

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: initial,
  setTheme: (t) => {
    applyTheme(t)
    set({ theme: t })
  },
  toggle: () =>
    set((s) => {
      const next: Theme = s.theme === 'dark' ? 'light' : 'dark'
      applyTheme(next)
      return { theme: next }
    }),
}))
