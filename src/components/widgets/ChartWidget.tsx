import { createSignal } from 'solid-js'
import DashboardWidget from '../DashboardWidget'

interface ChartWidgetProps {
  widgetId: string
  title: string
  size: 'small' | 'medium' | 'large'
  onClose: () => void
}

export default function ChartWidget(props: ChartWidgetProps) {
  const [data] = createSignal([
    { month: 'Jan', value: 400 },
    { month: 'Feb', value: 300 },
    { month: 'Mar', value: 500 },
    { month: 'Apr', value: 350 },
    { month: 'May', value: 600 },
    { month: 'Jun', value: 450 }
  ])

  const maxValue = () => Math.max(...data().map(d => d.value))

  return (
    <DashboardWidget {...props}>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-medium text-secondary-700">Monthly Analytics</h4>
          <span class="text-xs text-secondary-500">Last 6 months</span>
        </div>
        
        <div class="h-32 flex items-end justify-between gap-2">
          {data().map((item) => (
            <div class="flex flex-col items-center gap-2 flex-1">
              <div class="w-full bg-secondary-200 rounded-t-sm relative overflow-hidden">
                <div
                  class="bg-primary-500 rounded-t-sm transition-all duration-500"
                  style={{
                    height: `${(item.value / maxValue()) * 100}px`
                  }}
                />
              </div>
              <span class="text-xs text-secondary-600">{item.month}</span>
            </div>
          ))}
        </div>
        
        <div class="text-center">
          <span class="text-sm text-secondary-600">Average: </span>
          <span class="font-medium text-secondary-900">
            {Math.round(data().reduce((sum, d) => sum + d.value, 0) / data().length)}
          </span>
        </div>
      </div>
    </DashboardWidget>
  )
}