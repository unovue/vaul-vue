import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/test/keep-mounted')
})

test.describe('Keep mounted', () => {
  test('should be in dom', async ({ page }) => {
    expect(page.getByTestId('content')).toBeDefined()
  })
})
