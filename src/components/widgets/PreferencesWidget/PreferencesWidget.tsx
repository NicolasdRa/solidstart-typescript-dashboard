import { createMemo, createEffect } from 'solid-js'
import { useAppStore } from '~/stores/appStore'
import { updatePreferences } from '~/api'
import { useSubmission } from '@solidjs/router'
import styles from './PreferencesWidget.module.css'

export default function PreferencesWidget() {
  const { state } = useAppStore()
  const updating = useSubmission(updatePreferences)
  
  // Get preferences from user data with defaults
  const preferences = createMemo(() => ({
    theme: state.user?.theme || 'light',
    displayDensity: state.user?.displayDensity || 'comfortable',
    dashboardLayout: state.user?.dashboardLayout || 'grid',
    sidebarCollapsed: state.user?.sidebarCollapsed ?? false,
    enableAnimations: state.user?.enableAnimations ?? true,
    enableSounds: state.user?.enableSounds ?? false,
    autoSave: state.user?.autoSave ?? true
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
      <h3 class={styles.title}>Preferences</h3>
      
      <form action={updatePreferences} method="post" class={styles.content}>
        <div class={styles.fieldGroup}>
          <label class={styles.fieldLabel}>Theme</label>
          <select 
            name="theme"
            value={preferences().theme}
            class={styles.fieldSelect}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div class={styles.fieldGroup}>
          <label class={styles.fieldLabel}>Display density</label>
          <select 
            name="displayDensity"
            value={preferences().displayDensity}
            class={styles.fieldSelect}
          >
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
            <option value="spacious">Spacious</option>
          </select>
        </div>

        <div class={styles.fieldGroup}>
          <label class={styles.fieldLabel}>Dashboard layout</label>
          <select 
            name="dashboardLayout"
            value={preferences().dashboardLayout}
            class={styles.fieldSelect}
          >
            <option value="grid">Grid</option>
            <option value="list">List</option>
            <option value="masonry">Masonry</option>
          </select>
        </div>

        <div class={styles.featuresSection}>
          <h4 class={styles.sectionTitle}>Features</h4>
          
          <label class={styles.toggleLabel}>
            <span class={styles.toggleText}>Collapse sidebar by default</span>
            <input 
              name="sidebarCollapsed"
              type="checkbox"
              value="true"
              checked={preferences().sidebarCollapsed}
              class={styles.toggleCheckbox}
            />
          </label>

          <label class={styles.toggleLabel}>
            <span class={styles.toggleText}>Enable animations</span>
            <input 
              name="enableAnimations"
              type="checkbox"
              value="true"
              checked={preferences().enableAnimations}
              class={styles.toggleCheckbox}
            />
          </label>

          <label class={styles.toggleLabel}>
            <span class={styles.toggleText}>Sound effects</span>
            <input 
              name="enableSounds"
              type="checkbox"
              value="true"
              checked={preferences().enableSounds}
              class={styles.toggleCheckbox}
            />
          </label>

          <label class={styles.toggleLabel}>
            <span class={styles.toggleText}>Auto-save changes</span>
            <input 
              name="autoSave"
              type="checkbox"
              value="true"
              checked={preferences().autoSave}
              class={styles.toggleCheckbox}
            />
          </label>
        </div>

        <button type="submit" class={styles.applyButton} disabled={updating.pending}>
          {updating.pending ? 'Saving...' : 'Apply Preferences'}
        </button>
      </form>
    </div>
  )
}