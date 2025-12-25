import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Breadcrumbs,
  Typography,
  Link as MuiLink,
  Box,
  useTheme
} from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

const BreadcrumbNav = ({ customCrumbs = [] }) => {
  const location = useLocation()
  const theme = useTheme()

  // Define route labels and hierarchy
  const routeLabels = {
    '/': 'Home',
    '/dashboard': 'Dashboard',
    '/recommendations': 'Get Recommendations',
    '/compare': 'Compare PCs',
    '/profile': 'Profile',
    '/settings': 'Settings',
    '/about': 'About',
    '/contact': 'Contact',
    '/help': 'Help',
    '/privacy': 'Privacy Policy',
    '/terms': 'Terms of Service',
    '/support': 'Support'
  }

  // Define route hierarchy for breadcrumbs
  const routeHierarchy = {
    '/recommendations': ['/', '/dashboard'],
    '/compare': ['/', '/dashboard'],
    '/profile': ['/', '/dashboard'],
    '/settings': ['/', '/dashboard', '/profile']
  }

  const generateBreadcrumbs = () => {
    // If custom crumbs are provided, use them
    if (customCrumbs.length > 0) {
      return customCrumbs
    }

    const pathnames = location.pathname.split('/').filter(x => x)
    const breadcrumbs = [{ label: 'Home', path: '/' }]

    let currentPath = ''
    pathnames.forEach((pathname, index) => {
      currentPath += `/${pathname}`

      // Check if this path has a defined hierarchy
      if (routeHierarchy[currentPath]) {
        // Replace breadcrumbs with the defined hierarchy
        breadcrumbs.length = 0
        routeHierarchy[currentPath].forEach(hierarchyPath => {
          breadcrumbs.push({
            label: routeLabels[hierarchyPath] || hierarchyPath.replace('/', '').replace('-', ' '),
            path: hierarchyPath
          })
        })
      }

      // Add current path
      const label = routeLabels[currentPath] || pathname.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
      breadcrumbs.push({
        label,
        path: currentPath,
        isLast: index === pathnames.length - 1
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // Don't show breadcrumbs on home page or if only one item
  if (location.pathname === '/' || breadcrumbs.length <= 1) {
    return null
  }

  return (
    <Box sx={{ mb: 3, px: { xs: 2, md: 0 } }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-separator': {
            color: 'text.secondary'
          }
        }}
      >
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1 || crumb.isLast

          return isLast ? (
            <Typography
              key={crumb.path}
              color="text.primary"
              variant="body2"
              sx={{ fontWeight: 500 }}
            >
              {crumb.label}
            </Typography>
          ) : (
            <MuiLink
              key={crumb.path}
              component={Link}
              to={crumb.path}
              color="inherit"
              variant="body2"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  color: theme.palette.primary.main,
                  textDecoration: 'underline'
                }
              }}
            >
              {crumb.label}
            </MuiLink>
          )
        })}
      </Breadcrumbs>
    </Box>
  )
}

export default BreadcrumbNav

