import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Avatar,
  Divider,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { useAuth } from '../hooks/useAuth'
import { apiService } from '../services/api'

const Profile = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        email: user.email || ''
      }))
    }
  }, [user])

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
    if (error) setError('')
    if (message) setMessage('')
  }

  const handleUpdateProfile = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const updateData = {
        full_name: formData.fullName,
        email: formData.email
      }

      console.log('Updating profile with data:', updateData)
      await apiService.updateUserProfile(updateData)
      setMessage('Profile updated successfully!')

      // Update local user context if needed
      // The auth context should handle token refresh if email changed
    } catch (err) {
      console.error('Profile update error:', err)
      if (err.response?.data?.error) {
        setError(err.response.data.error.details || err.response.data.error.message)
      } else {
        setError('Failed to update profile. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match.')
      setLoading(false)
      return
    }

    if (formData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long.')
      setLoading(false)
      return
    }

    // Check for required character types
    const hasUpper = /[A-Z]/.test(formData.newPassword);
    const hasLower = /[a-z]/.test(formData.newPassword);
    const hasDigit = /\d/.test(formData.newPassword);

    if (!hasUpper || !hasLower || !hasDigit) {
      setError('New password must contain at least one uppercase letter, one lowercase letter, and one digit.')
      setLoading(false)
      return
    }

    try {
      const passwordData = {
        current_password: formData.currentPassword,
        new_password: formData.newPassword
      }

      console.log('Changing password with data:', { current_password: '***', new_password: '***' })
      await apiService.changePassword(passwordData)
      setMessage('Password changed successfully!')
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } catch (err) {
      console.error('Password change error:', err)
      if (err.response?.data?.error) {
        setError(err.response.data.error.details || err.response.data.error.message)
      } else {
        setError('Failed to change password. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" textAlign="center">
          Please log in to view your profile.
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" sx={{ mb: 6 }}>
        <Avatar
          sx={{
            width: 120,
            height: 120,
            mx: 'auto',
            mb: 3,
            bgcolor: 'primary.main',
            fontSize: '3rem'
          }}
        >
          {user.fullName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography variant="h4" component="h1" sx={{ mb: 1, color: 'common.white' }}>
          {user.fullName || 'User Profile'}
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.8, color: 'grey.300' }}>
          {user.email}
        </Typography>
      </Box>

      {/* Profile Update Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
            Update Profile Information
          </Typography>

          {message && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {message}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleUpdateProfile}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange('fullName')}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  disabled={loading}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Password Change Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
            Change Password
          </Typography>

          <Box component="form" onSubmit={handleChangePassword}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleInputChange('currentPassword')}
                  disabled={loading}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleInputChange('newPassword')}
                  disabled={loading}
                  required
                  helperText="Must be at least 8 characters"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  disabled={loading}
                  required
                  error={formData.newPassword !== formData.confirmPassword && formData.confirmPassword !== ''}
                  helperText={
                    formData.newPassword !== formData.confirmPassword && formData.confirmPassword !== ''
                      ? 'Passwords do not match'
                      : ''
                  }
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || formData.newPassword !== formData.confirmPassword}
                sx={{ minWidth: 120 }}
              >
                {loading ? 'Changing...' : 'Change Password'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
            Account Actions
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/settings')}
                sx={{ py: 1.5 }}
              >
                Account Settings
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={handleLogout}
                sx={{ py: 1.5 }}
              >
                Sign Out
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
            Account Information
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Member Since
              </Typography>
              <Typography variant="body1">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Account Status
              </Typography>
              <Typography variant="body1" color={user.isActive ? 'success.main' : 'error.main'}>
                {user.isActive ? 'Active' : 'Inactive'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Email Verified
              </Typography>
              <Typography variant="body1" color={user.isVerified ? 'success.main' : 'warning.main'}>
                {user.isVerified ? 'Verified' : 'Unverified'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Last Login
              </Typography>
              <Typography variant="body1">
                {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  )
}

export default Profile
