import { createSignal } from 'solid-js'
import BaseWidget from '../../BaseWidget/BaseWidget'
import styles from './WeatherWidget.module.css'


interface WeatherWidgetProps {
  widgetId: string
  title: string
  size: 'small' | 'medium' | 'large'
  onClose: () => void
}

export default function WeatherWidget(props: WeatherWidgetProps) {
  const [weather] = createSignal({
    location: 'San Francisco, CA',
    temperature: 72,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 8,
    icon: '⛅'
  })

  return (
    <BaseWidget {...props}>
      <div class={styles.container}>
        <div class={styles.weatherIcon}>{weather().icon}</div>
        <div class={styles.temperatureContainer}>
          <div class={styles.temperature}>
            {weather().temperature}°F
          </div>
          <div class={styles.condition}>{weather().condition}</div>
          <div class={styles.location}>{weather().location}</div>
        </div>
        
        <div class={styles.detailsContainer}>
          <div class={styles.detailItem}>
            <div class={styles.detailLabel}>Humidity</div>
            <div class={styles.detailValue}>{weather().humidity}%</div>
          </div>
          <div class={styles.detailItem}>
            <div class={styles.detailLabel}>Wind</div>
            <div class={styles.detailValue}>{weather().windSpeed} mph</div>
          </div>
        </div>
      </div>
    </BaseWidget>
  )
}