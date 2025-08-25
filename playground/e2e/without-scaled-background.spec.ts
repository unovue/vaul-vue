import { expect, test } from '@playwright/test'
import { openDrawer } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/test/without-scale-background')
})

test.describe('Without scaled background', () => {
  test('should not scale background', async ({ page }) => {
    const wrapper = page.locator('[data-vaul-drawer-wrapper]')

    await expect(wrapper).not.toHaveCSS('transform', '')
    await openDrawer(page)
    await expect(wrapper).not.toHaveCSS('transform', '')
  })
})
