import { expect, test } from '@playwright/test'
import { openDrawer } from './helpers'

test.beforeEach(async ({ page }) => {
  page.goto('/')
})

test.describe('Base tests', () => {
  test('should open drawer', async ({ page }) => {
    page.goto('/')

    await expect(page.getByTestId('content')).not.toBeVisible()
    await page.getByTestId('trigger').click()
    await expect(page.getByTestId('content')).toBeVisible()
  })

  test('should close drawer on background interaction', async ({ page }) => {
    const contentElement = await openDrawer(page)

    await page.mouse.click(10, 10)
    await expect(contentElement).toBeHidden()
  })

  test('should close drawer using v-slot close function called', async ({ page }) => {
    const contentElement = await openDrawer(page)

    await page.getByTestId('close-button').click()
    await expect(contentElement).toBeHidden()
  })
})

// test.beforeEach(async ({ page }) => {
//   await page.goto('/test/without-scaled-background')
// })

// test.describe('Base tests', () => {
//   test('should open drawer', async ({ page }) => {
//     await expect(page.getByTestId('content')).not.toBeVisible()

//     await page.getByTestId('trigger').click()

//     await expect(page.getByTestId('content')).toBeVisible()
//   })

//   test('should close on background interaction', async ({ page }) => {
//     await openDrawer(page)
//     // Click on the background
//     await page.mouse.click(0, 0)

//     await page.waitForTimeout(ANIMATION_DURATION)
//     await expect(page.getByTestId('content')).not.toBeVisible()
//   })

//   test('should close when `Drawer.Close` is clicked', async ({ page }) => {
//     await openDrawer(page)

//     await page.getByTestId('drawer-close').click()
//     await page.waitForTimeout(ANIMATION_DURATION)
//     await expect(page.getByTestId('content')).not.toBeVisible()
//   })

//   test('should close when controlled', async ({ page }) => {
//     await openDrawer(page)

//     await page.getByTestId('controlled-close').click()
//     await page.waitForTimeout(ANIMATION_DURATION)
//     await expect(page.getByTestId('content')).not.toBeVisible()
//   })

//   test('should close when dragged down', async ({ page }) => {
//     await openDrawer(page)
//     await page.hover('[data-vaul-drawer]')
//     await page.mouse.down()
//     await page.mouse.move(0, 500)
//     await page.mouse.up()
//     await page.waitForTimeout(ANIMATION_DURATION)
//     await expect(page.getByTestId('content')).not.toBeVisible()
//   })

//   test('should not close when dragged up', async ({ page }) => {
//     await openDrawer(page)
//     await page.hover('[data-vaul-drawer]')
//     await page.mouse.down()
//     await page.mouse.move(0, -500)
//     await page.mouse.up()
//     await page.waitForTimeout(ANIMATION_DURATION)
//     await expect(page.getByTestId('content')).toBeVisible()
//   })
// })
