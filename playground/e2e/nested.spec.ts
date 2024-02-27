import { expect, test } from '@playwright/test'
import { ANIMATION_DURATION } from './constants'
import { openDrawer } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/test/nested-drawer')
})

test.describe('Nested tests', () => {
  test('should open and close nested drawer', async ({ page }) => {
    await openDrawer(page)
    await page.getByTestId('nested-trigger').click()
    await page.waitForTimeout(ANIMATION_DURATION)
    await expect(page.getByTestId('nested-content')).toBeVisible()
    await page.getByTestId('nested-close').click()
    await page.waitForTimeout(ANIMATION_DURATION)
    await expect(page.getByTestId('nested-content')).not.toBeVisible()
    await expect(page.getByTestId('content')).toBeVisible()
  })
})
