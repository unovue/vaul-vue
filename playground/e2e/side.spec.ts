import { expect, test } from '@playwright/test'
import { dragDrawer, openDrawer } from './helpers'

test.beforeEach(async ({ page }) => {
  page.goto('/test/side')
})

test.describe('Side tests', () => {
  test.describe('Side left', () => {
    test('dragging over should not close', async ({ page, viewport }) => {
      const [drawer, content] = await openDrawer(page, 'left')

      await dragDrawer(drawer, 'right', page, viewport)
      await expect(content).toBeVisible()
    })

    test('dragging under should close', async ({ page, viewport }) => {
      const [drawer, content] = await openDrawer(page, 'left')

      await dragDrawer(drawer, 'left', page, viewport)
      await expect(content).toBeHidden()
    })
  })

  test.describe('Side top', () => {
    test('dragging over should not close', async ({ page, viewport }) => {
      const [drawer, content] = await openDrawer(page, 'top')

      await dragDrawer(drawer, 'bottom', page, viewport)
      await expect(content).toBeVisible()
    })

    test('dragging under should close', async ({ page, viewport }) => {
      const [drawer, content] = await openDrawer(page, 'top')

      await dragDrawer(drawer, 'top', page, viewport)
      await expect(content).toBeHidden()
    })
  })

  test.describe('Side right', () => {
    test('dragging over should not close', async ({ page, viewport }) => {
      const [drawer, content] = await openDrawer(page, 'right')

      await dragDrawer(drawer, 'left', page, viewport)
      await expect(content).toBeVisible()
    })

    test('dragging under should close', async ({ page, viewport }) => {
      const [drawer, content] = await openDrawer(page, 'right')

      await dragDrawer(drawer, 'right', page, viewport)
      await expect(content).toBeHidden()
    })
  })

  test.describe('Side bottom', () => {
    test('dragging over should not close', async ({ page, viewport }) => {
      const [drawer, content] = await openDrawer(page, 'bottom')

      await dragDrawer(drawer, 'top', page, viewport)
      await expect(content).toBeVisible()
    })

    test('dragging under should close', async ({ page, viewport }) => {
      const [drawer, content] = await openDrawer(page, 'bottom')

      await dragDrawer(drawer, 'bottom', page, viewport)
      await expect(content).toBeHidden()
    })
  })
})
