import { createSignal } from 'solid-js'
import styles from './PreferencesWidget.module.css'

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
    <div class={styles.container}>
      <h3 class={styles.title}>Preferences</h3>
      
      <div class={styles.content}>
        <div class={styles.fieldGroup}>
          <label class={styles.fieldLabel}>Theme</label>
          <select 
            value={preferences().theme}
            onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.currentTarget.value }))}
            class={styles.fieldSelect}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div class={styles.fieldGroup}>
          <label class={styles.fieldLabel}>Display density</label>
          <select 
            value={preferences().density}
            onChange={(e) => setPreferences(prev => ({ ...prev, density: e.currentTarget.value }))}
            class={styles.fieldSelect}
          >
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
            <option value="spacious">Spacious</option>
          </select>
        </div>

        <div class={styles.featuresSection}>
          <h4 class={styles.sectionTitle}>Features</h4>
          
          <label class={styles.toggleLabel}>
            <span class={styles.toggleText}>Enable animations</span>
            <input 
              type="checkbox"
              checked={preferences().animations}
              onChange={() => handleToggle('animations')}
              class={styles.toggleCheckbox}
            />
          </label>

          <label class={styles.toggleLabel}>
            <span class={styles.toggleText}>Sound effects</span>
            <input 
              type="checkbox"
              checked={preferences().sounds}
              onChange={() => handleToggle('sounds')}
              class={styles.toggleCheckbox}
            />
          </label>

          <label class={styles.toggleLabel}>
            <span class={styles.toggleText}>Auto-save changes</span>
            <input 
              type="checkbox"
              checked={preferences().autoSave}
              onChange={() => handleToggle('autoSave')}
              class={styles.toggleCheckbox}
            />
          </label>
        </div>

        <button class={styles.applyButton}>
          Apply Preferences
        </button>
      </div>
    </div>
  )
}