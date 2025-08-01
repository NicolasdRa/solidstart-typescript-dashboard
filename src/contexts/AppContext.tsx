import { createContext, useContext, createSignal, onMount } from 'solid-js'
import type { JSX } from 'solid-js'

interface AppContextValue {
  // Sidebar state
  sidebarCollapsed: () => boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  sidebarOpen: () => boolean
  setSidebarOpen: (open: boolean) => void
  
  // Theme state
  theme: () => string
  setTheme: (theme: string) => void
  
  // Hydration state
  isHydrated: () => boolean
  
  // Dashboard state
  showWidgetModal: () => boolean
  setShowWidgetModal: (show: boolean) => void
  
  // Dashboard actions
  clearLayout: () => void
  resetLayout: () => void
  onClearLayout: (callback: () => void) => void
  onResetLayout: (callback: () => void) => void
}

const AppContext = createContext<AppContextValue>()

export function AppProvider(props: { children: JSX.Element }) {
  // Initialize with SSR-safe defaults that match server rendering
  const [sidebarCollapsed, setSidebarCollapsed] = createSignal(false)
  const [sidebarOpen, setSidebarOpen] = createSignal(false)
  const [theme, setTheme] = createSignal('light')
  const [showWidgetModal, setShowWidgetModal] = createSignal(false)
  const [isHydrated, setIsHydrated] = createSignal(typeof window === 'undefined')

  // Enhanced sidebar state setter with persistence
  const handleSetSidebarCollapsed = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed)
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarCollapsed', String(collapsed))
    }
  }

  // Enhanced theme setter with persistence
  const handleSetTheme = (newTheme: string) => {
    setTheme(newTheme)
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboardTheme', newTheme)
      document.documentElement.setAttribute('data-theme', newTheme)
    }
  }

  // Initialize state from localStorage after hydration
  onMount(() => {
    if (typeof window !== 'undefined') {
      // Load saved sidebar state
      const savedSidebarState = localStorage.getItem('sidebarCollapsed')
      if (savedSidebarState !== null) {
        setSidebarCollapsed(savedSidebarState === 'true')
      }

      // Load saved theme
      const savedTheme = localStorage.getItem('dashboardTheme') || 'light'
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)

      // Mark as hydrated to prevent layout shifts
      setIsHydrated(true)
    }
  })
  
  // Dashboard action callbacks - use stable references
  const callbacks = {
    clearLayout: null as (() => void) | null,
    resetLayout: null as (() => void) | null
  }

  const clearLayout = () => {
    if (callbacks.clearLayout) {
      callbacks.clearLayout()
    }
  }

  const resetLayout = () => {
    if (callbacks.resetLayout) {
      callbacks.resetLayout()
    }
  }

  const onClearLayout = (callback: () => void) => {
    callbacks.clearLayout = callback
  }

  const onResetLayout = (callback: () => void) => {
    callbacks.resetLayout = callback
  }

  const contextValue: AppContextValue = {
    sidebarCollapsed,
    setSidebarCollapsed: handleSetSidebarCollapsed,
    sidebarOpen,
    setSidebarOpen,
    theme,
    setTheme: handleSetTheme,
    isHydrated,
    showWidgetModal,
    setShowWidgetModal,
    clearLayout,
    resetLayout,
    onClearLayout,
    onResetLayout
  }

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}