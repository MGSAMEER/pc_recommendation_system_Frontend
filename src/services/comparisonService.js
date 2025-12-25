/**
 * Service for managing PC comparison functionality
 */

class ComparisonService {
  constructor() {
    this.maxItems = 4 // Maximum items that can be compared
    this.storageKey = 'pcComparison'
  }

  /**
   * Get current comparison items from localStorage
   * @returns {Array} Array of PC configurations in comparison
   */
  getComparisonItems() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading comparison items:', error)
      return []
    }
  }

  /**
   * Add a PC configuration to comparison
   * @param {Object} pcConfig - PC configuration to add
   * @returns {Object} Result with success status and message
   */
  addToComparison(pcConfig) {
    if (!pcConfig || !pcConfig.configuration_id) {
      return {
        success: false,
        message: 'Invalid PC configuration'
      }
    }

    const currentItems = this.getComparisonItems()

    // Check if already in comparison
    const existing = currentItems.find(item => item.configuration_id === pcConfig.configuration_id)
    if (existing) {
      return {
        success: false,
        message: 'This PC is already in your comparison'
      }
    }

    // Check max items limit
    if (currentItems.length >= this.maxItems) {
      return {
        success: false,
        message: `You can compare up to ${this.maxItems} PCs at once. Remove some to add more.`
      }
    }

    // Add to comparison
    const updatedItems = [...currentItems, pcConfig]
    this.saveComparisonItems(updatedItems)

    return {
      success: true,
      message: 'PC added to comparison',
      count: updatedItems.length
    }
  }

  /**
   * Remove a PC configuration from comparison
   * @param {string} configurationId - ID of PC to remove
   * @returns {Object} Result with success status
   */
  removeFromComparison(configurationId) {
    const currentItems = this.getComparisonItems()
    const updatedItems = currentItems.filter(item => item.configuration_id !== configurationId)

    if (updatedItems.length === currentItems.length) {
      return {
        success: false,
        message: 'PC not found in comparison'
      }
    }

    this.saveComparisonItems(updatedItems)

    return {
      success: true,
      message: 'PC removed from comparison',
      count: updatedItems.length
    }
  }

  /**
   * Clear all items from comparison
   */
  clearComparison() {
    localStorage.removeItem(this.storageKey)
    return {
      success: true,
      message: 'Comparison cleared'
    }
  }

  /**
   * Check if a PC is in comparison
   * @param {string} configurationId - PC configuration ID
   * @returns {boolean} True if in comparison
   */
  isInComparison(configurationId) {
    const items = this.getComparisonItems()
    return items.some(item => item.configuration_id === configurationId)
  }

  /**
   * Get comparison statistics
   * @returns {Object} Statistics about current comparison
   */
  getComparisonStats() {
    const items = this.getComparisonItems()

    if (items.length === 0) {
      return { count: 0, priceRange: null, avgConfidence: 0 }
    }

    const prices = items.map(item => item.total_price)
    const confidences = items.map(item => item.confidence_score)

    return {
      count: items.length,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices),
        difference: Math.max(...prices) - Math.min(...prices)
      },
      avgConfidence: Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length),
      bestValue: items.reduce((best, current) =>
        (current.confidence_score / current.total_price) >
        (best.confidence_score / best.total_price) ? current : best
      )
    }
  }

  /**
   * Compare PCs by specific criteria
   * @param {string} criteria - Comparison criteria (price, performance, suitability)
   * @returns {Array} Sorted comparison items
   */
  compareByCriteria(criteria) {
    const items = this.getComparisonItems()

    return items.sort((a, b) => {
      switch (criteria) {
        case 'price':
          return a.total_price - b.total_price
        case 'performance':
          return (b.performance_profile?.overall_performance || 0) -
                 (a.performance_profile?.overall_performance || 0)
        case 'confidence':
          return b.confidence_score - a.confidence_score
        case 'value':
          // Best value = highest confidence per dollar
          const aValue = a.confidence_score / a.total_price
          const bValue = b.confidence_score / b.total_price
          return bValue - aValue
        default:
          return 0
      }
    })
  }

  /**
   * Export comparison data for sharing/printing
   * @returns {Object} Exportable comparison data
   */
  exportComparison() {
    const items = this.getComparisonItems()
    const stats = this.getComparisonStats()

    return {
      items,
      stats,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }
  }

  /**
   * Import comparison data
   * @param {Object} data - Exported comparison data
   * @returns {Object} Import result
   */
  importComparison(data) {
    try {
      if (!data || !Array.isArray(data.items)) {
        throw new Error('Invalid comparison data format')
      }

      // Validate data structure
      for (const item of data.items) {
        if (!item.configuration_id || !item.name || !item.total_price) {
          throw new Error('Invalid PC configuration data')
        }
      }

      // Limit to max items
      const items = data.items.slice(0, this.maxItems)
      this.saveComparisonItems(items)

      return {
        success: true,
        message: `Imported ${items.length} PC configurations`,
        count: items.length
      }
    } catch (error) {
      return {
        success: false,
        message: `Import failed: ${error.message}`
      }
    }
  }

  /**
   * Save comparison items to localStorage
   * @param {Array} items - Items to save
   * @private
   */
  saveComparisonItems(items) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items))
    } catch (error) {
      console.error('Error saving comparison items:', error)
      // Could implement fallback storage or notify user
    }
  }

  /**
   * Get recommended comparison suggestions based on current items
   * @returns {Array} Suggested comparison criteria or additional PCs
   */
  getComparisonSuggestions() {
    const items = this.getComparisonItems()
    const suggestions = []

    if (items.length === 1) {
      suggestions.push({
        type: 'add_more',
        message: 'Add more PCs to enable side-by-side comparison',
        priority: 'high'
      })
    }

    if (items.length >= 2) {
      const priceRange = Math.max(...items.map(i => i.total_price)) -
                        Math.min(...items.map(i => i.total_price))

      if (priceRange > 500) {
        suggestions.push({
          type: 'consider_value',
          message: 'Large price differences detected. Consider value (performance per dollar)',
          priority: 'medium'
        })
      }

      const performanceDiff = Math.max(...items.map(i => i.performance_profile?.overall_performance || 0)) -
                             Math.min(...items.map(i => i.performance_profile?.overall_performance || 0))

      if (performanceDiff > 30) {
        suggestions.push({
          type: 'performance_gap',
          message: 'Significant performance differences. Compare based on your specific needs.',
          priority: 'medium'
        })
      }
    }

    return suggestions
  }
}

// Export singleton instance
const comparisonService = new ComparisonService()
export default comparisonService
