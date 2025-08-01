import DashboardSidebar from '~/components/DashboardSidebar'
import DashboardHeader from '~/components/DashboardHeader'
import { useAppContext } from '~/contexts/AppContext'

export default function Settings() {
  const appContext = useAppContext()


  return (
    <div class="min-h-screen bg-secondary-50">
      
      <DashboardSidebar 
        currentPage="settings" 
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
            title="Settings" 
            subtitle="Configure your application settings"
            showControls={false}
            currentLayout=""
            onLayoutChange={() => {}}
          />

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div class="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h3 class="text-lg font-semibold text-secondary-900 mb-4">General Settings</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-1">Application Name</label>
                  <input
                    type="text"
                    value="My Dashboard"
                    class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-1">Default Language</label>
                  <select class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h3 class="text-lg font-semibold text-secondary-900 mb-4">Advanced Settings</h3>
              <div class="space-y-4">
                <label class="flex items-center justify-between">
                  <span class="text-sm text-secondary-700">Enable developer mode</span>
                  <input type="checkbox" class="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500" />
                </label>
                <label class="flex items-center justify-between">
                  <span class="text-sm text-secondary-700">Show performance metrics</span>
                  <input type="checkbox" class="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500" />
                </label>
                <label class="flex items-center justify-between">
                  <span class="text-sm text-secondary-700">Enable experimental features</span>
                  <input type="checkbox" class="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}