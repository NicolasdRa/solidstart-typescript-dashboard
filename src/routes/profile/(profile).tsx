import { onMount } from 'solid-js'
import SEO from '~/components/SEO/SEO'
import DashboardErrorBoundary from '~/components/ErrorBoundary/DashboardErrorBoundary'
import ProfileContent from '~/components/ProfileContent/ProfileContent'
import DashboardLayout from '~/layouts/DashboardLayout/DashboardLayout'

export default function Profile() {
  onMount(() => {
    console.log('Profile page loaded')
  })

  return (
    <>
      <SEO 
        title="Profile Settings"
        description="Manage your profile settings, account preferences, and security options in your dashboard."
        path="/profile"
      />
      
      <DashboardLayout 
        title="Profile Settings"
        subtitle="Manage your account and preferences"
      >
        <DashboardErrorBoundary
          fallbackIcon="👤"
          fallbackTitle="Profile Error"
          fallbackMessage="Unable to load profile information."
        >
          <ProfileContent />
        </DashboardErrorBoundary>
      </DashboardLayout>
    </>
  )
}