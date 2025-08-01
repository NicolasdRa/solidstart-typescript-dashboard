import { useAppStore } from '~/stores/appStore'
import { Show } from 'solid-js'
import { Portal } from 'solid-js/web'
import styles from './Header.module.css'

interface DashboardHeaderProps {
  title: string
  subtitle: string
  showControls: boolean
  currentLayout: string
  onLayoutChange: (layout: string) => void
}

export default function DashboardHeader(props: DashboardHeaderProps) {
  const { state, actions } = useAppStore()

  const handleAddWidget = () => {
    actions.setShowWidgetModal(true)
  }

  const handleLayoutChange = (layout: string) => {
    props.onLayoutChange(layout)
  }

  const handleClearLayout = () => {
    if (confirm('Remove all widgets from the dashboard?')) {
      actions.clearLayout()
    }
  }

  const handleResetLayout = () => {
    if (confirm('Reset dashboard to default layout?')) {
      actions.resetLayout()
    }
  }

  return (
    <div class={styles.container}>
      {/* Header */}
      <div class={styles.header}>
        <div class={styles.headerContent}>
          {/* Mobile hamburger menu */}
          <button
            onClick={() => actions.setSidebarOpen(true)}
            class={styles.mobileMenuButton}
            title="Open sidebar"
          >
            <svg class={styles.mobileMenuIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div class={styles.titleSection}>
            <h1 class={styles.title}>{props.title}</h1>
            <p class={styles.subtitle}>{props.subtitle}</p>
          </div>
        </div>
        
        <Show when={props.showControls}>
          <div class={styles.controls}>
            {/* Layout Controls */}
            <div class={styles.layoutControls}>
              <button
                onClick={() => handleLayoutChange('grid')}
                class={`${styles.layoutButton} ${
                  props.currentLayout === 'grid'
                    ? styles.layoutButtonActive
                    : styles.layoutButtonInactive
                }`}
                title="Grid Layout"
              >
                <span class={styles.layoutButtonText}>⊞</span>
                <span class={styles.layoutButtonTextDesktop}>Grid</span>
              </button>
              <button
                onClick={() => handleLayoutChange('list')}
                class={`${styles.layoutButton} ${
                  props.currentLayout === 'list'
                    ? styles.layoutButtonActive
                    : styles.layoutButtonInactive
                }`}
                title="List Layout"
              >
                <span class={styles.layoutButtonText}>☰</span>
                <span class={styles.layoutButtonTextDesktop}>List</span>
              </button>
              <button
                onClick={() => handleLayoutChange('masonry')}
                class={`${styles.layoutButton} ${
                  props.currentLayout === 'masonry'
                    ? styles.layoutButtonActive
                    : styles.layoutButtonInactive
                }`}
                title="Masonry Layout"
              >
                <span class={styles.layoutButtonText}>⊡</span>
                <span class={styles.layoutButtonTextDesktop}>Masonry</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div class={styles.actionButtons}>
              <button
                onClick={handleAddWidget}
                class={styles.addButton}
              >
                <span class={styles.addButtonIcon}>+</span>
                <span class={styles.addButtonText}>Add Widget</span>
              </button>
              
              <div class={styles.dropdownContainer}>
                <button class={styles.dropdownTrigger}>
                  <span class={styles.dropdownIcon}>⋮</span>
                </button>
                
                {/* Dropdown Menu */}
                <Portal>
                  <div class={styles.dropdownMenu}>
                  <button
                    onClick={handleResetLayout}
                    class={`${styles.dropdownItem} ${styles.dropdownItemDefault}`}
                  >
                    Reset Layout
                  </button>
                  <button
                    onClick={handleClearLayout}
                    class={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                  >
                    Clear All Widgets
                  </button>
                  </div>
                </Portal>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </div>
  )
}