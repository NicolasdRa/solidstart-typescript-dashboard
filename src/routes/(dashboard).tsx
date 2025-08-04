import { RouteSectionProps, createAsync } from '@solidjs/router'
import { Suspense, createEffect } from 'solid-js'
import DashboardLayout from '~/layouts/DashboardLayout/DashboardLayout'
import LoadingSpinner from '~/components/LoadingSpinner'
import { getUser } from '~/api'
import { useAppStore } from '~/stores/appStore'

/**
 * Shared layout for all dashboard routes
 * This layout wraps all routes except 404 pages
 * Following SolidStart's file-based routing conventions
 */
export default function DashboardRouteLayout(props: RouteSectionProps) {
  const { actions } = useAppStore()
  const user = createAsync(() => getUser())

  // Update user data in store when it changes
  createEffect(() => {
    const userData = user()
    if (userData) {
      actions.setUser(userData)
    }
  })

  return (
    <DashboardLayout>
      <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
        {props.children}
      </Suspense>
    </DashboardLayout>
  )
}