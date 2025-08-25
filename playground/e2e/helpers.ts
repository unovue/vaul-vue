import type { Locator, Page, ViewportSize } from '@playwright/test'
import { expect } from '@playwright/test'

export async function openDrawer(
  page: Page,
  side?: string
) {
  const triggerSelector = side ? `trigger-${side}` : 'trigger'
  const contentSelector = side ? `content-${side}` : 'content'

  const trigger = page.getByTestId(triggerSelector)
  await trigger.click()

  const content = page.getByTestId(contentSelector)
  await expect(content).toBeVisible()
  
  if (side) {
    await expect(content).toHaveText(side || 'bottom')
  }

  const drawer = page.locator('[data-vaul-drawer]')
  return [drawer, content]
}

export async function dragDrawer(
  drawer: Locator,
  side: string,
  page: Page,
  viewport: ViewportSize | null,
) {
  const width = (viewport?.width || 1920) + 10
  const height = (viewport?.height || 1080) + 10

  const modifier = side === 'left' || side === 'top'
    ? -1
    : 1

  const isVertical = side === 'top' || side === 'bottom'
  const offset = isVertical
    ? height * modifier
    : width * modifier

  await drawer.hover()
  await page.mouse.down()

  if (isVertical) {
    await page.mouse.move(0, offset)
  } else {
    await page.mouse.move(offset, 0)
  }

  await page.mouse.up()
}

// export async function dragWithSpeed(
//   page: Page,
//   selector: string,
//   startY: number,
//   endY: number,
//   speed: number = 10,
// ): Promise<void> {
//   const startX = 0;
//   const distance = Math.abs(endY - startY);
//   const steps = distance / speed;
//   const delayPerStep = 10; // in milliseconds
//   const yOffset = (endY - startY) / steps;
//
//   await page.hover(selector);
//   await page.mouse.down();
//   await page.mouse.move(0, -200);
//   await page.mouse.up();
// }
