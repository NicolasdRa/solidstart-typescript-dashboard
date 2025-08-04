import { createSignal, createMemo, createEffect } from 'solid-js'
import { useAppStore } from '~/stores/appStore'
import { updateAccountSettings } from '~/api'
import { useSubmission } from '@solidjs/router'
import styles from './AccountSettingsWidget.module.css'

export default function AccountSettingsWidget() {
  const { state } = useAppStore()
  const updating = useSubmission(updateAccountSettings)
  
  // Get settings from user data with defaults
  const settings = createMemo(() => ({
    language: state.user?.language || 'en',
    timezone: state.user?.timezone || 'America/Los_Angeles',
    emailNotifications: state.user?.emailNotifications ?? true,
    pushNotifications: state.user?.pushNotifications ?? false,
    marketingEmails: state.user?.marketingEmails ?? false
  }))

  // Handle successful form submission
  createEffect(() => {
    if (updating.result && !updating.pending) {
      if (updating.result.success) {
        // Force refresh user data
        window.location.reload()
      }
    }
  })

  return (
    <div class={styles.container}>
      <h3 class={styles.title}>Account Settings</h3>
      
      <form action={updateAccountSettings} method="post" class={styles.content}>
        <div class={styles.fieldGroup}>
          <label class={styles.fieldLabel}>Language</label>
          <select 
            name="language"
            value={settings().language}
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
            name="timezone"
            value={settings().timezone}
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
              name="emailNotifications"
              type="checkbox"
              value="true"
              checked={settings().emailNotifications}
              class={styles.toggleCheckbox}
            />
          </label>

          <label class={styles.toggleLabel}>
            <span class={styles.toggleText}>Push notifications</span>
            <input 
              name="pushNotifications"
              type="checkbox"
              value="true"
              checked={settings().pushNotifications}
              class={styles.toggleCheckbox}
            />
          </label>

          <label class={styles.toggleLabel}>
            <span class={styles.toggleText}>Marketing emails</span>
            <input 
              name="marketingEmails"
              type="checkbox"
              value="true"
              checked={settings().marketingEmails}
              class={styles.toggleCheckbox}
            />
          </label>
        </div>

        <button type="submit" class={styles.saveButton} disabled={updating.pending}>
          {updating.pending ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}