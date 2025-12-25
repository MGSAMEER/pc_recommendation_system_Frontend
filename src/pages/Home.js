import React from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  useTheme,
  useMediaQuery
} from '@mui/material'
// import {
//   Build as BuildIcon,
//   Compare as CompareIcon,
//   SmartToy as SmartToyIcon
// } from '@mui/icons-material'

const Home = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const features = [
    {
      // icon: <SmartToyIcon fontSize="large" color="primary" />,
      title: 'Smart Recommendations',
      description: 'Get personalized PC recommendations based on your specific needs, budget, and performance requirements.',
      action: { text: 'Get Started', link: '/recommendations' }
    },
    {
      // icon: <CompareIcon fontSize="large" color="primary" />,
      title: 'Compare Options',
      description: 'Easily compare multiple PC configurations side-by-side to find the perfect match for your needs.',
      action: { text: 'Compare Now', link: '/compare' }
    },
    {
      // icon: <BuildIcon fontSize="large" color="primary" />,
      title: 'Expert Guidance',
      description: 'Receive clear explanations for every recommendation with detailed reasoning and trade-off analysis.',
      action: { text: 'Learn More', link: '/recommendations' }
    }
  ]

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          background: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          borderRadius: 2,
          mb: 6
        }}
      >
        <Typography variant={isMobile ? 'h4' : 'h3'} component="h1" gutterBottom>
          Find Your Perfect PC
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, maxWidth: 600, mx: 'auto', px: 2 }}>
          Simplify complex hardware decisions with our intelligent PC recommendation system.
          Get personalized suggestions based on your needs, budget, and performance expectations.
        </Typography>
        <Button
          component={Link}
          to="/recommendations"
          variant="contained"
          color="secondary"
          size="large"
          sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
        >
          Start Building
        </Button>
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ color: 'common.white' }}>
          Why Choose PC Recommender?
        </Typography>
        <Typography variant="body1" textAlign="center" sx={{ mb: 4, color: 'grey.300' }}>
          Our intelligent system takes the complexity out of PC building
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1, textAlign: 'center', pt: 3 }}>
                  {/* {feature.icon} */}
                  <Typography variant="h5" component="h3" gutterBottom sx={{ mt: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    component={Link}
                    to={feature.action.link}
                    variant="contained"
                    color="primary"
                  >
                    {feature.action.text}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          textAlign: 'center',
          py: 6,
          backgroundColor: theme.palette.action.hover,
          borderRadius: 2
        }}
      >
        <Typography variant="h5" component="h3" gutterBottom>
          Ready to Find Your Perfect PC?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Answer a few simple questions and get personalized recommendations in seconds.
        </Typography>
        <Button
          component={Link}
          to="/recommendations"
          variant="contained"
          color="primary"
          size="large"
        >
          Get Recommendations
        </Button>
      </Box>
    </Box>
  )
}

export default Home
