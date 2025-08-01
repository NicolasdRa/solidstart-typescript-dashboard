import { createSignal, onMount } from 'solid-js'
import SEO from '~/components/SEO/SEO'
import DashboardErrorBoundary from '~/components/ErrorBoundary/DashboardErrorBoundary'
import DashboardContent from "~/components/DashboardContent/DashboardContent";
import DashboardLayout from "~/layouts/DashboardLayout/DashboardLayout";

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
      <SEO 
        title="Dashboard"
        description="Modern dashboard with customizable widgets, analytics, and layout options. Built with SolidJS and TailwindCSS."
        path="/"
      />
      
      <DashboardLayout 
        title="Dashboard"
        subtitle="Welcome to your personalized workspace"
        showControls={true}
        currentLayout={currentLayout()}
        onLayoutChange={handleLayoutChange}
      >
        <DashboardErrorBoundary
          fallbackIcon="🔧"
          fallbackTitle="Dashboard Error"
          fallbackMessage="The dashboard encountered an error and couldn't load properly."
        >
          <DashboardContent 
            layout={currentLayout()}
          />
        </DashboardErrorBoundary>
      </DashboardLayout>
    </>
  )
}