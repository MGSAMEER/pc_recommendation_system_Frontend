import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Alert,
  useTheme,
  useMediaQuery,
  Grid,
  Avatar
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Build as BuildIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material'

const Compare = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const navigate = useNavigate()

  const [comparisonList, setComparisonList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load comparison list from localStorage
    const stored = localStorage.getItem('comparisonList')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setComparisonList(parsed)
      } catch (error) {
        console.error('Error parsing comparison list:', error)
        localStorage.removeItem('comparisonList')
      }
    }
  }, [])

  const handleRemoveFromComparison = (configId) => {
    const updated = comparisonList.filter(item => item.configuration_id !== configId)
    setComparisonList(updated)
    localStorage.setItem('comparisonList', JSON.stringify(updated))
  }

  const handleClearAll = () => {
    setComparisonList([])
    localStorage.removeItem('comparisonList')
  }

  const getComponentByType = (components, type) => {
    return components?.find(comp => comp.type === type)
  }

  const getAllComponentTypes = () => {
    const allTypes = new Set()
    comparisonList.forEach(pc => {
      pc.components?.forEach(comp => {
        allTypes.add(comp.type)
      })
    })
    return Array.from(allTypes).sort()
  }

  const formatPrice = (price) => {
    return typeof price === 'number' ? `$${price.toFixed(2)}` : price || 'N/A'
  }

  const getBestValue = (values, type = 'number') => {
    if (type === 'number') {
      const nums = values.filter(v => typeof v === 'number' && !isNaN(v))
      if (nums.length === 0) return null
      return Math.min(...nums)
    }
    return null
  }

  if (comparisonList.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box textAlign="center">
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 3,
              bgcolor: 'grey.100'
            }}
          >
            <BuildIcon sx={{ fontSize: 40, color: 'grey.500' }} />
          </Avatar>
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            No PCs to Compare
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Add some PC recommendations to your comparison list to see them side-by-side.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/recommendations')}
            sx={{ mr: 2 }}
          >
            Get Recommendations
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    )
  }

  const componentTypes = getAllComponentTypes()

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={() => navigate('/recommendations')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'common.white' }}>
              Compare PCs
            </Typography>
            <Typography variant="body2" sx={{ color: 'secondary.contrastText', opacity: 0.9 }}>
              Comparing {comparisonList.length} PC configuration{comparisonList.length > 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          color="error"
          onClick={handleClearAll}
          size="small"
        >
          Clear All
        </Button>
      </Box>

      {/* Comparison Table */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table sx={{ minWidth: 650 }} aria-label="PC comparison table">
          <TableHead>
            <TableRow sx={{ bgcolor: theme.palette.background.default }}>
              <TableCell sx={{ fontWeight: 600, minWidth: 200 }}>Specification</TableCell>
              {comparisonList.map((pc, index) => (
                <TableCell key={pc.configuration_id || index} align="center" sx={{ minWidth: 180 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <Avatar sx={{ mr: 1, bgcolor: 'primary.main', width: 32, height: 32 }}>
                      <BuildIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                    <Typography variant="body2" fontWeight={600}>
                      PC {index + 1}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {pc.name || `Configuration ${index + 1}`}
                  </Typography>
                  <Chip
                    label={`${pc.confidence_score}% match`}
                    color={pc.confidence_score >= 80 ? 'success' : pc.confidence_score >= 60 ? 'warning' : 'error'}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <br />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveFromComparison(pc.configuration_id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Price */}
            <TableRow>
              <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                Total Price
              </TableCell>
              {comparisonList.map((pc, index) => {
                const prices = comparisonList.map(p => p.total_price)
                const bestPrice = getBestValue(prices)
                const isBest = pc.total_price === bestPrice

                return (
                  <TableCell key={index} align="center">
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: isBest ? 600 : 400,
                        color: isBest ? theme.palette.primary.main : theme.palette.text.primary
                      }}
                    >
                      {formatPrice(pc.total_price)}
                    </Typography>
                    {isBest && <Chip label="Best Value" size="small" sx={{ mt: 0.5, bgcolor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }} />}
                  </TableCell>
                )
              })}
            </TableRow>

            {/* Match Score */}
            <TableRow sx={{ bgcolor: theme.palette.background.default }}>
              <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                Match Score
              </TableCell>
              {comparisonList.map((pc, index) => {
                const scores = comparisonList.map(p => p.confidence_score)
                const bestScore = Math.max(...scores)
                const isBest = pc.confidence_score === bestScore

                return (
                  <TableCell key={index} align="center">
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: isBest ? 600 : 400,
                        color: isBest ? theme.palette.primary.main : theme.palette.text.primary
                      }}
                    >
                      {pc.confidence_score}%
                    </Typography>
                    {isBest && <Chip label="Best Match" size="small" sx={{ mt: 0.5, bgcolor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }} />}
                  </TableCell>
                )
              })}
            </TableRow>

            {/* Components */}
            {componentTypes.map((type, index) => (
              <TableRow key={type} sx={{ bgcolor: index % 2 === 0 ? theme.palette.background.default : theme.palette.grey[100] }}>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                  {type}
                </TableCell>
                {comparisonList.map((pc, index) => {
                  const component = getComponentByType(pc.components, type)
                  return (
                    <TableCell key={index} align="center">
                      {component ? (
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {component.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {component.brand}
                          </Typography>
                          <Typography variant="caption" display="block" color="primary.main">
                            {formatPrice(component.price)}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Not included
                        </Typography>
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}

            {/* Match Reasons */}
            <TableRow sx={{ bgcolor: theme.palette.background.default }}>
              <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                Key Strengths
              </TableCell>
              {comparisonList.map((pc, index) => (
                <TableCell key={index} align="center">
                  <Box sx={{ maxWidth: 200 }}>
                    {pc.match_reasons?.slice(0, 2).map((reason, idx) => (
                      <Chip
                        key={idx}
                        label={reason.explanation.length > 30
                          ? reason.explanation.substring(0, 30) + '...'
                          : reason.explanation
                        }
                        size="small"
                        variant="outlined"
                        sx={{ mb: 0.5, fontSize: '0.7rem' }}
                      />
                    ))}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/recommendations')}
        >
          Get More Recommendations
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </Box>

      {/* Mobile Warning */}
      {isMobile && comparisonList.length > 2 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          For better viewing experience on mobile devices, consider comparing fewer PCs at once.
        </Alert>
      )}
    </Container>
  )
}

export default Compare
