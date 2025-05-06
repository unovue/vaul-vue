import { expect, test } from '@playwright/test'
import { openDrawer } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/test/with-scaled-background')
})

test.describe('With scaled background', () => {
  test('should scale background', async ({ page }) => {
    await expect(page.locator('[data-vaul-drawer-wrapper]')).not.toHaveCSS('--vaul-closed-percentage', '1')

    await page.getByTestId('trigger').click()

    await expect(page.locator('[data-vaul-drawer-wrapper]')).toHaveCSS('--vaul-closed-percentage', '0')
  })

  test('should scale background when dragging', async ({ page }) => {
    await expect(page.locator('[data-vaul-drawer-wrapper]')).not.toHaveCSS('--vaul-closed-percentage', '1')

    await openDrawer(page)

    await page.hover('[data-vaul-drawer]')
    await page.mouse.down()
    await page.mouse.move(0, 100)

    await expect(page.locator('[data-vaul-drawer-wrapper]')).toHaveCSS('--vaul-closed-percentage', /0(.*)*/)

    await page.mouse.up()

    await expect(page.locator('[data-vaul-drawer-wrapper]')).not.toHaveCSS('--vaul-closed-percentage', '1')
  })
})
