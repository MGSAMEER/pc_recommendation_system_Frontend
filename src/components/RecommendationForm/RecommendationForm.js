import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  useTheme,
  Fade
} from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'
import recommendationService from '../../services/recommendationService'
import { useToast } from '../../contexts/ToastContext'
import analyticsService from '../../services/analyticsService'
import { FormSkeleton } from '../SkeletonLoader'


const validationSchema = yup.object({
  purpose: yup
    .string('Select a purpose')
    .required('Purpose is required'),
  budgetMin: yup
    .number('Enter minimum budget')
    .min(0, 'Budget must be positive')
    .required('Minimum budget is required'),
  budgetMax: yup
    .number('Enter maximum budget')
    .min(yup.ref('budgetMin'), 'Maximum budget must be greater than minimum')
    .required('Maximum budget is required'),
  performanceLevel: yup
    .string('Select performance level')
    .required('Performance level is required'),
})

const RecommendationForm = ({ onRecommendationsGenerated, loading: externalLoading = false }) => {
  const theme = useTheme()
  const { showError, showSuccess } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isLoading = loading || externalLoading

  const formik = useFormik({
    initialValues: {
      purpose: '',
      budgetMin: '',
      budgetMax: '',
      performanceLevel: '',
      preferredBrands: '',
      mustHaveFeatures: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await handleSubmit(values)
    },
  })

  const handleSubmit = async (values) => {
    setLoading(true)
    setError(null)

    try {
      // Generate session ID
      const sessionId = recommendationService.generateSessionId()

      // Prepare request data
      const requestData = {
        session_id: sessionId,
        purpose: values.purpose,
        budget: {
          min: parseFloat(values.budgetMin),
          max: parseFloat(values.budgetMax)
        },
        performance_level: values.performanceLevel,
        preferred_brands: values.preferredBrands
          ? values.preferredBrands.split(',').map(b => b.trim()).filter(b => b)
          : [],
        must_have_features: values.mustHaveFeatures
          ? values.mustHaveFeatures.split(',').map(f => f.trim()).filter(f => f)
          : []
      }

      // Validate request data
      const validation = recommendationService.validateRequirements(requestData)
      if (!validation.isValid) {
        showError(`Please check your input: ${validation.errors.join(', ')}`, 'Validation Error')
        setError(`Please check your input: ${validation.errors.join(', ')}`)
        return
      }

      // Call API
      const response = await recommendationService.getRecommendations(requestData)

      // Validate response
      if (!response.recommendations || !Array.isArray(response.recommendations)) {
        throw new Error('Invalid response format from server')
      }

      // Show success message
      showSuccess(`Found ${response.recommendations.length} PC recommendations!`, 'Success')

      // Track successful form submission
      analyticsService.trackFormInteraction('recommendation_form', 'submit_success', {
        recommendationsCount: response.recommendations.length,
        purpose: requestData.purpose,
        budget: requestData.budget,
        performanceLevel: requestData.performance_level
      })

      // Pass results to parent component
      if (onRecommendationsGenerated) {
        onRecommendationsGenerated(response, requestData)
      }

    } catch (err) {
      console.error('Error getting recommendations:', err)

      // Handle different error types
      let errorMessage = 'Failed to get recommendations. Please try again.'
      let errorTitle = 'Error'

      if (err.response) {
        // Server responded with error
        const status = err.response.status
        const data = err.response.data

        if (status === 400) {
          errorMessage = 'Invalid request. Please check your input and try again.'
          errorTitle = 'Invalid Request'
        } else if (status === 422) {
          errorMessage = 'Validation error. Please ensure all fields are filled correctly.'
          errorTitle = 'Validation Error'
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later.'
          errorTitle = 'Server Error'
        } else if (data?.error?.message) {
          errorMessage = data.error.message
        }
      } else if (err.request) {
        // Network error
        errorMessage = 'Network error. Please check your internet connection and try again.'
        errorTitle = 'Connection Error'
      }

      showError(errorMessage, errorTitle)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const purposes = [
    { value: 'gaming', label: 'Gaming' },
    { value: 'office', label: 'Office Work' },
    { value: 'creative', label: 'Creative Work (Video Editing, Graphics)' },
    { value: 'programming', label: 'Programming/Development' },
    { value: 'general', label: 'General Use' }
  ]

  const performanceLevels = [
    { value: 'basic', label: 'Basic - Web browsing, documents, light tasks' },
    { value: 'standard', label: 'Standard - Office work, multimedia, moderate gaming' },
    { value: 'high', label: 'High - Gaming, content creation, demanding tasks' },
    { value: 'professional', label: 'Professional - Video editing, 3D rendering, high-end gaming' }
  ]

  if (isLoading) {
    return <FormSkeleton />
  }

  return (
    <Fade in={!isLoading} timeout={300}>
      <Paper
        elevation={3}
        sx={{ p: 4, maxWidth: 600, mx: 'auto' }}
        role="main"
        aria-labelledby="form-title"
        aria-describedby="form-description"
      >
        <Typography
          id="form-title"
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
        >
          Find Your Perfect PC
        </Typography>
        <Typography
          id="form-description"
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          Tell us about your needs and we'll recommend the best PC configurations for you.
        </Typography>

      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
        {/* Purpose Selection */}
        <FormControl
          fullWidth
          margin="normal"
          error={formik.touched.purpose && Boolean(formik.errors.purpose)}
        >
          <InputLabel id="purpose-label">Primary Use</InputLabel>
          <Select
            labelId="purpose-label"
            id="purpose"
            name="purpose"
            value={formik.values.purpose}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Primary Use"
            aria-describedby={formik.touched.purpose && formik.errors.purpose ? "purpose-error" : undefined}
          >
            {purposes.map((purpose) => (
              <MenuItem key={purpose.value} value={purpose.value}>
                {purpose.label}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.purpose && formik.errors.purpose && (
            <Typography
              id="purpose-error"
              variant="caption"
              color="error"
              sx={{ mt: 1, ml: 2 }}
              role="alert"
            >
              {formik.errors.purpose}
            </Typography>
          )}
        </FormControl>

        {/* Budget Range */}
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            id="budgetMin"
            name="budgetMin"
            label="Minimum Budget ($)"
            type="number"
            value={formik.values.budgetMin}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.budgetMin && Boolean(formik.errors.budgetMin)}
            helperText={formik.touched.budgetMin && formik.errors.budgetMin}
          />
          <TextField
            fullWidth
            id="budgetMax"
            name="budgetMax"
            label="Maximum Budget ($)"
            type="number"
            value={formik.values.budgetMax}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.budgetMax && Boolean(formik.errors.budgetMax)}
            helperText={formik.touched.budgetMax && formik.errors.budgetMax}
          />
        </Box>

        {/* Performance Level */}
        <FormControl fullWidth margin="normal" error={formik.touched.performanceLevel && Boolean(formik.errors.performanceLevel)}>
          <InputLabel id="performance-label">Performance Level</InputLabel>
          <Select
            labelId="performance-label"
            id="performanceLevel"
            name="performanceLevel"
            value={formik.values.performanceLevel}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Performance Level"
          >
            {performanceLevels.map((level) => (
              <MenuItem key={level.value} value={level.value}>
                {level.label}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.performanceLevel && formik.errors.performanceLevel && (
            <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
              {formik.errors.performanceLevel}
            </Typography>
          )}
        </FormControl>

        {/* Optional Preferences */}
        <TextField
          fullWidth
          margin="normal"
          id="preferredBrands"
          name="preferredBrands"
          label="Preferred Brands (optional)"
          placeholder="e.g., NVIDIA, Intel, ASUS"
          helperText="Separate multiple brands with commas"
          value={formik.values.preferredBrands}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <TextField
          fullWidth
          margin="normal"
          id="mustHaveFeatures"
          name="mustHaveFeatures"
          label="Must-Have Features (optional)"
          placeholder="e.g., ray tracing, wifi 6, rgb lighting"
          helperText="Separate multiple features with commas"
          value={formik.values.mustHaveFeatures}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          disabled={loading}
          sx={{ mt: 3, mb: 2, py: 1.5 }}
          aria-describedby="submit-button-description"
        >
          {loading ? (
            <>
              <CircularProgress
                size={20}
                sx={{ mr: 1 }}
                aria-hidden="true"
              />
              Getting Recommendations...
            </>
          ) : (
            'Get Recommendations'
          )}
        </Button>
        <Typography
          id="submit-button-description"
          sx={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}
        >
          Submit your PC requirements to get personalized recommendations
        </Typography>
      </Box>

        {/* Helper Text */}
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          💡 Tip: Be specific about your budget and use case for better recommendations.
        </Typography>
      </Paper>
    </Fade>
  )
}

export default RecommendationForm
