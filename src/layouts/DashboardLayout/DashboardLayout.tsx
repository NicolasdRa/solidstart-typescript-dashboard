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

  return (
    <div class={styles.container}>
      {/* Sidebar Component */}
      <DashboardSidebar 
        collapsed={appContext.sidebarCollapsed()}
        onToggle={appContext.setSidebarCollapsed}
        mobileOpen={appContext.sidebarOpen()}
        onMobileToggle={appContext.setSidebarOpen}
      />
      
      <div 
        class={`${styles.contentArea} ${
          appContext.sidebarCollapsed() ? styles.contentAreaCollapsed : styles.contentAreaExpanded
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