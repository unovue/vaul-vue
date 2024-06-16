import { expect, test } from '@playwright/test'
import { ANIMATION_DURATION } from './constants'
import { openDrawer } from './helpers'

test.describe('Direction tests', () => {
  test.describe('direction - bottom (default)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/test/direction')
    })

    test('should close when dragged down', async ({ page }) => {
      await openDrawer(page)
      await page.hover('[vaul-drawer]')
      await page.mouse.down()
      await page.mouse.move(0, 600)
      await page.mouse.up()
      await page.waitForTimeout(ANIMATION_DURATION)
      await expect(page.getByTestId('content')).not.toBeVisible()
    })

    test('should not close when dragged up', async ({ page }) => {
      await openDrawer(page)
      await page.hover('[vaul-drawer]')
      await page.mouse.down()
      await page.mouse.move(0, -600)
      await page.mouse.up()
      await page.waitForTimeout(ANIMATION_DURATION)
      await expect(page.getByTestId('content')).toBeVisible()
    })
  })

  test.describe('direction - left', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/test/direction?direction=left')
    })

    test('should close when dragged left', async ({ page }) => {
      await openDrawer(page)
      await page.hover('[vaul-drawer]')
      await page.mouse.down()
      await page.mouse.move(200, 0)
      await page.mouse.up()
      await page.waitForTimeout(ANIMATION_DURATION)
      await expect(page.getByTestId('content')).not.toBeVisible()
    })

    test('should not close when dragged right', async ({ page }) => {
      await openDrawer(page)
      await page.hover('[vaul-drawer]')
      await page.mouse.down()
      await page.mouse.move(800, 0)
      await page.mouse.up()
      await page.waitForTimeout(ANIMATION_DURATION)
      await expect(page.getByTestId('content')).toBeVisible()
    })
  })

  test.describe('direction - right', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/test/direction?direction=right')
    })

    test('should close when dragged right', async ({ page }) => {
      await openDrawer(page)
      await page.hover('[vaul-drawer]')
      await page.mouse.down()
      await page.mouse.move(1200, 0)
      await page.mouse.up()
      await page.waitForTimeout(ANIMATION_DURATION)
      await expect(page.getByTestId('content')).not.toBeVisible()
    })

    test('should not close when dragged left', async ({ page }) => {
      await openDrawer(page)
      await page.hover('[vaul-drawer]')
      await page.mouse.down()
      await page.mouse.move(-1200, 0)
      await page.mouse.up()
      await page.waitForTimeout(ANIMATION_DURATION)
      await expect(page.getByTestId('content')).toBeVisible()
    })
  })

  test.describe('direction - top', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/test/direction?direction=top')
    })

    test('should close when dragged top', async ({ page }) => {
      await openDrawer(page)
      await page.hover('[vaul-drawer]')
      await page.mouse.down()
      await page.mouse.move(0, 100)
      await page.mouse.up()
      await page.waitForTimeout(ANIMATION_DURATION)
      await expect(page.getByTestId('content')).not.toBeVisible()
    })

    test('should not close when dragged down', async ({ page }) => {
      await openDrawer(page)
      await page.hover('[vaul-drawer]')
      await page.mouse.down()
      await page.mouse.move(0, 600)
      await page.mouse.up()
      await page.waitForTimeout(ANIMATION_DURATION)
      await expect(page.getByTestId('content')).toBeVisible()
    })
  })
})
