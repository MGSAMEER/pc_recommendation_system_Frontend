import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Alert,
  CircularProgress,
  useTheme,
  Fade
} from '@mui/material'
// import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'

import RecommendationForm from '../../components/RecommendationForm'
import RecommendationCard from '../../components/RecommendationCard'
import { RecommendationCardSkeleton } from '../../components/SkeletonLoader'

const Recommendations = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const [recommendations, setRecommendations] = useState(null)
  const [userRequirements, setUserRequirements] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Check if we have recommendations passed from navigation
  useEffect(() => {
    if (location.state?.recommendations) {
      setRecommendations(location.state.recommendations)
      setUserRequirements(location.state.userRequirements)
    }
  }, [location.state])

  const handleRecommendationsGenerated = (response, requirements) => {
    setRecommendations(response)
    setUserRequirements(requirements)
    setError(null)
    setSubmitting(false)
  }

  const handleFormSubmit = () => {
    setSubmitting(true)
    setError(null)
  }

  const handleStartOver = () => {
    setRecommendations(null)
    setUserRequirements(null)
    setError(null)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          // startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          variant="outlined"
        >
          Back to Home
        </Button>
        <Typography variant="h3" component="h1">
          PC Recommendations
        </Typography>
      </Box>

      {!recommendations ? (
        /* Show form when no recommendations yet */
        <Box>
          <RecommendationForm
            onRecommendationsGenerated={handleRecommendationsGenerated}
            loading={submitting}
            onSubmitStart={handleFormSubmit}
          />
        </Box>
      ) : (
        /* Show recommendations */
        <Box>
          {/* Summary */}
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Your Recommendations
            </Typography>

            {userRequirements && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  Based on your requirements:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Purpose: {userRequirements.purpose}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Budget: ${userRequirements.budget.min} - ${userRequirements.budget.max}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Performance: {userRequirements.performance_level}
                  </Typography>
                  {userRequirements.preferred_brands?.length > 0 && (
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Preferred Brands: {userRequirements.preferred_brands.join(', ')}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}

            <Typography variant="body1">
              We found <strong>{recommendations.recommendations?.length || 0}</strong> PC configurations
              that match your requirements.
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleStartOver}
                sx={{ mr: 2 }}
              >
                Start Over
              </Button>
              <Button
                variant="contained"
                onClick={() => window.print()}
              >
                Print Recommendations
              </Button>
            </Box>
          </Paper>

          {/* Recommendations List */}
          {loading ? (
            <Grid container spacing={3}>
              {[1, 2, 3].map((i) => (
                <Grid item xs={12} key={i}>
                  <RecommendationCardSkeleton />
                </Grid>
              ))}
            </Grid>
          ) : recommendations.recommendations?.length > 0 ? (
            <Fade in={!loading} timeout={300}>
              <Grid container spacing={3}>
                {recommendations.recommendations.map((rec, index) => (
                  <Grid item xs={12} key={rec.configuration_id || index}>
                    <RecommendationCard recommendation={rec} />
                  </Grid>
                ))}
              </Grid>
            </Fade>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body1">
                No PC configurations were found that match your current requirements.
                Try adjusting your budget range or performance expectations.
              </Typography>
            </Alert>
          )}

          {/* Metadata */}
          {recommendations.metadata && (
            <Paper elevation={1} sx={{ p: 2, mt: 4, bgcolor: 'grey.50' }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Recommendation Details:</strong>
                Algorithm version {recommendations.metadata.algorithm_version} |
                Generated in ~{recommendations.metadata.processing_time_ms || 0}ms |
                Considered {recommendations.metadata.total_considered || 0} configurations
              </Typography>
              {recommendations.expires_at && (
                <Typography variant="body2" color="text.secondary">
                  Recommendations expire on {new Date(recommendations.expires_at).toLocaleDateString()}
                </Typography>
              )}
            </Paper>
          )}
        </Box>
      )}
    </Container>
  )
}

export default Recommendations
