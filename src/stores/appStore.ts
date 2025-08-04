import { createStore } from 'solid-js/store'
import { createEffect } from 'solid-js'
import { isServer } from 'solid-js/web'

// Define the app state interface
interface AppState {
  sidebarCollapsed: boolean
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  showWidgetModal: boolean
  dashboardLayout: 'grid' | 'list' | 'masonry'
  user: {
    id: number
    username: string
    // Profile information
    name: string
    email: string
    bio: string
    location: string
    website: string
    // Account settings
    language: string
    timezone: string
    emailNotifications: boolean
    pushNotifications: boolean
    marketingEmails: boolean
    // UI Preferences
    theme: string
    displayDensity: string
    dashboardLayout: string
    sidebarCollapsed: boolean
    enableAnimations: boolean
    enableSounds: boolean
    autoSave: boolean
    // System fields
    createdAt?: string
    updatedAt?: string
    lastPasswordChange?: string
  } | null
}

// Initialize the global store with SSR-safe defaults
const [appState, setAppState] = createStore<AppState>({
  sidebarCollapsed: false,
  sidebarOpen: false,
  theme: 'light',
  showWidgetModal: false,
  dashboardLayout: 'grid',
  user: null
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
    if (!isServer) {
      localStorage.setItem('sidebarCollapsed', String(collapsed))
    }
  },

  setSidebarOpen: (open: boolean) => {
    setAppState('sidebarOpen', open)
  },

  // Theme actions
  setTheme: (theme: 'light' | 'dark') => {
    setAppState('theme', theme)
    if (!isServer) {
      localStorage.setItem('dashboardTheme', theme)
      document.documentElement.setAttribute('data-theme', theme)
    }
  },

  // Modal actions
  setShowWidgetModal: (show: boolean) => {
    setAppState('showWidgetModal', show)
  },

  // Dashboard layout actions
  setDashboardLayout: (layout: 'grid' | 'list' | 'masonry') => {
    setAppState('dashboardLayout', layout)
    if (!isServer) {
      localStorage.setItem('dashboardLayout', layout)
    }
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

  // User actions
  setUser: (user: { id: number; username: string } | null) => {
    setAppState('user', user)
  },

  // Initialize client state
  initializeClientState: () => {
    if (!isServer) {
      // Load saved states from localStorage
      const savedSidebarState = localStorage.getItem('sidebarCollapsed')
      const savedTheme = localStorage.getItem('dashboardTheme') || 'light'
      const savedLayout = localStorage.getItem('dashboardLayout') || 'grid'
      
      setAppState({
        sidebarCollapsed: savedSidebarState === 'true',
        theme: savedTheme as 'light' | 'dark',
        dashboardLayout: savedLayout as 'grid' | 'list' | 'masonry'
      })
      
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
  }
}

// Export the store state (read-only)
export { appState }

// Set up theme reactive effect on client only
if (!isServer) {
  createEffect(() => {
    document.documentElement.setAttribute('data-theme', appState.theme)
  })
}

// Export a composable for easy component integration
export const useAppStore = () => ({
  state: appState,
  actions: appActions
})