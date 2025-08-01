import { JSX } from 'solid-js'
import DashboardSidebar from '~/components/Sidebar/Sidebar'
import DashboardHeader from '~/components/Header/Header'
import { useAppContext } from '~/contexts/AppContext'
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
  const appContext = useAppContext()
  
  // Use stable layout during hydration to prevent shifts
  const isCollapsed = appContext.isHydrated() ? appContext.sidebarCollapsed() : false
  const isMobileOpen = appContext.isHydrated() ? appContext.sidebarOpen() : false

  return (
    <div class={styles.container} data-hydrated={appContext.isHydrated()}>
      {/* Sidebar Component */}
      <DashboardSidebar 
        collapsed={isCollapsed}
        onToggle={appContext.setSidebarCollapsed}
        mobileOpen={isMobileOpen}
        onMobileToggle={appContext.setSidebarOpen}
      />
      
      <div 
        class={`${styles.contentArea} ${
          isCollapsed ? styles.contentAreaCollapsed : styles.contentAreaExpanded
        }`}
      >        
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