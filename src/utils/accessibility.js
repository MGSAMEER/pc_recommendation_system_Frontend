/**
 * Accessibility utilities for PC Recommendation System
 * Provides ARIA labels, keyboard navigation, and screen reader support
 */

// ARIA label generators
export const ariaLabels = {
  // Navigation
  navigation: {
    main: 'Main navigation',
    skipToContent: 'Skip to main content',
    breadcrumb: 'Breadcrumb navigation'
  },

  // Forms
  forms: {
    email: 'Email address',
    password: 'Password',
    confirmPassword: 'Confirm password',
    fullName: 'Full name',
    search: 'Search components',
    filter: 'Filter options'
  },

  // Buttons
  buttons: {
    submit: 'Submit form',
    cancel: 'Cancel action',
    close: 'Close dialog',
    edit: 'Edit item',
    delete: 'Delete item',
    save: 'Save changes',
    reset: 'Reset form',
    back: 'Go back',
    next: 'Continue',
    previous: 'Go to previous',
    menu: 'Open menu',
    dropdown: 'Open dropdown'
  },

  // Status messages
  status: {
    loading: 'Loading content',
    success: 'Operation completed successfully',
    error: 'An error occurred',
    warning: 'Warning message',
    info: 'Information message'
  },

  // PC specific
  pcComponents: {
    cpu: 'Central Processing Unit',
    gpu: 'Graphics Processing Unit',
    ram: 'Random Access Memory',
    storage: 'Storage device',
    motherboard: 'Motherboard',
    psu: 'Power Supply Unit',
    case: 'Computer case',
    cooler: 'Cooling system'
  }
}

// Keyboard navigation utilities
export const keyboardNavigation = {
  /**
   * Handle keyboard navigation for custom components
   */
  handleKeyDown: (event, actions) => {
    const { key, shiftKey, ctrlKey, altKey, metaKey } = event

    // Standard keyboard shortcuts
    switch (key) {
      case 'Enter':
      case ' ':
        if (actions.onSelect) {
          event.preventDefault()
          actions.onSelect()
        }
        break

      case 'Escape':
        if (actions.onEscape) {
          event.preventDefault()
          actions.onEscape()
        }
        break

      case 'ArrowUp':
        if (actions.onPrevious) {
          event.preventDefault()
          actions.onPrevious()
        }
        break

      case 'ArrowDown':
        if (actions.onNext) {
          event.preventDefault()
          actions.onNext()
        }
        break

      case 'ArrowLeft':
        if (actions.onLeft) {
          event.preventDefault()
          actions.onLeft()
        }
        break

      case 'ArrowRight':
        if (actions.onRight) {
          event.preventDefault()
          actions.onRight()
        }
        break

      case 'Home':
        if (actions.onFirst) {
          event.preventDefault()
          actions.onFirst()
        }
        break

      case 'End':
        if (actions.onLast) {
          event.preventDefault()
          actions.onLast()
        }
        break

      case 'Tab':
        // Let default tab behavior work
        break

      default:
        // Handle custom shortcuts
        if (actions.onKey) {
          actions.onKey(key, { shiftKey, ctrlKey, altKey, metaKey })
        }
        break
    }
  },

  /**
   * Focus management utilities
   */
  focus: {
    /**
     * Trap focus within a container
     */
    trap: (containerRef, options = {}) => {
      const { initialFocus, returnFocus } = options

      const focusableElements = containerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )

      const firstElement = focusableElements?.[0]
      const lastElement = focusableElements?.[focusableElements.length - 1]

      const handleKeyDown = (event) => {
        if (event.key === 'Tab') {
          if (event.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
              event.preventDefault()
              lastElement?.focus()
            }
          } else {
            // Tab
            if (document.activeElement === lastElement) {
              event.preventDefault()
              firstElement?.focus()
            }
          }
        }

        if (event.key === 'Escape' && returnFocus) {
          returnFocus?.focus()
        }
      }

      document.addEventListener('keydown', handleKeyDown)

      // Focus initial element
      if (initialFocus) {
        initialFocus.focus()
      } else {
        firstElement?.focus()
      }

      // Return cleanup function
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    },

    /**
     * Move focus to next element
     */
    moveToNext: (currentElement, direction = 'next') => {
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )

      const currentIndex = Array.from(focusableElements).indexOf(currentElement)

      if (currentIndex === -1) return

      let nextIndex
      if (direction === 'next') {
        nextIndex = currentIndex + 1
        if (nextIndex >= focusableElements.length) {
          nextIndex = 0 // Wrap to beginning
        }
      } else {
        nextIndex = currentIndex - 1
        if (nextIndex < 0) {
          nextIndex = focusableElements.length - 1 // Wrap to end
        }
      }

      focusableElements[nextIndex]?.focus()
    }
  }
}

