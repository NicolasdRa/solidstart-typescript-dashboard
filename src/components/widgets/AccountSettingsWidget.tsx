import { createSignal } from 'solid-js'

export default function AccountSettingsWidget() {
  const [settings, setSettings] = createSignal({
    language: 'en',
    timezone: 'America/Los_Angeles',
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false
  })

  const handleToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
  }

  return (
    <div class="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
      <h3 class="text-lg font-semibold text-secondary-900 mb-4">Account Settings</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-secondary-700 mb-1">Language</label>
          <select 
            value={settings().language}
            onChange={(e) => setSettings(prev => ({ ...prev, language: e.currentTarget.value }))}
            class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-secondary-700 mb-1">Timezone</label>
          <select 
            value={settings().timezone}
            onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.currentTarget.value }))}
            class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>

        <div class="space-y-3">
          <h4 class="text-sm font-medium text-secondary-700">Notifications</h4>
          
          <label class="flex items-center justify-between">
            <span class="text-sm text-secondary-600">Email notifications</span>
            <input 
              type="checkbox"
              checked={settings().emailNotifications}
              onChange={() => handleToggle('emailNotifications')}
              class="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
            />
          </label>

          <label class="flex items-center justify-between">
            <span class="text-sm text-secondary-600">Push notifications</span>
            <input 
              type="checkbox"
              checked={settings().pushNotifications}
              onChange={() => handleToggle('pushNotifications')}
              class="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
            />
          </label>

          <label class="flex items-center justify-between">
            <span class="text-sm text-secondary-600">Marketing emails</span>
            <input 
              type="checkbox"
              checked={settings().marketingEmails}
              onChange={() => handleToggle('marketingEmails')}
              class="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
            />
          </label>
        </div>

        <button class="w-full px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg font-medium transition-colors duration-200">
          Save Settings
        </button>
      </div>
    </div>
  )
}