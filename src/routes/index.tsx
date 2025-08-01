import { createSignal, onMount, ErrorBoundary } from 'solid-js'
import { Title, Meta } from '@solidjs/meta'
import DashboardSidebar from "~/components/DashboardSidebar";
import DashboardHeader from "~/components/DashboardHeader";
import DashboardController from "~/components/DashboardController";
import { useAppContext } from "~/contexts/AppContext";
import styles from './index.module.css';

export default function Index() {
  const appContext = useAppContext()
  const [currentLayout, setCurrentLayout] = createSignal('grid')
  const [isClient, setIsClient] = createSignal(false)

  onMount(() => {
    setIsClient(true)
    console.log('Vite + SolidJS + TypeScript Dashboard initialized')
    
    // Load saved layout preference
    if (typeof window !== 'undefined') {
      const savedLayout = localStorage.getItem('dashboardLayout') || 'grid'
      setCurrentLayout(savedLayout)
    }
  })

  const handleLayoutChange = (layout: string) => {
    setCurrentLayout(layout)
    if (isClient() && typeof window !== 'undefined') {
      localStorage.setItem('dashboardLayout', layout)
    }
  }

  return (
    <>
      <Title>Dashboard - SolidStart Dashboard</Title>
      <Meta name="description" content="Modern dashboard with customizable widgets, analytics, and layout options. Built with SolidJS and TailwindCSS." />
      <Meta property="og:title" content="Dashboard - SolidStart Dashboard" />
      <Meta property="og:description" content="Modern dashboard with customizable widgets, analytics, and layout options." />
      <Meta property="og:type" content="website" />
      <Meta name="twitter:card" content="summary" />
      <Meta name="twitter:title" content="Dashboard - SolidStart Dashboard" />
      <Meta name="twitter:description" content="Modern dashboard with customizable widgets, analytics, and layout options." />
      
      <div class={styles.container}>
      
      {/* Sidebar Component */}
      <DashboardSidebar 
        currentPage="dashboard" 
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
            title="Dashboard" 
            subtitle="Welcome to your personalized workspace"
            showControls={true}
            currentLayout={currentLayout()}
            onLayoutChange={handleLayoutChange}
          />

          {/* Dashboard Controller handles widgets */}
          <ErrorBoundary 
            fallback={(err, reset) => (
              <div class={styles.errorContainer}>
                <div class={styles.errorIcon}>🔧</div>
                <h2 class={styles.errorTitle}>Dashboard Error</h2>
                <p class={styles.errorMessage}>
                  The dashboard encountered an error and couldn't load properly.
                </p>
                <div class={styles.errorDetails}>
                  <button 
                    onClick={reset}
                    class={styles.errorButton}
                  >
                    Reload Dashboard
                  </button>
                  <p class={styles.errorText}>
                    Error: {err.message}
                  </p>
                </div>
              </div>
            )}
          >
            <DashboardController 
              layout={currentLayout()}
            />
          </ErrorBoundary>
        </div>
      </div>
      </div>
    </>
  )
}