import { createSignal, createResource, For, Show, onMount, onCleanup } from 'solid-js'
import { gql } from 'graphql-request'
import { graphqlClient, type CharactersResponse } from '~/lib/graphql-client'
import OptimizedImage from '~/components/OptimizedImage/OptimizedImage'
import styles from './GraphQLDataWidget.module.css'

// GraphQL query to fetch characters
const GET_CHARACTERS = gql`
  query GetCharacters($page: Int) {
    characters(page: $page) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        status
        species
        image
        episode {
          name
        }
      }
    }
  }
`

export default function GraphQLDataWidget() {
  const [page, setPage] = createSignal(1)
  const [widgetSize, setWidgetSize] = createSignal({ width: 600, height: 400 })
  const [isResizing, setIsResizing] = createSignal(false)
  let containerRef: HTMLDivElement | undefined
  
  // Fetch data using createResource
  const [charactersData, { refetch }] = createResource(
    page,
    async (currentPage) => {
      const data = await graphqlClient.request<CharactersResponse>(
        GET_CHARACTERS,
        { page: currentPage }
      )
      return data
    }
  )

  const handlePrevPage = () => {
    if (charactersData()?.characters.info.prev) {
      setPage(p => p - 1)
    }
  }

  const handleNextPage = () => {
    if (charactersData()?.characters.info.next) {
      setPage(p => p + 1)
    }
  }

  // Resize functionality
  const handleResizeStart = (e: MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = widgetSize().width
    const startHeight = widgetSize().height

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY
      
      const newWidth = Math.max(400, Math.min(1200, startWidth + deltaX))
      const newHeight = Math.max(300, Math.min(800, startHeight + deltaY))
      
      setWidgetSize({ width: newWidth, height: newHeight })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div 
      ref={containerRef}
      class={`${styles.container} ${isResizing() ? styles.resizing : ''}`}
      style={{
        width: `${widgetSize().width}px`,
        height: `${widgetSize().height}px`
      }}
    >
      <div class={styles.header}>
        <h3 class={styles.title}>GraphQL Data</h3>
        <span class={styles.subtitle}>Rick & Morty Characters</span>
      </div>

      <Show
        when={!charactersData.loading}
        fallback={
          <div class={styles.loading}>
            <div class={styles.spinner}></div>
            <p>Loading characters...</p>
          </div>
        }
      >
        <Show
          when={!charactersData.error}
          fallback={
            <div class={styles.error}>
              <p>Error loading data</p>
              <button onClick={refetch} class={styles.retryButton}>
                Retry
              </button>
            </div>
          }
        >
          <div class={styles.content}>
            <div class={styles.scrollContainer}>
              <For each={charactersData()?.characters.results}>
                {(character) => (
                  <div class={styles.characterCard}>
                    <div class={styles.characterInfo}>
                      <h4 class={styles.characterName}>{character.name}</h4>
                      <div class={styles.characterMeta}>
                        <span class={`${styles.status} ${styles[character.status.toLowerCase()]}`}>
                          {character.status}
                        </span>
                        <span class={styles.species}>{character.species}</span>
                        <span class={styles.episodes}>
                          {character.episode.length} episodes
                        </span>
                      </div>
                    </div>
                    
                    <div class={styles.imageRow}>
                      {/* Large size first */}
                      <div class={styles.imageContainer}>
                        <OptimizedImage
                          src={character.image}
                          alt={`${character.name} - Large`}
                          class={styles.image}
                          width={120}
                          height={120}
                          placeholder="blur"
                          optimize={true}
                        />
                        <span class={styles.imageLabel}>120×120</span>
                      </div>
                      
                      {/* Medium size */}
                      <div class={styles.imageContainer}>
                        <OptimizedImage
                          src={character.image}
                          alt={`${character.name} - Medium`}
                          class={styles.image}
                          width={80}
                          height={80}
                          placeholder="blur"
                          optimize={true}
                        />
                        <span class={styles.imageLabel}>80×80</span>
                      </div>
                      
                      {/* Small size last */}
                      <div class={styles.imageContainer}>
                        <OptimizedImage
                          src={character.image}
                          alt={`${character.name} - Small`}
                          class={styles.image}
                          width={40}
                          height={40}
                          placeholder="blur"
                          optimize={true}
                        />
                        <span class={styles.imageLabel}>40×40</span>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>

            <div class={styles.pagination}>
              <button
                onClick={handlePrevPage}
                disabled={!charactersData()?.characters.info.prev}
                class={styles.paginationButton}
              >
                Previous
              </button>
              <span class={styles.pageInfo}>
                Page {page()} of {charactersData()?.characters.info.pages || '?'}
              </span>
              <button
                onClick={handleNextPage}
                disabled={!charactersData()?.characters.info.next}
                class={styles.paginationButton}
              >
                Next
              </button>
            </div>
          </div>
        </Show>
      </Show>
      
      {/* Resize handle */}
      <div 
        class={styles.resizeHandle}
        onMouseDown={handleResizeStart}
      >
        <div class={styles.resizeGrip}>
          <div class={styles.gripDot}></div>
          <div class={styles.gripDot}></div>
          <div class={styles.gripDot}></div>
          <div class={styles.gripDot}></div>
          <div class={styles.gripDot}></div>
          <div class={styles.gripDot}></div>
        </div>
      </div>
    </div>
  )
}