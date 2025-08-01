import { onMount, ErrorBoundary } from 'solid-js'
import DashboardSidebar from '~/components/DashboardSidebar'
import DashboardHeader from '~/components/DashboardHeader'
import ProfileController from '~/components/ProfileController'
import { useAppContext } from '~/contexts/AppContext'

export default function Profile() {
  const appContext = useAppContext()

  onMount(() => {
    console.log('Profile page loaded')
  })


  return (
    <div class="min-h-screen bg-secondary-50">
      
      {/* Sidebar Component */}
      <DashboardSidebar 
        currentPage="profile" 
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
          {/* Profile Header Component */}
          <DashboardHeader 
            title="Profile Settings" 
            subtitle="Manage your account and preferences"
            showControls={false}
            currentLayout=""
            onLayoutChange={() => {}}
          />

          {/* Profile Controller handles profile widgets */}
          <ErrorBoundary 
            fallback={(_, reset) => (
              <div class="text-center py-12">
                <div class="text-5xl mb-4">👤</div>
                <h2 class="text-xl font-bold text-red-600 mb-4">Profile Error</h2>
                <p class="text-secondary-600 mb-6">
                  Unable to load profile information.
                </p>
                <button 
                  onClick={reset}
                  class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Retry
                </button>
              </div>
            )}
          >
            <ProfileController />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}