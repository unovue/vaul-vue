import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

export async function openDrawer(page: Page) {
  const contentElement = page.getByTestId('content')
  await expect(contentElement).not.toBeVisible()

  await page.getByTestId('trigger').click()

  await expect(contentElement).toBeVisible()
  return contentElement
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
