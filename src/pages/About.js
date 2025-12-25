import React from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material'

const About = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const features = [
    {
      title: 'AI-Powered Recommendations',
      description: 'Our advanced algorithms analyze thousands of PC configurations to find the perfect match for your specific needs, budget, and performance requirements.',
      icon: '🤖'
    },
    {
      title: 'Expert Knowledge Base',
      description: 'Built on years of PC building expertise and component compatibility data to ensure reliable, up-to-date recommendations.',
      icon: '📚'
    },
    {
      title: 'User-Centric Design',
      description: 'Simple, intuitive interface that guides you through the PC selection process without requiring technical expertise.',
      icon: '👥'
    },
    {
      title: 'Continuous Learning',
      description: 'Our system improves over time by learning from user feedback and the latest hardware releases and performance data.',
      icon: '📈'
    }
  ]

  const stats = [
    { label: 'PC Configurations', value: '10,000+', description: 'Analyzed and categorized' },
    { label: 'Components', value: '5,000+', description: 'In our database' },
    { label: 'Users Helped', value: '50,000+', description: 'Found their perfect PC' },
    { label: 'Accuracy Rate', value: '95%', description: 'User satisfaction rating' }
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box textAlign="center" sx={{ mb: 8 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            mb: 3,
            fontWeight: 'bold',
            color: theme.palette.text.primary
          }}
        >
          About PC Recommender
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 800, mx: 'auto', lineHeight: 1.6 }}
        >
          Empowering users to make informed PC purchasing decisions through intelligent recommendations
          and expert guidance in an increasingly complex hardware landscape.
        </Typography>
      </Box>

      {/* Mission Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" sx={{ mb: 4 }}>
          Our Mission
        </Typography>
        <Typography
          variant="h6"
          textAlign="center"
          sx={{ maxWidth: 900, mx: 'auto', lineHeight: 1.8, color: 'text.secondary' }}
        >
          In today's rapidly evolving tech landscape, choosing the right PC can be overwhelming.
          With thousands of components, compatibility concerns, and performance trade-offs to consider,
          most users struggle to make informed decisions. Our mission is to democratize PC knowledge
          by providing accessible, accurate, and personalized recommendations that help everyone
          find their perfect computer setup.
        </Typography>
      </Box>

      {/* Stats Section */}
      <Box sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  component="div"
                  sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  {stat.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" sx={{ mb: 6 }}>
          What Sets Us Apart
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8]
                  }
                }}
              >
                <CardContent sx={{ flex: 1, textAlign: 'center', p: 4 }}>
                  <Typography sx={{ fontSize: '4rem', mb: 2 }}>
                    {feature.icon}
                  </Typography>
                  <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Technology Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" sx={{ mb: 4 }}>
          Technology & Methodology
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Intelligent Matching Algorithm
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
              Our proprietary algorithm combines multiple factors to provide accurate recommendations:
            </Typography>
            <Box component="ul" sx={{ pl: 3, lineHeight: 1.8 }}>
              <li><strong>Use Case Analysis:</strong> Gaming, productivity, creative work, or general use</li>
              <li><strong>Budget Optimization:</strong> Maximum value within your price range</li>
              <li><strong>Performance Requirements:</strong> Matching power to your specific needs</li>
              <li><strong>Compatibility Verification:</strong> Ensuring all components work together</li>
              <li><strong>Future-Proofing:</strong> Considering upgradability and longevity</li>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Data-Driven Approach
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
              We maintain a comprehensive database of current hardware with real-world performance data:
            </Typography>
            <Box component="ul" sx={{ pl: 3, lineHeight: 1.8 }}>
              <li><strong>Regular Updates:</strong> New components added weekly</li>
              <li><strong>Performance Benchmarks:</strong> Real-world testing results</li>
              <li><strong>Price Tracking:</strong> Current market pricing</li>
              <li><strong>User Feedback:</strong> Continuous improvement based on real experiences</li>
              <li><strong>Expert Validation:</strong> PC building specialists review recommendations</li>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* CTA Section */}
      <Box textAlign="center" sx={{ py: 6 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
          Ready to Find Your Perfect PC?
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Start your journey towards the ideal computer setup today.
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/signup"
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            textTransform: 'none'
          }}
        >
          Get Started Free
        </Button>
      </Box>
    </Container>
  )
}

export default About

