import { expect, test } from '@playwright/test'
import { ANIMATION_DURATION } from './constants'
import { openDrawer } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/test/non-dismissible')
})

test.describe('Non-dismissible', () => {
  test('should not close on background interaction', async ({ page }) => {
    await openDrawer(page)
    // Click on the background
    await page.mouse.click(0, 0)
    await page.waitForTimeout(ANIMATION_DURATION)
    await expect(page.getByTestId('content')).toBeVisible()
  })

  test('should not close when dragged down', async ({ page }) => {
    await openDrawer(page)
    await page.hover('[data-vaul-drawer]')
    await page.mouse.down()
    await page.mouse.move(0, 800)
    await page.mouse.up()
    await page.waitForTimeout(ANIMATION_DURATION)
    await expect(page.getByTestId('content')).toBeVisible()
  })

  test('should close when the dismiss button is clicked', async ({ page }) => {
    await openDrawer(page)

    await page.getByTestId('trigger-dismiss').click()
    await expect(page.getByTestId('content')).toBeHidden()
  })
})
