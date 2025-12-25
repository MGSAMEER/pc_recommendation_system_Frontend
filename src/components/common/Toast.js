import React, { createContext, useContext, useState, useCallback } from 'react'
import {
  Snackbar,
  Alert,
  AlertTitle,
  IconButton,
  Box,
  useTheme
} from '@mui/material'
import {
  Close as CloseIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material'

// Toast Context
const ToastContext = createContext()

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])
  const theme = useTheme()

  const addToast = useCallback((toast) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2)
    const newToast = {
      id,
      open: true,
      autoHideDuration: 6000,
      ...toast
    }

    setToasts(prev => [...prev, newToast])

    // Auto-remove after duration
    if (newToast.autoHideDuration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.autoHideDuration)
    }

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.map(toast =>
      toast.id === id ? { ...toast, open: false } : toast
    ))

    // Remove from state after animation
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 300)
  }, [])

  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  // Convenience methods
  const success = useCallback((message, title, options = {}) => {
    return addToast({
      severity: 'success',
      message,
      title,
      ...options
    })
  }, [addToast])

  const error = useCallback((message, title, options = {}) => {
    return addToast({
      severity: 'error',
      message,
      title,
      ...options
    })
  }, [addToast])

  const warning = useCallback((message, title, options = {}) => {
    return addToast({
      severity: 'warning',
      message,
      title,
      ...options
    })
  }, [addToast])

  const info = useCallback((message, title, options = {}) => {
    return addToast({
      severity: 'info',
      message,
      title,
      ...options
    })
  }, [addToast])

  const value = {
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info
  }

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Render all toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
          theme={theme}
        />
      ))}
    </ToastContext.Provider>
  )
}

// Toast Component
const Toast = ({ toast, onClose, theme }) => {
  const getIcon = (severity) => {
    switch (severity) {
      case 'success':
        return <SuccessIcon />
      case 'error':
        return <ErrorIcon />
      case 'warning':
        return <WarningIcon />
      case 'info':
        return <InfoIcon />
      default:
        return null
    }
  }

  const getAnchorOrigin = (position) => {
    switch (position) {
      case 'top-left':
        return { vertical: 'top', horizontal: 'left' }
      case 'top-center':
        return { vertical: 'top', horizontal: 'center' }
      case 'top-right':
        return { vertical: 'top', horizontal: 'right' }
      case 'bottom-left':
        return { vertical: 'bottom', horizontal: 'left' }
      case 'bottom-center':
        return { vertical: 'bottom', horizontal: 'center' }
      case 'bottom-right':
        return { vertical: 'bottom', horizontal: 'right' }
      default:
        return { vertical: 'bottom', horizontal: 'left' }
    }
  }

  const anchorOrigin = getAnchorOrigin(toast.position || 'bottom-left')

  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={toast.autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      sx={{
        '& .MuiSnackbar-root': {
          bottom: theme.spacing(2),
          left: theme.spacing(2)
        }
      }}
    >
      <Alert
        severity={toast.severity}
        variant={toast.variant || 'filled'}
        icon={getIcon(toast.severity)}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={onClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        sx={{
          minWidth: 300,
          boxShadow: theme.shadows[8],
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        {toast.title && (
          <AlertTitle sx={{ mb: 0.5 }}>
            {toast.title}
          </AlertTitle>
        )}
        {toast.message}
      </Alert>
    </Snackbar>
  )
}

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Default export
export default ToastProvider

