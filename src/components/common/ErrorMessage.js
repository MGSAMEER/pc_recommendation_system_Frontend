import React, { useState } from 'react'
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Collapse,
  IconButton,
  Typography,
  useTheme
} from '@mui/material'
import {
  ErrorOutline as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Close as CloseIcon,
  Refresh as RetryIcon
} from '@mui/icons-material'

/**
 * ErrorMessage - Comprehensive error handling component
 * Supports different error types, retry functionality, and collapsible details
 */
const ErrorMessage = ({
  error,
  title,
  message,
  severity = 'error', // 'error', 'warning', 'info', 'success'
  onRetry,
  retryLabel = 'Try Again',
  showRetry = true,
  showDetails = true,
  collapsible = true,
  autoHide = false,
  autoHideDelay = 5000,
  onClose,
  sx = {}
}) => {
  const theme = useTheme()
  const [showDetailsExpanded, setShowDetailsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  // Auto-hide functionality
  React.useEffect(() => {
    if (autoHide && autoHideDelay > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose && onClose()
      }, autoHideDelay)
      return () => clearTimeout(timer)
    }
  }, [autoHide, autoHideDelay, onClose])

  const handleClose = () => {
    setIsVisible(false)
    onClose && onClose()
  }

  const handleRetry = () => {
    onRetry && onRetry()
  }

  // Get icon based on severity
  const getIcon = () => {
    switch (severity) {
      case 'error':
        return <ErrorIcon />
      case 'warning':
        return <WarningIcon />
      case 'info':
        return <InfoIcon />
      case 'success':
        return <SuccessIcon />
      default:
        return <ErrorIcon />
    }
  }

  // Get default title if not provided
  const getDefaultTitle = () => {
    switch (severity) {
      case 'error':
        return 'Something went wrong'
      case 'warning':
        return 'Warning'
      case 'info':
        return 'Information'
      case 'success':
        return 'Success'
      default:
        return 'Message'
    }
  }

  // Extract error details
  const getErrorDetails = () => {
    if (!error) return null

    if (typeof error === 'string') {
      return error
    }

    if (error.response?.data?.detail) {
      return error.response.data.detail
    }

    if (error.message) {
      return error.message
    }

    return JSON.stringify(error, null, 2)
  }

  const errorDetails = getErrorDetails()
  const displayTitle = title || getDefaultTitle()

  if (!isVisible) return null

  return (
    <Collapse in={isVisible}>
      <Alert
        severity={severity}
        icon={getIcon()}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            {showRetry && onRetry && (
              <Button
                size="small"
                startIcon={<RetryIcon />}
                onClick={handleRetry}
                sx={{ color: 'inherit' }}
              >
                {retryLabel}
              </Button>
            )}
            {onClose && (
              <IconButton
                size="small"
                onClick={handleClose}
                sx={{ color: 'inherit' }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        }
        sx={{
          mb: 2,
          '& .MuiAlert-message': {
            width: '100%'
          },
          ...sx
        }}
      >
        <AlertTitle sx={{ mb: 1 }}>{displayTitle}</AlertTitle>

        {message && (
          <Typography variant="body2" sx={{ mb: errorDetails && showDetails ? 2 : 0 }}>
            {message}
          </Typography>
        )}

        {errorDetails && showDetails && (
          <Box>
            {collapsible ? (
              <Box>
                <Button
                  size="small"
                  onClick={() => setShowDetailsExpanded(!showDetailsExpanded)}
                  sx={{
                    p: 0,
                    minWidth: 'auto',
                    textTransform: 'none',
                    color: 'inherit',
                    '&:hover': { bgcolor: 'transparent' }
                  }}
                >
                  {showDetailsExpanded ? 'Hide details' : 'Show details'}
                </Button>
                <Collapse in={showDetailsExpanded}>
                  <Box
                    sx={{
                      mt: 1,
                      p: 2,
                      bgcolor: theme.palette.grey[100],
                      borderRadius: 1,
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      whiteSpace: 'pre-wrap',
                      overflow: 'auto',
                      maxHeight: 200
                    }}
                  >
                    {errorDetails}
                  </Box>
                </Collapse>
              </Box>
            ) : (
              <Box
                sx={{
                  mt: 1,
                  p: 2,
                  bgcolor: theme.palette.grey[100],
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  whiteSpace: 'pre-wrap',
                  overflow: 'auto',
                  maxHeight: 200
                }}
              >
                {errorDetails}
              </Box>
            )}
          </Box>
        )}
      </Alert>
    </Collapse>
  )
}

/**
 * Predefined error components for common scenarios
 */
export const NetworkError = ({ onRetry }) => (
  <ErrorMessage
    title="Connection Error"
    message="Unable to connect to the server. Please check your internet connection and try again."
    severity="error"
    onRetry={onRetry}
    showRetry={true}
  />
)

export const AuthError = ({ onRetry }) => (
  <ErrorMessage
    title="Authentication Required"
    message="You need to be logged in to access this feature."
    severity="warning"
    onRetry={onRetry}
    retryLabel="Sign In"
    showRetry={true}
  />
)

export const PermissionError = ({ onRetry }) => (
  <ErrorMessage
    title="Access Denied"
    message="You don't have permission to access this resource."
    severity="error"
    onRetry={onRetry}
    retryLabel="Go Back"
    showRetry={true}
  />
)

export const ServerError = ({ onRetry }) => (
  <ErrorMessage
    title="Server Error"
    message="The server encountered an error while processing your request. Please try again later."
    severity="error"
    onRetry={onRetry}
    showRetry={true}
  />
)

export default ErrorMessage

