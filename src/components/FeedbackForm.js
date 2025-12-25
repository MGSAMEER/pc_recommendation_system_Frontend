import React, { useState } from 'react'
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  CircularProgress
} from '@mui/material'
import { useToast } from '../contexts/ToastContext'
import recommendationService from '../services/recommendationService'

const FeedbackForm = ({ recommendationId, open, onClose }) => {
  const { showSuccess, showError } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    rating: 0,
    helpful: null,
    purchasedConfigId: '',
    comments: ''
  })
  const [errors, setErrors] = useState({})

  const handleRatingChange = (event, newValue) => {
    setFormData(prev => ({ ...prev, rating: newValue || 0 }))
  }

  const handleHelpfulChange = (helpful) => {
    setFormData(prev => ({ ...prev, helpful }))
  }

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (formData.helpful === null) {
      newErrors.helpful = 'Please indicate if this recommendation was helpful'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const feedbackData = {
        recommendation_id: recommendationId,
        helpful: formData.helpful,
        ...(formData.rating > 0 && { rating: formData.rating }),
        ...(formData.comments.trim() && { comments: formData.comments.trim() })
      }

      await recommendationService.submitFeedback(feedbackData)

      showSuccess('Thank you for your feedback!', 'Feedback Submitted')
      onClose()

      // Reset form
      setFormData({
        rating: 0,
        helpful: null,
        purchasedConfigId: '',
        comments: ''
      })

    } catch (error) {
      console.error('Error submitting feedback:', error)
      showError('Failed to submit feedback. Please try again.', 'Error')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="feedback-dialog-title"
    >
      <DialogTitle id="feedback-dialog-title">
        Help Us Improve
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Your feedback helps us provide better PC recommendations. This will only take a moment.
        </Typography>

        {/* Helpfulness Question */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Was this recommendation helpful?
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant={formData.helpful === true ? 'contained' : 'outlined'}
              onClick={() => handleHelpfulChange(true)}
              color="success"
              fullWidth
            >
              Yes, very helpful
            </Button>
            <Button
              variant={formData.helpful === false ? 'contained' : 'outlined'}
              onClick={() => handleHelpfulChange(false)}
              color="error"
              fullWidth
            >
              Not really
            </Button>
          </Box>
          {errors.helpful && (
            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
              {errors.helpful}
            </Typography>
          )}
        </Box>

        {/* Rating (Optional) */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Rate your experience (optional)
          </Typography>
          <Rating
            name="recommendation-rating"
            value={formData.rating}
            onChange={handleRatingChange}
            size="large"
            aria-label="Rate this recommendation from 1 to 5 stars"
          />
          <Typography variant="caption" color="text.secondary">
            How would you rate this recommendation?
          </Typography>
        </Box>

        {/* Comments (Optional) */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Comments (optional)"
            placeholder="Tell us what you liked or how we can improve..."
            value={formData.comments}
            onChange={handleInputChange('comments')}
            aria-label="Additional feedback comments"
          />
        </Box>

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Your feedback is anonymous and helps us improve our recommendation algorithm.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
          disabled={loading}
          color="inherit"
        >
          Skip
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || formData.helpful === null}
          startIcon={loading && <CircularProgress size={16} />}
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FeedbackForm
