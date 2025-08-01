import { createSignal } from 'solid-js'

export default function PreferencesWidget() {
  const [preferences, setPreferences] = createSignal({
    theme: 'system',
    density: 'comfortable',
    animations: true,
    sounds: false,
    autoSave: true
  })

  const handleToggle = (key: string) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
  }

  return (
    <div class="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
      <h3 class="text-lg font-semibold text-secondary-900 mb-4">Preferences</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-secondary-700 mb-1">Theme</label>
          <select 
            value={preferences().theme}
            onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.currentTarget.value }))}
            class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-secondary-700 mb-1">Display density</label>
          <select 
            value={preferences().density}
            onChange={(e) => setPreferences(prev => ({ ...prev, density: e.currentTarget.value }))}
            class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
            <option value="spacious">Spacious</option>
          </select>
        </div>

        <div class="space-y-3">
          <h4 class="text-sm font-medium text-secondary-700">Features</h4>
          
          <label class="flex items-center justify-between">
            <span class="text-sm text-secondary-600">Enable animations</span>
            <input 
              type="checkbox"
              checked={preferences().animations}
              onChange={() => handleToggle('animations')}
              class="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
            />
          </label>

          <label class="flex items-center justify-between">
            <span class="text-sm text-secondary-600">Sound effects</span>
            <input 
              type="checkbox"
              checked={preferences().sounds}
              onChange={() => handleToggle('sounds')}
              class="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
            />
          </label>

          <label class="flex items-center justify-between">
            <span class="text-sm text-secondary-600">Auto-save changes</span>
            <input 
              type="checkbox"
              checked={preferences().autoSave}
              onChange={() => handleToggle('autoSave')}
              class="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
            />
          </label>
        </div>

        <button class="w-full px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg font-medium transition-colors duration-200">
          Apply Preferences
        </button>
      </div>
    </div>
  )
}