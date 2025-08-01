import { onMount } from 'solid-js'
import { appActions } from '~/stores/appStore'

/**
 * StoreInitializer - Handles client-side store initialization
 * This component should be placed at the root of the app to ensure
 * proper hydration and state persistence
 */
export default function StoreInitializer() {
  onMount(() => {
    // Initialize the app store with persisted state
    appActions.initializeApp()
  })

  // This component doesn't render anything
  return null
}