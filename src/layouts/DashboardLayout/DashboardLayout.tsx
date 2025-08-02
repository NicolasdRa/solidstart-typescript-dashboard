import { JSX, createSignal, onMount } from 'solid-js'
import { isServer } from 'solid-js/web'
import Sidebar from '~/components/Sidebar/Sidebar'
import Header from '~/components/Header/Header'
import { useAppStore } from '~/stores/appStore'
import styles from './DashboardLayout.module.css'

interface DashboardLayoutProps {
  children: JSX.Element
}

export default function DashboardLayout(props: DashboardLayoutProps) {
  const { state, actions } = useAppStore()
  const [mounted, setMounted] = createSignal(false)

  onMount(() => {
    setMounted(true)
  })

  return (
    <div 
      class={styles.container} 
      classList={{
        [styles.containerCollapsed]: mounted() && state.sidebarCollapsed,
        [styles.containerExpanded]: !mounted() || !state.sidebarCollapsed
      }}
    >
      {/* Sidebar Component */}
      <Sidebar 
        collapsed={mounted() ? state.sidebarCollapsed : false}
        onToggle={actions.setSidebarCollapsed}
        mobileOpen={mounted() ? state.sidebarOpen : false}
        onMobileToggle={actions.setSidebarOpen}
      />
      
      <div class={styles.contentArea}>
        {/* Fixed Dashboard Header Component */}
        <div class={styles.headerSection}>
          <Header />
        </div>

        {/* Scrollable Page Content */}
        <div class={styles.innerContent}>
          {props.children}
        </div>
      </div>
    </div>
  )
}