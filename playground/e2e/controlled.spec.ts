import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/test/controlled')
})

test.describe('Controlled tests', () => {
  test('open and close using :open prop', async ({ page }) => {
    await page.getByTestId('trigger-open-prop').click()
    const closeButton = page.getByTestId('trigger-open-prop-close')

    await expect(closeButton).toBeVisible()
    await closeButton.click()

    await expect(closeButton).toBeHidden()
  })

  test('open and close using v-model', async ({ page }) => {
    await page.getByTestId('trigger-v-model').click()
    const closeButton = page.getByTestId('trigger-v-model-close')

    await expect(closeButton).toBeVisible()
    await closeButton.click()

    await expect(closeButton).toBeHidden()
  })
})
