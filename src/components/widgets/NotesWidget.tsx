import { createSignal, onMount } from 'solid-js'
import DashboardWidget from '../DashboardWidget'

interface NotesWidgetProps {
  widgetId: string
  title: string
  size: 'small' | 'medium' | 'large'
  onClose: () => void
}

export default function NotesWidget(props: NotesWidgetProps) {
  const [notes, setNotes] = createSignal('')

  onMount(() => {
    // Load saved notes
    const savedNotes = localStorage.getItem(`notes-${props.widgetId}`) || ''
    setNotes(savedNotes)
  })

  const saveNotes = (value: string) => {
    setNotes(value)
    localStorage.setItem(`notes-${props.widgetId}`, value)
  }

  return (
    <DashboardWidget {...props}>
      <div class="h-48">
        <textarea
          value={notes()}
          onInput={(e) => saveNotes(e.currentTarget.value)}
          placeholder="Write your notes here..."
          class="w-full h-full p-3 border border-secondary-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        />
      </div>
      <div class="mt-2 text-xs text-secondary-500">
        Notes are automatically saved
      </div>
    </DashboardWidget>
  )
}