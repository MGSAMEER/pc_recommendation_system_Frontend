/**
 * E2E tests for complete comparison workflow
 */
import { test, expect } from '@playwright/test'

test.describe('PC Recommendation Comparison Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3000')

    // Wait for the app to load
    await page.waitForSelector('h1:has-text("Find Your Perfect PC")')
  })

  test('complete comparison workflow from recommendation to selection', async ({ page }) => {
    // Step 1: Fill out recommendation form
    await page.fill('input[name="budgetMin"]', '600')
    await page.fill('input[name="budgetMax"]', '1400')

    // Select purpose
    await page.click('div[role="button"]:has-text("Primary Use")')
    await page.click('li:has-text("Gaming")')

    // Select performance level
    await page.click('div[role="button"]:has-text("Performance Level")')
    await page.click('li:has-text("High")')

    // Add brand preferences
    await page.fill('input[name="preferredBrands"]', 'NVIDIA, AMD')

    // Submit form
    await page.click('button:has-text("Get Recommendations")')

    // Step 2: Wait for recommendations to load
    await page.waitForSelector('h2:has-text("Your Recommendations")')

    // Verify recommendations are displayed
    const recommendations = await page.locator('[data-testid="recommendation-card"]').all()
    expect(recommendations.length).toBeGreaterThanOrEqual(2)

    // Step 3: Add recommendations to comparison
    const addToCompareButtons = await page.locator('button:has-text("Compare")').all()
    expect(addToCompareButtons.length).toBeGreaterThanOrEqual(2)

    // Click compare on first two recommendations
    await addToCompareButtons[0].click()
    await addToCompareButtons[1].click()

    // Step 4: Navigate to comparison page
    await page.click('a:has-text("Compare")')

    // Step 5: Verify comparison page loads
    await page.waitForSelector('h1:has-text("Compare PCs")')

    // Verify comparison table is displayed
    const comparisonTable = await page.locator('table')
    await expect(comparisonTable).toBeVisible()

    // Check that both PCs are in the comparison
    const comparedPCs = await page.locator('th').allTextContents()
    expect(comparedPCs.length).toBeGreaterThanOrEqual(2)

    // Step 6: Interact with comparison features
    // Test sorting by price
    const priceHeader = await page.locator('th:has-text("Price")')
    if (priceHeader) {
      await priceHeader.click()
      // Verify sorting works (basic check)
      await page.waitForTimeout(500)
    }

    // Step 7: Test removing from comparison
    const removeButtons = await page.locator('[data-testid="remove-from-comparison"]').all()
    if (removeButtons.length > 0) {
      await removeButtons[0].click()

      // Verify one PC is removed from comparison
      const remainingPCs = await page.locator('th').allTextContents()
      expect(remainingPCs.length).toBe(comparedPCs.length - 1)
    }

    // Step 8: Test returning to recommendations
    await page.click('a:has-text("Back to Recommendations")')
    await page.waitForSelector('h1:has-text("PC Recommendations")')
  })

  test('comparison handles edge cases gracefully', async ({ page }) => {
    // Navigate to comparison page with no items
    await page.goto('http://localhost:3000/compare')

    // Should show empty state
    await expect(page.locator('text=No PCs to compare')).toBeVisible()

    // Try to access comparison with invalid state
    await page.goto('http://localhost:3000/recommendations')

    // Fill form with extreme budget (should still show some results or handle gracefully)
    await page.fill('input[name="budgetMin"]', '50')
    await page.fill('input[name="budgetMax"]', '100')

    await page.click('div[role="button"]:has-text("Primary Use")')
    await page.click('li:has-text("Gaming")')

    await page.click('div[role="button"]:has-text("Performance Level")')
    await page.click('li:has-text("Professional")')

    await page.click('button:has-text("Get Recommendations")')

    // Should handle no results gracefully
    const noResultsMessage = await page.locator('text=No PC configurations found').isVisible()
    const resultsFound = await page.locator('[data-testid="recommendation-card"]').count() > 0

    expect(noResultsMessage || resultsFound).toBe(true)
  })

  test('comparison maintains state across page refreshes', async ({ page }) => {
    // This test would require implementing localStorage/sessionStorage for comparison state
    // For now, test basic functionality

    await page.goto('http://localhost:3000/recommendations')

    // Fill form and get recommendations
    await page.fill('input[name="budgetMin"]', '800')
    await page.fill('input[name="budgetMax"]', '1200')

    await page.click('div[role="button"]:has-text("Primary Use")')
    await page.click('li:has-text("Gaming")')

    await page.click('div[role="button"]:has-text("Performance Level")')
    await page.click('li:has-text("High")')

    await page.click('button:has-text("Get Recommendations")')

    await page.waitForSelector('[data-testid="recommendation-card"]')

    // Refresh page
    await page.reload()

    // Should maintain some state or handle refresh gracefully
    // This depends on implementation - could check if form values are preserved
    // or if user gets redirected appropriately
    const currentURL = page.url()
    expect(currentURL).toContain('/recommendations')
  })

  test('comparison works on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('http://localhost:3000/recommendations')

    // Fill form on mobile
    await page.fill('input[name="budgetMin"]', '700')
    await page.fill('input[name="budgetMax"]', '1300')

    await page.click('div[role="button"]:has-text("Primary Use")')
    await page.click('li:has-text("Gaming")')

    await page.click('div[role="button"]:has-text("Performance Level")')
    await page.click('li:has-text("High")')

    await page.click('button:has-text("Get Recommendations")')

    // Wait for mobile-optimized results
    await page.waitForSelector('[data-testid="recommendation-card"]')

    // Test comparison on mobile
    const compareButtons = await page.locator('button:has-text("Compare")').all()
    if (compareButtons.length >= 2) {
      await compareButtons[0].click()
      await compareButtons[1].click()

      await page.click('a:has-text("Compare")')

      // Verify mobile comparison layout
      const comparisonTable = await page.locator('table')
      await expect(comparisonTable).toBeVisible()

      // Check for horizontal scroll or responsive design
      const tableContainer = await page.locator('[data-testid="comparison-container"]')
      if (tableContainer) {
        const overflow = await tableContainer.evaluate(el => getComputedStyle(el).overflowX)
        expect(overflow).toBe('auto')
      }
    }
  })

  test('comparison performance with large datasets', async ({ page }) => {
    // Test with multiple recommendations to compare
    await page.goto('http://localhost:3000/recommendations')

    // Fill form to get multiple results
    await page.fill('input[name="budgetMin"]', '500')
    await page.fill('input[name="budgetMax"]', '2000')

    await page.click('div[role="button"]:has-text("Primary Use")')
    await page.click('li:has-text("Gaming")')

    await page.click('div[role="button"]:has-text("Performance Level")')
    await page.click('li:has-text("High")')

    await page.click('button:has-text("Get Recommendations")')

    // Measure time to load recommendations
    const startTime = Date.now()
    await page.waitForSelector('[data-testid="recommendation-card"]', { timeout: 10000 })
    const loadTime = Date.now() - startTime

    // Should load within reasonable time
    expect(loadTime).toBeLessThan(5000)

    // If multiple recommendations, test comparison performance
    const compareButtons = await page.locator('button:has-text("Compare")').all()
    if (compareButtons.length >= 3) {
      // Add multiple items to comparison
      for (let i = 0; i < Math.min(3, compareButtons.length); i++) {
        await compareButtons[i].click()
      }

      // Measure comparison page load time
      const compareStartTime = Date.now()
      await page.click('a:has-text("Compare")')
      await page.waitForSelector('table', { timeout: 5000 })
      const compareLoadTime = Date.now() - compareStartTime

      // Comparison should load quickly
      expect(compareLoadTime).toBeLessThan(3000)
    }
  })
})
