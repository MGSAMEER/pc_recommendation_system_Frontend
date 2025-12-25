import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  Build as BuildIcon
} from '@mui/icons-material'
import api from '../services/api'

const Components = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [components, setComponents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    type: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  })
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  })
  const [expandedSpecs, setExpandedSpecs] = useState({})

  useEffect(() => {
    loadComponents()
  }, [filters, pagination.page])

  const loadComponents = async () => {
    setLoading(true)
    setError('')

    try {
      const params = {
        page: pagination.page,
        page_size: pagination.pageSize
      }

      if (filters.type) params.component_type = filters.type
      if (filters.brand) params.brand = filters.brand
      if (filters.minPrice) params.min_price = parseFloat(filters.minPrice)
      if (filters.maxPrice) params.max_price = parseFloat(filters.maxPrice)

      const response = await api.get('/components', { params })
      const data = response.data

      setComponents(data.components || [])
      setPagination(prev => ({
        ...prev,
        total: data.total || 0,
        totalPages: Math.ceil((data.total || 0) / pagination.pageSize)
      }))
    } catch (err) {
      console.error('Error loading components:', err)
      setError('Failed to load components. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (field) => (event) => {
    const value = event.target.value
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page
  }

  const handlePageChange = (event, value) => {
    setPagination(prev => ({ ...prev, page: value }))
  }

  const handleClearFilters = () => {
    setFilters({
      type: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      search: ''
    })
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const toggleSpecsExpansion = (componentId) => {
    setExpandedSpecs(prev => ({
      ...prev,
      [componentId]: !prev[componentId]
    }))
  }

  const componentTypes = [
    'cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu', 'case', 'cooler'
  ]

  const brands = [
    'AMD', 'Intel', 'NVIDIA', 'ASUS', 'MSI', 'Gigabyte', 'Corsair', 'Samsung',
    'Western Digital', 'Seagate', 'Crucial', 'Kingston', 'EVGA', 'Cooler Master'
  ]

  const formatPrice = (price) => {
    return typeof price === 'number' ? `$${price.toFixed(2)}` : 'Price not available'
  }

  const getComponentTypeColor = (type) => {
    const colors = {
      cpu: 'primary',
      gpu: 'secondary',
      ram: 'success',
      storage: 'warning',
      motherboard: 'error',
      psu: 'info',
      case: 'default',
      cooler: 'default'
    }
    return colors[type] || 'default'
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 600 }}>
          Browse Components
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore our comprehensive catalog of PC components. Filter by type, brand, and price to find exactly what you need.
        </Typography>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <FilterIcon sx={{ mr: 1 }} />
            Filters
          </Typography>

          <Grid container spacing={3}>
            {/* Search */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search components"
                value={filters.search}
                onChange={handleFilterChange('search')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                placeholder="Search by name, brand, or model..."
              />
            </Grid>

            {/* Component Type */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Component Type</InputLabel>
                <Select
                  value={filters.type}
                  onChange={handleFilterChange('type')}
                  label="Component Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  {componentTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Brand */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Brand</InputLabel>
                <Select
                  value={filters.brand}
                  onChange={handleFilterChange('brand')}
                  label="Brand"
                >
                  <MenuItem value="">All Brands</MenuItem>
                  {brands.map((brand) => (
                    <MenuItem key={brand} value={brand}>
                      {brand}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Price Range */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Min Price ($)"
                type="number"
                value={filters.minPrice}
                onChange={handleFilterChange('minPrice')}
                inputProps={{ min: 0, step: 10 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Max Price ($)"
                type="number"
                value={filters.maxPrice}
                onChange={handleFilterChange('maxPrice')}
                inputProps={{ min: 0, step: 10 }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={loadComponents}
              disabled={loading}
            >
              Apply Filters
            </Button>
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              disabled={loading}
            >
              Clear Filters
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Results Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="h2">
          {loading ? 'Loading components...' : `${pagination.total} components found`}
        </Typography>
        {!loading && components.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            Page {pagination.page} of {pagination.totalPages}
          </Typography>
        )}
      </Box>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Components Grid */}
      {!loading && components.length > 0 && (
        <>
          <Grid container spacing={3}>
            {components.map((component) => (
              <Grid item xs={12} sm={6} lg={4} key={component.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <BuildIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Chip
                        label={component.type.toUpperCase()}
                        color={getComponentTypeColor(component.type)}
                        size="small"
                      />
                    </Box>

                    <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                      {component.name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {component.brand} • {component.model}
                    </Typography>

                    <Typography variant="h5" color="primary.main" sx={{ mb: 2, fontWeight: 600 }}>
                      {formatPrice(component.price)}
                    </Typography>

                    {/* Specifications */}
                    {component.specifications && Object.keys(component.specifications).length > 0 && (
                      <Accordion
                        expanded={expandedSpecs[component.id] || false}
                        onChange={() => toggleSpecsExpansion(component.id)}
                        sx={{ mt: 2 }}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="body2" fontWeight={600}>
                            Specifications ({Object.keys(component.specifications).length})
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {Object.entries(component.specifications).map(([key, value]) => (
                              <Chip
                                key={key}
                                label={`${key}: ${value}`}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </CardContent>

                  <CardActions>
                    <Button size="small" variant="outlined">
                      View Details
                    </Button>
                    <Button size="small" color="primary">
                      Add to Wishlist
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? 'small' : 'medium'}
                sx={{ '& .MuiPaginationItem-root': { color: 'common.white' } }}
              />
            </Box>
          )}
        </>
      )}

      {/* No Results */}
      {!loading && components.length === 0 && !error && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <BuildIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No components found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your filters or search terms to find more components.
            </Typography>
            <Button
              variant="outlined"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </Container>
  )
}

export default Components