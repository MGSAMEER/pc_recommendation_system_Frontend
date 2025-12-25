import React from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon
} from '@mui/icons-material'

/**
 * ErrorBoundary - Catches JavaScript errors in the component tree
 * Provides user-friendly error UI and recovery options
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2)
    }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    this.setState({
      error,
      errorInfo
    })

    // Report error to monitoring service (if available)
    this.reportError(error, errorInfo)
  }

  reportError = (error, errorInfo) => {
    // In a real application, send to error monitoring service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: this.state.errorId
    }

    // For now, just log to console
    console.error('Error Report:', errorReport)

    // TODO: Send to error monitoring service
    // errorMonitoringService.report(errorReport)
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      // Render error UI
      return <ErrorFallback
        error={this.state.error}
        errorInfo={this.state.errorInfo}
        errorId={this.state.errorId}
        onRetry={this.handleRetry}
        onReload={this.handleReload}
        onGoHome={this.handleGoHome}
        showDetails={process.env.NODE_ENV === 'development'}
      />
    }

    return this.props.children
  }
}

/**
 * ErrorFallback - The actual error UI component
 */
const ErrorFallback = ({
  error,
  errorInfo,
  errorId,
  onRetry,
  onReload,
  onGoHome,
  showDetails = false
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: theme.palette.grey[50],
        p: 2
      }}
    >
      <Paper
        elevation={4}
        sx={{
          maxWidth: 600,
          width: '100%',
          p: { xs: 3, md: 4 },
          textAlign: 'center',
          borderRadius: 2
        }}
      >
        {/* Error Icon */}
        <Box sx={{ mb: 3 }}>
          <ErrorIcon
            sx={{
              fontSize: isMobile ? 64 : 80,
              color: theme.palette.error.main
            }}
          />
        </Box>

        {/* Error Title */}
        <Typography
          variant="h4"
          component="h1"
          sx={{
            mb: 2,
            fontWeight: 'bold',
            color: theme.palette.error.main
          }}
        >
          Oops! Something went wrong
        </Typography>

        {/* Error Message */}
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            color: theme.palette.text.secondary,
            maxWidth: 500,
            mx: 'auto'
          }}
        >
          We encountered an unexpected error. Our team has been notified and is working to fix it.
        </Typography>

        {/* Error ID for support */}
        <Typography
          variant="body2"
          sx={{
            mb: 4,
            color: theme.palette.text.secondary,
            fontFamily: 'monospace',
            bgcolor: theme.palette.grey[100],
            py: 1,
            px: 2,
            borderRadius: 1,
            display: 'inline-block'
          }}
        >
          Error ID: {errorId}
        </Typography>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'center',
            mb: 3
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<RefreshIcon />}
            onClick={onRetry}
            sx={{
              minWidth: 140,
              textTransform: 'none'
            }}
          >
            Try Again
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<RefreshIcon />}
            onClick={onReload}
            sx={{
              minWidth: 140,
              textTransform: 'none'
            }}
          >
            Reload Page
          </Button>

          <Button
            variant="text"
            size="large"
            startIcon={<HomeIcon />}
            onClick={onGoHome}
            sx={{
              minWidth: 140,
              textTransform: 'none'
            }}
          >
            Go Home
          </Button>
        </Box>

        {/* Technical Details (Development Only) */}
        {showDetails && error && (
          <Box sx={{ mt: 4, textAlign: 'left' }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: theme.palette.error.main,
                fontWeight: 'bold'
              }}
            >
              Technical Details (Development Only)
            </Typography>

            <Box
              sx={{
                bgcolor: theme.palette.grey[900],
                color: theme.palette.common.white,
                p: 2,
                borderRadius: 1,
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                overflow: 'auto',
                maxHeight: 300
              }}
            >
              <Typography variant="body2" component="div" sx={{ mb: 2 }}>
                <strong>Error:</strong> {error.message}
              </Typography>

              <Typography variant="body2" component="div" sx={{ mb: 2 }}>
                <strong>Stack Trace:</strong>
              </Typography>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {error.stack}
              </pre>

              {errorInfo && errorInfo.componentStack && (
                <>
                  <Typography variant="body2" component="div" sx={{ mt: 2, mb: 1 }}>
                    <strong>Component Stack:</strong>
                  </Typography>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                    {errorInfo.componentStack}
                  </pre>
                </>
              )}
            </Box>
          </Box>
        )}

        {/* Footer Message */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 3 }}
        >
          If this problem persists, please contact support with the error ID above.
        </Typography>
      </Paper>
    </Box>
  )
}

export default ErrorBoundary

