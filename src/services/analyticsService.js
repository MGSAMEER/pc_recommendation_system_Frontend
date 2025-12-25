/**
 * Analytics service for tracking user interactions and usage patterns
 */

import api from './api'

class AnalyticsService {
  constructor() {
    this.enabled = this.checkAnalyticsEnabled()
    this.sessionId = this.generateSessionId()
    this.events = []
    this.maxStoredEvents = 100
  }

  checkAnalyticsEnabled() {
    // Check if user has opted out of analytics
    const consent = localStorage.getItem('analyticsConsent')
    return consent !== 'false' // Default to enabled
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  enableAnalytics() {
    this.enabled = true
    localStorage.setItem('analyticsConsent', 'true')
  }

  disableAnalytics() {
    this.enabled = false
    localStorage.setItem('analyticsConsent', 'false')
    this.events = [] // Clear stored events
  }

  trackEvent(eventName, properties = {}) {
    if (!this.enabled) return

    const event = {
      eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer
      }
    }

    // Store event locally
    this.events.push(event)

    // Keep only recent events
    if (this.events.length > this.maxStoredEvents) {
      this.events = this.events.slice(-this.maxStoredEvents)
    }

    // Send to analytics endpoint (could be batched)
    this.sendEvent(event)

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event)
    }
  }

  async sendEvent(event) {
    try {
      // Use central axios instance so requests go to the backend API server
      await api.post('/analytics/events', event)
    } catch (error) {
      console.warn('Analytics error:', error?.response?.status || error)
      // Store for retry later
      this.storeEventForRetry(event)
    }
  }

  storeEventForRetry(event) {
    const retryEvents = JSON.parse(localStorage.getItem('retryAnalyticsEvents') || '[]')
    retryEvents.push(event)
    localStorage.setItem('retryAnalyticsEvents', JSON.stringify(retryEvents))
  }

  retryStoredEvents() {
    const retryEvents = JSON.parse(localStorage.getItem('retryAnalyticsEvents') || '[]')
    if (retryEvents.length > 0) {
      retryEvents.forEach(event => this.sendEvent(event))
      localStorage.removeItem('retryAnalyticsEvents')
    }
  }

  // Specific tracking methods
  trackPageView(pageName, properties = {}) {
    this.trackEvent('page_view', {
      page: pageName,
      ...properties
    })
  }

  trackRecommendationViewed(recommendationId, properties = {}) {
    this.trackEvent('recommendation_viewed', {
      recommendationId,
      ...properties
    })
  }

  trackRecommendationExpanded(recommendationId, properties = {}) {
    this.trackEvent('recommendation_expanded', {
      recommendationId,
      ...properties
    })
  }

  trackComparisonAdded(recommendationId, properties = {}) {
    this.trackEvent('comparison_added', {
      recommendationId,
      ...properties
    })
  }

  trackFeedbackSubmitted(recommendationId, feedback, properties = {}) {
    this.trackEvent('feedback_submitted', {
      recommendationId,
      helpful: feedback.helpful,
      rating: feedback.rating,
      hasComments: !!feedback.comments,
      ...properties
    })
  }

  trackFormInteraction(formName, action, properties = {}) {
    this.trackEvent('form_interaction', {
      form: formName,
      action,
      ...properties
    })
  }

  trackError(error, context = {}) {
    this.trackEvent('error_occurred', {
      error: error.message || error.toString(),
      stack: error.stack,
      context,
      ...context
    })
  }

  // Performance tracking
  trackPerformance(metricName, value, properties = {}) {
    this.trackEvent('performance_metric', {
      metric: metricName,
      value,
      ...properties
    })
  }

  // User journey tracking
  trackJourneyStep(stepName, properties = {}) {
    this.trackEvent('journey_step', {
      step: stepName,
      ...properties
    })
  }

  // Get analytics summary for current session
  getSessionSummary() {
    const sessionEvents = this.events.filter(event => event.properties.sessionId === this.sessionId)

    return {
      sessionId: this.sessionId,
      totalEvents: sessionEvents.length,
      eventTypes: sessionEvents.reduce((acc, event) => {
        acc[event.eventName] = (acc[event.eventName] || 0) + 1
        return acc
      }, {}),
      startTime: sessionEvents.length > 0 ? sessionEvents[0].properties.timestamp : null,
      lastActivity: sessionEvents.length > 0 ? sessionEvents[sessionEvents.length - 1].properties.timestamp : null
    }
  }

  // Export events for debugging
  exportEvents() {
    return {
      sessionId: this.sessionId,
      events: this.events,
      summary: this.getSessionSummary()
    }
  }
}

// Export singleton instance
const analyticsService = new AnalyticsService()
export default analyticsService
