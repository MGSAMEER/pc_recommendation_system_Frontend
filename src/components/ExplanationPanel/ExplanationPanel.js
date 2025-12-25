import React from 'react'
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  useTheme
} from '@mui/material'
// import {
//   CheckCircle as CheckCircleIcon,
//   Warning as WarningIcon,
//   Info as InfoIcon
// } from '@mui/icons-material'

const ExplanationPanel = ({ recommendation, isOpen }) => {
  const theme = useTheme()

  if (!isOpen || !recommendation) {
    return null
  }

  const {
    match_reasons = [],
    trade_offs = [],
    components = []
  } = recommendation

  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'negative':
        return '⚠️' // <WarningIcon color="warning" sx={{ mr: 1, fontSize: '1rem' }} />
      case 'positive':
        return '✅' // <CheckCircleIcon color="success" sx={{ mr: 1, fontSize: '1rem' }} />
      case 'neutral':
      default:
        return 'ℹ️' // <InfoIcon color="info" sx={{ mr: 1, fontSize: '1rem' }} />
    }
  }

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'negative':
        return 'warning.main'
      case 'positive':
        return 'success.main'
      case 'neutral':
      default:
        return 'info.main'
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Divider sx={{ my: 2 }} />

      {/* Match Reasons Section */}
      <Typography variant="subtitle1" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
        Why This PC Matches Your Needs:
      </Typography>

      {match_reasons.length > 0 ? (
        <List dense>
          {match_reasons.map((reason, index) => (
            <ListItem key={index} sx={{ px: 0, py: 1 }}>
              {/* <CheckCircleIcon color="success" sx={{ mr: 1, fontSize: '1rem' }} /> */}✅
              <ListItemText
                primary={
                  <Typography variant="body2" component="span">
                    {reason.explanation}
                  </Typography>
                }
                secondary={
                  <Chip
                    label={`Weight: ${(reason.weight * 100).toFixed(0)}%`}
                    size="small"
                    variant="outlined"
                    sx={{
                      mt: 0.5,
                      fontSize: '0.7rem',
                      height: '20px'
                    }}
                  />
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Detailed reasoning not available for this recommendation.
        </Typography>
      )}

      {/* Trade-offs Section */}
      {trade_offs.length > 0 && (
        <>
          <Typography
            variant="subtitle1"
            component="h3"
            gutterBottom
            sx={{ fontWeight: 'bold', mt: 3 }}
          >
            Important Considerations:
          </Typography>
          <List dense>
            {trade_offs.map((tradeOff, index) => (
              <ListItem key={index} sx={{ px: 0, py: 1 }}>
                {getImpactIcon(tradeOff.impact)}
                <ListItemText
                  primary={
                    <Typography variant="body2" component="span">
                      {tradeOff.description}
                    </Typography>
                  }
                  secondary={
                    <Chip
                      label={`Impact: ${tradeOff.impact}`}
                      size="small"
                      sx={{
                        mt: 0.5,
                        fontSize: '0.7rem',
                        height: '20px',
                        bgcolor: getImpactColor(tradeOff.impact),
                        color: 'white'
                      }}
                    />
                  }
                />
              </ListItem>
            ))}
          </List>
        </>
      )}

      {/* Complete Component List */}
      <Typography
        variant="subtitle1"
        component="h3"
        gutterBottom
        sx={{ fontWeight: 'bold', mt: 3 }}
      >
        Complete Component List:
      </Typography>

      {components.length > 0 ? (
        <List dense>
          {components.map((component, index) => (
            <ListItem key={component.id || index} sx={{ px: 0, py: 0.5 }}>
              <ListItemText
                primary={`${component.type?.toUpperCase()}: ${component.brand} ${component.name}`}
                secondary={`$${component.price?.toFixed(2)}`}
                primaryTypographyProps={{
                  variant: 'body2',
                  sx: { fontWeight: 'medium' }
                }}
                secondaryTypographyProps={{
                  variant: 'caption',
                  color: 'text.secondary'
                }}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Component details not available.
        </Typography>
      )}

      {/* Additional Context */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          💡 <strong>Understanding Your Recommendation:</strong> This PC was selected based on your specific requirements.
          Higher weight factors indicate stronger matches to your needs. Trade-offs highlight any compromises made to fit your budget or preferences.
        </Typography>
      </Box>
    </Box>
  )
}

export default ExplanationPanel
