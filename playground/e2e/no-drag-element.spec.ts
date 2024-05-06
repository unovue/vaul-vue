import { expect, test } from '@playwright/test'
import { openDrawer } from './helpers'
import { ANIMATION_DURATION } from './constants'

test.beforeEach(async ({ page }) => {
  await page.goto('/test/no-drag-element')
})

test.describe('No drag element', () => {
  test('should close when dragged down', async ({ page }) => {
    await openDrawer(page)
    await page.hover('[data-testid=handler]')
    await page.mouse.down()
    await page.mouse.move(0, 500)
    await page.mouse.up()
    await page.waitForTimeout(ANIMATION_DURATION)
    await expect(page.getByTestId('content')).not.toBeVisible()
  })

  test('should not close when dragged down', async ({ page }) => {
    await openDrawer(page)
    await page.hover('[data-vaul-no-drag]')
    await page.mouse.down()
    await page.mouse.move(0, 500)
    await page.mouse.up()
    await page.waitForTimeout(ANIMATION_DURATION)
    await expect(page.getByTestId('content')).toBeVisible()
  })
})
