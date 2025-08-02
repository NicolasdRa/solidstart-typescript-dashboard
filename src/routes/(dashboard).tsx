import { RouteSectionProps } from '@solidjs/router'
import { Suspense } from 'solid-js'
import DashboardLayout from '~/layouts/DashboardLayout/DashboardLayout'
import LoadingSpinner from '~/components/LoadingSpinner'

/**
 * Shared layout for all dashboard routes
 * This layout wraps all routes except 404 pages
 * Following SolidStart's file-based routing conventions
 */
export default function DashboardRouteLayout(props: RouteSectionProps) {
  return (
    <DashboardLayout>
      <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
        {props.children}
      </Suspense>
    </DashboardLayout>
  )
}