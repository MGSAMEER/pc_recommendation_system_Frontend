import { useState, useEffect, useCallback } from 'react'

/**
 * useOffline - Hook for detecting online/offline status
 * Provides current connectivity status and utilities for offline handling
 */
export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [wasOffline, setWasOffline] = useState(false)
  const [connectionInfo, setConnectionInfo] = useState({
    effectiveType: 'unknown',
    downlink: 0,
    rtt: 0
  })

  // Update online status
  const updateOnlineStatus = useCallback(() => {
    const online = navigator.onLine
    setIsOnline(online)

    if (!online && isOnline) {
      setWasOffline(true)
    }
  }, [isOnline])

  // Update connection information
  const updateConnectionInfo = useCallback(() => {
    if ('connection' in navigator) {
      const connection = navigator.connection
      setConnectionInfo({
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0
      })
    }
  }, [])

  // Check actual connectivity by making a small request
  const checkConnectivity = useCallback(async () => {
    if (!navigator.onLine) {
      setIsOnline(false)
      return false
    }

    try {
      // Try to fetch a small resource to verify actual connectivity
      const response = await fetch('/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache'
      })
      const online = response.ok
      setIsOnline(online)
      return online
    } catch (error) {
      setIsOnline(false)
      return false
    }
  }, [])

  // Attempt to reconnect
  const attemptReconnect = useCallback(async () => {
    const connected = await checkConnectivity()
    if (connected) {
      setWasOffline(false)
    }
    return connected
  }, [checkConnectivity])

  // Get connection quality assessment
  const getConnectionQuality = useCallback(() => {
    const { effectiveType, downlink } = connectionInfo

    if (!isOnline) return 'offline'

    switch (effectiveType) {
      case '4g':
        return downlink >= 5 ? 'excellent' : downlink >= 2 ? 'good' : 'fair'
      case '3g':
        return downlink >= 1 ? 'fair' : 'poor'
      case '2g':
      case 'slow-2g':
        return 'poor'
      default:
        // Fallback to downlink speed
        if (downlink >= 10) return 'excellent'
        if (downlink >= 5) return 'good'
        if (downlink >= 2) return 'fair'
        if (downlink >= 1) return 'poor'
        return 'very-poor'
    }
  }, [isOnline, connectionInfo])

  // Setup event listeners
  useEffect(() => {
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Update connection info initially and on changes
    updateConnectionInfo()

    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', updateConnectionInfo)
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)

      if ('connection' in navigator) {
        navigator.connection.removeEventListener('change', updateConnectionInfo)
      }
    }
  }, [updateOnlineStatus, updateConnectionInfo])

  return {
    isOnline,
    isOffline: !isOnline,
    wasOffline,
    connectionInfo,
    connectionQuality: getConnectionQuality(),
    checkConnectivity,
    attemptReconnect
  }
}

/**
 * useOfflineStorage - Hook for managing offline data storage
 */
export const useOfflineStorage = (key) => {
  const [storedData, setStoredData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const data = localStorage.getItem(key)
      if (data) {
        setStoredData(JSON.parse(data))
      }
    } catch (error) {
      console.error('Error loading offline data:', error)
    } finally {
      setLoading(false)
    }
  }, [key])

  // Save data to localStorage
  const saveData = useCallback((data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
      setStoredData(data)
      return true
    } catch (error) {
      console.error('Error saving offline data:', error)
      return false
    }
  }, [key])

  // Clear stored data
  const clearData = useCallback(() => {
    try {
      localStorage.removeItem(key)
      setStoredData(null)
      return true
    } catch (error) {
      console.error('Error clearing offline data:', error)
      return false
    }
  }, [key])

  // Check if data exists
  const hasData = useCallback(() => {
    return storedData !== null
  }, [storedData])

  return {
    data: storedData,
    loading,
    saveData,
    clearData,
    hasData
  }
}

/**
 * useOfflineQueue - Hook for queuing actions when offline
 */
export const useOfflineQueue = (key = 'offline-queue') => {
  const [queue, setQueue] = useState([])
  const { isOnline, attemptReconnect } = useOffline()

  // Load queue from storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        setQueue(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading offline queue:', error)
    }
  }, [key])

  // Save queue to storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(queue))
    } catch (error) {
      console.error('Error saving offline queue:', error)
    }
  }, [queue, key])

  // Add action to queue
  const addToQueue = useCallback((action) => {
    const queueItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      action,
      timestamp: Date.now(),
      retries: 0
    }

    setQueue(prev => [...prev, queueItem])
    return queueItem.id
  }, [])

  // Remove action from queue
  const removeFromQueue = useCallback((id) => {
    setQueue(prev => prev.filter(item => item.id !== id))
  }, [])

  // Process queue when back online
  const processQueue = useCallback(async () => {
    if (!isOnline || queue.length === 0) return

    const results = []

    for (const item of queue) {
      try {
        await item.action()
        removeFromQueue(item.id)
        results.push({ id: item.id, success: true })
      } catch (error) {
        // Increment retry count
        setQueue(prev => prev.map(q =>
          q.id === item.id ? { ...q, retries: q.retries + 1 } : q
        ))
        results.push({ id: item.id, success: false, error })
      }
    }

    return results
  }, [isOnline, queue, removeFromQueue])

  // Process queue when coming back online
  useEffect(() => {
    if (isOnline && queue.length > 0) {
      processQueue()
    }
  }, [isOnline, queue.length, processQueue])

  return {
    queue,
    queueLength: queue.length,
    addToQueue,
    removeFromQueue,
    processQueue,
    clearQueue: useCallback(() => setQueue([]), [])
  }
}

/**
 * useOfflineSync - Hook for syncing data when back online
 */
export const useOfflineSync = (syncFunction, options = {}) => {
  const { autoSync = true, syncInterval = 30000 } = options
  const { isOnline } = useOffline()
  const [lastSync, setLastSync] = useState(null)
  const [syncing, setSyncing] = useState(false)

  const sync = useCallback(async () => {
    if (!isOnline || syncing) return

    setSyncing(true)
    try {
      await syncFunction()
      setLastSync(Date.now())
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      setSyncing(false)
    }
  }, [isOnline, syncing, syncFunction])

  // Auto-sync when coming back online
  useEffect(() => {
    if (autoSync && isOnline && !lastSync) {
      sync()
    }
  }, [autoSync, isOnline, lastSync, sync])

  // Periodic sync
  useEffect(() => {
    if (!autoSync || !isOnline || syncInterval <= 0) return

    const interval = setInterval(() => {
      sync()
    }, syncInterval)

    return () => clearInterval(interval)
  }, [autoSync, isOnline, syncInterval, sync])

  return {
    sync,
    syncing,
    lastSync,
    isOnline
  }
}

export default useOffline

