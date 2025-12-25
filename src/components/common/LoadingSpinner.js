import React from 'react'
import {
  Box,
  CircularProgress,
  Typography,
  LinearProgress,
  Skeleton,
  useTheme
} from '@mui/material'

/**
 * LoadingSpinner - Versatile loading component with multiple styles
 * Supports circular spinner, linear progress, and skeleton loaders
 */
const LoadingSpinner = ({
  size = 40,
  thickness = 3.6,
  color = 'primary',
  variant = 'circular', // 'circular', 'linear', 'skeleton'
  message = 'Loading...',
  showMessage = true,
  fullScreen = false,
  height = 'auto',
  sx = {}
}) => {
  const theme = useTheme()

  // Full screen loading overlay
  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          ...sx
        }}
      >
        <CircularProgress
          size={size * 1.5}
          thickness={thickness}
          color={color}
          sx={{ mb: showMessage ? 3 : 0 }}
        />
        {showMessage && (
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ textAlign: 'center', maxWidth: 300 }}
          >
            {message}
          </Typography>
        )}
      </Box>
    )
  }

  // Linear progress bar
  if (variant === 'linear') {
    return (
      <Box sx={{ width: '100%', ...sx }}>
        <LinearProgress
          color={color}
          sx={{
            height: thickness * 2,
            borderRadius: 1,
            '& .MuiLinearProgress-bar': {
              borderRadius: 1
            }
          }}
        />
        {showMessage && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, textAlign: 'center' }}
          >
            {message}
          </Typography>
        )}
      </Box>
    )
  }

  // Skeleton loader
  if (variant === 'skeleton') {
    return (
      <Box sx={{ width: '100%', ...sx }}>
        <Skeleton
          variant="rectangular"
          height={height}
          sx={{
            borderRadius: 1,
            bgcolor: theme.palette.grey[200]
          }}
        />
        {showMessage && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, textAlign: 'center' }}
          >
            {message}
          </Typography>
        )}
      </Box>
    )
  }

  // Default circular spinner
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: height === 'auto' ? 'auto' : height,
        py: height === 'auto' ? 4 : 0,
        ...sx
      }}
    >
      <CircularProgress
        size={size}
        thickness={thickness}
        color={color}
        sx={{ mb: showMessage ? 2 : 0 }}
      />
      {showMessage && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center' }}
        >
          {message}
        </Typography>
      )}
    </Box>
  )
}

/**
 * Predefined loading components for common use cases
 */
export const PageLoading = ({ message = 'Loading page...' }) => (
  <LoadingSpinner
    fullScreen
    size={60}
    message={message}
  />
)

export const ButtonLoading = ({ size = 20, color = 'inherit' }) => (
  <CircularProgress
    size={size}
    color={color}
    thickness={4}
  />
)

export const InlineLoading = ({ message = 'Loading...', size = 24 }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <CircularProgress size={size} thickness={4} />
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  </Box>
)

export const CardSkeleton = ({ height = 200 }) => (
  <Box sx={{ p: 2 }}>
    <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
    <Skeleton variant="text" sx={{ mb: 1 }} />
    <Skeleton variant="text" width="60%" sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" height={height} />
  </Box>
)

export default LoadingSpinner

