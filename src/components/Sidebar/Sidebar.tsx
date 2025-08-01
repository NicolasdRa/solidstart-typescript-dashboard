import { createEffect, Show } from 'solid-js'
import { Portal } from 'solid-js/web'
import { A } from '@solidjs/router'
import { useAppContext } from '../../contexts/AppContext'
import styles from './Sidebar.module.css'

interface DashboardSidebarProps {
  collapsed: boolean
  onToggle: (collapsed: boolean) => void
  mobileOpen: boolean
  onMobileToggle: (open: boolean) => void
}

export default function DashboardSidebar(props: DashboardSidebarProps) {
  const appContext = useAppContext()

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
    <div class={`${styles.sidebar} ${
      props.mobileOpen 
        ? styles.sidebarMobileOpen
        : props.collapsed 
          ? styles.sidebarCollapsed
          : styles.sidebarExpanded
    }`}>
      {/* Sidebar Header */}
      <div class={styles.header}>
        {props.mobileOpen ? (
          // Mobile view - full header with close button
          <div class={styles.headerMobile}>
            <div class={styles.headerContent}>
              <div class={styles.logo}>
                D
              </div>
              <div>
                <h1 class={styles.logoText}>Dashboard</h1>
                <p class={styles.logoSubtext}>Workspace</p>
              </div>
            </div>
            
            <button
              onClick={() => props.onMobileToggle(false)}
              class={styles.toggleButton}
              title="Close sidebar"
            >
              <svg class={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : props.collapsed ? (
          // Desktop collapsed view - only expand button centered
          <div class={styles.headerCollapsed}>
            <button
              onClick={() => props.onToggle(!props.collapsed)}
              class={styles.toggleButtonCentered}
              title="Expand sidebar"
            >
              <svg class={styles.iconSmall} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ) : (
          // Desktop expanded view - horizontal layout
          <div class={styles.headerExpanded}>
            <div class={styles.headerContent}>
              <div class={styles.logo}>
                D
              </div>
              <div>
                <h1 class={styles.logoText}>Dashboard</h1>
                <p class={styles.logoSubtext}>Workspace</p>
              </div>
            </div>
            
            <button
              onClick={() => props.onToggle(!props.collapsed)}
              class={styles.toggleButton}
              title="Collapse sidebar"
            >
              <svg class={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav class={styles.nav}>
        <ul class={styles.navList}>
          {menuItems.map(item => (
            <li>
              <A
                href={item.path}
                onClick={() => {
                  if (props.mobileOpen) {
                    // Close mobile sidebar after navigation
                    props.onMobileToggle(false)
                  }
                }}
                class={`${styles.navButton} ${
                  props.mobileOpen 
                    ? styles.navButtonMobile
                    : props.collapsed 
                      ? styles.navButtonCollapsed
                      : styles.navButtonExpanded
                }`}
                activeClass={styles.navButtonActive}
                inactiveClass={styles.navButtonInactive}
                end={item.path === '/'}
              >
                <span class={styles.navIcon}>{item.icon}</span>
                <Show when={props.mobileOpen || !props.collapsed}>
                  <span class={styles.navLabel}>{item.label}</span>
                </Show>
                
                {/* Tooltip for collapsed desktop state only */}
                <Show when={props.collapsed && !props.mobileOpen}>
                  <Portal>
                    <div class={styles.tooltip}>
                      {item.label}
                    </div>
                  </Portal>
                </Show>
              </A>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      <div class={styles.userSection}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          class={`${styles.themeButton} ${
            props.mobileOpen 
              ? styles.themeButtonMobile
              : props.collapsed 
                ? styles.themeButtonCollapsed
                : styles.themeButtonExpanded
          }`}
        >
          <span class={styles.themeIcon}>{appContext.theme() === 'light' ? '🌙' : '☀️'}</span>
          <Show when={props.mobileOpen || !props.collapsed}>
            <span class={styles.themeLabel}>{appContext.theme() === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </Show>
          
          {/* Tooltip for collapsed desktop state only */}
          <Show when={props.collapsed && !props.mobileOpen}>
            <Portal>
              <div class={styles.tooltip}>
                {appContext.theme() === 'light' ? 'Dark Mode' : 'Light Mode'}
              </div>
            </Portal>
          </Show>
        </button>

        {/* User Profile */}
        <div class={`${styles.userProfile} ${
          props.mobileOpen 
            ? styles.userProfileMobile
            : props.collapsed 
              ? styles.userProfileCollapsed
              : styles.userProfileExpanded
        }`}>
          <div class={`${styles.userAvatar} ${
            props.collapsed && !props.mobileOpen ? styles.userAvatarSmall : styles.userAvatarLarge
          }`}>
            JD
          </div>
          <Show when={props.mobileOpen || !props.collapsed}>
            <div class={styles.userInfo}>
              <p class={styles.userName}>John Doe</p>
              <p class={styles.userEmail}>john.doe@example.com</p>
            </div>
          </Show>
        </div>
      </div>
    </div>
  )
}