import React from 'react'
import {
  Box,
  Skeleton,
  Card,
  CardContent,
  Grid,
  Typography
} from '@mui/material'

export const RecommendationCardSkeleton = () => (
  <Card sx={{ mb: 2, width: '100%' }}>
    <CardContent>
      {/* Header skeleton */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="70%" height={32} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="40%" height={28} />
        </Box>
        <Skeleton variant="rectangular" width={60} height={32} sx={{ borderRadius: 16 }} />
      </Box>

      {/* Description skeleton */}
      <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />

      {/* Components skeleton */}
      <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="rectangular" width={80} height={24} sx={{ borderRadius: 12 }} />
        ))}
      </Box>
    </CardContent>

    {/* Actions skeleton */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, pt: 0 }}>
      <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 4 }} />
      <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 4 }} />
    </Box>
  </Card>
)

export const ComparisonTableSkeleton = () => (
  <Box>
    {/* Header skeleton */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <Skeleton variant="text" width="200px" height={32} />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 4 }} />
        <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 4 }} />
      </Box>
    </Box>

    {/* Stats skeleton */}
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <Skeleton variant="rectangular" width={150} height={24} sx={{ borderRadius: 12 }} />
      <Skeleton variant="rectangular" width={120} height={24} sx={{ borderRadius: 12 }} />
    </Box>

    {/* Table skeleton */}
    <Box sx={{ overflowX: 'auto' }}>
      <Box sx={{ minWidth: 800, border: 1, borderColor: 'divider', borderRadius: 1 }}>
        {/* Table header */}
        <Box sx={{ display: 'flex', p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
          <Box sx={{ flex: 3, pr: 1 }}>
            <Skeleton variant="text" width="80%" height={24} />
          </Box>
          <Box sx={{ flex: 1, px: 1 }}>
            <Skeleton variant="text" width="100%" height={24} />
          </Box>
          <Box sx={{ flex: 1, px: 1 }}>
            <Skeleton variant="text" width="100%" height={24} />
          </Box>
          <Box sx={{ flex: 1, px: 1 }}>
            <Skeleton variant="text" width="100%" height={24} />
          </Box>
          <Box sx={{ flex: 1, px: 1 }}>
            <Skeleton variant="text" width="100%" height={24} />
          </Box>
          <Box sx={{ flex: 1, px: 1 }}>
            <Skeleton variant="text" width="100%" height={24} />
          </Box>
          <Box sx={{ flex: 1, px: 1 }}>
            <Skeleton variant="text" width="100%" height={24} />
          </Box>
          <Box sx={{ flex: 1, pl: 1 }}>
            <Skeleton variant="text" width="100%" height={24} />
          </Box>
        </Box>

        {/* Table rows */}
        {[1, 2, 3].map((row) => (
          <Box key={row} sx={{ display: 'flex', p: 2, borderBottom: row < 3 ? 1 : 0, borderColor: 'divider' }}>
            <Box sx={{ flex: 3, pr: 1 }}>
              <Skeleton variant="text" width="70%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="50%" height={20} />
            </Box>
            <Box sx={{ flex: 1, px: 1 }}>
              <Skeleton variant="text" width="100%" height={24} />
            </Box>
            <Box sx={{ flex: 1, px: 1 }}>
              <Skeleton variant="rectangular" width="60%" height={32} sx={{ borderRadius: 16, mx: 'auto' }} />
            </Box>
            <Box sx={{ flex: 1, px: 1 }}>
              <Skeleton variant="text" width="80%" height={20} />
            </Box>
            <Box sx={{ flex: 1, px: 1 }}>
              <Skeleton variant="text" width="80%" height={20} />
            </Box>
            <Box sx={{ flex: 1, px: 1 }}>
              <Skeleton variant="text" width="80%" height={20} />
            </Box>
            <Box sx={{ flex: 1, px: 1 }}>
              <Skeleton variant="text" width="100%" height={20} />
            </Box>
            <Box sx={{ flex: 1, pl: 1 }}>
              <Skeleton variant="circular" width={32} height={32} />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
)

export const FormSkeleton = () => (
  <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
    {/* Title skeleton */}
    <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2, mx: 'auto' }} />
    <Skeleton variant="text" width="80%" height={24} sx={{ mb: 4, mx: 'auto' }} />

    {/* Form fields skeleton */}
    {[1, 2, 3, 4, 5].map((i) => (
      <Box key={i} sx={{ mb: 2 }}>
        <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
      </Box>
    ))}

    {/* Submit button skeleton */}
    <Skeleton variant="rectangular" width="100%" height={48} sx={{ mt: 3, borderRadius: 1 }} />
  </Box>
)

export const PageSkeleton = ({ title, subtitle, children }) => (
  <Box sx={{ py: 4 }}>
    {/* Header skeleton */}
    <Box sx={{ mb: 4, textAlign: 'center' }}>
      <Skeleton variant="text" width="40%" height={48} sx={{ mb: 2, mx: 'auto' }} />
      <Skeleton variant="text" width="60%" height={24} sx={{ mx: 'auto' }} />
    </Box>

    {/* Content skeleton */}
    {children || (
      <Grid container spacing={3}>
        {[1, 2, 3].map((i) => (
          <Grid item xs={12} md={4} key={i}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 1 }} />
                <Skeleton variant="text" width="80%" height={24} sx={{ mt: 2 }} />
                <Skeleton variant="text" width="60%" height={20} sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    )}
  </Box>
)

export default {
  RecommendationCardSkeleton,
  ComparisonTableSkeleton,
  FormSkeleton,
  PageSkeleton
}
