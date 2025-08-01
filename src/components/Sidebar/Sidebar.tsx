import { Show } from 'solid-js'
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

  const toggleTheme = () => {
    const newTheme = appContext.theme === 'light' ? 'dark' : 'light'
    appContext.setTheme(newTheme)
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/' },
    { id: 'profile', label: 'Profile', icon: '👤', path: '/profile' },
    { id: 'analytics', label: 'Analytics', icon: '📈', path: '/analytics' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
  ]

  return (
    <div 
      class={styles.sidebar}
      classList={{
        [styles.sidebarMobileOpen]: props.mobileOpen,
        [styles.sidebarCollapsed]: !props.mobileOpen && props.collapsed,
        [styles.sidebarExpanded]: !props.mobileOpen && !props.collapsed
      }}
    >
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
                class={styles.navButton}
                classList={{
                  [styles.navButtonMobile]: props.mobileOpen,
                  [styles.navButtonCollapsed]: !props.mobileOpen && props.collapsed,
                  [styles.navButtonExpanded]: !props.mobileOpen && !props.collapsed
                }}
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
          class={styles.themeButton}
          classList={{
            [styles.themeButtonMobile]: props.mobileOpen,
            [styles.themeButtonCollapsed]: !props.mobileOpen && props.collapsed,
            [styles.themeButtonExpanded]: !props.mobileOpen && !props.collapsed
          }}
        >
          <span class={styles.themeIcon}>{appContext.theme === 'light' ? '🌙' : '☀️'}</span>
          <Show when={props.mobileOpen || !props.collapsed}>
            <span class={styles.themeLabel}>{appContext.theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </Show>
          
          {/* Tooltip for collapsed desktop state only */}
          <Show when={props.collapsed && !props.mobileOpen}>
            <Portal>
              <div class={styles.tooltip}>
                {appContext.theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </div>
            </Portal>
          </Show>
        </button>

        {/* User Profile */}
        <div 
          class={styles.userProfile}
          classList={{
            [styles.userProfileMobile]: props.mobileOpen,
            [styles.userProfileCollapsed]: !props.mobileOpen && props.collapsed,
            [styles.userProfileExpanded]: !props.mobileOpen && !props.collapsed
          }}
        >
          <div 
            class={styles.userAvatar}
            classList={{
              [styles.userAvatarSmall]: props.collapsed && !props.mobileOpen,
              [styles.userAvatarLarge]: !props.collapsed || props.mobileOpen
            }}
          >
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