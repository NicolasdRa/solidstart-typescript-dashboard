import { onMount, createSignal, ErrorBoundary } from 'solid-js'
import DashboardWidget from '../DashboardWidget'
import styles from './ModelViewerWidget.module.css'

interface ModelViewerWidgetProps {
  widgetId: string
  title: string
  size: 'small' | 'medium' | 'large'
  onClose: () => void
  modelSrc: string
  modelName: string
  modelDescription: string
  environmentImage: string
  shadowIntensity: string
}

export default function ModelViewerWidget(props: ModelViewerWidgetProps) {
  const [loading, setLoading] = createSignal(true)
  const [error, setError] = createSignal('')
  const [autoRotate, setAutoRotate] = createSignal(false)
  let modelViewerRef: HTMLElement | undefined

  onMount(async () => {
    try {
      // Import model-viewer dynamically
      await import('@google/model-viewer')
      setLoading(false)
    } catch (err) {
      console.error('Failed to load model-viewer:', err)
      setError('Failed to load 3D model viewer')
      setLoading(false)
    }
  })

  const handleModelLoad = () => {
    console.log('Model loaded successfully')
    setLoading(false)
  }

  const handleModelError = (event: Event) => {
    console.error('Model loading error:', event)
    setError('Failed to load 3D model')
    setLoading(false)
  }

  return (
    <DashboardWidget {...props}>
      <ErrorBoundary 
        fallback={(err, reset) => (
          <div class={styles.errorFallback}>
            <div class={styles.errorIcon}>🚨</div>
            <h3 class={styles.errorTitle}>3D Model Error</h3>
            <p class={styles.errorMessage}>
              Failed to load 3D model: {err.message}
            </p>
            <div class={styles.errorActions}>
              <button 
                onClick={reset}
                class={styles.retryButton}
              >
                Retry Loading
              </button>
              <p class={styles.errorHint}>
                Check your internet connection or try a different model
              </p>
            </div>
          </div>
        )}
      >
        <div class={styles.container}>
        {/* Model Info */}
        <div class={styles.modelInfo}>
          <h4 class={styles.modelName}>{props.modelName}</h4>
          <p class={styles.modelDescription}>{props.modelDescription}</p>
        </div>

        {/* Model Viewer Container */}
        <div class={styles.viewerContainer}>
          {loading() && (
            <div class={styles.loadingOverlay}>
              <div class={styles.loadingContent}>
                <div class={styles.loadingSpinner}></div>
                <div class={styles.loadingText}>Loading 3D model...</div>
              </div>
            </div>
          )}

          {error() && (
            <div class={styles.errorOverlay}>
              <div class={styles.errorContent}>
                <div class={styles.errorOverlayIcon}>⚠️</div>
                <div class={styles.errorOverlayText}>{error()}</div>
              </div>
            </div>
          )}

          {!loading() && !error() && (
            <div
              ref={(el) => {
                if (el && !el.querySelector('model-viewer')) {
                  const modelViewer = document.createElement('model-viewer')
                  modelViewer.src = props.modelSrc
                  modelViewer.alt = props.modelDescription
                  modelViewer.setAttribute('camera-controls', '')
                  modelViewer.setAttribute('auto-rotate', 'false')
                  modelViewer.setAttribute('shadow-intensity', props.shadowIntensity)
                  modelViewer.style.width = '100%'
                  modelViewer.style.height = '100%'
                  modelViewer.addEventListener('load', handleModelLoad)
                  modelViewer.addEventListener('error', handleModelError)
                  modelViewerRef = modelViewer
                  el.appendChild(modelViewer)
                }
              }}
              class={styles.modelViewer}
            />
          )}
        </div>

        {/* Controls */}
        <div class={styles.controls}>
          <button
            onClick={() => {
              if (modelViewerRef) {
                (modelViewerRef as any).cameraOrbit = "0deg 75deg 105%"
              }
            }}
            class={
              loading() || !!error()
                ? styles.controlButtonDisabled
                : styles.controlButtonNormal
            }
            disabled={loading() || !!error()}
          >
            Reset View
          </button>
          <button
            onClick={() => {
              if (modelViewerRef) {
                const currentRotate = (modelViewerRef as any).autoRotate
                const newRotate = !currentRotate
                ;(modelViewerRef as any).autoRotate = newRotate
                setAutoRotate(newRotate)
              }
            }}
            class={
              loading() || !!error()
                ? styles.controlButtonDisabled
                : autoRotate()
                ? styles.controlButtonActive
                : styles.controlButtonNormal
            }
            disabled={loading() || !!error()}
          >
            <span class={styles.controlButtonContent}>
              {autoRotate() ? (
                <>
                  <svg class={styles.controlIcon} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                  Stop Rotation
                </>
              ) : (
                <>
                  <svg class={styles.controlIcon} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                  </svg>
                  Auto Rotate
                </>
              )}
            </span>
          </button>
        </div>

        {/* Model Details */}
        <div class={styles.instructions}>
          Click and drag to rotate • Scroll to zoom
        </div>
        </div>
      </ErrorBoundary>
    </DashboardWidget>
  )
}