import { useTheme, useMediaQuery } from '@mui/material'

/**
 * Responsive design utilities and hooks for PC Recommendation System
 * Provides consistent breakpoints and responsive behavior across components
 */

// Breakpoint definitions (matching MUI defaults)
export const BREAKPOINTS = {
  xs: 0,     // Extra small devices (phones, 0px and up)
  sm: 600,   // Small devices (tablets, 600px and up)
  md: 900,   // Medium devices (small laptops, 900px and up)
  lg: 1200,  // Large devices (desktops, 1200px and up)
  xl: 1536   // Extra large devices (large desktops, 1536px and up)
}

// Device type helpers
export const DEVICE_TYPES = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
  LARGE_DESKTOP: 'large_desktop'
}

/**
 * useResponsive - Hook for responsive design utilities
 * Returns current screen size information and device type
 */
export const useResponsive = () => {
  const theme = useTheme()

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('xl'))

  const getDeviceType = () => {
    if (isMobile) return DEVICE_TYPES.MOBILE
    if (isTablet) return DEVICE_TYPES.TABLET
    if (isLargeDesktop) return DEVICE_TYPES.LARGE_DESKTOP
    return DEVICE_TYPES.DESKTOP
  }

  const getCurrentBreakpoint = () => {
    const width = window.innerWidth
    if (width >= BREAKPOINTS.xl) return 'xl'
    if (width >= BREAKPOINTS.lg) return 'lg'
    if (width >= BREAKPOINTS.md) return 'md'
    if (width >= BREAKPOINTS.sm) return 'sm'
    return 'xs'
  }

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    deviceType: getDeviceType(),
    currentBreakpoint: getCurrentBreakpoint(),
    breakpoints: BREAKPOINTS
  }
}

/**
 * useBreakpoint - Hook for specific breakpoint queries
 */
export const useBreakpoint = () => {
  const theme = useTheme()

  return {
    xs: useMediaQuery(theme.breakpoints.only('xs')),
    sm: useMediaQuery(theme.breakpoints.only('sm')),
    md: useMediaQuery(theme.breakpoints.only('md')),
    lg: useMediaQuery(theme.breakpoints.only('lg')),
    xl: useMediaQuery(theme.breakpoints.only('xl')),

    up: {
      xs: useMediaQuery(theme.breakpoints.up('xs')),
      sm: useMediaQuery(theme.breakpoints.up('sm')),
      md: useMediaQuery(theme.breakpoints.up('md')),
      lg: useMediaQuery(theme.breakpoints.up('lg')),
      xl: useMediaQuery(theme.breakpoints.up('xl'))
    },

    down: {
      xs: useMediaQuery(theme.breakpoints.down('xs')),
      sm: useMediaQuery(theme.breakpoints.down('sm')),
      md: useMediaQuery(theme.breakpoints.down('md')),
      lg: useMediaQuery(theme.breakpoints.down('lg')),
      xl: useMediaQuery(theme.breakpoints.down('xl'))
    },

    between: (start, end) => useMediaQuery(theme.breakpoints.between(start, end)),
    only: (key) => useMediaQuery(theme.breakpoints.only(key))
  }
}

/**
 * Responsive container utilities
 */
export const responsiveContainer = {
  maxWidth: {
    xs: '100%',
    sm: '100%',
    md: 800,
    lg: 1000,
    xl: 1200
  },
  padding: {
    xs: 2,
    sm: 3,
    md: 4,
    lg: 5,
    xl: 6
  }
}

/**
 * Responsive typography scales
 */
export const responsiveTypography = {
  h1: {
    fontSize: {
      xs: '2rem',
      sm: '2.5rem',
      md: '3rem',
      lg: '3.5rem',
      xl: '4rem'
    },
    lineHeight: {
      xs: 1.2,
      sm: 1.2,
      md: 1.1,
      lg: 1.1,
      xl: 1
    }
  },
  h2: {
    fontSize: {
      xs: '1.5rem',
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem',
      xl: '3.5rem'
    }
  },
  h3: {
    fontSize: {
      xs: '1.25rem',
      sm: '1.5rem',
      md: '2rem',
      lg: '2.5rem',
      xl: '3rem'
    }
  },
  body1: {
    fontSize: {
      xs: '0.875rem',
      sm: '1rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.125rem'
    }
  }
}

/**
 * Responsive grid utilities
 */
export const responsiveGrid = {
  // Standard responsive columns
  columns: {
    xs: 12,
    sm: 12,
    md: 12,
    lg: 12,
    xl: 12
  },

  // Common spacing values
  spacing: {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5
  },

  // Grid item sizes for different layouts
  itemSizes: {
    // Full width on mobile, half on larger screens
    responsiveHalf: {
      xs: 12,
      sm: 6,
      md: 6,
      lg: 6,
      xl: 6
    },

    // Full width on mobile, third on larger screens
    responsiveThird: {
      xs: 12,
      sm: 6,
      md: 4,
      lg: 4,
      xl: 4
    },

    // Quarter width on large screens
    responsiveQuarter: {
      xs: 12,
      sm: 6,
      md: 6,
      lg: 3,
      xl: 3
    }
  }
}

/**
 * Responsive spacing utilities
 */
export const responsiveSpacing = {
  // Page padding
  pagePadding: {
    xs: 2,
    sm: 3,
    md: 4,
    lg: 6,
    xl: 8
  },

  // Section margins
  sectionMargin: {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 10,
    xl: 12
  },

  // Card padding
  cardPadding: {
    xs: 2,
    sm: 3,
    md: 3,
    lg: 4,
    xl: 4
  }
}

/**
 * Responsive utility functions
 */
export const responsiveUtils = {
  /**
   * Get responsive value based on current breakpoint
   */
  getResponsiveValue: (values, defaultValue = null) => {
    const { currentBreakpoint } = useResponsive()
    return values[currentBreakpoint] || defaultValue
  },

  /**
   * Hide element on specific breakpoints
   */
  hiddenOn: (breakpoints) => {
    const hiddenStyles = {}
    breakpoints.forEach(bp => {
      hiddenStyles[theme => theme.breakpoints.down(bp)] = {
        display: 'none !important'
      }
    })
    return hiddenStyles
  },

  /**
   * Show element only on specific breakpoints
   */
  visibleOn: (breakpoints) => {
    const visibleStyles = {}
    breakpoints.forEach(bp => {
      visibleStyles[theme => theme.breakpoints.up(bp)] = {
        display: 'block !important'
      }
      visibleStyles[theme => theme.breakpoints.down(bp)] = {
        display: 'none !important'
      }
    })
    return visibleStyles
  }
}

/**
 * Responsive theme overrides for MUI components
 */
export const responsiveThemeOverrides = {
  MuiContainer: {
    styleOverrides: {
      root: {
        paddingLeft: {
          xs: 16,
          sm: 24,
          md: 32,
          lg: 40,
          xl: 48
        },
        paddingRight: {
          xs: 16,
          sm: 24,
          md: 32,
          lg: 40,
          xl: 48
        }
      }
    }
  },

  MuiGrid: {
    styleOverrides: {
      item: {
        paddingTop: {
          xs: 8,
          sm: 12,
          md: 16,
          lg: 20,
          xl: 24
        },
        paddingBottom: {
          xs: 8,
          sm: 12,
          md: 16,
          lg: 20,
          xl: 24
        }
      }
    }
  }
}

export default {
  BREAKPOINTS,
  DEVICE_TYPES,
  useResponsive,
  useBreakpoint,
  responsiveContainer,
  responsiveTypography,
  responsiveGrid,
  responsiveSpacing,
  responsiveUtils,
  responsiveThemeOverrides
}

