import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('handles duplicate requests with caching', async ({ page }) => {
  // Clear localStorage before test
  await page.evaluate(() => localStorage.clear())

  // Make first request
  await page.fill('input[aria-label="Request Data"]', 'test data')
  await page.click('button:has-text("Send")')
  
  // Wait for success status
  await page.waitForSelector('text=success')

  // Make duplicate request
  await page.fill('input[aria-label="Request Data"]', 'test data')
  await page.click('button:has-text("Send")')

  // Wait for cached status
  await page.waitForSelector('text=cached')

  // Verify cache status
  const cacheStatus = await page.textContent('text=Cached Responses: 1')
  expect(cacheStatus).toBeTruthy()
})

test('handles offline functionality', async ({ page }) => {
  // Make request while online
  await page.fill('input[aria-label="Request Data"]', 'offline test')
  await page.click('button:has-text("Send")')
  await page.waitForSelector('text=success')

  // Simulate offline
  await page.route('**/*', route => route.abort())

  // Try duplicate request while offline
  await page.fill('input[aria-label="Request Data"]', 'offline test')
  await page.click('button:has-text("Send")')

  // Should use cached response
  await page.waitForSelector('text=cached')
})

test('handles different requests correctly', async ({ page }) => {
  // Clear localStorage
  await page.evaluate(() => localStorage.clear())

  // Make first request
  await page.fill('input[aria-label="Request Data"]', 'request 1')
  await page.click('button:has-text("Send")')
  await page.waitForSelector('text=success')

  // Make different request
  await page.fill('input[aria-label="Request Data"]', 'request 2')
  await page.click('button:has-text("Send")')
  await page.waitForSelector('text=success')

  // Verify both requests are in history
  const history = await page.textContent('text=Request History')
  expect(history).toContain('request 1')
  expect(history).toContain('request 2')
}) 