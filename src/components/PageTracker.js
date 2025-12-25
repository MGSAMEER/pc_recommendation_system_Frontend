import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import analyticsService from '../services/analyticsService'

const PageTracker = () => {
  const location = useLocation()

  useEffect(() => {
    // Track page view
    const pageName = location.pathname === '/' ? 'home' :
                    location.pathname.startsWith('/recommendations') ? 'recommendations' :
                    location.pathname.startsWith('/compare') ? 'compare' : 'unknown'

    analyticsService.trackPageView(pageName, {
      path: location.pathname,
      search: location.search
    })
  }, [location])

  return null // This component doesn't render anything
}

export default PageTracker
