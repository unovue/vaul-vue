import { expect, test } from '@playwright/test'
import { openDrawer } from './helpers'

test.beforeEach(async ({ page }) => {
  page.goto('/')
})

test.describe('Gesture Tests', async () => {
  test('should closed when dragged down', async ({ page }) => {
    const contentElement = await openDrawer(page)

    await contentElement.hover({ position: { x: 0, y: 0 } })
    await page.mouse.down()

    await page.mouse.move(0, 800)
    await page.mouse.up()

    await expect(contentElement).toBeHidden()
  })

  test('should not close when dragging up', async ({ page }) => {
    const contentElement = await openDrawer(page)

    await contentElement.hover({ position: { x: 0, y: 0 } })
    await page.mouse.down()

    await page.mouse.move(0, -500)
    await page.mouse.up()

    await expect(contentElement).toBeVisible()
  })
})
