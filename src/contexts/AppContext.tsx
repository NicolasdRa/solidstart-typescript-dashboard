import { createContext, useContext, createSignal } from 'solid-js'
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
  // Default to collapsed on desktop, closed on mobile
  const [sidebarCollapsed, setSidebarCollapsed] = createSignal(false)
  const [sidebarOpen, setSidebarOpen] = createSignal(false)
  const [theme, setTheme] = createSignal('light')
  const [showWidgetModal, setShowWidgetModal] = createSignal(false)
  
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
    setSidebarCollapsed,
    sidebarOpen,
    setSidebarOpen,
    theme,
    setTheme,
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