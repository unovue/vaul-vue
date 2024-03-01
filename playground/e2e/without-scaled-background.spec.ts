import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/test/without-scaled-background')
})

test.describe('Without scaled background', () => {
  test('should not scale background', async ({ page }) => {
    await expect(page.locator('[vaul-drawer-wrapper]')).not.toHaveCSS('transform', '')

    await page.getByTestId('trigger').click()

    await expect(page.locator('[vaul-drawer-wrapper]')).not.toHaveCSS('transform', '')
  })
})
