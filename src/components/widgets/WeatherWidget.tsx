import { createSignal } from 'solid-js'
import DashboardWidget from '../DashboardWidget'


interface WeatherWidgetProps {
  widgetId: string
  title: string
  size: 'small' | 'medium' | 'large'
  onClose: () => void
}

export default function WeatherWidget(props: WeatherWidgetProps) {
  const [weather] = createSignal({
    location: 'San Francisco, CA',
    temperature: 72,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 8,
    icon: '⛅'
  })

  return (
    <DashboardWidget {...props}>
      <div class="text-center space-y-3">
        <div class="text-4xl mb-2">{weather().icon}</div>
        <div>
          <div class="text-2xl font-bold text-secondary-900">
            {weather().temperature}°F
          </div>
          <div class="text-sm text-secondary-600">{weather().condition}</div>
          <div class="text-xs text-secondary-500">{weather().location}</div>
        </div>
        
        <div class="flex justify-between text-xs text-secondary-600 mt-4 pt-3 border-t border-secondary-100">
          <div>
            <div class="font-medium">Humidity</div>
            <div>{weather().humidity}%</div>
          </div>
          <div>
            <div class="font-medium">Wind</div>
            <div>{weather().windSpeed} mph</div>
          </div>
        </div>
      </div>
    </DashboardWidget>
  )
}