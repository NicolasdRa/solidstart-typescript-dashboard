import DashboardWidget from '../DashboardWidget'

interface ActivityWidgetProps {
  widgetId: string
  title: string
  size: 'small' | 'medium' | 'large'
  onClose: () => void
}

export default function ActivityWidget(props: ActivityWidgetProps) {
  const activities = [
    { action: 'User registered', user: 'John Doe', time: '2 minutes ago', icon: '👤' },
    { action: 'New order placed', user: 'Jane Smith', time: '5 minutes ago', icon: '🛒' },
    { action: 'Payment received', user: 'Bob Johnson', time: '10 minutes ago', icon: '💳' },
    { action: 'Widget added', user: 'Alice Brown', time: '15 minutes ago', icon: '📊' },
    { action: 'Profile updated', user: 'Mike Wilson', time: '22 minutes ago', icon: '✏️' }
  ]

  return (
    <DashboardWidget {...props}>
      <div class="space-y-3 max-h-64 overflow-y-auto">
        {activities.map((activity) => (
          <div class="flex items-start gap-3 p-2 hover:bg-secondary-50 rounded-lg transition-colors duration-200">
            <div class="w-8 h-8 flex items-center justify-center bg-secondary-100 rounded-full text-sm flex-shrink-0">
              {activity.icon}
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-secondary-900">
                {activity.action}
              </div>
              <div class="text-xs text-secondary-600">
                by {activity.user}
              </div>
              <div class="text-xs text-secondary-500">
                {activity.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardWidget>
  )
}