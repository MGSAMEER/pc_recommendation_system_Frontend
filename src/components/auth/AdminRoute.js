import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Box, CircularProgress, Typography, Alert } from '@mui/material'
import { useAuth } from '../../hooks/useAuth'

const AdminRoute = ({ children, requiredRole = 'admin' }) => {
  const { user, isAuthenticated, loading } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 2
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="h6" color="text.secondary">
          Verifying access permissions...
        </Typography>
      </Box>
    )
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check if user has admin role
  const userRole = user?.role || 'user'
  const hasRequiredRole = requiredRole === 'admin' ? userRole === 'admin' : userRole !== 'user'

  if (!hasRequiredRole) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 3,
          px: 3
        }}
      >
        <Alert severity="warning" sx={{ maxWidth: 500, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Access Denied
          </Typography>
          <Typography variant="body2">
            You don't have permission to access this page.
            This area is restricted to {requiredRole} users only.
          </Typography>
        </Alert>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Navigate
            to={userRole === 'admin' ? '/admin/dashboard' : '/dashboard'}
            replace
          />
        </Box>
      </Box>
    )
  }

  // User has required permissions, render the protected content
  return children
}

export default AdminRoute