// Screen reader utilities
export const screenReader = {
  /**
   * Announce content to screen readers
   */
  announce: (message, priority = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.style.position = 'absolute'
    announcement.style.left = '-10000px'
    announcement.style.width = '1px'
    announcement.style.height = '1px'
    announcement.style.overflow = 'hidden'

    announcement.textContent = message
    document.body.appendChild(announcement)

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  },

  /**
   * Create ARIA live region for dynamic content
   */
  createLiveRegion: (priority = 'polite') => {
    const region = document.createElement('div')
    region.setAttribute('aria-live', priority)
    region.setAttribute('aria-atomic', 'false')
    region.style.position = 'absolute'
    region.style.left = '-10000px'
    region.style.width = '1px'
    region.style.height = '1px'
    region.style.overflow = 'hidden'

    document.body.appendChild(region)

    return {
      update: (message) => {
        region.textContent = message
      },
      remove: () => {
        if (document.body.contains(region)) {
          document.body.removeChild(region)
        }
      }
    }
  }
}

// Color and contrast utilities
export const accessibilityColors = {
  /**
   * Check if color contrast meets WCAG standards
   */
  checkContrast: (foreground, background) => {
    // Convert hex to RGB
    const getRGB = (color) => {
      const hex = color.replace('#', '')
      return {
        r: parseInt(hex.substr(0, 2), 16),
        g: parseInt(hex.substr(2, 2), 16),
        b: parseInt(hex.substr(4, 2), 16)
      }
    }

    const fg = getRGB(foreground)
    const bg = getRGB(background)

    // Calculate relative luminance
    const getLuminance = (rgb) => {
      const { r, g, b } = rgb
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
    }

    const l1 = getLuminance(fg)
    const l2 = getLuminance(bg)

    const contrast = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)

    return {
      ratio: contrast,
      aa: contrast >= 4.5, // WCAG AA normal text
      aaa: contrast >= 7,  // WCAG AAA normal text
      aaLarge: contrast >= 3, // WCAG AA large text
      aaaLarge: contrast >= 4.5 // WCAG AAA large text
    }
  }
}

// Motion and animation preferences
export const motionPreferences = {
  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },

  /**
   * Respect user's motion preferences in animations
   */
  getMotionSafeDuration: (defaultDuration) => {
    return motionPreferences.prefersReducedMotion() ? 0 : defaultDuration
  }
}

// Skip links for keyboard navigation
export const skipLinks = {
  /**
   * Add skip link to page
   */
  addSkipLink: (targetId, label = 'Skip to main content') => {
    const skipLink = document.createElement('a')
    skipLink.href = `#${targetId}`
    skipLink.textContent = label
    skipLink.className = 'skip-link'
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 1000;
      border-radius: 0 0 4px 4px;
    `

    // Show on focus
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '0'
    })

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px'
    })

    document.body.insertBefore(skipLink, document.body.firstChild)
  }
}

export default {
  ariaLabels,
  keyboardNavigation,
  screenReader,
  accessibilityColors,
  motionPreferences,
  skipLinks
}

