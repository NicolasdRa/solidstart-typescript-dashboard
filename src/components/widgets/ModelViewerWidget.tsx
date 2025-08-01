import { onMount, createSignal, ErrorBoundary } from 'solid-js'
import DashboardWidget from '../DashboardWidget'

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
          <div class="text-center py-8">
            <div class="text-4xl mb-3">🚨</div>
            <h3 class="text-lg font-semibold text-red-600 mb-2">3D Model Error</h3>
            <p class="text-sm text-red-500 mb-4">
              Failed to load 3D model: {err.message}
            </p>
            <div class="space-y-2">
              <button 
                onClick={reset}
                class="block w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Retry Loading
              </button>
              <p class="text-xs text-secondary-500">
                Check your internet connection or try a different model
              </p>
            </div>
          </div>
        )}
      >
        <div class="space-y-4">
        {/* Model Info */}
        <div class="text-center">
          <h4 class="font-semibold text-secondary-900">{props.modelName}</h4>
          <p class="text-sm text-secondary-600 mt-1">{props.modelDescription}</p>
        </div>

        {/* Model Viewer Container */}
        <div class="relative bg-secondary-50 rounded-lg overflow-hidden" style="height: 300px;">
          {loading() && (
            <div class="absolute inset-0 flex items-center justify-center bg-secondary-100">
              <div class="text-center">
                <div class="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                <div class="text-sm text-secondary-600">Loading 3D model...</div>
              </div>
            </div>
          )}

          {error() && (
            <div class="absolute inset-0 flex items-center justify-center bg-secondary-100">
              <div class="text-center text-red-600">
                <div class="text-2xl mb-2">⚠️</div>
                <div class="text-sm">{error()}</div>
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
              style="width: 100%; height: 100%;"
            />
          )}
        </div>

        {/* Controls */}
        <div class="flex justify-center gap-2">
          <button
            onClick={() => {
              if (modelViewerRef) {
                (modelViewerRef as any).cameraOrbit = "0deg 75deg 105%"
              }
            }}
            class={`px-3 py-1 text-xs rounded transition-all duration-200 font-medium ${
              loading() || !!error()
                ? 'bg-secondary-100 text-secondary-400 cursor-not-allowed'
                : 'bg-secondary-200 hover:bg-secondary-300 active:bg-primary-600 active:text-white hover:shadow-sm active:scale-95 text-secondary-700 hover:text-secondary-900'
            }`}
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
            class={`px-3 py-1 text-xs rounded transition-all duration-200 font-medium ${
              loading() || !!error()
                ? 'bg-secondary-100 text-secondary-400 cursor-not-allowed'
                : autoRotate()
                ? 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white hover:shadow-sm active:scale-95'
                : 'bg-secondary-200 hover:bg-secondary-300 active:bg-secondary-400 hover:shadow-sm active:scale-95 text-secondary-700 hover:text-secondary-900'
            }`}
            disabled={loading() || !!error()}
          >
            <span class="flex items-center gap-1">
              {autoRotate() ? (
                <>
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                  Stop Rotation
                </>
              ) : (
                <>
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                  </svg>
                  Auto Rotate
                </>
              )}
            </span>
          </button>
        </div>

        {/* Model Details */}
        <div class="text-xs text-secondary-500 text-center">
          Click and drag to rotate • Scroll to zoom
        </div>
        </div>
      </ErrorBoundary>
    </DashboardWidget>
  )
}