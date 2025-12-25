/**
 * Integration test for recommendation form submission
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import RecommendationForm from '../../src/components/RecommendationForm'

// Mock axios for API calls
const mock = new MockAdapter(axios)

describe('RecommendationForm Integration', () => {
  let mockApiResponse

  beforeEach(() => {
    // Setup mock API response
    mockApiResponse = {
      recommendation_id: 'test-rec-123',
      recommendations: [
        {
          configuration_id: 'config-456',
          name: 'Gaming PC Build',
          total_price: 1299.99,
          confidence_score: 85,
          match_reasons: [
            {
              factor: 'budget_fit',
              weight: 0.8,
              explanation: 'Configuration fits within budget constraints'
            }
          ],
          trade_offs: [],
          components: [
            {
              id: 'cpu-123',
              type: 'cpu',
              name: 'AMD Ryzen 5 5600X',
              brand: 'AMD',
              price: 199.99
            }
          ]
        }
      ],
      metadata: {
        algorithm_version: '1.0.0',
        processing_time_ms: 250,
        total_considered: 5
      },
      expires_at: '2025-12-19T10:00:00Z'
    }

    // Mock the API endpoint
    mock.onPost('/api/v1/recommendations').reply(200, mockApiResponse)
  })

  afterEach(() => {
    mock.reset()
  })

  const renderForm = () => {
    return render(
      <BrowserRouter>
        <RecommendationForm />
      </BrowserRouter>
    )
  }

  test('completes full recommendation workflow', async () => {
    renderForm()

    const user = userEvent.setup()

    // Fill out the form
    const purposeSelect = screen.getByLabelText(/purpose/i)
    await user.click(purposeSelect)
    await user.click(screen.getByText('Gaming'))

    const budgetMinInput = screen.getByLabelText(/minimum budget/i)
    const budgetMaxInput = screen.getByLabelText(/maximum budget/i)
    await user.clear(budgetMinInput)
    await user.type(budgetMinInput, '800')
    await user.clear(budgetMaxInput)
    await user.type(budgetMaxInput, '1500')

    const performanceSelect = screen.getByLabelText(/performance level/i)
    await user.click(performanceSelect)
    await user.click(screen.getByText('High'))

    // Add optional preferences
    const brandInput = screen.getByPlaceholderText(/preferred brands/i)
    await user.type(brandInput, 'NVIDIA, Intel')

    const featuresInput = screen.getByPlaceholderText(/required features/i)
    await user.type(featuresInput, 'ray tracing')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /get recommendations/i })
    await user.click(submitButton)

    // Wait for loading state
    expect(screen.getByText(/getting recommendations/i)).toBeInTheDocument()

    // Wait for results to appear
    await waitFor(() => {
      expect(screen.getByText('Gaming PC Build')).toBeInTheDocument()
    })

    // Verify recommendation details are displayed
    expect(screen.getByText('$1,299.99')).toBeInTheDocument()
    expect(screen.getByText('85%')).toBeInTheDocument()

    // Verify API was called with correct data
    expect(mock.history.post.length).toBe(1)
    const requestData = JSON.parse(mock.history.post[0].data)

    expect(requestData).toEqual({
      session_id: expect.any(String),
      purpose: 'gaming',
      budget: { min: 800, max: 1500 },
      performance_level: 'high',
      preferred_brands: ['NVIDIA', 'Intel'],
      must_have_features: ['ray tracing']
    })
  })

  test('handles API errors gracefully', async () => {
    // Mock API error
    mock.onPost('/api/v1/recommendations').reply(500, {
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Server error' }
    })

    renderForm()

    const user = userEvent.setup()

    // Fill and submit form
    const purposeSelect = screen.getByLabelText(/purpose/i)
    await user.click(purposeSelect)
    await user.click(screen.getByText('Gaming'))

    const budgetMinInput = screen.getByLabelText(/minimum budget/i)
    const budgetMaxInput = screen.getByLabelText(/maximum budget/i)
    await user.type(budgetMinInput, '800')
    await user.type(budgetMaxInput, '1500')

    const performanceSelect = screen.getByLabelText(/performance level/i)
    await user.click(performanceSelect)
    await user.click(screen.getByText('High'))

    const submitButton = screen.getByRole('button', { name: /get recommendations/i })
    await user.click(submitButton)

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/failed to get recommendations/i)).toBeInTheDocument()
    })
  })

  test('validates form inputs', async () => {
    renderForm()

    const user = userEvent.setup()

    // Try to submit without required fields
    const submitButton = screen.getByRole('button', { name: /get recommendations/i })
    await user.click(submitButton)

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/purpose is required/i)).toBeInTheDocument()
    })

    // Fill purpose but leave budget empty
    const purposeSelect = screen.getByLabelText(/purpose/i)
    await user.click(purposeSelect)
    await user.click(screen.getByText('Gaming'))

    await user.click(submitButton)

    // Should show budget validation errors
    await waitFor(() => {
      expect(screen.getByText(/budget is required/i)).toBeInTheDocument()
    })
  })

  test('handles network errors', async () => {
    // Mock network error
    mock.onPost('/api/v1/recommendations').networkError()

    renderForm()

    const user = userEvent.setup()

    // Fill minimal form
    const purposeSelect = screen.getByLabelText(/purpose/i)
    await user.click(purposeSelect)
    await user.click(screen.getByText('Gaming'))

    const budgetMinInput = screen.getByLabelText(/minimum budget/i)
    const budgetMaxInput = screen.getByLabelText(/maximum budget/i)
    await user.type(budgetMinInput, '800')
    await user.type(budgetMaxInput, '1500')

    const performanceSelect = screen.getByLabelText(/performance level/i)
    await user.click(performanceSelect)
    await user.click(screen.getByText('High'))

    const submitButton = screen.getByRole('button', { name: /get recommendations/i })
    await user.click(submitButton)

    // Should show network error message
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument()
    })
  })
})
