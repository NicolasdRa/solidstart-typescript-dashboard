import { Title, Meta } from '@solidjs/meta'
import DashboardSidebar from '~/components/DashboardSidebar'
import DashboardHeader from '~/components/DashboardHeader'
import { useAppContext } from '~/contexts/AppContext'
import styles from './settings.module.css'

export default function Settings() {
  const appContext = useAppContext()


  return (
    <>
      <Title>Settings - SolidStart Dashboard</Title>
      <Meta name="description" content="Configure your dashboard settings, manage system preferences, and customize your application experience." />
      <Meta property="og:title" content="Settings - SolidStart Dashboard" />
      <Meta property="og:description" content="Configure your dashboard settings, manage system preferences, and customize your application experience." />
      <Meta property="og:type" content="website" />
      <Meta name="twitter:card" content="summary" />
      <Meta name="twitter:title" content="Settings - SolidStart Dashboard" />
      <Meta name="twitter:description" content="Configure your dashboard settings, manage system preferences, and customize your application experience." />
      
      <div class={styles.container}>
      
      <DashboardSidebar 
        currentPage="settings" 
        collapsed={appContext.sidebarCollapsed()}
        onToggle={appContext.setSidebarCollapsed}
        mobileOpen={appContext.sidebarOpen()}
        onMobileToggle={appContext.setSidebarOpen}
      />
      
      <div 
        class={`${styles.contentArea} ${
          appContext.sidebarCollapsed() ? styles.contentAreaCollapsed : styles.contentAreaExpanded
        }`}
      >
        <div class={styles.innerContent}>
          <DashboardHeader 
            title="Settings" 
            subtitle="Configure your application settings"
            showControls={false}
            currentLayout=""
            onLayoutChange={() => {}}
          />

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
        </div>
      </div>
      </div>
    </>
  )
}