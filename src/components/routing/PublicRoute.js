import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

/**
 * PublicRoute component - ensures certain routes are accessible to unauthenticated users
 * Redirects authenticated users away from public-only pages like login/signup
 */
const PublicRoute = ({ children, redirectTo = '/dashboard' }) => {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  // If user is authenticated, redirect them away from public pages
  if (isAuthenticated) {
    // Preserve the intended destination
    const from = location.state?.from?.pathname || redirectTo
    return <Navigate to={from} replace />
  }

  // Allow unauthenticated users to access the public route
  return children
}

export default PublicRoute

