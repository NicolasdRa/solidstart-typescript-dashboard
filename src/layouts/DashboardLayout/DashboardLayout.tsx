import { JSX } from 'solid-js'
import DashboardSidebar from '~/components/Sidebar/Sidebar'
import DashboardHeader from '~/components/Header/Header'
import { useAppStore } from '~/stores/appStore'
import styles from './DashboardLayout.module.css'

interface DashboardLayoutProps {
  children: JSX.Element
  title?: string
  subtitle?: string
  showControls?: boolean
  currentLayout?: string
  onLayoutChange?: (layout: string) => void
}

export default function DashboardLayout(props: DashboardLayoutProps) {
  const { state, actions } = useAppStore()

  return (
    <div 
      class={styles.container} 
      data-hydrated={state.isHydrated}
      classList={{
        [styles.containerCollapsed]: state.isHydrated && state.sidebarCollapsed,
        [styles.containerExpanded]: !state.isHydrated || !state.sidebarCollapsed
      }}
    >
      {/* Sidebar Component */}
      <DashboardSidebar 
        collapsed={state.isHydrated ? state.sidebarCollapsed : false}
        onToggle={actions.setSidebarCollapsed}
        mobileOpen={state.isHydrated ? state.sidebarOpen : false}
        onMobileToggle={actions.setSidebarOpen}
      />
      
      <div class={styles.contentArea}>
        <div class={styles.innerContent}>
          {/* Dashboard Header Component */}
          <DashboardHeader 
            title={props.title || 'Dashboard'} 
            subtitle={props.subtitle || 'Welcome to your workspace'}
            showControls={props.showControls ?? false}
            currentLayout={props.currentLayout || ''}
            onLayoutChange={props.onLayoutChange || (() => {})}
          />

          {/* Page Content */}
          {props.children}
        </div>
      </div>
    </div>
  )
}