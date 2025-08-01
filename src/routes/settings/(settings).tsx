import SEO from '~/components/SEO/SEO'
import DashboardLayout from '~/layouts/DashboardLayout/DashboardLayout'
import styles from './settings.module.css'

export default function Settings() {
  return (
    <>
      <SEO 
        title="Settings"
        description="Configure your dashboard settings, manage system preferences, and customize your application experience."
        path="/settings"
      />
      
      <DashboardLayout 
        title="Settings"
        subtitle="Configure your application settings"
      >
        <div class={styles.settingsGrid}>
          <div class={styles.settingsCard}>
            <h3 class={styles.cardTitle}>General Settings</h3>
            <div class={styles.formGroup}>
              <div>
                <label class={styles.label}>Application Name</label>
                <input
                  type="text"
                  value="My Dashboard"
                  class={styles.input}
                />
              </div>
              <div>
                <label class={styles.label}>Default Language</label>
                <select class={styles.select}>
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
            </div>
          </div>

          <div class={styles.settingsCard}>
            <h3 class={styles.cardTitle}>Advanced Settings</h3>
            <div class={styles.checkboxGroup}>
              <label class={styles.checkboxLabel}>
                <span class={styles.checkboxText}>Enable developer mode</span>
                <input type="checkbox" class={styles.checkbox} />
              </label>
              <label class={styles.checkboxLabel}>
                <span class={styles.checkboxText}>Show performance metrics</span>
                <input type="checkbox" class={styles.checkbox} />
              </label>
              <label class={styles.checkboxLabel}>
                <span class={styles.checkboxText}>Enable experimental features</span>
                <input type="checkbox" class={styles.checkbox} />
              </label>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}