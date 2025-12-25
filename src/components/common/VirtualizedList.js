import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Box,
  List,
  ListItem,
  CircularProgress,
  Typography,
  useTheme
} from '@mui/material'

/**
 * VirtualizedList - Efficiently renders large lists with progressive loading
 * Uses virtualization to only render visible items for better performance
 */
const VirtualizedList = ({
  items = [],
  itemHeight = 60,
  containerHeight = 400,
  renderItem,
  loadMore,
  hasMore = false,
  loading = false,
  loadingComponent,
  emptyComponent,
  overscan = 5,
  onItemClick,
  sx = {}
}) => {
  const theme = useTheme()
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeightState, setContainerHeightState] = useState(containerHeight)
  const containerRef = useRef(null)

  // Calculate visible range
  const visibleRange = React.useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeightState) / itemHeight) + overscan
    )

    return { startIndex, endIndex }
  }, [scrollTop, itemHeight, containerHeightState, items.length, overscan])

  // Handle scroll
  const handleScroll = useCallback((event) => {
    const newScrollTop = event.target.scrollTop
    setScrollTop(newScrollTop)

    // Load more when approaching the end
    if (loadMore && hasMore && !loading) {
      const threshold = itemHeight * 10 // Load more when 10 items from end
      const scrollBottom = newScrollTop + containerHeightState
      const listBottom = items.length * itemHeight

      if (listBottom - scrollBottom < threshold) {
        loadMore()
      }
    }
  }, [itemHeight, containerHeightState, items.length, loadMore, hasMore, loading])

  // Update container height on resize
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeightState(containerRef.current.clientHeight)
      }
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  // Render visible items
  const visibleItems = React.useMemo(() => {
    const { startIndex, endIndex } = visibleRange
    return items.slice(startIndex, endIndex + 1).map((item, index) => {
      const actualIndex = startIndex + index
      return {
        item,
        index: actualIndex,
        style: {
          position: 'absolute',
          top: actualIndex * itemHeight,
          width: '100%',
          height: itemHeight
        }
      }
    })
  }, [items, visibleRange, itemHeight])

  // Loading component
  const defaultLoadingComponent = (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 4
      }}
    >
      <CircularProgress size={40} />
      <Typography variant="body2" sx={{ ml: 2 }}>
        Loading more items...
      </Typography>
    </Box>
  )

  // Empty component
  const defaultEmptyComponent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        textAlign: 'center'
      }}
    >
      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
        No items to display
      </Typography>
      <Typography variant="body2" color="text.secondary">
        There are no items available at the moment.
      </Typography>
    </Box>
  )

  return (
    <Box
      ref={containerRef}
      sx={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        ...sx
      }}
      onScroll={handleScroll}
    >
      {/* Total height placeholder */}
      <div
        style={{
          height: items.length * itemHeight,
          position: 'relative'
        }}
      >
        {/* Visible items */}
        {visibleItems.map(({ item, index, style }) => (
          <div key={index} style={style}>
            {renderItem ? (
              renderItem(item, index, onItemClick)
            ) : (
              <ListItem
                button={!!onItemClick}
                onClick={() => onItemClick && onItemClick(item, index)}
                sx={{
                  height: itemHeight,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  '&:hover': {
                    bgcolor: onItemClick ? theme.palette.action.hover : 'transparent'
                  }
                }}
              >
                <Typography variant="body2">
                  {typeof item === 'string' ? item : JSON.stringify(item)}
                </Typography>
              </ListItem>
            )}
          </div>
        ))}

        {/* Empty state */}
        {items.length === 0 && !loading && (
          emptyComponent || defaultEmptyComponent
        )}
      </div>

      {/* Loading indicator */}
      {loading && (loadingComponent || defaultLoadingComponent)}
    </Box>
  )
}

/**
 * InfiniteScrollList - Wrapper for infinite scrolling functionality
 */
export const InfiniteScrollList = ({
  fetchItems,
  renderItem,
  initialItems = [],
  itemHeight = 60,
  containerHeight = 400,
  emptyComponent,
  ...props
}) => {
  const [items, setItems] = useState(initialItems)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const newItems = await fetchItems(page + 1)
      if (newItems && newItems.length > 0) {
        setItems(prev => [...prev, ...newItems])
        setPage(prev => prev + 1)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error loading more items:', error)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [fetchItems, page, loading, hasMore])

  return (
    <VirtualizedList
      items={items}
      itemHeight={itemHeight}
      containerHeight={containerHeight}
      renderItem={renderItem}
      loadMore={loadMore}
      hasMore={hasMore}
      loading={loading}
      emptyComponent={emptyComponent}
      {...props}
    />
  )
}

/**
 * ProgressiveList - List that loads items progressively as user scrolls
 */
export const ProgressiveList = ({
  items = [],
  batchSize = 20,
  itemHeight = 60,
  containerHeight = 400,
  renderItem,
  onItemClick,
  ...props
}) => {
  const [visibleItems, setVisibleItems] = useState([])
  const [currentBatch, setCurrentBatch] = useState(0)

  useEffect(() => {
    // Load initial batch
    const initialBatch = items.slice(0, batchSize)
    setVisibleItems(initialBatch)
    setCurrentBatch(1)
  }, [items, batchSize])

  const loadMore = useCallback(() => {
    const nextBatch = currentBatch * batchSize
    const newItems = items.slice(nextBatch, nextBatch + batchSize)

    if (newItems.length > 0) {
      setVisibleItems(prev => [...prev, ...newItems])
      setCurrentBatch(prev => prev + 1)
    }
  }, [items, currentBatch, batchSize])

  return (
    <VirtualizedList
      items={visibleItems}
      itemHeight={itemHeight}
      containerHeight={containerHeight}
      renderItem={renderItem}
      loadMore={loadMore}
      hasMore={visibleItems.length < items.length}
      loading={false}
      onItemClick={onItemClick}
      {...props}
    />
  )
}

export default VirtualizedList

