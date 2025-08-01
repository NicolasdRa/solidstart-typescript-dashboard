import DashboardSidebar from '~/components/DashboardSidebar'
import DashboardHeader from '~/components/DashboardHeader'
import { useAppContext } from '~/contexts/AppContext'

export default function Analytics() {
  const appContext = useAppContext()


  return (
    <div class="min-h-screen bg-secondary-50">
      
      <DashboardSidebar 
        currentPage="analytics" 
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
        <div class="px-8 py-5 text-stable">
          <DashboardHeader 
            title="Analytics" 
            subtitle="View your data insights and metrics"
            showControls={false}
            currentLayout=""
            onLayoutChange={() => {}}
          />

          <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            <div class="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h3 class="text-lg font-semibold text-secondary-900 mb-4">Page Views</h3>
              <div class="text-3xl font-bold text-primary-600">125,430</div>
              <p class="text-sm text-secondary-600 mt-1">+12.5% from last month</p>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h3 class="text-lg font-semibold text-secondary-900 mb-4">Users</h3>
              <div class="text-3xl font-bold text-primary-600">24,532</div>
              <p class="text-sm text-secondary-600 mt-1">+8.2% from last month</p>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h3 class="text-lg font-semibold text-secondary-900 mb-4">Conversion Rate</h3>
              <div class="text-3xl font-bold text-primary-600">3.24%</div>
              <p class="text-sm text-red-600 mt-1">-2.1% from last month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}