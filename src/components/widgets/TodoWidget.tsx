import { createSignal, For } from 'solid-js'
import DashboardWidget from '../DashboardWidget'


interface TodoItem {
  id: string
  text: string
  completed: boolean
}

interface TodoWidgetProps {
  widgetId: string
  title: string
  size: 'small' | 'medium' | 'large'
  onClose: () => void
}

export default function TodoWidget(props: TodoWidgetProps) {
  const [todos, setTodos] = createSignal<TodoItem[]>([
    { id: '1', text: 'Review project proposals', completed: false },
    { id: '2', text: 'Update dashboard metrics', completed: true },
    { id: '3', text: 'Prepare team meeting agenda', completed: false },
    { id: '4', text: 'Follow up with clients', completed: false }
  ])
  const [newTodo, setNewTodo] = createSignal('')

  const addTodo = () => {
    const text = newTodo().trim()
    if (text) {
      const newItem: TodoItem = {
        id: Date.now().toString(),
        text,
        completed: false
      }
      setTodos(prev => [...prev, newItem])
      setNewTodo('')
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  return (
    <DashboardWidget {...props}>
      <div class="space-y-4">
        {/* Add new todo */}
        <div class="flex gap-2">
          <input
            type="text"
            value={newTodo()}
            onInput={(e) => setNewTodo(e.currentTarget.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add new task..."
            class="flex-1 px-3 py-2 text-sm border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            onClick={addTodo}
            class="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm"
          >
            +
          </button>
        </div>

        {/* Todo list */}
        <div class="space-y-2 max-h-48 overflow-y-auto">
          <For 
            each={todos()}
            fallback={
              <div class="text-center py-8 text-secondary-500">
                <div class="text-2xl mb-2">📝</div>
                <p class="text-sm">No todos yet. Add one above!</p>
              </div>
            }
          >
            {(todo) => (
              <div class="flex items-center gap-3 p-2 hover:bg-secondary-50 rounded-lg group">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  class="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                />
                <span class={`flex-1 text-sm ${
                  todo.completed 
                    ? 'line-through text-secondary-500' 
                    : 'text-secondary-900'
                }`}>
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  class="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all duration-200"
                >
                  <span class="text-sm">🗑</span>
                </button>
              </div>
            )}
          </For>
        </div>

        {/* Stats */}
        <div class="text-xs text-secondary-500 border-t border-secondary-100 pt-2">
          {todos().filter(t => t.completed).length} of {todos().length} completed
        </div>
      </div>
    </DashboardWidget>
  )
}