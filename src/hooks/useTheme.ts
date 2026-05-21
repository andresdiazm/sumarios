import { useThemeStore } from '../store/useThemeStore'

export function useTheme() {
  const { theme, toggle, setTheme } = useThemeStore()
  return { theme, toggle, setTheme, isDark: theme === 'dark' }
}
