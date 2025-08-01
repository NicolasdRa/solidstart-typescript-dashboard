import { createSignal, onMount, For, Show, Index, ErrorBoundary } from 'solid-js'
import { Dynamic, Portal } from 'solid-js/web'
import { useAppContext } from '../contexts/AppContext'
import DashboardWidget from './DashboardWidget'
import StatsWidget from './widgets/StatsWidget'
import ActivityWidget from './widgets/ActivityWidget'
import CalendarWidget from './widgets/CalendarWidget'
import ChartWidget from './widgets/ChartWidget'
import ClockWidget from './widgets/ClockWidget'
import ModelViewerWidget from './widgets/ModelViewerWidget'
import NotesWidget from './widgets/NotesWidget'
import TodoWidget from './widgets/TodoWidget'
import WeatherWidget from './widgets/WeatherWidget'
import { WidgetConfig, WidgetType } from '~/types/widget'

interface DashboardControllerProps {
  layout: string
}

export default function DashboardController(props: DashboardControllerProps) {
  const appContext = useAppContext()
  const [widgets, setWidgets] = createSignal<Map<string, WidgetConfig>>(new Map())
  const [widgetIdCounter, setWidgetIdCounter] = createSignal(1)

  // Widget component map for Dynamic rendering
  const widgetComponents = {
    'stats-widget': StatsWidget,
    'notes-widget': NotesWidget,
    'clock-widget': ClockWidget,
    'chart-widget': ChartWidget,
    'weather-widget': WeatherWidget,
    'activity-widget': ActivityWidget,
    'calendar-widget': CalendarWidget,
    'todo-widget': TodoWidget,
    'model-viewer-widget': ModelViewerWidget
  }

  const widgetTypes: WidgetType[] = [
    { type: 'stats-widget', icon: '📊', name: 'Statistics' },
    { type: 'chart-widget', icon: '📈', name: 'Chart' },
    { type: 'activity-widget', icon: '📋', name: 'Activity' },
    { type: 'calendar-widget', icon: '📅', name: 'Calendar' },
    { type: 'weather-widget', icon: '🌤️', name: 'Weather' },
    { type: 'clock-widget', icon: '🕒', name: 'Clock' },
    { type: 'notes-widget', icon: '📝', name: 'Notes' },
    { type: 'todo-widget', icon: '✅', name: 'Todo List' },
    { type: 'model-viewer-widget', icon: '🚀', name: 'Model Viewer' }
  ]

  onMount(() => {
    console.log('Dashboard Controller: Initializing widget system...')
    loadSavedWidgets()
    
    // Register layout action callbacks with context
    appContext.onClearLayout(() => clearLayout())
    appContext.onResetLayout(() => resetLayout())
    
    console.log('Dashboard Controller: Initialization complete')
  })

  const generateWidgetId = () => {
    const id = `widget-${Date.now()}-${widgetIdCounter()}`
    setWidgetIdCounter(prev => prev + 1)
    return id
  }

  const addWidget = (type: string, config: Partial<WidgetConfig> = {}) => {
    console.log('Dashboard Controller: Adding widget of type:', type)
    const widgetId = config.id || generateWidgetId()
    const widgetConfig: WidgetConfig = {
      id: widgetId,
      type: type,
      title: config.title || getDefaultTitle(type),
      position: config.position || { x: 0, y: 0 },
      size: config.size || getDefaultSize(type),
      ...config
    }
    
    console.log('Dashboard Controller: Widget config:', widgetConfig)
    setWidgets(prev => {
      const newMap = new Map(prev)
      newMap.set(widgetId, widgetConfig)
      return newMap
    })
    saveWidgets()
    appContext.setShowWidgetModal(false)
  }

  const removeWidget = (widgetId: string) => {
    console.log('Dashboard Controller: Removing widget', widgetId)
    setWidgets(prev => {
      const newMap = new Map(prev)
      const deleted = newMap.delete(widgetId)
      console.log('Dashboard Controller: Widget deleted:', deleted, 'Widgets count:', newMap.size)
      return newMap
    })
    saveWidgets()
  }

  const getDefaultTitle = (type: string): string => {
    const titles: Record<string, string> = {
      'stats-widget': 'Statistics',
      'notes-widget': 'Notes',
      'clock-widget': 'Clock',
      'chart-widget': 'Analytics Chart',
      'weather-widget': 'Weather',
      'calendar-widget': 'Calendar',
      'todo-widget': 'Todo List',
      'activity-widget': 'Recent Activity',
      'model-viewer-widget': '3D Model Viewer'
    }
    return titles[type] || 'Widget'
  }

  const getDefaultSize = (type: string): 'small' | 'medium' | 'large' => {
    const sizes: Record<string, 'small' | 'medium' | 'large'> = {
      'stats-widget': 'large',
      'notes-widget': 'medium',
      'clock-widget': 'small',
      'chart-widget': 'large',
      'weather-widget': 'small',
      'calendar-widget': 'medium',
      'todo-widget': 'medium',
      'activity-widget': 'medium',
      'model-viewer-widget': 'large'
    }
    return sizes[type] || 'medium'
  }

  const saveWidgets = () => {
    if (typeof window !== 'undefined') {
      const widgetData = Array.from(widgets().values())
      localStorage.setItem('dashboardWidgets', JSON.stringify(widgetData))
    }
  }

  const loadSavedWidgets = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboardWidgets')
      if (saved) {
        try {
          const widgetData = JSON.parse(saved) as WidgetConfig[]
          const newMap = new Map<string, WidgetConfig>()
          widgetData.forEach(config => {
            newMap.set(config.id, config)
          })
          setWidgets(newMap)
          return
        } catch (e) {
          console.error('Failed to load saved widgets:', e)
        }
      }
    }
    // Fall back to default widgets
    loadDefaultWidgets()
  }

  const loadDefaultWidgets = () => {
    const defaultWidgets = [
      { type: 'stats-widget', title: 'Statistics Overview' },
      { type: 'notes-widget', title: 'Quick Notes' },
      { type: 'clock-widget', title: 'Current Time' }
    ]
    
    defaultWidgets.forEach(widget => {
      const widgetId = generateWidgetId()
      const widgetConfig: WidgetConfig = {
        id: widgetId,
        position: { x: 0, y: 0 },
        size: getDefaultSize(widget.type),
        ...widget,
        title: widget.title || getDefaultTitle(widget.type)
      }
      setWidgets(prev => {
        const newMap = new Map(prev)
        newMap.set(widgetId, widgetConfig)
        return newMap
      })
    })
    saveWidgets()
  }

  const clearLayout = () => {
    setWidgets(new Map())
    saveWidgets()
  }

  const resetLayout = () => {
    clearLayout()
    setTimeout(() => {
      loadDefaultWidgets()
    }, 100)
  }

  const renderWidget = (config: WidgetConfig) => {
    const commonProps = {
      widgetId: config.id,
      title: config.title,
      size: config.size,
      onClose: () => removeWidget(config.id)
    }

    const WidgetComponent = widgetComponents[config.type as keyof typeof widgetComponents]
    
    if (!WidgetComponent) {
      return <DashboardWidget {...commonProps}>Unknown widget type</DashboardWidget>
    }

    // Handle special case for ModelViewerWidget with additional props
    if (config.type === 'model-viewer-widget') {
      return (
        <Dynamic 
          component={WidgetComponent}
          {...commonProps}
          modelSrc={config.modelSrc || '/shared-assets/models/NeilArmstrong_Complete.glb'}
          modelName={config.modelName || 'Neil Armstrong Space Suit'}
          modelDescription={config.modelDescription || 'Interactive 3D model of Neil Armstrong\'s space suit from the Apollo 11 mission.'}
          environmentImage={config.environmentImage || ''}
          shadowIntensity={config.shadowIntensity || '1'}
        />
      )
    }

    return <Dynamic component={WidgetComponent} {...commonProps} />
  }

  const getLayoutClasses = () => {
    switch (props.layout) {
      case 'list':
        return 'flex flex-col gap-4'
      case 'masonry':
        return 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5'
      default:
        return 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5'
    }
  }

  return (
    <>
      <main class={`pb-5 transition-all duration-300 ${getLayoutClasses()}`}>
        <For each={Array.from(widgets().values())}>
          {(config) => (
            <div class={`widget-container ${props.layout === 'list' ? 'w-full' : ''}`}>
              <ErrorBoundary 
                fallback={(err, reset) => (
                  <DashboardWidget 
                    widgetId={config.id}
                    title={config.title}
                    size={config.size}
                    onClose={() => removeWidget(config.id)}
                  >
                    <div class="text-center py-8">
                      <div class="text-4xl mb-3">⚠️</div>
                      <h3 class="text-lg font-semibold text-red-600 mb-2">Widget Error</h3>
                      <p class="text-sm text-red-500 mb-4">{err.message}</p>
                      <button 
                        onClick={reset}
                        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                      >
                        Try Again
                      </button>
                    </div>
                  </DashboardWidget>
                )}
              >
                {renderWidget(config)}
              </ErrorBoundary>
            </div>
          )}
        </For>
      </main>

      {/* Widget Addition Modal */}
      <Show when={appContext.showWidgetModal()}>
        <Portal>
          <div 
            class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                appContext.setShowWidgetModal(false)
              }
            }}
          >
            <div class="bg-white rounded-2xl w-11/12 max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl animate-slide-in">
              <div class="flex justify-between items-center p-6 border-b border-secondary-200">
                <h2 class="text-2xl font-semibold text-secondary-900">Add Widget</h2>
                <button
                  onClick={() => appContext.setShowWidgetModal(false)}
                  class="text-secondary-400 hover:text-secondary-600 text-2xl transition-colors duration-200"
                >
                  ×
                </button>
              </div>
              <div class="p-8 overflow-y-auto max-h-96">
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Index each={widgetTypes}>
                    {(widget) => (
                      <button
                        onClick={() => addWidget(widget().type)}
                        class="flex flex-col items-center gap-3 p-6 border-2 border-secondary-200 rounded-xl bg-secondary-50 hover:border-primary-600 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                      >
                        <div class="text-4xl w-16 h-16 flex items-center justify-center bg-white rounded-xl border border-secondary-200">
                          {widget().icon}
                        </div>
                        <span class="text-sm font-medium text-secondary-900">{widget().name}</span>
                      </button>
                    )}
                  </Index>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      </Show>
    </>
  )
}