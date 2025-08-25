import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/test/nested-drawer')
})

test.describe('Nested tests', () => {
  test('should open and close nested drawer', async ({ page }) => {
    await page.getByTestId('trigger-1').click()
    await expect(page.getByTestId('content-nested-1')).toBeVisible()

    
    await page.getByTestId('trigger-2').click()
    await expect(page.getByTestId('content-nested-2')).toBeVisible()
  })
})
