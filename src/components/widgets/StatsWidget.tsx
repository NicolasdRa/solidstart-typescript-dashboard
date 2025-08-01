import DashboardWidget from '../DashboardWidget'

interface StatsWidgetProps {
  widgetId: string
  title: string
  size: 'small' | 'medium' | 'large'
  onClose: () => void
}

export default function StatsWidget(props: StatsWidgetProps) {
  const stats = [
    { label: 'Total Users', value: '24,532', change: '+12%', changeType: 'positive' },
    { label: 'Revenue', value: '$127,430', change: '+8.2%', changeType: 'positive' },
    { label: 'Conversion Rate', value: '3.24%', change: '-2.1%', changeType: 'negative' },
    { label: 'Avg. Session', value: '4m 32s', change: '+5.3%', changeType: 'positive' }
  ]

  return (
    <DashboardWidget {...props}>
      <div class="space-y-4">
        {stats.map((stat) => (
          <div class="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
            <div>
              <p class="text-sm text-secondary-600">{stat.label}</p>
              <p class="text-xl font-bold text-secondary-900">{stat.value}</p>
            </div>
            <div class={`text-sm font-medium ${
              stat.changeType === 'positive' 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>
    </DashboardWidget>
  )
}