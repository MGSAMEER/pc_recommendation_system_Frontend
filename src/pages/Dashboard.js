import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Divider,
  CircularProgress
} from '@mui/material'
import {
  Build as BuildIcon,
  Compare as CompareIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  AccessTime as AccessTimeIcon,
  Logout as LogoutIcon
} from '@mui/icons-material'
import { useAuth } from '../hooks/useAuth'
import { apiService } from '../services/api'

const Dashboard = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { user, logout } = useAuth()
  const [recentRecommendations, setRecentRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Debug: Log state updates
  useEffect(() => {
    console.log('Recent recommendations state updated:', recentRecommendations)
  }, [recentRecommendations])

  // Dashboard specific colors - theme-aware
  const colors = {
    cardBg: theme.palette.background.paper,
    cardBorder: theme.palette.divider,
    textPrimary: theme.palette.text.primary,
    textMuted: theme.palette.text.secondary,
    cta: theme.palette.primary.main,
    hoverGlow: theme.palette.action.hover
  }

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load user preferences first
        const preferencesResponse = await apiService.getUserPreferences()
        if (preferencesResponse.data) {
          // Could store preferences in context or local state if needed
          console.log('User preferences loaded:', preferencesResponse.data)
        }
  
        // Load recent recommendations
        const recommendationsResponse = await apiService.getUserRecommendations({ limit: 3, offset: 0 })
        console.log('Recommendations API response:', recommendationsResponse.data)
  
        if (recommendationsResponse.data?.recommendations) {
          // Transform the data to match dashboard format
          const transformedRecs = recommendationsResponse.data.recommendations.map(rec => ({
            id: rec.id,
            name: `Recommendation from ${new Date(rec.created_at).toLocaleDateString()}`,
            totalPrice: rec.total_price || 0,
            confidence: rec.confidence_score || 0,
            createdAt: rec.created_at,
            configCount: rec.config_count || 0,
            hasFeedback: rec.has_feedback || false
          }))
          console.log('Transformed recommendations:', transformedRecs)
          setRecentRecommendations(transformedRecs)
        } else {
          console.log('No recommendations found in response')
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        // If authentication fails, user might not be logged in
        if (error.response?.status === 401) {
          console.log('User not authenticated, showing empty state')
        }
        // Keep empty state if no data or error
        setRecentRecommendations([])
      } finally {
        setLoading(false)
      }
    }

    // Only load data if user is authenticated
    if (user) {
      loadDashboardData()
    } else {
      setLoading(false)
    }
  }, [user])

  const quickActions = [
    {
      title: 'Get New Recommendations',
      description: 'Find your perfect PC based on current needs',
      action: '/recommendations',
      color: 'primary',
      icon: <BuildIcon sx={{ fontSize: 32, color: theme.palette.text.primary }} />,
      background: theme.palette.background.paper
    },
    {
      title: 'Compare Builds',
      description: 'Compare different PC configurations side-by-side',
      action: '/compare',
      color: 'secondary',
      icon: <CompareIcon sx={{ fontSize: 32, color: theme.palette.text.secondary }} />,
      background: theme.palette.background.paper
    },
    {
      title: 'Browse Components',
      description: 'Explore available PC parts and specifications',
      action: '/components',
      color: 'success',
      icon: <SearchIcon sx={{ fontSize: 32, color: theme.palette.text.primary }} />,
      background: theme.palette.background.paper
    }
  ]

  const handleLogout = async () => {
    await logout()
  }

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Welcome Header */}
      <Box
        sx={{
          mb: 8,
          p: 4,
          borderRadius: 2,
          background: theme.palette.mode === 'light'
            ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
            : theme.palette.background.paper,
          color: theme.palette.mode === 'light'
            ? theme.palette.primary.contrastText
            : theme.palette.text.primary,
          border: theme.palette.mode === 'dark' ? `1px solid ${theme.palette.divider}` : 'none',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: theme.palette.mode === 'light'
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, position: 'relative', zIndex: 1 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mr: 4,
              bgcolor: theme.palette.mode === 'light'
                ? 'rgba(255, 255, 255, 0.2)'
                : theme.palette.primary.main,
              border: theme.palette.mode === 'light'
                ? '3px solid rgba(255, 255, 255, 0.3)'
                : `3px solid ${theme.palette.primary.dark}`,
              color: theme.palette.mode === 'light'
                ? 'white'
                : theme.palette.primary.contrastText,
              fontSize: '2rem',
              fontWeight: 600
            }}
          >
            {user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              Welcome back, {user?.fullName || 'User'}!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
              {user?.email}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <Chip
            label={`Member since ${new Date(user?.createdAt || Date.now()).toLocaleDateString()}`}
            sx={{
              bgcolor: theme.palette.mode === 'light'
                ? 'rgba(255, 255, 255, 0.15)'
                : theme.palette.grey[700],
              color: theme.palette.mode === 'light'
                ? 'white'
                : theme.palette.text.primary,
              border: theme.palette.mode === 'light'
                ? '1px solid rgba(255, 255, 255, 0.2)'
                : `1px solid ${theme.palette.divider}`,
              '& .MuiChip-label': { fontWeight: 500 }
            }}
          />
          {user?.isVerified && (
            <Chip
              icon={<StarIcon sx={{ color: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.primary.contrastText }} />}
              label="Verified Account"
              sx={{
                bgcolor: theme.palette.mode === 'light'
                  ? theme.palette.secondary.main
                  : theme.palette.secondary.dark,
                color: theme.palette.secondary.contrastText,
                border: `1px solid ${theme.palette.divider}`,
                '& .MuiChip-label': { fontWeight: 500 }
              }}
            />
          )}
        </Box>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            mb: 4,
            fontWeight: 700,
            textAlign: 'center',
            color: theme.palette.text.primary
          }}
        >
          Quick Actions
        </Typography>

        <Grid container spacing={4}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                component={Link}
                to={action.action}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.palette.mode === 'light'
                      ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                      : '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
                    '& .action-icon': {
                      transform: 'scale(1.05)'
                    }
                  }
                }}
              >
                <CardContent sx={{ flex: 1, p: 4, textAlign: 'center' }}>
                  <Box
                    className="action-icon"
                    sx={{
                      mb: 3,
                      transition: 'transform 0.2s ease-in-out',
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: 2,
                      background: theme.palette.mode === 'light'
                        ? 'rgba(0, 0, 0, 0.04)'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${theme.palette.divider}`
                    }}
                  >
                    {action.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      color: 'text.primary'
                    }}
                  >
                    {action.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {action.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    variant="contained"
                    color={action.color}
                    fullWidth
                    size="large"
                    sx={{
                      py: 1.5,
                      fontWeight: 600,
                      borderRadius: 2
                    }}
                  >
                    Get Started
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Recent Activity */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <TimelineIcon sx={{ mr: 2, color: theme.palette.text.primary, fontSize: '2rem' }} />
          <Typography variant="h4" component="h2" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
            Recent Activity
          </Typography>
        </Box>

        {loading ? (
          <Card sx={{
            p: 4,
            textAlign: 'center',
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`
          }}>
            <CircularProgress size={40} sx={{ mb: 2, color: theme.palette.primary.main }} />
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
              Loading your recent activity...
            </Typography>
          </Card>
        ) : recentRecommendations.length > 0 ? (
          console.log('Rendering recommendations:', recentRecommendations),
          <Grid container spacing={3}>
            {recentRecommendations.map((rec, index) => (
              <Grid item xs={12} md={6} key={rec.id}>
                <Card
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    background: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.palette.mode === 'light'
                        ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                      borderColor: theme.palette.primary.main
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '4px',
                      height: '100%',
                      background: rec.confidence >= 80 ? theme.palette.primary.main :
                                 rec.confidence >= 60 ? theme.palette.secondary.main :
                                 theme.palette.grey[400],
                      borderRadius: '0 2px 2px 0'
                    }
                  }}
                >
                  <CardContent sx={{ pl: 4, position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TrendingUpIcon sx={{ mr: 1, color: theme.palette.text.primary }} />
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                        {rec.name}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccessTimeIcon sx={{ mr: 1, fontSize: '1rem', color: theme.palette.text.secondary }} />
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        Created {new Date(rec.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Chip
                        label={`$${rec.totalPrice}`}
                        variant="outlined"
                        sx={{ 
                          fontWeight: 600,
                          borderColor: theme.palette.divider,
                          color: theme.palette.text.primary
                        }}
                      />
                      <Chip
                        label={`${rec.confidence}% Match`}
                        size="small"
                        icon={<StarIcon />}
                        sx={{
                          bgcolor: rec.confidence >= 80 ? theme.palette.secondary.main : rec.confidence >= 60 ? theme.palette.grey[400] : theme.palette.grey[600],
                          color: theme.palette.getContrastText(rec.confidence >= 80 ? theme.palette.secondary.main : rec.confidence >= 60 ? theme.palette.grey[400] : theme.palette.grey[600])
                        }}
                      />
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={rec.confidence}
                      sx={{
                        mt: 2,
                        height: 6,
                        borderRadius: 3,
                        bgcolor: 'rgba(0, 0, 0, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          background: rec.confidence >= 80 ? theme.palette.primary.main :
                                   rec.confidence >= 60 ? theme.palette.secondary.main :
                                   theme.palette.grey[400]
                        }
                      }}
                    />
                  </CardContent>
                  <CardActions sx={{ pl: 4, pb: 3 }}>
                    <Button
                      size="small"
                      component={Link}
                      to={`/recommendations/${rec.id}`}
                      sx={{ 
                        mr: 1,
                        color: theme.palette.primary.main,
                        '&:hover': {
                          bgcolor: theme.palette.action.hover
                        }
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      component={Link}
                      to="/compare"
                      sx={{
                        borderColor: theme.palette.secondary.main,
                        color: theme.palette.secondary.main,
                        '&:hover': {
                          borderColor: theme.palette.secondary.dark,
                          bgcolor: theme.palette.action.hover
                        }
                      }}
                    >
                      Compare Similar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card
            sx={{
              p: 6,
              textAlign: 'center',
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              boxShadow: 'none'
            }}
          >
            <Box sx={{ mb: 3 }}>
              <BuildIcon sx={{ fontSize: '4rem', color: theme.palette.primary.main, mb: 2, opacity: 0.7 }} />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.primary }}>
                No recent activity yet
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, maxWidth: 400, mx: 'auto', color: theme.palette.text.secondary }}>
                Start your PC building journey by getting personalized recommendations based on your needs and budget.
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/recommendations"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                background: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontWeight: 600,
                '&:hover': {
                  background: theme.palette.primary.dark
                }
              }}
            >
              Create First Recommendation
            </Button>
          </Card>
        )}
      </Box>

      {/* Account Actions */}
      <Box
        sx={{
          mt: 8,
          p: 4,
          borderRadius: 2,
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.palette.mode === 'light'
            ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            : '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <SettingsIcon sx={{ mr: 2, color: theme.palette.text.primary, fontSize: '1.5rem' }} />
          <Typography variant="h5" component="h3" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
            Account Management
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Button
              variant="outlined"
              component={Link}
              to="/profile"
              fullWidth
              sx={{
                py: 2,
                borderRadius: 2,
                border: '2px solid',
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                fontWeight: 600,
                '&:hover': {
                  borderColor: theme.palette.primary.dark,
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText
                }
              }}
            >
              Edit Profile
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="outlined"
              component={Link}
              to="/settings"
              fullWidth
              sx={{
                py: 2,
                borderRadius: 2,
                border: '2px solid',
                borderColor: theme.palette.secondary.main,
                color: theme.palette.secondary.main,
                fontWeight: 600,
                '&:hover': {
                  borderColor: theme.palette.secondary.dark,
                  bgcolor: theme.palette.secondary.main,
                  color: theme.palette.secondary.contrastText
                }
              }}
            >
              Account Settings
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              onClick={handleLogout}
              fullWidth
              sx={{
                py: 2,
                borderRadius: 2,
                fontWeight: 600,
                background: theme.palette.grey[700],
                color: theme.palette.getContrastText(theme.palette.grey[700]),
                '&:hover': {
                  background: theme.palette.grey[800]
                }
              }}
              startIcon={<LogoutIcon />}
            >
              Sign Out
            </Button>
          </Grid>
        </Grid>
      </Box>
      </Box>
    </Container>
  )
}

export default Dashboard
