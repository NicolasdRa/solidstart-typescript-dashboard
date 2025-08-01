import { useAppContext } from '../contexts/AppContext'
import { Show } from 'solid-js'
import { Portal } from 'solid-js/web'

interface DashboardHeaderProps {
  title: string
  subtitle: string
  showControls: boolean
  currentLayout: string
  onLayoutChange: (layout: string) => void
}

export default function DashboardHeader(props: DashboardHeaderProps) {
  const appContext = useAppContext()

  const handleAddWidget = () => {
    appContext.setShowWidgetModal(true)
  }

  const handleLayoutChange = (layout: string) => {
    props.onLayoutChange(layout)
  }

  const handleClearLayout = () => {
    if (confirm('Remove all widgets from the dashboard?')) {
      appContext.clearLayout()
    }
  }

  const handleResetLayout = () => {
    if (confirm('Reset dashboard to default layout?')) {
      appContext.resetLayout()
    }
  }

  return (
    <div class="mb-8">
      {/* Header */}
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div class="flex items-center gap-4">
          {/* Mobile hamburger menu */}
          <button
            onClick={() => appContext.setSidebarOpen(true)}
            class="lg:hidden p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-all duration-200"
            title="Open sidebar"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div>
            <h1 class="text-3xl font-bold text-secondary-900 mb-2">{props.title}</h1>
            <p class="text-secondary-600">{props.subtitle}</p>
          </div>
        </div>
        
        <Show when={props.showControls}>
          <div class="flex flex-wrap items-center gap-3">
            {/* Layout Controls */}
            <div class="flex items-center gap-2 bg-white rounded-lg border border-secondary-200 p-1">
              <button
                onClick={() => handleLayoutChange('grid')}
                class={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  props.currentLayout === 'grid'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                }`}
                title="Grid Layout"
              >
                <span class="block lg:hidden">⊞</span>
                <span class="hidden lg:block">Grid</span>
              </button>
              <button
                onClick={() => handleLayoutChange('list')}
                class={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  props.currentLayout === 'list'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                }`}
                title="List Layout"
              >
                <span class="block lg:hidden">☰</span>
                <span class="hidden lg:block">List</span>
              </button>
              <button
                onClick={() => handleLayoutChange('masonry')}
                class={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  props.currentLayout === 'masonry'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                }`}
                title="Masonry Layout"
              >
                <span class="block lg:hidden">⊡</span>
                <span class="hidden lg:block">Masonry</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div class="flex items-center gap-2">
              <button
                onClick={handleAddWidget}
                class="px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 flex items-center gap-2"
              >
                <span class="text-lg">+</span>
                <span class="hidden sm:inline">Add Widget</span>
              </button>
              
              <div class="relative group">
                <button class="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-all duration-200">
                  <span class="text-xl">⋮</span>
                </button>
                
                {/* Dropdown Menu */}
                <Portal>
                  <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <button
                    onClick={handleResetLayout}
                    class="w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors duration-200"
                  >
                    Reset Layout
                  </button>
                  <button
                    onClick={handleClearLayout}
                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    Clear All Widgets
                  </button>
                  </div>
                </Portal>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </div>
  )
}