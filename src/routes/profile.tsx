import { onMount, ErrorBoundary } from 'solid-js'
import { Title, Meta } from '@solidjs/meta'
import DashboardSidebar from '~/components/DashboardSidebar'
import DashboardHeader from '~/components/DashboardHeader'
import ProfileController from '~/components/ProfileController'
import { useAppContext } from '~/contexts/AppContext'
import styles from './profile.module.css'

export default function Profile() {
  const appContext = useAppContext()

  onMount(() => {
    console.log('Profile page loaded')
  })


  return (
    <>
      <Title>Profile Settings - SolidStart Dashboard</Title>
      <Meta name="description" content="Manage your profile settings, account preferences, and security options in your dashboard." />
      <Meta property="og:title" content="Profile Settings - SolidStart Dashboard" />
      <Meta property="og:description" content="Manage your profile settings, account preferences, and security options." />
      <Meta property="og:type" content="website" />
      <Meta name="twitter:card" content="summary" />
      <Meta name="twitter:title" content="Profile Settings - SolidStart Dashboard" />
      <Meta name="twitter:description" content="Manage your profile settings, account preferences, and security options." />
      
      <div class={styles.container}>
      
      {/* Sidebar Component */}
      <DashboardSidebar 
        currentPage="profile" 
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
          {/* Profile Header Component */}
          <DashboardHeader 
            title="Profile Settings" 
            subtitle="Manage your account and preferences"
            showControls={false}
            currentLayout=""
            onLayoutChange={() => {}}
          />

          {/* Profile Controller handles profile widgets */}
          <ErrorBoundary 
            fallback={(_, reset) => (
              <div class={styles.errorContainer}>
                <div class={styles.errorIcon}>👤</div>
                <h2 class={styles.errorTitle}>Profile Error</h2>
                <p class={styles.errorMessage}>
                  Unable to load profile information.
                </p>
                <button 
                  onClick={reset}
                  class={styles.errorButton}
                >
                  Retry
                </button>
              </div>
            )}
          >
            <ProfileController />
          </ErrorBoundary>
        </div>
      </div>
      </div>
    </>
  )
}