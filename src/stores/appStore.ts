import { createStore } from 'solid-js/store'
import { createEffect, onMount } from 'solid-js'

// Define the app state interface
interface AppState {
  sidebarCollapsed: boolean
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  showWidgetModal: boolean
  isHydrated: boolean
}

// Initialize the global store with SSR-safe defaults
const [appState, setAppState] = createStore<AppState>({
  sidebarCollapsed: false,
  sidebarOpen: false,
  theme: 'light',
  showWidgetModal: false,
  isHydrated: false
})

// Dashboard action callbacks for widget management
const dashboardCallbacks = {
  clearLayout: null as (() => void) | null,
  resetLayout: null as (() => void) | null
}

// Store actions
export const appActions = {
  // Sidebar actions
  setSidebarCollapsed: (collapsed: boolean) => {
    setAppState('sidebarCollapsed', collapsed)
    if (appState.isHydrated && typeof window !== 'undefined') {
      localStorage.setItem('sidebarCollapsed', String(collapsed))
    }
  },

  setSidebarOpen: (open: boolean) => {
    setAppState('sidebarOpen', open)
  },

  // Theme actions
  setTheme: (theme: 'light' | 'dark') => {
    setAppState('theme', theme)
    if (appState.isHydrated && typeof window !== 'undefined') {
      localStorage.setItem('dashboardTheme', theme)
      document.documentElement.setAttribute('data-theme', theme)
    }
  },

  // Modal actions
  setShowWidgetModal: (show: boolean) => {
    setAppState('showWidgetModal', show)
  },

  // Dashboard actions
  clearLayout: () => {
    if (dashboardCallbacks.clearLayout) {
      dashboardCallbacks.clearLayout()
    }
  },

  resetLayout: () => {
    if (dashboardCallbacks.resetLayout) {
      dashboardCallbacks.resetLayout()
    }
  },

  // Callback registration for dashboard actions
  onClearLayout: (callback: () => void) => {
    dashboardCallbacks.clearLayout = callback
  },

  onResetLayout: (callback: () => void) => {
    dashboardCallbacks.resetLayout = callback
  },

  // Hydration management
  initializeApp: () => {
    if (typeof window !== 'undefined') {
      // Load saved states synchronously to prevent flashes
      const savedSidebarState = localStorage.getItem('sidebarCollapsed')
      const savedTheme = localStorage.getItem('dashboardTheme') || 'light'
      
      setAppState({
        sidebarCollapsed: savedSidebarState === 'true',
        theme: savedTheme as 'light' | 'dark',
        isHydrated: true
      })
      
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
  }
}

// Export the store state (read-only)
export { appState }

// Auto-initialize theme on hydration
if (typeof window !== 'undefined') {
  // Set up theme reactive effect
  createEffect(() => {
    if (appState.isHydrated) {
      document.documentElement.setAttribute('data-theme', appState.theme)
    }
  })
}

// Export a composable for easy component integration
export const useAppStore = () => ({
  state: appState,
  actions: appActions
})