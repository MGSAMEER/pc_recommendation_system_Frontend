import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  Breadcrumbs,
  Link as MuiLink,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { Link, useNavigate, useLocation } from 'react-router-dom'
// import { NavigateNext as NavigateNextIcon } from '@mui/icons-material'

import ComparisonTable from '../../components/ComparisonTable'

const Compare = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const navigate = useNavigate()
  const location = useLocation()

  const [comparisonItems, setComparisonItems] = useState([])
  const [error, setError] = useState(null)

  // Load comparison items from location state or localStorage
  useEffect(() => {
    const loadComparisonItems = () => {
      try {
        // Check location state first (from navigation)
        if (location.state?.comparisonItems) {
          setComparisonItems(location.state.comparisonItems)
          return
        }

        // Fallback to localStorage
        const saved = localStorage.getItem('pcComparison')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setComparisonItems(parsed)
            return
          }
        }

        // If no items, redirect to recommendations
        navigate('/recommendations', {
          state: {
            message: 'Please get some recommendations first, then add them to comparison.'
          }
        })
      } catch (err) {
        console.error('Error loading comparison items:', err)
        setError('Failed to load comparison items')
      }
    }

    loadComparisonItems()
  }, [location.state, navigate])

  // Save comparison items to localStorage whenever they change
  useEffect(() => {
    if (comparisonItems.length > 0) {
      localStorage.setItem('pcComparison', JSON.stringify(comparisonItems))
    } else {
      localStorage.removeItem('pcComparison')
    }
  }, [comparisonItems])

  const handleRemoveFromComparison = (configurationId) => {
    setComparisonItems(prev =>
      prev.filter(item => item.configuration_id !== configurationId)
    )
  }

  const handleClearComparison = () => {
    setComparisonItems([])
    localStorage.removeItem('pcComparison')
  }

  const handleAddMoreItems = () => {
    navigate('/recommendations', {
      state: {
        returnToComparison: true,
        currentComparison: comparisonItems
      }
    })
  }

  const breadcrumbs = [
    <MuiLink
      key="home"
      component={Link}
      to="/"
      underline="hover"
      color="inherit"
    >
      Home
    </MuiLink>,
    <MuiLink
      key="recommendations"
      component={Link}
      to="/recommendations"
      underline="hover"
      color="inherit"
    >
      Recommendations
    </MuiLink>,
    <Typography key="compare" color="text.primary">
      Compare
    </Typography>
  ]

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button component={Link} to="/recommendations" variant="contained">
          Back to Recommendations
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: isMobile ? 2 : 4 }}>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs
          // separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          {breadcrumbs}
        </Breadcrumbs>
      </Box>

      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Typography variant={isMobile ? 'h4' : 'h3'} component="h1" gutterBottom>
          Compare PC Configurations
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Compare your selected PC recommendations side-by-side to find the perfect match for your needs.
        </Typography>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button
            component={Link}
            to="/recommendations"
            variant="contained"
            size="large"
            sx={{ fontWeight: 600 }}
          >
            Back to Recommendations
          </Button>
          <Button
            variant="outlined"
            onClick={handleAddMoreItems}
            disabled={comparisonItems.length >= 4}
          >
            Add More PCs
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClearComparison}
            disabled={comparisonItems.length === 0}
          >
            Clear All
          </Button>
        </Box>
      </Box>

      {/* Comparison Content */}
      {comparisonItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No PCs selected for comparison
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Go back to recommendations and add some PCs to compare.
          </Typography>
          <Button
            component={Link}
            to="/recommendations"
            variant="contained"
            size="large"
          >
            Get Recommendations
          </Button>
        </Box>
      ) : comparisonItems.length === 1 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body1">
            You've selected only one PC for comparison. Add at least one more to enable side-by-side comparison.
          </Typography>
        </Alert>
      ) : null}

      {/* Comparison Table */}
      {comparisonItems.length > 0 && (
        <Box sx={{ mb: 5 }}>
          <ComparisonTable
            recommendations={comparisonItems}
            onRemoveRecommendation={handleRemoveFromComparison}
          />
        </Box>
      )}

      {/* Tips and Help */}
      {comparisonItems.length >= 2 && (
        <Box sx={{
          mt: 4,
          p: 3,
          bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.800',
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`
        }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, mb: 2 }}>
            💡 Quick Tips
          </Typography>
          <Box component="ul" sx={{ pl: 3, m: 0, '& li': { mb: 1.5, pl: 0 } }}>
            <Typography component="li" variant="body2" sx={{ fontWeight: 400, mb: 1 }}>
              <strong style={{ fontWeight: 500 }}>Price vs Performance:</strong> Consider the performance gains relative to price increases
            </Typography>
            <Typography component="li" variant="body2" sx={{ fontWeight: 400, mb: 1 }}>
              <strong style={{ fontWeight: 500 }}>Use Case Alignment:</strong> Choose based on how well each PC matches your primary use case
            </Typography>
            <Typography component="li" variant="body2" sx={{ fontWeight: 400 }}>
              <strong style={{ fontWeight: 500 }}>Future Proofing:</strong> Consider upgrade potential and component quality
            </Typography>
          </Box>
        </Box>
      )}

      {/* Footer Actions */}
      {comparisonItems.length > 0 && (
        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'grey.300' }}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={() => {
                // TODO: Implement save/share functionality
                alert('Save/Share functionality coming soon!')
              }}
            >
              Save Comparison
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.print()}
            >
              Print Comparison
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  )
}

export default Compare
