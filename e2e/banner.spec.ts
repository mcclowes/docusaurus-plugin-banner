import { test, expect } from '@playwright/test'

test.describe('Banner Plugin', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test.describe('Banner Display', () => {
    test('should render the banner with correct content', async ({ page }) => {
      await page.goto('/')

      // Check that banner is visible
      const banner = page.locator('[role="banner"]')
      await expect(banner).toBeVisible()

      // Check content
      await expect(banner).toContainText('Welcome to the Banner Plugin example site!')
    })

    test('should display banner with correct background color', async ({ page }) => {
      await page.goto('/')

      const banner = page.locator('[role="banner"]')
      await expect(banner).toBeVisible()

      // Check background color
      const backgroundColor = await banner.evaluate((el) =>
        window.getComputedStyle(el).backgroundColor
      )
      // #3b82f6 = rgb(59, 130, 246)
      expect(backgroundColor).toBe('rgb(59, 130, 246)')
    })

    test('should display banner with correct text color', async ({ page }) => {
      await page.goto('/')

      const banner = page.locator('[role="banner"]')
      await expect(banner).toBeVisible()

      // Check text color
      const color = await banner.evaluate((el) =>
        window.getComputedStyle(el).color
      )
      // #ffffff = rgb(255, 255, 255)
      expect(color).toBe('rgb(255, 255, 255)')
    })
  })

  test.describe('Banner Dismissal', () => {
    test('should show dismiss button when dismissible', async ({ page }) => {
      await page.goto('/')

      const closeButton = page.locator('[role="banner"] button[aria-label="Dismiss banner"]')
      await expect(closeButton).toBeVisible()
    })

    test('should dismiss banner when close button is clicked', async ({ page }) => {
      await page.goto('/')

      const banner = page.locator('[role="banner"]')
      await expect(banner).toBeVisible()

      // Click dismiss button
      const closeButton = page.locator('button[aria-label="Dismiss banner"]')
      await closeButton.click()

      // Wait for animation
      await page.waitForTimeout(400)

      // Banner should be hidden
      await expect(banner).not.toBeVisible()
    })

    test('should persist dismissal in localStorage', async ({ page }) => {
      await page.goto('/')

      // Click dismiss button
      const closeButton = page.locator('button[aria-label="Dismiss banner"]')
      await closeButton.click()

      // Wait for animation and localStorage update
      await page.waitForTimeout(400)

      // Check localStorage
      const dismissed = await page.evaluate(() =>
        localStorage.getItem('docusaurus-banner-dismissed-welcome')
      )
      expect(dismissed).toBe('true')
    })

    test('should stay dismissed after page reload', async ({ page }) => {
      await page.goto('/')

      // Dismiss the banner
      const closeButton = page.locator('button[aria-label="Dismiss banner"]')
      await closeButton.click()
      await page.waitForTimeout(400)

      // Reload page
      await page.reload()

      // Banner should still be hidden
      const banner = page.locator('[role="banner"]')
      await expect(banner).not.toBeVisible()
    })

    test('should show banner again after clearing localStorage', async ({ page }) => {
      await page.goto('/')

      // Dismiss the banner
      const closeButton = page.locator('button[aria-label="Dismiss banner"]')
      await closeButton.click()
      await page.waitForTimeout(400)

      // Clear localStorage
      await page.evaluate(() => localStorage.clear())

      // Reload page
      await page.reload()

      // Banner should be visible again
      const banner = page.locator('[role="banner"]')
      await expect(banner).toBeVisible()
    })
  })

  test.describe('Banner Accessibility', () => {
    test('should have correct ARIA attributes', async ({ page }) => {
      await page.goto('/')

      const banner = page.locator('[role="banner"]')
      await expect(banner).toHaveAttribute('aria-label', 'Site banner')
    })

    test('dismiss button should have accessible label', async ({ page }) => {
      await page.goto('/')

      const closeButton = page.locator('button[aria-label="Dismiss banner"]')
      await expect(closeButton).toBeVisible()
      await expect(closeButton).toHaveAttribute('type', 'button')
    })
  })
})
