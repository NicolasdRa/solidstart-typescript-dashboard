import { createSignal, onMount, For, Show, Index, ErrorBoundary } from 'solid-js'
import { Dynamic, Portal } from 'solid-js/web'
import { useAppContext } from '../contexts/AppContext'
import DashboardWidget from './DashboardWidget'
import styles from './DashboardController.module.css'
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
        return `${styles.mainContainer} ${styles.layoutList}`
      case 'masonry':
        return `${styles.mainContainer} ${styles.layoutMasonry}`
      default:
        return `${styles.mainContainer} ${styles.layoutGrid}`
    }
  }

  return (
    <>
      <main class={getLayoutClasses()}>
        <For each={Array.from(widgets().values())}>
          {(config) => (
            <div class={`${styles.widgetContainer} ${props.layout === 'list' ? styles.widgetContainerList : ''}`}>
              <ErrorBoundary 
                fallback={(err, reset) => (
                  <DashboardWidget 
                    widgetId={config.id}
                    title={config.title}
                    size={config.size}
                    onClose={() => removeWidget(config.id)}
                  >
                    <div class={styles.errorContainer}>
                      <div class={styles.errorIcon}>⚠️</div>
                      <h3 class={styles.errorTitle}>Widget Error</h3>
                      <p class={styles.errorMessage}>{err.message}</p>
                      <button 
                        onClick={reset}
                        class={styles.errorButton}
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
            class={styles.modalOverlay}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                appContext.setShowWidgetModal(false)
              }
            }}
          >
            <div class={styles.modalContainer}>
              <div class={styles.modalHeader}>
                <h2 class={styles.modalTitle}>Add Widget</h2>
                <button
                  onClick={() => appContext.setShowWidgetModal(false)}
                  class={styles.modalCloseButton}
                >
                  ×
                </button>
              </div>
              <div class={styles.modalContent}>
                <div class={styles.widgetGrid}>
                  <Index each={widgetTypes}>
                    {(widget) => (
                      <button
                        onClick={() => addWidget(widget().type)}
                        class={styles.widgetTypeButton}
                      >
                        <div class={styles.widgetTypeIcon}>
                          {widget().icon}
                        </div>
                        <span class={styles.widgetTypeName}>{widget().name}</span>
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