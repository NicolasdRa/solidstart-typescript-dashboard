import { Show, createSignal, onMount, onCleanup } from 'solid-js'
import { Portal } from 'solid-js/web'
import { A, useAction } from '@solidjs/router'
import { useAppStore } from '~/stores/appStore'
import { logout } from '~/api'
import styles from './Sidebar.module.css'

interface SidebarProps {
  collapsed: boolean
  onToggle: (collapsed: boolean) => void
  mobileOpen: boolean
  onMobileToggle: (open: boolean) => void
}

export default function Sidebar(props: SidebarProps) {
  const { state, actions } = useAppStore()
  const logoutAction = useAction(logout)
  const [showUserDropdown, setShowUserDropdown] = createSignal(false)
  const [isLoggingOut, setIsLoggingOut] = createSignal(false)

  const toggleTheme = () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light'
    actions.setTheme(newTheme)
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      setShowUserDropdown(false) // Close dropdown
      actions.setUser(null) // Clear user from store immediately
      await logoutAction()
    } catch (error) {
      console.error('Logout failed:', error)
      setIsLoggingOut(false)
      // Restore user state if logout failed
      // The createAsync in dashboard layout will refetch user data
    }
  }

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown())
  }

  // Close dropdown when clicking outside or pressing escape
  onMount(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const userContainer = document.querySelector(`.${styles.userContainer}`)
      if (userContainer && !userContainer.contains(event.target as Node)) {
        setShowUserDropdown(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowUserDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    
    onCleanup(() => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    })
  })

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/' },
    { id: 'profile', label: 'Profile', icon: '👤', path: '/profile' },
    { id: 'analytics', label: 'Analytics', icon: '📈', path: '/analytics' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
  ]

  // Defensive class calculation to prevent style loss during navigation
  const getSidebarClasses = () => {
    const classes = [styles.sidebar]
    
    if (props.mobileOpen) {
      classes.push(styles.sidebarMobileOpen)
    } else if (props.collapsed) {
      classes.push(styles.sidebarCollapsed)
    } else {
      classes.push(styles.sidebarExpanded)
    }
    
    return classes.join(' ')
  }

  return (
    <div 
      class={getSidebarClasses()}
      data-sidebar-state={props.mobileOpen ? 'mobile-open' : props.collapsed ? 'collapsed' : 'expanded'}
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
          <span class={styles.themeIcon}>{state.theme === 'light' ? '🌙' : '☀️'}</span>
          <Show when={props.mobileOpen || !props.collapsed}>
            <span class={styles.themeLabel}>{state.theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </Show>
          
          {/* Tooltip for collapsed desktop state only */}
          <Show when={props.collapsed && !props.mobileOpen}>
            <Portal>
              <div class={styles.tooltip}>
                {state.theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </div>
            </Portal>
          </Show>
        </button>

        {/* User Profile with Dropdown */}
        <Show when={state.user}>
          <div class={styles.userContainer}>
            <button
              onClick={toggleUserDropdown}
              class={styles.userProfile}
              classList={{
                [styles.userProfileMobile]: props.mobileOpen,
                [styles.userProfileCollapsed]: !props.mobileOpen && props.collapsed,
                [styles.userProfileExpanded]: !props.mobileOpen && !props.collapsed,
                [styles.userProfileActive]: showUserDropdown()
              }}
              title={props.collapsed && !props.mobileOpen ? state.user!.username : undefined}
            >
              <div 
                class={styles.userAvatar}
                classList={{
                  [styles.userAvatarSmall]: props.collapsed && !props.mobileOpen,
                  [styles.userAvatarLarge]: !props.collapsed || props.mobileOpen
                }}
              >
                {state.user!.username.substring(0, 2).toUpperCase()}
              </div>
              <Show when={props.mobileOpen || !props.collapsed}>
                <div class={styles.userInfo}>
                  <p class={styles.userName}>{state.user!.username}</p>
                  <p class={styles.userEmail}>{state.user!.email || 'No email provided'}</p>
                </div>
                <div class={styles.userChevron}>
                  <svg 
                    class={styles.chevronIcon} 
                    classList={{ [styles.chevronIconRotated]: showUserDropdown() }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </Show>
            </button>

            {/* User Dropdown Menu */}
            <Show when={showUserDropdown()}>
              <div 
                class={styles.userDropdown}
                classList={{
                  [styles.userDropdownMobile]: props.mobileOpen,
                  [styles.userDropdownCollapsed]: !props.mobileOpen && props.collapsed,
                  [styles.userDropdownExpanded]: !props.mobileOpen && !props.collapsed
                }}
              >
                <div class={styles.dropdownContent}>
                  <div class={styles.dropdownHeader}>
                    <div class={styles.dropdownUserInfo}>
                      <p class={styles.dropdownUserName}>{state.user!.username}</p>
                      <p class={styles.dropdownUserId}>{state.user!.email || 'No email provided'}</p>
                    </div>
                  </div>
                  <div class={styles.dropdownDivider}></div>
                  <button
                    onClick={handleLogout}
                    class={styles.dropdownLogoutButton}
                    disabled={isLoggingOut()}
                  >
                    <Show 
                      when={!isLoggingOut()} 
                      fallback={
                        <>
                          <div class={styles.logoutSpinner}></div>
                          <span class={styles.dropdownLogoutText}>Signing out...</span>
                        </>
                      }
                    >
                      <svg class={styles.dropdownLogoutIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span class={styles.dropdownLogoutText}>Sign Out</span>
                    </Show>
                  </button>
                </div>
              </div>
            </Show>

            {/* Tooltip for collapsed desktop state only */}
            <Show when={props.collapsed && !props.mobileOpen && !showUserDropdown()}>
              <Portal>
                <div class={styles.tooltip}>
                  {state.user!.username}
                </div>
              </Portal>
            </Show>
          </div>
        </Show>
      </div>
    </div>
  )
}