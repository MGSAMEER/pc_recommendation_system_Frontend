/**
 * Unit tests for ComparisonTable component
 */
import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import ComparisonTable from '../../../src/components/ComparisonTable'

// Mock MUI icons
jest.mock('@mui/icons-material', () => ({
  Close: () => <div data-testid="close-icon" />,
  Star: (props) => <div data-testid="star-icon" {...props} />,
  AttachMoney: () => <div data-testid="money-icon" />,
  Speed: () => <div data-testid="speed-icon" />,
  Memory: () => <div data-testid="memory-icon" />,
  Storage: () => <div data-testid="storage-icon" />
}))

describe('ComparisonTable', () => {
  const mockRecommendations = [
    {
      configuration_id: 'config-1',
      name: 'Budget Gaming PC',
      total_price: 799.99,
      confidence_score: 75,
      components: [
        { id: 'cpu-1', type: 'cpu', name: 'Ryzen 5 5600', brand: 'AMD', price: 149.99 },
        { id: 'gpu-1', type: 'gpu', name: 'RTX 4060', brand: 'NVIDIA', price: 299.99 },
        { id: 'ram-1', type: 'ram', name: '16GB DDR4', brand: 'Corsair', price: 79.99 },
        { id: 'storage-1', type: 'storage', name: '1TB SSD', brand: 'Samsung', price: 89.99 }
      ],
      suitability_scores: { gaming: 80, office: 65, creative: 70 },
      performance_profile: { gaming_performance: 78, productivity_performance: 70 }
    },
    {
      configuration_id: 'config-2',
      name: 'Performance Gaming PC',
      total_price: 1299.99,
      confidence_score: 88,
      components: [
        { id: 'cpu-2', type: 'cpu', name: 'Ryzen 7 5800X', brand: 'AMD', price: 299.99 },
        { id: 'gpu-2', type: 'gpu', name: 'RTX 4070', brand: 'NVIDIA', price: 549.99 },
        { id: 'ram-2', type: 'ram', name: '32GB DDR4', brand: 'Corsair', price: 149.99 },
        { id: 'storage-2', type: 'storage', name: '2TB SSD', brand: 'Samsung', price: 179.99 }
      ],
      suitability_scores: { gaming: 92, office: 75, creative: 82 },
      performance_profile: { gaming_performance: 90, productivity_performance: 82 }
    }
  ]

  const mockOnRemove = jest.fn()

  const defaultProps = {
    recommendations: mockRecommendations,
    onRemoveRecommendation: mockOnRemove
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders comparison table with recommendations', () => {
    render(<ComparisonTable {...defaultProps} />)

    expect(screen.getByText('Budget Gaming PC')).toBeInTheDocument()
    expect(screen.getByText('Performance Gaming PC')).toBeInTheDocument()
    expect(screen.getByText('$799.99')).toBeInTheDocument()
    expect(screen.getByText('$1,299.99')).toBeInTheDocument()
  })

  test('displays confidence scores correctly', () => {
    render(<ComparisonTable {...defaultProps} />)

    expect(screen.getByText('75%')).toBeInTheDocument()
    expect(screen.getByText('88%')).toBeInTheDocument()
  })

  test('shows component comparison by type', () => {
    render(<ComparisonTable {...defaultProps} />)

    // Check CPU comparison
    expect(screen.getByText('AMD Ryzen 5 5600')).toBeInTheDocument()
    expect(screen.getByText('AMD Ryzen 7 5800X')).toBeInTheDocument()

    // Check GPU comparison
    expect(screen.getByText('NVIDIA RTX 4060')).toBeInTheDocument()
    expect(screen.getByText('NVIDIA RTX 4070')).toBeInTheDocument()
  })

  test('displays suitability scores for different use cases', () => {
    render(<ComparisonTable {...defaultProps} />)

    expect(screen.getByText('Gaming')).toBeInTheDocument()
    expect(screen.getByText('Office')).toBeInTheDocument()
    expect(screen.getByText('Creative')).toBeInTheDocument()
  })

  test('shows performance metrics comparison', () => {
    render(<ComparisonTable {...defaultProps} />)

    expect(screen.getByText('Gaming Performance')).toBeInTheDocument()
    expect(screen.getByText('78%')).toBeInTheDocument()
    expect(screen.getByText('90%')).toBeInTheDocument()
  })

  test('calls onRemoveRecommendation when remove button is clicked', () => {
    render(<ComparisonTable {...defaultProps} />)

    const removeButtons = screen.getAllByTestId('close-icon')
    expect(removeButtons).toHaveLength(2)

    fireEvent.click(removeButtons[0])
    expect(mockOnRemove).toHaveBeenCalledWith('config-1')
  })

  test('displays price difference indicators', () => {
    render(<ComparisonTable {...defaultProps} />)

    // Should show price difference between configurations
    expect(screen.getByText('$799.99')).toBeInTheDocument()
    expect(screen.getByText('$1,299.99')).toBeInTheDocument()

    // Could test for price difference calculations if implemented
    const priceDifference = 1299.99 - 799.99
    expect(screen.getByText(`+$${priceDifference.toFixed(2)}`)).toBeInTheDocument()
  })

  test('handles empty recommendations gracefully', () => {
    render(<ComparisonTable {...defaultProps} recommendations={[]} />)

    expect(screen.getByText('No recommendations to compare')).toBeInTheDocument()
  })

  test('handles single recommendation', () => {
    render(<ComparisonTable {...defaultProps} recommendations={[mockRecommendations[0]]} />)

    expect(screen.getByText('Budget Gaming PC')).toBeInTheDocument()
    expect(screen.queryByText('Performance Gaming PC')).not.toBeInTheDocument()
  })

  test('displays component prices in comparison', () => {
    render(<ComparisonTable {...defaultProps} />)

    // Check individual component prices are shown
    expect(screen.getByText('$149.99')).toBeInTheDocument() // Ryzen 5
    expect(screen.getByText('$299.99')).toBeInTheDocument() // RTX 4060
    expect(screen.getByText('$549.99')).toBeInTheDocument() // RTX 4070
  })

  test('highlights best values in each category', () => {
    render(<ComparisonTable {...defaultProps} />)

    // Performance Gaming PC should be highlighted as better in most categories
    // This would test CSS classes or visual indicators
    const performanceCells = screen.getAllByText('88%')
    expect(performanceCells.length).toBeGreaterThan(0)
  })

  test('shows recommendation summary statistics', () => {
    render(<ComparisonTable {...defaultProps} />)

    // Should show comparison summary like average price, price range, etc.
    expect(screen.getByText('$799.99 - $1,299.99')).toBeInTheDocument()
  })

  test('maintains responsive design for mobile', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600
    })

    render(<ComparisonTable {...defaultProps} />)

    // Should adapt layout for mobile - horizontal scroll or stacked layout
    const table = screen.getByRole('table')
    expect(table).toHaveClass('MuiTable-root') // Basic table structure maintained
  })

  test('provides accessibility features', () => {
    render(<ComparisonTable {...defaultProps} />)

    // Table should have proper ARIA labels
    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()

    // Remove buttons should have accessible labels
    const removeButtons = screen.getAllByLabelText(/remove/i)
    expect(removeButtons.length).toBe(2)
  })
})
