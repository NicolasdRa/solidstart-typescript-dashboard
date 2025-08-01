import { createSignal, Show } from 'solid-js'
import type { JSX } from 'solid-js'

interface DashboardWidgetProps {
  widgetId: string
  title: string
  size: 'small' | 'medium' | 'large'
  onClose: () => void
  children: JSX.Element
}

export default function DashboardWidget(props: DashboardWidgetProps) {
  const [minimized, setMinimized] = createSignal(false)

  const getSizeClasses = () => {
    if (minimized()) return 'col-span-1 row-span-1'
    
    switch (props.size) {
      case 'small':
        return 'col-span-1 row-span-1'
      case 'large':
        return 'col-span-1 lg:col-span-2 row-span-2'
      default:
        return 'col-span-1 row-span-1'
    }
  }

  const toggleMinimize = () => {
    setMinimized(!minimized())
  }


  return (
    <div class={`bg-white rounded-xl shadow-sm border border-secondary-200 hover:shadow-md transition-all duration-200 ${getSizeClasses()}`}>
      {/* Widget Header */}
      <div class="flex items-center justify-between p-4 border-b border-secondary-100">
        <h3 class="font-semibold text-secondary-900 truncate">{props.title}</h3>
        
        <div class="flex items-center gap-1">
          <button
            onClick={toggleMinimize}
            class="p-1.5 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded transition-all duration-200"
            title={minimized() ? 'Maximize' : 'Minimize'}
          >
            <span class="text-sm">{minimized() ? '⬜' : '➖'}</span>
          </button>
          <button
            onClick={props.onClose}
            class="p-1.5 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200"
            title="Close"
          >
            <span class="text-sm">✕</span>
          </button>
        </div>
      </div>

      {/* Widget Content */}
      <Show when={!minimized()}>
        <div class="p-4">
          {props.children}
        </div>
      </Show>
    </div>
  )
}