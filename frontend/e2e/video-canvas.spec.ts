import { test, expect } from '@playwright/test';

test.describe('VideoCanvas', () => {
  test('canvas element exists', async ({ page }) => {
    await page.goto('/');
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('canvas has expected dimensions', async ({ page }) => {
    await page.goto('/');
    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    expect(box?.width).toBeGreaterThan(0);
    expect(box?.height).toBeGreaterThan(0);
  });
});
