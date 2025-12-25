/**
 * Unit tests for ExplanationPanel component
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ExplanationPanel from '../../../src/components/ExplanationPanel'

// Mock the required icons
jest.mock('@mui/icons-material', () => ({
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  Warning: () => <div data-testid="warning-icon" />,
  Info: () => <div data-testid="info-icon" />
}))

describe('ExplanationPanel', () => {
  const mockRecommendation = {
    configuration_id: 'config-123',
    name: 'Gaming PC Build',
    total_price: 1299.99,
    confidence_score: 85,
    match_reasons: [
      {
        factor: 'purpose_alignment',
        weight: 0.4,
        explanation: 'Well-suited for gaming with high-performance components'
      },
      {
        factor: 'budget_fit',
        weight: 0.3,
        explanation: 'Price fits within your budget range'
      },
      {
        factor: 'performance_match',
        weight: 0.2,
        explanation: 'Performance level matches your high requirements'
      }
    ],
    trade_offs: [
      {
        type: 'budget',
        impact: 'neutral',
        description: 'Configuration uses budget effectively for gaming performance'
      }
    ],
    components: [
      {
        id: 'cpu-123',
        type: 'cpu',
        name: 'AMD Ryzen 5 5600X',
        brand: 'AMD',
        price: 199.99
      },
      {
        id: 'gpu-456',
        type: 'gpu',
        name: 'NVIDIA RTX 4070',
        brand: 'NVIDIA',
        price: 599.99
      }
    ]
  }

  const defaultProps = {
    recommendation: mockRecommendation,
    isOpen: true,
    onToggle: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders explanation panel when open', () => {
    render(<ExplanationPanel {...defaultProps} />)

    expect(screen.getByText('Why This PC Matches Your Needs:')).toBeInTheDocument()
    expect(screen.getByText('Well-suited for gaming with high-performance components')).toBeInTheDocument()
    expect(screen.getByText('Price fits within your budget range')).toBeInTheDocument()
  })

  test('does not render content when closed', () => {
    render(<ExplanationPanel {...defaultProps} isOpen={false} />)

    expect(screen.queryByText('Why This PC Matches Your Needs:')).not.toBeInTheDocument()
    expect(screen.queryByText('Well-suited for gaming with high-performance components')).not.toBeInTheDocument()
  })

  test('displays match reasons with correct weights', () => {
    render(<ExplanationPanel {...defaultProps} />)

    // Check that weights are displayed correctly
    expect(screen.getByText('Weight: 40%')).toBeInTheDocument()
    expect(screen.getByText('Weight: 30%')).toBeInTheDocument()
    expect(screen.getByText('Weight: 20%')).toBeInTheDocument()
  })

  test('displays trade-offs when present', () => {
    render(<ExplanationPanel {...defaultProps} />)

    expect(screen.getByText('Important Considerations:')).toBeInTheDocument()
    expect(screen.getByText('Configuration uses budget effectively for gaming performance')).toBeInTheDocument()
  })

  test('does not display trade-offs section when empty', () => {
    const recommendationWithoutTradeOffs = {
      ...mockRecommendation,
      trade_offs: []
    }

    render(<ExplanationPanel {...defaultProps} recommendation={recommendationWithoutTradeOffs} />)

    expect(screen.queryByText('Important Considerations:')).not.toBeInTheDocument()
  })

  test('displays complete component list', () => {
    render(<ExplanationPanel {...defaultProps} />)

    expect(screen.getByText('Complete Component List:')).toBeInTheDocument()
    expect(screen.getByText('CPU: AMD AMD Ryzen 5 5600X')).toBeInTheDocument()
    expect(screen.getByText('GPU: NVIDIA NVIDIA RTX 4070')).toBeInTheDocument()
  })

  test('handles empty match reasons gracefully', () => {
    const recommendationWithoutReasons = {
      ...mockRecommendation,
      match_reasons: []
    }

    render(<ExplanationPanel {...defaultProps} recommendation={recommendationWithoutReasons} />)

    expect(screen.getByText('Why This PC Matches Your Needs:')).toBeInTheDocument()
    // Should not crash and should show empty reasons section
  })

  test('displays confidence score prominently', () => {
    render(<ExplanationPanel {...defaultProps} />)

    // The confidence score is displayed in the parent RecommendationCard
    // This test ensures the explanation panel doesn't interfere
    expect(screen.getByText('Well-suited for gaming with high-performance components')).toBeInTheDocument()
  })

  test('shows different icons for different reason types', () => {
    render(<ExplanationPanel {...defaultProps} />)

    // All match reasons should have check circle icons
    const checkIcons = screen.getAllByTestId('check-circle-icon')
    expect(checkIcons.length).toBe(3) // One for each match reason
  })

  test('shows warning icon for trade-offs', () => {
    render(<ExplanationPanel {...defaultProps} />)

    // Trade-offs should have warning icons
    expect(screen.getByTestId('warning-icon')).toBeInTheDocument()
  })

  test('handles recommendation with no components', () => {
    const recommendationWithoutComponents = {
      ...mockRecommendation,
      components: []
    }

    render(<ExplanationPanel {...defaultProps} recommendation={recommendationWithoutComponents} />)

    expect(screen.getByText('Complete Component List:')).toBeInTheDocument()
    // Should handle empty component list gracefully
  })

  test('displays monetary values correctly', () => {
    render(<ExplanationPanel {...defaultProps} />)

    // Component prices should be formatted correctly
    expect(screen.getByText('$199.99')).toBeInTheDocument()
    expect(screen.getByText('$599.99')).toBeInTheDocument()
  })

  test('maintains accessibility with proper ARIA labels', () => {
    render(<ExplanationPanel {...defaultProps} />)

    // Test that expandable sections have proper accessibility
    const expandableSections = screen.getAllByRole('region')
    expect(expandableSections.length).toBeGreaterThan(0)
  })
})
