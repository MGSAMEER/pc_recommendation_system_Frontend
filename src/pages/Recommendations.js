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
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Avatar
} from '@mui/material'
import { ExpandMore as ExpandMoreIcon, Build as BuildIcon } from '@mui/icons-material'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'

const Recommendations = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const navigate = useNavigate()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    purpose: '',
    budgetMin: '',
    budgetMax: '',
    performanceLevel: '',
    preferredBrands: '',
    maxRecommendations: 3
  })

  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    // Load user preferences if available
    loadUserPreferences()
  }, [])

  const loadUserPreferences = async () => {
    try {
      const response = await api.get('/users/preferences')
      const prefs = response.data

      setFormData(prev => ({
        ...prev,
        purpose: prefs.primary_use || '',
        budgetMin: prefs.budget_range?.min || '',
        budgetMax: prefs.budget_range?.max || '',
        performanceLevel: prefs.experience_level || '',
        preferredBrands: prefs.preferred_brands?.join(', ') || ''
      }))
    } catch (err) {
      // Preferences not set yet, use defaults
      console.log('No user preferences found, using defaults')
    }
  }

  const handleInputChange = (field) => (event) => {
    const value = event.target.value
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (error) setError('')
    if (success) setSuccess('')
  }

  const validateForm = () => {
    const errors = []

    if (!formData.purpose) errors.push('Please select a primary use')
    if (!formData.budgetMin || !formData.budgetMax) errors.push('Please enter budget range')
    if (parseFloat(formData.budgetMin) >= parseFloat(formData.budgetMax)) {
      errors.push('Minimum budget must be less than maximum budget')
    }
    if (!formData.performanceLevel) errors.push('Please select performance level')

    return errors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setRecommendations([])

    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setError(validationErrors.join('. '))
      return
    }

    setLoading(true)

    try {
      const requestData = {
        session_id: `session_${Date.now()}`,
        purpose: formData.purpose,
        budget: {
          min: parseFloat(formData.budgetMin),
          max: parseFloat(formData.budgetMax)
        },
        performance_level: formData.performanceLevel,
        preferred_brands: formData.preferredBrands
          ? formData.preferredBrands.split(',').map(b => b.trim()).filter(b => b)
          : [],
        max_recommendations: formData.maxRecommendations
      }

      // Save user preferences
      const preferencesData = {
        experience_level: formData.performanceLevel,
        primary_use: formData.purpose,
        budget_range: {
          min: parseFloat(formData.budgetMin),
          max: parseFloat(formData.budgetMax)
        },
        preferred_brands: formData.preferredBrands
          ? formData.preferredBrands.split(',').map(b => b.trim()).filter(b => b)
          : []
      }

      try {
        await api.put('/users/preferences', preferencesData)
        console.log('User preferences saved')
      } catch (prefError) {
        console.warn('Could not save preferences:', prefError)
        // Continue with recommendation even if preferences save fails
      }

      const response = await api.post('/recommendations', requestData)
      const data = response.data

      setRecommendations(data.recommendations || [])
      setSuccess(`Found ${data.recommendations?.length || 0} recommendations!`)
      setExpanded(true)

    } catch (err) {
      console.error('Recommendation error:', err)
      if (err.response?.data?.error) {
        setError(err.response.data.error.details || err.response.data.error.message)
      } else {
        setError('Failed to get recommendations. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCompare = (recommendation) => {
    // Store in localStorage for comparison
    const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]')
    const exists = comparisonList.find(item => item.configuration_id === recommendation.configuration_id)

    if (!exists) {
      comparisonList.push(recommendation)
      localStorage.setItem('comparisonList', JSON.stringify(comparisonList))
      setSuccess('Added to comparison!')
      setTimeout(() => setSuccess(''), 2000)
    } else {
      setError('Already in comparison list')
      setTimeout(() => setError(''), 2000)
    }
  }

  const purposes = [
    { value: 'gaming', label: 'Gaming', description: 'High-performance gaming PCs' },
    { value: 'office', label: 'Office Work', description: 'Productive office and business use' },
    { value: 'creative', label: 'Creative Work', description: 'Video editing, 3D modeling, design' },
    { value: 'programming', label: 'Programming', description: 'Development and coding tasks' },
    { value: 'general', label: 'General Use', description: 'Web browsing, media consumption' }
  ]

  const performanceLevels = [
    { value: 'basic', label: 'Basic', description: 'Entry-level performance' },
    { value: 'standard', label: 'Standard', description: 'Balanced performance' },
    { value: 'high', label: 'High', description: 'High-end performance' },
    { value: 'professional', label: 'Professional', description: 'Professional-grade performance' }
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 600, color: 'common.white' }}>
          Get PC Recommendations
        </Typography>
        <Typography variant="body1" sx={{ color: 'secondary.contrastText', opacity: 0.9 }}>
          Tell us about your needs and we'll recommend the perfect PC configuration for you.
        </Typography>
      </Box>

      {/* Recommendation Form */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
            Your Requirements
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Primary Use */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Primary Use</InputLabel>
                  <Select
                    value={formData.purpose}
                    onChange={handleInputChange('purpose')}
                    label="Primary Use"
                  >
                    {purposes.map((purpose) => (
                      <MenuItem key={purpose.value} value={purpose.value}>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {purpose.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {purpose.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Performance Level */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Performance Level</InputLabel>
                  <Select
                    value={formData.performanceLevel}
                    onChange={handleInputChange('performanceLevel')}
                    label="Performance Level"
                  >
                    {performanceLevels.map((level) => (
                      <MenuItem key={level.value} value={level.value}>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {level.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {level.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Budget Range */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Minimum Budget ($)"
                  type="number"
                  value={formData.budgetMin}
                  onChange={handleInputChange('budgetMin')}
                  required
                  inputProps={{ min: 0, step: 50 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Maximum Budget ($)"
                  type="number"
                  value={formData.budgetMax}
                  onChange={handleInputChange('budgetMax')}
                  required
                  inputProps={{ min: 0, step: 50 }}
                />
              </Grid>

              {/* Preferred Brands */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Preferred Brands (optional)"
                  value={formData.preferredBrands}
                  onChange={handleInputChange('preferredBrands')}
                  placeholder="e.g., NVIDIA, AMD, Intel (comma-separated)"
                  helperText="Leave empty for no brand preference"
                />
              </Grid>

              {/* Max Recommendations */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Number of Recommendations</InputLabel>
                  <Select
                    value={formData.maxRecommendations}
                    onChange={handleInputChange('maxRecommendations')}
                    label="Number of Recommendations"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <MenuItem key={num} value={num}>
                        {num} recommendation{num > 1 ? 's' : ''}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ minWidth: 200, py: 1.5 }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Getting Recommendations...
                  </>
                ) : (
                  'Get Recommendations'
                )}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Recommendations Results */}
      {recommendations.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
              Your Recommendations
            </Typography>

            <Grid container spacing={3}>
              {recommendations.map((rec, index) => (
                <Grid item xs={12} key={rec.configuration_id || index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          <BuildIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" component="h3">
                            {rec.name || `Recommendation ${index + 1}`}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ${rec.total_price} • {rec.confidence_score}% match
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Chip
                          label={`${rec.confidence_score}% Match`}
                          color={rec.confidence_score >= 80 ? 'success' : rec.confidence_score >= 60 ? 'warning' : 'error'}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          label={`$${rec.total_price}`}
                          variant="outlined"
                          size="small"
                        />
                      </Box>

                      {/* Match Reasons */}
                      {rec.match_reasons && rec.match_reasons.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                            Why this PC?
                          </Typography>
                          {rec.match_reasons.map((reason, idx) => (
                            <Chip
                              key={idx}
                              label={reason.explanation}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 1, mb: 1 }}
                            />
                          ))}
                        </Box>
                      )}

                      {/* Components */}
                      {rec.components && rec.components.length > 0 && (
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="body2" fontWeight={600}>
                              Components ({rec.components.length})
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <List dense>
                              {rec.components.map((component, idx) => (
                                <ListItem key={idx}>
                                  <ListItemText
                                    primary={`${component.name} (${component.type})`}
                                    secondary={`$${component.price} • ${component.brand}`}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </AccordionDetails>
                        </Accordion>
                      )}
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => handleCompare(rec)}>
                        Add to Compare
                      </Button>
                      <Button size="small" variant="outlined">
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/compare')}
                disabled={JSON.parse(localStorage.getItem('comparisonList') || '[]').length < 2}
              >
                Compare Selected PCs ({JSON.parse(localStorage.getItem('comparisonList') || '[]').length})
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  )
}

export default Recommendations
