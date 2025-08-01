import { createSignal, onMount, ErrorBoundary } from 'solid-js'
import DashboardSidebar from "~/components/DashboardSidebar";
import DashboardHeader from "~/components/DashboardHeader";
import DashboardController from "~/components/DashboardController";
import { useAppContext } from "~/contexts/AppContext";

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
    <div class="min-h-screen bg-secondary-50">
      
      {/* Sidebar Component */}
      <DashboardSidebar 
        currentPage="dashboard" 
        collapsed={appContext.sidebarCollapsed()}
        onToggle={appContext.setSidebarCollapsed}
        mobileOpen={appContext.sidebarOpen()}
        onMobileToggle={appContext.setSidebarOpen}
      />
      
      <div 
        class={`sidebar-transition min-h-screen ${
          appContext.sidebarCollapsed() ? 'ml-0 lg:ml-16' : 'ml-0 lg:ml-72'
        }`}
      >        
        <div class="px-8 py-5 overflow-y-auto h-screen text-stable">
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
              <div class="text-center py-12">
                <div class="text-6xl mb-4">🔧</div>
                <h2 class="text-2xl font-bold text-red-600 mb-4">Dashboard Error</h2>
                <p class="text-secondary-600 mb-6">
                  The dashboard encountered an error and couldn't load properly.
                </p>
                <div class="space-y-3">
                  <button 
                    onClick={reset}
                    class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                  >
                    Reload Dashboard
                  </button>
                  <p class="text-sm text-secondary-500">
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
  )
}