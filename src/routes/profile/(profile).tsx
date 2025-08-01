import { onMount, ErrorBoundary } from 'solid-js'
import { Title, Meta } from '@solidjs/meta'
import ProfileContent from '~/components/ProfileContent/ProfileContent'
import DashboardLayout from '~/layouts/DashboardLayout/DashboardLayout'
import styles from './profile.module.css'

export default function Profile() {
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
      
      <DashboardLayout 
        title="Profile Settings"
        subtitle="Manage your account and preferences"
      >
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
          <ProfileContent />
        </ErrorBoundary>
      </DashboardLayout>
    </>
  )
}