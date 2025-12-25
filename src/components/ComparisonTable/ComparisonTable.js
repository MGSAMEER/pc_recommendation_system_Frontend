import React, { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid
} from '@mui/material'
// import {
//   Close as CloseIcon,
//   Star as StarIcon,
//   AttachMoney as MoneyIcon,
//   Speed as SpeedIcon,
//   Memory as MemoryIcon,
//   Storage as StorageIcon
// } from '@mui/icons-material'

const ComparisonTable = ({ recommendations, onRemoveRecommendation }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')

  // Calculate comparison metrics
  const comparisonMetrics = useMemo(() => {
    if (!recommendations.length) return {}

    const prices = recommendations.map(r => r.total_price)
    const confidenceScores = recommendations.map(r => r.confidence_score)

    return {
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices),
        avg: prices.reduce((a, b) => a + b, 0) / prices.length
      },
      confidenceRange: {
        min: Math.min(...confidenceScores),
        max: Math.max(...confidenceScores),
        avg: confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length
      },
      bestValue: recommendations.reduce((best, current) =>
        (current.confidence_score / current.total_price) > (best.confidence_score / best.total_price)
          ? current : best
      )
    }
  }, [recommendations])

  // Sort recommendations
  const sortedRecommendations = useMemo(() => {
    return [...recommendations].sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === 'suitability_scores') {
        // For suitability scores, sort by gaming score as default
        aValue = a.suitability_scores?.gaming || 0
        bValue = b.suitability_scores?.gaming || 0
      } else if (sortBy === 'performance_profile') {
        // For performance, sort by overall performance
        aValue = a.performance_profile?.overall_performance || 0
        bValue = b.performance_profile?.overall_performance || 0
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }, [recommendations, sortBy, sortOrder])

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const getComponentByType = (components, type) => {
    return components.find(comp => comp.type === type)
  }

  const formatPrice = (price) => `$${price.toLocaleString()}`

  const getBestValue = (values, higherIsBetter = true) => {
    const best = higherIsBetter ? Math.max(...values) : Math.min(...values)
    return values.map(value => value === best)
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No PCs to compare
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add some PC recommendations to start comparing
        </Typography>
      </Box>
    )
  }

  if (recommendations.length === 1) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Only one PC selected
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add another PC recommendation to enable comparison
        </Typography>
      </Box>
    )
  }

  // Mobile view - use cards instead of table
  if (isMobile) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Compare PCs ({recommendations.length} selected)
        </Typography>

        <Grid container spacing={2}>
          {sortedRecommendations.map((rec) => (
            <Grid item xs={12} sm={6} key={rec.configuration_id}>
              <Card sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                bgcolor: 'background.paper',
                boxShadow: theme.palette.mode === 'light'
                  ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                  : '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)'
              }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>{rec.name}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => onRemoveRecommendation(rec.configuration_id)}
                      aria-label={`Remove ${rec.name} from comparison`}
                    >
                      {/* <CloseIcon /> */}✕
                    </IconButton>
                  </Box>

                  <Typography variant="h5" sx={{
                    fontWeight: 700,
                    mb: 2,
                    textAlign: 'center'
                  }}>
                    {formatPrice(rec.total_price)}
                  </Typography>

                  <Chip
                    label={`${rec.confidence_score}% match`}
                    color={rec.confidence_score >= 80 ? 'primary' : rec.confidence_score >= 60 ? 'secondary' : 'default'}
                    size="small"
                    variant="outlined"
                    sx={{ mb: 2.5, fontWeight: 500 }}
                  />

                  {/* Key components */}
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 1.5 }}>
                    Key Components:
                  </Typography>
                  {['cpu', 'gpu', 'ram', 'storage'].map(type => {
                    const component = getComponentByType(rec.components || [], type)
                    return component ? (
                      <Typography key={type} variant="body2" sx={{ mb: 1, fontWeight: 400 }}>
                        <strong style={{ fontWeight: 500 }}>{type.toUpperCase()}:</strong> {component.brand} {component.name}
                      </Typography>
                    ) : null
                  })}

                  {/* Suitability scores */}
                  <Box sx={{ mt: 2.5 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 1.5 }}>
                      Suitability:
                    </Typography>
                    {rec.suitability_scores && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        <Chip label={`Gaming: ${rec.suitability_scores.gaming}%`} size="small" variant="outlined" />
                        <Chip label={`Office: ${rec.suitability_scores.office}%`} size="small" variant="outlined" />
                        <Chip label={`Creative: ${rec.suitability_scores.creative}%`} size="small" variant="outlined" />
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  }

  // Desktop table view
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Compare PCs ({recommendations.length} selected)
        </Typography>

        {comparisonMetrics.bestValue && (
          <Chip
            // icon={<StarIcon />}
            label={`${comparisonMetrics.bestValue.name} - Best Value`}
            color="primary"
            variant="outlined"
          />
        )}
      </Box>

      {/* Summary stats */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Chip
          // icon={<MoneyIcon />}
          label={`Price Range: ${formatPrice(comparisonMetrics.priceRange.min)} - ${formatPrice(comparisonMetrics.priceRange.max)}`}
          variant="outlined"
        />
        <Chip
          label={`Avg Confidence: ${Math.round(comparisonMetrics.confidenceRange.avg)}%`}
          variant="outlined"
        />
      </Box>

      <TableContainer component={Paper} sx={{
        overflowX: 'auto',
        borderRadius: 2,
        boxShadow: theme.palette.mode === 'light'
          ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          : '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)',
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        mt: 1
      }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ fontWeight: 600, cursor: 'pointer', py: 2.5 }}
                onClick={() => handleSort('name')}
              >
                PC Configuration {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: 600, cursor: 'pointer', py: 2.5 }}
                onClick={() => handleSort('total_price')}
              >
                Price {sortBy === 'total_price' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: 600, cursor: 'pointer', py: 2.5 }}
                onClick={() => handleSort('confidence_score')}
              >
                Match {sortBy === 'confidence_score' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>CPU</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>GPU</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>RAM</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2.5 }}>Storage</TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: 600, cursor: 'pointer', py: 2.5 }}
                onClick={() => handleSort('suitability_scores')}
              >
                Gaming Fit {sortBy === 'suitability_scores' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, py: 2.5 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRecommendations.map((rec, index) => {
              const cpu = getComponentByType(rec.components || [], 'cpu')
              const gpu = getComponentByType(rec.components || [], 'gpu')
              const ram = getComponentByType(rec.components || [], 'ram')
              const storage = getComponentByType(rec.components || [], 'storage')

              return (
                <TableRow key={rec.configuration_id} hover sx={{
                  height: 52
                }}>
                  <TableCell sx={{ fontWeight: 500, py: 2 }}>
                    {rec.name}
                  </TableCell>
                  <TableCell align="right" sx={{
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    py: 2
                  }}>
                    {formatPrice(rec.total_price)}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2 }}>
                    <Chip
                      label={`${rec.confidence_score}%`}
                      color={rec.confidence_score >= 80 ? 'primary' : rec.confidence_score >= 60 ? 'secondary' : 'default'}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontWeight: 500,
                        '& .MuiChip-label': {
                          color: rec.confidence_score >= 80 ? 'primary.main' : rec.confidence_score >= 60 ? 'secondary.main' : 'text.secondary'
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 400, py: 2 }}>
                    {cpu ? `${cpu.brand} ${cpu.name}` : 'N/A'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 400, py: 2 }}>
                    {gpu ? `${gpu.brand} ${gpu.name}` : 'N/A'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 400, py: 2 }}>
                    {ram ? `${ram.brand} ${ram.name}` : 'N/A'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 400, py: 2 }}>
                    {storage ? `${storage.brand} ${storage.name}` : 'N/A'}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2 }}>
                    {rec.suitability_scores?.gaming ? `${rec.suitability_scores.gaming}%` : 'N/A'}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2 }}>
                    <Tooltip title={`Remove ${rec.name} from comparison`}>
                      <IconButton
                        size="small"
                        onClick={() => onRemoveRecommendation(rec.configuration_id)}
                        aria-label={`Remove ${rec.name} from comparison`}
                      >
                        {/* <CloseIcon /> */}✕
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Performance comparison visualization */}
      {sortedRecommendations.length > 1 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Performance Comparison
          </Typography>
          {sortedRecommendations.map((rec) => (
            <Box key={rec.configuration_id} sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">{rec.name}</Typography>
                <Typography variant="body2">
                  {rec.performance_profile?.gaming_performance || 0}% Gaming
                </Typography>
              </Box>
              <Box
                sx={{
                  width: '100%',
                  height: 8,
                  bgcolor: 'grey.200',
                  borderRadius: 1,
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    width: `${rec.performance_profile?.gaming_performance || 0}%`,
                    height: '100%',
                    bgcolor: rec.confidence_score >= 80 ? 'success.main' : rec.confidence_score >= 60 ? 'warning.main' : 'error.main',
                    transition: 'width 0.3s ease'
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default ComparisonTable
