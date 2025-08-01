import { createContext, useContext, createSignal, onMount, createEffect } from 'solid-js'
import { createStore } from 'solid-js/store'
import type { JSX } from 'solid-js'

interface AppContextValue {
  // Sidebar state
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  
  // Theme state
  theme: string
  setTheme: (theme: string) => void
  
  // Hydration state
  isHydrated: boolean
  
  // Dashboard state
  showWidgetModal: boolean
  setShowWidgetModal: (show: boolean) => void
  
  // Dashboard actions
  clearLayout: () => void
  resetLayout: () => void
  onClearLayout: (callback: () => void) => void
  onResetLayout: (callback: () => void) => void
}

const AppContext = createContext<AppContextValue>()

export function AppProvider(props: { children: JSX.Element }) {
  // Use createStore for better state management
  const [state, setState] = createStore({
    sidebarCollapsed: false,
    sidebarOpen: false,
    theme: 'light',
    showWidgetModal: false,
    isHydrated: false
  })

  // Enhanced sidebar state setter with persistence
  const handleSetSidebarCollapsed = (collapsed: boolean) => {
    setState('sidebarCollapsed', collapsed)
    if (state.isHydrated && typeof window !== 'undefined') {
      localStorage.setItem('sidebarCollapsed', String(collapsed))
    }
  }

  // Enhanced theme setter with persistence
  const handleSetTheme = (newTheme: string) => {
    setState('theme', newTheme)
    if (state.isHydrated && typeof window !== 'undefined') {
      localStorage.setItem('dashboardTheme', newTheme)
      document.documentElement.setAttribute('data-theme', newTheme)
    }
  }

  // Initialize state from localStorage after hydration
  onMount(() => {
    if (typeof window !== 'undefined') {
      // Load saved states synchronously to prevent flashes
      const savedSidebarState = localStorage.getItem('sidebarCollapsed')
      const savedTheme = localStorage.getItem('dashboardTheme') || 'light'
      
      setState({
        sidebarCollapsed: savedSidebarState === 'true',
        theme: savedTheme,
        isHydrated: true
      })
      
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
  })

  // Persist theme changes
  createEffect(() => {
    if (state.isHydrated && typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', state.theme)
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
    sidebarCollapsed: state.sidebarCollapsed,
    setSidebarCollapsed: handleSetSidebarCollapsed,
    sidebarOpen: state.sidebarOpen,
    setSidebarOpen: (open: boolean) => setState('sidebarOpen', open),
    theme: state.theme,
    setTheme: handleSetTheme,
    isHydrated: state.isHydrated,
    showWidgetModal: state.showWidgetModal,
    setShowWidgetModal: (show: boolean) => setState('showWidgetModal', show),
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