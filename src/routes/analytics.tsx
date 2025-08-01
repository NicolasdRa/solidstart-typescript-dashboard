import { Title, Meta } from '@solidjs/meta'
import DashboardSidebar from '~/components/DashboardSidebar'
import DashboardHeader from '~/components/DashboardHeader'
import { useAppContext } from '~/contexts/AppContext'
import styles from './analytics.module.css'

export default function Analytics() {
  const appContext = useAppContext()


  return (
    <>
      <Title>Analytics Dashboard - SolidStart Dashboard</Title>
      <Meta name="description" content="View comprehensive data insights, metrics, and analytics to track your dashboard performance and user engagement." />
      <Meta property="og:title" content="Analytics Dashboard - SolidStart Dashboard" />
      <Meta property="og:description" content="View comprehensive data insights, metrics, and analytics to track your dashboard performance and user engagement." />
      <Meta property="og:type" content="website" />
      <Meta name="twitter:card" content="summary" />
      <Meta name="twitter:title" content="Analytics Dashboard - SolidStart Dashboard" />
      <Meta name="twitter:description" content="View comprehensive data insights, metrics, and analytics to track your dashboard performance and user engagement." />
      
      <div class={styles.container}>
      
      <DashboardSidebar 
        currentPage="analytics" 
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
            title="Analytics" 
            subtitle="View your data insights and metrics"
            showControls={false}
            currentLayout=""
            onLayoutChange={() => {}}
          />

          <div class={styles.analyticsGrid}>
            <div class={styles.analyticsCard}>
              <h3 class={styles.cardTitle}>Page Views</h3>
              <div class={styles.cardValue}>125,430</div>
              <p class={`${styles.cardChange} ${styles.cardChangePositive}`}>+12.5% from last month</p>
            </div>

            <div class={styles.analyticsCard}>
              <h3 class={styles.cardTitle}>Users</h3>
              <div class={styles.cardValue}>24,532</div>
              <p class={`${styles.cardChange} ${styles.cardChangePositive}`}>+8.2% from last month</p>
            </div>

            <div class={styles.analyticsCard}>
              <h3 class={styles.cardTitle}>Conversion Rate</h3>
              <div class={styles.cardValue}>3.24%</div>
              <p class={`${styles.cardChange} ${styles.cardChangeNegative}`}>-2.1% from last month</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}