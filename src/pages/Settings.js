import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material'
import {
  ExpandMore as ExpandMoreIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'

const Settings = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [preferences, setPreferences] = useState({
    experience_level: 'beginner',
    primary_use: 'general',
    budget_range: { min: 500, max: 2000 },
    preferred_brands: [],
    must_have_features: [],
    avoided_features: []
  })

  const [notifications, setNotifications] = useState({
    email_recommendations: true,
    email_updates: false,
    email_marketing: false
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      // Load user preferences
      const prefsResponse = await api.get('/users/preferences')
      if (prefsResponse.data) {
        setPreferences(prefsResponse.data)
      }

      // Load notification settings (mock for now)
      setNotifications({
        email_recommendations: true,
        email_updates: false,
        email_marketing: false
      })
    } catch (err) {
      console.error('Error loading settings:', err)
      // Use defaults if not set
    }
  }

  const handlePreferenceChange = (field) => (event) => {
    const value = event.target.value
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }))
    if (error) setError('')
    if (message) setMessage('')
  }

  const handleBudgetChange = (field) => (event) => {
    const value = parseFloat(event.target.value) || 0
    setPreferences(prev => ({
      ...prev,
      budget_range: {
        ...prev.budget_range,
        [field]: value
      }
    }))
  }

  const handleNotificationChange = (field) => (event) => {
    setNotifications(prev => ({
      ...prev,
      [field]: event.target.checked
    }))
  }

  const handleSavePreferences = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      await api.put('/users/preferences', preferences)
      setMessage('Preferences saved successfully!')
    } catch (err) {
      console.error('Error saving preferences:', err)
      setError('Failed to save preferences. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNotifications = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      // Mock API call for notifications
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Notification settings saved successfully!')
    } catch (err) {
      setError('Failed to save notification settings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setLoading(true)
    try {
      await api.post('/api/v1/users/delete', {
        reason: 'user_request',
        feedback: 'Requested via settings page'
      })
      await logout()
      navigate('/')
    } catch (err) {
      console.error('Error deleting account:', err)
      setError('Failed to delete account. Please contact support.')
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" textAlign="center">
          Please log in to access settings.
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 1, color: 'common.white' }}>
          Account Settings
        </Typography>
        <Typography variant="body1" sx={{ color: 'grey.300' }}>
          Manage your account preferences and security settings
        </Typography>
      </Box>

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

      {/* PC Preferences */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
            PC Building Preferences
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Experience Level</InputLabel>
                <Select
                  value={preferences.experience_level}
                  onChange={handlePreferenceChange('experience_level')}
                  label="Experience Level"
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Primary Use</InputLabel>
                <Select
                  value={preferences.primary_use}
                  onChange={handlePreferenceChange('primary_use')}
                  label="Primary Use"
                >
                  <MenuItem value="gaming">Gaming</MenuItem>
                  <MenuItem value="office">Office Work</MenuItem>
                  <MenuItem value="creative">Creative Work</MenuItem>
                  <MenuItem value="programming">Programming</MenuItem>
                  <MenuItem value="general">General Use</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Minimum Budget ($)"
                type="number"
                value={preferences.budget_range.min}
                onChange={handleBudgetChange('min')}
                inputProps={{ min: 0, step: 50 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Maximum Budget ($)"
                type="number"
                value={preferences.budget_range.max}
                onChange={handleBudgetChange('max')}
                inputProps={{ min: 0, step: 50 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Preferred Brands (comma-separated)"
                value={preferences.preferred_brands.join(', ')}
                onChange={(e) => {
                  const brands = e.target.value.split(',').map(b => b.trim()).filter(b => b)
                  setPreferences(prev => ({ ...prev, preferred_brands: brands }))
                }}
                placeholder="e.g., NVIDIA, AMD, Intel"
                helperText="Leave empty for no brand preference"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleSavePreferences}
              disabled={loading}
            >
              Save Preferences
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <NotificationsIcon sx={{ mr: 1 }} />
            Notification Settings
          </Typography>

          <List>
            <ListItem>
              <ListItemText
                primary="Recommendation Updates"
                secondary="Receive notifications about new PC recommendations"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={notifications.email_recommendations}
                  onChange={handleNotificationChange('email_recommendations')}
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemText
                primary="Product Updates"
                secondary="Get notified about new features and improvements"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={notifications.email_updates}
                  onChange={handleNotificationChange('email_updates')}
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemText
                primary="Marketing Communications"
                secondary="Receive promotional emails and special offers"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={notifications.email_marketing}
                  onChange={handleNotificationChange('email_marketing')}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              onClick={handleSaveNotifications}
              disabled={loading}
            >
              Save Notification Settings
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Account Management */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <SecurityIcon sx={{ mr: 1 }} />
            Account Management
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/profile')}
                sx={{ py: 1.5 }}
              >
                Edit Profile
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={() => setDeleteDialogOpen(true)}
                sx={{ py: 1.5 }}
              >
                Delete Account
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardContent>
          <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
            Account Information
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">
                {user.email}
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
                Member Since
              </Typography>
              <Typography variant="body1">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Delete Account Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete your account? This action cannot be undone.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your account will be permanently deleted within 30 days. You can cancel this request by logging back in during this period.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Settings