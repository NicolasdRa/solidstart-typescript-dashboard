import { createSignal, onMount, ErrorBoundary } from 'solid-js'
import { Title, Meta } from '@solidjs/meta'
import DashboardContent from "~/components/DashboardContent/DashboardContent";
import DashboardLayout from "~/layouts/DashboardLayout/DashboardLayout";
import styles from './index.module.css';

export default function Index() {
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
      
      <DashboardLayout 
        title="Dashboard"
        subtitle="Welcome to your personalized workspace"
        showControls={true}
        currentLayout={currentLayout()}
        onLayoutChange={handleLayoutChange}
      >
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
          <DashboardContent 
            layout={currentLayout()}
          />
        </ErrorBoundary>
      </DashboardLayout>
    </>
  )
}