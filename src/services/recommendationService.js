import { apiService } from './api'

export const recommendationService = {
  /**
   * Get PC recommendations based on user requirements
   * @param {Object} requirements - User requirements
   * @param {string} requirements.session_id - Anonymous session ID
   * @param {string} requirements.purpose - Use case (gaming, office, creative, programming, general)
   * @param {Object} requirements.budget - Budget range
   * @param {string} requirements.performance_level - Performance level (basic, standard, high, professional)
   * @param {string[]} requirements.preferred_brands - Preferred brands (optional)
   * @param {string[]} requirements.must_have_features - Required features (optional)
   * @returns {Promise<Object>} Recommendation response
   */
  async getRecommendations(requirements) {
    try {
      const response = await apiService.createRecommendations(requirements)
      return response.data
    } catch (error) {
      console.error('Error getting recommendations:', error)
      throw error
    }
  },

  /**
   * Get detailed information about a specific recommendation
   * @param {string} recommendationId - Recommendation ID
   * @returns {Promise<Object>} Detailed recommendation data
   */
  async getRecommendationDetails(recommendationId) {
    try {
      const response = await apiService.getRecommendation(recommendationId)
      return response.data
    } catch (error) {
      console.error('Error getting recommendation details:', error)
      throw error
    }
  },

  /**
   * Submit feedback on a recommendation
   * @param {Object} feedback - Feedback data
   * @param {string} feedback.recommendation_id - Recommendation ID
   * @param {number} feedback.rating - Rating 1-5 (optional)
   * @param {boolean} feedback.helpful - Whether recommendation was helpful
   * @param {string} feedback.purchased_config_id - Purchased config ID (optional)
   * @param {string} feedback.comments - Feedback comments (optional)
   * @returns {Promise<Object>} Feedback response
   */
  async submitFeedback(feedback) {
    try {
      const response = await apiService.submitFeedback(feedback)
      return response.data
    } catch (error) {
      console.error('Error submitting feedback:', error)
      throw error
    }
  },

  /**
   * Get available PC components with optional filtering
   * @param {Object} filters - Filter options
   * @param {string} filters.type - Component type (cpu, gpu, ram, etc.)
   * @param {string} filters.brand - Brand filter
   * @param {number} filters.min_price - Minimum price
   * @param {number} filters.max_price - Maximum price
   * @param {string} filters.performance_level - Performance level
   * @param {number} filters.limit - Result limit
   * @param {number} filters.offset - Result offset
   * @returns {Promise<Object>} Components list
   */
  async getComponents(filters = {}) {
    try {
      const response = await apiService.listComponents(filters)
      return response.data
    } catch (error) {
      console.error('Error getting components:', error)
      throw error
    }
  },

  /**
   * Get detailed information about a specific component
   * @param {string} componentId - Component ID
   * @returns {Promise<Object>} Component details
   */
  async getComponentDetails(componentId) {
    try {
      const response = await apiService.getComponent(componentId)
      return response.data
    } catch (error) {
      console.error('Error getting component details:', error)
      throw error
    }
  },

  /**
   * Generate a session ID for anonymous users
   * @returns {string} Session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },

  /**
   * Validate user requirements before submission
   * @param {Object} requirements - User requirements to validate
   * @returns {Object} Validation result with errors array
   */
  validateRequirements(requirements) {
    const errors = []

    if (!requirements.session_id) {
      errors.push('Session ID is required')
    }

    if (!requirements.purpose) {
      errors.push('Purpose is required')
    } else {
      const validPurposes = ['gaming', 'office', 'creative', 'programming', 'general']
      if (!validPurposes.includes(requirements.purpose)) {
        errors.push('Invalid purpose selected')
      }
    }

    if (!requirements.budget) {
      errors.push('Budget is required')
    } else {
      if (!requirements.budget.min || requirements.budget.min < 0) {
        errors.push('Valid minimum budget is required')
      }
      if (!requirements.budget.max || requirements.budget.max < requirements.budget.min) {
        errors.push('Valid maximum budget is required and must be greater than minimum')
      }
    }

    if (!requirements.performance_level) {
      errors.push('Performance level is required')
    } else {
      const validLevels = ['basic', 'standard', 'high', 'professional']
      if (!validLevels.includes(requirements.performance_level)) {
        errors.push('Invalid performance level selected')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

export default recommendationService
