import { expect, test } from '@playwright/test'
import { openDrawer } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/test/initial-snap')
})

test.describe('Initial-snap', () => {
  test('should be open and snapped on initial load', async ({ page }) => {
    await openDrawer(page)

    const activeSnapIndex = page.getByTestId('active-snap-index')
    const triggerActiveSnapIndex = page.getByTestId('change-snap-index')

    await expect(activeSnapIndex).toHaveText('0')
    await triggerActiveSnapIndex.click()
    await expect(activeSnapIndex).toHaveText('1')
  })
})
