import React, { createContext, useContext, useState } from 'react'
import Toast from '../components/Toast'

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = (message, options = {}) => {
    const id = Date.now() + Math.random()
    const toast = {
      id,
      message,
      severity: options.severity || 'info',
      title: options.title,
      autoHideDuration: options.autoHideDuration || 6000,
      ...options
    }

    setToasts(prev => [...prev, toast])

    // Auto-remove after duration
    if (toast.autoHideDuration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.autoHideDuration + 500) // Add buffer for animation
    }

    return id
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const showSuccess = (message, title = 'Success') => {
    return addToast(message, { severity: 'success', title })
  }

  const showError = (message, title = 'Error') => {
    return addToast(message, { severity: 'error', title, autoHideDuration: 8000 })
  }

  const showWarning = (message, title = 'Warning') => {
    return addToast(message, { severity: 'warning', title })
  }

  const showInfo = (message, title = 'Info') => {
    return addToast(message, { severity: 'info', title })
  }

  const value = {
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          open={true}
          onClose={() => removeToast(toast.id)}
          message={toast.message}
          severity={toast.severity}
          title={toast.title}
          autoHideDuration={toast.autoHideDuration}
          action={toast.action}
        />
      ))}
    </ToastContext.Provider>
  )
}

export default ToastContext
