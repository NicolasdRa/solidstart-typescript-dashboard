import { createSignal } from 'solid-js'
import styles from './AccountSettingsWidget.module.css'

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
    <div class={styles.container}>
      <h3 class={styles.title}>Account Settings</h3>
      
      <div class={styles.content}>
        <div class={styles.fieldGroup}>
          <label class={styles.fieldLabel}>Language</label>
          <select 
            value={settings().language}
            onChange={(e) => setSettings(prev => ({ ...prev, language: e.currentTarget.value }))}
            class={styles.fieldSelect}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        <div class={styles.fieldGroup}>
          <label class={styles.fieldLabel}>Timezone</label>
          <select 
            value={settings().timezone}
            onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.currentTarget.value }))}
            class={styles.fieldSelect}
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>

        <div class={styles.notificationsSection}>
          <h4 class={styles.sectionTitle}>Notifications</h4>
          
          <label class={styles.toggleLabel}>
            <span class={styles.toggleText}>Email notifications</span>
            <input 
              type="checkbox"
              checked={settings().emailNotifications}
              onChange={() => handleToggle('emailNotifications')}
              class={styles.toggleCheckbox}
            />
          </label>

          <label class={styles.toggleLabel}>
            <span class={styles.toggleText}>Push notifications</span>
            <input 
              type="checkbox"
              checked={settings().pushNotifications}
              onChange={() => handleToggle('pushNotifications')}
              class={styles.toggleCheckbox}
            />
          </label>

          <label class={styles.toggleLabel}>
            <span class={styles.toggleText}>Marketing emails</span>
            <input 
              type="checkbox"
              checked={settings().marketingEmails}
              onChange={() => handleToggle('marketingEmails')}
              class={styles.toggleCheckbox}
            />
          </label>
        </div>

        <button class={styles.saveButton}>
          Save Settings
        </button>
      </div>
    </div>
  )
}