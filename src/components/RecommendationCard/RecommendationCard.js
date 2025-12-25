import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  Collapse,
  useTheme,
  Alert,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material'
// import {
//   ExpandMore as ExpandMoreIcon,
//   ExpandLess as ExpandLessIcon,
//   Compare as CompareIcon,
//   CompareOutlined as CompareOutlinedIcon,
//   ThumbUp as ThumbUpIcon,
//   ThumbDown as ThumbDownIcon
// } from '@mui/icons-material'
import ExplanationPanel from '../ExplanationPanel'
import FeedbackForm from '../FeedbackForm'
import comparisonService from '../../services/comparisonService'
import analyticsService from '../../services/analyticsService'

const RecommendationCard = ({ recommendation, showCompareButton = true }) => {
  const theme = useTheme()
  const [expanded, setExpanded] = useState(false)
  const [isInComparison, setIsInComparison] = useState(false)
  const [comparisonMessage, setComparisonMessage] = useState('')
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  const {
    configuration_id,
    name,
    total_price,
    confidence_score,
    match_reasons = [],
    trade_offs = [],
    components = []
  } = recommendation

  // Check if this PC is in comparison on component mount
  useEffect(() => {
    setIsInComparison(comparisonService.isInComparison(configuration_id))
  }, [configuration_id])

  const handleToggleComparison = () => {
    let result

    if (isInComparison) {
      result = comparisonService.removeFromComparison(configuration_id)
      if (result.success) {
        analyticsService.trackEvent('comparison_removed', {
          recommendationId: configuration_id,
          remainingCount: result.count
        })
      }
    } else {
      result = comparisonService.addToComparison(recommendation)
      if (result.success) {
        analyticsService.trackComparisonAdded(configuration_id, {
          totalCount: result.count,
          price: total_price
        })
      }
    }

    if (result.success) {
      setIsInComparison(!isInComparison)
      setComparisonMessage(result.message)

      // Clear message after 3 seconds
      setTimeout(() => setComparisonMessage(''), 3000)
    } else {
      setComparisonMessage(result.message)
      setTimeout(() => setComparisonMessage(''), 5000)
    }
  }

  const getConfidenceColor = (score) => {
    if (score >= 80) return 'success'
    if (score >= 60) return 'warning'
    return 'error'
  }

  const getConfidenceLabel = (score) => {
    if (score >= 80) return 'Excellent Match'
    if (score >= 60) return 'Good Match'
    return 'Fair Match'
  }

  return (
    <Card
      sx={{ mb: 2, width: '100%' }}
      role="article"
      aria-labelledby={`card-title-${configuration_id}`}
      aria-describedby={`card-description-${configuration_id}`}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography
            id={`card-title-${configuration_id}`}
            variant="h6"
            component="h2"
            gutterBottom
          >
            {name}
          </Typography>
          <Typography
            id={`card-description-${configuration_id}`}
            variant="h5"
            component="div"
            color="primary"
            fontWeight="bold"
            aria-label={`Price: ${total_price.toLocaleString()} dollars`}
          >
            ${total_price.toLocaleString()}
          </Typography>
        </Box>
          <Chip
            label={`${confidence_score}%`}
            color={getConfidenceColor(confidence_score)}
            variant="filled"
            sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}
          />
        </Box>

        {/* Confidence Label */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {getConfidenceLabel(confidence_score)}
        </Typography>

        {/* Components Summary */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Key Components:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {components.slice(0, 4).map((component, index) => (
              <Chip
                key={index}
                label={`${component.brand} ${component.name}`}
                size="small"
                variant="outlined"
              />
            ))}
            {components.length > 4 && (
              <Chip
                label={`+${components.length - 4} more`}
                size="small"
                variant="outlined"
                sx={{ opacity: 0.7 }}
              />
            )}
          </Box>
        </Box>

        {/* Trade-offs Alert */}
        {trade_offs.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Considerations:</strong> {trade_offs.map(t => t.description).join(', ')}
            </Typography>
          </Alert>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box>
        <Button
          size="small"
          onClick={() => {
            setExpanded(!expanded)
            if (!expanded) {
              analyticsService.trackRecommendationExpanded(configuration_id, {
                price: total_price,
                confidenceScore: confidence_score
              })
            }
          }}
          // startIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{ mr: 1 }}
          aria-expanded={expanded}
          aria-controls={`card-details-${configuration_id}`}
          aria-label={expanded ? 'Hide recommendation details' : 'Show recommendation details'}
        >
          {expanded ? 'Show Less' : 'Show Details'}
        </Button>
          {showCompareButton && (
            <Tooltip title={isInComparison ? 'Remove from comparison' : 'Add to comparison'}>
              <IconButton
                size="small"
                onClick={handleToggleComparison}
                color={isInComparison ? 'primary' : 'default'}
                sx={{
                  border: isInComparison ? '1px solid' : '1px solid transparent',
                  borderColor: isInComparison ? 'primary.main' : 'transparent'
                }}
              >
                {/* {isInComparison ? <CompareIcon /> : <CompareOutlinedIcon />} */}
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Feedback buttons */}
          {!feedbackSubmitted && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="This was helpful">
                <IconButton
                  size="small"
                  onClick={() => setFeedbackOpen(true)}
                  color="success"
                  aria-label="Mark as helpful"
                >
                  {/* <ThumbUpIcon fontSize="small" /> */}👍
                </IconButton>
              </Tooltip>
              <Tooltip title="This wasn't helpful">
                <IconButton
                  size="small"
                  onClick={() => setFeedbackOpen(true)}
                  color="error"
                  aria-label="Mark as not helpful"
                >
                  {/* <ThumbDownIcon fontSize="small" /> */}👎
                </IconButton>
              </Tooltip>
            </Box>
          )}

          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={() => {
              // TODO: Implement purchase/build action
              alert('Purchase/Build functionality coming soon!')
            }}
          >
            Build This PC
          </Button>
        </Box>
      </CardActions>

      {/* Comparison message */}
      {comparisonMessage && (
        <Box sx={{ px: 2, pb: 1 }}>
          <Alert
            severity={comparisonMessage.includes('added') || comparisonMessage.includes('removed') ? 'success' : 'error'}
            size="small"
          >
            {comparisonMessage}
          </Alert>
        </Box>
      )}

      {/* Expandable Details */}
      <Collapse in={expanded}>
        <CardContent
          id={`card-details-${configuration_id}`}
          sx={{ p: 0 }}
        >
          <ExplanationPanel
            recommendation={recommendation}
            isOpen={true}
          />
        </CardContent>
      </Collapse>

      {/* Feedback Form */}
      <FeedbackForm
        recommendationId={configuration_id}
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </Card>
  )
}

export default RecommendationCard
