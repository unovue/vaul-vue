import { test } from '@playwright/test'
import { dragDrawer, openDrawer } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/test/no-drag-element')
})

test.describe('No drag element', () => {
  test('should close when dragged down', async ({ page, viewport }) => {
    await openDrawer(page)

    await dragDrawer(
      page.getByTestId('drag'),
      'bottom',
      page,
      viewport
    )
  })

  test('should not close when dragged down', async ({ page, viewport }) => {
    await openDrawer(page)

    await dragDrawer(
      page.locator('[data-vaul-no-drag]'),
      'bottom',
      page,
      viewport
    )
  })
})
