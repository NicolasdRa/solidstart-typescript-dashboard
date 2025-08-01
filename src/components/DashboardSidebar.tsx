import { createEffect, Show } from 'solid-js'
import { Portal } from 'solid-js/web'
import { useNavigate } from '@solidjs/router'
import { useAppContext } from '../contexts/AppContext'

interface DashboardSidebarProps {
  currentPage: string
  collapsed: boolean
  onToggle: (collapsed: boolean) => void
  mobileOpen: boolean
  onMobileToggle: (open: boolean) => void
}

export default function DashboardSidebar(props: DashboardSidebarProps) {
  const appContext = useAppContext()
  const navigate = useNavigate()

  createEffect(() => {
    // Load saved theme preference
    const savedTheme = localStorage.getItem('dashboardTheme') || 'light'
    appContext.setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  })

  const toggleTheme = () => {
    const newTheme = appContext.theme() === 'light' ? 'dark' : 'light'
    appContext.setTheme(newTheme)
    localStorage.setItem('dashboardTheme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/' },
    { id: 'profile', label: 'Profile', icon: '👤', path: '/profile' },
    { id: 'analytics', label: 'Analytics', icon: '📈', path: '/analytics' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
  ]

  return (
    <div class={`fixed left-0 top-0 h-screen bg-white shadow-lg sidebar-transition z-40 flex flex-col ${
      // Mobile: full screen when open, hidden when closed
      // Desktop: 16rem when collapsed, 18rem when expanded
      props.mobileOpen 
        ? 'w-full translate-x-0 lg:hidden' 
        : props.collapsed 
          ? 'w-16 -translate-x-full lg:translate-x-0 border-r border-secondary-200' 
          : 'w-72 -translate-x-full lg:translate-x-0 border-r border-secondary-200'
    }`}>
      {/* Sidebar Header */}
      <div class="border-b border-secondary-200 sidebar-transition flex-shrink-0 p-4 h-20">
        {props.mobileOpen ? (
          // Mobile view - full header with close button
          <div class="flex items-center justify-between h-full lg:hidden">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                D
              </div>
              <div>
                <h1 class="text-xl font-bold text-secondary-900 leading-tight">Dashboard</h1>
                <p class="text-sm text-secondary-500 leading-tight">Workspace</p>
              </div>
            </div>
            
            <button
              onClick={() => props.onMobileToggle(false)}
              class="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg transition-all duration-200"
              title="Close sidebar"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : props.collapsed ? (
          // Desktop collapsed view - only expand button centered
          <div class="hidden lg:flex items-center justify-center h-full w-full">
            <button
              onClick={() => props.onToggle(!props.collapsed)}
              class="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg transition-all duration-200 items-center justify-center"
              title="Expand sidebar"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ) : (
          // Desktop expanded view - horizontal layout
          <div class="hidden lg:flex items-center justify-between h-full">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                D
              </div>
              <div>
                <h1 class="text-xl font-bold text-secondary-900 leading-tight">Dashboard</h1>
                <p class="text-sm text-secondary-500 leading-tight">Workspace</p>
              </div>
            </div>
            
            <button
              onClick={() => props.onToggle(!props.collapsed)}
              class="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg transition-all duration-200"
              title="Collapse sidebar"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav class="flex-1 overflow-y-auto overflow-x-hidden sidebar-transition p-4">
        <ul class="space-y-2">
          {menuItems.map(item => (
            <li>
              <button
                onClick={() => {
                  if (props.mobileOpen) {
                    // Navigate immediately while closing sidebar
                    navigate(item.path)
                    props.onMobileToggle(false)
                  } else {
                    navigate(item.path)
                  }
                }}
                class={`flex items-center rounded-lg transition-all duration-200 hover:bg-secondary-100 relative group h-12 w-full ${
                  props.mobileOpen 
                    ? 'gap-3 px-4' 
                    : props.collapsed 
                      ? 'px-0 justify-center' 
                      : 'gap-3 px-4'
                } ${
                  props.currentPage === item.id 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-secondary-700 hover:text-secondary-900'
                }`}
              >
                <span class="text-xl flex-shrink-0 w-6 text-center">{item.icon}</span>
                <Show when={props.mobileOpen || !props.collapsed}>
                  <span class="font-medium truncate min-w-0 flex-1">{item.label}</span>
                </Show>
                
                {/* Tooltip for collapsed desktop state only */}
                <Show when={props.collapsed && !props.mobileOpen}>
                  <Portal>
                    <div class="absolute left-full ml-2 px-2 py-1 bg-secondary-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  </Portal>
                </Show>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      <div class="flex-shrink-0 border-t border-secondary-200 bg-white sidebar-transition p-4 h-36">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          class={`w-full flex items-center rounded-lg text-secondary-700 hover:bg-secondary-100 hover:text-secondary-900 transition-all duration-200 mb-3 relative group h-12 overflow-hidden ${
            props.mobileOpen 
              ? 'gap-3 px-4' 
              : props.collapsed 
                ? 'px-0 justify-center' 
                : 'gap-3 px-4'
          }`}
        >
          <span class="text-xl flex-shrink-0 w-6 text-center">{appContext.theme() === 'light' ? '🌙' : '☀️'}</span>
          <Show when={props.mobileOpen || !props.collapsed}>
            <span class="font-medium truncate min-w-0 flex-1 text-left">{appContext.theme() === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </Show>
          
          {/* Tooltip for collapsed desktop state only */}
          <Show when={props.collapsed && !props.mobileOpen}>
            <Portal>
              <div class="absolute left-full ml-2 px-2 py-1 bg-secondary-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                {appContext.theme() === 'light' ? 'Dark Mode' : 'Light Mode'}
              </div>
            </Portal>
          </Show>
        </button>

        {/* User Profile */}
        <div class={`flex items-center rounded-lg h-16 w-full ${
          props.mobileOpen 
            ? 'gap-3 px-4 overflow-hidden' 
            : props.collapsed 
              ? 'px-3 justify-center' 
              : 'gap-3 px-4 overflow-hidden'
        }`}>
          <div class={`bg-primary-600 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0 ${
            props.collapsed && !props.mobileOpen ? 'w-8 h-8 text-sm' : 'w-10 h-10'
          }`}>
            JD
          </div>
          <Show when={props.mobileOpen || !props.collapsed}>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-secondary-900 truncate leading-tight">John Doe</p>
              <p class="text-xs text-secondary-500 truncate leading-tight">john.doe@example.com</p>
            </div>
          </Show>
        </div>
      </div>
    </div>
  )
}