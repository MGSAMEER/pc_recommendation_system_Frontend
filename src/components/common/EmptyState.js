import React from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material'

/**
 * EmptyState - Component for displaying empty states with actionable content
 * Supports different scenarios like no data, no results, no permissions, etc.
 */
const EmptyState = ({
  icon,
  title,
  description,
  action,
  actionLabel,
  onAction,
  variant = 'default', // 'default', 'card', 'inline'
  size = 'medium', // 'small', 'medium', 'large'
  sx = {}
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Size configurations
  const sizeConfig = {
    small: {
      iconSize: 48,
      titleVariant: 'h6',
      descriptionVariant: 'body2',
      spacing: 2
    },
    medium: {
      iconSize: 64,
      titleVariant: 'h5',
      descriptionVariant: 'body1',
      spacing: 3
    },
    large: {
      iconSize: 96,
      titleVariant: 'h4',
      descriptionVariant: 'h6',
      spacing: 4
    }
  }

  const config = sizeConfig[size]

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        py: config.spacing,
        px: 2,
        ...sx
      }}
    >
      {/* Icon */}
      {icon && (
        <Box sx={{ mb: 2 }}>
          {typeof icon === 'string' ? (
            <Typography sx={{ fontSize: config.iconSize }}>
              {icon}
            </Typography>
          ) : (
            React.cloneElement(icon, {
              sx: { fontSize: config.iconSize, color: theme.palette.text.secondary }
            })
          )}
        </Box>
      )}

      {/* Title */}
      <Typography
        variant={config.titleVariant}
        component="h2"
        sx={{
          mb: 2,
          fontWeight: 600,
          color: theme.palette.text.primary
        }}
      >
        {title}
      </Typography>

      {/* Description */}
      <Typography
        variant={config.descriptionVariant}
        color="text.secondary"
        sx={{
          mb: action ? 3 : 0,
          maxWidth: 400,
          lineHeight: 1.6
        }}
      >
        {description}
      </Typography>

      {/* Action Button */}
      {action && (
        <Button
          variant="contained"
          size={size === 'small' ? 'small' : 'medium'}
          onClick={onAction}
          sx={{
            minWidth: size === 'small' ? 120 : 140,
            textTransform: 'none'
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  )

  // Card variant wraps content in a card
  if (variant === 'card') {
    return (
      <Card sx={{ maxWidth: 500, mx: 'auto' }}>
        <CardContent sx={{ p: 0 }}>
          {content}
        </CardContent>
      </Card>
    )
  }

  // Inline variant for smaller spaces
  if (variant === 'inline') {
    return (
      <Box sx={{ py: 2, ...sx }}>
        {content}
      </Box>
    )
  }

  // Default variant
  return content
}

/**
 * Predefined empty state components for common scenarios
 */
export const NoData = ({
  title = "No data available",
  description = "There is no data to display at the moment.",
  actionLabel = "Refresh",
  onAction,
  ...props
}) => (
  <EmptyState
    icon="📊"
    title={title}
    description={description}
    actionLabel={actionLabel}
    onAction={onAction}
    {...props}
  />
)

export const NoResults = ({
  title = "No results found",
  description = "Try adjusting your search criteria or filters.",
  actionLabel = "Clear Filters",
  onAction,
  ...props
}) => (
  <EmptyState
    icon="🔍"
    title={title}
    description={description}
    actionLabel={actionLabel}
    onAction={onAction}
    {...props}
  />
)

export const NoItems = ({
  title = "Nothing here yet",
  description = "Items you add will appear here.",
  actionLabel = "Add Item",
  onAction,
  ...props
}) => (
  <EmptyState
    icon="📦"
    title={title}
    description={description}
    actionLabel={actionLabel}
    onAction={onAction}
    {...props}
  />
)

export const NoRecommendations = ({
  title = "No recommendations yet",
  description = "Get personalized PC recommendations by answering a few questions about your needs.",
  actionLabel = "Get Recommendations",
  onAction,
  ...props
}) => (
  <EmptyState
    icon="🖥️"
    title={title}
    description={description}
    actionLabel={actionLabel}
    onAction={onAction}
    {...props}
  />
)

export const NoPermissions = ({
  title = "Access Restricted",
  description = "You don't have permission to view this content.",
  actionLabel = "Go Back",
  onAction,
  ...props
}) => (
  <EmptyState
    icon="🚫"
    title={title}
    description={description}
    actionLabel={actionLabel}
    onAction={onAction}
    {...props}
  />
)

export const LoadingState = ({
  title = "Loading...",
  description = "Please wait while we load your content.",
  ...props
}) => (
  <EmptyState
    icon="⏳"
    title={title}
    description={description}
    {...props}
  />
)

export const ErrorState = ({
  title = "Something went wrong",
  description = "We encountered an error while loading this content.",
  actionLabel = "Try Again",
  onAction,
  ...props
}) => (
  <EmptyState
    icon="⚠️"
    title={title}
    description={description}
    actionLabel={actionLabel}
    onAction={onAction}
    {...props}
  />
)

export default EmptyState

