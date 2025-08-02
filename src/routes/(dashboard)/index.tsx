import { onMount } from 'solid-js'
import SEO from '~/components/SEO/SEO'
import DashboardErrorBoundary from '~/components/ErrorBoundary/DashboardErrorBoundary'
import DashboardContent from "~/components/DashboardContent/DashboardContent"
import { useAppStore } from '~/stores/appStore'

export default function Index() {
  const { state } = useAppStore()

  onMount(() => {
    console.log('Vite + SolidJS + TypeScript Dashboard initialized')
  })

  return (
    <>
      <SEO 
        title="Dashboard"
        description="Modern dashboard with customizable widgets, analytics, and layout options. Built with SolidJS and TailwindCSS."
        path="/"
      />
      
      <DashboardErrorBoundary
        fallbackIcon="🔧"
        fallbackTitle="Dashboard Error"
        fallbackMessage="The dashboard encountered an error and couldn't load properly."
      >
        <DashboardContent 
          layout={state.dashboardLayout}
        />
      </DashboardErrorBoundary>
    </>
  )
}