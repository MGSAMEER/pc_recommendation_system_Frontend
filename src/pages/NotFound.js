import React from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { useAuth } from '../hooks/useAuth'

const NotFound = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { isAuthenticated } = useAuth()

  const suggestions = isAuthenticated ? [
    { label: 'Go to Dashboard', path: '/dashboard', primary: true },
    { label: 'Get Recommendations', path: '/recommendations' },
    { label: 'Compare PCs', path: '/compare' },
    { label: 'View Profile', path: '/profile' }
  ] : [
    { label: 'Go Home', path: '/', primary: true },
    { label: 'Sign Up', path: '/signup' },
    { label: 'Sign In', path: '/login' },
    { label: 'Learn More', path: '/about' }
  ]

  return (
    <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
      <Box textAlign="center" sx={{ mb: 6 }}>
        {/* 404 Visual */}
        <Typography
          variant="h1"
          component="div"
          sx={{
            fontSize: { xs: '8rem', md: '12rem' },
            fontWeight: 'bold',
            color: 'primary.main',
            opacity: 0.1,
            lineHeight: 1,
            mb: 2
          }}
        >
          404
        </Typography>

        {/* Error Message */}
        <Typography
          variant="h3"
          component="h1"
          sx={{
            mb: 3,
            fontWeight: 'bold',
            color: 'text.primary'
          }}
        >
          Page Not Found
        </Typography>

        <Typography
          variant="h5"
          color="text.secondary"
          sx={{
            mb: 4,
            maxWidth: 600,
            mx: 'auto',
            lineHeight: 1.6
          }}
        >
          Oops! The page you're looking for doesn't exist.
          It might have been moved, deleted, or you entered the wrong URL.
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mb: 6 }}>
        <Grid container spacing={2} justifyContent="center">
          {suggestions.map((suggestion, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Button
                fullWidth
                variant={suggestion.primary ? 'contained' : 'outlined'}
                size="large"
                component={Link}
                to={suggestion.path}
                sx={{
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                {suggestion.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Additional Help */}
      <Box
        sx={{
          p: 4,
          bgcolor: 'grey.50',
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Need Help?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          If you believe this is an error, please contact our support team or try navigating back to the home page.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="text"
            component={Link}
            to="/help"
            sx={{ textTransform: 'none' }}
          >
            Help Center
          </Button>
          <Button
            variant="text"
            component={Link}
            to="/contact"
            sx={{ textTransform: 'none' }}
          >
            Contact Support
          </Button>
          <Button
            variant="text"
            onClick={() => window.history.back()}
            sx={{ textTransform: 'none' }}
          >
            Go Back
          </Button>
        </Box>
      </Box>

      {/* Fun Element */}
      <Box textAlign="center" sx={{ mt: 6 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          "In the world of PCs, sometimes you need to reboot your path!" 🔄
        </Typography>
      </Box>
    </Container>
  )
}

export default NotFound

