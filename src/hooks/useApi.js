import { useState, useCallback, useEffect } from 'react'
import api, { apiService } from '../services/api'

/**
 * useApi - Custom hook for API calls with loading states and error handling
 * Provides consistent loading, error, and success states for all API operations
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const execute = useCallback(async (apiCall, options = {}) => {
    const {
      onSuccess,
      onError,
      showLoading = true,
      resetData = true
    } = options

    try {
      if (showLoading) setLoading(true)
      if (resetData) setData(null)
      setError(null)

      const result = await apiCall()
      setData(result.data)

      if (onSuccess) {
        onSuccess(result.data, result)
      }

      return { success: true, data: result.data, response: result }
    } catch (err) {
      const data = err?.response?.data
      const errorMessage =
        (typeof data?.detail === 'string' && data.detail) ||
        (Array.isArray(data?.detail) && data.detail.map((x) => x?.msg || x?.message || String(x)).join('; ')) ||
        data?.message ||
        data?.error?.message ||
        err.message ||
        'An error occurred'
      setError(errorMessage)

      if (onError) {
        onError(err)
      }

      return { success: false, error: errorMessage, originalError: err }
    } finally {
      if (showLoading) setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setData(null)
  }, [])

  return {
    loading,
    error,
    data,
    execute,
    reset,
    setError,
    setData
  }
}

/**
 * useApiCall - Hook for specific API endpoints with built-in loading states
 */
export const useApiCall = (apiFunction, options = {}) => {
  const { autoExecute = false, initialData = null, ...apiOptions } = options
  const api = useApi()

  const execute = useCallback((...args) => {
    return api.execute(() => apiFunction(...args), apiOptions)
  }, [api, apiFunction, apiOptions])

  // Auto-execute if requested
  useEffect(() => {
    if (autoExecute) {
      execute()
    }
  }, [autoExecute, execute])

  // Set initial data if provided
  useEffect(() => {
    if (initialData !== null) {
      api.setData(initialData)
    }
  }, [initialData, api])

  return {
    ...api,
    execute,
    refetch: execute
  }
}

/**
 * Predefined hooks for common API operations
 */
export const useHealthCheck = () => {
  return useApiCall(apiService.health, { autoExecute: false })
}

export const useSignup = () => {
  return useApiCall(apiService.signup, { autoExecute: false })
}

export const useLogin = () => {
  return useApiCall(apiService.login, { autoExecute: false })
}

export const useLogout = () => {
  return useApiCall(apiService.logout, { autoExecute: false })
}

export const useGetUser = () => {
  return useApiCall(apiService.getMe, { autoExecute: false })
}

export const useUpdateProfile = () => {
  return useApiCall(apiService.updateUserProfile, { autoExecute: false })
}

export const useChangePassword = () => {
  return useApiCall(apiService.changePassword, { autoExecute: false })
}

export const useCreateRecommendation = () => {
  return useApiCall(apiService.createRecommendations, { autoExecute: false })
}

export const useGetRecommendation = (id) => {
  return useApiCall(() => apiService.getRecommendation(id), { autoExecute: false })
}

export const useListComponents = (params = {}) => {
  return useApiCall(() => apiService.listComponents(params), { autoExecute: false })
}

export const useGetComponent = (id) => {
  return useApiCall(() => apiService.getComponent(id), { autoExecute: false })
}

export const useSubmitFeedback = () => {
  return useApiCall(apiService.submitFeedback, { autoExecute: false })
}

/**
 * useApiStatus - Hook for tracking multiple API calls status
 */
export const useApiStatus = () => {
  const [operations, setOperations] = useState({})

  const trackOperation = useCallback((operationId, status) => {
    setOperations(prev => ({
      ...prev,
      [operationId]: {
        ...prev[operationId],
        ...status,
        timestamp: Date.now()
      }
    }))
  }, [])

  const clearOperation = useCallback((operationId) => {
    setOperations(prev => {
      const newOps = { ...prev }
      delete newOps[operationId]
      return newOps
    })
  }, [])

  const isLoading = useCallback((operationId) => {
    return operations[operationId]?.loading || false
  }, [operations])

  const getError = useCallback((operationId) => {
    return operations[operationId]?.error || null
  }, [operations])

  const hasError = useCallback((operationId) => {
    return !!operations[operationId]?.error
  }, [operations])

  return {
    operations,
    trackOperation,
    clearOperation,
    isLoading,
    getError,
    hasError
  }
}

export default useApi

