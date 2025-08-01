import { createSignal, Index } from 'solid-js'
import DashboardWidget from '../DashboardWidget'

interface CalendarWidgetProps {
  widgetId: string
  title: string
  size: 'small' | 'medium' | 'large'
  onClose: () => void
}

export default function CalendarWidget(props: CalendarWidgetProps) {
  const [currentDate] = createSignal(new Date())
  
  const events = [
    { date: new Date().getDate(), title: 'Team Meeting', time: '10:00 AM' },
    { date: new Date().getDate() + 1, title: 'Client Call', time: '2:00 PM' },
    { date: new Date().getDate() + 2, title: 'Project Review', time: '11:00 AM' }
  ]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isToday = (day: number) => {
    const today = new Date()
    return day === today.getDate() && 
           currentDate().getMonth() === today.getMonth() && 
           currentDate().getFullYear() === today.getFullYear()
  }

  const hasEvent = (day: number) => {
    return events.some(event => event.date === day)
  }

  return (
    <DashboardWidget {...props}>
      <div class="space-y-4">
        {/* Calendar Header */}
        <div class="text-center">
          <h4 class="text-lg font-semibold text-secondary-900">
            {currentDate().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h4>
        </div>

        {/* Mini Calendar */}
        <div class="grid grid-cols-7 gap-1 text-xs">
          <Index each={['S', 'M', 'T', 'W', 'T', 'F', 'S']}>
            {(day) => (
              <div class="text-center p-1 font-medium text-secondary-600">{day()}</div>
            )}
          </Index>
          
          {/* Empty cells for days before month starts */}
          <Index each={Array.from({ length: getFirstDayOfMonth(currentDate()) })}>
            {() => <div class="p-1"></div>}
          </Index>
          
          {/* Days of the month */}
          <Index each={Array.from({ length: getDaysInMonth(currentDate()) })}>
            {(_, index) => {
              const day = index + 1
              return (
                <div 
                  class={`p-1 text-center rounded cursor-pointer transition-colors duration-200 ${
                    isToday(day) 
                      ? 'bg-primary-600 text-white' 
                      : hasEvent(day)
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'hover:bg-secondary-100'
                  }`}
                >
                  {day}
                </div>
              )
            }}
          </Index>
        </div>

        {/* Upcoming Events */}
        <div>
          <h5 class="text-sm font-medium text-secondary-700 mb-2">Upcoming</h5>
          <div class="space-y-2">
            <Index each={events.slice(0, 2)}>
              {(event) => (
                <div class="flex items-center gap-2 text-xs">
                  <div class="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <div class="flex-1">
                    <div class="font-medium text-secondary-900">{event().title}</div>
                    <div class="text-secondary-600">{event().time}</div>
                  </div>
                </div>
              )}
            </Index>
          </div>
        </div>
      </div>
    </DashboardWidget>
  )
}