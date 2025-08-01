import { createSignal, onMount, onCleanup } from 'solid-js'
import DashboardWidget from '../DashboardWidget'

interface ClockWidgetProps {
  widgetId: string
  title: string
  size: 'small' | 'medium' | 'large'
  onClose: () => void
}

export default function ClockWidget(props: ClockWidgetProps) {
  const [time, setTime] = createSignal(new Date())
  let interval: number

  onMount(() => {
    interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
  })

  onCleanup(() => {
    if (interval) {
      clearInterval(interval)
    }
  })

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <DashboardWidget {...props}>
      <div class="text-center space-y-3">
        <div class="text-3xl font-mono font-bold text-primary-600">
          {formatTime(time())}
        </div>
        <div class="text-sm text-secondary-600">
          {formatDate(time())}
        </div>
        <div class="text-xs text-secondary-500">
          Local Time
        </div>
      </div>
    </DashboardWidget>
  )
}